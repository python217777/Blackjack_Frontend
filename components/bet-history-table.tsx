"use client"

import { useState } from "react"
import { Card } from "@/types/game"

interface BetHistoryEntry {
  id: string
  timestamp: Date
  bet: number
  result: "win" | "lose" | "push"
  winnings: number
  playerHand: string
  dealerHand: string
  username?: string
}

interface BetHistoryTableProps {
  gameHistory: BetHistoryEntry[]
  className?: string
  isLoading?: boolean
  newEntriesCount?: number
  onNewEntriesAcknowledged?: () => void
}

export function BetHistoryTable({ 
  gameHistory, 
  className = "", 
  isLoading = false, 
  newEntriesCount = 0,
  onNewEntriesAcknowledged
}: BetHistoryTableProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  console.log("BetHistoryTable rendered with", gameHistory.length, "entries")

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getResultColor = (result: "win" | "lose" | "push") => {
    switch (result) {
      case "win":
        return "text-green-400"
      case "lose":
        return "text-red-400"
      case "push":
        return "text-yellow-400"
      default:
        return "text-gray-400"
    }
  }

  const getResultIcon = (result: "win" | "lose" | "push") => {
    switch (result) {
      case "win":
        return "✓"
      case "lose":
        return "✗"
      case "push":
        return "="
      default:
        return "•"
    }
  }

  if (isLoading) {
    return (
      <div className={`bg-gray-900/50 border border-gray-700 rounded-lg p-4 ${className}`}>
        <div className="text-center text-gray-400">
          <div className="text-2xl mb-2">⏳</div>
          <p className="text-sm">Loading bet history...</p>
          <p className="text-xs text-gray-500 mt-1">Please wait</p>
        </div>
      </div>
    )
  }

  if (gameHistory.length === 0) {
    return (
      <div className={`bg-gray-900/50 border border-gray-700 rounded-lg p-4 ${className}`}>
        <div className="text-center text-gray-400">
          <div className="text-2xl mb-2">📊</div>
          <p className="text-sm">No bet history yet</p>
          <p className="text-xs text-gray-500 mt-1">Your game history will appear here</p>
          <p className="text-xs text-gray-600 mt-2">Play a game to see your history!</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gray-900/50 border border-gray-700 rounded-lg ${className}`}>
             {/* Header */}
       <div className="flex items-center justify-between p-4 border-b border-gray-700">
         <div className="flex items-center space-x-2">
           <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
           <h3 className="text-sm font-semibold text-white">Bet History</h3>
           <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
             {gameHistory.length}
           </span>
           {newEntriesCount > 0 && (
             <span className="text-xs text-green-400 bg-green-900/20 px-2 py-1 rounded animate-pulse">
               +{newEntriesCount} new
             </span>
           )}
         </div>
         <div className="flex items-center space-x-2">
           {newEntriesCount > 0 && onNewEntriesAcknowledged && (
             <button
               onClick={onNewEntriesAcknowledged}
               className="text-xs text-green-400 hover:text-green-300 transition-colors"
               title="Clear new entries notification"
             >
               ✓
             </button>
           )}
           <button
             onClick={() => setIsExpanded(!isExpanded)}
             className="text-gray-400 hover:text-white transition-colors"
           >
             {isExpanded ? "−" : "+"}
           </button>
         </div>
       </div>

      {/* Desktop Table */}
      <div className="!hidden md:!block">
        <div className="overflow-x-auto">
          <table className="w-full">
                         <thead>
               <tr className="border-b border-gray-700">
                 <th className="text-left p-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                   Time
                 </th>
                 <th className="text-left p-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                   User
                 </th>
                 <th className="text-left p-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                   Bet
                 </th>
                 <th className="text-left p-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                   Result
                 </th>
                 <th className="text-left p-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                   Winnings
                 </th>
                 <th className="text-left p-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                   Hands
                 </th>
               </tr>
             </thead>
            <tbody className="divide-y divide-gray-700">
              {gameHistory.slice(0, isExpanded ? gameHistory.length : 10).map((entry, index) => (
                                 <tr key={entry.id} className="hover:bg-gray-800/30 transition-colors">
                   <td className="p-3 text-xs text-gray-300">
                     <div>
                       <div className="font-medium">{formatTime(entry.timestamp)}</div>
                       <div className="text-gray-500">{formatDate(entry.timestamp)}</div>
                     </div>
                   </td>
                   <td className="p-3 text-xs text-gray-300">
                     <span className="font-medium text-blue-400">{entry.username || "Unknown"}</span>
                   </td>
                   <td className="p-3 text-xs text-gray-300">
                     <span className="font-medium">{entry.bet.toFixed(2)}</span>
                   </td>
                  <td className="p-3 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold ${getResultColor(entry.result)}`}>
                        {getResultIcon(entry.result)}
                      </span>
                      <span className={`capitalize ${getResultColor(entry.result)}`}>
                        {entry.result}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-xs">
                    <span className={`font-medium ${entry.winnings > 0 ? 'text-green-400' : 'text-gray-300'}`}>
                      {entry.winnings > 0 ? '+' : ''}{entry.winnings.toFixed(2)}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-gray-400">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <span className="text-blue-400">P:</span>
                        <span className="font-mono text-xs">{entry.playerHand}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-red-400">D:</span>
                        <span className="font-mono text-xs">{entry.dealerHand}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
              
      {/* Mobile Cards */}
      <div className="md:!hidden">
        <div className="space-y-2 p-4">
          {gameHistory.slice(0, isExpanded ? gameHistory.length : 3).map((entry) => (
                         <div key={entry.id} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
               <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center space-x-2">
                   <span className={`text-lg ${getResultColor(entry.result)}`}>
                     {getResultIcon(entry.result)}
                   </span>
                   <span className={`text-sm font-medium capitalize ${getResultColor(entry.result)}`}>
                     {entry.result}
                   </span>
                 </div>
                 <div className="text-right">
                   <div className="text-xs text-gray-400">
                     {formatTime(entry.timestamp)}
                   </div>
                   <div className="text-xs text-gray-500">
                     {formatDate(entry.timestamp)}
                   </div>
                 </div>
               </div>
               
               <div className="mb-2">
                 <div className="text-xs text-blue-400 font-medium">
                   {entry.username || "Unknown"}
                 </div>
               </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-400">Bet:</span>
                  <span className="ml-1 font-medium text-white">{entry.bet.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-400">Winnings:</span>
                  <span className={`ml-1 font-medium ${entry.winnings > 0 ? 'text-green-400' : 'text-gray-300'}`}>
                    {entry.winnings > 0 ? '+' : ''}{entry.winnings.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="mt-2 pt-2 border-t border-gray-700">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1">
                    <span className="text-blue-400">P:</span>
                    <span className="font-mono">{entry.playerHand}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-red-400">D:</span>
                    <span className="font-mono">{entry.dealerHand}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Show More/Less Button */}
      {gameHistory.length > (isExpanded ? gameHistory.length : 5) && (
        <div className="border-t border-gray-700 p-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-xs text-gray-400 hover:text-white transition-colors py-1"
          >
            {isExpanded ? "Show Less" : `Show ${gameHistory.length - 5} More`}
          </button>
        </div>
      )}
    </div>
  )
} 