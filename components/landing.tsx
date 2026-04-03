"use client"

import { Hero } from "@/components/hero"
import { Tokenomics } from "@/components/tokenomics"
import { HowItWorks } from "@/components/how-it-works"
import { RiskDisclosure } from "@/components/risk-disclosure"
import { CallToAction } from "@/components/call-to-action"
import { TrustFeatures } from "@/components/trust-features"
import { BlackjackGame } from "@/components/blackjack-game"
import { useGame } from "@/components/game-context"
import { useState, useRef } from "react"
import { ChevronDown } from "lucide-react"

export default function Landing() {
  const [showContent, setShowContent] = useState(false)
  const [showGame, setShowGame] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const { setIsGameActive } = useGame()

  const handleLearnMore = () => {
    setShowContent(true)
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }

  const handleStartDemo = () => {
    setShowGame(true)
    setIsGameActive(true)
  }

  const handleBack = () => {
    setShowGame(false)
    setIsGameActive(false)
  }

  const learnMoreButton = !showContent ? (
    <div className="flex justify-center">
      <button
        onClick={handleLearnMore}
        className="m-radius group relative px-10 py-5 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white font-bold text-lg rounded-xl border-2 border-[#d4af37]/30 hover:border-[#d4af37] transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#d4af37]/20"
      >
        <span className="flex items-center gap-3">
          Learn More About $BJ
          <ChevronDown className="w-5 h-5 animate-bounce text-[#d4af37]" />
        </span>
      </button>
    </div>
  ) : null

  if (showGame) {
    return <BlackjackGame onBack={handleBack} />
  }

  return (
    <main className="min-h-screen">
      <Hero onStartDemo={handleStartDemo} />
      <Tokenomics learnMoreButton={learnMoreButton} onStartDemo={handleStartDemo} />

      {showContent && (
        <div ref={contentRef} className="animate-fadeIn">
          <HowItWorks />
          <RiskDisclosure />
          <CallToAction />
          <TrustFeatures />
        </div>
      )}
    </main>
  )
}
