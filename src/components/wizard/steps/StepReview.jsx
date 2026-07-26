import { useState } from 'react'
import { motion } from 'framer-motion'
import { Rocket, Key, Cpu, Zap, Sparkles } from 'lucide-react'
import QuestionCard from '../QuestionCard'
import useProjectStore from '@/store/useProjectStore'
import { staggerContainer, staggerItem } from '@/lib/animationVariants'

function SummaryRow({ label, value }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.85rem' }}>
      <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{label}</span>
      <span style={{ color: 'white', fontWeight: 600 }}>{Array.isArray(value) ? value.join(', ') : value}</span>
    </div>
  )
}

export default function StepReview({ onSubmit, onBack }) {
  const { meta, pillars, engineMode, apiKey, setEngineMode, setApiKey } = useProjectStore()
  const [showKey, setShowKey] = useState(false)
  const isAI = engineMode === 'ai'

  return (
    <QuestionCard style={{ maxWidth: '640px' }}>
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
              background: 'linear-gradient(135deg, #6366f1, #ec4899)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Rocket size={18} color="white" />
          </div>
          <span className="badge badge-brand">Final Step</span>
        </motion.div>

        <motion.div variants={staggerItem}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '6px' }}>
            Review & Generate Context
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
            Confirm your choices below and choose your generation engine.
          </p>
        </motion.div>

        {/* Summary Card */}
        <motion.div variants={staggerItem} className="surface-muted" style={{ padding: '16px', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
            Project Specification
          </h3>
          <SummaryRow label="Project Name" value={meta.name} />
          <SummaryRow label="Platform" value={meta.platform} />
          <SummaryRow label="Scale" value={meta.scale} />
          <SummaryRow label="Architecture" value={pillars.architecture.stack} />
          <SummaryRow label="Rendering" value={pillars.architecture.rendering} />
          <SummaryRow label="Pattern" value={pillars.architecture.designPattern} />
          <SummaryRow label="Design Vibe" value={pillars.design.vibe} />
          <SummaryRow label="Database" value={pillars.architecture.database} />
          <SummaryRow label="Tables Defined" value={pillars.schema.entities.length > 0 ? `${pillars.schema.entities.length} tables` : null} />
          <SummaryRow label="Authentication" value={pillars.architecture.authStrategy} />
        </motion.div>

        {/* Engine Toggle */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>
            GENERATION ENGINE
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <motion.button
              type="button"
              onClick={() => setEngineMode('static')}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: '12px 14px', borderRadius: '10px',
                border: `1px solid ${!isAI ? 'rgba(21,128,61,0.5)' : 'rgba(255,255,255,0.07)'}`,
                background: !isAI ? 'rgba(21,128,61,0.12)' : 'rgba(255,255,255,0.02)',
                cursor: 'pointer', textAlign: 'left', transition: 'all 150ms ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Zap size={15} color={!isAI ? '#4ade80' : 'rgba(255,255,255,0.4)'} />
                <span style={{ fontWeight: 600, fontSize: '0.875rem', color: !isAI ? '#4ade80' : 'rgba(255,255,255,0.7)' }}>
                  Static Engine
                </span>
                <span style={{ fontSize: '0.7rem', color: '#22c55e', background: 'rgba(34,197,94,0.1)', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>Free</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
                Instant client-side Markdown synthesis. Zero API key needed.
              </div>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => setEngineMode('ai')}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: '12px 14px', borderRadius: '10px',
                border: `1px solid ${isAI ? 'rgba(167,139,250,0.5)' : 'rgba(255,255,255,0.07)'}`,
                background: isAI ? 'rgba(167,139,250,0.1)' : 'rgba(255,255,255,0.02)',
                cursor: 'pointer', textAlign: 'left', transition: 'all 150ms ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Cpu size={15} color={isAI ? '#c4b5fd' : 'rgba(255,255,255,0.4)'} />
                <span style={{ fontWeight: 600, fontSize: '0.875rem', color: isAI ? '#c4b5fd' : 'rgba(255,255,255,0.7)' }}>
                  AI (Gemini)
                </span>
                <span className="badge badge-ai" style={{ fontSize: '0.65rem', padding: '1px 6px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <Sparkles size={11} /> Pro
                </span>
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
        </motion.div>

        {/* CTA */}
        <motion.div variants={staggerItem} style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-ghost" onClick={onBack} style={{ flex: 1 }}>← Back</button>
          <motion.button
            className="btn-primary"
            onClick={onSubmit}
            style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            whileTap={{ scale: 0.97 }}
          >
            <Rocket size={18} />
            <span>Generate Documentation</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </QuestionCard>
  )
}
