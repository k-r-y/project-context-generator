import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, Plus, Check } from 'lucide-react'
import QuestionCard from '../QuestionCard'
import ChipSelector from '../ChipSelector'
import useProjectStore from '@/store/useProjectStore'
import { staggerContainer, staggerItem } from '@/lib/animationVariants'

// Platform-dependent rendering/runtime options
const WEB_RENDERING = [
  { value: 'SPA', label: 'Single Page App', description: 'Client-side rendering. Best for dashboards and authenticated tools.' },
  { value: 'SSR', label: 'Server-Side Rendering', description: 'HTML generated per request. Best for SEO-heavy content sites.' },
  { value: 'SSG', label: 'Static Site Generation', description: 'Pre-built HTML at build time. Best for blogs and marketing sites.' },
  { value: 'Hybrid', label: 'Hybrid (ISR)', description: 'Mix of SSR and SSG with incremental regeneration.' },
]

const APP_RENDERING = [
  { value: 'Native', label: 'Native Client', description: 'Fully compiled native application client (iOS/Android/macOS/Windows).' },
  { value: 'Cross-Platform', label: 'Cross-Platform Framework', description: 'Hybrid wrapper or bridge client (React Native, Flutter, Tauri, Electron).' },
]

const CLOUD_RENDERING = [
  { value: 'Serverless Functions', label: 'Serverless Functions', description: 'Event-driven, stateless functions. Auto-scales to zero (AWS Lambda, Cloud Functions).' },
  { value: 'Containerized Service', label: 'Containerized Microservice', description: 'Long-running API service running inside Docker/K8s/ECS containers.' },
  { value: 'Monolithic API Server', label: 'Monolithic VM Server', description: 'Traditional virtual machine setup running a single consolidated process.' },
]

// Common Design Patterns
const DESIGN_PATTERNS = ['MVC', 'Repository Pattern', 'Module-Based', 'Feature-Sliced (FSD)', 'Microservices', 'Serverless']

