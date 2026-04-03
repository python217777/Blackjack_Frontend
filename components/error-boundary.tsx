"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Uncaught error:", error, errorInfo)
    // In production, you'd send this to your error tracking service
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        this.props.fallback || (
          <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="bg-gradient-to-r from-gray-900 to-black p-8 rounded-lg border border-amber-500/30 max-w-lg w-full text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-amber-400 mb-4">Something went wrong</h2>
              <p className="text-gray-300 mb-6">We apologize for the inconvenience. Please try refreshing the page.</p>
              <div className="flex justify-center">
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-amber-500 hover:bg-amber-600 text-black font-bold"
                >
                  Refresh Page
                </Button>
              </div>
              <p className="text-gray-500 text-sm mt-6">Error: {this.state.error?.message || "Unknown error"}</p>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
