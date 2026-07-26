import { useState } from 'react'
import { motion } from 'framer-motion'
import { Palette, Check, Plus } from 'lucide-react'
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

const NEUTRAL_SHADES = [
  { label: 'Pure White', hex: '#ffffff', border: '1px solid rgba(255,255,255,0.4)' },
  { label: 'Light Gray', hex: '#f3f4f6', border: 'none' },
  { label: 'Slate Gray', hex: '#9ca3af', border: 'none' },
  { label: 'Dark Charcoal', hex: '#374151', border: 'none' },
  { label: 'Off-Black', hex: '#111827', border: '1px solid rgba(255,255,255,0.2)' },
  { label: 'Pure Black', hex: '#000000', border: '1px solid rgba(255,255,255,0.25)' },
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

const FONTS = ['Inter', 'Plus Jakarta Sans', 'Geist', 'DM Sans', 'Outfit', 'Satoshi', 'Playfair Display', 'Fira Code', 'Other']
const UI_LIBRARIES = ['Shadcn/ui', 'Tailwind CSS', 'Bootstrap', 'Material UI', 'Chakra UI', 'None', 'Other']
const ICON_SETS = ['Lucide Icons', 'FontAwesome', 'Heroicons', 'Radix Icons', 'None', 'Other']
const LAYOUT_CONCEPTS = ['Glassmorphism', 'Bento Grid', 'Flat Minimalist', 'Neumorphic', 'Other']

export default function StepDesignVibe({ onNext, onBack }) {
  const { pillars, setDesign } = useProjectStore()
  const {
    vibe, primaryColor = '#6366f1', secondaryColor = '#ec4899', shades = ['#ffffff', '#111827'],
    typography, secondaryTypography,
    uiLibraries = [],
    iconSet,
    layoutConcepts = [],
    spacing, roundedCorners,
  } = pillars.design

  // Local state for PRD-style custom item addition forms
  const [showCustomUi, setShowCustomUi] = useState(false)
  const [customUiInput, setCustomUiInput] = useState('')

  const [showCustomLayout, setShowCustomLayout] = useState(false)
  const [customLayoutInput, setCustomLayoutInput] = useState('')

  const [showCustomIcon, setShowCustomIcon] = useState(false)
  const [customIconInput, setCustomIconInput] = useState('')

  const [showCustomFont, setShowCustomFont] = useState(false)
  const [customFontInput, setCustomFontInput] = useState('')

  const [showCustomSecFont, setShowCustomSecFont] = useState(false)
  const [customSecFontInput, setCustomSecFontInput] = useState('')

  const canProceed = !!vibe

  const toggleShade = (hex) => {
    const current = shades || []
    const next = current.includes(hex) ? current.filter((c) => c !== hex) : [...current, hex]
    setDesign({ shades: next })
  }

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
            Customize your style direction, separated color palette (shades, primary & secondary colors), libraries, and typography.
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
        </motion.div>

        {/* 1. NEUTRAL SHADES GROUP (White to Black) */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
              NEUTRAL SHADES (WHITE TO BLACK) — Select multiple
            </label>
            {shades?.length > 0 && (
              <span style={{ fontSize: '0.7rem', color: 'var(--color-accent-text)', fontFamily: 'var(--font-mono)' }}>
                {shades.length} selected
              </span>
            )}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            {NEUTRAL_SHADES.map((item) => {
              const isSelected = shades.includes(item.hex)
              return (
                <motion.button
                  key={item.hex}
                  onClick={() => toggleShade(item.hex)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  title={`${item.label} (${item.hex})`}
                  style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: item.hex,
                    border: isSelected ? '2px solid #ffffff' : item.border || '2px solid transparent',
                    cursor: 'pointer',
                    boxShadow: isSelected
                      ? item.hex === '#ffffff'
                        ? '0 0 0 2px rgba(255,255,255,0.8), 0 0 10px rgba(255,255,255,0.4)'
                        : '0 0 0 2px rgba(21,128,61,0.8), 0 0 10px rgba(21,128,61,0.4)'
                      : 'none',
                    transition: 'all 150ms ease',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {isSelected && (
                    <Check size={14} color={['#ffffff', '#f3f4f6'].includes(item.hex) ? '#000000' : '#ffffff'} />
                  )}
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* 2 & 3. PRIMARY & SECONDARY BRAND COLORS (Separated Colored Groups) */}
        <motion.div variants={staggerItem} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
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
          </div>
        </motion.div>

        {/* Frontend / UI Library */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
            FRONTEND / UI LIBRARY (Select multiple)
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {UI_LIBRARIES.filter(x => x !== 'Other').map((lib) => {
              const isActive = (uiLibraries || []).includes(lib)
              return (
                <button
                  key={lib}
                  type="button"
                  className={`chip ${isActive ? 'chip-active' : ''}`}
                  onClick={() => {
                    const current = uiLibraries || []
                    const next = current.includes(lib) ? current.filter(x => x !== lib) : [...current, lib]
                    setDesign({ uiLibraries: next })
                  }}
                >
                  {lib}
                </button>
              )
            })}
            {(uiLibraries || []).filter(x => !UI_LIBRARIES.includes(x)).map((customLib) => (
              <button
                key={customLib}
                type="button"
                className="chip chip-active"
                onClick={() => {
                  setDesign({ uiLibraries: (uiLibraries || []).filter(x => x !== customLib) })
                }}
              >
                {customLib} <span style={{ opacity: 0.6, marginLeft: '2px' }}>×</span>
              </button>
            ))}
          </div>

          <div style={{ marginTop: '2px' }}>
            {!showCustomUi ? (
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setShowCustomUi(true)}
                style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={12} /> Other library...
              </button>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const val = customUiInput.trim()
                  if (val && !(uiLibraries || []).includes(val)) {
                    setDesign({ uiLibraries: [...(uiLibraries || []), val] })
                    setCustomUiInput('')
                    setShowCustomUi(false)
                  }
                }}
                style={{ display: 'flex', gap: '6px', marginTop: '4px' }}
              >
                <input
                  className="input-glass"
                  type="text"
                  placeholder="e.g. Mantine, Ant Design, Semantic UI…"
                  value={customUiInput}
                  onChange={(e) => setCustomUiInput(e.target.value)}
                  style={{ padding: '6px 10px', fontSize: '0.78rem', flex: 1 }}
                  autoFocus
                />
                <button className="btn-primary" type="submit" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>Add</button>
                <button className="btn-ghost" type="button" onClick={() => { setShowCustomUi(false); setCustomUiInput('') }} style={{ padding: '6px 10px', fontSize: '0.78rem' }}>Cancel</button>
              </form>
            )}
          </div>
        </motion.div>

        {/* Layout Concept */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
        </motion.div>

        {/* Icon Set */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
        </motion.div>

        {/* Typography */}
        <motion.div variants={staggerItem} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
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

