import { motion, AnimatePresence } from 'framer-motion'
import { checkmarkVariants, springTransition } from '@/lib/animationVariants'

/**
 * Multi-select chip grid for selecting options like tech stacks, vibes, etc.
 * Supports rendering custom SVG/React-based icons (no emojis!).
 * @param {string[]} options - Available options
 * @param {string[]} selected - Currently selected values
 * @param {Function} onToggle - Callback(value) when chip is toggled
 * @param {boolean} multiSelect - Allow multiple selections (default: true)
 * @param {Object} icons - Optional map of { value: ReactNode } for custom icons
 */
export default function ChipSelector({
  options = [],
  selected = [],
  onToggle,
  multiSelect = true,
  icons = {},
  disabledOptions = [],
}) {
  const handleClick = (value) => {
    if (disabledOptions.includes(value)) return
    if (!multiSelect && selected.includes(value)) return
    onToggle(value)
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }} role="group">
      {options.map((option) => {
        const isActive = selected.includes(option)
        const isDisabled = disabledOptions.includes(option)
        return (
          <motion.button
            key={option}
            className={`chip transform-gpu ${isActive ? 'chip-active' : ''}`}
            onClick={() => handleClick(option)}
            whileHover={isDisabled ? {} : { scale: 1.03, boxShadow: isActive ? '0 0 16px rgba(21,128,61,0.35)' : '0 0 10px rgba(255,255,255,0.06)' }}
            whileTap={isDisabled ? {} : { scale: 0.94 }}
            transition={springTransition}
            aria-pressed={isActive}
            disabled={isDisabled}
            type="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              opacity: isDisabled ? 0.35 : 1,
              cursor: isDisabled ? 'not-allowed' : 'pointer',
            }}
          >
            {icons[option] && (
              <span aria-hidden="true" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                {icons[option]}
              </span>
            )}
            <span>{option}</span>
            <AnimatePresence>
              {isActive && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.15 }}
                  aria-hidden="true"
                  style={{ display: 'flex', alignItems: 'center', marginLeft: '2px' }}
                >
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <motion.path
                      d="M1 4L3.5 6.5L9 1"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      variants={checkmarkVariants}
                      initial="hidden"
                      animate="visible"
                    />
                  </svg>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )
      })}
    </div>
  )
}
