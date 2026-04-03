"use client"

import { useGame } from "@/components/game-context"
import { StickyFooter } from "@/components/sticky-footer"
import { useEffect, useState } from "react"

export function ConditionalFooter() {
  const { isGameActive } = useGame()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Don't render anything until mounted to avoid hydration issues
  if (!mounted) {
    return null
  }
  
  // Don't render footer when game is active
  if (isGameActive) {
    return null
  }
  
  return <StickyFooter />
}
