"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { BicycleCard } from "./bicycle-card"
import { Sparkles, Play, Wallet, Shield, Users, Zap } from "lucide-react"
import type { Card } from "@/types/game"
import { createDeck, shuffleDeck } from "@/lib/game-logic"

interface EnhancedHomepageProps {
  onStartDemo: () => void
  onConnectWallet: () => void
}

export function EnhancedHomepage({ onStartDemo, onConnectWallet }: EnhancedHomepageProps) {
  const [animationCards, setAnimationCards] = useState<Card[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showCards, setShowCards] = useState(false)
  const [animationPhase, setAnimationPhase] = useState<"dealing" | "reveal" | "complete">("dealing")

  useEffect(() => {
    // Create a deck for animation with specific showcase cards
    const deck = shuffleDeck(createDeck())
    const showcaseCards = [
      { suit: "♠" as const, rank: "A", value: 11 }, // Ace of Spades
      { suit: "♥" as const, rank: "K", value: 10 }, // King of Hearts
      { suit: "♦" as const, rank: "Q", value: 10 }, // Queen of Diamonds
      { suit: "♣" as const, rank: "J", value: 10 }, // Jack of Clubs
      { suit: "♠" as const, rank: "10", value: 10 }, // 10 of Spades
      { suit: "♥" as const, rank: "9", value: 9 }, // 9 of Hearts
    ]
    setAnimationCards(showcaseCards)

    // Start the animation sequence
    const startAnimation = setTimeout(() => {
      setShowCards(true)
    }, 1000)

    return () => clearTimeout(startAnimation)
  }, [])

  useEffect(() => {
    if (showCards && currentCardIndex < animationCards.length) {
      const timer = setTimeout(() => {
        setCurrentCardIndex((prev) => prev + 1)
        if (currentCardIndex === animationCards.length - 1) {
          setTimeout(() => setAnimationPhase("reveal"), 1000)
          setTimeout(() => setAnimationPhase("complete"), 2000)
        }
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [showCards, currentCardIndex, animationCards.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-amber-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-red-500 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative bg-black/80 border-b border-amber-500/30 backdrop-blur-xl py-6 px-6">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-xl">
              <Sparkles className="w-8 h-8 text-black" />
            </div>
            <div>
              <div className="text-4xl font-black bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent tracking-wide">
                VOID CASINO
              </div>
              <div className="text-sm text-amber-400/80 font-bold tracking-[0.3em] uppercase">Premium Blackjack</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-3xl">
          <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent leading-tight">
            Welcome to the Table
          </h1>
          <p className="text-2xl text-gray-300 mb-4 font-light">
            Experience premium blackjack with authentic Bicycle cards
          </p>
          <p className="text-lg text-amber-400/90 font-medium">
            🎯 Play 5 demo hands free • 💰 Connect wallet for real USDC action • 🏆 Provably fair gaming
          </p>
        </div>

        {/* Enhanced Card Animation */}
        <div className="relative mb-16">
          <div className="flex items-center justify-center gap-8 min-h-[250px]">
            {/* Dealer Section */}
            <div className="flex flex-col items-center">
              <div className="bg-black/60 backdrop-blur-sm rounded-xl px-6 py-3 mb-6 border border-amber-500/30">
                <div className="text-xl font-bold text-white">DEALER</div>
                <div className="text-2xl text-amber-400 font-black">21</div>
              </div>
              <div className="flex gap-3">
                {animationCards.slice(0, 2).map((card, index) => (
                  <div
                    key={`dealer-${index}`}
                    className={`transform transition-all duration-700 ${
                      currentCardIndex > index
                        ? "translate-y-0 opacity-100 rotate-0"
                        : "translate-y-12 opacity-0 rotate-12"
                    }`}
                  >
                    <BicycleCard
                      card={index === 1 && animationPhase === "dealing" ? { ...card, hidden: true } : card}
                      index={index}
                      isDealing={currentCardIndex === index}
                      size="large"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* VS Indicator with Animation */}
            <div className="mx-12 flex flex-col items-center">
              <div
                className={`w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-2xl mb-4 transform transition-all duration-1000 ${
                  animationPhase === "complete" ? "scale-110 shadow-amber-500/50" : ""
                }`}
              >
                <span className="text-black font-black text-2xl">VS</span>
              </div>
              <div className="text-amber-400 font-bold text-lg tracking-wider">BLACKJACK</div>
              {animationPhase === "complete" && (
                <div className="text-emerald-400 font-bold text-sm mt-2 animate-pulse">PLAYER WINS!</div>
              )}
            </div>

            {/* Player Section */}
            <div className="flex flex-col items-center">
              <div className="bg-black/60 backdrop-blur-sm rounded-xl px-6 py-3 mb-6 border border-amber-500/30">
                <div className="text-xl font-bold text-white">YOU</div>
                <div className="text-2xl text-emerald-400 font-black">21</div>
              </div>
              <div className="flex gap-3">
                {animationCards.slice(2, 4).map((card, index) => (
                  <div
                    key={`player-${index}`}
                    className={`transform transition-all duration-700 ${
                      currentCardIndex > index + 2
                        ? "translate-y-0 opacity-100 rotate-0"
                        : "translate-y-12 opacity-0 -rotate-12"
                    }`}
                  >
                    <BicycleCard
                      card={card}
                      index={index + 2}
                      isDealing={currentCardIndex === index + 2}
                      size="large"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating Cards */}
          <div className="absolute inset-0 pointer-events-none">
            {animationCards.slice(4).map((card, index) => (
              <div
                key={`floating-${index}`}
                className={`absolute transform transition-all duration-1500 ${
                  currentCardIndex > index + 4 ? "opacity-20 scale-75" : "opacity-0"
                }`}
                style={{
                  left: `${15 + index * 20}%`,
                  top: `${25 + Math.sin(index) * 15}%`,
                  transform: `rotate(${-20 + index * 15}deg)`,
                  animationDelay: `${(index + 4) * 0.5}s`,
                }}
              >
                <BicycleCard card={card} size="normal" />
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 items-center mb-16">
          <Button
            onClick={onStartDemo}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-2xl px-10 py-5 rounded-2xl shadow-2xl transform transition-all hover:scale-105 hover:shadow-emerald-500/30"
          >
            <Play className="w-7 h-7 mr-3" />
            Start Demo Game
            <div className="ml-3 text-sm bg-emerald-700 px-2 py-1 rounded-full">FREE</div>
          </Button>

          <div className="text-gray-400 font-bold text-xl">OR</div>

          <Button
            onClick={onConnectWallet}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-2xl px-10 py-5 rounded-2xl shadow-2xl transform transition-all hover:scale-105 hover:shadow-amber-500/30"
          >
            <Wallet className="w-7 h-7 mr-3" />
            Connect Wallet
            <div className="ml-3 text-sm bg-amber-700 px-2 py-1 rounded-full text-white">REAL $</div>
          </Button>
        </div>

        {/* Enhanced Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl">
          <div className="bg-gradient-to-br from-black/80 to-gray-900/80 border border-amber-500/30 rounded-2xl p-6 text-center backdrop-blur-sm hover:border-amber-500/50 transition-all">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Provably Fair</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Transparent blockchain verification ensures every hand is completely fair and verifiable
            </p>
          </div>

          <div className="bg-gradient-to-br from-black/80 to-gray-900/80 border border-emerald-500/30 rounded-2xl p-6 text-center backdrop-blur-sm hover:border-emerald-500/50 transition-all">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Sparkles className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Authentic Cards</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Classic Bicycle playing cards with traditional designs and premium animations
            </p>
          </div>

          <div className="bg-gradient-to-br from-black/80 to-gray-900/80 border border-blue-500/30 rounded-2xl p-6 text-center backdrop-blur-sm hover:border-blue-500/50 transition-all">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Instant Payouts</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Lightning-fast USDC transactions on Solana with minimal fees and instant settlements
            </p>
          </div>

          <div className="bg-gradient-to-br from-black/80 to-gray-900/80 border border-purple-500/30 rounded-2xl p-6 text-center backdrop-blur-sm hover:border-purple-500/50 transition-all">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Referral Rewards</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Earn 5% commission from friends' gameplay plus bonus rewards for both players
            </p>
          </div>
        </div>

        {/* Stats Banner */}
        <div className="mt-16 bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-amber-500/10 border border-amber-500/30 rounded-2xl p-6 max-w-4xl">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-black text-amber-400 mb-2">99.5%</div>
              <div className="text-sm text-gray-400 font-medium">Return to Player</div>
            </div>
            <div>
              <div className="text-3xl font-black text-emerald-400 mb-2">0.5%</div>
              <div className="text-sm text-gray-400 font-medium">House Edge</div>
            </div>
            <div>
              <div className="text-3xl font-black text-blue-400 mb-2">3:2</div>
              <div className="text-sm text-gray-400 font-medium">Blackjack Payout</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
