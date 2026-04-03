import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Shield } from "lucide-react"

export const FairnessDialog = ({ showFairness, setShowFairness, serverSeedHash, serverSeed, clientSeed }: { showFairness: boolean, setShowFairness: (show: boolean) => void, serverSeedHash: string, serverSeed: string, clientSeed: string }) => {
    return (
        <Dialog open={showFairness} onOpenChange={setShowFairness}>
        <DialogContent className="bg-gradient-to-br from-black via-gray-900 to-black border-amber-400/60 border-2 shadow-2xl rounded-2xl p-0 max-w-lg w-full">
          <Card className="bg-transparent border-none shadow-none">
            <CardHeader className="flex flex-row items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 shadow">
                  <Shield className="w-6 h-6 text-amber-400" />
                </span>
                <CardTitle className="text-2xl font-extrabold text-amber-400 tracking-wide">
                  Provably Fair
                </CardTitle>
              </div>
              {/* Custom close button, hide default with CSS */}
              <button
                onClick={() => setShowFairness(false)}
                className="!mt-[-4px] w-10 h-10 text-2xl text-amber-400 hover:text-white transition-colors z-50"
                aria-label="Close"
                type="button"
              >
                ×
              </button>
            </CardHeader>
            <Separator className="bg-amber-400/20 mb-2" />
            <CardContent className="space-y-4 px-6 pb-6">
              <div>
                <Badge variant="outline" className="mb-1 text-amber-400 border-amber-400/60 bg-black/40">Server Seed Hash (commit)</Badge>
                <div className="break-all font-mono bg-gray-900/80 text-amber-200 p-2 rounded border border-amber-400/20 text-xs select-all">
                  {serverSeedHash}
                </div>
              </div>
              <div>
                <Badge variant="outline" className="mb-1 text-amber-400 border-amber-400/60 bg-black/40">Server Seed (reveal)</Badge>
                <div className="break-all font-mono bg-gray-900/80 text-emerald-200 p-2 rounded border border-amber-400/20 text-xs select-all">
                  {serverSeed}
                </div>
              </div>
              <div>
                <Badge variant="outline" className="mb-1 text-amber-400 border-amber-400/60 bg-black/40">Your (Client) Seed</Badge>
                <div className="break-all font-mono bg-gray-900/80 text-blue-200 p-2 rounded border border-amber-400/20 text-xs select-all">
                  {clientSeed}
                </div>
              </div>
              <Separator className="bg-amber-400/10" />
              <div>
                <div className="text-sm text-gray-300 mb-2 font-semibold">How to verify:</div>
                <ol className="list-decimal ml-6 text-gray-400 text-sm space-y-1">
                  <li>Combine the server and client seeds.</li>
                  <li>Use the combined value to seed a shuffle algorithm (see <span className="text-amber-300">lib/game-logic.ts</span>).</li>
                  <li>Verify the deck order matches the game.</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
        <style jsx global>{`
          .fixed.left-\[50\%\].top-\[50\%\] button.absolute.right-4.top-4 {
            display: none !important;
          }
        `}</style>
      </Dialog>
    )
}