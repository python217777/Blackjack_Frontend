"use client"

import { SoundControlPanel } from "./sound-control-panel"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

interface LuxuryHeaderProps {
  balance: number
  solBalance: number
  isDemo: boolean
  // Sound control props
  musicEnabled: boolean
  soundEffectsEnabled: boolean
  currentTrack: number
  onToggleMusic: () => void
  onToggleSoundEffects: () => void
  onChangeTrack: (track: number) => void
}

export function LuxuryHeader({
  balance,
  solBalance,
  isDemo,
  musicEnabled,
  soundEffectsEnabled,
  currentTrack,
  onToggleMusic,
  onToggleSoundEffects,
  onChangeTrack,
}: LuxuryHeaderProps) {
  const currentBalance = isDemo ? balance : solBalance
  const { publicKey, connected } = useWallet()

  return (
    <header className="relative bg-black border-b border-gray-700/50 backdrop-blur-xl py-3 px-4 z-50">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {/* Brand Section */}
        <div className="flex items-center gap-3 h-12">
          <button
            onClick={() => window.location.href = ""}
            className="hover:opacity-80 transition-opacity cursor-pointer"
            title="Return to Homepage"
          >
            <img src="/images/void-casino-logo.png" alt="Void Casino" className="w-10 h-10 object-contain" />
          </button>
        
        </div>

        {/* Balance Display */}
        <div className="flex items-center gap-4 h-12">
          <div className="bg-gray-800/50 rounded-lg px-4 py-2 border border-gray-700/50 h-12 flex items-center">
            <div className="text-center">
              <div className="text-xl font-bold text-emerald-400">${currentBalance.toFixed(0)}</div>
              <div className="text-xs text-gray-400">{isDemo ? "DEMO BJ" : "BJ COIN"}</div>
            </div>
          </div>

          {/* Sound Control Panel */}
          <div className="h-12 flex items-center">
            <SoundControlPanel
              musicEnabled={musicEnabled}
              soundEffectsEnabled={soundEffectsEnabled}
              currentTrack={currentTrack}
              onToggleMusic={onToggleMusic}
              onToggleSoundEffects={onToggleSoundEffects}
              onChangeTrack={onChangeTrack}
            />
          </div>
          {connected && publicKey ? <WalletMultiButton /> : <WalletMultiButton>
            Wallet
          </WalletMultiButton>  }
        
        </div>
      </div>
    </header>
  )
}
