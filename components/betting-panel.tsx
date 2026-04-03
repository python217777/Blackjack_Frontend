"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { GameState } from "@/types/game"

interface BettingPanelProps {
  gameState: GameState
  onPlaceBet: (amount: number) => void
}

export function BettingPanel({ gameState, onPlaceBet }: BettingPanelProps) {
  const [customBet, setCustomBet] = useState("")
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)

  const quickBets = [0.1, 1, 5, 10, 25, 50]

  const handleQuickBet = (amount: number) => {
    if (gameState.gamePhase === "betting") {
      setSelectedAmount(amount)
      setTimeout(() => {
        onPlaceBet(amount)
        setSelectedAmount(null)
      }, 200)
    }
  }

  const handleCustomBet = () => {
    const amount = Number.parseFloat(customBet)
    if (amount > 0 && gameState.gamePhase === "betting") {
      setSelectedAmount(amount)
      setTimeout(() => {
        onPlaceBet(amount)
        setCustomBet("")
        setSelectedAmount(null)
      }, 200)
    }
  }

  if (gameState.gamePhase !== "betting") {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#0f1419] via-[#1a1f2e] to-transparent border-t border-[#00d4aa]/30 p-6 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">Place Your Bet</h3>
          <div className="text-lg text-[#00d4aa]">
            Balance: <span className="font-bold">{gameState.playerBalance.toFixed(2)} USDC</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-6">
          {quickBets.map((amount) => (
            <Button
              key={amount}
              onClick={() => handleQuickBet(amount)}
              disabled={amount > gameState.playerBalance}
              className={`
                relative overflow-hidden bg-gradient-to-r from-[#2a2f3e] to-[#3a3f4e] 
                hover:from-[#00d4aa] hover:to-[#00b894] 
                border-2 border-[#00d4aa] text-white hover:text-black 
                disabled:opacity-50 disabled:cursor-not-allowed
                font-bold text-lg px-6 py-4 rounded-xl
                transform transition-all duration-200 hover:scale-105 hover:shadow-xl
                ${selectedAmount === amount ? "scale-95 bg-[#00d4aa] text-black" : ""}
              `}
            >
              <div className="relative z-10">
                <div className="text-xl font-bold">{amount}</div>
                <div className="text-sm opacity-80">USDC</div>
              </div>
              {selectedAmount === amount && <div className="absolute inset-0 bg-[#00d4aa] animate-pulse" />}
            </Button>
          ))}
        </div>

        <div className="flex gap-4 justify-center max-w-md mx-auto">
          <Input
            type="number"
            placeholder="Enter custom amount"
            value={customBet}
            onChange={(e) => setCustomBet(e.target.value)}
            className="bg-[#2a2f3e] border-2 border-[#00d4aa]/50 text-white text-lg py-3 rounded-xl focus:border-[#00d4aa] focus:ring-2 focus:ring-[#00d4aa]/20"
            min="0.1"
            max={gameState.playerBalance}
            step="0.1"
          />
          <Button
            onClick={handleCustomBet}
            disabled={
              !customBet || Number.parseFloat(customBet) <= 0 || Number.parseFloat(customBet) > gameState.playerBalance
            }
            className="bg-gradient-to-r from-[#00d4aa] to-[#00b894] hover:from-[#00b894] hover:to-[#009975] text-black font-bold text-lg px-8 py-3 rounded-xl disabled:opacity-50 transform transition-all hover:scale-105 hover:shadow-xl"
          >
            BET
          </Button>
        </div>

        <div className="text-center mt-4 text-sm text-gray-400">
          Minimum bet: 0.1 USDC • Maximum bet: {gameState.playerBalance.toFixed(2)} USDC
        </div>
      </div>
    </div>
  )
}
