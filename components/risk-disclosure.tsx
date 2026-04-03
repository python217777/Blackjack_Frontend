"use client"

import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

export function RiskDisclosure() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const risks = [
    {
      title: "Gaming Risk",
      description:
        "Blackjack is a game of chance. The house has a statistical edge, and you may lose your entire bet. Only play with funds you can afford to lose.",
    },
    {
      title: "Token Volatility",
      description:
        "$BJ token value fluctuates based on market conditions. Your winnings in $BJ tokens may be worth more or less in dollar terms when you trade them.",
    },
    {
      title: "Smart Contract Risk",
      description:
        "While audited, smart contracts may contain bugs or vulnerabilities. Blockchain transactions are irreversible and cannot be undone.",
    },
    {
      title: "Regulatory Uncertainty",
      description:
        "Cryptocurrency gaming regulations vary by jurisdiction. Ensure you comply with local laws before participating.",
    },
  ]

  return (
    <section className="relative py-32 px-4 bg-black border-y border-red-500/10">
      <div className="max-w-7xl mx-auto relative z-10">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center justify-center gap-3 mb-16 mx-auto group hover:opacity-80 transition-opacity"
        >
          <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white animate-pulse-subtle">Risk Disclosure</h2>
          {isCollapsed ? (
            <ChevronDown className="w-6 h-6 text-white/60 group-hover:text-white/80 transition-colors" />
          ) : (
            <ChevronUp className="w-6 h-6 text-white/60 group-hover:text-white/80 transition-colors" />
          )}
        </button>

        {!isCollapsed && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {risks.map((risk, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-red-500/20 hover:border-red-500/40 transition-all"
                >
                  <h3 className="text-lg font-bold text-red-400 mb-2">{risk.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{risk.description}</p>
                </div>
              ))}
            </div>

            <p className="text-center text-white/40 text-sm max-w-3xl mx-auto leading-relaxed">
              By participating, you acknowledge these risks and confirm you are of legal age in your jurisdiction. This
              platform is for entertainment purposes. Past performance does not guarantee future results. Please gamble
              responsibly.
            </p>
          </>
        )}
      </div>
    </section>
  )
}
