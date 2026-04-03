"use client"

import { Button } from "@/components/ui/button"
import { Wallet, History, Shield, Users, HelpCircle, Sparkles } from "lucide-react"

interface GameHeaderProps {
  balance: number
  walletConnected: boolean
  onWalletClick: () => void
  onHistoryClick: () => void
  onFairnessClick: () => void
  onReferralClick: () => void
  onRulesClick: () => void
}

export function GameHeader({
  balance,
  walletConnected,
  onWalletClick,
  onHistoryClick,
  onFairnessClick,
  onReferralClick,
  onRulesClick,
}: GameHeaderProps) {
  return (
    <header className="flex items-center justify-between p-6 border-b border-[#00d4aa]/30 bg-gradient-to-r from-[#0f1419] via-[#1a1f2e] to-[#0f1419] backdrop-blur-sm">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#00d4aa] to-[#00b894] rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-black" />
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-[#00d4aa] to-white bg-clip-text text-transparent">
            Solana Blackjack
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onHistoryClick}
            className="text-gray-400 hover:text-white hover:bg-[#2a2f3e] rounded-xl transition-all duration-200"
          >
            <History className="w-4 h-4 mr-2" />
            History
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onFairnessClick}
            className="text-gray-400 hover:text-white hover:bg-[#2a2f3e] rounded-xl transition-all duration-200"
          >
            <Shield className="w-4 h-4 mr-2" />
            Fairness
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReferralClick}
            className="text-gray-400 hover:text-white hover:bg-[#2a2f3e] rounded-xl transition-all duration-200"
          >
            <Users className="w-4 h-4 mr-2" />
            Refer Friends
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRulesClick}
            className="text-gray-400 hover:text-white hover:bg-[#2a2f3e] rounded-xl transition-all duration-200"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            How to Play
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right bg-[#2a2f3e] px-6 py-3 rounded-xl border border-[#00d4aa]/30">
          <div className="text-sm text-gray-400 mb-1">Balance</div>
          <div className="text-2xl font-bold text-[#00d4aa] flex items-center gap-2">
            {balance.toFixed(2)}
            <span className="text-lg text-white">USDC</span>
          </div>
        </div>

        <Button
          onClick={onWalletClick}
          className={`
            px-6 py-3 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105
            ${
              walletConnected
                ? "bg-gradient-to-r from-[#00d4aa] to-[#00b894] hover:from-[#00b894] hover:to-[#009975] text-black shadow-lg shadow-[#00d4aa]/30"
                : "bg-[#2a2f3e] hover:bg-[#3a3f4e] border-2 border-[#00d4aa] text-white hover:border-[#00b894]"
            }
          `}
        >
          <Wallet className="w-5 h-5 mr-2" />
          {walletConnected ? "Connected" : "Connect Wallet"}
        </Button>
      </div>
    </header>
  )
}
