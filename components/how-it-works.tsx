import { Coins, CreditCard, Trophy } from "lucide-react"
import Image from "next/image"

export function HowItWorks() {
  const steps = [
    {
      icon: CreditCard,
      title: "Get $BJ Tokens",
      description:
        "Purchase $BJ tokens from pump.fun via the bonding curve. Fair launch model with transparent pricing.",
    },
    {
      icon: Coins,
      title: "Place Your Bets",
      description: "Use $BJ tokens to bet. A $5 chip equals $5 worth of $BJ tokens at current market value.",
    },
    {
      icon: Trophy,
      title: "Play & Win",
      description: "Beat the dealer in blackjack and win $BJ tokens. All winnings are paid out instantly in $BJ.",
    },
  ]

  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-[#0a1f15] to-black px-4 py-32">
      {/* Animated background elements similar to hero */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#4ade80]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0a5c38]/20 rounded-full blur-3xl" />

        {/* Floating card decorations */}
        <div className="absolute top-1/4 right-1/4 opacity-5 animate-float-slow">
          <Image
            src="/images/jack-spades-vintage.png"
            alt=""
            width={120}
            height={180}
            className="w-24 md:w-32 rotate-12"
          />
        </div>
        <div className="absolute bottom-1/3 left-1/4 opacity-5 animate-float-medium">
          <Image
            src="/images/jack-hearts-vintage.png"
            alt=""
            width={120}
            height={180}
            className="w-24 md:w-32 -rotate-12"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">How It Works</h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Three simple steps to start playing onchain blackjack
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-[#4ade80]/40 transition-all group"
            >
              {/* Step number */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#4ade80] rounded-full flex items-center justify-center text-black font-bold text-xl shadow-lg shadow-[#4ade80]/20 group-hover:scale-110 transition-transform">
                {index + 1}
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-white/60 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Launch info card */}
      </div>
    </section>
  )
}
