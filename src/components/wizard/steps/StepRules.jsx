import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Plus } from 'lucide-react'
import QuestionCard from '../QuestionCard'
import ChipSelector from '../ChipSelector'
import useProjectStore from '@/store/useProjectStore'
import { staggerContainer, staggerItem } from '@/lib/animationVariants'

const LANGUAGE_OPTIONS = [
  'JavaScript', 'TypeScript', 'Python', 'PHP', 'Java', 'Ruby', 'Go', 'Rust',
  'C#', 'Swift', 'Kotlin', 'C++',
]
const TESTING_OPTIONS = ['Vitest', 'Jest', 'Playwright', 'Cypress', 'Testing Library', 'JUnit', 'PyTest', 'PHPUnit', 'Pest', 'RSpec', 'None']


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
  'any/unknown types', 'Unused dependencies', 'Deeply nested callbacks', 'None'
]

export default function StepRules({ onNext, onBack }) {
  const { pillars, setRules, toggleAntiPattern } = useProjectStore()
  const { language, testing, antiPatterns = [], extraConstraints, fileNaming, dbNaming, errorHandling } = pillars.rules
  const stack = pillars.architecture.stack || []

  // Local state for PRD-style custom item addition forms
  const [showCustomTesting, setShowCustomTesting] = useState(false)
  const [customTestingInput, setCustomTestingInput] = useState('')

  const [showCustomFileNaming, setShowCustomFileNaming] = useState(false)
  const [customFileNamingInput, setCustomFileNamingInput] = useState('')

  const [showCustomDbNaming, setShowCustomDbNaming] = useState(false)
  const [customDbNamingInput, setCustomDbNamingInput] = useState('')

  const [showCustomErrorHandling, setShowCustomErrorHandling] = useState(false)
  const [customErrorHandlingInput, setCustomErrorHandlingInput] = useState('')

  const [showCustomAntiPattern, setShowCustomAntiPattern] = useState(false)
  const [customAntiPatternInput, setCustomAntiPatternInput] = useState('')

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

  const canProceed = 
    !!language &&
    !!testing &&
    antiPatterns.length > 0 &&
    (extraConstraints !== undefined && extraConstraints !== null) &&
    !!fileNaming &&
    !!dbNaming &&
    !!errorHandling

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

        {/* Language Selection */}
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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {TESTING_OPTIONS.map((opt) => {
              const isActive = testing === opt
              return (
                <button
                  key={opt}
                  type="button"
                  className={`chip ${isActive ? 'chip-active' : ''}`}
                  onClick={() => setRules({ testing: opt })}
                >
                  {opt}
                </button>
              )
            })}
            {testing && !TESTING_OPTIONS.includes(testing) && (
              <button
                type="button"
                className="chip chip-active"
                onClick={() => setRules({ testing: '' })}
              >
                {testing} <span style={{ opacity: 0.6, marginLeft: '2px' }}>×</span>
              </button>
            )}
          </div>

          <div style={{ marginTop: '2px' }}>
            {!showCustomTesting ? (
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setShowCustomTesting(true)}
                style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={12} /> Other testing framework...
              </button>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const val = customTestingInput.trim()
                  if (val) {
                    setRules({ testing: val })
                    setCustomTestingInput('')
                    setShowCustomTesting(false)
                  }
                }}
                style={{ display: 'flex', gap: '6px', marginTop: '4px' }}
              >
                <input
                  className="input-glass"
                  type="text"
                  placeholder="e.g. Mocha, RSpec, Karma…"
                  value={customTestingInput}
                  onChange={(e) => setCustomTestingInput(e.target.value)}
                  style={{ padding: '6px 10px', fontSize: '0.78rem', flex: 1 }}
                  autoFocus
                />
                <button className="btn-primary" type="submit" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>Add</button>
                <button className="btn-ghost" type="button" onClick={() => { setShowCustomTesting(false); setCustomTestingInput('') }} style={{ padding: '6px 10px', fontSize: '0.78rem' }}>Cancel</button>
              </form>
            )}
          </div>
        </motion.div>

        {/* Naming — Files */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.07em' }}>
            FILE NAMING CONVENTION
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {FILE_NAMING.map((opt) => {
              const isActive = fileNaming === opt
              return (
                <button
                  key={opt}
                  type="button"
                  className={`chip ${isActive ? 'chip-active' : ''}`}
                  onClick={() => setRules({ fileNaming: opt })}
                >
                  {opt}
                </button>
              )
            })}
            {fileNaming && !FILE_NAMING.includes(fileNaming) && (
              <button
                type="button"
                className="chip chip-active"
                onClick={() => setRules({ fileNaming: '' })}
              >
                {fileNaming} <span style={{ opacity: 0.6, marginLeft: '2px' }}>×</span>
              </button>
            )}
          </div>

          <div style={{ marginTop: '2px' }}>
            {!showCustomFileNaming ? (
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setShowCustomFileNaming(true)}
                style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={12} /> Other file naming convention...
              </button>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const val = customFileNamingInput.trim()
                  if (val) {
                    setRules({ fileNaming: val })
                    setCustomFileNamingInput('')
                    setShowCustomFileNaming(false)
                  }
                }}
                style={{ display: 'flex', gap: '6px', marginTop: '4px' }}
              >
                <input
                  className="input-glass"
                  type="text"
                  placeholder="e.g. snake_case, UPPER_CASE…"
                  value={customFileNamingInput}
                  onChange={(e) => setCustomFileNamingInput(e.target.value)}
                  style={{ padding: '6px 10px', fontSize: '0.78rem', flex: 1 }}
                  autoFocus
                />
                <button className="btn-primary" type="submit" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>Add</button>
                <button className="btn-ghost" type="button" onClick={() => { setShowCustomFileNaming(false); setCustomFileNamingInput('') }} style={{ padding: '6px 10px', fontSize: '0.78rem' }}>Cancel</button>
              </form>
            )}
          </div>
        </motion.div>

        {/* DB table naming */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.07em' }}>
            DATABASE TABLE NAMING
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {DB_NAMING.map((opt) => {
              const isActive = dbNaming === opt
              return (
                <button
                  key={opt}
                  type="button"
                  className={`chip ${isActive ? 'chip-active' : ''}`}
                  onClick={() => setRules({ dbNaming: opt })}
                >
                  {opt}
                </button>
              )
            })}
            {dbNaming && !DB_NAMING.includes(dbNaming) && (
              <button
                type="button"
                className="chip chip-active"
                onClick={() => setRules({ dbNaming: '' })}
              >
                {dbNaming} <span style={{ opacity: 0.6, marginLeft: '2px' }}>×</span>
              </button>
            )}
          </div>

          <div style={{ marginTop: '2px' }}>
            {!showCustomDbNaming ? (
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setShowCustomDbNaming(true)}
                style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={12} /> Other DB naming convention...
              </button>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const val = customDbNamingInput.trim()
                  if (val) {
                    setRules({ dbNaming: val })
                    setCustomDbNamingInput('')
                    setShowCustomDbNaming(false)
                  }
                }}
                style={{ display: 'flex', gap: '6px', marginTop: '4px' }}
              >
                <input
                  className="input-glass"
                  type="text"
                  placeholder="e.g. snake_case (singular), TitleCase…"
                  value={customDbNamingInput}
                  onChange={(e) => setCustomDbNamingInput(e.target.value)}
                  style={{ padding: '6px 10px', fontSize: '0.78rem', flex: 1 }}
                  autoFocus
                />
                <button className="btn-primary" type="submit" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>Add</button>
                <button className="btn-ghost" type="button" onClick={() => { setShowCustomDbNaming(false); setCustomDbNamingInput('') }} style={{ padding: '6px 10px', fontSize: '0.78rem' }}>Cancel</button>
              </form>
            )}
          </div>
        </motion.div>

        {/* Error handling */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.07em' }}>
            ERROR HANDLING STRATEGY
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {ERROR_HANDLING.map((opt) => {
              const isActive = errorHandling === opt
              return (
                <button
                  key={opt}
                  type="button"
                  className={`chip ${isActive ? 'chip-active' : ''}`}
                  onClick={() => setRules({ errorHandling: opt })}
                >
                  {opt}
                </button>
              )
            })}
            {errorHandling && !ERROR_HANDLING.includes(errorHandling) && (
              <button
                type="button"
                className="chip chip-active"
                onClick={() => setRules({ errorHandling: '' })}
              >
                {errorHandling} <span style={{ opacity: 0.6, marginLeft: '2px' }}>×</span>
              </button>
            )}
          </div>

          <div style={{ marginTop: '2px' }}>
            {!showCustomErrorHandling ? (
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setShowCustomErrorHandling(true)}
                style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={12} /> Other error handling strategy...
              </button>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const val = customErrorHandlingInput.trim()
                  if (val) {
                    setRules({ errorHandling: val })
                    setCustomErrorHandlingInput('')
                    setShowCustomErrorHandling(false)
                  }
                }}
                style={{ display: 'flex', gap: '6px', marginTop: '4px' }}
              >
                <input
                  className="input-glass"
                  type="text"
                  placeholder="e.g. Monadic error handling, Global error middleware…"
                  value={customErrorHandlingInput}
                  onChange={(e) => setCustomErrorHandlingInput(e.target.value)}
                  style={{ padding: '6px 10px', fontSize: '0.78rem', flex: 1 }}
                  autoFocus
                />
                <button className="btn-primary" type="submit" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>Add</button>
                <button className="btn-ghost" type="button" onClick={() => { setShowCustomErrorHandling(false); setCustomErrorHandlingInput('') }} style={{ padding: '6px 10px', fontSize: '0.78rem' }}>Cancel</button>
              </form>
            )}
          </div>
        </motion.div>

        {/* Anti-patterns */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.07em' }}>
            ANTI-PATTERNS TO PROHIBIT
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {ANTI_PATTERNS.map((opt) => {
              const isActive = antiPatterns.includes(opt)
              return (
                <button
                  key={opt}
                  type="button"
                  className={`chip ${isActive ? 'chip-active' : ''}`}
                  onClick={() => toggleAntiPattern(opt)}
                >
                  {opt}
                </button>
              )
            })}
            {antiPatterns.filter(x => !ANTI_PATTERNS.includes(x)).map((customAntiPattern) => (
              <button
                key={customAntiPattern}
                type="button"
                className="chip chip-active"
                onClick={() => toggleAntiPattern(customAntiPattern)}
              >
                {customAntiPattern} <span style={{ opacity: 0.6, marginLeft: '2px' }}>×</span>
              </button>
            ))}
          </div>

          <div style={{ marginTop: '2px' }}>
            {!showCustomAntiPattern ? (
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setShowCustomAntiPattern(true)}
                style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={12} /> Other anti-pattern...
              </button>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const val = customAntiPatternInput.trim()
                  if (val && !antiPatterns.includes(val)) {
                    toggleAntiPattern(val)
                    setCustomAntiPatternInput('')
                    setShowCustomAntiPattern(false)
                  }
                }}
                style={{ display: 'flex', gap: '6px', marginTop: '4px' }}
              >
                <input
                  className="input-glass"
                  type="text"
                  placeholder="e.g. Hardcoded API endpoints, Nested ternary operators…"
                  value={customAntiPatternInput}
                  onChange={(e) => setCustomAntiPatternInput(e.target.value)}
                  style={{ padding: '6px 10px', fontSize: '0.78rem', flex: 1 }}
                  autoFocus
                />
                <button className="btn-primary" type="submit" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>Add</button>
                <button className="btn-ghost" type="button" onClick={() => { setShowCustomAntiPattern(false); setCustomAntiPatternInput('') }} style={{ padding: '6px 10px', fontSize: '0.78rem' }}>Cancel</button>
              </form>
            )}
          </div>
        </motion.div>

        {/* Extra constraints */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label
              htmlFor="extra-constraints"
              style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.07em' }}
            >
              ADDITIONAL CONSTRAINTS
            </label>
            <button 
              type="button" 
              className="btn-ghost" 
              style={{ padding: '2px 6px', fontSize: '0.65rem' }}
              onClick={() => setRules({ extraConstraints: 'None' })}
            >
              None
            </button>
          </div>
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
            disabled={!canProceed}
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
