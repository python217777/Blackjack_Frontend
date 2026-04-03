"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Loader2,
  Shield,
  CheckCircle,
  Users,
  History,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Share2,
  Copy,
  Twitter,
  MessageCircle,
} from "lucide-react"
import { useState, useEffect } from "react"

interface GameRecord {
  id: string
  timestamp: Date
  bet: number
  result: "win" | "lose" | "push"
  winnings: number
  playerHand: string
  dealerHand: string
}

interface GameModalsProps {
  showWalletModal: boolean
  showHistoryModal: boolean
  showFairnessModal: boolean
  showReferralModal: boolean
  showRulesModal: boolean
  onCloseWallet: () => void
  onCloseHistory: () => void
  onCloseFairness: () => void
  onCloseReferral: () => void
  onCloseRules: () => void
  onWalletConnect: (wallet: string) => void
  isConnecting?: boolean
  gameHistory?: GameRecord[]
}

interface PnLPopupProps {
  show: boolean
  onClose: () => void
  game: GameRecord
  gameNumber: number
  totalGames: number
  runningBalance: number
}

function PnLPopup({ show, onClose, game, gameNumber, totalGames, runningBalance }: PnLPopupProps) {
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [copied, setCopied] = useState(false)

  const isProfit = game.winnings > 0
  const isBlackjack = game.playerHand.includes("A") && game.playerHand.split(", ").length === 2 && game.result === "win"

  // Fun messages based on result
  const getResultMessage = () => {
    if (isBlackjack) {
      return {
        title: "🎯 BLACKJACK PERFECTION!",
        subtitle: "Natural 21 - The dream hand!",
        emoji: "🔥",
        color: "from-yellow-400 to-amber-500",
      }
    } else if (game.result === "win" && game.winnings > game.bet * 1.5) {
      return {
        title: "💰 BIG WIN ALERT!",
        subtitle: "Crushing the house!",
        emoji: "🚀",
        color: "from-emerald-400 to-green-500",
      }
    } else if (game.result === "win") {
      return {
        title: "✨ WINNER WINNER!",
        subtitle: "Chicken dinner time!",
        emoji: "🎉",
        color: "from-emerald-400 to-green-500",
      }
    } else if (game.result === "push") {
      return {
        title: "🤝 PERFECT TIE!",
        subtitle: "Great minds think alike!",
        emoji: "⚖️",
        color: "from-blue-400 to-cyan-500",
      }
    } else {
      return {
        title: "🎲 HOUSE EDGE!",
        subtitle: "The comeback starts now!",
        emoji: "💪",
        color: "from-purple-400 to-indigo-500",
      }
    }
  }

  const resultInfo = getResultMessage()

  // Generate shareable text
  const generateShareText = () => {
    const profit = game.winnings - game.bet
    const profitText = profit > 0 ? `+${profit.toFixed(4)} SOL` : `${profit.toFixed(4)} SOL`

    if (isBlackjack) {
      return `🎯 Just hit BLACKJACK at Void Casino! ${profitText} in one hand! 🔥\n\nPlayer: ${game.playerHand}\nDealer: ${game.dealerHand}\n\n#Blackjack #SolanaGaming #VoidCasino`
    } else if (game.result === "win") {
      return `💰 Another WIN at Void Casino! ${profitText} 🚀\n\nPlayer: ${game.playerHand} vs Dealer: ${game.dealerHand}\n\n#BlackjackWin #SolanaGaming #VoidCasino`
    } else if (game.result === "push") {
      return `🤝 Perfect TIE at Void Casino! Bet returned safely 💎\n\nBoth had the same score - what are the odds!\n\n#BlackjackTie #SolanaGaming #VoidCasino`
    } else {
      return `🎲 The grind continues at Void Casino! Every hand is a learning experience 💪\n\nNext hand is THE hand! 🔥\n\n#BlackjackGrind #SolanaGaming #VoidCasino`
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const shareToTwitter = () => {
    const text = encodeURIComponent(generateShareText())
    const url = `https://twitter.com/intent/tweet?text=${text}`
    window.open(url, "_blank")
  }

  const shareToTelegram = () => {
    const text = encodeURIComponent(generateShareText())
    const url = `https://t.me/share/url?text=${text}`
    window.open(url, "_blank")
  }

  if (!show) return null

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border border-gray-700/50 text-white max-w-md p-0 overflow-hidden shadow-2xl">
        {/* Header with gradient */}
        <div className={`bg-gradient-to-r ${resultInfo.color} p-6 text-center relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <div className="text-4xl mb-2">{resultInfo.emoji}</div>
            <h2 className="text-xl font-bold text-white mb-1">{resultInfo.title}</h2>
            <p className="text-white/90 text-sm">{resultInfo.subtitle}</p>
          </div>

          {/* Animated background elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + Math.sin(i) * 20}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "2s",
                }}
              />
            ))}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Game Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-amber-400">
                {game.result === "win" ? "+" : game.result === "push" ? "±" : "-"}
                {Math.abs(game.winnings - game.bet).toFixed(4)}
              </div>
              <div className="text-xs text-gray-400">SOL P&L</div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{runningBalance.toFixed(4)}</div>
              <div className="text-xs text-gray-400">Balance</div>
            </div>
          </div>

          {/* Hand Details */}
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h3 className="font-semibold text-amber-400 mb-3 text-center">Hand Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Game #:</span>
                <span className="text-white font-mono">
                  {gameNumber} of {totalGames}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Bet Size:</span>
                <span className="text-white font-mono">{game.bet.toFixed(4)} SOL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Your Hand:</span>
                <span className="text-white font-mono">{game.playerHand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Dealer Hand:</span>
                <span className="text-white font-mono">{game.dealerHand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Time:</span>
                <span className="text-white font-mono">{game.timestamp.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Fun Stats */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4">
            <h4 className="font-semibold text-purple-400 mb-2 text-center">🎮 Fun Facts</h4>
            <div className="text-xs text-gray-300 space-y-1">
              {isBlackjack && <div>• Natural 21 odds: ~4.8% (1 in 21 hands)</div>}
              {game.result === "win" && !isBlackjack && <div>• You beat the house edge of 0.5%!</div>}
              {game.result === "push" && <div>• Push probability: ~8.5% of all hands</div>}
              <div>• This was hand #{gameNumber} in your session</div>
              <div>
                •{" "}
                {game.result === "win"
                  ? "🔥 You're on fire!"
                  : game.result === "push"
                    ? "⚖️ Perfectly balanced!"
                    : "💪 Comeback mode activated!"}
              </div>
            </div>
          </div>

          {/* Share Section */}
          <div className="space-y-3">
            <Button
              onClick={() => setShowShareOptions(!showShareOptions)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 rounded-lg"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share This Hand
            </Button>

            {showShareOptions && (
              <div className="space-y-2 animate-in slide-in-from-top duration-200">
                <div className="grid grid-cols-3 gap-2">
                  <Button onClick={shareToTwitter} className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg">
                    <Twitter className="w-4 h-4" />
                  </Button>

                  <Button onClick={shareToTelegram} className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg">
                    <MessageCircle className="w-4 h-4" />
                  </Button>

                  <Button
                    onClick={() => copyToClipboard(generateShareText())}
                    className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-lg"
                  >
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="text-xs text-gray-400 text-center">
                  {copied ? "✅ Copied to clipboard!" : "Share on Twitter, Telegram, or copy text"}
                </div>
              </div>
            )}
          </div>

          {/* Close Button */}
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function GameModals({
  showWalletModal,
  showHistoryModal,
  showFairnessModal,
  showReferralModal,
  showRulesModal,
  onCloseWallet,
  onCloseHistory,
  onCloseFairness,
  onCloseReferral,
  onCloseRules,
  onWalletConnect,
  isConnecting = false,
  gameHistory = [],
}: GameModalsProps) {
  const [referralCode] = useState("PLAYER123")
  const referralLink = `https://void-casino.com/?ref=${referralCode}`
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [showPnLPopup, setShowPnLPopup] = useState(false)
  const [selectedGame, setSelectedGame] = useState<GameRecord | null>(null)
  const [selectedGameIndex, setSelectedGameIndex] = useState(0)

  useEffect(() => {
    if (!showWalletModal) {
      setSelectedWallet(null)
    }
  }, [showWalletModal])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleWalletSelect = (wallet: string) => {
    if (isConnecting) return
    setSelectedWallet(wallet)
    setTimeout(() => {
      onWalletConnect(wallet)
    }, 300)
  }

  const handleGameClick = (game: GameRecord, index: number) => {
    setSelectedGame(game)
    setSelectedGameIndex(index)
    setShowPnLPopup(true)
  }

  const calculateRunningBalance = (gameIndex: number) => {
    let balance = 10 // Starting balance
    for (let i = 0; i <= gameIndex; i++) {
      const game = gameHistory[i]
      balance += game.winnings - game.bet
    }
    return balance
  }

  const ModalHeader = ({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle: string }) => (
    <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 border-b border-gray-700/50 p-6">
      <div className="flex items-center gap-4">
        <img src="/images/void-casino-logo.png" alt="Void Casino" className="w-12 h-12 object-contain" />
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <Icon className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">{title}</h2>
          </div>
          <p className="text-sm text-gray-400">{subtitle}</p>
        </div>
      </div>
    </div>
  )

  const totalGames = gameHistory.length
  const totalWinnings = gameHistory.reduce((sum, game) => sum + game.winnings, 0)
  const totalBets = gameHistory.reduce((sum, game) => sum + game.bet, 0)
  const netProfit = totalWinnings - totalBets
  const winRate = totalGames > 0 ? (gameHistory.filter((g) => g.result === "win").length / totalGames) * 100 : 0
  const winStreak = gameHistory.reduce((streak, game, index) => {
    if (game.result === "win") {
      return index === 0 || gameHistory[index - 1].result === "win" ? streak + 1 : 1
    }
    return 0
  }, 0)

  return (
    <>
      {/* P&L Popup */}
      {selectedGame && (
        <PnLPopup
          show={showPnLPopup}
          onClose={() => setShowPnLPopup(false)}
          game={selectedGame}
          gameNumber={selectedGameIndex + 1}
          totalGames={totalGames}
          runningBalance={calculateRunningBalance(selectedGameIndex)}
        />
      )}

      {/* Wallet Connect Modal */}
      <Dialog open={showWalletModal} onOpenChange={onCloseWallet}>
        <DialogContent className="bg-gray-900 border border-gray-700/50 text-white max-w-md p-0 overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 border-b border-gray-700/50 p-6">
            <div className="flex items-center gap-4">
              <img src="/images/void-casino-logo.png" alt="Void Casino" className="w-12 h-12 object-contain" />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <Shield className="w-5 h-5 text-amber-400" />
                  <h2 className="text-xl font-bold text-white">Connect Wallet</h2>
                </div>
                <p className="text-sm text-gray-400">Choose your Solana wallet</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-3">
              {/* Phantom Wallet */}
              <button
                onClick={() => handleWalletSelect("phantom")}
                disabled={isConnecting}
                className={`
                  w-full bg-gray-800/50 hover:bg-gray-800/80 border border-gray-700/50 hover:border-purple-500/50
                  rounded-lg p-4 flex items-center gap-3 transition-all duration-200
                  ${selectedWallet === "phantom" ? "border-purple-500 bg-purple-500/10" : ""}
                  ${isConnecting && selectedWallet === "phantom" ? "animate-pulse" : ""}
                `}
              >
                <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                  <img src="/images/phantom-logo.png" alt="Phantom" className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-white">Phantom</div>
                  <div className="text-xs text-gray-400">Most popular Solana wallet</div>
                </div>
                {isConnecting && selectedWallet === "phantom" && (
                  <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                )}
              </button>

              {/* Solflare Wallet */}
              <button
                onClick={() => handleWalletSelect("solflare")}
                disabled={isConnecting}
                className={`
                  w-full bg-gray-800/50 hover:bg-gray-800/80 border border-gray-700/50 hover:border-orange-500/50
                  rounded-lg p-4 flex items-center gap-3 transition-all duration-200
                  ${selectedWallet === "solflare" ? "border-orange-500 bg-orange-500/10" : ""}
                  ${isConnecting && selectedWallet === "solflare" ? "animate-pulse" : ""}
                `}
              >
                <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center">
                  <img src="/images/solflare-logo.png" alt="Solflare" className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-white">Solflare</div>
                  <div className="text-xs text-gray-400">Multi-platform wallet</div>
                </div>
                {isConnecting && selectedWallet === "solflare" && (
                  <Loader2 className="w-5 h-5 text-orange-400 animate-spin" />
                )}
              </button>

              {/* Backpack Wallet */}
              <button
                onClick={() => handleWalletSelect("backpack")}
                disabled={isConnecting}
                className={`
                  w-full bg-gray-800/50 hover:bg-gray-800/80 border border-gray-700/50 hover:border-blue-500/50
                  rounded-lg p-4 flex items-center gap-3 transition-all duration-200
                  ${selectedWallet === "backpack" ? "border-blue-500 bg-blue-500/10" : ""}
                  ${isConnecting && selectedWallet === "backpack" ? "animate-pulse" : ""}
                `}
              >
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                  <img src="/images/backpack-logo.png" alt="Backpack" className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-white">Backpack</div>
                  <div className="text-xs text-gray-400">Next-gen wallet</div>
                </div>
                {isConnecting && selectedWallet === "backpack" && (
                  <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced History Modal */}
      <Dialog open={showHistoryModal} onOpenChange={onCloseHistory}>
        <DialogContent className="bg-gray-900 border border-gray-700/50 text-white max-w-5xl p-0 overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 border-b border-gray-700/50 p-6">
            <div className="flex items-center gap-4">
              <img src="/images/void-casino-logo.png" alt="Void Casino" className="w-12 h-12 object-contain" />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <History className="w-5 h-5 text-amber-400" />
                  <h2 className="text-xl font-bold text-white">Game History</h2>
                </div>
                <p className="text-sm text-gray-400">Your recent gaming activity - click any hand for details</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {gameHistory.length === 0 ? (
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-8 text-center">
                <History className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Games Yet</h3>
                <p className="text-gray-400 mb-4">Start playing to see your game history here.</p>
                <Button
                  onClick={onCloseHistory}
                  className="bg-amber-600 hover:bg-amber-700 text-black font-semibold px-6 py-2"
                >
                  Start Playing
                </Button>
              </div>
            ) : (
              <>
                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <div className="text-2xl font-bold text-amber-400">{totalGames}</div>
                    <div className="text-sm text-gray-400">Total Hands</div>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <div className={`text-2xl font-bold ${netProfit >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {netProfit >= 0 ? "+" : ""}
                      {netProfit.toFixed(4)}
                    </div>
                    <div className="text-sm text-gray-400">Net P&L (SOL)</div>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-400">{winRate.toFixed(1)}%</div>
                    <div className="text-sm text-gray-400">Win Rate</div>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-400">{winStreak}</div>
                    <div className="text-sm text-gray-400">Win Streak</div>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <div className="text-2xl font-bold text-emerald-400">
                      {
                        gameHistory.filter(
                          (g) =>
                            g.result === "win" && g.playerHand.includes("A") && g.playerHand.split(", ").length === 2,
                        ).length
                      }
                    </div>
                    <div className="text-sm text-gray-400">Blackjacks</div>
                  </div>
                </div>

                {/* Enhanced Game Table */}
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg overflow-hidden">
                  <div className="max-h-96 overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-gray-700/50 sticky top-0">
                        <tr className="text-left text-xs text-gray-400">
                          <th className="p-3">#</th>
                          <th className="p-3">Time</th>
                          <th className="p-3">Bet</th>
                          <th className="p-3">Result</th>
                          <th className="p-3">P&L</th>
                          <th className="p-3">Hands</th>
                          <th className="p-3">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gameHistory
                          .slice()
                          .reverse()
                          .map((game, reverseIndex) => {
                            const originalIndex = gameHistory.length - 1 - reverseIndex
                            const profit = game.winnings - game.bet
                            const isBlackjack =
                              game.playerHand.includes("A") &&
                              game.playerHand.split(", ").length === 2 &&
                              game.result === "win"

                            return (
                              <tr
                                key={game.id}
                                className="border-t border-gray-700/30 hover:bg-gray-700/20 transition-colors"
                              >
                                <td className="p-3 text-xs text-gray-300 font-mono">#{originalIndex + 1}</td>
                                <td className="p-3 text-xs text-gray-300">{game.timestamp.toLocaleTimeString()}</td>
                                <td className="p-3 text-sm font-mono">{game.bet.toFixed(4)} SOL</td>
                                <td className="p-3">
                                  <span
                                    className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 ${
                                      game.result === "win"
                                        ? "bg-green-500/20 text-green-400"
                                        : game.result === "lose"
                                          ? "bg-red-500/20 text-red-400"
                                          : "bg-yellow-500/20 text-yellow-400"
                                    }`}
                                  >
                                    {isBlackjack && "🎯 "}
                                    {game.result.toUpperCase()}
                                  </span>
                                </td>
                                <td className="p-3 text-sm font-mono">
                                  <span
                                    className={`flex items-center gap-1 ${profit > 0 ? "text-green-400" : profit < 0 ? "text-red-400" : "text-gray-400"}`}
                                  >
                                    {profit > 0 ? (
                                      <TrendingUp className="w-3 h-3" />
                                    ) : profit < 0 ? (
                                      <TrendingDown className="w-3 h-3" />
                                    ) : null}
                                    {profit > 0 ? "+" : ""}
                                    {profit.toFixed(4)} SOL
                                  </span>
                                </td>
                                <td className="p-3 text-xs text-gray-400">
                                  P: {game.playerHand} | D: {game.dealerHand}
                                </td>
                                <td className="p-3">
                                  <Button
                                    onClick={() => handleGameClick(game, originalIndex)}
                                    size="sm"
                                    className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-600/50 text-xs px-2 py-1"
                                  >
                                    <Share2 className="w-3 h-3 mr-1" />
                                    View
                                  </Button>
                                </td>
                              </tr>
                            )
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Other modals remain the same... */}
      <Dialog open={showFairnessModal} onOpenChange={onCloseFairness}>
        <DialogContent className="bg-gray-900 border border-gray-700/50 text-white max-w-3xl p-0 overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 border-b border-gray-700/50 p-6">
            <div className="flex items-center gap-4">
              <img src="/images/void-casino-logo.png" alt="Void Casino" className="w-12 h-12 object-contain" />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <Shield className="w-5 h-5 text-amber-400" />
                  <h2 className="text-xl font-bold text-white">Provably Fair Gaming</h2>
                </div>
                <p className="text-sm text-gray-400">Transparent and verifiable game outcomes</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-green-300 font-medium mb-1">Certified Fair Gaming</p>
                  <p className="text-green-200/80">
                    Our blackjack game uses cryptographic proof to ensure every hand is completely fair and verifiable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showReferralModal} onOpenChange={onCloseReferral}>
        <DialogContent className="bg-gray-900 border border-gray-700/50 text-white max-w-3xl p-0 overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 border-b border-gray-700/50 p-6">
            <div className="flex items-center gap-4">
              <img src="/images/void-casino-logo.png" alt="Void Casino" className="w-12 h-12 object-contain" />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <Users className="w-5 h-5 text-amber-400" />
                  <h2 className="text-xl font-bold text-white">Referral Program</h2>
                </div>
                <p className="text-sm text-gray-400">Earn rewards by inviting friends</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-amber-400 mb-2">💰 Earn 5% Commission</h3>
                <p className="text-amber-200/80 text-lg mb-4">
                  Get 5% of house edge from every friend you refer. Your friends receive 0.05 SOL welcome bonus!
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-amber-300">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span>Lifetime earnings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Instant payouts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>No limits</span>
                  </div>
                </div>
              </div>
            </div>

            {/* How it Works */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">1</span>
                </div>
                <h4 className="font-semibold text-white mb-2">Share Link</h4>
                <p className="text-gray-400 text-sm">Copy your unique referral link and share with friends</p>
              </div>

              <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">2</span>
                </div>
                <h4 className="font-semibold text-white mb-2">Friends Play</h4>
                <p className="text-gray-400 text-sm">They connect wallet and start playing blackjack</p>
              </div>

              <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">3</span>
                </div>
                <h4 className="font-semibold text-white mb-2">Earn SOL</h4>
                <p className="text-gray-400 text-sm">Receive 5% commission on all their gameplay</p>
              </div>
            </div>

            {/* Referral Link */}
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4">
              <h4 className="font-semibold text-amber-400 mb-3">Your Referral Link</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white text-sm font-mono"
                />
                <Button
                  onClick={() => copyToClipboard(referralLink)}
                  className="bg-amber-600 hover:bg-amber-700 text-black font-semibold px-4 py-2"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
              <p className="text-gray-400 text-xs mt-2">Share this link with friends to start earning commissions</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-800/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-emerald-400">0</div>
                <div className="text-sm text-gray-400">Referrals</div>
              </div>
              <div className="bg-gray-800/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-amber-400">0.0000</div>
                <div className="text-sm text-gray-400">SOL Earned</div>
              </div>
              <div className="bg-gray-800/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-400">5%</div>
                <div className="text-sm text-gray-400">Commission</div>
              </div>
            </div>

            {/* Terms */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h4 className="font-semibold text-blue-400 mb-2">📋 Program Terms</h4>
              <ul className="text-blue-200/80 text-sm space-y-1">
                <li>• Earn 5% of house edge from referred players</li>
                <li>• Minimum payout: 0.01 SOL</li>
                <li>• Payments processed instantly after each game</li>
                <li>• No maximum earning limits</li>
                <li>• Referred players get 0.05 SOL welcome bonus</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showRulesModal} onOpenChange={onCloseRules}>
        <DialogContent className="bg-gray-900 border border-gray-700/50 text-white max-w-4xl p-0 overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 border-b border-gray-700/50 p-6">
            <div className="flex items-center gap-4">
              <img src="/images/void-casino-logo.png" alt="Void Casino" className="w-12 h-12 object-contain" />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <HelpCircle className="w-5 h-5 text-amber-400" />
                  <h2 className="text-xl font-bold text-white">How to Play Blackjack</h2>
                </div>
                <p className="text-sm text-gray-400">Learn the rules and strategies</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-400 mb-3">🎯 Objective</h4>
                  <p className="text-gray-300 text-sm">
                    Get as close to 21 as possible without going over. Beat the dealer's hand to win.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
