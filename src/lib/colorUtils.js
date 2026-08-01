/**
 * @typedef {Object} VibeConfig
 * @property {string} surfaceStyle 'monochrome-tint' | 'high-contrast-neutral' | 'warm-cool-grays'
 * @property {string} animation 'snappy' | 'fluid' | 'spring'
 * @property {string} gridMath 'tight-bento' | 'editorial-asymmetry' | 'fluid-modular'
 * @property {string} typeScale 'massive-display' | 'utilitarian'
 */

/**
 * @typedef {Object} DesignTokens
 * @property {string} primary
 * @property {string} secondary
 * @property {string} bg
 * @property {string} surface
 * @property {string} surfaceElevated
 * @property {string} border
 * @property {string} textPrimary
 * @property {string} textSecondary
 * @property {string} textMuted
 */

/**
 * Convert hex string to [r, g, b] array.
 * @param {string} hex
 * @returns {[number, number, number]}
 */
export function hexToRgb(hex) {
  let c = hex.replace('#', '')
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('')
  }
  const r = parseInt(c.slice(0, 2), 16)
  const g = parseInt(c.slice(2, 4), 16)
  const b = parseInt(c.slice(4, 6), 16)
  return [r, g, b]
}

/**
 * Convert [r, g, b] array to hex string.
 * @param {[number, number, number]} rgb
 * @returns {string}
 */
export function rgbToHex([r, g, b]) {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

/**
 * Mix two colors. Amount is the percentage of color2 (0-1).
 * @param {string} color1 Hex color
 * @param {string} color2 Hex color
 * @param {number} amount 0 to 1
 * @returns {string} Mixed hex color
 */
export function mixColors(color1, color2, amount) {
  const [r1, g1, b1] = hexToRgb(color1)
  const [r2, g2, b2] = hexToRgb(color2)

  const r = r1 * (1 - amount) + r2 * amount
  const g = g1 * (1 - amount) + g2 * amount
  const b = b1 * (1 - amount) + b2 * amount

  return rgbToHex([r, g, b])
}

/**
 * Adjust brightness of a color. Positive amount lightens, negative darkens.
 * @param {string} hex
 * @param {number} amount -1 to 1
 * @returns {string}
 */
export function adjustBrightness(hex, amount) {
  const rgb = hexToRgb(hex)
  const target = amount > 0 ? 255 : 0
  const absAmount = Math.abs(amount)
  
  const r = rgb[0] * (1 - absAmount) + target * absAmount
  const g = rgb[1] * (1 - absAmount) + target * absAmount
  const b = rgb[2] * (1 - absAmount) + target * absAmount
  
  return rgbToHex([r, g, b])
}

/**
 * Computes the final CSS variables based on Surface Harmony rule.
 * @param {string} primary Hex code
 * @param {string} secondary Hex code
 * @param {string} surfaceStyle 'monochrome-tint', 'high-contrast-neutral', 'warm-cool-grays'
 * @returns {DesignTokens}
 */
export function computeCSSVariables(primary, secondary, surfaceStyle) {
  const tokens = {
    primary: primary || '#6366f1',
    secondary: secondary || '#ec4899',
    bg: '#060614',
    surface: '#0d0d1f',
    surfaceElevated: '#12122a',
    border: 'rgba(255, 255, 255, 0.08)',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.6)',
    textMuted: 'rgba(255, 255, 255, 0.3)',
  }

  if (surfaceStyle === 'monochrome-tint') {
    // Heavily tinted with primary brand color
    tokens.bg = mixColors('#000000', tokens.primary, 0.08)
    tokens.surface = mixColors('#050505', tokens.primary, 0.12)
    tokens.surfaceElevated = mixColors('#0a0a0a', tokens.primary, 0.16)
    
    // Tint borders slightly
    const tintedWhite = mixColors('#ffffff', tokens.primary, 0.1)
    tokens.border = `rgba(${hexToRgb(tintedWhite).join(', ')}, 0.1)`
  } else if (surfaceStyle === 'high-contrast-neutral') {
    // Pure black/white backgrounds for stark contrast
    tokens.bg = '#000000'
    tokens.surface = '#000000'
    tokens.surfaceElevated = '#111111'
    tokens.border = 'rgba(255, 255, 255, 0.15)'
    tokens.textPrimary = '#ffffff'
    tokens.textSecondary = 'rgba(255, 255, 255, 0.8)'
    tokens.textMuted = 'rgba(255, 255, 255, 0.5)'
  } else if (surfaceStyle === 'warm-cool-grays') {
    // Slate/Zinc palettes for softness
    tokens.bg = '#0f1115' // slate-950
    tokens.surface = '#1e293b' // slate-800
    tokens.surfaceElevated = '#334155' // slate-700
    tokens.border = '#475569' // slate-600
  }

  return tokens
}
