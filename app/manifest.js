export default function manifest() {
  return {
    name: "Chaya's Posts",
    short_name: "Chaya's Posts",
    description: "Poems, stories, and reflections by Chaya Chouksey.",
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#FFF8EF',
    theme_color: '#6B1E3A',
    categories: ['books', 'lifestyle'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  };
}
