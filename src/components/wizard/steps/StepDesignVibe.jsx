import { useState } from 'react'
import { motion } from 'framer-motion'
import { Palette, Check, Plus } from 'lucide-react'
import QuestionCard from '../QuestionCard'
import ChipSelector from '../ChipSelector'
import useProjectStore from '@/store/useProjectStore'
import DesignPreviewCard from './DesignPreviewCard'
import { staggerContainer, staggerItem } from '@/lib/animationVariants'

const SectionGroup = ({ title, children }) => (
  <motion.div variants={{
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }} style={{
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  }}>
    <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)', margin: 0, letterSpacing: '0.05em' }}>
      {title}
    </h3>
    {children}
  </motion.div>
)

const VIBES = [
  { value: 'Dark Premium', desc: 'Glassmorphism, deep surfaces, aurora gradients' },
  { value: 'Minimalist', desc: 'Clean whitespace, restrained palette, typography-led' },
  { value: 'Bold & Vibrant', desc: 'Strong colors, heavy type, high contrast' },
  { value: 'Corporate', desc: 'Professional, trustworthy, accessibility-first' },
  { value: 'Playful', desc: 'Rounded corners, bright colors, fun micro-interactions' },
  { value: 'Brutalist', desc: 'Raw, intentionally stark, monochrome with stark borders' },
  { value: 'Retro/Cyberpunk', desc: 'Neon glows, dark scanlines, tech terminal aesthetic' },
]

/**
 * @type {Object.<string, import('../../lib/colorUtils').VibeConfig>}
 */
const VIBE_CONFIG_MAP = {
  'Dark Premium': { baseTheme: 'Dark', surfaceTreatment: 'Glassmorphism', animationFeel: 'Swift/Linear', elevationStyle: 'Deep Material Shadows', gridMath: 'tight-bento', typeScale: 'utilitarian' },
  'Brutalist': { baseTheme: 'Light', surfaceTreatment: 'Flat', animationFeel: 'Swift/Linear', elevationStyle: 'Flat', gridMath: 'editorial-asymmetry', typeScale: 'massive-display' },
  'Playful': { baseTheme: 'Light', surfaceTreatment: 'Neumorphic', animationFeel: 'Bouncy/Spring', elevationStyle: 'Subtle Shadows', gridMath: 'fluid-modular', typeScale: 'massive-display' },
  'Minimalist': { baseTheme: 'Light', surfaceTreatment: 'Flat', animationFeel: 'Swift/Linear', elevationStyle: 'Flat', gridMath: 'fluid-modular', typeScale: 'utilitarian' },
  'Corporate': { baseTheme: 'Light', surfaceTreatment: 'Flat', animationFeel: 'Swift/Linear', elevationStyle: 'Subtle Shadows', gridMath: 'fluid-modular', typeScale: 'utilitarian' },
  'Bold & Vibrant': { baseTheme: 'Dark', surfaceTreatment: 'Flat', animationFeel: 'Bouncy/Spring', elevationStyle: 'Deep Material Shadows', gridMath: 'tight-bento', typeScale: 'massive-display' },
  'Retro/Cyberpunk': { baseTheme: 'Dark', surfaceTreatment: 'Flat', animationFeel: 'Swift/Linear', elevationStyle: 'Flat', gridMath: 'tight-bento', typeScale: 'utilitarian' }
}

