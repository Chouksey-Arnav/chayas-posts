import './globals.css';
import { Cormorant_Garamond, EB_Garamond, Jost } from 'next/font/google';
import { Navbar, Footer } from '@/components/Nav';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'], weight: ['300','400','500','600','700'],
  style: ['normal','italic'], variable: '--font-cormorant', display: 'swap',
});
const garamond = EB_Garamond({
  subsets: ['latin'], weight: ['400','500'], style: ['normal','italic'],
  variable: '--font-garamond', display: 'swap',
});
const jost = Jost({
  subsets: ['latin'], weight: ['300','400','500','600'],
  variable: '--font-jost', display: 'swap',
});

export const metadata = {
  title: { default: "Chaya's Posts", template: "%s | Chaya's Posts" },
  description: "Poems, stories, and reflections by Chaya Chouksey.",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: "Chaya's Posts",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${garamond.variable} ${jost.variable}`}>
      <head>
        {/* PWA: tints the browser chrome on Android */}
        <meta name="theme-color" content="#6B1E3A" />
        {/* PWA: iOS home-screen icon */}
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="font-body text-ink bg-ivory-warm antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />

        {/* Service Worker registration — runs after page load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function () {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(reg) { console.log('[SW] Registered:', reg.scope); })
                    .catch(function(err) { console.warn('[SW] Failed:', err); });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
