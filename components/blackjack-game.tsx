"use client"

import { useState, useEffect, useMemo } from "react"
import { AnimatedHomepage } from "./animated-homepage"
import { LuxuryHeader } from "./luxury-header"
import { PremiumGameTable } from "./premium-game-table"
import { PremiumBettingPanel } from "./premium-betting-panel"
import { JupiterSwapModal } from "./jupiter-swap-modal"
import { SoundManager } from "./sound-manager"
import type { Card, GameState, SplitHand } from "@/types/game"
import { createDeck, shuffleDeck, calculateHandValue, dealCard, generateSeed, createHash } from "@/lib/game-logic"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey, sendAndConfirmTransaction, Signer } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount, getOrCreateAssociatedTokenAccount, getMint, transfer } from '@solana/spl-token';
import { ADMIN_WALLET_ADDRESS, connection, BJ_TOKEN_MINT, BJ_TOKEN_DECIMALS } from '../constant/system';
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { createTransferInstruction, createAssociatedTokenAccountInstruction } from "@solana/spl-token";
import { Transaction } from "@solana/web3.js";
import { IDL } from "../constant/system";
import { checkIfUserInitialized, createTokenAccount, getBettingProgram, getBettingProgramWithAdminWallet, getVaultPDA, initializeUser, stakeTokens, unstakeTokens, getVaultTokenAccount } from "@/lib/bet";
import { Wallet } from "@project-serum/anchor";
import { FairnessDialog } from "./fairness-dialog";
// import { ChainId, HiddenUI, LiFiWidget, RequiredUI, WidgetConfig } from "@lifi/widget";
import { BetHistoryTable } from "./bet-history-table";
import { luckyCasinoAPI } from "../lib/api";

import { useAllowDenyLists } from "../hooks/useAllowDenyLists";
import { useDefaultChain } from "../hooks/useDefaultChain";
import { calculateFee } from "../utils/fee";
import { darkTheme } from "../themes/dark";
import { Dialog, DialogContent } from "./ui/dialog";
import "@jup-ag/terminal/css";

interface BlackjackGameProps {
  onBack?: () => void;
}

