import { useState } from 'react'
import { motion } from 'framer-motion'
import { Rocket, Key, Cpu, Zap } from 'lucide-react'
import QuestionCard from '../QuestionCard'
import useProjectStore from '@/store/useProjectStore'
import { staggerContainer, staggerItem } from '@/lib/animationVariants'

function SummaryRow({ label, value }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null
  return (
    <div style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: '2px' }}>
          {label}
        </div>
        <div style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
          {Array.isArray(value) ? value.join(', ') : value}
        </div>
      </div>
    </div>
  )
}

export default function StepReview({ onSubmit, onBack }) {
  const { projectMeta, pillars, apiKey, setApiKey, outputMode, setOutputMode } = useProjectStore()
  const [showKey, setShowKey] = useState(false)

  const isAI = outputMode === 'ai'

  return (
    <QuestionCard style={{ maxWidth: '680px' }}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
      >
        <motion.div variants={staggerItem} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px', height: '36px', borderRadius: '9px',
              background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Rocket size={18} color="white" />
          </div>
          <span className="badge badge-brand">Review & Generate</span>
        </motion.div>

        <motion.div variants={staggerItem}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '6px' }}>
            Ready to launch
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
            Review your selections, choose your generation mode, then generate your 5 context files.
          </p>
        </motion.div>

        {/* Summary */}
        <motion.div variants={staggerItem} className="glass-sm" style={{ padding: '4px 16px 8px' }}>
          <SummaryRow label="PROJECT" value={projectMeta.name} />
          <SummaryRow label="PITCH" value={projectMeta.pitch} />
          <SummaryRow label="STACK" value={pillars.architecture.stack} />
          <SummaryRow label="RENDERING" value={pillars.architecture.rendering} />
          <SummaryRow label="DATABASE" value={pillars.architecture.database} />
          <SummaryRow label="DEPLOYMENT" value={pillars.architecture.deployment} />
          <SummaryRow label="DESIGN VIBE" value={pillars.design.vibe} />
          <SummaryRow label="LANGUAGE" value={pillars.rules.language} />
          <SummaryRow label="TESTING" value={pillars.rules.testing} />
          <SummaryRow label="ANTI-PATTERNS" value={pillars.rules.antiPatterns} />
        </motion.div>

        {/* Generation Mode Toggle */}
        <motion.div variants={staggerItem}>
          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <div style={{ fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '12px', fontSize: '0.875rem' }}>
              Generation Mode
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {/* System Mode */}
              <motion.button
                onClick={() => setOutputMode('system')}
                whileTap={{ scale: 0.97 }}
                type="button"
                style={{
                  flex: 1, padding: '12px', borderRadius: '10px',
                  border: `1px solid ${!isAI ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.07)'}`,
                  background: !isAI ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 150ms ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Zap size={15} color={!isAI ? '#a5b8fc' : 'rgba(255,255,255,0.4)'} />
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: !isAI ? '#a5b8fc' : 'rgba(255,255,255,0.7)' }}>
                    System
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
                  Template-based. Instant. No API key needed.
                </div>
              </motion.button>

              {/* AI Mode */}
              <motion.button
                onClick={() => setOutputMode('ai')}
                whileTap={{ scale: 0.97 }}
                type="button"
                style={{
                  flex: 1, padding: '12px', borderRadius: '10px',
                  border: `1px solid ${isAI ? 'rgba(139,92,246,0.6)' : 'rgba(255,255,255,0.07)'}`,
                  background: isAI ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 150ms ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Cpu size={15} color={isAI ? '#c4b5fd' : 'rgba(255,255,255,0.4)'} />
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: isAI ? '#c4b5fd' : 'rgba(255,255,255,0.7)' }}>
                    AI (Gemini)
                  </span>
                  <span className="badge badge-ai" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>✨ Pro</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
                  Context-aware docs generated by Gemini 2.0.
                </div>
              </motion.button>
            </div>

            {/* API Key Input */}
            {isAI && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.25 }}
                style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}
              >
                <label
                  htmlFor="api-key"
                  style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Key size={12} />
                  GEMINI API KEY
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="api-key"
                    className="input-glass"
                    type={showKey ? 'text' : 'password'}
                    placeholder="AIza..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    style={{ paddingRight: '70px', fontSize: '0.875rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey((v) => !v)}
                    style={{
                      position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 500,
                    }}
                  >
                    {showKey ? 'Hide' : 'Show'}
                  </button>
                </div>
                <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)' }}>
                  Your key is used only in-browser and never stored.{' '}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#a5b8fc' }}
                  >
                    Get a free key →
                  </a>
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div variants={staggerItem} style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-ghost" onClick={onBack} style={{ flex: 1 }}>← Back</button>
          <motion.button
            className="btn-primary"
            onClick={onSubmit}
            style={{ flex: 2 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>🚀 Generate Documentation</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </QuestionCard>
  )
}
