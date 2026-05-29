import { useEffect, useState } from "react"

// True when the primary pointer is coarse (touchscreen) — phones AND tablets
// like the iPad, which a width breakpoint would misclassify as desktop.
// Drives whether the on-screen keyboard is shown.
export function useHasTouch(): boolean {
  const [hasTouch, setHasTouch] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return
    const mql = window.matchMedia("(pointer: coarse)")
    const update = () => setHasTouch(mql.matches)
    update()
    mql.addEventListener("change", update)
    return () => mql.removeEventListener("change", update)
  }, [])

  return hasTouch
}
