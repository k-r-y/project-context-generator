import { motion } from 'framer-motion'

/** Thin single-line progress bar — runs full width under the header */
export default function ProgressBar({ current, total }) {
  const pct = ((current + 1) / total) * 100

  return (
    <div
      role="progressbar"
      aria-valuenow={current + 1}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Step ${current + 1} of ${total}`}
      style={{ height: '2px', background: 'var(--color-border)', width: '100%' }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          height: '100%',
          background: 'linear-gradient(90deg, var(--color-accent) 0%, #818cf8 100%)',
          boxShadow: '0 0 10px rgba(99,102,241,0.6)',
          position: 'relative',
        }}
      />
    </div>
  )
}
