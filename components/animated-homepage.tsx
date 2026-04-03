"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { BicycleCard } from "./bicycle-card"
import { Play, HelpCircle, ExternalLink } from "lucide-react"
import type { Card } from "@/types/game"
import { BJExplanationModal } from "./bj-explanation-modal"
import { useQueryParams } from "../hooks/useQueryParams";
import { useDefaultChain } from "../hooks/useDefaultChain";
import { calculateFee } from "../utils/fee";
import { useAllowDenyLists } from "../hooks/useAllowDenyLists";
import "@jup-ag/terminal/css";


interface AnimatedHomepageProps {
  onStartDemo: () => void,
  showFairness: boolean,
  setShowFairness: (show: boolean) => void
}

export function AnimatedHomepage({ onStartDemo, showFairness, setShowFairness }: AnimatedHomepageProps) {
  const [animationCards, setAnimationCards] = useState<Card[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showCards, setShowCards] = useState(false)
  const [animationPhase, setAnimationPhase] = useState<"dealing" | "complete">("dealing")
  const [swapAmount, setSwapAmount] = useState("100")
  const [fromToken, setFromToken] = useState("SOL")
  const [toToken, setToToken] = useState("BJ")
  const [showBJModal, setShowBJModal] = useState(false)
  const searchParams = useQueryParams();
  const allowDenyLists = useAllowDenyLists(searchParams);
  const defaultFromChain = useDefaultChain(searchParams);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    import("@jup-ag/terminal").then((mod) => {
      const { init } = mod;
      init({
        displayMode: "integrated",
        integratedTargetId: "jupiter-terminal",
      });
    });
  }, []);
  useEffect(() => {
    // Create showcase cards
    const showcaseCards = [
      { suit: "♠" as const, rank: "K", value: 10 }, // Dealer card 1
      { suit: "♥" as const, rank: "Q", value: 10 }, // Dealer card 2 (total 20)
      { suit: "♦" as const, rank: "A", value: 11 }, // Player card 1
      { suit: "♣" as const, rank: "J", value: 10 }, // Player card 2 (total 21)
    ];
    setAnimationCards(showcaseCards)

    // Start animations
    setTimeout(() => setShowCards(true), 1000)
  }, [])

  useEffect(() => {
    if (showCards && currentCardIndex < animationCards.length) {
      const timer = setTimeout(() => {
        setCurrentCardIndex((prev) => prev + 1)
      }, 600)
      return () => clearTimeout(timer)
    } else if (currentCardIndex === animationCards.length) {
      setTimeout(() => setAnimationPhase("complete"), 500)
    }
  }, [showCards, currentCardIndex, animationCards.length])

  const handleSwap = () => {
    // This would integrate with Jupiter API in production
    window.open("https://jup.ag/", "_blank")
  }

  const swapTokens = () => {
    setFromToken(toToken)
    setToToken(fromToken)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
      {/* Header */}
      <header className="relative bg-black/90 border-b border-gray-700/50 backdrop-blur-xl py-6 px-6">
        <div className="flex items-center justify-center">
          <img src="/images/void-casino-logo.png" alt="Premium Blackjack" className="h-14 object-contain" />
        </div>
      </header>

      {/* Main Container - Centered and Cohesive */}
      <div className="flex-1 flex items-center justify-center py-4 sm:py-8">
        <div className="w-full max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-6xl font-black mb-4 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent leading-tight">
              Solana Blackjack
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-6 font-light max-w-2xl mx-auto">
              On-chain - Provably fair - Instant payouts
            </p>
          </div>

          {/* Main Game Preview Card */}
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 rounded-3xl p-6 sm:p-8 mb-8 backdrop-blur-sm shadow-2xl">
            {/* Card Animation */}
            <div className="relative mb-8">
              <div className="flex items-center justify-center gap-2 sm:gap-4 min-h-[200px]">
                {/* Dealer Cards */}
                <div className="flex flex-col items-center">
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 mb-3 border border-gray-600/50">
                    <div className="text-sm font-bold text-white">DEALER</div>
                    <div className="text-lg text-amber-400 font-black">20</div>
                  </div>
                  <div className="flex gap-1 sm:gap-2">
                    {animationCards.slice(0, 2).map((card, index) => (
                      <div
                        key={`dealer-${index}`}
                        className={`transform transition-all duration-700 ${currentCardIndex > index
                            ? "translate-y-0 opacity-100 rotate-0"
                            : "translate-y-12 opacity-0 rotate-12"
                          }`}
                      >
                        <div className="scale-75 sm:scale-90">
                          <BicycleCard
                            card={index === 1 && animationPhase === "dealing" ? { ...card, hidden: true } : card}
                            index={index}
                            isDealing={currentCardIndex === index}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* VS Indicator */}
                <div className="flex flex-col items-center">
                  <img src="/images/front-card.png" alt="VS" className="max-h-40 aspect-square h-full" />
                </div>

                {/* Player Cards */}
                <div className="flex flex-col items-center">
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 mb-3 border border-emerald-500/50">
                    <div className="text-sm font-bold text-white">YOU</div>
                    <div className="text-lg text-emerald-400 font-black">21</div>
                  </div>
                  <div className="flex gap-1 sm:gap-2">
                    {animationCards.slice(2, 4).map((card, index) => (
                      <div
                        key={`player-${index}`}
                        className={`transform transition-all duration-700 ${currentCardIndex > index + 2
                            ? "translate-y-0 opacity-100 rotate-0"
                            : "translate-y-12 opacity-0 -rotate-12"
                          }`}
                      >
                        <div className="scale-75 sm:scale-90">
                          <BicycleCard card={card} index={index + 2} isDealing={currentCardIndex === index + 2} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Rearranged Action Buttons */}
            <div className="text-center mb-6 flex flex-col items-center justify-center">
              {/* Main CTA and Help Button Side by Side */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4 max-w-[300px] w-full">
                <Button
                  onClick={onStartDemo}
                  className="w-full bg-[#5B3DF6] hover:bg-[#6C4FFF] text-white font-bold text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-5 rounded-xl shadow-xl transform transition-all hover:scale-105 hover:shadow-[#6C4FFF]/30 border border-transparent gap-2"
                >
                  <Play className="w-5 h-5 sm:w-6 sm:h-6" />
                  Play Demo
                </Button>

                <div className="grid grid-cols-2 gap-2 w-full">
                  <Button
                    onClick={() => setShowBJModal(true)}
                    variant="outline"
                    className="w-full text-amber-400 border-amber-400/50 hover:bg-amber-400/10 hover:border-amber-400 font-semibold px-6 py-4 sm:py-5 rounded-xl text-base sm:text-lg"
                  >
                    $BJ
                  </Button>
                  <Button
                    onClick={() => setShowFairness(true)}
                    variant="outline"
                    className="w-full text-amber-400 border-amber-400/50 hover:bg-amber-400/10 hover:border-amber-400 font-semibold px-6 py-4 sm:py-5 rounded-xl text-base sm:text-lg"
                  >
                    Provably Fair
                  </Button>
                </div>
              </div>

              <p className="text-gray-400 text-sm">Start with demo • Connect wallet later for real $BJ</p>
            </div>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
              <span className="px-4 text-gray-400 text-sm font-medium">OR GET TOKENS</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
            </div>

            {/* Jupiter-Style Swap Interface */}
            <div className="bg-black/40 border border-gray-600/50 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
              <div id="jupiter-terminal" />
            </div>
          </div>

          {/* Stats Banner */}

        </div>
      </div>

      {/* Footer */}
      <footer className="relative bg-black/80 border-t border-gray-700/50 backdrop-blur-xl py-4 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-xs text-gray-500">© 2024 Premium Blackjack. Play responsibly. Must be 18+.</div>
        </div>
      </footer>

      {/* BJ Explanation Modal */}
      <BJExplanationModal show={showBJModal} onClose={() => setShowBJModal(false)} onStartDemo={onStartDemo} />
    </div>
  )
}
