"use client"

// Touch-friendly keyboard shown on mobile, where there is no physical keyboard.
// Each tap forwards a raw key string to the parent, which runs the same
// animation/speech pipeline as a physical key press.

const ROWS: ReadonlyArray<ReadonlyArray<string>> = [
  "QWERTYUIOP".split(""),
  "ASDFGHJKL".split(""),
  "ZXCVBNM".split(""),
  "1234567890".split(""),
]

interface OnScreenKeyboardProps {
  onKeyTap: (key: string) => void
}

export default function OnScreenKeyboard({ onKeyTap }: OnScreenKeyboardProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 flex flex-col items-center gap-1 bg-black/70 p-2 pb-[env(safe-area-inset-bottom,0.75rem)]">
      {ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex w-full max-w-md justify-center gap-1">
          {row.map((key) => (
            <button
              key={key}
              type="button"
              aria-label={`Key ${key}`}
              onClick={() => onKeyTap(key)}
              className="h-11 min-w-[2.75rem] flex-1 rounded-md bg-gray-700 text-lg font-bold text-white active:bg-gray-500"
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
