"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Volume2, VolumeX } from "lucide-react"
import type { Dictionary } from "@/lib/dictionaries"
import { trackKeyPress, trackKeyboardSession } from "@/lib/gtm"
import { mapKey, getKeyType, randomColor, randomPosition } from "@/lib/keys"
import { useHasTouch } from "@/hooks/use-has-touch"
import { useSpeechQueue } from "@/hooks/use-speech-queue"
import OnScreenKeyboard from "@/components/on-screen-keyboard"

// How many letters can be on screen at once, and how long each lingers.
const MAX_LETTERS = 8
const LETTER_TTL_MS = 1200

interface Letter {
  id: number
  char: string
  color: string
  x: number
  y: number
}

interface KeyboardDisplayProps {
  dictionary: Dictionary
  speechLang: string
}

export default function KeyboardDisplay({ dictionary, speechLang }: KeyboardDisplayProps) {
  const [letters, setLetters] = useState<Letter[]>([])
  const [muted, setMuted] = useState(false)
  const [started, setStarted] = useState(false)

  const hasTouch = useHasTouch()
  const { speak, unlock, cancel } = useSpeechQueue(speechLang)

  const nextId = useRef(0)
  const mutedRef = useRef(muted)
  mutedRef.current = muted
  const sessionStartTime = useRef<number>(Date.now())
  const totalKeysPressed = useRef<number>(0)

  // Shared pipeline for both physical and on-screen key presses.
  const activateKey = useCallback(
    (rawKey: string) => {
      const mapped = mapKey(rawKey)
      if (!mapped) return

      const id = nextId.current++
      const { x, y } = randomPosition()
      const letter: Letter = { id, char: mapped.display, color: randomColor(), x, y }

      setLetters((prev) => [...prev, letter].slice(-MAX_LETTERS))
      window.setTimeout(() => {
        setLetters((prev) => prev.filter((l) => l.id !== id))
      }, LETTER_TTL_MS)

      trackKeyPress(mapped.display, getKeyType(mapped.display))
      totalKeysPressed.current += 1

      if (!mutedRef.current) speak(mapped.speech)
    },
    [speak],
  )

  useEffect(() => {
    const sessionInterval = setInterval(() => {
      if (totalKeysPressed.current > 0) {
        const sessionDuration = Math.floor((Date.now() - sessionStartTime.current) / 1000)
        trackKeyboardSession(totalKeysPressed.current, sessionDuration)
      }
    }, 30000)

    const handleKeyDown = (event: KeyboardEvent) => activateKey(event.key)
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      clearInterval(sessionInterval)
      window.removeEventListener("keydown", handleKeyDown)
      if (totalKeysPressed.current > 0) {
        const sessionDuration = Math.floor((Date.now() - sessionStartTime.current) / 1000)
        trackKeyboardSession(totalKeysPressed.current, sessionDuration)
      }
    }
  }, [activateKey])

  const toggleMute = () => {
    setMuted((prev) => {
      const next = !prev
      if (next) cancel()
      return next
    })
  }

  // Touch devices need a user gesture to unlock audio; desktop keypresses
  // already count as a gesture, so no overlay is shown there.
  const needsStart = hasTouch && !started
  const handleStart = () => {
    unlock()
    setStarted(true)
  }

  return (
    <div className="relative flex h-[100dvh] min-h-[100dvh] w-full select-none items-center justify-center overflow-hidden bg-black [touch-action:manipulation]">
      <AnimatePresence>
        {letters.map((letter) => (
          <motion.div
            key={letter.id}
            initial={{ opacity: 1, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.8 }}
            className={`pointer-events-none absolute text-center text-[clamp(6rem,38vw,400px)] font-bold leading-none ${letter.color}`}
            style={{
              top: `${letter.y}%`,
              left: `${letter.x}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {letter.char}
          </motion.div>
        ))}
      </AnimatePresence>

      {letters.length === 0 && !needsStart && (
        <p className="px-4 text-center text-2xl text-gray-500">{dictionary.keyboardPlaceholder}</p>
      )}

      <button
        type="button"
        onClick={toggleMute}
        aria-pressed={muted}
        aria-label={muted ? dictionary.unmute : dictionary.mute}
        className="fixed right-4 top-4 z-30 rounded-full bg-gray-800/70 p-3 text-gray-300 [touch-action:manipulation] hover:text-white"
      >
        {muted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
      </button>

      {hasTouch && started && <OnScreenKeyboard onKeyTap={activateKey} />}

      {needsStart && (
        <button
          type="button"
          onClick={handleStart}
          className="absolute inset-0 z-40 flex items-center justify-center bg-black/90 px-6 text-center text-3xl font-bold text-white [touch-action:manipulation]"
        >
          {dictionary.tapToStart}
        </button>
      )}
    </div>
  )
}
