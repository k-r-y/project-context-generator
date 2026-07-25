import { motion } from 'framer-motion'
import { Palette } from 'lucide-react'
import QuestionCard from '../QuestionCard'
import ChipSelector from '../ChipSelector'
import useProjectStore from '@/store/useProjectStore'
import { staggerContainer, staggerItem } from '@/lib/animationVariants'

const VIBES = [
  { value: 'Dark Premium', desc: 'Glassmorphism, deep surfaces, aurora gradients' },
  { value: 'Minimalist', desc: 'Clean whitespace, restrained palette, typography-led' },
  { value: 'Bold & Vibrant', desc: 'Strong colors, heavy type, high contrast' },
  { value: 'Corporate', desc: 'Professional, trustworthy, accessibility-first' },
  { value: 'Playful', desc: 'Rounded corners, bright colors, fun micro-interactions' },
  { value: 'Brutalist', desc: 'Raw, intentionally stark, monochrome with stark borders' },
  { value: 'Retro/Cyberpunk', desc: 'Neon glows, dark scanlines, tech terminal aesthetic' },
]

const FONTS = ['Inter', 'Plus Jakarta Sans', 'Geist', 'DM Sans', 'Outfit', 'Satoshi', 'Playfair Display', 'Fira Code']

const PRESET_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#ef4444',
  '#22c55e', '#0ea5e9', '#f97316', '#a855f7', '#06b6d4', '#84cc16',
]

const UI_LIBRARIES = ['Shadcn/ui', 'Tailwind CSS', 'Bootstrap', 'Material UI', 'Chakra UI', 'None']
const ICON_SETS = ['Lucide Icons', 'FontAwesome', 'Heroicons', 'Radix Icons', 'None']
const LAYOUT_CONCEPTS = ['Glassmorphism', 'Bento Grid', 'Flat Minimalist', 'Neumorphic']

