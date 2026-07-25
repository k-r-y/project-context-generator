import { useState, useEffect } from 'react'
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
    items: ['TypeScript', 'JavaScript', 'Python', 'Java', 'Go', 'Rust', 'C#', 'Swift', 'Kotlin', 'Dart', 'C++'],
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

const FRAMEWORK_LANGUAGES = {
  'Next.js': ['TypeScript', 'JavaScript'],
  'React': ['TypeScript', 'JavaScript'],
  'Vue': ['TypeScript', 'JavaScript'],
  'Svelte': ['TypeScript', 'JavaScript'],
  'Angular': ['TypeScript', 'JavaScript'],
  'NestJS': ['TypeScript', 'JavaScript'],
  'Express': ['TypeScript', 'JavaScript'],
  'Fastify': ['TypeScript', 'JavaScript'],
  'FastAPI': ['Python'],
  'Django': ['Python'],
  'Spring Boot': ['Java'],
  'Gin': ['Go'],
  'Axum': ['Rust'],
  'ASP.NET Core': ['C#'],
  'SwiftUI': ['Swift'],
  'Jetpack Compose': ['Kotlin'],
  'React Native': ['TypeScript', 'JavaScript'],
  'Expo': ['TypeScript', 'JavaScript'],
  'Flutter': ['Dart'],
}

const PLATFORM_RESTRICTIONS = {
  'iOS': {
    languages: ['Swift', 'TypeScript', 'JavaScript', 'Dart', 'C++', 'Rust'],
    frameworks: ['SwiftUI', 'React Native', 'Expo', 'Flutter'],
  },
  'Android': {
    languages: ['Kotlin', 'Java', 'TypeScript', 'JavaScript', 'Dart', 'C++', 'Rust'],
    frameworks: ['Jetpack Compose', 'React Native', 'Expo', 'Flutter'],
  },
  'Web': {
    languages: ['TypeScript', 'JavaScript', 'Python', 'Java', 'Go', 'Rust', 'C#', 'Dart'],
    frameworks: ['Next.js', 'React', 'Vue', 'Svelte', 'Angular', 'NestJS', 'Express', 'Fastify', 'FastAPI', 'Django', 'Spring Boot', 'Gin', 'Axum', 'ASP.NET Core'],
  },
  'Desktop': {
    languages: ['C#', 'C++', 'Rust', 'TypeScript', 'JavaScript', 'Java', 'Swift', 'Kotlin'],
    frameworks: ['React', 'Vue', 'Svelte', 'ASP.NET Core', 'SwiftUI', 'Jetpack Compose'],
  },
  'Cloud': {
    languages: ['TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Java', 'C#', 'C++'],
    frameworks: ['NestJS', 'Express', 'Fastify', 'FastAPI', 'Django', 'Spring Boot', 'Gin', 'Axum', 'ASP.NET Core'],
  }
}


export default function StepStack({ onNext, onBack }) {
  const { projectMeta, pillars, setArchitecture } = useProjectStore()
  const selected = pillars.architecture.stack || []
  const [customInput, setCustomInput] = useState('')
  const [showCustom, setShowCustom] = useState(false)

  const currentPlatform = projectMeta.platform
  const restrictions = PLATFORM_RESTRICTIONS[currentPlatform]

  // Filter available languages and frameworks based on platform
  const languages = restrictions?.languages 
    ? STACK_CATEGORIES[0].items.filter(x => restrictions.languages.includes(x)) 
    : STACK_CATEGORIES[0].items

  const frameworks = restrictions?.frameworks 
    ? STACK_CATEGORIES[1].items.filter(x => restrictions.frameworks.includes(x)) 
    : STACK_CATEGORIES[1].items

  // Auto-deselect items that are no longer allowed for the current platform
  useEffect(() => {
    if (!restrictions) return
    const validStack = selected.filter(item => {
      // If it's a language but not in the restricted list, drop it
      if (STACK_CATEGORIES[0].items.includes(item) && !languages.includes(item)) return false
      // If it's a framework but not in the restricted list, drop it
      if (STACK_CATEGORIES[1].items.includes(item) && !frameworks.includes(item)) return false
      return true
    })
    
    if (validStack.length !== selected.length) {
      setArchitecture({ stack: validStack })
    }
  }, [currentPlatform]) // Run when platform changes


  // Helper to get selected languages
  const getSelectedLanguages = (currentStack) => {
    return currentStack.filter((x) => languages.includes(x))
  }

  const handleToggle = (item) => {
    const isAdding = !selected.includes(item)
    let nextStack = selected.includes(item)
      ? selected.filter((x) => x !== item)
      : [...selected, item]

    if (languages.includes(item)) {
      // Toggle language
      if (!isAdding) {
        // Deselecting language: Remove frameworks that require this language
        // unless they are satisfied by another selected language
        const remainingLangs = getSelectedLanguages(nextStack)
        nextStack = nextStack.filter((x) => {
          if (!frameworks.includes(x)) return true
          const reqLangs = FRAMEWORK_LANGUAGES[x]
          if (!reqLangs) return true
          // If no remaining languages satisfy this framework, deselect it
          return reqLangs.some((l) => remainingLangs.includes(l))
        })
      }
    } else if (frameworks.includes(item)) {
      // Toggle framework
      if (isAdding) {
        // Selecting a framework: Auto-select default language if none is selected
        const reqLangs = FRAMEWORK_LANGUAGES[item]
        if (reqLangs) {
          const currentLangs = getSelectedLanguages(selected)
          const isSatisfied = reqLangs.some((l) => currentLangs.includes(l))
          if (!isSatisfied) {
            // Auto add the first compatible language (prefer TypeScript for JS/TS stack)
            const defaultLang = reqLangs.includes('TypeScript') ? 'TypeScript' : reqLangs[0]
            if (!nextStack.includes(defaultLang)) {
              nextStack.push(defaultLang)
            }
          }
        }
      }
    }

    setArchitecture({ stack: nextStack })
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

  // Calculate disabled frameworks
  const selectedLangs = getSelectedLanguages(selected)
  const disabledFrameworks = selectedLangs.length === 0
    ? []
    : frameworks.filter((fw) => {
        const reqLangs = FRAMEWORK_LANGUAGES[fw]
        if (!reqLangs) return false
        return !reqLangs.some((l) => selectedLangs.includes(l))
      })

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
            Select your languages and tools. Framework choices adapt dynamically based on your programming language choices.
          </p>
        </motion.div>

        {/* Grouped stack options */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {STACK_CATEGORIES.map((category) => {
            const isFrameworkCat = category.id === 'frameworks'
            const isLanguageCat = category.id === 'languages'
            
            let visibleItems = category.items
            if (isLanguageCat && restrictions?.languages) {
              visibleItems = visibleItems.filter(x => restrictions.languages.includes(x))
            } else if (isFrameworkCat && restrictions?.frameworks) {
              visibleItems = visibleItems.filter(x => restrictions.frameworks.includes(x))
            }

            if (visibleItems.length === 0) return null

            return (
              <div key={category.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
                  {category.title.toUpperCase()}
                </label>
                <ChipSelector
                  options={visibleItems}
                  selected={selected.filter((x) => visibleItems.includes(x))}
                  onToggle={handleToggle}
                  disabledOptions={isFrameworkCat ? disabledFrameworks : []}
                />
              </div>
            )
          })}

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
