"use client"

import { useEffect, useState } from "react"
import { Trophy, Star, Sparkles } from "lucide-react"

interface Confetti {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  rotation: number
  rotationSpeed: number
}

interface WinCelebrationProps {
  show: boolean
  isBlackjack?: boolean
  winAmount: number
}

export function WinCelebration({ show, isBlackjack = false, winAmount }: WinCelebrationProps) {
  const [confetti, setConfetti] = useState<Confetti[]>([])

  useEffect(() => {
    if (show) {
      // Create confetti particles
      const particles: Confetti[] = []
      const colors = isBlackjack
        ? ["#fbbf24", "#f59e0b", "#d97706", "#92400e"]
        : ["#10b981", "#059669", "#047857", "#065f46"]

      for (let i = 0; i < 50; i++) {
        particles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: -10,
          vx: (Math.random() - 0.5) * 10,
          vy: Math.random() * 5 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
        })
      }
      setConfetti(particles)

      // Animate confetti
      const animate = () => {
        setConfetti((prev) =>
          prev
            .map((particle) => ({
              ...particle,
              x: particle.x + particle.vx,
              y: particle.y + particle.vy,
              vy: particle.vy + 0.2, // gravity
              rotation: particle.rotation + particle.rotationSpeed,
            }))
            .filter((particle) => particle.y < window.innerHeight + 50),
        )
      }

      const interval = setInterval(animate, 16)

      // Clear after 5 seconds
      setTimeout(() => {
        clearInterval(interval)
        setConfetti([])
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [show, isBlackjack])

  if (!show) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Confetti */}
      {confetti.map((particle) => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            borderRadius: Math.random() > 0.5 ? "50%" : "0%",
          }}
        />
      ))}

      {/* Celebration Text - Only show win messages */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-center">
        <div
          className={`text-6xl font-black mb-4 animate-bounce ${isBlackjack ? "text-yellow-400" : "text-emerald-400"}`}
        >
          {isBlackjack ? (
            <Star className="w-16 h-16 mx-auto mb-2 fill-current" />
          ) : (
            <Trophy className="w-16 h-16 mx-auto mb-2" />
          )}
          {isBlackjack ? "BLACKJACK!" : "BIG WIN!"}
        </div>
        <div className="text-4xl font-bold text-white mb-2">+{winAmount.toFixed(2)} USDC</div>
        <div className="text-xl text-gray-300">Congratulations!</div>
      </div>

      {/* Sparkle Effects */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <Sparkles
            key={i}
            className={`absolute w-6 h-6 ${isBlackjack ? "text-yellow-400" : "text-emerald-400"} animate-ping`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random()}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
