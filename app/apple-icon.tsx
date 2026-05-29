import { ImageResponse } from 'next/og'

// Apple touch icon (used when added to a home screen on iOS).
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

const RAINBOW = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899']

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000000',
        }}
      >
        <div style={{ display: 'flex' }}>
          {'Rk'.split('').map((char, index) => (
            <span
              key={index}
              style={{ fontSize: 120, fontWeight: 800, color: RAINBOW[index % RAINBOW.length] }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
    ),
    { ...size },
  )
}
