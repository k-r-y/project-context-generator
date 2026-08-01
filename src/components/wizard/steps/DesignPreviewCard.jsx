import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useProjectStore from '@/store/useProjectStore'

const Badge = ({ children, bg, color, border }) => (
  <span style={{
    background: bg || 'rgba(255,255,255,0.05)',
    color: color || 'inherit',
    border: `1px solid ${border || 'rgba(255,255,255,0.1)'}`,
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontWeight: 600,
    whiteSpace: 'nowrap'
  }}>
    {children}
  </span>
)

export default function DesignPreviewCard() {
  const { pillars } = useProjectStore()
  const { 
    vibe,
    primaryColor = '#6366f1', 
    secondaryColor = '#ec4899', 
    typography = 'Inter', 
    secondaryTypography,
    cssArchitecture = [],
    componentLibrary = [],
    iconSet,
    layoutConcepts = [],
    spacing,
    roundedCorners = 'Medium (8px)',
    baseTheme = 'Dark',
    surfaceTreatment = 'Flat',
    gridMath,
    elevationStyle = 'Subtle Shadows',
    animationFeel,
    typeScale,
    loadingStyle = {}
  } = pillars.design

  const isLight = baseTheme === 'Light'
  const bg = isLight ? '#f4f4f5' : '#09090b'
  const surface = isLight ? '#ffffff' : '#18181b'
  const textPrimary = isLight ? '#18181b' : '#fafafa'
  const textSecondary = isLight ? '#52525b' : '#a1a1aa'
  const border = isLight ? '#e4e4e7' : '#27272a'
  const highlightBg = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)'

  let shadow = 'none'
  if (elevationStyle === 'Subtle Shadows') shadow = '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
  if (elevationStyle === 'Deep Material Shadows') shadow = '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'

  let filter = 'none'
  let bgOverride = surface
  if (surfaceTreatment === 'Glassmorphism') {
    filter = 'blur(16px)'
    bgOverride = isLight ? 'rgba(255,255,255,0.7)' : 'rgba(24,24,27,0.7)'
  }

  const radius = roundedCorners.includes('None') ? '0px' 
    : roundedCorners.includes('Small') ? '4px' 
    : roundedCorners.includes('Medium') ? '8px' 
    : roundedCorners.includes('Large') ? '16px' 
    : '99px'

  const fontPrimary = typography === 'Playfair Display' ? 'Playfair Display, serif' : 'Inter, sans-serif'
  const fontSecondary = secondaryTypography || fontPrimary

  return (
    <div style={{
      background: bg,
      padding: '24px',
      borderRadius: '16px',
      border: `1px solid ${border}`,
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      width: '100%',
      fontFamily: fontPrimary,
      color: textPrimary
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', color: textSecondary }}>
          Design System Preview
        </h3>
        {vibe && (
          <Badge bg={primaryColor} color="#fff" border="transparent">
            {vibe}
          </Badge>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Colors */}
        <div style={{ background: highlightBg, padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px', minWidth: 0 }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: textSecondary, textTransform: 'uppercase' }}>Colors</span>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: primaryColor, boxShadow: shadow, flexShrink: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.65rem', color: textSecondary }}>Primary</span>
                <span style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{primaryColor}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: secondaryColor, boxShadow: shadow, flexShrink: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.65rem', color: textSecondary }}>Secondary</span>
                <span style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{secondaryColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div style={{ background: highlightBg, padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px', minWidth: 0 }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: textSecondary, textTransform: 'uppercase' }}>Typography</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: fontPrimary, fontSize: '1.2rem', fontWeight: 700, lineHeight: 1 }}>Aa</span>
              <span style={{ fontSize: '0.7rem', color: textSecondary }}>{typography}</span>
            </div>
            {secondaryTypography && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: fontSecondary, fontSize: '1rem', fontWeight: 400, lineHeight: 1 }}>Aa</span>
                <span style={{ fontSize: '0.7rem', color: textSecondary }}>{secondaryTypography}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Surface & Component Preview */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: 0 }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: textSecondary, textTransform: 'uppercase' }}>Surface Treatment & UI Form</span>
        <div style={{
          background: bgOverride,
          backdropFilter: filter,
          WebkitBackdropFilter: filter,
          borderRadius: radius,
          padding: '20px',
          boxShadow: shadow,
          border: `1px solid ${border}`,
          display: 'flex',
          flexDirection: 'column',
          gap: spacing === 'Spacious' ? '24px' : spacing === 'Compact' ? '12px' : '16px',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h4 style={{ fontFamily: fontPrimary, fontSize: typeScale === 'massive-display' ? '1.5rem' : '1.1rem', fontWeight: 700, margin: 0 }}>
              Example Surface
            </h4>
            <p style={{ fontFamily: fontSecondary, color: textSecondary, fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
              This card demonstrates the {baseTheme} base theme, {surfaceTreatment} treatment, {roundedCorners.split(' ')[0].toLowerCase()} corners, and {elevationStyle.toLowerCase()}.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <motion.button 
              whileHover={animationFeel === 'Swift/Linear' ? { scale: 1.02 } : animationFeel === 'Bouncy/Spring' ? { scale: 1.05 } : {}}
              style={{
              background: primaryColor, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: radius, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', flex: 1, minWidth: '100px'
            }}>
              Primary Action
            </motion.button>
            <motion.button 
              whileHover={animationFeel === 'Swift/Linear' ? { scale: 1.02 } : animationFeel === 'Bouncy/Spring' ? { scale: 1.05 } : {}}
              style={{
              background: 'transparent', color: textPrimary, border: `1px solid ${border}`, padding: '8px 16px', borderRadius: radius, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', flex: 1, minWidth: '100px'
            }}>
              Secondary
            </motion.button>
          </div>
        </div>
      </div>

      {/* Tech Stack & Libraries */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0 }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: textSecondary, textTransform: 'uppercase' }}>CSS & Components</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {cssArchitecture.length === 0 && componentLibrary.length === 0 && (
              <span style={{ fontSize: '0.75rem', color: textSecondary, fontStyle: 'italic' }}>None selected</span>
            )}
            {cssArchitecture.map(c => <Badge key={c} border={border}>{c}</Badge>)}
            {componentLibrary.map(c => <Badge key={c} border={border}>{c}</Badge>)}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0 }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: textSecondary, textTransform: 'uppercase' }}>Layout & Icons</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {layoutConcepts.map(l => <Badge key={l} border={border}>{l}</Badge>)}
            {iconSet && <Badge border={border}>{iconSet}</Badge>}
            {layoutConcepts.length === 0 && !iconSet && (
              <span style={{ fontSize: '0.75rem', color: textSecondary, fontStyle: 'italic' }}>None selected</span>
            )}
          </div>
        </div>
      </div>

      {/* Overrides & States */}
      <div style={{ background: highlightBg, padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px', minWidth: 0 }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: textSecondary, textTransform: 'uppercase' }}>Configuration Details</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: textSecondary }}>Grid Math:</span>
            <span style={{ fontWeight: 600 }}>{gridMath || '—'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: textSecondary }}>Type Scale:</span>
            <span style={{ fontWeight: 600 }}>{typeScale || '—'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: textSecondary }}>Animation Feel:</span>
            <span style={{ fontWeight: 600 }}>{animationFeel || '—'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: textSecondary }}>Page Load:</span>
            <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{loadingStyle?.page || '—'}</span>
          </div>
        </div>
      </div>

    </div>
  )
}
