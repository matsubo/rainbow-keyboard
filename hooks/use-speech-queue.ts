import { useCallback, useEffect, useRef } from "react"

const MAX_QUEUE = 3

// Encapsulates Web Speech API usage: a small queue (so rapid presses don't
// overlap), language-aware voice selection, and an iOS audio-unlock helper.
export function useSpeechQueue(lang: string) {
  const queue = useRef<string[]>([])
  const speaking = useRef(false)
  const langRef = useRef(lang)
  langRef.current = lang
  const voices = useRef<SpeechSynthesisVoice[]>([])

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return
    const synth = window.speechSynthesis
    const loadVoices = () => {
      voices.current = synth.getVoices()
    }
    loadVoices() // some browsers populate synchronously
    synth.addEventListener("voiceschanged", loadVoices)
    return () => {
      synth.removeEventListener("voiceschanged", loadVoices)
      synth.cancel()
    }
  }, [])

  // Best matching voice for a BCP-47 tag: exact, then same base language.
  const pickVoice = (tag: string): SpeechSynthesisVoice | null => {
    const lower = tag.toLowerCase()
    const base = lower.split("-")[0]
    return (
      voices.current.find((v) => v.lang.toLowerCase() === lower) ??
      voices.current.find((v) => v.lang.toLowerCase().startsWith(base)) ??
      null
    )
  }

  const process = useCallback(() => {
    const synth = window.speechSynthesis
    if (!synth || speaking.current || queue.current.length === 0) return

    speaking.current = true
    const text = queue.current.shift() as string
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = langRef.current
    const voice = pickVoice(langRef.current)
    if (voice) utterance.voice = voice

    const advance = () => {
      speaking.current = false
      process()
    }
    utterance.onend = advance
    utterance.onerror = advance

    synth.speak(utterance)
  }, [])

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !window.speechSynthesis) return
      if (queue.current.length < MAX_QUEUE) {
        queue.current.push(text)
        process()
      }
    },
    [process],
  )

  // iOS Safari blocks speech until it happens inside a user gesture. Call this
  // from a tap handler once to "unlock" subsequent programmatic speech.
  const unlock = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(""))
  }, [])

  const cancel = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return
    queue.current = []
    speaking.current = false
    window.speechSynthesis.cancel()
  }, [])

  return { speak, unlock, cancel }
}
