"use client"

import { ExternalLink } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog1"
import { Button } from "@/components/ui/button1"
import { useGame } from "@/components/game-context"

export function StickyFooter() {
  const { isGameActive } = useGame()
  const [termsOpen, setTermsOpen] = useState(false)
  const [gambleOpen, setGambleOpen] = useState(false)
  const [fairOpen, setFairOpen] = useState(false)

  return (
    <>
      <footer className={`fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-[#d4af37]/60 border-t-4 transition-all duration-300 ${isGameActive ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-8 text-xs md:text-sm text-white/60">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#d4af37] transition-colors py-2 px-3 mx-3"
            >
              <span>CA</span>
              <ExternalLink className="h-4 w-4" />
            </a>
            <span className="text-[#d4af37]/60 m-hide md:inline">|</span>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#d4af37] transition-colors py-2 px-3 mx-3"
            >
              <span>X</span>
              <ExternalLink className="h-4 w-4" />
            </a>
            <span className="text-[#d4af37]/60 m-hide md:inline">|</span>
            <button
              type="button"
              data-dialog="terms"
              onClick={() => setTermsOpen(true)}
              className="hover:text-[#d4af37] transition-colors py-2 px-3 mx-3"
            >
              T&C
            </button>
            <span className="text-[#d4af37]/60 m-hide md:inline">|</span>
            <button
              type="button"
              onClick={() => setGambleOpen(true)}
              className="hover:text-[#d4af37] transition-colors py-2 px-3 mx-3"
            >
              Responsible
            </button>
            <span className="text-[#d4af37]/30 m-hide md:inline">|</span>
            <button
              type="button"
              onClick={() => setFairOpen(true)}
              className="hover:text-[#d4af37] transition-colors py-2 px-3 mx-3"
            >
              Fair
            </button>
          </div>
        </div>
      </footer>

      {/* Terms & Conditions Modal */}
      <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent className="bg-[#0a5c38] border-[#d4af37] max-w-2xl max-h-[80vh] overflow-y-auto z-[100]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#d4af37]">Terms & Conditions</DialogTitle>
            <div className="text-sm text-gray-200 space-y-4 pt-4">
              <div>
                <strong className="text-[#d4af37]">1. Acceptance of Terms</strong>
                <br />
                By accessing and using bj.finance, you accept and agree to be bound by these Terms and Conditions.
              </div>
              <div>
                <strong className="text-[#d4af37]">2. Eligibility</strong>
                <br />
                You must be at least 18 years old and legally permitted to participate in online gaming in your
                jurisdiction.
              </div>
              <div>
                <strong className="text-[#d4af37]">3. Token Usage</strong>
                <br />
                $BJ tokens are used as betting collateral. All bets are placed using $BJ tokens at their current market
                value. $BJ launched on pump.fun with 100% fair distribution via bonding curve.
              </div>
              <div>
                <strong className="text-[#d4af37]">4. Risk Acknowledgment</strong>
                <br />
                You acknowledge that cryptocurrency gaming involves financial risk. Only bet what you can afford to
                lose.
              </div>
              <div>
                <strong className="text-[#d4af37]">5. Experimental Protocol</strong>
                <br />
                This is an experimental protocol testing in production. Use at your own risk.
              </div>
              <div>
                <strong className="text-[#d4af37]">6. No Warranty</strong>
                <br />
                The service is provided "as is" without warranties of any kind.
              </div>
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setTermsOpen(false)}
              className="w-full bg-[#d4af37] hover:bg-[#c4a037] text-[#0a5c38] font-bold"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Gamble Responsibly Modal */}
      <Dialog open={gambleOpen} onOpenChange={setGambleOpen}>
        <DialogContent className="bg-[#0a5c38] border-[#d4af37] max-w-2xl max-h-[80vh] overflow-y-auto z-[100]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#d4af37]">Gamble Responsibly</DialogTitle>
            <div className="text-sm text-gray-200 space-y-4 pt-4">
              <div>
                <strong className="text-[#d4af37]">Gaming should be entertainment, not a way to make money.</strong>
              </div>
              <div>
                <strong className="text-[#d4af37]">Set Limits</strong>
                <br />
                Decide how much money and time you can afford to spend before you start playing. Stick to your limits.
              </div>
              <div>
                <strong className="text-[#d4af37]">Never Chase Losses</strong>
                <br />
                If you lose, don't try to win it back by betting more. This often leads to bigger losses.
              </div>
              <div>
                <strong className="text-[#d4af37]">Take Breaks</strong>
                <br />
                Regular breaks help you maintain perspective and control over your gaming.
              </div>
              <div>
                <strong className="text-[#d4af37]">Warning Signs</strong>
                <br />
                If gaming is affecting your relationships, work, or financial situation, seek help immediately.
              </div>
              <div>
                <strong className="text-[#d4af37]">Get Help</strong>
                <br />
                If you or someone you know has a gambling problem, contact the National Council on Problem Gambling at
                1-800-522-4700.
              </div>
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setGambleOpen(false)}
              className="w-full bg-[#d4af37] hover:bg-[#c4a037] text-[#0a5c38] font-bold"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Provably Fair Modal */}
      <Dialog open={fairOpen} onOpenChange={setFairOpen}>
        <DialogContent className="bg-[#0a5c38] border-[#d4af37] max-w-2xl max-h-[80vh] overflow-y-auto z-[100]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#d4af37]">Provably Fair & Onchain</DialogTitle>
            <div className="text-sm text-gray-200 space-y-4 pt-4">
              <div>
                <strong className="text-[#d4af37]">What is Provably Fair?</strong>
                <br />
                Provably fair gaming uses blockchain technology to ensure that game outcomes cannot be manipulated by
                the house or players.
              </div>
              <div>
                <strong className="text-[#d4af37]">Onchain Verification</strong>
                <br />
                Every game round is recorded on the blockchain, making it publicly verifiable and transparent. You can
                independently verify that each outcome was fair.
              </div>
              <div>
                <strong className="text-[#d4af37]">How It Works</strong>
                <br />
                1. Before each game, a cryptographic hash is generated
                <br />
                2. The game outcome is determined using blockchain randomness
                <br />
                3. After the game, you can verify the hash matches the outcome
                <br />
                4. All transactions are recorded on the blockchain
              </div>
              <div>
                <strong className="text-[#d4af37]">Fair Launch Tokenomics</strong>
                <br />
                $BJ launched on pump.fun with 100% fair distribution—no presale, no team allocation. The bonding curve
                ensures transparent price discovery, and liquidity automatically migrates to pump.swap when the curve
                completes.
              </div>
              <div>
                <strong className="text-[#d4af37]">Smart Contract Security</strong>
                <br />
                Our smart contracts ensure that payouts are automatic and cannot be withheld. When you win, you receive
                your $BJ tokens immediately.
              </div>
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setFairOpen(false)}
              className="w-full bg-[#d4af37] hover:bg-[#c4a037] text-[#0a5c38] font-bold"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
