import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import useProjectStore from '@/store/useProjectStore'
import { regenerateSingle } from '@/lib/synthesize'
import { DOC_META } from '@/lib/downloadUtils'

export default function AIToggle({ activeDoc }) {
  const { outputMode, setOutputMode, apiKey, setApiKey, projectMeta, pillars, setOutput } = useProjectStore()
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [showKeyInput, setShowKeyInput] = useState(false)
  const meta = DOC_META[activeDoc]

  const handleRegenerate = async (mode) => {
    setIsRegenerating(true)
    try {
      const answers = { meta: projectMeta, pillars }
      const newContent = await regenerateSingle(activeDoc, answers, mode, apiKey)
      setOutput(activeDoc, newContent)
    } catch (err) {
      console.error('Regeneration failed:', err)
    } finally {
      setIsRegenerating(false)
    }
  }

  const handleModeSwitch = (mode) => {
    setOutputMode(mode)
    if (mode === 'ai' && !apiKey) {
      setShowKeyInput(true)
    } else {
      handleRegenerate(mode)
    }
  }

  return (
    <div style={{ padding: '14px 16px' }}>
      {/* File label */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', letterSpacing: '0.06em', fontWeight: 500, textTransform: 'uppercase' }}>
          Generation
        </span>
        <button
          className="btn-ghost"
          onClick={() => handleRegenerate(outputMode)}
          disabled={isRegenerating}
          style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
          aria-label="Regenerate"
        >
          <motion.span
            animate={isRegenerating ? { rotate: 360 } : { rotate: 0 }}
            transition={isRegenerating ? { duration: 0.8, repeat: Infinity, ease: 'linear' } : {}}
            style={{ display: 'flex' }}
          >
            <RefreshCw size={12} />
          </motion.span>
          {isRegenerating ? 'Generating…' : 'Regenerate'}
        </button>
      </div>

      {/* Mode toggle */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4px',
        background: 'var(--color-bg-muted)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: '3px',
      }}>
        {['system', 'ai'].map((mode) => (
          <button
            key={mode}
            onClick={() => handleModeSwitch(mode)}
            style={{
              padding: '7px',
              borderRadius: '7px',
              border: 'none',
              background: outputMode === mode ? 'var(--color-bg-elevated)' : 'transparent',
              color: outputMode === mode ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
              fontSize: '0.8rem',
              fontWeight: outputMode === mode ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 120ms ease',
              fontFamily: 'var(--font-sans)',
              letterSpacing: '-0.01em',
            }}
          >
            {mode === 'system' ? 'System' : 'AI (Gemini)'}
          </button>
        ))}
      </div>

      {/* API key input */}
      <AnimatePresence>
        {showKeyInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px', overflow: 'hidden' }}
          >
            <input
              className="input-glass"
              type="password"
              placeholder="Gemini API key (AIza…)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{ fontSize: '0.8rem', padding: '8px 12px' }}
            />
            <button
              className="btn-primary"
              onClick={() => { setShowKeyInput(false); handleRegenerate('ai') }}
              disabled={!apiKey}
              style={{ fontSize: '0.8rem', padding: '8px', width: '100%', opacity: apiKey ? 1 : 0.4 }}
            >
              Apply & regenerate
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
