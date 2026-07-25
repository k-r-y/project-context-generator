import { motion, AnimatePresence } from 'framer-motion'
import useProjectStore from '@/store/useProjectStore'
import { checkmarkVariants, springTransition } from '@/lib/animationVariants'

export default function MetricsChecklist() {
  const { generatedOutputs, toggleMetricDone } = useProjectStore()
  const metrics = generatedOutputs.metrics || []
  const doneCount = metrics.filter((m) => m.done).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span className="label-xs">Setup checklist</span>
        <span style={{
          fontSize: '0.72rem',
          color: 'var(--color-text-muted)',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {doneCount}/{metrics.length}
        </span>
      </div>

      {/* Progress line */}
      {metrics.length > 0 && (
        <div style={{ height: '2px', background: 'var(--color-border)', flexShrink: 0 }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(doneCount / metrics.length) * 100}%` }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              height: '100%',
              background: 'var(--color-success)',
              boxShadow: '0 0 8px rgba(34,197,94,0.4)',
            }}
          />
        </div>
      )}

      {/* Items */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
        {metrics.length === 0 ? (
          <p style={{ padding: '20px 8px', fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
            Setup tasks will appear here after generation.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {metrics.map((metric) => (
              <motion.button
                key={metric.id}
                onClick={() => toggleMetricDone(metric.id)}
                whileTap={{ scale: 0.97 }}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                transition={springTransition}
                aria-pressed={metric.done}
                className="transform-gpu"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '9px',
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                {/* Checkbox */}
                <motion.div
                  animate={{
                    scale: metric.done ? [1, 1.2, 1] : 1,
                    backgroundColor: metric.done ? 'var(--color-success)' : 'transparent',
                    borderColor: metric.done ? 'var(--color-success)' : 'var(--color-border-hover)',
                  }}
                  transition={{ duration: 0.2 }}
                  style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '3px',
                    border: '1px solid var(--color-border-hover)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  <AnimatePresence>
                    {metric.done && (
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <motion.path
                          d="M1 3L3.5 5.5L8 1"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          variants={checkmarkVariants}
                          initial="hidden"
                          animate="visible"
                        />
                      </svg>
                    )}
                  </AnimatePresence>
                </motion.div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono)',
                    color: metric.done ? 'var(--color-text-muted)' : 'var(--color-text-secondary)',
                    textDecoration: metric.done ? 'line-through' : 'none',
                    lineHeight: 1.5,
                    letterSpacing: '-0.01em',
                    transition: 'color 150ms ease',
                  }}>
                    {metric.text}
                  </div>
                  {metric.description && (
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '2px', lineHeight: 1.4 }}>
                      {metric.description}
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
