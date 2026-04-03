import type { Metadata } from 'next'
import Script from "next/script";
import './globals.css'
import "./index.css";
import { Outfit, Inter } from 'next/font/google'
import { ExperimentalBanner } from "@/components/experimental-banner"
import { StickyFooter } from "@/components/sticky-footer"
import { FirstVisitPopup } from "@/components/first-visit-popup"
import { GameProvider } from "@/components/game-context"
export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

// Match v0 landing fonts: expose CSS variables used in globals.css
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300','400','500','600','700','800'],
  variable: '--font-outfit',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300','400','500','600','700'],
  variable: '--font-inter',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <Script
          src="https://terminal.jup.ag/main-v4.js"
          strategy="beforeInteractive"
          data-preload
          defer
        />
      </head>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <GameProvider>
          <ExperimentalBanner />
          {children}
          <StickyFooter />
          <FirstVisitPopup />
        </GameProvider>
      </body>
    </html>
  )
}
