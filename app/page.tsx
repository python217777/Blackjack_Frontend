"use client"

import Landing from "@/components/landing"
// import {BlackjackGame} from "@/components/blackjack-game"
import { ErrorBoundary } from "@/components/error-boundary"
import WalletProvider from "@/components/WalletProvider";
import Script from "next/script";
export default function Home() {
  return (
    <>
     {/* <Script
        src="https://terminal.jup.ag/main-v4.js"
        strategy="beforeInteractive"
        data-preload
        defer
      /> */}
    <WalletProvider>
      <ErrorBoundary>
        <Landing />
      </ErrorBoundary>
    </WalletProvider>
    </>
  )
}
