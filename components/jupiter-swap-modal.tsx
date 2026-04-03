"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ExternalLink, X } from "lucide-react"

interface JupiterSwapModalProps {
  show: boolean
  onClose: () => void
}

export function JupiterSwapModal({ show, onClose }: JupiterSwapModalProps) {
  const [swapAmount, setSwapAmount] = useState("100")
  const [fromToken, setFromToken] = useState("SOL")
  const [toToken, setToToken] = useState("BJ")

  const handleSwap = () => {
    // This would integrate with Jupiter API in production
    window.open("https://jup.ag/", "_blank")
  }

  const swapTokens = () => {
    setFromToken(toToken)
    setToToken(fromToken)
  }

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 border border-gray-700/50 text-white max-w-md p-0 overflow-hidden shadow-2xl backdrop-blur-sm">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white transition-colors bg-black/20 rounded-full p-2 hover:bg-black/40"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Direct Swap Interface - No padding, no frames */}
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Token Swap</h3>
              <div className="text-xs text-gray-400">Powered by Jupiter</div>
            </div>

            {/* From Token */}
            <div className="bg-black/40 border border-gray-600/50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">From</span>
                <span className="text-sm text-gray-400">Balance: 0.00</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={swapAmount}
                  onChange={(e) => setSwapAmount(e.target.value)}
                  className="flex-1 bg-transparent text-xl font-bold text-white outline-none"
                  placeholder="0.00"
                />
                <div className="flex items-center gap-2 bg-gray-700/50 rounded-lg px-3 py-2">
                  <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
                    {fromToken === "SOL" ? "◎" : "BJ"}
                  </div>
                  <span className="font-bold text-white">{fromToken}</span>
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button
                onClick={swapTokens}
                className="w-10 h-10 bg-gray-700/50 hover:bg-gray-600/50 rounded-full flex items-center justify-center transition-colors"
              >
                <ArrowUpDown className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* To Token */}
            <div className="bg-black/40 border border-gray-600/50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">To</span>
                <span className="text-sm text-gray-400">Balance: 0.00</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 text-xl font-bold text-white">
                  {fromToken === "SOL"
                    ? (Number.parseFloat(swapAmount) * 1000).toFixed(0)
                    : (Number.parseFloat(swapAmount) / 1000).toFixed(4)}
                </div>
                <div className="flex items-center gap-2 bg-gray-700/50 rounded-lg px-3 py-2">
                  <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-xs font-bold">
                    {toToken === "SOL" ? "◎" : "BJ"}
                  </div>
                  <span className="font-bold text-white">{toToken}</span>
                </div>
              </div>
            </div>

            {/* Swap Action Button */}
            <Button
              onClick={handleSwap}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 rounded-xl shadow-lg transform transition-all hover:scale-105"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Swap on Jupiter
            </Button>

            {/* Quick Tip */}
            
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