const GRID_MATH_OPTIONS = [
  { 
    value: 'tight-bento', label: 'Tight Bento', desc: '12-col grid, 16px gap, inner radius = outer radius - padding',
    visual: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', width: '24px', height: '24px' }}>
        <div style={{ background: 'currentColor', borderRadius: '2px', opacity: 0.8 }} />
        <div style={{ background: 'currentColor', borderRadius: '2px', opacity: 0.4 }} />
        <div style={{ background: 'currentColor', borderRadius: '2px', opacity: 0.4, gridColumn: 'span 2' }} />
      </div>
    )
  },
  { 
    value: 'editorial-asymmetry', label: 'Editorial Asymmetry', desc: 'Offset columns, high vertical whitespace',
    visual: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4px', width: '24px', height: '24px', alignItems: 'start' }}>
        <div style={{ background: 'currentColor', height: '18px', opacity: 0.8 }} />
        <div style={{ background: 'currentColor', height: '10px', marginTop: '6px', opacity: 0.4 }} />
      </div>
    )
  },
  { 
    value: 'fluid-modular', label: 'Fluid Modular', desc: 'Auto-fit minimum widths, standard dashboard spacing',
    visual: (
      <div style={{ display: 'flex', gap: '3px', width: '24px', height: '24px', flexWrap: 'wrap' }}>
        <div style={{ background: 'currentColor', flex: '1 1 8px', height: '8px', opacity: 0.8, borderRadius: '1px' }} />
        <div style={{ background: 'currentColor', flex: '1 1 8px', height: '8px', opacity: 0.6, borderRadius: '1px' }} />
        <div style={{ background: 'currentColor', flex: '1 1 100%', height: '8px', opacity: 0.4, borderRadius: '1px' }} />
      </div>
    )
  },
  {
    value: 'none', label: 'None', desc: 'No strict grid constraints',
    visual: (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px' }}>
        <span style={{ fontSize: '10px', opacity: 0.5, fontWeight: 600 }}>—</span>
      </div>
    )
  }
]

const BASE_THEME_OPTIONS = [
  { value: 'Light', label: 'Light Mode', desc: 'White backgrounds, dark text.' },
  { value: 'Dark', label: 'Dark Mode', desc: 'Black/dark gray backgrounds, light text.' }
]

const SURFACE_TREATMENT_OPTIONS = [
  { value: 'Flat', label: 'Flat', desc: 'Solid colors, no transparency.' },
  { value: 'Glassmorphism', label: 'Glassmorphism', desc: 'Apple HIG style translucent backgrounds with backdrop blur.' },
  { value: 'Neumorphic', label: 'Neumorphic', desc: 'Soft extruded plastic look.' }
]

const ELEVATION_STYLE_OPTIONS = [
  { value: 'Flat', label: 'Flat', desc: 'No shadows, 2D appearance.' },
  { value: 'Subtle Shadows', label: 'Subtle Shadows', desc: 'Apple HIG style, soft drop shadows.' },
  { value: 'Deep Material Shadows', label: 'Deep Material Shadows', desc: 'Google Material level 3 elevation.' }
]

const ANIMATION_FEEL_OPTIONS = [
  { value: 'None', label: 'None', desc: 'Default browser transitions', buttonHover: {} },
  { value: 'Swift/Linear', label: 'Swift & Linear', desc: 'Snappy, 150ms max. Zero bounce.', buttonHover: { scale: 1.02 } },
  { value: 'Bouncy/Spring', label: 'Bouncy & Spring', desc: 'High bounce, natural elasticity.', buttonHover: { scale: 1.05 } }
]

