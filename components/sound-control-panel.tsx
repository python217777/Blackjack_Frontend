"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Music, Music2, Music3, Settings } from "lucide-react"

interface SoundControlPanelProps {
  musicEnabled: boolean
  soundEffectsEnabled: boolean
  currentTrack: number
  onToggleMusic: () => void
  onToggleSoundEffects: () => void
  onChangeTrack: (track: number) => void
}

export function SoundControlPanel({
  musicEnabled,
  soundEffectsEnabled,
  currentTrack,
  onToggleMusic,
  onToggleSoundEffects,
  onChangeTrack,
}: SoundControlPanelProps) {
  const [showPanel, setShowPanel] = useState(false)

  const tracks = [
    { name: "Casino Lounge", icon: Music, color: "text-blue-400" }
    // { name: "High Stakes", icon: Music2, color: "text-red-400" },
    // { name: "Vegas Nights", icon: Music3, color: "text-purple-400" },
  ]

  return (
    <div className="relative">
      {/* Sound Control Button */}
      <Button
        onClick={() => setShowPanel(!showPanel)}
        variant="ghost"
        size="sm"
        className="text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg border border-gray-700/50 hover:border-amber-500/50"
      >
        <Settings className="w-5 h-5" />
      </Button>

      {/* Sound Control Panel */}
      {showPanel && (
        <div className="absolute top-full left-1/2 -translate-x-[60%] sm:left-auto sm:right-2 sm:translate-x-0 mt-2 bg-gray-900 border border-gray-700/50 rounded-lg shadow-xl z-50 min-w-[280px] p-4">
          <div className="space-y-4">
            {/* Header */}
            <div className="text-center">
              <h3 className="text-lg font-bold text-white mb-1">Audio Settings</h3>
              <p className="text-xs text-gray-400">Customize your gaming experience</p>
            </div>

            {/* Music Controls */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-amber-400" />
                  <span className="text-white font-medium">Background Music</span>
                </div>
                <Button
                  onClick={onToggleMusic}
                  size="sm"
                  className={`${
                    musicEnabled
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-gray-600 hover:bg-gray-700 text-gray-300"
                  } px-3 py-1`}
                >
                  {musicEnabled ? "ON" : "OFF"}
                </Button>
              </div>

              {/* Track Selection */}
              {musicEnabled && (
                <div className="space-y-2">
                  <div className="text-sm text-gray-400 font-medium">Select Track:</div>
                  <div className="grid grid-cols-1 gap-2">
                    {tracks.map((track, index) => {
                      const IconComponent = track.icon
                      return (
                        <button
                          key={index}
                          onClick={() => onChangeTrack(index)}
                          className={`
                            flex items-center gap-3 p-2 rounded-lg transition-all
                            ${
                              currentTrack === index
                                ? "bg-amber-500/20 border border-amber-500/50 text-amber-400"
                                : "bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white"
                            }
                          `}
                        >
                          <IconComponent className={`w-4 h-4 ${track.color}`} />
                          <span className="text-sm font-medium">{track.name}</span>
                          {currentTrack === index && (
                            <div className="ml-auto">
                              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sound Effects Controls */}
            <div className="border-t border-gray-700/50 pt-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {soundEffectsEnabled ? (
                    <Volume2 className="w-4 h-4 text-amber-400" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-gray-500" />
                  )}
                  <span className="text-white font-medium">Sound Effects</span>
                </div>
                <Button
                  onClick={onToggleSoundEffects}
                  size="sm"
                  className={`${
                    soundEffectsEnabled
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-gray-600 hover:bg-gray-700 text-gray-300"
                  } px-3 py-1`}
                >
                  {soundEffectsEnabled ? "ON" : "OFF"}
                </Button>
              </div>
              <div className="text-xs text-gray-400 mt-1">Chip clicks, card deals, win sounds</div>
            </div>

            {/* Close Button */}
            <div className="border-t border-gray-700/50 pt-3">
              <Button
                onClick={() => setShowPanel(false)}
                variant="outline"
                size="sm"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
