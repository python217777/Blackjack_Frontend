"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { BicycleCard } from "./bicycle-card"
import { Sparkles, Play, Wallet } from "lucide-react"
import type { Card } from "@/types/game"
import { createDeck, shuffleDeck } from "@/lib/game-logic"

interface StreamlinedHomepageProps {
  onStartDemo: () => void
  onConnectWallet: () => void
}

export function StreamlinedHomepage({ onStartDemo, onConnectWallet }: StreamlinedHomepageProps) {
  const [animationCards, setAnimationCards] = useState<Card[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showCards, setShowCards] = useState(false)

  useEffect(() => {
    // Create a deck for animation
    const deck = shuffleDeck(createDeck())
    const selectedCards = deck.slice(0, 4) // Just show 4 cards in animation
    setAnimationCards(selectedCards)

    // Start the card dealing animation
    const startAnimation = setTimeout(() => {
      setShowCards(true)
    }, 1000)

    return () => clearTimeout(startAnimation)
  }, [])

  useEffect(() => {
    if (showCards && currentCardIndex < animationCards.length) {
      const timer = setTimeout(() => {
        setCurrentCardIndex((prev) => prev + 1)
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [showCards, currentCardIndex, animationCards.length])

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Header */}
      <header className="bg-black border-b border-amber-500/30 py-4 px-6">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-black" />
            </div>
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
                VOID CASINO
              </div>
              <div className="text-sm text-amber-400/70 font-medium tracking-wider uppercase">Premium Blackjack</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* Welcome Message */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-amber-400">Welcome to Void Casino</h1>
          <p className="text-xl text-gray-300 mb-2">Experience premium blackjack with authentic Bicycle cards</p>
          <p className="text-lg text-amber-400/80">
            Play 5 free demo hands or connect your wallet for real USDC action
          </p>
        </div>

        {/* Card Animation */}
        <div className="relative mb-12 h-[200px]">
          <div className="flex items-center justify-center gap-4">
            {/* Dealer Cards */}
            <div className="flex gap-2">
              {animationCards.slice(0, 2).map((card, index) => (
                <div
                  key={`dealer-${index}`}
                  className={`transform transition-all duration-700 ${
                    currentCardIndex > index ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}
                >
                  <BicycleCard
                    card={index === 1 ? { ...card, hidden: true } : card}
                    index={index}
                    isDealing={currentCardIndex === index}
                  />
                </div>
              ))}
            </div>

            {/* VS Indicator */}
            <div className="mx-8">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold">VS</span>
              </div>
            </div>

            {/* Player Cards */}
            <div className="flex gap-2">
              {animationCards.slice(2, 4).map((card, index) => (
                <div
                  key={`player-${index}`}
                  className={`transform transition-all duration-700 ${
                    currentCardIndex > index + 2 ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}
                >
                  <BicycleCard card={card} index={index + 2} isDealing={currentCardIndex === index + 2} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-6 items-center">
          <Button
            onClick={onStartDemo}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg px-6 py-3 rounded-lg"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Demo
          </Button>

          <div className="text-gray-400 font-bold">OR</div>

          <Button
            onClick={onConnectWallet}
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold text-lg px-6 py-3 rounded-lg"
          >
            <Wallet className="w-5 h-5 mr-2" />
            Connect Wallet
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-6 mt-12 max-w-3xl">
          <div className="text-center">
            <div className="text-amber-400 text-lg font-bold mb-1">Provably Fair</div>
            <p className="text-gray-400 text-sm">Transparent and verifiable game outcomes</p>
          </div>

          <div className="text-center">
            <div className="text-amber-400 text-lg font-bold mb-1">Classic Gameplay</div>
            <p className="text-gray-400 text-sm">Authentic blackjack with Bicycle cards</p>
          </div>

          <div className="text-center">
            <div className="text-amber-400 text-lg font-bold mb-1">USDC Betting</div>
            <p className="text-gray-400 text-sm">Secure transactions on Solana</p>
          </div>
        </div>
      </div>
    </div>
  )
}
