"use client"

import { useEffect, useState } from "react"

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
  color: string
  size: number
}

export function CelebrationEffect() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    // Create fewer particles for less visual clutter
    const initialParticles: Particle[] = []
    const colors = ["#fbbf24", "#f59e0b", "#10b981", "#059669"]

    for (let i = 0; i < 30; i++) {
      initialParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 10,
        vx: (Math.random() - 0.5) * 4,
        vy: -Math.random() * 8 - 2,
        life: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 2,
      })
    }
    setParticles(initialParticles)

    // Animation loop
    const animate = () => {
      setParticles((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.2, // gravity
            life: particle.life - 0.02, // faster fade out
            size: particle.size * 0.99, // shrink over time
          }))
          .filter((particle) => particle.life > 0),
      )
    }

    const interval = setInterval(animate, 16)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-40 opacity-70">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.life,
          }}
        />
      ))}
    </div>
  )
}
