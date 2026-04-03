"use client"

import type React from "react"
import Image from "next/image"
import { TrendingUp, Flame, Users } from "lucide-react"

interface TokenomicsProps {
  learnMoreButton?: React.ReactNode
  onStartDemo?: () => void
}

export function Tokenomics({ learnMoreButton, onStartDemo }: TokenomicsProps) {
  return (
    <section className="relative py-24 px-4 bg-black overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4ade80]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 m-5xl m-h2">
            He Who Dares in the <span className="text-[#4ade80]">$BJ</span> Ecosystem...
          </h2>
          <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
            A revolutionary tokenomics model where every hand played benefits the entire community
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* When You Win */}
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-[#4ade80]/20 hover:border-[#4ade80]/40 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#4ade80]/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#4ade80]" />
              </div>
              <h3 className="text-2xl font-bold text-white">When You Win</h3>
            </div>
            <div className="space-y-4">
              <p className="text-white/70 leading-relaxed">
                Your personal victory means instant payouts in $BJ tokens. You walk away with real value that can be
                traded immediately on Pump Swap.
              </p>
              <div className="bg-black/30 p-4 rounded-xl border border-white/10">
                <p className="text-sm text-white/50 mb-2">Economic Effect:</p>
                <p className="text-white/80">
                  More tokens enter circulation, creating liquidity and making entry more accessible for new players.
                </p>
              </div>
            </div>
          </div>

          {/* When You Lose */}
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-[#d4af37]/20 hover:border-[#d4af37]/40 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#d4af37]/10 rounded-xl flex items-center justify-center">
                <Flame className="w-6 h-6 text-[#d4af37]" />
              </div>
              <h3 className="text-2xl font-bold text-white">When You Lose</h3>
            </div>
            <div className="space-y-4">
              <p className="text-white/70 leading-relaxed">
                Your bet tokens are removed from circulation, creating scarcity. All $BJ holders benefit as the
                remaining supply becomes more valuable.
              </p>
              <div className="bg-black/30 p-4 rounded-xl border border-white/10">
                <p className="text-sm text-white/50 mb-2">Economic Effect:</p>
                <p className="text-white/80">
                  Deflationary pressure increases token value for all holders. Even non-players win through
                  appreciation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* The Flywheel */}
        <div className="bg-white/5 backdrop-blur-sm p-8 md:p-10 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#4ade80]/10 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-[#4ade80]" />
            </div>
            <h3 className="text-2xl font-bold text-white">The Self-Balancing Flywheel</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-[#4ade80]" />
                <h4 className="font-bold text-white">Player Wins</h4>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                Increased circulation → More liquidity → Lower entry barrier → More players join
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-[#d4af37]" />
                <h4 className="font-bold text-white">Player Losses</h4>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                Decreased circulation → Increased scarcity → Higher token value → Holders benefit
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-white/70" />
                <h4 className="font-bold text-white">Natural Balance</h4>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                The system self-regulates through supply and demand, creating sustainable long-term value
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-white/5 rounded-xl border border-white/10 m-radius">
            <p className="text-center text-white/80 leading-relaxed">
              <span className="font-bold text-[#4ade80]">Players</span> get the thrill of winning real money.{" "}
              <span className="font-bold text-[#d4af37]">Holders</span> benefit from deflationary mechanics.{" "}
              <span className="font-bold text-white">Everyone</span> has skin in the game.
            </p>
          </div>
        </div>

        {/* Bottom note */}
        <div className="mt-8 text-center">
          <p className="text-white/50 text-sm italic">
            This isn't zero-sum. It's a positive-sum ecosystem where gameplay creates value for the entire community.
          </p>
        </div>

        <div className="relative mt-12 bg-gradient-to-br from-[#0a1f15] via-black to-black backdrop-blur-sm p-8 md:p-12 rounded-2xl border-2 border-[#d4af37]/40 hover:border-[#d4af37]/60 transition-all overflow-hidden group">
          {/* Glowing background effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/20 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#10b981]/20 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity" />

          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 text-balance">
              pump.fun Launch with <span className="text-[#d4af37]">House Bankroll</span>
            </h3>
            <p className="text-white/80 text-lg leading-relaxed mb-8">
              $BJ launches on pump.fun via bonding curve. The team purchases the first 55% of the bonding curve to
              establish the house bankroll for game payouts. The remaining 45% is available for public purchase. When
              the bonding curve completes, liquidity automatically migrates to pump.swap. Play blackjack with $BJ tokens
              as collateral while seeing everything in familiar dollar amounts.
            </p>

            {/* Feature badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="m-radius flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-[#4ade80]/30 hover:border-[#4ade80]/50 transition-all">
                <Image
                  src="/images/feature-badge-icon.png"
                  alt="Feature icon"
                  width={24}
                  height={24}
                  className="flex-shrink-0"
                />
                <span className="text-white font-bold">Provably Fair</span>
              </div>
              <div className="m-radius flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-[#4ade80]/30 hover:border-[#4ade80]/50 transition-all">
                <Image
                  src="/images/feature-badge-icon.png"
                  alt="Feature icon"
                  width={24}
                  height={24}
                  className="flex-shrink-0"
                />
                <span className="text-white font-bold">100% Fair Launch</span>
              </div>
              <div className="m-radius flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-[#4ade80]/30 hover:border-[#4ade80]/50 transition-all">
                <Image
                  src="/images/feature-badge-icon.png"
                  alt="Feature icon"
                  width={24}
                  height={24}
                  className="flex-shrink-0"
                />
                <span className="text-white font-bold">Instant Payouts</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://pump.fun"
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-5 bg-[#10b981] hover:bg-[#059669] text-white text-lg font-bold m-radius transition-all hover:scale-105 shadow-2xl shadow-[#10b981]/30 hover:shadow-[#10b981]/50"
              >
                Buy $BJ
              </a>
              <button
                onClick={onStartDemo}
                className="px-10 py-5 bg-[#fbbf24] hover:bg-[#f59e0b] text-black text-lg font-bold m-radius transition-all hover:scale-105 shadow-2xl shadow-[#fbbf24]/30 hover:shadow-[#fbbf24]/50"
              >
                Play Now
              </button>
            </div>
          </div>
        </div>

        {learnMoreButton && <div className="mt-12">{learnMoreButton}</div>}
      </div>
    </section>
  )
}
