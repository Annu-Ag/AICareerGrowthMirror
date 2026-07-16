import { useState, useEffect } from 'react'

const THOUGHTS = [
  'Analyzing your patterns…',
  'Connecting the dots…',
  'Reading your signals…',
  'Reflecting on your journey…',
  'Identifying blind spots…',
  'Mapping your growth…',
  'Synthesizing insights…',
  'Looking beneath the surface…',
]

export default function AIAvatar({ size = 'md', isThinking = false, thought: customThought, pulseColor = 'accent' }) {
  const [showDot, setShowDot] = useState(false)
  const [thought, setThought] = useState(THOUGHTS[0])

  useEffect(() => {
    if (!isThinking) return
    const interval = setInterval(() => {
      setThought(THOUGHTS[Math.floor(Math.random() * THOUGHTS.length)])
    }, 2500)
    return () => clearInterval(interval)
  }, [isThinking])

  const sizes = {
    sm: 'size-8',
    md: 'size-14',
    lg: 'size-24',
    xl: 'size-32',
  }

  const ringSizes = {
    sm: 'size-10',
    md: 'size-18',
    lg: 'size-28',
    xl: 'size-36',
  }

  const colorMap = {
    accent: '--color-accent',
    brand: '--color-brand',
    success: '--color-success',
    info: '--color-info',
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center ${isThinking ? 'ai-orb' : ''}`}
      onMouseEnter={() => setShowDot(true)}
      onMouseLeave={() => setShowDot(false)}
    >
      {/* Ring */}
      <svg
        className={`ai-orb-ring absolute ${ringSizes[size]}`}
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <circle
          cx="50" cy="50" r="45"
          fill="none"
          stroke={`var(${colorMap[pulseColor] || colorMap.accent})`}
          strokeWidth="1"
          opacity="0.15"
          strokeDasharray="8 6"
        />
      </svg>

      {/* Glow */}
      <div
        className={`absolute ${ringSizes[size]} rounded-full ai-orb-pulse`}
        style={{
          background: `var(${colorMap[pulseColor] || colorMap.accent})`,
          opacity: 0.08,
        }}
      />

      {/* Core orb */}
      <div
        className={`relative ${sizes[size]} rounded-full flex items-center justify-center transition-all duration-300 ${
          isThinking ? 'shadow-glow' : ''
        }`}
        style={{
          background: isThinking
            ? `linear-gradient(135deg, var(${colorMap[pulseColor] || colorMap.accent}), #6366f1, var(${colorMap[pulseColor] || colorMap.accent}))`
            : `linear-gradient(135deg, var(${colorMap[pulseColor] || colorMap.accent}), #818cf8)`,
          boxShadow: showDot || isThinking
            ? `0 0 30px var(${colorMap[pulseColor] || colorMap.accent})40`
            : 'none',
        }}
      >
        {isThinking ? (
          <div className="ai-typing flex gap-[3px]">
            <span className="size-[5px] rounded-full bg-white" />
            <span className="size-[5px] rounded-full bg-white" />
            <span className="size-[5px] rounded-full bg-white" />
          </div>
        ) : (
          <span className="text-white select-none" style={{ fontSize: size === 'sm' ? '10px' : '16px' }}>
            ✦
          </span>
        )}
      </div>

      {/* Thought bubble */}
      {isThinking && (
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <div className="thought-appear rounded-[8px] bg-fg px-3 py-1.5 text-xs font-medium text-white shadow-lg">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 size-2 rotate-45 bg-fg" />
            {customThought || thought}
          </div>
        </div>
      )}

      {/* Hover tooltip */}
      {showDot && !isThinking && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <div className="thought-appear rounded-[6px] bg-fg px-2 py-1 text-[10px] font-medium text-white shadow-lg">
            AI Mirror
          </div>
        </div>
      )}
    </div>
  )
}