export default function StepRendering({ onNext, onBack }) {
  const { projectMeta, pillars, setArchitecture } = useProjectStore()
  const { rendering, designPattern, authStrategy } = pillars.architecture

  const [customRendering, setCustomRendering] = useState('')
  const [showCustomRendering, setShowCustomRendering] = useState(false)

  const [customPattern, setCustomPattern] = useState('')
  const [showCustomPattern, setShowCustomPattern] = useState(false)

  const [customAuth, setCustomAuth] = useState('')
  const [showCustomAuth, setShowCustomAuth] = useState(false)

  // Resolve Rendering choices based on platform
  const getRenderingOptions = () => {
    const p = (projectMeta.platform || '').toLowerCase()
    if (p.includes('web')) return WEB_RENDERING
    if (p.includes('ios') || p.includes('android') || p.includes('mobile') || p.includes('desktop')) return APP_RENDERING
    if (p.includes('cloud')) return CLOUD_RENDERING
    return [...WEB_RENDERING, ...APP_RENDERING]
  }

  const renderingOptions = getRenderingOptions()

  // Resolve Auth Strategies based on selected stack / platform
  const getAuthOptions = () => {
    const stack = pillars.architecture.stack || []
    // Java backend or traditional MVC typically uses session cookies
    if (stack.includes('Java') || stack.includes('Spring Boot')) {
      return ['Session Cookies', 'OAuth 2.0', 'API Key', 'None']
    }
    // Client-side web apps typically use JWT or Auth providers
    if (stack.includes('React') || stack.includes('Next.js') || stack.includes('Expo')) {
      return ['JWT', 'OAuth 2.0', 'Magic Link', 'Session Cookies', 'None']
    }
    // Mobile targets typically prefer JWT or OAuth
    const p = (projectMeta.platform || '').toLowerCase()
    if (p.includes('ios') || p.includes('android') || p.includes('mobile')) {
      return ['JWT', 'OAuth 2.0', 'API Key', 'None']
    }
    return ['JWT', 'Session Cookies', 'OAuth 2.0', 'Magic Link', 'API Key', 'None']
  }

  const authOptions = getAuthOptions()

  const handleAddCustomRendering = (e) => {
    e.preventDefault()
    if (customRendering.trim()) {
      setArchitecture({ rendering: customRendering.trim() })
      setCustomRendering('')
      setShowCustomRendering(false)
    }
  }

  const handleAddCustomPattern = (e) => {
    e.preventDefault()
    if (customPattern.trim()) {
      setArchitecture({ designPattern: customPattern.trim() })
      setCustomPattern('')
      setShowCustomPattern(false)
    }
  }

  const handleAddCustomAuth = (e) => {
    e.preventDefault()
    if (customAuth.trim()) {
      setArchitecture({ authStrategy: customAuth.trim() })
      setCustomAuth('')
      setShowCustomAuth(false)
    }
  }

  const canProceed = !!rendering && !!designPattern && !!authStrategy

  return (
    <QuestionCard>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}
      >
        <motion.div variants={staggerItem} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px', height: '36px', borderRadius: '9px',
              background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Globe size={18} color="white" />
          </div>
          <span className="badge badge-brand">Architecture</span>
        </motion.div>

        <motion.div variants={staggerItem}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '6px' }}>
            How will your app be structured?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
            Choose how your logic, rendering, and authentication are organized.
          </p>
        </motion.div>

        {/* Rendering / Execution Strategy */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.07em' }}>
            RENDERING & CLIENT RUNTIME
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {renderingOptions.map((opt) => {
              const isActive = rendering === opt.value
              return (
                <motion.button
                  key={opt.value}
                  onClick={() => setArchitecture({ rendering: opt.value })}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  aria-pressed={isActive}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '12px',
                    padding: '12px 14px', borderRadius: '10px',
                    border: `1px solid ${isActive ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.08)'}`,
                    background: isActive ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 150ms ease',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: isActive ? '#a5b8fc' : 'rgba(255,255,255,0.9)', fontSize: '0.875rem', marginBottom: '2px' }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                      {opt.description}
                    </div>
                  </div>
                  {isActive && <Check size={14} style={{ color: 'var(--color-accent-text)', marginTop: '2px' }} />}
                </motion.button>
              )
            })}
          </div>

          {/* Rendering custom value selector */}
          {rendering && !renderingOptions.map(o => o.value).includes(rendering) && (
            <div style={{ marginTop: '4px' }}>
              <button className="chip chip-active" onClick={() => setArchitecture({ rendering: '' })}>
                {rendering} <span style={{ opacity: 0.5 }}>×</span>
              </button>
            </div>
          )}

          <div style={{ marginTop: '4px' }}>
            {!showCustomRendering ? (
              <button
                className="btn-ghost"
                onClick={() => setShowCustomRendering(true)}
                style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={12} /> Other rendering...
              </button>
            ) : (
              <form onSubmit={handleAddCustomRendering} style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                <input
                  className="input-glass"
                  type="text"
                  placeholder="e.g. Static PWA, Native Android App…"
                  value={customRendering}
                  onChange={(e) => setCustomRendering(e.target.value)}
                  style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                  autoFocus
                />
                <button className="btn-primary" type="submit" style={{ padding: '6px 10px', fontSize: '0.78rem' }}>Add</button>
                <button className="btn-ghost" type="button" onClick={() => { setShowCustomRendering(false); setCustomRendering('') }} style={{ padding: '6px 10px', fontSize: '0.78rem' }}>Cancel</button>
              </form>
            )}
          </div>
        </motion.div>

        {/* Design Pattern */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.07em' }}>
            DESIGN PATTERN
          </label>
          <ChipSelector
            options={DESIGN_PATTERNS}
            selected={DESIGN_PATTERNS.includes(designPattern) ? [designPattern] : []}
            onToggle={(val) => setArchitecture({ designPattern: val })}
            multiSelect={false}
          />

          {designPattern && !DESIGN_PATTERNS.includes(designPattern) && (
            <div style={{ marginTop: '4px' }}>
              <button className="chip chip-active" onClick={() => setArchitecture({ designPattern: '' })}>
                {designPattern} <span style={{ opacity: 0.5 }}>×</span>
              </button>
            </div>
          )}

          <div style={{ marginTop: '4px' }}>
            {!showCustomPattern ? (
              <button
                className="btn-ghost"
                onClick={() => setShowCustomPattern(true)}
                style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={12} /> Other pattern...
              </button>
            ) : (
              <form onSubmit={handleAddCustomPattern} style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                <input
                  className="input-glass"
                  type="text"
                  placeholder="e.g. Hexagonal, Clean Architecture…"
                  value={customPattern}
                  onChange={(e) => setCustomPattern(e.target.value)}
                  style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                  autoFocus
                />
                <button className="btn-primary" type="submit" style={{ padding: '6px 10px', fontSize: '0.78rem' }}>Add</button>
                <button className="btn-ghost" type="button" onClick={() => { setShowCustomPattern(false); setCustomPattern('') }} style={{ padding: '6px 10px', fontSize: '0.78rem' }}>Cancel</button>
              </form>
            )}
          </div>
        </motion.div>

        {/* Auth Strategy */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.07em' }}>
            AUTHENTICATION STRATEGY
          </label>
          <ChipSelector
            options={authOptions}
            selected={authOptions.includes(authStrategy) ? [authStrategy] : []}
            onToggle={(val) => setArchitecture({ authStrategy: val })}
            multiSelect={false}
          />

          {authStrategy && !authOptions.includes(authStrategy) && (
            <div style={{ marginTop: '4px' }}>
              <button className="chip chip-active" onClick={() => setArchitecture({ authStrategy: '' })}>
                {authStrategy} <span style={{ opacity: 0.5 }}>×</span>
              </button>
            </div>
          )}

          <div style={{ marginTop: '4px' }}>
            {!showCustomAuth ? (
              <button
                className="btn-ghost"
                onClick={() => setShowCustomAuth(true)}
                style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={12} /> Other auth...
              </button>
            ) : (
              <form onSubmit={handleAddCustomAuth} style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                <input
                  className="input-glass"
                  type="text"
                  placeholder="e.g. Firebase Auth, Auth0, Clerk…"
                  value={customAuth}
                  onChange={(e) => setCustomAuth(e.target.value)}
                  style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                  autoFocus
                />
                <button className="btn-primary" type="submit" style={{ padding: '6px 10px', fontSize: '0.78rem' }}>Add</button>
                <button className="btn-ghost" type="button" onClick={() => { setShowCustomAuth(false); setCustomAuth('') }} style={{ padding: '6px 10px', fontSize: '0.78rem' }}>Cancel</button>
              </form>
            )}
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
