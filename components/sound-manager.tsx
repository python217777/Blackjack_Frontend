"use client"

import { useEffect, useRef, useState } from "react"

interface SoundManagerProps {
  musicEnabled: boolean
  soundEffectsEnabled: boolean
  currentTrack: number
  onTrackEnd?: () => void
}

export function SoundManager({ musicEnabled, soundEffectsEnabled, currentTrack, onTrackEnd }: SoundManagerProps) {
  const audioContextRef = useRef<AudioContext | null>(null)
  const musicGainNodeRef = useRef<GainNode | null>(null)
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Synthesized soundtrack data - different musical themes
  const soundtracks = [
    {
      name: "Casino Lounge",
      tempo: 120,
      key: "C",
      style: "jazz",
    },
    {
      name: "High Stakes",
      tempo: 140,
      key: "Am",
      style: "electronic",
    },
    {
      name: "Vegas Nights",
      tempo: 100,
      key: "F",
      style: "ambient",
    },
  ]

  useEffect(() => {
    const initAudio = () => {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext
        audioContextRef.current = new AudioContext()

        // Create master gain node for music
        musicGainNodeRef.current = audioContextRef.current.createGain()
        musicGainNodeRef.current.connect(audioContextRef.current.destination)
        musicGainNodeRef.current.gain.setValueAtTime(0.15, audioContextRef.current.currentTime)

        setIsInitialized(true)
      } catch (e) {
        console.warn("Web Audio API not supported")
      }
    }

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
      if (currentSourceRef.current) {
        currentSourceRef.current.stop()
        currentSourceRef.current.disconnect()
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Create synthesized music
  const createSynthTrack = (trackIndex: number) => {
    if (!audioContextRef.current || !musicGainNodeRef.current || !isInitialized) return

    // Stop current track
    if (currentSourceRef.current) {
      currentSourceRef.current.stop()
      currentSourceRef.current.disconnect()
    }

    const track = soundtracks[trackIndex]
    const duration = 30 // 30 second loops

    if (track.style === "jazz") {
      createJazzTrack(duration)
    } else if (track.style === "electronic") {
      createElectronicTrack(duration)
    } else {
      createAmbientTrack(duration)
    }
  }

  const createJazzTrack = (duration: number) => {
    if (!audioContextRef.current || !musicGainNodeRef.current) return

    // Jazz chord progression: Cmaj7 - Am7 - Dm7 - G7
    const chords = [
      [261.63, 329.63, 392.0, 493.88], // Cmaj7
      [220.0, 261.63, 329.63, 415.3], // Am7
      [293.66, 349.23, 440.0, 523.25], // Dm7
      [196.0, 246.94, 293.66, 369.99], // G7
    ]

    let chordIndex = 0
    const chordDuration = 2 // 2 seconds per chord

    const playChord = (startTime: number) => {
      chords[chordIndex].forEach((freq, i) => {
        const osc = audioContextRef.current!.createOscillator()
        const gain = audioContextRef.current!.createGain()

        osc.connect(gain)
        gain.connect(musicGainNodeRef.current!)

        osc.frequency.setValueAtTime(freq, startTime)
        osc.type = "sine"

        gain.gain.setValueAtTime(0, startTime)
        gain.gain.linearRampToValueAtTime(0.03, startTime + 0.1)
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + chordDuration - 0.1)

        osc.start(startTime)
        osc.stop(startTime + chordDuration)
      })

      chordIndex = (chordIndex + 1) % chords.length
    }

    // Schedule chords
    for (let time = 0; time < duration; time += chordDuration) {
      setTimeout(() => {
        if (musicEnabled) playChord(audioContextRef.current!.currentTime)
      }, time * 1000)
    }

    // Loop the track
    setTimeout(() => {
      if (musicEnabled) createSynthTrack(currentTrack)
    }, duration * 1000)
  }

  const createElectronicTrack = (duration: number) => {
    if (!audioContextRef.current || !musicGainNodeRef.current) return

    // Electronic bass line
    const bassNotes = [110, 123.47, 130.81, 146.83] // A, B, C, D
    let noteIndex = 0

    const playBassNote = (startTime: number) => {
      const osc = audioContextRef.current!.createOscillator()
      const gain = audioContextRef.current!.createGain()

      osc.connect(gain)
      gain.connect(musicGainNodeRef.current!)

      osc.frequency.setValueAtTime(bassNotes[noteIndex], startTime)
      osc.type = "sawtooth"

      gain.gain.setValueAtTime(0, startTime)
      gain.gain.linearRampToValueAtTime(0.05, startTime + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4)

      osc.start(startTime)
      osc.stop(startTime + 0.5)

      noteIndex = (noteIndex + 1) % bassNotes.length
    }

    // Schedule bass notes
    for (let time = 0; time < duration; time += 0.5) {
      setTimeout(() => {
        if (musicEnabled) playBassNote(audioContextRef.current!.currentTime)
      }, time * 1000)
    }

    // Loop the track
    setTimeout(() => {
      if (musicEnabled) createSynthTrack(currentTrack)
    }, duration * 1000)
  }

  const createAmbientTrack = (duration: number) => {
    if (!audioContextRef.current || !musicGainNodeRef.current) return

    // Ambient pad sounds
    const padFreqs = [65.41, 82.41, 98.0, 130.81] // C2, E2, G2, C3

    padFreqs.forEach((freq, i) => {
      const osc = audioContextRef.current!.createOscillator()
      const gain = audioContextRef.current!.createGain()

      osc.connect(gain)
      gain.connect(musicGainNodeRef.current!)

      osc.frequency.setValueAtTime(freq, audioContextRef.current!.currentTime)
      osc.type = "sine"

      gain.gain.setValueAtTime(0, audioContextRef.current!.currentTime)
      gain.gain.linearRampToValueAtTime(0.02, audioContextRef.current!.currentTime + 2)
      gain.gain.setValueAtTime(0.02, audioContextRef.current!.currentTime + duration - 2)
      gain.gain.linearRampToValueAtTime(0, audioContextRef.current!.currentTime + duration)

      osc.start(audioContextRef.current!.currentTime)
      osc.stop(audioContextRef.current!.currentTime + duration)
    })

    // Loop the track
    setTimeout(() => {
      if (musicEnabled) createSynthTrack(currentTrack)
    }, duration * 1000)
  }

  // Start/stop music based on enabled state
  useEffect(() => {
    if (musicEnabled && isInitialized) {
      createSynthTrack(currentTrack)
    } else if (currentSourceRef.current) {
      currentSourceRef.current.stop()
      currentSourceRef.current.disconnect()
    }
  }, [musicEnabled, currentTrack, isInitialized])

  // Update volume
  useEffect(() => {
    if (musicGainNodeRef.current) {
      const targetVolume = musicEnabled ? 0.15 : 0
      musicGainNodeRef.current.gain.linearRampToValueAtTime(targetVolume, audioContextRef.current!.currentTime + 0.5)
    }
  }, [musicEnabled])

  // Enhanced sound effects with enable/disable
  useEffect(() => {
    if (typeof window !== "undefined") {
      const createChipSound = (chipValue: number) => {
        if (!soundEffectsEnabled || !audioContextRef.current) return

        let frequency: number
        let volume: number

        switch (chipValue) {
          case 1:
            frequency = 1200
            volume = 0.04
            break
          case 5:
            frequency = 900
            volume = 0.05
            break
          case 10:
            frequency = 700
            volume = 0.06
            break
          case 25:
            frequency = 500
            volume = 0.07
            break
          default:
            frequency = 300
            volume = 0.08
            break
        }

        const oscillator1 = audioContextRef.current.createOscillator()
        const oscillator2 = audioContextRef.current.createOscillator()
        const gainNode = audioContextRef.current.createGain()

        oscillator1.connect(gainNode)
        oscillator2.connect(gainNode)
        gainNode.connect(audioContextRef.current.destination)

        oscillator1.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime)
        oscillator1.type = "triangle"

        oscillator2.frequency.setValueAtTime(frequency * 1.5, audioContextRef.current.currentTime)
        oscillator2.type = "sine"

        gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime)
        gainNode.gain.linearRampToValueAtTime(volume, audioContextRef.current.currentTime + 0.01)
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.15)

        oscillator1.start(audioContextRef.current.currentTime)
        oscillator2.start(audioContextRef.current.currentTime)
        oscillator1.stop(audioContextRef.current.currentTime + 0.15)
        oscillator2.stop(audioContextRef.current.currentTime + 0.15)
      }

      const createTone = (frequency: number, duration: number, volume = 0.1) => {
        if (!soundEffectsEnabled || !audioContextRef.current) return

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
      ;(window as any).playChipSound = (chipValue = 5) => createChipSound(chipValue)
      ;(window as any).playCardSound = () => createTone(400, 0.15, 0.03)
      ;(window as any).playWinSound = () => {
        createTone(523, 0.2, 0.06)
        setTimeout(() => createTone(659, 0.2, 0.06), 100)
        setTimeout(() => createTone(784, 0.3, 0.06), 200)
      }
      ;(window as any).playButtonSound = () => createTone(600, 0.08, 0.04)
    }
  }, [soundEffectsEnabled])

  return null
}
