export interface Card {
  suit: "♠" | "♥" | "♦" | "♣"
  rank: string
  value: number
  hidden?: boolean
}

export interface Player {
  id: string
  balance: number
  hand: Card[]
  bet: number
}

export interface SplitHand {
  cards: Card[]
  score: number
  bet: number
  isActive: boolean
  isComplete: boolean
}

export interface GameState {
  deck: Card[]
  playerHand: Card[]
  dealerHand: Card[]
  playerBalance: number
  currentBet: number
  gamePhase: "betting" | "dealing" | "player" | "dealer" | "gameOver"
  playerScore: number
  dealerScore: number
  message: string
  canDouble: boolean
  canSplit: boolean
  isDemo: boolean
  // Split functionality
  isSplit: boolean
  splitHands: SplitHand[]
  activeSplitHand: number
}
