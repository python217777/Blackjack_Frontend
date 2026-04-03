"use client"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"

interface VegasResultPopupProps {
  show: boolean
  result: "win" | "lose" | "push"
  message: string
  winAmount?: number
  isBlackjack?: boolean
  onClose: () => void
}

export function VegasResultPopup({
  show,
  result,
  message,
  winAmount = 0,
  isBlackjack = false,
  onClose,
}: VegasResultPopupProps) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (show) {
      setAnimate(true)
      // Auto close after 4 seconds for slower gameplay
      const timer = setTimeout(() => {
        onClose()
      }, 4000)
      return () => clearTimeout(timer)
    } else {
      setAnimate(false)
    }
  }, [show, onClose])

  if (!show) return null

  const getResultText = () => {
    if (result === "win") {
      return isBlackjack ? "BLACKJACK!" : "WINNER!"
    } else if (result === "push") {
      return "PUSH!"
    } else {
      return "HOUSE WINS"
    }
  }

  const getSubText = () => {
    if (result === "win") {
      return isBlackjack ? "NATURAL 21" : "CONGRATULATIONS"
    } else if (result === "push") {
      return "TIE GAME"
    } else {
      return "BETTER LUCK NEXT TIME"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div
        className={`
          relative w-80 h-80 transform transition-all duration-700
          ${animate ? "scale-100 opacity-100 rotate-0" : "scale-50 opacity-0 rotate-45"}
        `}
      >
        {/* Main Chip Circle */}
        <div className="relative w-full h-full rounded-full border-8 border-black shadow-2xl overflow-hidden">
          {/* Outer Ring Segments */}
          <div className="absolute inset-0 rounded-full">
            {/* Teal segments */}
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
                  <div className="text-black font-black text-lg tracking-wider mb-1">
                    {result === "win" ? "LUCKY" : result === "push" ? "EVEN" : "UNLUCKY"}
                  </div>

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
                  <div className="text-black font-black text-xs tracking-widest mt-1">VOID CASINO</div>
                </div>

                {/* Decorative Dots */}
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-400 rounded-full border border-yellow-600"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: `rotate(${i * 30}deg) translateY(-45px) translateX(-4px)`,
                      transformOrigin: "4px 45px",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Center Star */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <Star className="w-8 h-8 text-yellow-300 fill-yellow-300 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-20 blur-xl animate-pulse" />
      </div>
    </div>
  )
}
