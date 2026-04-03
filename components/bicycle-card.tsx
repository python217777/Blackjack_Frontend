"use client"

import { useState, useEffect, useRef } from "react"
import type { Card } from "@/types/game"

interface BicycleCardProps {
  card: Card
  index?: number
  isDealing?: boolean
  size?: "normal" | "large"
}

export function BicycleCard({ card, index = 0, isDealing = false, size = "normal" }: BicycleCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isFlipping, setIsFlipping] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Optimized card dimensions for mobile - much smaller
  const cardWidth = size === "large" ? "w-[70px] sm:w-[110px]" : "w-[60px] sm:w-[100px]"
  const cardHeight = size === "large" ? "h-[98px] sm:h-[110px]" : "h-[84px] sm:h-[100px]"

  // Use requestAnimationFrame for smoother animations
  useEffect(() => {
    if (index > 0) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, index * 150) // Reduced delay for faster mobile experience
      return () => clearTimeout(timer)
    } else {
      setIsVisible(true)
    }
  }, [index])

  useEffect(() => {
    if (card.hidden === false && isVisible) {
      setIsFlipping(true)
      const timer = setTimeout(() => setIsFlipping(false), 400) // Reduced flip duration
      return () => clearTimeout(timer)
    }
  }, [card.hidden, isVisible])

  // Use transform for better performance
  useEffect(() => {
    if (!cardRef.current) return

    // Use hardware acceleration for animations
    if (isDealing && cardRef.current) {
      cardRef.current.style.willChange = "transform"
      return () => {
        if (cardRef.current) cardRef.current.style.willChange = "auto"
      }
    }
  }, [isDealing])

  // Performance optimization for reduced motion preference
  useEffect(() => {
    if (typeof window === "undefined") return

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (mediaQuery.matches && cardRef.current) {
      // Skip animations for users who prefer reduced motion
      setIsVisible(true)
      setIsFlipping(false)
    }
  }, [])

  useEffect(() => {
    if (isVisible && typeof window !== "undefined" && (window as any).playCardSound) {
      setTimeout(() => (window as any).playCardSound(), index * 150)
    }
  }, [isVisible, index])

  // Card back (Bicycle standard red back)
  if (card.hidden) {
    return (
      <div
        ref={cardRef}
        className={`${cardWidth} ${cardHeight} rounded-md shadow-lg transform transition-all duration-300 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        } ${isFlipping ? "animate-flip" : ""}`}
        style={{
          contain: "layout paint style",
          backfaceVisibility: "hidden",
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-purple-600 to-purple-800 border-2 border-amber-400 rounded-md flex items-center justify-center relative overflow-hidden">
          {/* BJ Coin Logo Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 left-2 w-4 h-4 bg-amber-400 rounded-full"></div>
            <div className="absolute top-2 right-2 w-4 h-4 bg-amber-400 rounded-full"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 bg-amber-400 rounded-full"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-amber-400 rounded-full"></div>
          </div>

          {/* Center BJ Coin Branding */}
          <div className="text-center">
            <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center mb-1">
              <span className="text-purple-800 font-black text-xs">BJ</span>
            </div>
            <div className="text-amber-400 font-bold text-xs">COIN</div>
          </div>
        </div>
      </div>
    )
  }

  // Card face styling
  const isRed = card.suit === "♥" || card.suit === "♦"
  const textColor = isRed ? "text-red-600" : "text-black"

  // Get suit symbol
  const getSuitSymbol = () => {
    return card.suit
  }

  // Render card content based on value
  const renderCardContent = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        {/* For face cards and aces, show larger symbols */}
        {["A", "K", "Q", "J"].includes(card.rank) ? (
          <div
            className={`${textColor} ${size === "large" ? "text-2xl sm:text-4xl" : "text-xl sm:text-3xl"} font-bold`}
          >
            {card.rank}
          </div>
        ) : (
          <div className={`${textColor} ${size === "large" ? "text-2xl sm:text-4xl" : "text-xl sm:text-3xl"}`}>
            {card.suit}
          </div>
        )}
      </div>
    )
  }

  // Clean, simple card design with bigger dimensions
  return (
    <div
      ref={cardRef}
      className={`${cardWidth} ${cardHeight} bg-white rounded-md border-2 border-gray-300 shadow-lg transform transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${isDealing ? "animate-bounce" : ""} ${isFlipping ? "animate-flip" : ""} relative`}
      style={{
        contain: "layout paint style",
        backfaceVisibility: "hidden",
      }}
    >
      {/* Top left index - smaller on mobile */}
      <div
        className={`absolute top-0.5 left-0.5 sm:top-1 sm:left-1 ${textColor} font-bold ${size === "large" ? "text-sm sm:text-lg" : "text-xs sm:text-base"} leading-none`}
      >
        <div>{card.rank}</div>
        <div>{getSuitSymbol()}</div>
      </div>

      {/* Bottom right index (inverted) - smaller on mobile */}
      <div
        className={`absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 ${textColor} font-bold ${size === "large" ? "text-sm sm:text-lg" : "text-xs sm:text-base"} leading-none transform rotate-180`}
      >
        <div>{card.rank}</div>
        <div>{getSuitSymbol()}</div>
      </div>

      {/* Card center content */}
      {renderCardContent()}
    </div>
  )
}
