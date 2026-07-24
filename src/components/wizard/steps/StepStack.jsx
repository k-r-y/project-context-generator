import { useState } from 'react'
import { motion } from 'framer-motion'
import { Layers, Plus } from 'lucide-react'
import QuestionCard from '../QuestionCard'
import ChipSelector from '../ChipSelector'
import useProjectStore from '@/store/useProjectStore'
import { staggerContainer, staggerItem } from '@/lib/animationVariants'

// Platform-dependent presets
const WEB_STACK = [
  'React', 'Vue', 'Svelte', 'Angular', 'Next.js', 'Nuxt',
  'Vite', 'Remix', 'Astro', 'Tailwind CSS', 'Shadcn/ui',
  'Zustand', 'Redux', 'TanStack Query', 'Node.js', 'Express',
  'Fastify', 'Hono', 'tRPC', 'GraphQL', 'REST', 'Prisma', 'Drizzle',
]

const MOBILE_STACK = [
  'React Native', 'Expo', 'Flutter', 'Swift (UIKit)', 'SwiftUI',
  'Kotlin (XML)', 'Jetpack Compose', 'Objective-C', 'Java',
  'Capacitor', 'Cordova', 'Firebase Auth', 'Zustand', 'Redux',
  'SQLite', 'Realm', 'CoreData', 'REST', 'GraphQL',
]

const CLOUD_STACK = [
  'Node.js', 'Go', 'Python', 'Rust', 'Java', 'C#',
  'Express', 'Fastify', 'Gin', 'FastAPI', 'Spring Boot', 'ASP.NET Core',
  'Docker', 'Kubernetes', 'Terraform', 'Serverless Framework',
  'AWS Lambda', 'Google Cloud Functions', 'gRPC', 'GraphQL', 'REST',
]

const OTHER_STACK = [
  'Python', 'C++', 'Go', 'Rust', 'Electron', 'Tauri', 'Qt',
  'Postgres', 'SQLite', 'REST', 'gRPC',
]

export default function StepStack({ onNext, onBack }) {
  const { projectMeta, pillars, setArchitecture } = useProjectStore()
  const selected = pillars.architecture.stack
  const [customInput, setCustomInput] = useState('')
  const [showCustom, setShowCustom] = useState(false)

  // Resolve stack list based on platform
  const getOptions = () => {
    const p = (projectMeta.platform || '').toLowerCase()
    if (p.includes('web')) return WEB_STACK
    if (p.includes('ios') || p.includes('android') || p.includes('mobile')) return MOBILE_STACK
    if (p.includes('cloud')) return CLOUD_STACK
    return OTHER_STACK
  }

  const stackOptions = getOptions()

  const handleToggle = (item) => {
    const next = selected.includes(item) ? selected.filter((x) => x !== item) : [...selected, item]
    setArchitecture({ stack: next })
  }

  const handleAddCustom = (e) => {
    e.preventDefault()
    const trimmed = customInput.trim()
    if (trimmed && !selected.includes(trimmed)) {
      setArchitecture({ stack: [...selected, trimmed] })
      setCustomInput('')
      setShowCustom(false)
    }
  }

  const canProceed = selected.length > 0

  return (
    <QuestionCard>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
      >
        {/* Header */}
        <motion.div variants={staggerItem} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px', height: '36px', borderRadius: '9px',
              background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Layers size={18} color="white" />
          </div>
          <span className="badge badge-brand">Tech Stack</span>
        </motion.div>

        <motion.div variants={staggerItem}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '6px' }}>
            What's powering your app?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
            Select all technologies you'll be using. Showing target choices for{' '}
            <strong style={{ color: 'white' }}>{projectMeta.platform}</strong>.
          </p>
        </motion.div>

        {/* Chips */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <ChipSelector
            options={stackOptions}
            selected={selected.filter(x => stackOptions.includes(x))}
            onToggle={handleToggle}
          />

          {/* Render custom selected stack items that are not in the default options list */}
          {selected.filter(x => !stackOptions.includes(x)).length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
              {selected.filter(x => !stackOptions.includes(x)).map(item => (
                <button
                  key={item}
                  className="chip chip-active"
                  onClick={() => handleToggle(item)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  {item} <span style={{ opacity: 0.5 }}>×</span>
                </button>
              ))}
            </div>
          )}

          {/* Add custom item */}
          <div style={{ marginTop: '8px' }}>
            {!showCustom ? (
              <button
                className="btn-ghost"
                onClick={() => setShowCustom(true)}
                style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={13} /> Add other tech...
              </button>
            ) : (
              <form onSubmit={handleAddCustom} style={{ display: 'flex', gap: '6px' }}>
                <input
                  className="input-glass"
                  type="text"
                  placeholder="Enter tech name (e.g. Capacitor, NestJS, Spring Boot…)"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                  autoFocus
                />
                <button className="btn-primary" type="submit" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>
                  Add
                </button>
                <button className="btn-ghost" type="button" onClick={() => { setShowCustom(false); setCustomInput('') }} style={{ padding: '8px 12px', fontSize: '0.8rem' }}>
                  Cancel
                </button>
              </form>
            )}
          </div>
        </motion.div>

        {/* Selected count */}
        {selected.length > 0 && (
          <motion.div
            variants={staggerItem}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.2)',
              fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            ✓ Selected: <strong style={{ color: '#a5b8fc' }}>{selected.join(', ')}</strong>
          </motion.div>
        )}

        {/* Nav */}
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
