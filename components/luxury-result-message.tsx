"use client"

import { useEffect, useState } from "react"
import { Trophy, Star } from "lucide-react"

interface LuxuryResultMessageProps {
  message: string
  type: "win" | "lose" | "push"
  show: boolean
  isBlackjack?: boolean
  winAmount?: number
  compact?: boolean
}

export function LuxuryResultMessage({
  message,
  type,
  show,
  isBlackjack = false,
  winAmount = 0,
  compact = false,
}: LuxuryResultMessageProps) {
  const [animate, setAnimate] = useState(false)
  const [currentMessage, setCurrentMessage] = useState("")

  const blackjackMessages = ["BLACKJACK!", "PERFECT 21!", "BLACKJACK WIN!", "NATURAL 21!", "BLACKJACK VICTORY!"]

  const regularWinMessages = ["WINNER!", "EXCELLENT!", "VICTORY!", "WELL PLAYED!", "GREAT WIN!", "SUCCESS!"]

  const pushMessages = ["PUSH!", "DRAW!", "TIE GAME!", "EVEN MATCH!"]

  useEffect(() => {
    if (show) {
      let selectedMessage = ""

      if (type === "win") {
        if (isBlackjack) {
          selectedMessage = blackjackMessages[Math.floor(Math.random() * blackjackMessages.length)]
        } else {
          selectedMessage = regularWinMessages[Math.floor(Math.random() * regularWinMessages.length)]
        }
      } else if (type === "push") {
        selectedMessage = pushMessages[Math.floor(Math.random() * pushMessages.length)]
      }

      setCurrentMessage(selectedMessage)
      setAnimate(true)
    }
  }, [show, type, isBlackjack])

  const getMessageStyle = () => {
    if (type === "win") {
      return {
        bg: isBlackjack
          ? "bg-gradient-to-r from-amber-500 to-yellow-500"
          : "bg-gradient-to-r from-emerald-500 to-teal-600",
        text: isBlackjack ? "text-black" : "text-white",
        icon: isBlackjack ? Star : Trophy,
      }
    } else if (type === "push") {
      return {
        bg: "bg-gradient-to-r from-blue-500 to-cyan-600",
        text: "text-white",
        icon: Star,
      }
    }
    return {
      bg: "bg-gradient-to-r from-gray-600 to-gray-800",
      text: "text-white",
      icon: Star,
    }
  }

  const style = getMessageStyle()
  const IconComponent = style.icon

  if (!show) return null

  // Compact version for less intrusive notifications
  if (compact) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <div
          className={`
            ${style.bg} ${style.text}
            px-6 py-3 rounded-lg shadow-lg border border-white/20
            transform transition-all duration-500 ease-out
            ${animate ? "scale-100 opacity-90" : "scale-50 opacity-0"}
          `}
        >
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">{currentMessage}</div>
            {type === "win" && winAmount > 0 && (
              <div className="text-lg font-bold opacity-90">+{winAmount.toFixed(2)} USDC</div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Full version (not used in this decluttered design)
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div
        className={`
          ${style.bg} ${style.text}
          px-8 py-4 rounded-xl shadow-xl border border-white/20
          transform transition-all duration-700 ease-out
          ${animate ? "scale-100 opacity-100" : "scale-50 opacity-0"}
        `}
      >
        <div className="text-center">
          <IconComponent className="w-8 h-8 mx-auto mb-2" />
          <div className="text-2xl font-bold mb-2">{currentMessage}</div>
          {type === "win" && winAmount > 0 && (
            <div className="text-xl font-bold opacity-90 mb-1">+{winAmount.toFixed(2)} USDC</div>
          )}
        </div>
      </div>
    </div>
  )
}
