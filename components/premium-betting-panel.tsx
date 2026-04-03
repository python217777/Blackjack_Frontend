"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Zap, RotateCcw, Repeat } from "lucide-react"
import { CasinoChip } from "./casino-chip"
import type { GameState } from "@/types/game"

interface ChipAnimation {
  id: number
  value: number
  startTime: number
  isMax?: boolean
}

interface PremiumBettingPanelProps {
  gameState: GameState
  onPlaceBet: (amount: number) => void
  onChipStackUpdate: (chips: { value: number; count: number }[]) => void
  lastBetAmount: number
  solBalance: number
}

export function PremiumBettingPanel({
  gameState,
  onPlaceBet,
  onChipStackUpdate,
  lastBetAmount,
  solBalance,
}: PremiumBettingPanelProps) {
  const [currentBet, setCurrentBet] = useState(0)
  const [chipStacks, setChipStacks] = useState<{ value: number; count: number }[]>([])
  const [animatingChips, setAnimatingChips] = useState<ChipAnimation[]>([])
  const [maxChipAnimating, setMaxChipAnimating] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Different chip denominations for different currencies
  const demoDenominations = [1, 5, 10, 25, "MAX"]
  const bjDenominations = [1, 5, 10, 25, "MAX"]

  const chipDenominations = gameState.isDemo ? demoDenominations : bjDenominations

  const currentBalance = gameState.isDemo ? gameState.playerBalance : solBalance

  // Add useEffect for responsive detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const addToBet = (amount: number) => {
    if (currentBet + amount <= currentBalance) {
      // Play chip sound with value-specific pitch
      if (typeof window !== "undefined" && (window as any).playChipSound) {
        ;(window as any).playChipSound(amount)
      }

      const newBet = currentBet + amount
      setCurrentBet(newBet)

      // Update chip stacks for visual display - this persists on table
      const newStacks = [...chipStacks]
      const existingStack = newStacks.find((stack) => stack.value === amount)
      if (existingStack) {
        existingStack.count += 1
      } else {
        newStacks.push({ value: amount, count: 1 })
        newStacks.sort((a, b) => b.value - a.value)
      }
      setChipStacks(newStacks)
      onChipStackUpdate(newStacks)

      // Create brief animation effect for feedback
      const chipId = Date.now() + Math.random()
      setAnimatingChips((prev) => [...prev, { id: chipId, value: amount, startTime: Date.now() }])

      // Remove animation feedback after brief moment
      setTimeout(() => {
        setAnimatingChips((prev) => prev.filter((chip) => chip.id !== chipId))
      }, 600)
    }
  }

  const clearBet = () => {
    setCurrentBet(0)
    setChipStacks([])
    onChipStackUpdate([])
  }

  const placeBet = () => {
    if (currentBet > 0) {
      // Play button sound
      if (typeof window !== "undefined" && (window as any).playButtonSound) {
        ;(window as any).playButtonSound()
      }

      onPlaceBet(currentBet)
      clearBet()
      // Don't clear chip stacks here - they should stay on table until game ends
    }
  }

  const repeatLastBet = () => {
    if (lastBetAmount > 0 && lastBetAmount <= currentBalance) {
      onPlaceBet(lastBetAmount)
    }
  }

  const handleMaxBet = () => {
    const maxAmount = Math.floor(currentBalance) // Round down to nearest dollar

    // Play deep sound for MAX bet
    if (typeof window !== "undefined" && (window as any).playChipSound) {
      ;(window as any).playChipSound(maxAmount)
    }

    setCurrentBet(maxAmount)
    setChipStacks([{ value: maxAmount, count: 1 }])
    onChipStackUpdate([{ value: maxAmount, count: 1 }])
    setMaxChipAnimating(true)
    setTimeout(() => setMaxChipAnimating(false), 1500)
  }

  if (gameState.gamePhase !== "betting") {
    return null
  }

  // Update currency formatting
  const currencySymbol = "BJ"
  const formatAmount = (amount: number) => {
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }

  return (
    <>
      {/* Main Betting Panel - Fixed positioning */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 border-t border-amber-500/30 backdrop-blur-sm z-40">
        <div className="max-w-lg mx-auto p-3 sm:p-4">
          {/* Current Bet Display */}
          {currentBet > 0 && (
            <div className="flex justify-center mb-3">
              <div className="bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-amber-500/50">
                <div className="text-center">
                  <div className="text-amber-400 font-bold text-lg">
                    Total Bet: ${formatAmount(currentBet)} {currencySymbol}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bet Button Row */}
          {currentBet > 0 && (
            <div className="flex justify-center mb-3">
              <Button
                onClick={placeBet}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold px-8 text-xl py-4 rounded-xl shadow-lg"
              >
                <Zap className="w-5 h-5 mr-2" />
                PLACE BET
              </Button>
            </div>
          )}

          {/* Casino Chips - Compact grid */}
          <div className="grid grid-cols-5 gap-2 mb-3 justify-items-center">
            {chipDenominations.map((amount, index) => (
              <div key={amount} className="scale-75 sm:scale-90">
                {amount === "MAX" ? (
                  <button
                    onClick={handleMaxBet}
                    disabled={currentBalance <= 0}
                    className={`
                    w-16 h-16 bg-[url('/max.png')] bg-cover bg-center text-white
                    rounded-full flex flex-col items-center justify-center
                    shadow-lg font-bold
                    transform transition-all duration-200
                    ${currentBalance <= 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105"}
                    relative overflow-hidden
                  `}
                  >
                   
                  </button>
                ) : (
                  <CasinoChip
                    value={amount as number}
                    onClick={() => addToBet(amount as number)}
                    disabled={currentBet + (amount as number) > currentBalance}
                    currency={currencySymbol}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Bet Controls */}
          <div className="flex gap-2 items-center justify-center">
            {lastBetAmount > 0 && lastBetAmount <= currentBalance && (
              <Button
                onClick={repeatLastBet}
                size="sm"
                className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-600/50 text-sm px-4 py-2"
              >
                <Repeat className="w-4 h-4 mr-1" />
                Repeat Last
              </Button>
            )}

            {currentBet > 0 && (
              <Button
                onClick={clearBet}
                size="sm"
                className="bg-gray-600/20 hover:bg-gray-600/40 text-gray-400 border border-gray-600/50 text-sm px-4 py-2"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Clear Bet
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Brief Animation Feedback */}
      {animatingChips.map((chip) => (
        <div
          key={chip.id}
          className="fixed z-50 pointer-events-none"
          style={{
            bottom: "120px",
            left: "50%",
            transform: "translateX(-50%)",
            animation: "chipFeedback 0.6s ease-out forwards",
          }}
        >
          <div className="scale-75 opacity-80">
            <CasinoChip value={chip.value} currency="BJ" />
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes chipFeedback {
          0% {
            transform: translateX(-50%) translateY(0px) scale(0.75);
            opacity: 0.8;
          }
          50% {
            transform: translateX(-50%) translateY(-30px) scale(0.9);
            opacity: 1;
          }
          100% {
            transform: translateX(-50%) translateY(-60px) scale(0.6);
            opacity: 0;
          }
        }
      `}</style>
    </>
  )
}
