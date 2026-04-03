"use client"

interface CasinoChipProps {
  value: number
  selected?: boolean
  onClick?: () => void
  disabled?: boolean
  currency?: string
}

export function CasinoChip({ value, selected = false, onClick, disabled = false, currency = "SOL" }: CasinoChipProps) {
  // Classic casino chip colors with SOL-specific styling
  const getChipStyle = () => {
    switch (value) {
      case 1:
        return {
          bg: "bg-white",
          text: "text-black",
          border: "border-gray-400",
          segments: "from-gray-200 via-white to-gray-200",
        }
      case 5:
        return {
          bg: "bg-red-600",
          text: "text-white",
          border: "border-red-800",
          segments: "from-red-700 via-red-600 to-red-700",
        }
      case 10:
        return {
          bg: "bg-blue-600",
          text: "text-white",
          border: "border-blue-800",
          segments: "from-blue-700 via-blue-600 to-blue-700",
        }
      case 25:
        return {
          bg: "bg-green-600",
          text: "text-white",
          border: "border-green-800",
          segments: "from-green-700 via-green-600 to-green-700",
        }
      default:
        return {
          bg: "bg-purple-600",
          text: "text-white",
          border: "border-purple-800",
          segments: "from-purple-700 via-purple-600 to-purple-700",
        }
    }
  }

  const chipStyle = getChipStyle()

  const formatValue = (val: number) => {
    return val.toString()
  }

  return (
    <button
      onClick={() => {
        if (typeof window !== "undefined" && (window as any).playChipSound) {
          ;(window as any).playChipSound(value) // Pass chip value for different sounds
        }
        onClick?.()
      }}
      disabled={disabled}
      className={`
        w-16 h-16 ${chipStyle.bg} ${chipStyle.text} ${chipStyle.border}
        rounded-full flex flex-col items-center justify-center
        border-4 shadow-lg font-bold
        transform transition-all duration-200
        ${selected ? "scale-110 ring-2 ring-amber-400" : "hover:scale-105"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${onClick ? "active:scale-95" : ""}
        relative overflow-hidden
      `}
    >
      {/* Chip segments */}
      <div className="absolute inset-0 rounded-full">
        <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${chipStyle.segments} opacity-70`}></div>

        {/* Black segments */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-full bg-black/20"
            style={{
              transform: `rotate(${i * 22.5}deg)`,
              transformOrigin: "center center",
            }}
          />
        ))}
      </div>

      {/* Chip value */}
      <div className="relative z-10">
        <div className="text-xl font-bold leading-none">${formatValue(value)}</div>
        <div className="text-xs font-medium opacity-90 leading-none mt-0.5">BJ</div>
      </div>

      {/* Edge spots */}
      <div className="absolute inset-0 rounded-full">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-2 bg-white/30 rounded-full"
            style={{
              transform: `rotate(${i * 45}deg) translateY(-30px)`,
              top: "50%",
              left: "calc(50% - 2px)",
              transformOrigin: "center bottom",
            }}
          />
        ))}
      </div>

      {/* 3D effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-black/20"></div>
    </button>
  )
}
