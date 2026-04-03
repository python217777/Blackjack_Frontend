"use client"

import { useState, useEffect } from "react"
import type { Card } from "@/types/game"

interface PremiumCardProps {
  card: Card
  index?: number
  isDealing?: boolean
  size?: "normal" | "large"
}

export function PremiumCard({ card, index = 0, isDealing = false, size = "normal" }: PremiumCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isFlipping, setIsFlipping] = useState(false)

  const cardSize = size === "large" ? "w-24 h-36" : "w-20 h-30"

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, index * 200)
    return () => clearTimeout(timer)
  }, [index])

  useEffect(() => {
    if (card.hidden === false && isVisible) {
      setIsFlipping(true)
      setTimeout(() => setIsFlipping(false), 600)
    }
  }, [card.hidden, isVisible])

  if (card.hidden) {
    return (
      <div
        className={`${cardSize} bg-gradient-to-br from-blue-900 via-indigo-800 to-blue-900 rounded-lg border border-amber-400/30 shadow-lg flex items-center justify-center transform transition-all duration-500 hover:scale-105 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        } ${isFlipping ? "animate-spin" : ""}`}
        style={{
          backgroundImage: `
            radial-gradient(circle at 30% 30%, rgba(255,215,0,0.1) 0%, transparent 50%),
            linear-gradient(45deg, transparent 30%, rgba(255,215,0,0.05) 50%, transparent 70%)
          `,
          boxShadow: "0 10px 25px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,215,0,0.2) inset",
        }}
      >
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full opacity-30 animate-pulse"></div>
        </div>
      </div>
    )
  }

  const isRed = card.suit === "♥" || card.suit === "♦"
  const suitColor = isRed ? "text-red-600" : "text-gray-900"

  return (
    <div
      className={`${cardSize} bg-gradient-to-br from-white via-gray-50 to-white rounded-lg border border-amber-400/20 shadow-lg flex flex-col items-center justify-between p-2 transform transition-all duration-500 hover:scale-105 ${
        isVisible ? "translate-y-0 opacity-100 rotate-0" : "translate-y-4 opacity-0 -rotate-12"
      } ${isDealing ? "animate-bounce" : ""} ${isFlipping ? "animate-spin" : ""}`}
      style={{
        boxShadow: "0 10px 25px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,215,0,0.1) inset",
      }}
    >
      {/* Top corner */}
      <div
        className={`${size === "large" ? "text-base" : "text-sm"} font-bold ${suitColor} flex flex-col items-center leading-none`}
      >
        <div className={size === "large" ? "text-xl" : "text-lg"}>{card.rank}</div>
        <div className={size === "large" ? "text-2xl" : "text-xl"}>{card.suit}</div>
      </div>

      {/* Center suit */}
      <div className={`${size === "large" ? "text-4xl" : "text-3xl"} ${suitColor} drop-shadow-md`}>{card.suit}</div>

      {/* Bottom corner (rotated) */}
      <div
        className={`${size === "large" ? "text-base" : "text-sm"} font-bold ${suitColor} flex flex-col items-center leading-none transform rotate-180`}
      >
        <div className={size === "large" ? "text-xl" : "text-lg"}>{card.rank}</div>
        <div className={size === "large" ? "text-2xl" : "text-xl"}>{card.suit}</div>
      </div>
    </div>
  )
}
