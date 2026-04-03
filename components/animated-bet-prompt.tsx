"use client"

import { useEffect, useState } from "react"

interface AnimatedBetPromptProps {
  show: boolean
}

export function AnimatedBetPrompt({ show }: AnimatedBetPromptProps) {
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    if (show) {
      const interval = setInterval(() => {
        setPulse(true)
        setTimeout(() => setPulse(false), 1000)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [show])

  if (!show) return null

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 px-2 sm:px-4">
      <div
        className={`
        bg-gradient-to-r from-amber-500/20 to-amber-600/20 
        border-2 border-amber-500/50 rounded-xl px-3 sm:px-12 py-1.5 sm:py-4 min-w-[200px] sm:min-w-[300px]
        backdrop-blur-sm transition-all duration-1000
        ${pulse ? "scale-105 sm:scale-110 border-amber-400 shadow-amber-500/50 shadow-lg" : "scale-100"}
      `}
      >
        <div className="text-center">
          <div className="text-sm sm:text-2xl font-bold text-amber-400 mb-0.5 sm:mb-2 animate-pulse">
            PLACE YOUR BET
          </div>
          <div className="text-xs text-amber-300/80">Choose chips below</div>
        </div>
      </div>
    </div>
  )
}