export default function StepDesignVibe({ onNext, onBack }) {
  const { pillars, setDesign } = useProjectStore()
  const { vibe, primaryColor, secondaryColor, typography, secondaryTypography, uiLibraries, iconSet, layoutConcepts, spacing, roundedCorners } = pillars.design
  const canProceed = !!vibe

  return (
    <QuestionCard style={{ maxWidth: '600px' }}>
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
          <span className="badge badge-brand">Design & Aesthetic</span>
        </motion.div>

        <motion.div variants={staggerItem}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '6px' }}>
            What's the vibe?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
            Customize your style direction, libraries, layout concept, and iconography.
          </p>
        </motion.div>

        {/* Vibe Grid */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
            AESTHETIC STYLE
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {VIBES.map((v) => {
              const isActive = vibe === v.value
              return (
                <motion.button
                  key={v.value}
                  onClick={() => setDesign({ vibe: v.value })}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  aria-pressed={isActive}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: `1px solid ${isActive ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.07)'}`,
                    background: isActive ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 150ms ease',
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: isActive ? '#a5b8fc' : 'rgba(255,255,255,0.85)', marginBottom: '2px' }}>
                    {v.value}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.35 }}>
                    {v.desc}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Colors */}
        <motion.div variants={staggerItem} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
              PRIMARY BRAND COLOR
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              {PRESET_COLORS.map((color) => (
                <motion.button
                  key={color}
                  onClick={() => setDesign({ primaryColor: color })}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  aria-label={`Select color ${color}`}
                  style={{
                    width: '26px', height: '26px', borderRadius: '50%',
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
                  width: '26px', height: '26px', borderRadius: '50%',
                  border: 'none', cursor: 'pointer', padding: 0,
                  background: 'transparent',
                }}
                aria-label="Custom color picker"
                title="Choose custom color"
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
              SECONDARY / ACCENT COLOR
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              {PRESET_COLORS.map((color) => (
                <motion.button
                  key={`sec-${color}`}
                  onClick={() => setDesign({ secondaryColor: color })}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  aria-label={`Select secondary color ${color}`}
                  style={{
                    width: '26px', height: '26px', borderRadius: '50%',
                    background: color,
                    border: secondaryColor === color ? '2px solid white' : '2px solid transparent',
                    cursor: 'pointer',
                    boxShadow: secondaryColor === color ? `0 0 0 2px ${color}80, 0 0 12px ${color}50` : 'none',
                    transition: 'all 150ms ease',
                  }}
                />
              ))}
              <input
                type="color"
                value={secondaryColor || '#ec4899'}
                onChange={(e) => setDesign({ secondaryColor: e.target.value })}
                style={{
                  width: '26px', height: '26px', borderRadius: '50%',
                  border: 'none', cursor: 'pointer', padding: 0,
                  background: 'transparent',
                }}
                aria-label="Custom secondary color picker"
                title="Choose custom secondary color"
              />
            </div>
          </div>
        </motion.div>

        {/* Frontend / UI Library */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
            FRONTEND / UI LIBRARY (Select multiple)
          </label>
          <ChipSelector
            options={UI_LIBRARIES}
            selected={uiLibraries || []}
            onToggle={(val) => {
              const current = uiLibraries || []
              if (current.includes(val)) {
                setDesign({ uiLibraries: current.filter(x => x !== val) })
              } else {
                setDesign({ uiLibraries: [...current, val] })
              }
            }}
            multiSelect={true}
          />
        </motion.div>

        {/* Layout Concept */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
            LAYOUT CONCEPT (Select multiple)
          </label>
          <ChipSelector
            options={LAYOUT_CONCEPTS}
            selected={layoutConcepts || []}
            onToggle={(val) => {
              const current = layoutConcepts || []
              if (current.includes(val)) {
                setDesign({ layoutConcepts: current.filter(x => x !== val) })
              } else {
                setDesign({ layoutConcepts: [...current, val] })
              }
            }}
            multiSelect={true}
          />
        </motion.div>

        {/* Icon Set */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
            ICONOGRAPHY SET
          </label>
          <ChipSelector
            options={ICON_SETS}
            selected={iconSet ? [iconSet] : []}
            onToggle={(val) => setDesign({ iconSet: val })}
            multiSelect={false}
          />
        </motion.div>

        {/* Typography */}
        <motion.div variants={staggerItem} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
              PRIMARY TYPOGRAPHY
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {FONTS.map((font) => (
                <motion.button
                  key={font}
                  onClick={() => setDesign({ typography: font })}
                  className={`chip ${typography === font ? 'chip-active' : ''}`}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  aria-pressed={typography === font}
                  style={{ fontFamily: font, fontSize: '0.8rem' }}
                >
                  {font}
                </motion.button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
              SECONDARY TYPOGRAPHY
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {FONTS.map((font) => (
                <motion.button
                  key={`sec-${font}`}
                  onClick={() => setDesign({ secondaryTypography: font })}
                  className={`chip ${secondaryTypography === font ? 'chip-active' : ''}`}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  aria-pressed={secondaryTypography === font}
                  style={{ fontFamily: font, fontSize: '0.8rem' }}
                >
                  {font}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Spacing & Rounded Corners */}
        <motion.div variants={staggerItem} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
              SPACING (DENSITY)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['Compact', 'Comfortable', 'Spacious'].map((s) => (
                <motion.button
                  key={s}
                  onClick={() => setDesign({ spacing: s })}
                  className={`chip ${spacing === s ? 'chip-active' : ''}`}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
              ROUNDED CORNERS
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['None (0px)', 'Small (4px)', 'Medium (8px)', 'Large (16px)', 'Full (9999px)'].map((r) => (
                <motion.button
                  key={r}
                  onClick={() => setDesign({ roundedCorners: r })}
                  className={`chip ${roundedCorners === r ? 'chip-active' : ''}`}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  style={{
                    borderRadius: r.includes('None') ? '0px' : r.includes('Small') ? '4px' : r.includes('Medium') ? '8px' : r.includes('Large') ? '16px' : '99px',
                  }}
                >
                  {r.split(' ')[0]}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Buttons */}
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
