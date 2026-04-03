"use client"

import { useState, useEffect } from "react"
import type { Card } from "@/types/game"

interface PlayingCardProps {
  card: Card
  index?: number
  isDealing?: boolean
}

export function PlayingCard({ card, index = 0, isDealing = false }: PlayingCardProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, index * 200)
    return () => clearTimeout(timer)
  }, [index])

  if (card.hidden) {
    return (
      <div
        className={`w-24 h-36 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-xl border-2 border-blue-300 shadow-2xl flex items-center justify-center transform transition-all duration-500 hover:scale-105 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
            linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%)
          `,
        }}
      >
        <div className="relative">
          <div className="w-12 h-12 bg-white rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-white rounded-full opacity-10"></div>
        </div>
      </div>
    )
  }

  const isRed = card.suit === "♥" || card.suit === "♦"
  const suitColor = isRed ? "text-red-500" : "text-gray-800"

  return (
    <div
      className={`w-24 h-36 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 shadow-2xl flex flex-col items-center justify-between p-2 transform transition-all duration-500 hover:scale-105 hover:shadow-3xl ${
        isVisible ? "translate-y-0 opacity-100 rotate-0" : "translate-y-4 opacity-0 -rotate-12"
      } ${isDealing ? "animate-bounce" : ""}`}
      style={{
        boxShadow: "0 10px 25px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1) inset",
      }}
    >
      {/* Top corner */}
      <div className={`text-sm font-bold ${suitColor} flex flex-col items-center leading-none`}>
        <div className="text-lg">{card.rank}</div>
        <div className="text-xl">{card.suit}</div>
      </div>

      {/* Center suit */}
      <div className={`text-4xl ${suitColor} drop-shadow-sm`}>{card.suit}</div>

      {/* Bottom corner (rotated) */}
      <div className={`text-sm font-bold ${suitColor} flex flex-col items-center leading-none transform rotate-180`}>
        <div className="text-lg">{card.rank}</div>
        <div className="text-xl">{card.suit}</div>
      </div>
    </div>
  )
}
