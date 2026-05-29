// Pure key-mapping and presentation helpers shared by physical and on-screen
// key presses. No React / DOM here so this stays trivially testable.

// Vibrant colors tuned to pop on a near-black background (brighter -400 shades).
export const COLORS = [
  "text-red-400",
  "text-blue-400",
  "text-green-400",
  "text-yellow-400",
  "text-purple-400",
  "text-pink-400",
  "text-indigo-400",
  "text-cyan-400",
  "text-orange-400",
  "text-lime-400",
  "text-emerald-400",
  "text-teal-400",
  "text-violet-400",
  "text-fuchsia-400",
  "text-rose-400",
] as const

export type KeyType = "letter" | "number" | "special" | "modifier"

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

// Map a raw KeyboardEvent.key (or on-screen key) to what we display and speak.
// Returns null for keys we intentionally ignore (F1, Meta, etc.).
export function mapKey(rawKey: string): { display: string; speech: string } | null {
  if (rawKey in SPECIAL_KEYS) return SPECIAL_KEYS[rawKey]
  if (rawKey.length > 1) return null
  const display = rawKey.toUpperCase()
  return { display, speech: display.toLowerCase() }
}

export function getKeyType(key: string): KeyType {
  if (/^[A-Z]$/.test(key)) return "letter"
  if (/^[0-9]$/.test(key)) return "number"
  if (["CTRL", "ALT", "SHIFT"].includes(key)) return "modifier"
  return "special"
}

export function randomColor(): string {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

// Position within a centered safe band so large glyphs stay fully on-screen
// (x: 15–85%, y: 20–80%). Used with translate(-50%, -50%).
export function randomPosition(): { x: number; y: number } {
  return {
    x: 15 + Math.random() * 70,
    y: 20 + Math.random() * 60,
  }
}
