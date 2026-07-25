import { useState } from 'react'
import { motion } from 'framer-motion'
import { Layers, Plus } from 'lucide-react'
import QuestionCard from '../QuestionCard'
import ChipSelector from '../ChipSelector'
import useProjectStore from '@/store/useProjectStore'
import { staggerContainer, staggerItem } from '@/lib/animationVariants'

const STACK_CATEGORIES = [
  {
    id: 'languages',
    title: 'Programming Languages',
    items: ['TypeScript', 'JavaScript', 'Python', 'Java', 'Go', 'Rust', 'C#', 'Swift', 'Kotlin', 'C++'],
  },
  {
    id: 'frameworks',
    title: 'Frameworks & Runtimes',
    items: [
      'Next.js', 'React', 'Vue', 'Svelte', 'Angular', 'NestJS',
      'Express', 'Fastify', 'FastAPI', 'Django', 'Spring Boot',
      'Gin', 'Axum', 'ASP.NET Core', 'SwiftUI', 'Jetpack Compose',
      'React Native', 'Expo', 'Flutter',
    ],
  },
  {
    id: 'databases',
    title: 'Databases, ORMs & Data Layers',
    items: [
      'PostgreSQL', 'MySQL', 'SQLite', 'MongoDB', 'Redis',
      'Supabase', 'Firebase', 'Prisma', 'Drizzle', 'Hibernate',
      'SQLAlchemy', 'GORM',
    ],
  },
  {
    id: 'infra',
    title: 'Cloud & Infrastructure',
    items: [
      'Vercel', 'Netlify', 'Railway', 'Fly.io', 'AWS',
      'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions',
    ],
  },
  {
    id: 'apis',
    title: 'APIs & Protocols',
    items: ['REST', 'GraphQL', 'tRPC', 'gRPC', 'WebSockets'],
  },
]

export default function StepStack({ onNext, onBack }) {
  const { projectMeta, pillars, setArchitecture } = useProjectStore()
  const selected = pillars.architecture.stack || []
  const [customInput, setCustomInput] = useState('')
  const [showCustom, setShowCustom] = useState(false)

  const handleToggle = (item) => {
    const next = selected.includes(item)
      ? selected.filter((x) => x !== item)
      : [...selected, item]
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
            Select your languages, frameworks, and tools. We've customized suggestions based on your target platform:{' '}
            <strong style={{ color: 'white' }}>{projectMeta.platform}</strong>.
          </p>
        </motion.div>

        {/* Grouped stack options */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {STACK_CATEGORIES.map((category) => (
            <div key={category.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
                {category.title.toUpperCase()}
              </label>
              <ChipSelector
                options={category.items}
                selected={selected.filter((x) => category.items.includes(x))}
                onToggle={handleToggle}
              />
            </div>
          ))}

          {/* Render custom selected stack items that are not in default categories */}
          {selected.filter((x) => !STACK_CATEGORIES.some((c) => c.items.includes(x))).length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
                CUSTOM TECHNOLOGIES
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {selected
                  .filter((x) => !STACK_CATEGORIES.some((c) => c.items.includes(x)))
                  .map((item) => (
                    <button
                      key={item}
                      className="chip chip-active"
                      onClick={() => handleToggle(item)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                      type="button"
                    >
                      {item} <span style={{ opacity: 0.5 }}>×</span>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Add custom item */}
          <div style={{ marginTop: '4px' }}>
            {!showCustom ? (
              <button
                className="btn-ghost"
                onClick={() => setShowCustom(true)}
                style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                type="button"
              >
                <Plus size={13} /> Add other tech...
              </button>
            ) : (
              <form onSubmit={handleAddCustom} style={{ display: 'flex', gap: '6px' }}>
                <input
                  className="input-glass"
                  type="text"
                  placeholder="Enter tech name (e.g. NestJS, PyTorch, Spring Boot...)"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                  autoFocus
                />
                <button className="btn-primary" type="submit" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>
                  Add
                </button>
                <button
                  className="btn-ghost"
                  type="button"
                  onClick={() => {
                    setShowCustom(false)
                    setCustomInput('')
                  }}
                  style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        </motion.div>

        {/* Selected Summary */}
        {selected.length > 0 && (
          <motion.div
            variants={staggerItem}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(139,92,246,0.06)',
              border: '1px solid rgba(139,92,246,0.15)',
              fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            ✓ Selected: <strong style={{ color: '#c4b5fd' }}>{selected.join(', ')}</strong>
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