const TYPE_SCALE_OPTIONS = [
  { 
    value: 'massive-display', label: 'Massive Display', desc: '7xl-9xl headers, tight tracking, small body text',
    visual: (
      <div style={{ display: 'flex', flexDirection: 'column', width: '24px', height: '24px', justifyContent: 'center' }}>
        <div style={{ fontSize: '16px', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.05em' }}>Aa</div>
      </div>
    )
  },
  { 
    value: 'utilitarian', label: 'Utilitarian', desc: '2xl max headers, hierarchy via font-weight',
    visual: (
      <div style={{ display: 'flex', flexDirection: 'column', width: '24px', height: '24px', justifyContent: 'center' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, lineHeight: 1 }}>Aa</div>
        <div style={{ fontSize: '8px', fontWeight: 400, lineHeight: 1, opacity: 0.6, marginTop: '2px' }}>Aa</div>
      </div>
    )
  },
  {
    value: 'none', label: 'None', desc: 'Standard default type scales',
    visual: (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px' }}>
        <span style={{ fontSize: '10px', opacity: 0.5, fontWeight: 600 }}>—</span>
      </div>
    )
  }
]

const LOADING_OPTIONS = [
  {
    value: 'skeleton', label: 'Skeleton',
    visual: (
      <motion.div 
        style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '24px', height: '24px', justifyContent: 'center' }}
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
      >
        <div style={{ width: '100%', height: '4px', background: 'currentColor', borderRadius: '2px' }} />
        <div style={{ width: '70%', height: '4px', background: 'currentColor', borderRadius: '2px' }} />
      </motion.div>
    )
  },
  {
    value: 'spinner', label: 'Spinner',
    visual: (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px' }}>
        <motion.div
          style={{ width: '12px', height: '12px', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: 'currentColor', borderRadius: '50%' }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
        />
      </div>
    )
  },
  {
    value: 'progress-bar', label: 'Progress Bar',
    visual: (
      <div style={{ display: 'flex', alignItems: 'center', width: '24px', height: '24px', overflow: 'hidden' }}>
        <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.2)', position: 'relative' }}>
          <motion.div
            style={{ position: 'absolute', height: '100%', background: 'currentColor', width: '50%' }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          />
        </div>
      </div>
    )
  },
  {
    value: 'none', label: 'None',
    visual: (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px' }}>
        <span style={{ fontSize: '10px', opacity: 0.5, fontWeight: 600 }}>—</span>
      </div>
    )
  }
]

const ACCENT_COLORS = [
  { label: 'Indigo', hex: '#6366f1' },
  { label: 'Purple', hex: '#8b5cf6' },
  { label: 'Pink', hex: '#ec4899' },
  { label: 'Teal', hex: '#14b8a6' },
  { label: 'Amber', hex: '#f59e0b' },
  { label: 'Red', hex: '#ef4444' },
  { label: 'Emerald', hex: '#22c55e' },
  { label: 'Sky Blue', hex: '#0ea5e9' },
  { label: 'Orange', hex: '#f97316' },
  { label: 'Violet', hex: '#a855f7' },
  { label: 'Cyan', hex: '#06b6d4' },
  { label: 'Lime', hex: '#84cc16' },
]

const FONTS = ['Inter', 'Plus Jakarta Sans', 'Geist', 'DM Sans', 'Outfit', 'Satoshi', 'Playfair Display', 'Fira Code', 'None', 'Other']
const CSS_ARCHITECTURES = ['Tailwind CSS', 'Bootstrap', 'Vanilla CSS', 'CSS Modules', 'Styled Components', 'Emotion', 'Other']
const COMPONENT_LIBRARIES = ['Shadcn/ui', 'ReactBits', 'MUI', 'Ant Design', 'Chakra UI', 'None', 'Other']
const ICON_SETS = ['Lucide Icons', 'FontAwesome', 'Heroicons', 'Radix Icons', 'None', 'Other']
const LAYOUT_CONCEPTS = ['Bento Grid', 'Split Screen', 'Holy Grail', 'Masonry Grid', 'Sidebar App', 'None', 'Other']

export default function StepDesignVibe({ onNext, onBack }) {
  const { pillars, setDesign } = useProjectStore()
  const {
    vibe, primaryColor = '#6366f1', secondaryColor = '#ec4899',
    typography, secondaryTypography,
    cssArchitecture = [], componentLibrary = [],
    iconSet,
    layoutConcepts = [],
    spacing, roundedCorners,
    gridMath, baseTheme = 'Dark', surfaceTreatment = 'Flat', elevationStyle = 'Subtle Shadows', animationFeel = 'Swift/Linear', typeScale,
    loadingStyle = { page: 'skeleton', component: 'spinner', action: 'spinner', scroll: 'spinner' }
  } = pillars.design

  // Local state for PRD-style custom item addition forms
  const [showCustomLayout, setShowCustomLayout] = useState(false)
  const [customLayoutInput, setCustomLayoutInput] = useState('')

  const [showCustomIcon, setShowCustomIcon] = useState(false)
  const [customIconInput, setCustomIconInput] = useState('')

  const [showCustomFont, setShowCustomFont] = useState(false)
  const [customFontInput, setCustomFontInput] = useState('')

  const [showCustomSecFont, setShowCustomSecFont] = useState(false)
  const [customSecFontInput, setCustomSecFontInput] = useState('')

  const canProceed = 
    !!vibe && 
    !!typography && 
    !!secondaryTypography &&
    cssArchitecture.length > 0 &&
    componentLibrary.length > 0 &&
    !!iconSet &&
    layoutConcepts.length > 0 &&
    !!gridMath &&
    !!baseTheme &&
    !!surfaceTreatment &&
    !!elevationStyle &&
    !!animationFeel &&
    !!typeScale &&
    !!loadingStyle?.page &&
    !!loadingStyle?.component &&
    !!loadingStyle?.action &&
    !!loadingStyle?.scroll

  const handleVibeSelect = (v) => {
    const config = VIBE_CONFIG_MAP[v] || {}
    setDesign({
      vibe: v,
      gridMath: config.gridMath || 'fluid-modular',
      baseTheme: config.baseTheme || 'Dark',
      surfaceTreatment: config.surfaceTreatment || 'Flat',
      elevationStyle: config.elevationStyle || 'Subtle Shadows',
      animationFeel: config.animationFeel || 'Swift/Linear',
      typeScale: config.typeScale || 'utilitarian',
      loadingStyle: {
        page: 'skeleton',
        component: 'spinner',
        action: 'spinner',
        scroll: 'spinner'
      }
    })
  }



  const renderLoadingSelector = (label, scenario) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
        {label}
      </label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px' }}>
        {LOADING_OPTIONS.map((opt) => {
          const isActive = loadingStyle?.[scenario] === opt.value
          return (
            <motion.button
              key={opt.value}
              onClick={() => setDesign({ loadingStyle: { ...loadingStyle, [scenario]: opt.value } })}
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '8px 12px', borderRadius: '8px',
                border: `1px solid ${isActive ? 'rgba(21,128,61,0.5)' : 'rgba(255,255,255,0.07)'}`,
                background: isActive ? 'rgba(21,128,61,0.12)' : 'rgba(255,255,255,0.02)',
                cursor: 'pointer', textAlign: 'left',
                transition: 'background 150ms ease, border 150ms ease'
              }}
            >
              <div style={{ color: isActive ? '#4ade80' : 'rgba(255,255,255,0.6)', flexShrink: 0 }}>
                {opt.visual}
              </div>
              <span style={{ fontWeight: 600, fontSize: '0.78rem', color: isActive ? '#4ade80' : 'rgba(255,255,255,0.85)' }}>
                {opt.label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )

  const renderRadioGroup = (label, options, currentValue, onChangeKey) => (
    <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
        {label}
      </label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px' }}>
        {options.map((opt) => {
          const isActive = currentValue === opt.value
          return (
            <motion.button
              key={opt.value}
              onClick={() => setDesign({ [onChangeKey]: opt.value })}
              type="button"
              whileHover={opt.buttonHover}
              animate={{ x: 0, scale: 1 }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', borderRadius: '10px',
                border: `1px solid ${isActive ? 'rgba(21,128,61,0.5)' : 'rgba(255,255,255,0.07)'}`,
                background: isActive ? 'rgba(21,128,61,0.12)' : 'rgba(255,255,255,0.02)',
                cursor: 'pointer', textAlign: 'left', 
                transition: 'background 150ms ease, border 150ms ease'
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: isActive ? '#4ade80' : 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {opt.visual && (
                    <div style={{ color: isActive ? '#4ade80' : 'rgba(255,255,255,0.6)' }}>
                      {opt.visual}
                    </div>
                  )}
                  {opt.label}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px', paddingLeft: opt.visual ? '34px' : '0px' }}>
                  {opt.desc}
                </div>
              </div>
              {isActive && <Check size={16} style={{ color: '#4ade80' }} />}
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )

  return (
    <div style={{ width: '100%' }}>
      <QuestionCard>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
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
            Customize your style direction, separated color palette (primary & secondary colors), libraries, and typography.
          </p>
        </motion.div>

        <SectionGroup title="1. Foundation">
          {/* Vibe Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
              AESTHETIC STYLE
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {VIBES.map((v) => {
                const isActive = vibe === v.value
                return (
                  <motion.button
                    key={v.value}
                    onClick={() => handleVibeSelect(v.value)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    aria-pressed={isActive}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: `1px solid ${isActive ? 'rgba(21,128,61,0.5)' : 'rgba(255,255,255,0.07)'}`,
                      background: isActive ? 'rgba(21,128,61,0.12)' : 'rgba(255,255,255,0.02)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 150ms ease',
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: isActive ? '#4ade80' : 'rgba(255,255,255,0.85)', marginBottom: '2px' }}>
                      {v.value}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.35 }}>
                      {v.desc}
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </SectionGroup>

        <SectionGroup title="2. Color System">
          {/* 2 & 3. PRIMARY & SECONDARY BRAND COLORS (Separated Colored Groups) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Primary Color Group */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
                PRIMARY BRAND COLOR
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                {ACCENT_COLORS.map((item) => {
                  const isSelected = primaryColor === item.hex
                  return (
                    <motion.button
                      key={`pri-${item.hex}`}
                      onClick={() => setDesign({ primaryColor: item.hex })}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      title={`Primary ${item.label} (${item.hex})`}
                      style={{
                        width: '26px', height: '26px', borderRadius: '50%',
                        background: item.hex,
                        border: isSelected ? '2px solid white' : '2px solid transparent',
                        cursor: 'pointer',
                        boxShadow: isSelected ? `0 0 0 2px ${item.hex}80, 0 0 12px ${item.hex}60` : 'none',
                        transition: 'all 150ms ease',
                      }}
                    />
                  )
                })}
                <input
                  type="color"
                  value={primaryColor || '#6366f1'}
                  onChange={(e) => setDesign({ primaryColor: e.target.value })}
                  style={{
                    width: '26px', height: '26px', borderRadius: '50%',
                    border: 'none', cursor: 'pointer', padding: 0,
                    background: 'transparent',
                  }}
                  title="Custom Primary Color"
                />
              </div>
              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>HEX:</span>
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setDesign({ primaryColor: e.target.value })}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '4px 8px', color: '#fff', fontSize: '0.75rem', fontFamily: 'monospace', width: '80px' }}
                />
              </div>
            </div>

            {/* Secondary Color Group */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
                SECONDARY / ACCENT COLOR
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                {ACCENT_COLORS.map((item) => {
                  const isSelected = secondaryColor === item.hex
                  return (
                    <motion.button
                      key={`sec-${item.hex}`}
                      onClick={() => setDesign({ secondaryColor: item.hex })}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      title={`Secondary ${item.label} (${item.hex})`}
                      style={{
                        width: '26px', height: '26px', borderRadius: '50%',
                        background: item.hex,
                        border: isSelected ? '2px solid white' : '2px solid transparent',
                        cursor: 'pointer',
                        boxShadow: isSelected ? `0 0 0 2px ${item.hex}80, 0 0 12px ${item.hex}60` : 'none',
                        transition: 'all 150ms ease',
                      }}
                    />
                  )
                })}
                <input
                  type="color"
                  value={secondaryColor || '#ec4899'}
                  onChange={(e) => setDesign({ secondaryColor: e.target.value })}
                  style={{
                    width: '26px', height: '26px', borderRadius: '50%',
                    border: 'none', cursor: 'pointer', padding: 0,
                    background: 'transparent',
                  }}
                  title="Custom Secondary Color"
                />
              </div>
              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>HEX:</span>
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setDesign({ secondaryColor: e.target.value })}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '4px 8px', color: '#fff', fontSize: '0.75rem', fontFamily: 'monospace', width: '80px' }}
                />
              </div>
            </div>
          </div>
        </SectionGroup>

        <SectionGroup title="3. Framework & Assets">
          {/* CSS Architecture */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
            CSS ARCHITECTURE (Select multiple)
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {CSS_ARCHITECTURES.filter(x => x !== 'Other').map((lib) => {
              const isActive = (cssArchitecture || []).includes(lib)
              return (
                <button
                  key={lib}
                  type="button"
                  className={`chip ${isActive ? 'chip-active' : ''}`}
                  onClick={() => {
                    const current = cssArchitecture || []
                    const next = current.includes(lib) ? current.filter(x => x !== lib) : [...current, lib]
                    setDesign({ cssArchitecture: next })
                  }}
                >
                  {lib}
                </button>
              )
            })}
          </div>
          </div>

          {/* Component Library */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
            COMPONENT LIBRARY (Select multiple)
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {COMPONENT_LIBRARIES.filter(x => x !== 'Other').map((lib) => {
              const isActive = (componentLibrary || []).includes(lib)
              return (
                <button
                  key={lib}
                  type="button"
                  className={`chip ${isActive ? 'chip-active' : ''}`}
                  onClick={() => {
                    const current = componentLibrary || []
                    const next = current.includes(lib) ? current.filter(x => x !== lib) : [...current, lib]
                    setDesign({ componentLibrary: next })
                  }}
                >
                  {lib}
                </button>
              )
            })}
          </div>
          </div>

          {/* Layout Concept */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
            LAYOUT CONCEPT (Select multiple)
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {LAYOUT_CONCEPTS.filter(x => x !== 'Other').map((layout) => {
              const isActive = (layoutConcepts || []).includes(layout)
              return (
                <button
                  key={layout}
                  type="button"
                  className={`chip ${isActive ? 'chip-active' : ''}`}
                  onClick={() => {
                    const current = layoutConcepts || []
                    const next = current.includes(layout) ? current.filter(x => x !== layout) : [...current, layout]
                    setDesign({ layoutConcepts: next })
                  }}
                >
                  {layout}
                </button>
              )
            })}
            {(layoutConcepts || []).filter(x => !LAYOUT_CONCEPTS.includes(x)).map((customLayout) => (
              <button
                key={customLayout}
                type="button"
                className="chip chip-active"
                onClick={() => {
                  setDesign({ layoutConcepts: (layoutConcepts || []).filter(x => x !== customLayout) })
                }}
              >
                {customLayout} <span style={{ opacity: 0.6, marginLeft: '2px' }}>×</span>
              </button>
            ))}
          </div>

          <div style={{ marginTop: '2px' }}>
            {!showCustomLayout ? (
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setShowCustomLayout(true)}
                style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={12} /> Other layout concept...
              </button>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const val = customLayoutInput.trim()
                  if (val && !(layoutConcepts || []).includes(val)) {
                    setDesign({ layoutConcepts: [...(layoutConcepts || []), val] })
                    setCustomLayoutInput('')
                    setShowCustomLayout(false)
                  }
                }}
                style={{ display: 'flex', gap: '6px', marginTop: '4px' }}
              >
                <input
                  className="input-glass"
                  type="text"
                  placeholder="e.g. Split Screen, Holy Grail, Masonry Grid…"
                  value={customLayoutInput}
                  onChange={(e) => setCustomLayoutInput(e.target.value)}
                  style={{ padding: '6px 10px', fontSize: '0.78rem', flex: 1 }}
                  autoFocus
                />
                <button className="btn-primary" type="submit" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>Add</button>
                <button className="btn-ghost" type="button" onClick={() => { setShowCustomLayout(false); setCustomLayoutInput('') }} style={{ padding: '6px 10px', fontSize: '0.78rem' }}>Cancel</button>
              </form>
            )}
          </div>
          </div>

          {/* Icon Set */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
            ICONOGRAPHY SET
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {ICON_SETS.filter(x => x !== 'Other').map((icon) => {
              const isActive = iconSet === icon
              return (
                <button
                  key={icon}
                  type="button"
                  className={`chip ${isActive ? 'chip-active' : ''}`}
                  onClick={() => setDesign({ iconSet: icon })}
                >
                  {icon}
                </button>
              )
            })}
            {iconSet && !ICON_SETS.includes(iconSet) && (
              <button
                type="button"
                className="chip chip-active"
                onClick={() => setDesign({ iconSet: '' })}
              >
                {iconSet} <span style={{ opacity: 0.6, marginLeft: '2px' }}>×</span>
              </button>
            )}
          </div>

          <div style={{ marginTop: '2px' }}>
            {!showCustomIcon ? (
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setShowCustomIcon(true)}
                style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={12} /> Other iconography set...
              </button>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const val = customIconInput.trim()
                  if (val) {
                    setDesign({ iconSet: val })
                    setCustomIconInput('')
                    setShowCustomIcon(false)
                  }
                }}
                style={{ display: 'flex', gap: '6px', marginTop: '4px' }}
              >
                <input
                  className="input-glass"
                  type="text"
                  placeholder="e.g. Tabler Icons, Phosphor, Unicons…"
                  value={customIconInput}
                  onChange={(e) => setCustomIconInput(e.target.value)}
                  style={{ padding: '6px 10px', fontSize: '0.78rem', flex: 1 }}
                  autoFocus
                />
                <button className="btn-primary" type="submit" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>Add</button>
                <button className="btn-ghost" type="button" onClick={() => { setShowCustomIcon(false); setCustomIconInput('') }} style={{ padding: '6px 10px', fontSize: '0.78rem' }}>Cancel</button>
              </form>
            )}
          </div>
          </div>
        </SectionGroup>

        <SectionGroup title="4. Typography">
          {/* Typography */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Primary Typography */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
              PRIMARY TYPOGRAPHY
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {FONTS.filter(x => x !== 'Other').map((font) => (
                <button
                  key={font}
                  type="button"
                  onClick={() => setDesign({ typography: font })}
                  className={`chip ${typography === font ? 'chip-active' : ''}`}
                  style={{ fontFamily: font, fontSize: '0.8rem' }}
                >
                  {font}
                </button>
              ))}
              {typography && !FONTS.includes(typography) && (
                <button
                  type="button"
                  className="chip chip-active"
                  onClick={() => setDesign({ typography: '' })}
                >
                  {typography} <span style={{ opacity: 0.6, marginLeft: '2px' }}>×</span>
                </button>
              )}
            </div>

            <div style={{ marginTop: '2px' }}>
              {!showCustomFont ? (
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setShowCustomFont(true)}
                  style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Plus size={12} /> Other font...
                </button>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const val = customFontInput.trim()
                    if (val) {
                      setDesign({ typography: val })
                      setCustomFontInput('')
                      setShowCustomFont(false)
                    }
                  }}
                  style={{ display: 'flex', gap: '6px', marginTop: '4px' }}
                >
                  <input
                    className="input-glass"
                    type="text"
                    placeholder="e.g. Space Grotesk, Syne…"
                    value={customFontInput}
                    onChange={(e) => setCustomFontInput(e.target.value)}
                    style={{ padding: '6px 10px', fontSize: '0.78rem', flex: 1 }}
                    autoFocus
                  />
                  <button className="btn-primary" type="submit" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>Add</button>
                  <button className="btn-ghost" type="button" onClick={() => { setShowCustomFont(false); setCustomFontInput('') }} style={{ padding: '6px 10px', fontSize: '0.78rem' }}>Cancel</button>
                </form>
              )}
            </div>
          </div>

          {/* Secondary Typography */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
              SECONDARY TYPOGRAPHY
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {FONTS.filter(x => x !== 'Other').map((font) => (
                <button
                  key={`sec-${font}`}
                  type="button"
                  onClick={() => setDesign({ secondaryTypography: font })}
                  className={`chip ${secondaryTypography === font ? 'chip-active' : ''}`}
                  style={{ fontFamily: font, fontSize: '0.8rem' }}
                >
                  {font}
                </button>
              ))}
              {secondaryTypography && !FONTS.includes(secondaryTypography) && (
                <button
                  type="button"
                  className="chip chip-active"
                  onClick={() => setDesign({ secondaryTypography: '' })}
                >
                  {secondaryTypography} <span style={{ opacity: 0.6, marginLeft: '2px' }}>×</span>
                </button>
              )}
            </div>

            <div style={{ marginTop: '2px' }}>
              {!showCustomSecFont ? (
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setShowCustomSecFont(true)}
                  style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Plus size={12} /> Other secondary font...
                </button>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const val = customSecFontInput.trim()
                    if (val) {
                      setDesign({ secondaryTypography: val })
                      setCustomSecFontInput('')
                      setShowCustomSecFont(false)
                    }
                  }}
                  style={{ display: 'flex', gap: '6px', marginTop: '4px' }}
                >
                  <input
                    className="input-glass"
                    type="text"
                    placeholder="e.g. JetBrains Mono, Fira Code…"
                    value={customSecFontInput}
                    onChange={(e) => setCustomSecFontInput(e.target.value)}
                    style={{ padding: '6px 10px', fontSize: '0.78rem', flex: 1 }}
                    autoFocus
                  />
                  <button className="btn-primary" type="submit" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>Add</button>
                  <button className="btn-ghost" type="button" onClick={() => { setShowCustomSecFont(false); setCustomSecFontInput('') }} style={{ padding: '6px 10px', fontSize: '0.78rem' }}>Cancel</button>
                </form>
              )}
            </div>
          </div>
          </div>
        </SectionGroup>

        <SectionGroup title="5. Form & Space">
          {/* Spacing & Rounded Corners */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
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
          </div>
        </SectionGroup>

        {/* Engine Overrides */}
        {vibe && (
          <SectionGroup title="6. Engine Overrides">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {renderRadioGroup('BASE THEME', BASE_THEME_OPTIONS, baseTheme, 'baseTheme')}
                {renderRadioGroup('SURFACE TREATMENT', SURFACE_TREATMENT_OPTIONS, surfaceTreatment, 'surfaceTreatment')}
                {renderRadioGroup('GRID MATHEMATICS', GRID_MATH_OPTIONS, gridMath, 'gridMath')}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {renderRadioGroup('ELEVATION STYLE', ELEVATION_STYLE_OPTIONS, elevationStyle, 'elevationStyle')}
                {renderRadioGroup('ANIMATION FEEL', ANIMATION_FEEL_OPTIONS, animationFeel, 'animationFeel')}
                {renderRadioGroup('TYPOGRAPHIC SCALE', TYPE_SCALE_OPTIONS, typeScale, 'typeScale')}
              </div>
            </div>
          </SectionGroup>
        )}

        <SectionGroup title="7. Loading States">
          {/* Loading Scenarios */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {renderLoadingSelector('FULL PAGE LOAD', 'page')}
          {renderLoadingSelector('DATA FETCHING (COMPONENT)', 'component')}
            {renderLoadingSelector('BUTTON / FORM SUBMIT', 'action')}
            {renderLoadingSelector('INFINITE SCROLL / PAGINATION', 'scroll')}
          </div>
        </SectionGroup>

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
    </div>
  )
}

