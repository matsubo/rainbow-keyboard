"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { Dictionary } from "@/lib/dictionaries" // Import the Dictionary type
import { trackKeyPress, trackKeyboardSession } from "@/lib/gtm"
import { useIsMobile } from "@/hooks/use-mobile"
import OnScreenKeyboard from "@/components/on-screen-keyboard"

// Array of vibrant colors for better visibility
const colors = [
  "text-red-500",
  "text-blue-500",
  "text-green-500",
  "text-yellow-500",
  "text-purple-500",
  "text-pink-500",
  "text-indigo-500",
  "text-cyan-500",
  "text-orange-500",
  "text-lime-500",
  "text-emerald-500",
  "text-teal-500",
  "text-violet-500",
  "text-fuchsia-500",
  "text-rose-500",
]

// Special keys mapped to their on-screen glyph and spoken word.
const SPECIAL_KEYS: Record<string, { display: string; speech: string }> = {
  " ": { display: "SPACE", speech: "space" },
  Enter: { display: "ENTER", speech: "enter" },
  Backspace: { display: "BACKSPACE", speech: "backspace" },
  Escape: { display: "ESC", speech: "escape" },
  ArrowUp: { display: "↑", speech: "up" },
  ArrowDown: { display: "↓", speech: "down" },
  ArrowLeft: { display: "←", speech: "left" },
  ArrowRight: { display: "→", speech: "right" },
  Tab: { display: "TAB", speech: "tab" },
  Control: { display: "CTRL", speech: "control" },
  Alt: { display: "ALT", speech: "alt" },
  Shift: { display: "SHIFT", speech: "shift" },
}

// Pure mapping from a raw KeyboardEvent.key (or on-screen key) to what we
// display and speak. Returns null for keys we intentionally ignore.
function mapKey(rawKey: string): { display: string; speech: string } | null {
  if (rawKey in SPECIAL_KEYS) return SPECIAL_KEYS[rawKey]
  if (rawKey.length > 1) return null // Skip other multi-char keys (F1, etc.)
  const display = rawKey.toUpperCase()
  return { display, speech: display.toLowerCase() }
}

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)]
}

// Determine key type for analytics
function getKeyType(key: string): "letter" | "number" | "special" | "modifier" {
  if (/^[A-Z]$/.test(key)) return "letter"
  if (/^[0-9]$/.test(key)) return "number"
  if (["CTRL", "ALT", "SHIFT"].includes(key)) return "modifier"
  return "special"
}

interface KeyboardDisplayProps {
  dictionary: Dictionary
  speechLang: string
}

export default function KeyboardDisplay({ dictionary, speechLang }: KeyboardDisplayProps) {
  const [pressedKey, setPressedKey] = useState<string | null>(null)
  const [keyId, setKeyId] = useState(0)
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [textColor, setTextColor] = useState("text-white")
  const isMobile = useIsMobile()

  // Session tracking
  const sessionStartTime = useRef<number>(Date.now())
  const totalKeysPressed = useRef<number>(0)

  // Speech queue system
  const speechQueue = useRef<string[]>([])
  const isSpeaking = useRef(false)
  const speechLangRef = useRef(speechLang)
  speechLangRef.current = speechLang

  // Process the speech queue
  const processSpeechQueue = useCallback(() => {
    if (speechQueue.current.length === 0 || isSpeaking.current) {
      return
    }

    isSpeaking.current = true
    const text = speechQueue.current.shift() as string
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = speechLangRef.current // Pronounce in the page's language

    utterance.onend = () => {
      isSpeaking.current = false
      processSpeechQueue() // Process next item in queue
    }

    utterance.onerror = () => {
      isSpeaking.current = false
      processSpeechQueue() // Process next item in queue even if there's an error
    }

    window.speechSynthesis.speak(utterance)
  }, [])

  // Add to speech queue and process, but limit to max 3 items
  const queueSpeech = useCallback(
    (text: string) => {
      if (speechQueue.current.length < 3) {
        speechQueue.current.push(text)
        processSpeechQueue()
      }
    },
    [processSpeechQueue],
  )

  // Shared activation pipeline for both physical and on-screen key presses.
  const activateKey = useCallback(
    (rawKey: string) => {
      const mapped = mapKey(rawKey)
      if (!mapped) return

      const newX = Math.random() * 70
      const newY = Math.random() * 70 - 30
      const newColor = getRandomColor()

      trackKeyPress(mapped.display, getKeyType(mapped.display))
      totalKeysPressed.current += 1

      queueSpeech(mapped.speech)

      setKeyId((prevId) => prevId + 1)
      setPressedKey(mapped.display)
      setPosition({ x: newX, y: newY })
      setTextColor(newColor)
    },
    [queueSpeech],
  )

  useEffect(() => {
    // Send session statistics every 30 seconds
    const sessionInterval = setInterval(() => {
      if (totalKeysPressed.current > 0) {
        const sessionDuration = Math.floor((Date.now() - sessionStartTime.current) / 1000)
        trackKeyboardSession(totalKeysPressed.current, sessionDuration)
      }
    }, 30000)

    const handleKeyDown = (event: KeyboardEvent) => {
      activateKey(event.key)
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      clearInterval(sessionInterval)
      window.removeEventListener("keydown", handleKeyDown)
      window.speechSynthesis.cancel()

      // Send final session statistics
      if (totalKeysPressed.current > 0) {
        const sessionDuration = Math.floor((Date.now() - sessionStartTime.current) / 1000)
        trackKeyboardSession(totalKeysPressed.current, sessionDuration)
      }
    }
  }, [activateKey])

  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-gray-900">
      <AnimatePresence>
        {pressedKey && (
          <motion.div
            key={keyId}
            initial={{ opacity: 1, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.8 }}
            className={`absolute text-center text-[400px] font-bold ${textColor}`}
            style={{
              top: `${position.y}%`,
              left: `${position.x}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {pressedKey}
          </motion.div>
        )}
      </AnimatePresence>
      {!pressedKey && <p className="text-2xl text-gray-500">{dictionary.keyboardPlaceholder}</p>}
      {isMobile && <OnScreenKeyboard onKeyTap={activateKey} />}
    </div>
  )
}
