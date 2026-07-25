import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'
import QuestionCard from '../QuestionCard'
import ChipSelector from '../ChipSelector'
import useProjectStore from '@/store/useProjectStore'
import { staggerContainer, staggerItem } from '@/lib/animationVariants'

const LANGUAGE_OPTIONS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust',
  'C#', 'Swift', 'Kotlin', 'C++',
]
const TESTING_OPTIONS = ['Vitest', 'Jest', 'Playwright', 'Cypress', 'Testing Library', 'JUnit', 'PyTest', 'None']

const FILE_NAMING = ['kebab-case', 'PascalCase', 'camelCase']
const DB_NAMING = ['snake_case (plural)', 'camelCase', 'PascalCase']
const ERROR_HANDLING = [
  'Centralized try/catch',
  'Result pattern (Ok/Err)',
  'Error boundaries',
  'Custom error classes',
]

const ANTI_PATTERNS = [
  'Prop drilling', 'Monolithic components', 'Inline styles',
  'Magic strings/numbers', 'God objects', 'Circular imports',
  'Mutable global state', 'Sync blocking in render', 'console.log in prod',
  'any/unknown types', 'Unused dependencies', 'Deeply nested callbacks',
]

export default function StepRules({ onNext, onBack }) {
  const { pillars, setRules, toggleAntiPattern } = useProjectStore()
  const { language, testing, antiPatterns, extraConstraints, fileNaming, dbNaming, errorHandling } = pillars.rules
  const stack = pillars.architecture.stack || []

  // Filter languages chosen in the stack step
  const selectedLangs = stack.filter((x) => LANGUAGE_OPTIONS.includes(x))

  // Auto-sync language selection if exactly one language is selected in the Stack
  useEffect(() => {
    if (selectedLangs.length === 1) {
      if (language !== selectedLangs[0]) {
        setRules({ language: selectedLangs[0] })
      }
    } else if (selectedLangs.length === 0 && !language) {
      setRules({ language: 'TypeScript' })
    }
  }, [selectedLangs, language, setRules])

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
              background: 'linear-gradient(135deg, #f59e0b, #f97316)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <ShieldCheck size={18} color="white" />
          </div>
          <span className="badge badge-brand">Rules & Standards</span>
        </motion.div>

        <motion.div variants={staggerItem}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '6px' }}>
            Set your constraints
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
            These rules shape structural patterns in your RULES.md—SOLID, KISS, DRY baked in by default.
          </p>
        </motion.div>

        {/* Language Selection - Automatically inferred or restricted */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {selectedLangs.length === 1 ? (
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(245,158,11,0.2)',
              background: 'rgba(245,158,11,0.04)',
              fontSize: '0.82rem',
              color: 'rgba(255,255,255,0.7)',
            }}>
              Coding language inferred: <strong style={{ color: '#fbbf24' }}>{language || selectedLangs[0]}</strong> (from tech stack)
            </div>
          ) : selectedLangs.length > 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
                WHICH LANGUAGE SHOULD THE RULES FOCUS ON?
              </label>
              <ChipSelector
                options={selectedLangs}
                selected={language ? [language] : []}
                onToggle={(val) => setRules({ language: val })}
                multiSelect={false}
              />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
                PROGRAMMING LANGUAGE
              </label>
              <ChipSelector
                options={LANGUAGE_OPTIONS}
                selected={language ? [language] : []}
                onToggle={(val) => setRules({ language: val })}
                multiSelect={false}
              />
            </div>
          )}
        </motion.div>

        {/* Testing */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.07em' }}>
            TESTING FRAMEWORK
          </label>
          <ChipSelector
            options={TESTING_OPTIONS}
            selected={testing ? [testing] : []}
            onToggle={(val) => setRules({ testing: val })}
            multiSelect={false}
          />
        </motion.div>

        {/* Naming — Files */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.07em' }}>
            FILE NAMING CONVENTION
          </label>
          <ChipSelector
            options={FILE_NAMING}
            selected={fileNaming ? [fileNaming] : []}
            onToggle={(val) => setRules({ fileNaming: val })}
            multiSelect={false}
          />
        </motion.div>

        {/* DB table naming */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.07em' }}>
            DATABASE TABLE NAMING
          </label>
          <ChipSelector
            options={DB_NAMING}
            selected={dbNaming ? [dbNaming] : []}
            onToggle={(val) => setRules({ dbNaming: val })}
            multiSelect={false}
          />
        </motion.div>

        {/* Error handling */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.07em' }}>
            ERROR HANDLING STRATEGY
          </label>
          <ChipSelector
            options={ERROR_HANDLING}
            selected={errorHandling ? [errorHandling] : []}
            onToggle={(val) => setRules({ errorHandling: val })}
            multiSelect={false}
          />
        </motion.div>

        {/* Anti-patterns */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.07em' }}>
            ANTI-PATTERNS TO PROHIBIT
          </label>
          <ChipSelector
            options={ANTI_PATTERNS}
            selected={antiPatterns}
            onToggle={toggleAntiPattern}
          />
        </motion.div>

        {/* Extra constraints */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label
            htmlFor="extra-constraints"
            style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.07em' }}
          >
            ADDITIONAL CONSTRAINTS (OPTIONAL)
          </label>
          <textarea
            id="extra-constraints"
            className="input-glass"
            placeholder="e.g. 'Max 150 lines per file', 'No class components', 'All async must use TanStack Query'..."
            value={extraConstraints || ''}
            onChange={(e) => setRules({ extraConstraints: e.target.value })}
            rows={2}
          />
        </motion.div>

        <motion.div variants={staggerItem} style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-ghost" onClick={onBack} style={{ flex: 1 }}>← Back</button>
          <motion.button
            className="btn-primary"
            onClick={onNext}
            style={{ flex: 2 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>Continue →</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </QuestionCard>
  )
}
