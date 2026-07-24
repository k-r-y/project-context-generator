import { motion } from 'framer-motion'
import { Palette } from 'lucide-react'
import QuestionCard from '../QuestionCard'
import useProjectStore from '@/store/useProjectStore'
import { staggerContainer, staggerItem } from '@/lib/animationVariants'

const VIBES = [
  { value: 'Dark Premium', desc: 'Glassmorphism, deep surfaces, aurora gradients' },
  { value: 'Minimalist', desc: 'Clean whitespace, restrained palette, typography-led' },
  { value: 'Bold & Vibrant', desc: 'Strong colors, heavy type, high contrast' },
  { value: 'Corporate', desc: 'Professional, trustworthy, accessibility-first' },
  { value: 'Playful', desc: 'Rounded corners, bright colors, fun micro-interactions' },
  { value: 'Brutalist', desc: 'Raw, intentionally stark, monochrome with stark borders' },
]

const FONTS = ['Inter', 'Plus Jakarta Sans', 'Geist', 'DM Sans', 'Outfit', 'Satoshi']

const PRESET_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#ef4444',
  '#22c55e', '#0ea5e9', '#f97316', '#a855f7', '#06b6d4', '#84cc16',
]

export default function StepDesignVibe({ onNext, onBack }) {
  const { pillars, setDesign } = useProjectStore()
  const { vibe, primaryColor, typography } = pillars.design
  const canProceed = !!vibe

  return (
    <QuestionCard>
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
              background: 'linear-gradient(135deg, #ec4899, #f97316)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Palette size={18} color="white" />
          </div>
          <span className="badge badge-brand">Design</span>
        </motion.div>

        <motion.div variants={staggerItem}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '6px' }}>
            What's the vibe?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
            This defines your Design System document — color system, typography, and aesthetic principles.
          </p>
        </motion.div>

        {/* Vibe Grid */}
        <motion.div variants={staggerItem}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {VIBES.map((v) => {
              const isActive = vibe === v.value
              return (
                <motion.button
                  key={v.value}
                  onClick={() => setDesign({ vibe: v.value })}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  aria-pressed={isActive}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: `1px solid ${isActive ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.07)'}`,
                    background: isActive ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 150ms ease',
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: isActive ? '#a5b8fc' : 'rgba(255,255,255,0.85)', marginBottom: '2px' }}>
                    {v.value}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginTop: '2px', lineHeight: 1.4 }}>
                    {v.desc}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Primary Color */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em' }}>
            PRIMARY BRAND COLOR
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            {PRESET_COLORS.map((color) => (
              <motion.button
                key={color}
                onClick={() => setDesign({ primaryColor: color })}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                aria-label={`Select color ${color}`}
                style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: color,
                  border: primaryColor === color ? '2px solid white' : '2px solid transparent',
                  cursor: 'pointer',
                  boxShadow: primaryColor === color ? `0 0 0 2px ${color}80, 0 0 12px ${color}50` : 'none',
                  transition: 'all 150ms ease',
                }}
              />
            ))}
            <input
              type="color"
              value={primaryColor || '#6366f1'}
              onChange={(e) => setDesign({ primaryColor: e.target.value })}
              style={{
                width: '28px', height: '28px', borderRadius: '50%',
                border: 'none', cursor: 'pointer', padding: 0,
                background: 'transparent',
              }}
              aria-label="Custom color picker"
              title="Choose custom color"
            />
          </div>
        </motion.div>

        {/* Typography */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em' }}>
            TYPOGRAPHY
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {FONTS.map((font) => (
              <motion.button
                key={font}
                onClick={() => setDesign({ typography: font })}
                className={`chip ${typography === font ? 'chip-active' : ''}`}
                whileTap={{ scale: 0.95 }}
                type="button"
                aria-pressed={typography === font}
                style={{ fontFamily: font }}
              >
                {font}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div variants={staggerItem} style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-ghost" onClick={onBack} style={{ flex: 1 }}>← Back</button>
          <motion.button
            className="btn-primary"
            onClick={onNext}
            disabled={!canProceed}
            style={{ flex: 2, opacity: canProceed ? 1 : 0.4, cursor: canProceed ? 'pointer' : 'not-allowed' }}
            whileTap={canProceed ? { scale: 0.97 } : {}}
          >
            <span>Continue →</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </QuestionCard>
  )
}
