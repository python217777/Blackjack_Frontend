"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Play, X } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface BJExplanationModalProps {
  show: boolean
  onClose: () => void
  onStartDemo: () => void
}

export function BJExplanationModal({ show, onClose, onStartDemo }: BJExplanationModalProps) {
  const handleStartPlaying = () => {
    onClose()
    onStartDemo()
  }

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-black via-gray-900 to-black border-amber-400/60 border-2 shadow-2xl rounded-2xl p-0 max-w-lg w-full">
        <Card className="bg-transparent border-none shadow-none">
          {/* Modern Video Section */}
         
          <CardHeader className="flex flex-row items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 shadow">
                <Play className="w-6 h-6 text-amber-400" />
              </span>
              <CardTitle className="text-2xl font-extrabold text-amber-400 tracking-wide">
                What is $BJ?
              </CardTitle>
            </div>
            
            {/* Custom close button, hide default with CSS */}
            
          </CardHeader>
          
          <Separator className="bg-amber-400/20 mb-2" />
          <div className="w-full aspect-video bg-black rounded-t-2xl overflow-hidden flex items-center justify-center">
            <video
              className="w-full h-full object-cover"
              src="/video/bj-explainer.mp4"
              autoPlay
              loop
              muted
              playsInline
            >
              Sorry, your browser does not support embedded videos.
            </video>
          </div>
          <Separator className="bg-amber-400/20 mb-2" />

          <CardContent className="space-y-4 px-6 pb-6">
            <div className="space-y-3 text-sm text-gray-300">
              <p>$BJ is the gaming currency for Premium Blackjack.</p>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="space-y-2">
                  <div>• All bets placed with $BJ tokens</div>
                  <div>• Chips show dollar values ($10 = $10 worth of $BJ)</div>
                  <div>• Available on pump.fun</div>
                  <div>• Trade back to SOL anytime</div>
                </div>
              </div>
            </div>
            <Button
              onClick={handleStartPlaying}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold py-3 rounded-lg"
            >
              <Play className="w-4 h-4 mr-2" />
              Try Demo Now
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
