"use client"

import { useEffect, useState } from "react"

interface ResultMessageProps {
  message: string
  type: "win" | "lose" | "push"
  show: boolean
  isBlackjack?: boolean
  winAmount?: number
}

export function ResultMessage({ message, type, show, isBlackjack = false, winAmount = 0 }: ResultMessageProps) {
  const [animate, setAnimate] = useState(false)
  const [currentMessage, setCurrentMessage] = useState("")

  const blackjackMessages = [
    "🎯 BLACKJACK! Perfection Achieved!",
    "♠️ BLACKJACK! Masterful Play!",
    "🏆 BLACKJACK! Excellence Rewarded!",
    "⭐ BLACKJACK! Flawless Victory!",
    "💎 BLACKJACK! Pure Brilliance!",
  ]

  const regularWinMessages = [
    "🎉 Magnificent Victory!",
    "✨ Exceptional Play!",
    "🌟 Outstanding Win!",
    "🎊 Brilliant Strategy!",
    "💫 Superb Execution!",
    "🏅 Impressive Win!",
    "🎯 Perfect Timing!",
    "⚡ Stellar Performance!",
  ]

  const pushMessages = ["🤝 Perfectly Matched!", "⚖️ Expertly Balanced!", "🎭 Skillfully Tied!", "🎪 Evenly Contested!"]

  const motivationalMessages = [
    "🎲 The Next Hand Awaits...",
    "🎰 Fortune Favors the Bold",
    "🃏 Every Hand is a New Opportunity",
    "🎯 Focus and Fortune Will Follow",
    "⭐ Your Moment is Coming",
    "🎪 The Game Continues...",
  ]

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
      } else {
        // For losses, show motivational messages instead of negative ones
        selectedMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
      }

      setCurrentMessage(selectedMessage)
      setAnimate(true)
    }
  }, [show, type, isBlackjack])

  const getMessageStyle = () => {
    if (type === "win") {
      return {
        bg: isBlackjack
          ? "bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500"
          : "bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500",
        text: "text-black",
        shadow: isBlackjack ? "shadow-yellow-500/60" : "shadow-emerald-500/60",
        border: isBlackjack ? "border-yellow-300" : "border-emerald-300",
        glow: isBlackjack ? "shadow-yellow-400/40" : "shadow-emerald-400/40",
      }
    } else if (type === "push") {
      return {
        bg: "bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-500",
        text: "text-white",
        shadow: "shadow-cyan-500/60",
        border: "border-cyan-300",
        glow: "shadow-cyan-400/40",
      }
    } else {
      return {
        bg: "bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800",
        text: "text-white",
        shadow: "shadow-slate-500/40",
        border: "border-slate-400",
        glow: "shadow-slate-400/20",
      }
    }
  }

  const style = getMessageStyle()

  if (!show) return null

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div
        className={`
          ${style.bg} ${style.text} ${style.shadow}
          px-12 py-8 rounded-3xl shadow-2xl border-3 ${style.border}
          transform transition-all duration-1000 ease-out backdrop-blur-sm
          ${animate ? "scale-100 opacity-100 rotate-0" : "scale-50 opacity-0 rotate-12"}
        `}
        style={{
          boxShadow: `0 20px 40px ${style.glow}, 0 0 0 1px rgba(255,255,255,0.1) inset`,
        }}
      >
        <div className="text-center relative">
          {/* Decorative elements for wins */}
          {type === "win" && (
            <>
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-white/20 rounded-full animate-ping"></div>
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-white/20 rounded-full animate-ping delay-300"></div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-white/20 rounded-full animate-ping delay-150"></div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-white/20 rounded-full animate-ping delay-450"></div>
            </>
          )}

          <div className="text-4xl font-bold mb-3 tracking-wide">{currentMessage}</div>

          {type === "win" && winAmount > 0 && (
            <div className="text-2xl font-semibold opacity-90 mb-2">+{winAmount.toFixed(2)} USDC</div>
          )}

          {type === "win" && (
            <div className="text-lg opacity-80 font-medium tracking-wider">
              {isBlackjack ? "PREMIUM PAYOUT" : "WELL PLAYED"}
            </div>
          )}

          {type === "push" && <div className="text-lg opacity-80 font-medium tracking-wider">STAKE RETURNED</div>}
        </div>

        {/* Animated border for special wins */}
        {isBlackjack && <div className="absolute inset-0 rounded-3xl border-2 border-yellow-300 animate-pulse"></div>}
      </div>
    </div>
  )
}
