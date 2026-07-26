import { useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import ProgressBar from './ProgressBar'
import LivePreview from './LivePreview'
import StepWelcome from './steps/StepWelcome'
import StepPRD from './steps/StepPRD'
import StepStack from './steps/StepStack'
import StepRendering from './steps/StepRendering'
import StepDesignVibe from './steps/StepDesignVibe'
import StepDatabase from './steps/StepDatabase'
import StepRules from './steps/StepRules'
import StepReview from './steps/StepReview'
import useProjectStore from '@/store/useProjectStore'
import SpotlightCard from '@/components/ui/SpotlightCard'
import { synthesizeAll } from '@/lib/synthesize'
import { slideVariants, slideTransition } from '@/lib/animationVariants'

const STEP_LABELS = ['Welcome', 'PRD', 'Stack', 'Architecture', 'Design', 'Data', 'Rules', 'Review']
const STEPS = [StepWelcome, StepPRD, StepStack, StepRendering, StepDesignVibe, StepDatabase, StepRules, StepReview]

export default function WizardShell() {
  const navigate = useNavigate()
  const {
    currentStep, nextStep, prevStep,
    projectMeta, pillars,
    apiKey, outputMode,
    setAllOutputs, setGenerating, setGenerationError,
    isGenerating,
  } = useProjectStore()

  const [progressLabel, setProgressLabel] = useState('')
  const directionRef = useRef(1)
  const StepComponent = STEPS[currentStep]

  const handleNext = () => { directionRef.current = 1; nextStep() }
  const handleBack = () => { directionRef.current = -1; prevStep() }

  const handleSubmit = async () => {
    setGenerating(true)
    setGenerationError(null)
    try {
      const answers = { meta: projectMeta, pillars }
      const outputs = await synthesizeAll(answers, outputMode, apiKey, (label, idx, total) => {
        setProgressLabel(`${label} (${idx}/${total})`)
      })
      setAllOutputs(outputs)
      navigate('/dashboard')
    } catch (err) {
      setGenerationError(err.message || 'Generation failed.')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Top bar */}
      <header style={{
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--color-border)',
        gap: '12px',
      }}>
        <span style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>
          PCG
        </span>

        {/* Step labels - hidden on mobile */}
        <nav className="wizard-nav" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {STEP_LABELS.map((label, i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{
                fontSize: '0.75rem',
                color: i === currentStep
                  ? 'var(--color-text-primary)'
                  : i < currentStep
                  ? 'var(--color-text-muted)'
                  : 'var(--color-text-muted)',
                fontWeight: i === currentStep ? 600 : 400,
                opacity: i > currentStep ? 0.4 : 1,
              }}>
                {label}
              </span>
              {i < STEP_LABELS.length - 1 && (
                <span style={{ color: 'var(--color-border-hover)', fontSize: '0.65rem' }}>›</span>
              )}
            </div>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className="btn-ghost"
            onClick={() => {
              if (window.confirm('Start over? This will clear all current answers.')) {
                useProjectStore.getState().reset()
                navigate('/')
              }
            }}
            style={{ fontSize: '0.8rem' }}
          >
            Start over
          </button>
          <button
            className="btn-ghost"
            onClick={() => navigate('/')}
            aria-label="Exit wizard"
            style={{ padding: '4px' }}
          >
            <X size={15} />
          </button>
        </div>
      </header>

      {/* Progress line */}
      <ProgressBar current={currentStep} total={STEPS.length} labels={STEP_LABELS} />

      {/* Main */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: 0,
        overflow: 'hidden',
      }} className="wizard-layout">

        {/* Step area */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '32px 16px',
          borderRight: '1px solid var(--color-border)',
          position: 'relative',
          overflowY: 'auto',
        }} className="wizard-step-area">
          {/* Generating overlay */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'absolute', inset: 0, zIndex: 10, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  background: 'var(--color-bg)',
                }}
              >
                <div style={{ textAlign: 'center', maxWidth: '320px' }}>
                  <div style={{
                    width: '32px', height: '32px',
                    border: '2px solid var(--color-border-hover)',
                    borderTopColor: 'var(--color-accent)',
                    borderRadius: '50%',
                    animation: 'spin 0.9s linear infinite',
                    margin: '0 auto 20px',
                  }} />
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '8px', letterSpacing: '-0.01em' }}>
                    Generating context files
                  </div>
                  <motion.div
                    key={progressLabel}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}
                  >
                    {progressLabel || 'Initializing…'}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence custom={directionRef.current} mode="wait">
            <motion.div
              key={currentStep}
              custom={directionRef.current}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
              className="transform-gpu"
              style={{ width: '100%', maxWidth: '540px' }}
            >
              <SpotlightCard style={{ padding: '24px', borderRadius: '16px' }}>
                <StepComponent onNext={handleNext} onBack={handleBack} onSubmit={handleSubmit} />
              </SpotlightCard>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Live preview */}
        <div className="live-preview-panel" style={{ overflowY: 'auto' }}>
          <LivePreview />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .wizard-nav { display: none !important; }
        }
        @media (max-width: 900px) {
          .wizard-layout { grid-template-columns: 1fr !important; }
          .live-preview-panel { display: none !important; }
          .wizard-step-area { border-right: none !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
