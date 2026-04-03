"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog1"
import { AlertTriangle, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button1"
import { useGame } from "@/components/game-context"

export function ExperimentalBanner() {
  const [disclaimerOpen, setDisclaimerOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const { isGameActive } = useGame()

  useEffect(() => {
    const stored = localStorage.getItem("banner-minimized")
    if (stored === "true") {
      setIsMinimized(true)
    }
  }, [])

  const toggleMinimize = () => {
    const newState = !isMinimized
    setIsMinimized(newState)
    localStorage.setItem("banner-minimized", String(newState))
  }

  if (isGameActive) {
    return null
  }

  if (isMinimized) {
    return (
      <div className="fixed top-0 left-0 z-[9999] w-full bg-slate-800 text-white">
          <button
            type="button"
            onClick={toggleMinimize}
            className="w-full py-1 px-4 flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors"
          >
            <ChevronDown className="h-3 w-3" />
            <span className="text-xs font-semibold">DISCLAIMER</span>
          </button>
        </div>
    )
  }

  return (
    <div className="m-fixed fixed top-0 left-0 z-[9999] w-full bg-slate-800 text-white py-2 px-4 text-center relative">
      <button
        type="button"
        onClick={toggleMinimize}
        className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-slate-700 rounded p-1 transition-colors"
        aria-label="Minimize banner"
      >
        <X className="h-4 w-4" />
      </button>

      <Dialog open={disclaimerOpen} onOpenChange={setDisclaimerOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="text-sm font-bold tracking-wide hover:text-slate-300 transition-colors cursor-pointer underline  px-3 py-1 rounded-b"
          >
            EXPERIMENTAL PROTOCOL TESTING IN PRODUCTION
          </button>
        </DialogTrigger>
        <DialogContent className="bg-[#0a5c38] border-2 border-[#d4af37] text-white max-w-2xl max-h-[80vh] overflow-y-auto z-[100]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#d4af37] flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              Legal Disclaimer & Risk Warning
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm leading-relaxed">
            <div className="bg-red-600/20 border border-red-500 rounded p-4">
              <p className="font-bold text-red-400 mb-2">USE AT YOUR OWN RISK</p>
              <p>
                This platform is experimental and provided "AS IS" without warranties of any kind. By using this
                service, you acknowledge and accept all risks associated with blockchain-based gaming and cryptocurrency
                transactions.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-[#d4af37] mb-2">No Guarantees</h3>
              <p>
                We make no representations or warranties regarding the accuracy, reliability, or availability of this
                platform. The protocol may contain bugs, errors, or vulnerabilities that could result in loss of funds.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-[#d4af37] mb-2">Financial Risk</h3>
              <p>
                Cryptocurrency gambling involves substantial financial risk. You may lose all tokens wagered. Only
                participate with funds you can afford to lose. This is not financial advice.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-[#d4af37] mb-2">Regulatory Compliance</h3>
              <p>
                You are solely responsible for ensuring your participation complies with all applicable laws and
                regulations in your jurisdiction. Online gambling may be restricted or prohibited in your location.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-[#d4af37] mb-2">No Liability</h3>
              <p>
                The operators, developers, and affiliates of this platform shall not be liable for any direct, indirect,
                incidental, consequential, or punitive damages arising from your use of this service, including but not
                limited to loss of funds, data, or profits.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-[#d4af37] mb-2">Smart Contract Risks</h3>
              <p>
                Blockchain transactions are irreversible. Smart contracts may contain unforeseen vulnerabilities. We are
                not responsible for losses due to smart contract exploits, network failures, or user error.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-[#d4af37] mb-2">Age Restriction</h3>
              <p>
                You must be at least 18 years old (or the legal gambling age in your jurisdiction) to use this platform.
                By proceeding, you confirm you meet this requirement.
              </p>
            </div>

            <div className="bg-yellow-600/20 border border-yellow-500 rounded p-4 mt-4">
              <p className="font-bold text-yellow-400 mb-2">Acknowledgment</p>
              <p>
                By using this platform, you acknowledge that you have read, understood, and agree to this disclaimer.
                You accept full responsibility for your actions and any consequences thereof.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setDisclaimerOpen(false)}
              className="w-full bg-[#d4af37] hover:bg-[#b8941f] text-black font-bold"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
