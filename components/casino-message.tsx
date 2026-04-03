"use client"

import { useEffect, useState } from "react"

interface CasinoMessageProps {
  show: boolean
  result: "win" | "lose" | "push"
  winAmount?: number
  isBlackjack?: boolean
  winStreak?: number
  onClose: () => void
}

export function CasinoMessage({
  show,
  result,
  winAmount = 0,
  isBlackjack = false,
  winStreak = 0,
  onClose,
}: CasinoMessageProps) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (show) {
      setAnimate(true)
      // Quick timing - wins stay longer, losses disappear fast
      const timer = setTimeout(
        () => {
          onClose()
        },
        result === "win" ? 3000 : 1500,
      )
      return () => clearTimeout(timer)
    } else {
      setAnimate(false)
    }
  }, [show, result, onClose])

  if (!show) return null

  const getMessage = () => {
    if (result === "win") {
      return isBlackjack ? "BLACKJACK!" : "YOU WIN!"
    } else if (result === "push") {
      return "PUSH"
    } else {
      return "DEALER WINS"
    }
  }

  const getSubMessage = () => {
    if (result === "win") {
      const winText = `+$${winAmount.toFixed(0)} BJ`
      if (winStreak > 1) {
        return `${winText} • ${winStreak} WIN STREAK!`
      }
      return winText
    } else if (result === "push") {
      return "Bet Returned"
    } else {
      return ""
    }
  }

  const getStyles = () => {
    if (result === "win") {
      return {
        bg: isBlackjack ? "bg-yellow-500" : "bg-green-500",
        text: "text-black",
        border: isBlackjack ? "border-yellow-300" : "border-green-300",
        glow: isBlackjack ? "shadow-yellow-500/50" : "shadow-green-500/50",
      }
    } else if (result === "push") {
      return {
        bg: "bg-blue-500",
        text: "text-white",
        border: "border-blue-300",
        glow: "shadow-blue-500/50",
      }
    } else {
      return {
        bg: "bg-gray-600",
        text: "text-white",
        border: "border-gray-400",
        glow: "shadow-gray-500/50",
      }
    }
  }

  const styles = getStyles()

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div
        className={`
          ${styles.bg} ${styles.text} ${styles.border}
          border-4 rounded-xl px-8 py-6 shadow-2xl ${styles.glow}
          transform transition-all duration-300
          ${animate ? "scale-100 opacity-100" : "scale-75 opacity-0"}
        `}
      >
        <div className="text-center">
          <div className="text-3xl font-black mb-2">{getMessage()}</div>
          {getSubMessage() && <div className="text-xl font-bold">{getSubMessage()}</div>}
        </div>
      </div>
    </div>
  )
}
