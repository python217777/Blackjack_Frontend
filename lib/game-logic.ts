import type { Card } from "@/types/game"

export function createDeck(): Card[] {
  const suits: Card["suit"][] = ["♠", "♥", "♦", "♣"]
  const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
  const deck: Card[] = []

  for (const suit of suits) {
    for (const rank of ranks) {
      let value = Number.parseInt(rank)
      if (isNaN(value)) {
        if (rank === "A") {
          value = 11 // Ace starts as 11, adjusted later if needed
        } else {
          value = 10 // Face cards
        }
      }

      deck.push({ suit, rank, value })
    }
  }

  return deck
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function dealCard(deck: Card[]): Card {
  const card = deck.pop()
  if (!card) {
    throw new Error("Deck is empty")
  }
  return card
}

export function calculateHandValue(hand: Card[]): number {
  let value = 0
  let aces = 0

  // First, count all non-ace cards
  for (const card of hand) {
    if (card.rank === "A") {
      aces++
    } else {
      value += card.value
    }
  }

  // Then add aces optimally
  // Start by counting all aces as 1
  value += aces

  // Convert aces from 1 to 11 as long as it doesn't bust
  let acesAsEleven = 0
  while (acesAsEleven < aces && value + 10 <= 21) {
    value += 10 // Convert an ace from 1 to 11
    acesAsEleven++
  }

  return value
}

export function generateSeed(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function createHash(serverSeed: string, clientSeed: string): string {
  // In a real implementation, this would use crypto.createHash('sha256')
  // For demo purposes, we'll use a simple hash
  const combined = serverSeed + clientSeed
  let hash = 0
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16)
}

// Helper function to check if a hand is a blackjack
export function isBlackjack(hand: Card[]): boolean {
  return hand.length === 2 && calculateHandValue(hand) === 21
}

// Helper function to check if a hand can be split
export function canSplitHand(hand: Card[]): boolean {
  return hand.length === 2 && hand[0].rank === hand[1].rank
}

// Helper function to get the best possible hand description
export function getHandDescription(hand: Card[]): string {
  const value = calculateHandValue(hand)
  const isBlackjackHand = isBlackjack(hand)
  const isSoft = hand.some((card) => card.rank === "A") && value <= 21

  if (isBlackjackHand) {
    return "Blackjack!"
  } else if (value > 21) {
    return "Bust"
  } else if (isSoft && value !== 21) {
    return `Soft ${value}`
  } else {
    return value.toString()
  }
}