export function BlackjackGame({ onBack }: BlackjackGameProps = {}) {
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [gameStarted, setGameStarted] = useState(true)
  const [chipStacks, setChipStacks] = useState<{ value: number; count: number }[]>([])
  const [winStreak, setWinStreak] = useState(0)
  const [lastBetAmount, setLastBetAmount] = useState(0)
  const [solBalance, setSolBalance] = useState(0) // 10,000 $BJ starting balance
  const [gameHistory, setGameHistory] = useState<
    Array<{
      id: string
      timestamp: Date
      bet: number
      result: "win" | "lose" | "push"
      winnings: number
      playerHand: string
      dealerHand: string
    }>
  >([])

  // Sound settings state
  const [musicEnabled, setMusicEnabled] = useState(true)
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(true)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [newEntriesCount, setNewEntriesCount] = useState(0)
  const [isBetHistoryCollapsed, setIsBetHistoryCollapsed] = useState(true)

  const [lastBetTime, setLastBetTime] = useState(0)
  const [serverSeed, setServerSeed] = useState<string>(generateSeed());
  const [clientSeed, setClientSeed] = useState<string>(generateSeed());
  const [serverSeedHash, setServerSeedHash] = useState<string>(createHash(serverSeed, ""));
  const [showFairness, setShowFairness] = useState(false);

  const MINIMUM_BET_INTERVAL = 1000

  const [gameState, setGameState] = useState<GameState>({
    deck: [],
    playerHand: [],
    dealerHand: [],
    playerBalance: 10000, // 10,000 $BJ for demo
    currentBet: 0,
    gamePhase: "betting",
    playerScore: 0,
    dealerScore: 0,
    message: "Place your bet to start",
    canDouble: false,
    canSplit: false,
    isDemo: true,
    isSplit: false,
    splitHands: [],
    activeSplitHand: 0,
  })

  const { publicKey, connected, connect, disconnect, connecting, wallet, signTransaction } = useWallet();

  const [showSwapModal, setShowSwapModal] = useState(false)

  // LiFiWidget config
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const allowDenyLists = useAllowDenyLists(searchParams);
  const defaultFromChain = useDefaultChain(searchParams);

  useEffect(() => {
    const newDeck = shuffleDeck(createDeck())
    setGameState((prev) => ({ ...prev, deck: newDeck }))
  }, [])

  const startDemo = () => {
    setGameStarted(true)
    setGameState((prev) => ({
      ...prev,
      isDemo: true,
      playerBalance: 10000, // 10,000 $BJ for demo
    }))
    setChipStacks([])
  }
  useEffect(() => {
    if (showSwapModal) {
      import("@jup-ag/terminal").then((mod) => {
        const { init } = mod;
        init({
          displayMode: "integrated",
          integratedTargetId: "jupiter-terminal",
        });
      });
    }
  }, [showSwapModal]);
  useEffect(() => {
    if (connected) {
      handleWalletConnect(wallet?.adapter.name || "")
    }
  }, [connected, wallet])

  useEffect(() => {
    if (!wallet) return;

    const handleDisconnect = () => {
      handleWalletDisconnect();
    };

    wallet.adapter.on("disconnect", handleDisconnect);

    return () => {
      wallet.adapter.off("disconnect", handleDisconnect);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);

  useEffect(() => {
    if (gameState.isDemo) return; // Don't poll in demo mode

    // Initial fetch
    fetchBetHistoryRealtime();

    // Set up interval for real-time updates
    const interval = setInterval(() => {
      fetchBetHistoryRealtime();
    }, 5000); // 5 seconds

    // Cleanup interval on unmount or when demo mode changes
    return () => {
      clearInterval(interval);
    };
  }, [gameState.isDemo]);

  const balanceUpdate = async () => {
    if (!publicKey) return;
    const ata = await getAssociatedTokenAddress(BJ_TOKEN_MINT, publicKey);

    let balance = 0;
    try {
      const accountInfo = await getAccount(connection, ata);
      balance = Number(accountInfo.amount) / 1_000_000;
      console.log("balance", balance);
    } catch (e) {
      balance = 0;
    }

    setSolBalance(balance);
  }

  const fetchBetHistory = async () => {
    setIsLoadingHistory(true);
    try {
      // Fetch all bet histories, not just current user's
      const historyData = await luckyCasinoAPI.getAllBetHistory(1, 50);

      // Check if API returned an error
      if (!historyData || !historyData.data || !historyData.data.bets) {
        console.log('No bet history data available');
        setGameHistory([]);
        return;
      }

      // Transform backend data to match our local format
      const transformedHistory = historyData.data.bets.map((bet: any) => ({
        id: bet.id || bet._id,
        timestamp: new Date(bet.created_at || bet.timestamp),
        bet: Number(bet.bet_amount) || 0,
        result: bet.result,
        winnings: Number(bet.win_amount || bet.net_profit) || 0,
        playerHand: bet.game_data?.player_hand || "Unknown",
        dealerHand: bet.game_data?.dealer_hand || "Unknown",
        username: bet.username || bet.wallet_address?.slice(0, 8) + "..." || "Unknown",
      }));

      setGameHistory(transformedHistory);
    } catch (error) {
      console.error("Failed to fetch bet history from API:", error);
      // Keep existing local history if API fails
    } finally {
      setIsLoadingHistory(false);
    }
  }

  // Fetch bet history when wallet connects or component mounts
  useEffect(() => {
    if (!gameState.isDemo) {
      fetchBetHistory();
    }
  }, [gameState.isDemo]);

  const fetchBetHistoryRealtime = async () => {
    try {
      // Fetch all bet histories, not just current user's
      const historyData = await luckyCasinoAPI.getAllBetHistory(1, 50);

      // Check if API returned an error
      if (!historyData || !historyData.data || !historyData.data.bets) {
        console.log('No bet history data available');
        return;
      }

      // Transform backend data to match our local format
      const transformedHistory = historyData.data.bets.map((bet: any) => ({
        id: bet.id || bet._id,
        timestamp: new Date(bet.created_at || bet.timestamp),
        bet: Number(bet.bet_amount) || 0,
        result: bet.result,
        winnings: Number(bet.win_amount || bet.net_profit) || 0,
        playerHand: bet.game_data?.player_hand || "Unknown",
        dealerHand: bet.game_data?.dealer_hand || "Unknown",
        username: bet.username || bet.wallet_address?.slice(0, 8) + "..." || "Unknown",
      }));

      // Only update if there are new entries
      setGameHistory((prevHistory) => {
        if (prevHistory.length === 0) {
          // If no previous history, set the new history
          console.log("Initial bet history loaded:", transformedHistory.length, "entries");
          return transformedHistory;
        }

        // Check if there are new entries by comparing IDs
        const existingIds = new Set(prevHistory.map((entry: any) => entry.id));
        const newEntries = transformedHistory.filter((entry: any) => !existingIds.has(entry.id));

        if (newEntries.length > 0) {
          console.log("New bet history entries found:", newEntries.length, "entries");
          // Update new entries count for notification
          setNewEntriesCount(newEntries.length);
          // Add new entries to the beginning (most recent first)
          return [...newEntries, ...prevHistory];
        }

        // No new entries, keep existing history
        return prevHistory;
      });
    } catch (error) {
      console.error("Failed to fetch realtime bet history from API:", error);
      // Don't update loading state for realtime updates
    }
  }

  const handleWalletConnect = async (walletName: string) => {
    try {
      if (!publicKey) return;

      try {
        balanceUpdate();
      } catch (err) {
        console.error("Failed to fetch $BJ token balance:", err);
        setSolBalance(0);
      }
      setGameStarted(true)
      setGameState((prev) => ({
        ...prev,
        isDemo: false,
        playerBalance: 0,
      }))
      setChipStacks([])
      console.log(`Wallet connected: ${walletName}`)
    } catch (error) {
      console.error("Wallet connection error:", error)
    }
  }

  const handleWalletDisconnect = () => {
    setGameStarted(false) // Return to homepage
    setSolBalance(10000) // Reset to $1000
    setGameHistory([]) // Clear history
    setWinStreak(0) // Reset streak

    // Reset game state to initial
    setGameState({
      deck: shuffleDeck(createDeck()),
      playerHand: [],
      dealerHand: [],
      playerBalance: 10000,
      currentBet: 0,
      gamePhase: "betting",
      playerScore: 0,
      dealerScore: 0,
      message: "Place your bet to start",
      canDouble: false,
      canSplit: false,
      isDemo: true,
      isSplit: false,
      splitHands: [],
      activeSplitHand: 0,
    })

    console.log("Wallet disconnected")
  }

  const placeBet = async (amount: number) => {
    const now = Date.now()
    if (now - lastBetTime < MINIMUM_BET_INTERVAL) {
      console.warn("Betting too quickly")
      return
    }

    // Use the correct balance based on mode
    const currentBalance = gameState.isDemo ? gameState.playerBalance : solBalance
    const prevGameState = { ...gameState };

    if (amount > currentBalance) {
      setGameState((prev) => ({ ...prev, message: "Insufficient balance" }))
      return
    }
    setLastBetTime(now)
    setLastBetAmount(amount)

    // Always deduct from the appropriate balance
    if (gameState.isDemo) {
      setGameState((prev) => ({
        ...prev,
        currentBet: amount,
        playerBalance: prev.playerBalance - amount,
        gamePhase: "dealing",
        message: "Dealing cards...",
        isSplit: false,
        splitHands: [],
        activeSplitHand: 0,
      }))
    } else {
      setGameState((prev) => ({
        ...prev,
        currentBet: amount,
        gamePhase: "dealing",
        message: "Dealing cards...",
        isSplit: false,
        splitHands: [],
        activeSplitHand: 0,
      }))

      const isSuccess = await deposit(prevGameState, amount);
      if (!isSuccess) return;
    }

    setChipStacks([])

    setTimeout(() => {
      dealInitialCards(amount)
    }, 1000)
  }

  const deposit = async (prevGameState: GameState, amount: number) => {
    if (!publicKey) return false;

    try {
      const fromTokenAccount = await getAssociatedTokenAddress(
        BJ_TOKEN_MINT,
        publicKey,
        false
      );

      const transaction = new Transaction();
      if ((await connection.getAccountInfo(fromTokenAccount)) == null) {
        transaction.add(createTokenAccount(publicKey, BJ_TOKEN_MINT, fromTokenAccount, publicKey));
      }

      const [vaultPDA] = getVaultPDA();
      let toTokenAccount = await getAssociatedTokenAddress(
        BJ_TOKEN_MINT,
        vaultPDA,
        true
      );

      if ((await connection.getAccountInfo(toTokenAccount)) == null) {
        transaction.add(
          createTokenAccount(
            publicKey,
            BJ_TOKEN_MINT,
            toTokenAccount,
            vaultPDA
          )
        );
      }

      const program = getBettingProgram(connection);

      const isUserInitialized = await checkIfUserInitialized(program, publicKey);

      if (!isUserInitialized) {
        const initializeUserIx = await initializeUser(program, publicKey);
        transaction.add(initializeUserIx);
      }

      const amountToTransfer = amount * 10 ** BJ_TOKEN_DECIMALS; // Send 1 token

      const transferIx = await stakeTokens(
        program,
        publicKey,
        amountToTransfer,
        fromTokenAccount,
        toTokenAccount
      );

      transaction.add(transferIx);

      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      transaction.feePayer = publicKey;

      await submitTransaction(transaction);
      setSolBalance((prev) => prev - amount);
      return true;
    } catch (e: any) {
      setGameState({ ...prevGameState, message: e.message });
      return false;
    }
  }

  const submitTransaction = async (transaction: Transaction) => {
    const signed = await signTransaction?.(transaction);
    const txid = await connection.sendRawTransaction(signed?.serialize() || new Uint8Array(), {
      skipPreflight: true,
    });
    console.log('✅ Transaction successful:', txid);
  }

  const dealInitialCards = (amount: number) => {
    const newDeck = [...gameState.deck]
    const playerHand: Card[] = []
    const dealerHand: Card[] = []

    if (gameState.isDemo) {
      if (Math.random() < 0.7) {
        const strongHands = [
          [
            { suit: "♠" as const, rank: "A", value: 11 },
            { suit: "♥" as const, rank: "9", value: 9 },
          ],
          [
            { suit: "♦" as const, rank: "K", value: 10 },
            { suit: "♣" as const, rank: "Q", value: 10 },
          ],
          [
            { suit: "♠" as const, rank: "A", value: 11 },
            { suit: "♥" as const, rank: "K", value: 10 },
          ],
          [
            { suit: "♦" as const, rank: "10", value: 10 },
            { suit: "♣" as const, rank: "9", value: 9 },
          ],
          [
            { suit: "♠" as const, rank: "8", value: 8 },
            { suit: "♥" as const, rank: "8", value: 8 },
          ],
        ]
        const selectedHand = strongHands[Math.floor(Math.random() * strongHands.length)]
        playerHand.push(...selectedHand)

        const weakDealerHands = [
          [
            { suit: "♠" as const, rank: "6", value: 6 },
            { suit: "♥" as const, rank: "5", value: 5 },
          ],
          [
            { suit: "♦" as const, rank: "4", value: 4 },
            { suit: "♣" as const, rank: "7", value: 7 },
          ],
          [
            { suit: "♠" as const, rank: "5", value: 5 },
            { suit: "♥" as const, rank: "6", value: 6 },
          ],
        ]
        const selectedDealerHand = weakDealerHands[Math.floor(Math.random() * weakDealerHands.length)]
        dealerHand.push(...selectedDealerHand)
      } else {
        for (let i = 0; i < 2; i++) {
          playerHand.push(dealCard(newDeck))
          dealerHand.push(dealCard(newDeck))
        }
      }
    } else {
      for (let i = 0; i < 2; i++) {
        playerHand.push(dealCard(newDeck))
        dealerHand.push(dealCard(newDeck))
      }
    }

    if (dealerHand.length >= 2) {
      dealerHand[1].hidden = true
    }

    const playerScore = calculateHandValue(playerHand)
    const visibleDealerScore = calculateHandValue([dealerHand[0]])

    const currentBalance = gameState.isDemo ? gameState.playerBalance : solBalance

    const canDouble = playerHand.length === 2 && gameState.currentBet <= currentBalance
    const canSplit = playerHand.length === 2 && playerHand[0].rank === playerHand[1].rank

    setGameState((prev) => ({
      ...prev,
      deck: newDeck,
      playerHand,
      dealerHand,
      playerScore,
      dealerScore: visibleDealerScore,
      gamePhase: playerScore === 21 ? "dealer" : "player",
      message: playerScore === 21 ? "Blackjack!" : "Hit or Stand?",
      canDouble,
      canSplit,
    }))

    if (playerScore === 21) {
      setTimeout(() => {
        dealerPlay(playerScore, amount, playerHand, dealerHand)
      }, 2000)
    }
  }

  const split = async () => {
    if (!gameState.canSplit) return

    const currentBalance = gameState.isDemo ? gameState.playerBalance : solBalance

    if (gameState.currentBet > currentBalance) return

    const splitBet = gameState.currentBet
    const firstCard = gameState.playerHand[0]
    const secondCard = gameState.playerHand[1]
    const isAceSplit = firstCard.rank === "A"

    const splitHands: SplitHand[] = [
      {
        cards: [firstCard],
        score: calculateHandValue([firstCard]),
        bet: splitBet,
        isActive: true,
        isComplete: false,
      },
      {
        cards: [secondCard],
        score: calculateHandValue([secondCard]),
        bet: splitBet,
        isActive: false,
        isComplete: false,
      },
    ]

    const newDeck = [...gameState.deck]
    const prevGameState = { ...gameState };

    splitHands[0].cards.push(dealCard(newDeck))
    splitHands[0].score = calculateHandValue(splitHands[0].cards)

    splitHands[1].cards.push(dealCard(newDeck))
    splitHands[1].score = calculateHandValue(splitHands[1].cards)

    // Deduct from appropriate balance
    if (gameState.isDemo) {
      setGameState((prev) => ({
        ...prev,
        deck: newDeck,
        playerBalance: prev.playerBalance - splitBet,
        currentBet: splitBet * 2,
        isSplit: true,
        splitHands,
        activeSplitHand: isAceSplit ? -1 : 0,
        canDouble: !isAceSplit && currentBalance >= splitBet,
        canSplit: false,
        playerHand: [],
        playerScore: isAceSplit ? 0 : splitHands[0].score,
        message: isAceSplit ? "Split Aces complete - Dealer playing..." : "Playing split hand 1",
        gamePhase: isAceSplit ? "dealer" : "player",
      }))
    } else {
      const isSuccess = await deposit(prevGameState, splitBet);
      if (!isSuccess) return;

      setGameState((prev) => ({
        ...prev,
        deck: newDeck,
        currentBet: splitBet * 2,
        isSplit: true,
        splitHands,
        activeSplitHand: isAceSplit ? -1 : 0,
        canDouble: !isAceSplit && currentBalance >= splitBet,
        canSplit: false,
        playerHand: [],
        playerScore: isAceSplit ? 0 : splitHands[0].score,
        message: isAceSplit ? "Split Aces complete - Dealer playing..." : "Playing split hand 1",
        gamePhase: isAceSplit ? "dealer" : "player",
      }))
    }

    if (isAceSplit) {
      splitHands[0].isComplete = true
      splitHands[0].isActive = false
      splitHands[1].isComplete = true
      splitHands[1].isActive = false

      setTimeout(() => {
        dealerPlay(splitHands[0].score, gameState.currentBet, gameState.playerHand, gameState.dealerHand)
      }, 2000)
    }
  }

  const hit = (playerScore: number, dealerScore: number, amount: number) => {
    const newDeck = [...gameState.deck]
    let newCard: Card

    if (gameState.isSplit) {
      const newSplitHands = [...gameState.splitHands]
      const activeHand = newSplitHands[gameState.activeSplitHand]

      if (gameState.isDemo && activeHand.score <= 11) {
        const goodCards = [
          { suit: "♠" as const, rank: "9", value: 9 },
          { suit: "♥" as const, rank: "8", value: 8 },
          { suit: "♦" as const, rank: "7", value: 7 },
          { suit: "♣" as const, rank: "6", value: 6 },
        ]
        newCard = goodCards[Math.floor(Math.random() * goodCards.length)]
      } else {
        newCard = dealCard(newDeck)
      }

      activeHand.cards.push(newCard)
      activeHand.score = calculateHandValue(activeHand.cards)

      if (activeHand.score >= 21) {
        activeHand.isComplete = true
        activeHand.isActive = false

        if (gameState.activeSplitHand < newSplitHands.length - 1) {
          const nextHandIndex = gameState.activeSplitHand + 1
          newSplitHands[nextHandIndex].isActive = true

          const currentBalance = gameState.isDemo ? gameState.playerBalance : solBalance

          setGameState((prev) => ({
            ...prev,
            deck: newDeck,
            splitHands: newSplitHands,
            activeSplitHand: nextHandIndex,
            playerScore: newSplitHands[nextHandIndex].score,
            canDouble: currentBalance >= prev.currentBet / 2 && newSplitHands[nextHandIndex].cards.length === 2,
            message: `Playing split hand ${nextHandIndex + 1}`,
          }))
        } else {
          setGameState((prev) => ({
            ...prev,
            deck: newDeck,
            splitHands: newSplitHands,
            gamePhase: "dealer",
            canDouble: false,
            message: "Dealer playing...",
          }))

          setTimeout(() => {
            dealerPlay(playerScore, amount, gameState.playerHand, gameState.dealerHand)
          }, 1000)
        }
      } else {
        setGameState((prev) => ({
          ...prev,
          deck: newDeck,
          splitHands: newSplitHands,
          playerScore: activeHand.score,
          canDouble: false,
        }))
      }
    } else {
      if (gameState.isDemo && gameState.playerScore <= 11) {
        const goodCards = [
          { suit: "♠" as const, rank: "9", value: 9 },
          { suit: "♥" as const, rank: "8", value: 8 },
          { suit: "♦" as const, rank: "7", value: 7 },
          { suit: "♣" as const, rank: "6", value: 6 },
        ]
        newCard = goodCards[Math.floor(Math.random() * goodCards.length)]
      } else {
        newCard = dealCard(newDeck)
      }

      const newPlayerHand = [...gameState.playerHand, newCard]
      const newScore = calculateHandValue(newPlayerHand)

      setGameState((prev) => ({
        ...prev,
        deck: newDeck,
        playerHand: newPlayerHand,
        playerScore: newScore,
        canDouble: false,
        canSplit: false,
        gamePhase: newScore > 21 ? "gameOver" : "player",
        message: newScore > 21 ? "Bust! Dealer wins" : "Hit or Stand?",
      }))

      if (newScore > 21) {
        setTimeout(() => {
          endGame("lose", amount, playerScore, dealerScore, newPlayerHand, gameState.dealerHand)
        }, 1500)
      }
    }
  }

  const stand = (playerScore: number, amount: number) => {
    if (gameState.isSplit) {
      const newSplitHands = [...gameState.splitHands]
      const activeHand = newSplitHands[gameState.activeSplitHand]

      activeHand.isComplete = true
      activeHand.isActive = false

      if (gameState.activeSplitHand < newSplitHands.length - 1) {
        const nextHandIndex = gameState.activeSplitHand + 1
        newSplitHands[nextHandIndex].isActive = true

        const currentBalance = gameState.isDemo ? gameState.playerBalance : solBalance

        setGameState((prev) => ({
          ...prev,
          splitHands: newSplitHands,
          activeSplitHand: nextHandIndex,
          playerScore: newSplitHands[nextHandIndex].score,
          canDouble: currentBalance >= prev.currentBet / 2 && newSplitHands[nextHandIndex].cards.length === 2,
          message: `Playing split hand ${nextHandIndex + 1}`,
        }))
      } else {
        setGameState((prev) => ({
          ...prev,
          splitHands: newSplitHands,
          gamePhase: "dealer",
          canDouble: false,
          message: "Dealer playing...",
        }))

        setTimeout(() => {
          dealerPlay(playerScore, amount, gameState.playerHand, gameState.dealerHand)
        }, 1000)
      }
    } else {
      setGameState((prev) => ({
        ...prev,
        gamePhase: "dealer",
        message: "Dealer playing...",
      }))

      setTimeout(() => {
        dealerPlay(playerScore, amount, gameState.playerHand, gameState.dealerHand)
      }, 1000)
    }
  }

  const doubleDown = async () => {
    const currentBalance = gameState.isDemo ? gameState.playerBalance : solBalance
    const prevGameState = { ...gameState };

    if (gameState.isSplit) {
      const splitBet = gameState.currentBet / 2

      if (splitBet > currentBalance) {
        setGameState((prev) => ({ ...prev, message: "Insufficient balance to double" }))
        return
      }

      const newSplitHands = [...gameState.splitHands]
      const activeHand = newSplitHands[gameState.activeSplitHand]
      activeHand.bet = splitBet * 2

      if (gameState.isDemo) {
        setGameState((prev) => ({
          ...prev,
          playerBalance: prev.playerBalance - splitBet,
          currentBet: prev.currentBet + splitBet,
          splitHands: newSplitHands,
          canDouble: false,
        }))
      } else {
        const isSuccess = await deposit(prevGameState, splitBet);
        if (!isSuccess) return;

        setGameState((prev) => ({
          ...prev,
          currentBet: prev.currentBet + splitBet,
          splitHands: newSplitHands,
          canDouble: false,
        }))
      }

      hit(gameState.playerScore, gameState.dealerScore, prevGameState.currentBet + splitBet)
    } else {
      if (gameState.currentBet > currentBalance) {
        setGameState((prev) => ({ ...prev, message: "Insufficient balance to double" }))
        return
      }

      if (gameState.isDemo) {
        setGameState((prev) => ({
          ...prev,
          playerBalance: prev.playerBalance - prev.currentBet,
          currentBet: prev.currentBet * 2,
          canDouble: false,
        }))
      } else {
        const isSuccess = await deposit(prevGameState, prevGameState.currentBet * 2);
        if (!isSuccess) return;

        setGameState((prev) => ({
          ...prev,
          currentBet: prev.currentBet * 2,
          canDouble: false,
        }))
      }

      hit(gameState.playerScore, gameState.dealerScore, prevGameState.currentBet * 2)
    }
  }

  const dealerPlay = (playerScore: number, amount: number, playerHand: Card[], dealerHand: Card[]) => {
    console.log("dealerPlay", playerScore);
    const newDealerHand = [...gameState.dealerHand]
    const newDeck = [...gameState.deck]

    if (newDealerHand.length >= 2 && newDealerHand[1]) {
      newDealerHand[1].hidden = false
    }

    let dealerScore = calculateHandValue(newDealerHand)

    if (gameState.isDemo) {
      const hasWinningHand = gameState.isSplit
        ? gameState.splitHands.some((hand) => hand.score <= 21)
        : playerScore <= 21

      if (hasWinningHand) {
        while (dealerScore < 17) {
          if (Math.random() < 0.6 && dealerScore >= 12) {
            const bustCards = [
              { suit: "♠" as const, rank: "10", value: 10 },
              { suit: "♥" as const, rank: "J", value: 10 },
              { suit: "♦" as const, rank: "Q", value: 10 },
              { suit: "♣" as const, rank: "K", value: 10 },
            ]
            newDealerHand.push(bustCards[Math.floor(Math.random() * bustCards.length)])
          } else {
            newDealerHand.push(dealCard(newDeck))
          }
          dealerScore = calculateHandValue(newDealerHand)
        }
      } else {
        while (dealerScore < 17) {
          newDealerHand.push(dealCard(newDeck))
          dealerScore = calculateHandValue(newDealerHand)
        }
      }
    } else {
      while (dealerScore < 17) {
        newDealerHand.push(dealCard(newDeck))
        dealerScore = calculateHandValue(newDealerHand)
      }
    }

    setGameState((prev) => ({
      ...prev,
      deck: newDeck,
      dealerHand: newDealerHand,
      dealerScore,
      gamePhase: "gameOver",
    }))

    setTimeout(() => {
      if (gameState.isSplit) {
        determineSplitWinner(dealerScore, dealerHand)
      } else {
        determineWinner(playerScore, dealerScore, amount, playerHand, dealerHand)
      }
    }, 1500)
  }

  const determineSplitWinner = (dealerScore: number, dealerHand: Card[]) => {
    console.log("determineSplitWinner", dealerScore);
    let totalWinnings = 0
    let winCount = 0
    let loseCount = 0
    let pushCount = 0
    let blackjackCount = 0

    gameState.splitHands.forEach((hand) => {
      const isBlackjack = hand.score === 21 && hand.cards.length === 2
      const dealerBlackjack = dealerScore === 21 && dealerHand.length === 2

      if (hand.score > 21) {
        loseCount++
      } else if (isBlackjack && !dealerBlackjack) {
        // Blackjack on split pays 3:2
        totalWinnings += Math.floor(hand.bet + hand.bet * 1.5)
        winCount++
        blackjackCount++
      } else if (dealerScore > 21) {
        totalWinnings += hand.bet * 2
        winCount++
      } else if (hand.score > dealerScore) {
        totalWinnings += hand.bet * 2
        winCount++
      } else if (hand.score === dealerScore) {
        totalWinnings += hand.bet
        pushCount++
      } else {
        loseCount++
      }
    })

    let message = ""
    if (blackjackCount > 0) {
      message = `Split: ${blackjackCount} Blackjack${blackjackCount > 1 ? "s" : ""}, ${winCount - blackjackCount} win${winCount - blackjackCount !== 1 ? "s" : ""}, ${loseCount} loss${loseCount !== 1 ? "es" : ""}, ${pushCount} push${pushCount !== 1 ? "es" : ""}`
    } else if (winCount > 0 && loseCount === 0 && pushCount === 0) {
      message = "Split hands win!"
    } else if (loseCount > 0 && winCount === 0 && pushCount === 0) {
      message = "Split hands lose"
    } else {
      message = `Split: ${winCount} win${winCount !== 1 ? "s" : ""}, ${loseCount} loss${loseCount !== 1 ? "es" : ""}, ${pushCount} push${pushCount !== 1 ? "es" : ""}`
    }

    if (winCount > loseCount) {
      setWinStreak((prev) => prev + 1)
    } else if (loseCount > winCount) {
      setWinStreak(0)
    }

    // Add winnings to appropriate balance with floor rounding for precision
    if (gameState.isDemo) {
      setGameState((prev) => ({
        ...prev,
        playerBalance: Math.floor(prev.playerBalance + totalWinnings),
        message,
      }))
    } else {
      setSolBalance((prev) => Math.floor(prev + totalWinnings))
      setGameState((prev) => ({
        ...prev,
        message,
      }))
    }

    endGameCleanup(winCount > loseCount ? "win" : loseCount > winCount ? "lose" : "push")
  }

  const determineWinner = (playerScore: number, dealerScore: number, amount: number, playerHand: Card[], dealerHand: Card[]) => {
    console.log("determineWinner", playerScore, dealerScore);
    const isPlayerBlackjack = playerScore === 21 && playerHand.length === 2
    const isDealerBlackjack = dealerScore === 21 && dealerHand.length === 2
    if (isPlayerBlackjack && !isDealerBlackjack) {
      endGame("win", amount, playerScore, dealerScore, playerHand, dealerHand)
      return
    }

    let result: "win" | "lose" | "push"

    if (playerScore > 21) {
      result = "lose"
    } else if (dealerScore > 21) {
      result = "win"
    } else if (playerScore > dealerScore) {
      result = "win"
    } else if (dealerScore > playerScore) {
      result = "lose"
    } else {
      result = "push"
    }

    endGame(result, amount, playerScore, dealerScore, playerHand, dealerHand)
  }

  const endGame = async (result: "win" | "lose" | "push", amount: number, playerScore: number, dealerScore: number, playerHand: Card[], dealerHand: Card[]) => {
    console.log("endGame", result);
    let winnings = 0
    let message = ""
    const isPlayerBlackjack = playerScore === 21 && playerHand.length === 2
    const isDealerBlackjack = dealerScore === 21 && dealerHand.length === 2
    let winFlag = 1;

    switch (result) {
      case "win":
        if (isPlayerBlackjack && !isDealerBlackjack) {
          // Blackjack pays 3:2 (1.5x the bet plus original bet back)
          winnings = Math.floor(amount + amount * 1.5)
          message = "Blackjack! You win!"
          winFlag = 3;
        } else {
          // Regular win pays 2:1 (1x the bet plus original bet back)
          winnings = amount * 2
          message = "You win!"
          winFlag = 1;
        }
        setWinStreak((prev) => prev + 1)
        break
      case "lose":
        winnings = 0
        message = "Dealer wins"
        setWinStreak(0)
        break
      case "push":
        // Push returns original bet
        winnings = gameState.currentBet
        message = "Push!"
        break
    }

    console.log("endGame", result, winnings);

    // Log game to history with precise calculations
    const netProfit = winnings - gameState.currentBet
    const gameRecord = {
      id: Date.now().toString(),
      timestamp: new Date(),
      bet: gameState.currentBet,
      result,
      winnings: netProfit, // Net profit/loss
      playerHand: gameState.playerHand.map((c) => c.rank).join(", "),
      dealerHand: gameState.dealerHand.map((c) => c.rank).join(", "),
      username: publicKey ? publicKey.toBase58() : 'demo'
    }

    // Add winnings to appropriate balance with precise arithmetic
    if (gameState.isDemo) {
      setGameState((prev) => ({
        ...prev,
        playerBalance: Math.floor(prev.playerBalance + winnings),
        message,
      }))
    } else {
      await luckyCasinoAPI.saveBetResult(publicKey ? publicKey.toBase58() : 'demo', {
        game_type: 'blackjack',
        bet_amount: gameState.currentBet,
        result,
        win_amount: winnings,
        game_data: {
          player_score: playerScore,
          dealer_score: dealerScore,
          player_hand: playerHand.map(card => `${card.rank}${card.suit}`),
          dealer_hand: dealerHand.map(card => `${card.rank}${card.suit}`),
          is_blackjack: isPlayerBlackjack,
        }
      });

      if (result === "win") {
        payoutTokens(winFlag, winnings);
      }
      if (result === "push") {
        payoutTokens(2, winnings);
      }
      if (result === "lose") {
        payoutTokens(0, winnings);
      }
      setGameState((prev) => ({
        ...prev,
        message,
      }))
    }

    endGameCleanup(result)
  }

  const payoutTokens = async (flag: number, winnings: number) => {
    if (!publicKey) return;

    const program = getBettingProgramWithAdminWallet();

    const userTokenAccount = await getAssociatedTokenAddress(BJ_TOKEN_MINT, publicKey);
    const vaultTokenAccount = await getVaultTokenAccount(BJ_TOKEN_MINT);

    await unstakeTokens(
      program,
      publicKey,
      flag,
      userTokenAccount,
      vaultTokenAccount
    );

    console.log("payoutTokens", flag, winnings);

    setSolBalance((prev) => Math.floor(prev + winnings));
  }

  const endGameCleanup = (result: "win" | "lose" | "push") => {
    setTimeout(
      () => {
        setGameState((prev) => ({
          ...prev,
          playerHand: [],
          dealerHand: [],
          currentBet: 0,
          playerScore: 0,
          dealerScore: 0,
          message: "Place your bet to start",
          gamePhase: "betting",
          canDouble: false,
          canSplit: false,
          isSplit: false,
          splitHands: [],
          activeSplitHand: 0,
        }))
      },
      result === "lose" ? 3000 : 5000,
    )
  }

  const newGame = () => {
    const newDeck = shuffleDeck(createDeck())
    const newServerSeed = generateSeed();
    setServerSeed(newServerSeed);
    setClientSeed(generateSeed());
    setServerSeedHash(createHash(newServerSeed, clientSeed));

    setGameState((prev) => ({
      ...prev,
      deck: newDeck,
      playerHand: [],
      dealerHand: [],
      currentBet: 0,
      gamePhase: "betting",
      playerScore: 0,
      dealerScore: 0,
      message: "Place your bet to start",
      canDouble: false,
      canSplit: false,
      isSplit: false,
      splitHands: [],
      activeSplitHand: 0,
    }))
    setChipStacks([])
  }

  // After a round ends and before a new bet, also clear chips
  useEffect(() => {
    if (gameState.gamePhase === "betting" && gameState.currentBet === 0) {
      setChipStacks([])
    }
  }, [gameState.gamePhase, gameState.currentBet]);

  if (!gameStarted) {
    return (
      <>
        <AnimatedHomepage onStartDemo={startDemo} showFairness={showFairness} setShowFairness={setShowFairness} />
        <FairnessDialog showFairness={showFairness} setShowFairness={setShowFairness} serverSeedHash={serverSeedHash} serverSeed={serverSeed} clientSeed={clientSeed} />
      </>
    )
  }

  return (
    <>
      <div className="h-screen bg-black text-white overflow-hidden flex flex-col">
        <SoundManager musicEnabled={musicEnabled} soundEffectsEnabled={soundEffectsEnabled} currentTrack={currentTrack} />
        

        <LuxuryHeader
          balance={gameState.isDemo ? gameState.playerBalance : solBalance}
          solBalance={solBalance}
          onSwapClick={() => setShowSwapModal(true)}
          isDemo={gameState.isDemo}
          musicEnabled={musicEnabled}
          soundEffectsEnabled={soundEffectsEnabled}
          currentTrack={currentTrack}
          onToggleMusic={() => setMusicEnabled(!musicEnabled)}
          onToggleSoundEffects={() => setSoundEffectsEnabled(!soundEffectsEnabled)}
          onChangeTrack={setCurrentTrack}
        />
        {/* Main Game Layout - Responsive */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Game Table Section */}
          <div className="flex-1 flex flex-col min-h-0 md:h-full">
            <PremiumGameTable
              gameState={gameState}
              onHit={() => hit(gameState.playerScore, gameState.dealerScore, gameState.currentBet)}
              onStand={() => stand(gameState.playerScore, gameState.currentBet)}
              onDouble={doubleDown}
              onSplit={split}
              onNewGame={newGame}
              chipStacks={chipStacks}
              winStreak={winStreak}
              serverSeed={serverSeed}
              serverSeedHash={serverSeedHash}
              clientSeed={clientSeed}
              showFairness={showFairness}
              setShowFairness={setShowFairness}
            />
            <FairnessDialog showFairness={showFairness} setShowFairness={setShowFairness} serverSeedHash={serverSeedHash} serverSeed={serverSeed} clientSeed={clientSeed} />
            <PremiumBettingPanel
              gameState={gameState}
              onPlaceBet={placeBet}
              onChipStackUpdate={setChipStacks}
              lastBetAmount={lastBetAmount}
              solBalance={solBalance}
            />
          </div>
          <div className={`md:!block !hidden border-l border-gray-700 bg-gray-900/20 transition-all duration-300 ${isBetHistoryCollapsed ? 'md:w-[60px] lg:w-[60px]' : 'md:w-[550px] lg:w-[550px]'}`}>
            {/* Collapsible Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              {!isBetHistoryCollapsed && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <h3 className="text-sm font-semibold text-white">Bet History</h3>
                  <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                    {gameHistory.length}
                  </span>
                </div>
              )}
              <div className={`flex items-center space-x-2 ${isBetHistoryCollapsed ? 'w-full justify-center' : ''}`}>
                <button
                  type="button"
                  onClick={() => setIsBetHistoryCollapsed(!isBetHistoryCollapsed)}
                  className="text-gray-400 hover:text-white transition-colors text-base font-semibold min-w-[28px] min-h-[28px] flex items-center justify-center rounded hover:bg-gray-800/50"
                  aria-label={isBetHistoryCollapsed ? "Expand" : "Collapse"}
                  title={isBetHistoryCollapsed ? "Expand" : "Collapse"}
                >
                  <span className="text-xl leading-none">{isBetHistoryCollapsed ? "←" : "→"}</span>
                </button>
              </div>
            </div>
            
            {/* Collapsible Content */}
            {!isBetHistoryCollapsed && (
              <div className="h-[calc(100%-110px)] overflow-y-auto p-4">
                <BetHistoryTable
                  gameHistory={gameHistory}
                  isLoading={isLoadingHistory}
                  newEntriesCount={newEntriesCount}
                  onNewEntriesAcknowledged={() => setNewEntriesCount(0)}
                />
              </div>
            )}
          </div>
        </div>
        <Dialog open={showSwapModal} onOpenChange={setShowSwapModal}>
          <DialogContent
            id="jupiter-terminal"
          >
            <button
              onClick={() => setShowSwapModal(false)}
              className="!mt-[-4px] w-10 h-10 text-2xl text-amber-400 hover:text-white transition-colors z-50 absolute top-0 right-0"
              aria-label="Close"
              type="button"
            >
              ×
            </button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="md:hidden border-t border-gray-700 bg-gray-900/20 pb-20">
        <div className="p-3">
          <BetHistoryTable
            gameHistory={gameHistory}
            isLoading={isLoadingHistory}
            newEntriesCount={newEntriesCount}
            onNewEntriesAcknowledged={() => setNewEntriesCount(0)}
          />
        </div>
      </div>
    </>
  )
}
