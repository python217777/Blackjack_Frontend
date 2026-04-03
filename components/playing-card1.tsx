"use client"

import { cn } from "@/lib/utils"

interface PlayingCardProps {
  suit: "hearts" | "spades" | "diamonds" | "clubs"
  value: string
  className?: string
  delay?: number
}

export function PlayingCard({ suit, value, className, delay = 0 }: PlayingCardProps) {
  const suitSymbols = {
    hearts: "♥",
    spades: "♠",
    diamonds: "♦",
    clubs: "♣",
  }

  const suitColors = {
    hearts: "text-destructive",
    spades: "text-black",
    diamonds: "text-destructive",
    clubs: "text-black",
  }

  return (
    <div
      className={cn(
        "w-20 h-28 bg-white rounded-lg shadow-2xl flex flex-col items-center justify-between p-2 border-2 border-gray-200",
        "hover:scale-110 transition-transform duration-300",
        className,
      )}
      style={{
        animationDelay: `${delay}s`,
      }}
    >
      <div className="flex flex-col items-center">
        <span className={cn("text-2xl font-bold", suitColors[suit])}>{value}</span>
        <span className={cn("text-3xl", suitColors[suit])}>{suitSymbols[suit]}</span>
      </div>
      <div className="flex flex-col items-center rotate-180">
        <span className={cn("text-2xl font-bold", suitColors[suit])}>{value}</span>
        <span className={cn("text-3xl", suitColors[suit])}>{suitSymbols[suit]}</span>
      </div>
    </div>
  )
}
