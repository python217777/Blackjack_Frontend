"use client"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"

interface PhotoRealisticChipProps {
  show: boolean
  result: "win" | "lose" | "push"
  message: string
  winAmount?: number
  isBlackjack?: boolean
  onClose: () => void
}

export function PhotoRealisticChip({
  show,
  result,
  message,
  winAmount = 0,
  isBlackjack = false,
  onClose,
}: PhotoRealisticChipProps) {
  const [animate, setAnimate] = useState(false)
  const [spin, setSpin] = useState(false)

  useEffect(() => {
    if (show) {
      // Start with a spin animation
      setSpin(true)
      setTimeout(() => setSpin(false), 1200)

      // Then show the chip
      setAnimate(true)

      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        onClose()
      }, 5000)
      return () => clearTimeout(timer)
    } else {
      setAnimate(false)
    }
  }, [show, onClose])

  if (!show) return null

  // Always use positive messaging
  const getResultText = () => {
    if (result === "win") {
      return isBlackjack ? "BLACKJACK!" : "WINNER!"
    } else if (result === "push") {
      return "PUSH!"
    } else {
      // For losses, use positive messaging
      return "NEXT TIME!"
    }
  }

  const getSubText = () => {
    if (result === "win") {
      return isBlackjack ? "PERFECT 21" : "CONGRATULATIONS"
    } else if (result === "push") {
      return "EVEN MATCH"
    } else {
      // Positive messaging for losses
      return "GOOD EFFORT"
    }
  }

  // Get the top text based on result
  const getTopText = () => {
    if (result === "win") {
      return "LUCKY"
    } else if (result === "push") {
      return "EVEN"
    } else {
      return "LUCKY" // Always positive
    }
  }

  // Get the bottom text
  const getBottomText = () => {
    return "VOID CASINO"
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div
        className={`
          relative w-80 h-80 transform transition-all duration-700
          ${animate ? "scale-100 opacity-100" : "scale-50 opacity-0"}
          ${spin ? "animate-spin-slow" : ""}
        `}
      >
        {/* Main Chip Circle */}
        <div className="relative w-full h-full rounded-full border-8 border-black shadow-2xl overflow-hidden">
          {/* Outer Ring Segments */}
          <div className="absolute inset-0 rounded-full">
            {/* Teal/Purple segments with black dividers */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(
                from 0deg,
                #14b8a6 0deg 45deg,
                #000 45deg 90deg,
                #a855f7 90deg 135deg,
                #000 135deg 180deg,
                #14b8a6 180deg 225deg,
                #000 225deg 270deg,
                #a855f7 270deg 315deg,
                #000 315deg 360deg
              )`,
              }}
            />
          </div>

          {/* Inner Orange Circle */}
          <div className="absolute inset-8 rounded-full bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 border-4 border-black shadow-inner">
            {/* Diamond Shape */}
            <div className="absolute inset-6 flex items-center justify-center">
              <div className="relative w-full h-full">
                {/* Diamond Background */}
                <div className="absolute inset-0 transform rotate-45 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg border-2 border-black shadow-lg" />

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
                  {/* Top Text */}
                  <div className="text-black font-black text-lg tracking-wider mb-1">{getTopText()} CHIP</div>

                  {/* Main Result */}
                  <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1 rounded-full border-2 border-white shadow-lg mb-1">
                    <div className="font-black text-sm tracking-wide">{getResultText()}</div>
                  </div>

                  {/* Subtitle */}
                  <div className="text-black font-bold text-xs tracking-wider mb-1">{getSubText()}</div>

                  {/* Win Amount */}
                  {result === "win" && winAmount > 0 && (
                    <div className="text-black font-black text-lg">+{winAmount.toFixed(2)} USDC</div>
                  )}

                  {/* Bottom Text */}
                  <div className="text-black font-black text-xs tracking-widest mt-1">{getBottomText()}</div>
                </div>

                {/* Decorative Dots */}
                {[...Array(16)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-400 rounded-full border border-yellow-600"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: `rotate(${i * 22.5}deg) translateY(-45px) translateX(-4px)`,
                      transformOrigin: "4px 45px",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Center Star */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="relative">
                {/* Yellow center */}
                <div className="absolute w-8 h-8 bg-yellow-300 rounded-full transform rotate-45"></div>

                {/* Pink outer star */}
                <div className="absolute w-12 h-12 -top-2 -left-2">
                  <Star className="w-12 h-12 text-pink-500 fill-pink-500" />
                </div>

                {/* Glow effect */}
                <div className="absolute w-16 h-16 -top-4 -left-4 bg-white/20 rounded-full blur-md animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-20 blur-xl animate-pulse" />

        {/* 3D Effect - Shadow */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-4 bg-black/40 blur-md rounded-full"></div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 1.2s ease-out;
        }
      `}</style>
    </div>
  )
}
