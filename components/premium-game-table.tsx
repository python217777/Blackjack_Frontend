"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { BicycleCard } from "./bicycle-card"
import { CasinoMessage } from "./casino-message"
import { AnimatedBetPrompt } from "./animated-bet-prompt"
import type { GameState } from "@/types/game"

interface PremiumGameTableProps {
  gameState: GameState
  onHit: () => void
  onStand: () => void
  onDouble: () => void
  onSplit: () => void
  onNewGame: () => void
  chipStacks: { value: number; count: number }[]
  winStreak: number
  solBalance?: number
  serverSeed: string;
  serverSeedHash: string;
  clientSeed: string;
  showFairness: boolean;
  setShowFairness: (show: boolean) => void;
}

export function PremiumGameTable({
  gameState,
  onHit,
  onStand,
  onDouble,
  onSplit,
  onNewGame,
  chipStacks,
  winStreak,
  solBalance,
  serverSeed,
  serverSeedHash,
  clientSeed,
  showFairness,
  setShowFairness,
}: PremiumGameTableProps) {
  const [showResult, setShowResult] = useState(false)
  const [resultType, setResultType] = useState<"win" | "lose" | "push">("win")
  const [winAmount, setWinAmount] = useState(0)
  const [isBlackjack, setIsBlackjack] = useState(false)
  const [animateChips, setAnimateChips] = useState(false)
  const [currentDealer, setCurrentDealer] = useState(1)

  // Rotate dealer every few games for variety
  useEffect(() => {
    if (gameState.gamePhase === "betting" && gameState.currentBet === 0) {
      setCurrentDealer(Math.floor(Math.random() * 3) + 1)
    }
  }, [gameState.gamePhase, gameState.currentBet])

  useEffect(() => {
    if (gameState.gamePhase === "gameOver" && gameState.currentBet > 0) {
      let result: "win" | "lose" | "push" = "lose"
      let amount = 0
      let blackjack = false

      console.log("gameState", gameState);

      // Check for blackjack first
      const playerBlackjack = gameState.playerScore === 21 && gameState.playerHand.length === 2
      const dealerBlackjack = gameState.dealerScore === 21 && gameState.dealerHand.length === 2

      if (gameState.isSplit) {
        // For split hands, calculate total winnings
        let totalWinnings = 0
        let hasWin = false
        let hasBlackjack = false

        gameState.splitHands.forEach((hand) => {
          const handBlackjack = hand.score === 21 && hand.cards.length === 2

          if (hand.score > 21) {
            // Bust - lose bet
          } else if (handBlackjack && !dealerBlackjack) {
            // Blackjack pays 3:2
            totalWinnings += hand.bet + hand.bet * 1.5
            hasWin = true
            hasBlackjack = true
          } else if (gameState.dealerScore > 21) {
            // Dealer bust
            totalWinnings += hand.bet * 2
            hasWin = true
          } else if (hand.score > gameState.dealerScore) {
            // Win
            totalWinnings += hand.bet * 2
            hasWin = true
          } else if (hand.score === gameState.dealerScore) {
            // Push
            totalWinnings += hand.bet
          }
        })

        if (hasWin) {
          result = "win"
          amount = totalWinnings
          blackjack = hasBlackjack
        } else if (totalWinnings > 0) {
          result = "push"
          amount = totalWinnings
        } else {
          result = "lose"
          amount = 0
        }
      } else {
        // Regular hand logic
        if (gameState.playerScore > 21) {
          result = "lose"
          amount = 0
        } else if (playerBlackjack && !dealerBlackjack) {
          result = "win"
          blackjack = true
          amount = gameState.currentBet + gameState.currentBet * 1.5 // 3:2 payout
        } else if (gameState.dealerScore > 21) {
          result = "win"
          amount = gameState.currentBet * 2
        } else if (gameState.playerScore > gameState.dealerScore) {
          result = "win"
          amount = gameState.currentBet * 2
        } else if (gameState.playerScore === gameState.dealerScore) {
          result = "push"
          amount = gameState.currentBet
        } else {
          result = "lose"
          amount = 0
        }
      }

      setResultType(result)
      setWinAmount(amount)
      setIsBlackjack(blackjack)

      if (result === "win" && gameState.currentBet > 0) {
        setAnimateChips(true)
        setTimeout(() => setAnimateChips(false), 3000)
      }

      setTimeout(() => {
        setShowResult(true)
      }, 1000)
    }
  }, [
    gameState.gamePhase,
    gameState.message,
    gameState.currentBet,
    gameState.playerScore,
    gameState.dealerScore,
    gameState.isSplit,
    gameState.splitHands,
  ])

  let currentBalance = gameState.isDemo ? gameState.playerBalance : solBalance
  currentBalance = currentBalance ? currentBalance : 0
  const canDouble = gameState.playerHand.length === 2 && gameState.currentBet <= currentBalance

  useEffect(() => {
    if (showResult && resultType === "win" && typeof window !== "undefined" && (window as any).playWinSound) {
      setTimeout(() => (window as any).playWinSound(), 500)
    }
  }, [showResult, resultType])

  return (
    <div className="flex-1 flex flex-col items-center p-2 relative min-h-0">
      {/* Game Table */}
      <div
        className="relative w-full max-w-sm sm:max-w-2xl h-[90%] rounded-lg border border-amber-500/30 shadow-lg overflow-hidden"
        style={{
          background: `
             radial-gradient(ellipse at center, #1a5f4a 0%, #0d3328 70%),
             linear-gradient(45deg, transparent 30%, rgba(0,212,170,0.03) 50%, transparent 70%)
           `,
        }}
      >
        <div className="absolute top-4 right-4 z-30">
          <Button
            variant="outline"
            className="border-amber-500/70 text-amber-400 bg-transparent font-bold md:px-4 md:py-2 px-2 py-1 md:h-10 h-8 rounded-lg shadow hover:bg-amber-500/10 transition hover:text-white"
            onClick={() => setShowFairness(true)}
          >
            Fairness
          </Button>
        </div>
        {/* Dealer Section with Avatar */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          {/* AI Dealer Avatar */}
          <div className="flex flex-col items-center mb-4">
            <div className="relative">
              <img
                src={`/images/dealer-${currentDealer}.png`}
                alt="AI Dealer"
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-amber-500/50 shadow-lg object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-emerald-500 rounded-full border border-black flex items-center justify-center">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="text-xs text-amber-400 font-medium mt-1">AI Dealer</div>
          </div>

          <div className="text-center mb-3">
            <div className="bg-black/60 rounded-md px-4 py-1 inline-block">
              <div className="text-sm sm:text-lg font-bold text-white">DEALER</div>
              <div className="text-lg sm:text-xl text-amber-400 font-bold">
                {gameState.dealerScore > 0 ? gameState.dealerScore : "?"}
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            {gameState.dealerHand.map((card, index) => (
              <div key={`dealer-${index}`} className="scale-75 sm:scale-100">
                <BicycleCard card={card} index={index} isDealing={gameState.gamePhase === "dealing"} size="normal" />
              </div>
            ))}
          </div>
        </div>

        {/* Center Area */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <AnimatedBetPrompt
            show={gameState.gamePhase === "betting" && gameState.currentBet === 0 && chipStacks.length === 0}
          />

          {/* Game Status Messages */}
          {gameState.gamePhase === "player" && !gameState.isSplit && (
            <div className="bg-black/70 rounded-md px-4 py-2 text-center">
              <div className="text-lg font-bold text-white">Hit or Stand?</div>
            </div>
          )}

          {gameState.gamePhase === "dealing" && (
            <div className="bg-black/70 rounded-md px-4 py-2 text-center">
              <div className="text-lg font-bold text-emerald-400">Dealing...</div>
            </div>
          )}
        </div>

        {/* LARGER Chip Stacks Display - On Table */}
        {chipStacks.length > 0 && (
          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-15">
            <div className="flex gap-4 items-end justify-center">
              {chipStacks.map((chipStack, stackIndex) => (
                <div key={`persistent-stack-${chipStack.value}-${stackIndex}`} className="relative">
                  {/* Stack of chips with realistic stacking - LARGER SIZE */}
                  {Array.from({ length: Math.min(chipStack.count, 8) }).map((_, chipIndex) => (
                    <div
                      key={`chip-${chipIndex}`}
                      className="absolute"
                      style={{
                        bottom: `${chipIndex * 4}px`, // Increased spacing
                        zIndex: chipIndex + 10,
                        transform: `rotate(${(chipIndex * 7) % 360}deg)`,
                        left: `${Math.sin(chipIndex * 0.5) * 3}px`, // Increased offset
                      }}
                    >
                      {/* INCREASED SCALE - from scale-75 to scale-100 */}
                      <div className="scale-100 transition-all duration-300">
                        <div
                          className={`
                            w-16 h-16 rounded-full flex flex-col items-center justify-center
                            border-4 shadow-lg font-bold relative overflow-hidden
                            ${chipStack.value === 1
                              ? "bg-white text-black border-gray-400"
                              : chipStack.value === 5
                                ? "bg-red-600 text-white border-red-800"
                                : chipStack.value === 10
                                  ? "bg-blue-600 text-white border-blue-800"
                                  : chipStack.value === 25
                                    ? "bg-green-600 text-white border-green-800"
                                    : "bg-purple-600 text-white border-purple-800"
                            }
                          `}
                        >
                          {/* BJ Coin segments */}
                          <div className="absolute inset-0 rounded-full">
                            {[...Array(8)].map((_, i) => (
                              <div
                                key={i}
                                className="absolute w-3 h-full bg-black/10"
                                style={{
                                  transform: `rotate(${i * 22.5}deg)`,
                                  transformOrigin: "center center",
                                }}
                              />
                            ))}
                          </div>

                          <div className="relative z-10">
                            <div className="text-sm font-bold leading-none">${chipStack.value}</div>
                            <div className="text-xs opacity-90 leading-none">BJ</div>
                          </div>

                          {/* 3D effect */}
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-black/20"></div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Count indicator for large stacks */}
                  {chipStack.count > 8 && (
                    <div className="absolute -top-2 -right-1 bg-amber-500 text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center z-30">
                      {chipStack.count}
                    </div>
                  )}

                  {/* Invisible spacer for layout - INCREASED SIZE */}
                  <div className="w-16 h-16 opacity-0"></div>
                </div>
              ))}
            </div>

            {/* Total bet display under chips */}
            {/* <div className="text-center mt-3">
              <div className="bg-black/60 backdrop-blur-sm rounded-md px-4 py-2 inline-block border border-amber-500/50">
                <div className="text-amber-400 font-bold text-base">
                  ${chipStacks.reduce((total, stack) => total + stack.value * stack.count, 0)} BJ
                </div>
              </div>
            </div> */}
          </div>
        )}

        {/* Player Section */}
        <div className="absolute bottom-16 sm:bottom-20 left-1/2 transform -translate-x-1/2 z-10">
          {/* Regular Hand Display */}
          {!gameState.isSplit && (
            <>
              <div className="flex gap-2 justify-center mb-3">
                {gameState.playerHand.map((card, index) => (
                  <div key={`player-${index}`} className="scale-75 sm:scale-100">
                    <BicycleCard
                      card={card}
                      index={index}
                      isDealing={gameState.gamePhase === "dealing"}
                      size="normal"
                    />
                  </div>
                ))}
              </div>

              {(gameState.currentBet > 0 || gameState.playerHand.length > 0) && (
                <div className="text-center">
                  <div className="bg-black/60 rounded-md px-4 py-1 inline-block">
                    <div className="text-sm sm:text-lg font-bold text-white">YOU</div>
                    <div className="text-lg sm:text-xl text-amber-400 font-bold">{gameState.playerScore}</div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Split Hands Display */}
          {gameState.isSplit && gameState.splitHands.length > 0 && (
            <div className="flex gap-8 justify-center overflow-x-auto">
              {gameState.splitHands.map((hand, index) => (
                <div key={`split-hand-${index}`} className="flex flex-col items-center min-w-0 flex-shrink-0">
                  <div className="flex gap-1 justify-center mb-1">
                    {hand.cards.map((card, cardIndex) => (
                      <div key={`split-${index}-${cardIndex}`} className="scale-75">
                        <BicycleCard
                          card={card}
                          index={cardIndex}
                          isDealing={gameState.gamePhase === "dealing"}
                          size="normal"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="text-center">
                    <div
                      className={`bg-black/60 rounded-md px-3 py-1 inline-block text-sm ${gameState.activeSplitHand === index ? "border border-amber-400" : ""
                        }`}
                    >
                      <div className="font-bold text-white">Hand {index + 1}</div>
                      <div className="text-amber-400 font-bold">{hand.score}</div>
                      {hand.isComplete && <div className="text-xs text-gray-400">Complete</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {gameState.gamePhase === "player" && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
            <Button
              onClick={onHit}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-md"
            >
              HIT
            </Button>
            <Button onClick={onStand} className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-md">
              STAND
            </Button>
            {canDouble && (
              <Button
                onClick={onDouble}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-md"
              >
                DOUBLE
              </Button>
            )}
            {gameState.canSplit && !gameState.isSplit && (
              <Button
                onClick={onSplit}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-md"
              >
                SPLIT
              </Button>
            )}
          </div>
        )}
      </div>

      <CasinoMessage
        show={showResult}
        result={resultType}
        winAmount={winAmount}
        isBlackjack={isBlackjack}
        winStreak={winStreak}
        onClose={() => setShowResult(false)}
      />
    </div>
  )
}
