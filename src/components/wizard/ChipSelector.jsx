import { motion } from 'framer-motion'

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
            className={`chip ${isActive ? 'chip-active' : ''}`}
            onClick={() => handleClick(option)}
            whileTap={isDisabled ? {} : { scale: 0.96 }}
            transition={{ duration: 0.1 }}
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
            {isActive && <span aria-hidden="true" style={{ fontSize: '0.7rem', opacity: 0.7, marginLeft: '2px' }}>✓</span>}
          </motion.button>
        )
      })}
    </div>
  )
}
