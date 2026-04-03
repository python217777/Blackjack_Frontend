"use client"

import { Button } from "@/components/ui/button1"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { Copy, Check, ArrowRight, X, AlertTriangle, Wallet } from "lucide-react"
import { useRouter } from "next/navigation";

interface HeroProps {
  onStartDemo?: () => void;
}

export function Hero({ onStartDemo }: HeroProps = {}) {
  // const router = useRouter();
  // const goToGame = () => {
  //   router.push("/blackjack-game");
  // };
  const [isCopied, setIsCopied] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showRiskPopup, setShowRiskPopup] = useState(false)
  const [showAlternateCard, setShowAlternateCard] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const riskAudioRef = useRef<HTMLAudioElement | null>(null)

  const contractAddress = "BJ7xK9mP4vN2wQ8rL5tH3cF6dS1aE9uY2bG4hJ8kM3nP"

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const toggleAudio = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  useEffect(() => {
    const getRandomInterval = () => {
      return Math.floor(Math.random() * (8000 - 3000 + 1)) + 3000
    }

    const scheduleNextFlip = () => {
      const interval = getRandomInterval()
      return setTimeout(() => {
        setShowAlternateCard((prev) => !prev)
        scheduleNextFlip()
      }, interval)
    }

    const timeoutId = scheduleNextFlip()

    return () => {
      clearTimeout(timeoutId)
    }
  }, [])

  useEffect(() => {
    audioRef.current = new Audio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChudBob%20SoyPants%20OST%20-%20Main%20Theme%20%28Nintendo%20DS%29-RvubaYlB4qjUR3FH70z1an2rezurcG.mp3")
    audioRef.current.loop = true

    riskAudioRef.current = new Audio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WASO%20BEECONNEE-RTlLNCslbSiwZASEVCCEtIF1jWrGDh.mp3")
    riskAudioRef.current.loop = true

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (riskAudioRef.current) {
        riskAudioRef.current.pause()
        riskAudioRef.current.currentTime = 0
      }
    }
  }, [])

  useEffect(() => {
    if (showRiskPopup && riskAudioRef.current) {
      riskAudioRef.current.play()
    } else if (!showRiskPopup && riskAudioRef.current) {
      riskAudioRef.current.pause()
      riskAudioRef.current.currentTime = 0
    }
  }, [showRiskPopup])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-[#0a1f15] to-black px-4 py-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#4ade80]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0a5c38]/20 rounded-full blur-3xl" />

        <div className="absolute top-1/4 left-1/3 opacity-5 animate-float-slow">
          <Image src="/images/brand-logo-bg.png" alt="" width={100} height={100} className="w-20 md:w-24 rotate-12" />
        </div>
        <div className="absolute top-1/3 right-1/4 opacity-5 animate-float-medium">
          <Image src="/images/brand-logo-bg.png" alt="" width={120} height={120} className="w-24 md:w-28 -rotate-6" />
        </div>
        <div className="absolute bottom-1/3 left-1/4 opacity-5 animate-float-fast">
          <Image src="/images/brand-logo-bg.png" alt="" width={80} height={80} className="w-16 md:w-20 rotate-45" />
        </div>
        <div className="absolute bottom-1/4 right-1/3 opacity-5 animate-float-slow">
          <Image src="/images/brand-logo-bg.png" alt="" width={90} height={90} className="w-18 md:w-22 -rotate-12" />
        </div>
        <div className="absolute top-2/3 left-1/2 opacity-5 animate-float-medium">
          <Image src="/images/brand-logo-bg.png" alt="" width={70} height={70} className="w-14 md:w-18 rotate-90" />
        </div>
        {/* End of added brand logos */}

        <div className="absolute top-1/4 left-1/4 opacity-10 animate-float-slow">
          <Image
            src="/images/jack-spades-vintage.png"
            alt=""
            width={120}
            height={180}
            className="w-24 md:w-32 rotate-12"
          />
        </div>
        <div className="absolute bottom-1/4 right-1/4 opacity-10 animate-float-medium">
          <Image
            src="/images/jack-hearts-vintage.png"
            alt=""
            width={120}
            height={180}
            className="w-24 md:w-32 -rotate-12"
          />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-none">
                <span
                  className="text-orange-500 cursor-pointer hover:text-orange-400 transition-colors inline-block hover:scale-105 transform duration-200"
                  onClick={() => setShowRiskPopup(true)}
                  title="Click to learn about risks"
                >
                  Risk.
                </span>
                <br />
                <span
                  className="text-[#fbbf24] cursor-pointer hover:text-[#f59e0b] transition-colors inline-block hover:scale-105 transform duration-200"
                  onClick={toggleAudio}
                  title={isPlaying ? "Click to stop music" : "Click to play music"}
                >
                  Play.
                </span>
                <br />
                <span className="text-[#4ade80]">Win.</span>
              </h1>
              <p className="text-2xl md:text-3xl text-white/70 leading-relaxed max-w-xl m-3xl">
                The first fully onchain blackjack experience. Chips shown as $1-100 represent $100 worth of $BJ tokens
                at trade time.
              </p>
              <p className="text-sm text-white/50 italic">
                $BJ tokens can be traded on{" "}
                <a
                  href="https://pump.swap"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4ade80] hover:text-[#3bc66d] underline transition-colors"
                >
                  Pump Swap
                </a>
              </p>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/5 backdrop-blur-sm border border-white/10 max-w-fit">
              <div className="flex-1">
                <p className="text-xs text-white/50 mb-1">Contract Address</p>
                <p className="font-mono text-sm text-white/90">{contractAddress.slice(0, 20)}...</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-[#4ade80] hover:text-[#4ade80] hover:bg-[#4ade80]/10"
                onClick={handleCopyAddress}
              >
                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>

            <div className="flex sm:flex-row gap-4 m-fullW">
              <Button
                onClick={onStartDemo}
                size="lg"
                className="m-radius bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-bold text-lg px-8 py-6 shadow-2xl hover:shadow-[#fbbf24]/20 transition-all group flex-shrink-0 w-40"
              >
                <div className="flex items-center">
                  Play Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Button>
              <Button
                size="lg"
                className="m-radius bg-[#10b981] hover:bg-[#059669] text-white font-bold text-lg px-8 py-6 shadow-2xl hover:shadow-[#10b981]/20 transition-all flex-shrink-0 w-40"
                asChild
              >
                <a href="https://pump.swap" target="_blank" rel="noopener noreferrer">
                  Buy $BJ
                </a>
              </Button>
            </div>

            <div className="flex flex-wrap gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold text-white">$1-100</p>
                <p className="text-sm text-white/60">Bet Range</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#4ade80]">Instant</p>
                <p className="text-sm text-white/60">Payouts</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#d4af37]">100%</p>
                <p className="text-sm text-white/60">Fair Launch</p>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute inset-0 bg-[#4ade80]/20 blur-3xl rounded-full scale-150 animate-pulse-glow" />

              <div
                className="relative transform hover:scale-105 transition-transform duration-500 animate-tilt"
                style={{ perspective: "1000px" }}
              >
                <Image
                  src={showAlternateCard ? "/images/jack-spades-red-back.png" : "/images/jack-hearts-hero.png"}
                  alt={showAlternateCard ? "Jack of Spades" : "Jack of Hearts"}
                  width={400}
                  height={600}
                  className="rounded-2xl shadow-2xl w-[300px] md:w-[400px] relative z-10"
                  priority
                />
              </div>

              <div className="absolute -top-8 -left-8 animate-float-slow hover:scale-110 transition-transform cursor-pointer">
                <Image
                  src="/images/bj-chip-logo.png"
                  alt="BJ Chip"
                  width={80}
                  height={80}
                  className="w-20 h-20 drop-shadow-2xl"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 animate-float-medium hover:scale-110 transition-transform cursor-pointer">
                <Image
                  src="/images/chip-1-dollar.png"
                  alt="Dollar Chip"
                  width={80}
                  height={80}
                  className="w-20 h-20 drop-shadow-2xl"
                />
              </div>
              <div className="absolute top-1/2 -right-12 animate-float-fast hover:scale-110 transition-transform cursor-pointer">
                <Image
                  src="/images/bj-chip-55.png"
                  alt="Chip"
                  width={60}
                  height={60}
                  className="w-16 h-16 drop-shadow-2xl"
                />
              </div>

              <div className="absolute top-10 -left-16 animate-float-medium opacity-80 hover:scale-110 transition-transform cursor-pointer hidden md:block">
                <Image
                  src="/images/chip-1-dollar.png"
                  alt="Chip"
                  width={60}
                  height={60}
                  className="w-14 h-14 drop-shadow-2xl"
                />
              </div>
              <div className="absolute bottom-1/3 -left-6 animate-float-fast opacity-70 hover:scale-110 transition-transform cursor-pointer">
                <Image
                  src="/images/bj-chip-55.png"
                  alt="Chip"
                  width={50}
                  height={50}
                  className="w-12 h-12 drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showRiskPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md"
          onClick={() => setShowRiskPopup(false)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-black border border-orange-500/20 rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5 rounded-2xl pointer-events-none" />

            <button
              onClick={() => setShowRiskPopup(false)}
              className="absolute top-4 right-4 z-20 text-white/40 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative z-10 p-8 md:p-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-3xl font-bold text-orange-500">High Risk Warning</h3>
              </div>

              <div className="mb-6 p-5 bg-orange-500/5 border border-orange-500/20 rounded-xl">
                <p className="text-lg text-white font-semibold">
                  You are gambling with meme coins on an experimental platform.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <h4 className="text-white/90 font-bold text-lg">Understand These Risks:</h4>
                <div className="space-y-3">
                  <div className="flex gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-orange-500 font-bold flex-shrink-0">•</span>
                    <p className="text-white/70 text-sm">
                      <strong className="text-white">Extreme Volatility:</strong> Meme coin values can change
                      dramatically in seconds
                    </p>
                  </div>
                  <div className="flex gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-orange-500 font-bold flex-shrink-0">•</span>
                    <p className="text-white/70 text-sm">
                      <strong className="text-white">Total Loss Possible:</strong> You may lose 100% of funds you
                      deposit
                    </p>
                  </div>
                  <div className="flex gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-orange-500 font-bold flex-shrink-0">•</span>
                    <p className="text-white/70 text-sm">
                      <strong className="text-white">Unregulated Markets:</strong> No investor protections or guarantees
                    </p>
                  </div>
                  <div className="flex gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-orange-500 font-bold flex-shrink-0">•</span>
                    <p className="text-white/70 text-sm">
                      <strong className="text-white">Smart Contract Risks:</strong> Technical vulnerabilities may exist
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6 p-5 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex gap-3">
                  <Wallet className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-blue-400 font-bold mb-2">Security First</h4>
                    <p className="text-white/70 text-sm leading-relaxed">
                      Create a new wallet before connecting. Never use your main wallet to protect your primary
                      holdings.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg mb-6">
                <p className="text-red-400 text-sm text-center font-medium">
                  Only gamble what you can afford to lose completely. This is entertainment, not investment.
                </p>
              </div>

              <Button
                onClick={() => setShowRiskPopup(false)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all"
              >
                I Understand the Risks
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
