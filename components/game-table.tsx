"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PlayingCard } from "./playing-card"
import { ResultMessage } from "./result-message"
import { ParticleEffect } from "./particle-effect"
import type { GameState } from "@/types/game"

interface GameTableProps {
  gameState: GameState
  onHit: () => void
  onStand: () => void
  onDouble: () => void
  onNewGame: () => void
}

export function GameTable({ gameState, onHit, onStand, onDouble, onNewGame }: GameTableProps) {
  const [showResult, setShowResult] = useState(false)
  const [resultType, setResultType] = useState<"win" | "lose" | "push">("win")
  const [showParticles, setShowParticles] = useState(false)

  useEffect(() => {
    if (gameState.gamePhase === "gameOver" && gameState.message !== "Place your bet to start") {
      // Only show result messages for wins and pushes, not losses
      if (
        gameState.message.includes("win") ||
        gameState.message.includes("Blackjack") ||
        gameState.message.includes("Push")
      ) {
        setShowResult(true)

        if (gameState.message.includes("win") || gameState.message.includes("Blackjack")) {
          setResultType("win")
          setShowParticles(true)
          setTimeout(() => setShowParticles(false), 4000)
        } else if (gameState.message.includes("Push")) {
          setResultType("push")
        }

        const timer = setTimeout(() => {
          setShowResult(false)
        }, 4000) // Longer display time for better experience

        return () => clearTimeout(timer)
      }
    }
  }, [gameState.message, gameState.gamePhase])

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Particle Effects */}
      {showParticles && <ParticleEffect />}

      {/* Game Table */}
      <div className="relative w-full max-w-6xl h-[600px] bg-gradient-to-br from-[#0d4f3c] via-[#1a5f4a] to-[#0d4f3c] rounded-3xl border-4 border-[#00d4aa] shadow-2xl overflow-hidden">
        {/* Table Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, #00d4aa 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, #00d4aa 0%, transparent 50%),
              linear-gradient(45deg, transparent 40%, rgba(0,212,170,0.1) 50%, transparent 60%)
            `,
          }}
        />

        {/* Dealer Section */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="text-center mb-6">
            <div className="bg-black/30 backdrop-blur-sm rounded-full px-6 py-2 border border-[#00d4aa]/30">
              <h3 className="text-xl font-bold text-white mb-1">DEALER</h3>
              <div className="text-lg text-[#00d4aa] font-semibold">
                {gameState.dealerScore > 0 ? gameState.dealerScore : "?"}
              </div>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            {gameState.dealerHand.map((card, index) => (
              <PlayingCard
                key={`dealer-${index}`}
                card={card}
                index={index}
                isDealing={gameState.gamePhase === "dealing"}
              />
            ))}
          </div>
        </div>

        {/* Center Area */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-20">
          {!showResult && (
            <div className="bg-black/50 backdrop-blur-xl rounded-3xl px-10 py-6 border border-[#00d4aa]/30 shadow-2xl">
              <div className="text-3xl font-bold text-[#00d4aa] mb-3 tracking-wide">{gameState.message}</div>
              {gameState.currentBet > 0 && (
                <div className="text-xl text-white/90 font-medium">
                  Stake: <span className="text-[#00d4aa] font-bold">{gameState.currentBet} USDC</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Celebration Overlay for Wins */}
        {resultType === "win" && showResult && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent animate-pulse"></div>
            <div className="absolute top-0 left-0 w-full h-full">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                  style={{
                    left: `${10 + i * 7}%`,
                    top: `${20 + Math.sin(i) * 10}%`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: "2s",
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Result Message */}
        {showResult && (
          <ResultMessage
            message={gameState.message}
            type={resultType}
            show={showResult}
            isBlackjack={gameState.message.includes("Blackjack")}
            winAmount={gameState.currentBet * (gameState.message.includes("Blackjack") ? 2.5 : 2)}
          />
        )}

        {/* Player Section */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex gap-3 justify-center mb-6">
            {gameState.playerHand.map((card, index) => (
              <PlayingCard
                key={`player-${index}`}
                card={card}
                index={index}
                isDealing={gameState.gamePhase === "dealing"}
              />
            ))}
          </div>
          <div className="text-center">
            <div className="bg-black/30 backdrop-blur-sm rounded-full px-6 py-2 border border-[#00d4aa]/30">
              <h3 className="text-xl font-bold text-white mb-1">YOU</h3>
              <div className="text-lg text-[#00d4aa] font-semibold">{gameState.playerScore}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {gameState.gamePhase === "player" && (
          <div className="absolute bottom-4 right-6 flex gap-3 z-30">
            <Button
              onClick={onHit}
              className="bg-[#00d4aa] hover:bg-[#00b894] text-black font-bold text-lg px-6 py-3 rounded-xl shadow-lg transform transition-all hover:scale-105 hover:shadow-xl"
            >
              HIT
            </Button>
            <Button
              onClick={onStand}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-6 py-3 rounded-xl shadow-lg transform transition-all hover:scale-105 hover:shadow-xl"
            >
              STAND
            </Button>
            {gameState.canDouble && (
              <Button
                onClick={onDouble}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold text-lg px-6 py-3 rounded-xl shadow-lg transform transition-all hover:scale-105 hover:shadow-xl"
              >
                DOUBLE
              </Button>
            )}
          </div>
        )}

        {gameState.gamePhase === "betting" && gameState.playerHand.length === 0 && (
          <div className="absolute bottom-4 right-6 z-30">
            <Button
              onClick={onNewGame}
              className="bg-[#00d4aa] hover:bg-[#00b894] text-black font-bold text-lg px-8 py-4 rounded-xl shadow-lg transform transition-all hover:scale-105 hover:shadow-xl"
            >
              NEW GAME
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
