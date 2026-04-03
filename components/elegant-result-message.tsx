"use client"

import { useEffect, useState } from "react"
import { Trophy, Star, Sparkles } from "lucide-react"

interface ElegantResultMessageProps {
  show: boolean
  result: "win" | "lose" | "push"
  message: string
  winAmount?: number
  isBlackjack?: boolean
  onClose: () => void
}

export function ElegantResultMessage({
  show,
  result,
  message,
  winAmount = 0,
  isBlackjack = false,
  onClose,
}: ElegantResultMessageProps) {
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

  const getResultConfig = () => {
    if (result === "win") {
      return {
        title: isBlackjack ? "BLACKJACK!" : "WINNER!",
        subtitle: isBlackjack ? "Perfect 21!" : "Congratulations!",
        bg: isBlackjack
          ? "bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500"
          : "bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600",
        icon: isBlackjack ? Star : Trophy,
        glow: isBlackjack ? "shadow-yellow-500/50" : "shadow-emerald-500/50",
        particles: true,
      }
    } else if (result === "push") {
      return {
        title: "PUSH!",
        subtitle: "Even Match",
        bg: "bg-gradient-to-br from-blue-400 via-cyan-500 to-blue-600",
        icon: Star,
        glow: "shadow-blue-500/50",
        particles: false,
      }
    } else {
      return {
        title: "NEXT TIME!",
        subtitle: "Keep Playing",
        bg: "bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-600",
        icon: Sparkles,
        glow: "shadow-purple-500/50",
        particles: false,
      }
    }
  }

  const config = getResultConfig()
  const IconComponent = config.icon

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      {/* Particles for wins */}
      {config.particles && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            />
          ))}
        </div>
      )}

      <div
        className={`
          ${config.bg} ${config.glow}
          rounded-2xl p-8 shadow-2xl border border-white/20
          transform transition-all duration-500 max-w-sm mx-4
          ${animate ? "scale-100 opacity-100 rotate-0" : "scale-75 opacity-0 rotate-12"}
        `}
      >
        <div className="text-center text-white">
          {/* Icon */}
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <IconComponent className="w-10 h-10" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-black mb-2 tracking-wide">{config.title}</h2>

          {/* Subtitle */}
          <p className="text-lg opacity-90 mb-3">{config.subtitle}</p>

          {/* Win Amount */}
          {result === "win" && winAmount > 0 && (
            <div className="text-2xl font-bold bg-white/20 rounded-lg py-2 px-4 mb-2">+{winAmount.toFixed(2)} USDC</div>
          )}

          {/* Additional info */}
          {result === "push" && <div className="text-sm opacity-80">Bet Returned</div>}
        </div>
      </div>
    </div>
  )
}
