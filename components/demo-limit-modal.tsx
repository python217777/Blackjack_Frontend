"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Wallet, Play, Sparkles } from "lucide-react"

interface DemoLimitModalProps {
  show: boolean
  onConnectWallet: () => void
  onContinueDemo: () => void
  onClose: () => void
}

export function DemoLimitModal({ show, onConnectWallet, onContinueDemo, onClose }: DemoLimitModalProps) {
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="bg-black border-2 border-amber-500/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
            Demo Limit Reached
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Great Job!</h3>
            <p className="text-gray-300 mb-4">You've completed 5 demo hands. Ready to play with real SOL?</p>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
            <h4 className="font-bold text-amber-400 mb-2">Connect Your Wallet to:</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Play with real SOL</li>
              <li>• Earn actual SOL winnings</li>
              <li>• Access referral rewards</li>
              <li>• Unlimited gameplay</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={onConnectWallet}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-lg py-3 rounded-xl"
            >
              <Wallet className="w-5 h-5 mr-2" />
              Connect Wallet & Play
            </Button>

            <Button
              onClick={onContinueDemo}
              variant="outline"
              className="w-full border-amber-500/50 text-amber-400 hover:bg-amber-500/10 font-bold py-3 rounded-xl"
            >
              <Play className="w-5 h-5 mr-2" />
              Continue Demo (5 more hands)
            </Button>
          </div>

          <div className="text-center text-xs text-gray-500">Demo mode uses virtual currency only</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
