import { motion } from 'framer-motion'
import { DOC_META } from '@/lib/downloadUtils'
import InteractiveButton from '@/components/ui/InteractiveButton'

export default function DocumentNav({ activeDoc, onSelect }) {
  const docs = Object.entries(DOC_META)

  return (
    <nav aria-label="Document navigation" style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
      {docs.map(([key, meta]) => {
        const isActive = activeDoc === key
        return (
          <InteractiveButton
            key={key}
            onClick={() => onSelect(key)}
            aria-current={isActive ? 'page' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              padding: '7px 8px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 120ms ease',
              width: '100%',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '0.8rem',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                letterSpacing: '-0.01em',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {meta.label}
              </div>
              <div className="font-mono" style={{
                fontSize: '0.65rem',
                color: 'var(--color-text-muted)',
                marginTop: '1px',
              }}>
                {meta.filename}
              </div>
            </div>
            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                style={{
                  width: '3px',
                  height: '16px',
                  borderRadius: '2px',
                  background: 'var(--color-accent)',
                  flexShrink: 0,
                }}
              />
            )}
          </InteractiveButton>
        )
      })}
    </nav>
  )
}
