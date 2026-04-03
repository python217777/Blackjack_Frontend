"use client"

import { useEffect, useState } from "react"
import { Trophy, X } from "lucide-react"

interface ResultPopupProps {
  show: boolean
  result: "win" | "lose" | "push"
  message: string
  winAmount?: number
  isBlackjack?: boolean
  onClose: () => void
}

export function ResultPopup({ show, result, message, winAmount = 0, isBlackjack = false, onClose }: ResultPopupProps) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (show) {
      setAnimate(true)
      // Auto close after 3 seconds
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    } else {
      setAnimate(false)
    }
  }, [show, onClose])

  if (!show) return null

  const getPopupStyle = () => {
    switch (result) {
      case "win":
        return {
          bg: isBlackjack
            ? "bg-gradient-to-r from-yellow-500 to-amber-500"
            : "bg-gradient-to-r from-emerald-500 to-green-500",
          text: "text-white",
          icon: Trophy,
        }
      case "push":
        return {
          bg: "bg-gradient-to-r from-blue-500 to-cyan-500",
          text: "text-white",
          icon: Trophy,
        }
      default:
        return {
          bg: "bg-gradient-to-r from-gray-600 to-gray-700",
          text: "text-white",
          icon: X,
        }
    }
  }

  const style = getPopupStyle()
  const IconComponent = style.icon

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className={`
          ${style.bg} ${style.text} rounded-2xl p-8 shadow-2xl border-2 border-white/20
          transform transition-all duration-500 max-w-sm mx-4
          ${animate ? "scale-100 opacity-100" : "scale-75 opacity-0"}
        `}
      >
        <div className="text-center">
          <IconComponent className="w-16 h-16 mx-auto mb-4" />

          <h2 className="text-3xl font-bold mb-2">
            {result === "win" ? (isBlackjack ? "BLACKJACK!" : "YOU WIN!") : result === "push" ? "PUSH!" : "HOUSE WINS"}
          </h2>

          {result === "win" && winAmount > 0 && (
            <div className="text-2xl font-bold mb-2">+{winAmount.toFixed(2)} USDC</div>
          )}

          {result === "push" && <div className="text-lg opacity-90">Bet Returned</div>}

          <div className="text-lg opacity-90 mt-2">{isBlackjack ? "Perfect 21!" : message}</div>
        </div>
      </div>
    </div>
  )
}
