import type { MetadataRoute } from 'next'

// PWA manifest. `fullscreen` display suits a distraction-free toddler experience
// when added to a phone/tablet home screen.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Rainbow Keyboard',
    short_name: 'Rainbow',
    description: 'Animation of a keyboard shining in rainbow colors.',
    start_url: '/',
    display: 'fullscreen',
    orientation: 'landscape',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  }
}
