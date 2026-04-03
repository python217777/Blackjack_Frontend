"use client"

import { useEffect, useRef } from "react"

interface SoundEffectsProps {
  enabled?: boolean
}

export function SoundEffects({ enabled = true }: SoundEffectsProps) {
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    if (!enabled) return

    // Initialize Web Audio API
    const initAudio = () => {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext
        audioContextRef.current = new AudioContext()
      } catch (e) {
        console.warn("Web Audio API not supported")
      }
    }

    // Initialize on user interaction
    const handleUserInteraction = () => {
      initAudio()
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("touchstart", handleUserInteraction)
    }

    document.addEventListener("click", handleUserInteraction)
    document.addEventListener("touchstart", handleUserInteraction)

    return () => {
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("touchstart", handleUserInteraction)
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [enabled])

  // Create sound synthesis functions
  const createTone = (frequency: number, duration: number, volume = 0.1) => {
    if (!audioContextRef.current || !enabled) return

    const oscillator = audioContextRef.current.createOscillator()
    const gainNode = audioContextRef.current.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContextRef.current.destination)

    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime)
    oscillator.type = "sine"

    gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume, audioContextRef.current.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + duration)

    oscillator.start(audioContextRef.current.currentTime)
    oscillator.stop(audioContextRef.current.currentTime + duration)
  }

  // Create chip sound based on value - deeper for higher values
  const createChipSound = (chipValue: number) => {
    if (!audioContextRef.current || !enabled) return

    let frequency: number
    let volume: number

    switch (chipValue) {
      case 1:
        frequency = 1200 // High pitch for $1
        volume = 0.04
        break
      case 5:
        frequency = 900 // Medium-high for $5
        volume = 0.05
        break
      case 10:
        frequency = 700 // Medium for $10
        volume = 0.06
        break
      case 25:
        frequency = 500 // Lower for $25
        volume = 0.07
        break
      default:
        frequency = 300 // Very deep for MAX/high values
        volume = 0.08
        break
    }

    // Create a more complex chip sound with multiple harmonics
    const oscillator1 = audioContextRef.current.createOscillator()
    const oscillator2 = audioContextRef.current.createOscillator()
    const gainNode = audioContextRef.current.createGain()

    oscillator1.connect(gainNode)
    oscillator2.connect(gainNode)
    gainNode.connect(audioContextRef.current.destination)

    // Main frequency
    oscillator1.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime)
    oscillator1.type = "triangle"

    // Harmonic for richer sound
    oscillator2.frequency.setValueAtTime(frequency * 1.5, audioContextRef.current.currentTime)
    oscillator2.type = "sine"

    // Volume envelope
    gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume, audioContextRef.current.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.15)

    oscillator1.start(audioContextRef.current.currentTime)
    oscillator2.start(audioContextRef.current.currentTime)
    oscillator1.stop(audioContextRef.current.currentTime + 0.15)
    oscillator2.stop(audioContextRef.current.currentTime + 0.15)
  }

  // Expose sound functions globally
  useEffect(() => {
    if (typeof window !== "undefined") {
      ;(window as any).playChipSound = (chipValue = 5) => createChipSound(chipValue)
      ;(window as any).playCardSound = () => createTone(400, 0.15, 0.03)
      ;(window as any).playWinSound = () => {
        createTone(523, 0.2, 0.06) // C5
        setTimeout(() => createTone(659, 0.2, 0.06), 100) // E5
        setTimeout(() => createTone(784, 0.3, 0.06), 200) // G5
      }
      ;(window as any).playButtonSound = () => createTone(600, 0.08, 0.04)
    }
  }, [enabled])

  return null
}
