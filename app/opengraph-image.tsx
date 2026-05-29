import { ImageResponse } from 'next/og'

// Social share image, served for both Open Graph and Twitter across all routes.
// Uses Latin-only brand text so it renders without bundling extra fonts.
export const alt = 'Rainbow Keyboard'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const RAINBOW = [
  '#ef4444',
  '#f59e0b',
  '#eab308',
  '#22c55e',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
]

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000000',
        }}
      >
        <div style={{ display: 'flex' }}>
          {'RAINBOW'.split('').map((char, index) => (
            <span
              key={index}
              style={{
                fontSize: 150,
                fontWeight: 800,
                color: RAINBOW[index % RAINBOW.length],
              }}
            >
              {char}
            </span>
          ))}
        </div>
        <div style={{ fontSize: 90, fontWeight: 800, color: '#ffffff', marginTop: 8 }}>
          KEYBOARD
        </div>
        <div style={{ fontSize: 34, color: '#9ca3af', marginTop: 32 }}>
          Press any key to see colorful letters
        </div>
      </div>
    ),
    { ...size },
  )
}
