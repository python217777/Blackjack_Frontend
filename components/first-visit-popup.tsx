"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog1"
import { Button } from "@/components/ui/button1"
import { Checkbox } from "@/components/ui/checkbox1"

export function FirstVisitPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [hideFor30Days, setHideFor30Days] = useState(false)

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem("bj-finance-visited")
    const hideUntil = localStorage.getItem("bj-finance-hide-until")

    if (!hasVisited) {
      // First time visitor
      setIsOpen(true)
    } else if (hideUntil) {
      // Check if hide period has expired
      const hideUntilDate = new Date(hideUntil)
      if (new Date() > hideUntilDate) {
        setIsOpen(true)
      }
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("bj-finance-visited", "true")

    if (hideFor30Days) {
      const hideUntilDate = new Date()
      hideUntilDate.setDate(hideUntilDate.getDate() + 30)
      localStorage.setItem("bj-finance-hide-until", hideUntilDate.toISOString())
    } else {
      localStorage.removeItem("bj-finance-hide-until")
    }

    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="bg-[#0a5c38] border-2 border-[#d4af37] max-w-lg z-[200]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#d4af37] text-center">Terms and Condition</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-gray-200 text-sm leading-relaxed">
          <div>
            bj.finance and its associated services are inaccessible and not meant for individuals or entities situated
            in or incorporated within (i) the USA, (ii) the United Kingdom, (iii) any country under sanctions, including
            those enforced by OFAC and the United Nations Security Council, or (iv) any person in a restricted country.
          </div>

          <div>
            By accessing this site, you acknowledge and accept all risks associated with using this experimental
            protocol. You affirm that you are legally permitted to use this service in your jurisdiction and that you
            have read and understood all terms, conditions, and disclaimers.
          </div>

          <div className="flex items-start gap-3 pt-2">
            <Checkbox
              id="hide-30-days"
              checked={hideFor30Days}
              onCheckedChange={(checked) => setHideFor30Days(checked as boolean)}
              className="mt-1 border-[#d4af37] data-[state=checked]:bg-[#d4af37] data-[state=checked]:text-[#0a5c38]"
            />
            <label htmlFor="hide-30-days" className="text-sm text-gray-300 cursor-pointer leading-relaxed">
              Click here to hide this message for 30 days
            </label>
          </div>
        </div>

        <Button
          onClick={handleAccept}
          className="w-full bg-[#d4af37] hover:bg-[#c4a037] text-[#0a5c38] font-bold text-lg py-6 mt-4"
        >
          Accept
        </Button>
      </DialogContent>
    </Dialog>
  )
}
