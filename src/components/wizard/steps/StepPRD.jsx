import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash } from 'lucide-react'
import QuestionCard from '../QuestionCard'
import useProjectStore from '@/store/useProjectStore'
import { staggerContainer, staggerItem } from '@/lib/animationVariants'

export default function StepPRD({ onNext, onBack }) {
  const { projectMeta, setMeta } = useProjectStore()
  const [customAudience, setCustomAudience] = useState('')
  const [showCustomAudience, setShowCustomAudience] = useState(false)

  // Local helper states for list additions
  const [newGoal, setNewGoal] = useState('')
  const [newMetric, setNewMetric] = useState('')
  const [newFeature, setNewFeature] = useState('')
  const [newFutureFeature, setNewFutureFeature] = useState('')

  const AUDIENCE_OPTIONS = [
    'Developers / Technical Users',
    'Product Managers',
    'E-commerce Teams / Store Owners',
    'General Consumers / Public',
    'Enterprise Administrators',
  ]

  // Parse comma/newline-delimited text into array for local edit, save back as unified string
  const getArray = (val) => val.split('\n').map(x => x.trim()).filter(Boolean)
  const setArray = (arr) => arr.join('\n')

  const audiences = getArray(projectMeta.targetAudience)

  const handleAudienceToggle = (val) => {
    if (audiences.includes(val)) {
      setMeta({ targetAudience: setArray(audiences.filter(x => x !== val)) })
    } else {
      setMeta({ targetAudience: setArray([...audiences, val]) })
    }
  }

  const handleCustomAudienceAdd = (e) => {
    e.preventDefault()
    if (customAudience.trim() && !audiences.includes(customAudience.trim())) {
      setMeta({ targetAudience: setArray([...audiences, customAudience.trim()]) })
      setCustomAudience('')
      setShowCustomAudience(false)
    }
  }

  const addItem = (field, currentVal, itemToAdd, setInputState) => {
    if (!itemToAdd.trim()) return
    const arr = getArray(currentVal)
    if (!arr.includes(itemToAdd.trim())) {
      setMeta({ [field]: setArray([...arr, itemToAdd.trim()]) })
    }
    setInputState('')
  }

  const removeItem = (field, currentVal, itemToRemove) => {
    const arr = getArray(currentVal).filter(x => x !== itemToRemove)
    setMeta({ [field]: setArray(arr) })
  }

  const goals = getArray(projectMeta.businessGoals)
  const metrics = getArray(projectMeta.successMetrics)
  const features = getArray(projectMeta.mvpFeatures)
  const futureFeatures = getArray(projectMeta.outOfScope)

  const canProceed =
    audiences.length > 0 &&
    projectMeta.problemToSolve.trim().length > 0 &&
    goals.length > 0 &&
    metrics.length > 0 &&
    features.length > 0 &&
    futureFeatures.length > 0

  return (
    <QuestionCard>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
      >
        <motion.div variants={staggerItem}>
          <div className="label-xs" style={{ marginBottom: '12px' }}>Step 2 — Product Requirements (PRD)</div>
          <h1 className="heading-lg" style={{ marginBottom: '8px' }}>
            Define the project scope
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.65 }}>
            Help prevent feature creep by laying down target audience, goals, and MVP limits.
          </p>
        </motion.div>

        {/* Target Audience */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label className="label-xs">Target Audience</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {AUDIENCE_OPTIONS.map((opt) => {
              const isActive = audiences.includes(opt)
              return (
                <button
                  key={opt}
                  type="button"
                  className={`chip ${isActive ? 'chip-active' : ''}`}
                  onClick={() => handleAudienceToggle(opt)}
                >
                  {opt}
                </button>
              )
            })}
          </div>

          {audiences.filter(a => !AUDIENCE_OPTIONS.includes(a)).map((customVal) => (
            <div key={customVal} style={{ marginTop: '4px', display: 'inline-block', marginRight: '6px' }}>
              <button
                type="button"
                className="chip chip-active"
                onClick={() => handleAudienceToggle(customVal)}
              >
                {customVal} <span style={{ opacity: 0.5 }}>×</span>
              </button>
            </div>
          ))}

          <div style={{ marginTop: '4px' }}>
            {!showCustomAudience ? (
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setShowCustomAudience(true)}
                style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={12} /> Other audience...
              </button>
            ) : (
              <form onSubmit={handleCustomAudienceAdd} style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                <input
                  className="input-glass"
                  type="text"
                  placeholder="e.g. Design engineers, Content editors…"
                  value={customAudience}
                  onChange={(e) => setCustomAudience(e.target.value)}
                  style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                  autoFocus
                />
                <button className="btn-primary" type="submit" style={{ padding: '6px 10px', fontSize: '0.78rem' }}>Add</button>
                <button className="btn-ghost" type="button" onClick={() => { setShowCustomAudience(false); setCustomAudience('') }} style={{ padding: '6px 10px', fontSize: '0.78rem' }}>Cancel</button>
              </form>
            )}
          </div>
        </motion.div>

        {/* Problem to Solve */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label htmlFor="problem-to-solve" className="label-xs">
              What problem does the project want to solve?
            </label>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                type="button" 
                className="btn-ghost" 
                style={{ padding: '2px 6px', fontSize: '0.65rem' }}
                onClick={() => setMeta({ problemToSolve: 'None' })}
              >
                None
              </button>
            
              {projectMeta.problemToSolve.length}/1000
            </span>
          </div>
          <textarea
            id="problem-to-solve"
            className="input-glass"
            placeholder="e.g. Users currently have to manually aggregate data from 5 different sources..."
            value={projectMeta.problemToSolve}
            onChange={(e) => setMeta({ problemToSolve: e.target.value })}
            rows={3}
            maxLength={1000}
          />
        </motion.div>

        {/* Business Goals (Multi-Entry) */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="label-xs">Business Goals</label>
            <button 
              type="button" 
              className="btn-ghost" 
              style={{ padding: '2px 6px', fontSize: '0.65rem' }}
              onClick={() => { if (!goals.includes('None')) setMeta({ businessGoals: setArray([...goals, 'None']) }) }}
            >
              Add None
            </button>
          </div>
          {goals.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '4px' }}>
              {goals.map(g => (
                <div key={g} style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', padding: '6px 8px', background: 'var(--color-bg-muted)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.8rem', flex: 1 }}>{g}</span>
                  <button type="button" className="btn-ghost" style={{ padding: '2px' }} onClick={() => removeItem('businessGoals', projectMeta.businessGoals, g)}>
                    <Trash size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: '6px' }}>
            <input
              className="input-glass"
              type="text"
              placeholder="e.g. Automate dispatching, Reduce document synthesis time…"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('businessGoals', projectMeta.businessGoals, newGoal, setNewGoal))}
              style={{ fontSize: '0.8rem' }}
            />
            <button type="button" className="btn-secondary" style={{ padding: '8px 12px' }} onClick={() => addItem('businessGoals', projectMeta.businessGoals, newGoal, setNewGoal)}>
              Add
            </button>
          </div>
        </motion.div>

        {/* Success Metrics (Multi-Entry) */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="label-xs">Success Metrics</label>
            <button 
              type="button" 
              className="btn-ghost" 
              style={{ padding: '2px 6px', fontSize: '0.65rem' }}
              onClick={() => { if (!metrics.includes('None')) setMeta({ successMetrics: setArray([...metrics, 'None']) }) }}
            >
              Add None
            </button>
          </div>
          {metrics.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '4px' }}>
              {metrics.map(m => (
                <div key={m} style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', padding: '6px 8px', background: 'var(--color-bg-muted)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.8rem', flex: 1 }}>{m}</span>
                  <button type="button" className="btn-ghost" style={{ padding: '2px' }} onClick={() => removeItem('successMetrics', projectMeta.successMetrics, m)}>
                    <Trash size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: '6px' }}>
            <input
              className="input-glass"
              type="text"
              placeholder="e.g. 99.9% uptime, API response time < 500ms…"
              value={newMetric}
              onChange={(e) => setNewMetric(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('successMetrics', projectMeta.successMetrics, newMetric, setNewMetric))}
              style={{ fontSize: '0.8rem' }}
            />
            <button type="button" className="btn-secondary" style={{ padding: '8px 12px' }} onClick={() => addItem('successMetrics', projectMeta.successMetrics, newMetric, setNewMetric)}>
              Add
            </button>
          </div>
        </motion.div>

        {/* MVP Features (Multi-Entry) */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="label-xs">MVP Features (In Scope)</label>
            <button 
              type="button" 
              className="btn-ghost" 
              style={{ padding: '2px 6px', fontSize: '0.65rem' }}
              onClick={() => { if (!features.includes('None')) setMeta({ mvpFeatures: setArray([...features, 'None']) }) }}
            >
              Add None
            </button>
          </div>
          {features.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '4px' }}>
              {features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', padding: '6px 8px', background: 'var(--color-bg-muted)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.8rem', flex: 1 }}>{f}</span>
                  <button type="button" className="btn-ghost" style={{ padding: '2px' }} onClick={() => removeItem('mvpFeatures', projectMeta.mvpFeatures, f)}>
                    <Trash size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: '6px' }}>
            <input
              className="input-glass"
              type="text"
              placeholder="e.g. Auth system, Real-time sync, PDF exporter…"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('mvpFeatures', projectMeta.mvpFeatures, newFeature, setNewFeature))}
              style={{ fontSize: '0.8rem' }}
            />
            <button type="button" className="btn-secondary" style={{ padding: '8px 12px' }} onClick={() => addItem('mvpFeatures', projectMeta.mvpFeatures, newFeature, setNewFeature)}>
              Add
            </button>
          </div>
        </motion.div>

        {/* Future Releases (Multi-Entry) */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="label-xs">Future Features (Out of Scope)</label>
            <button 
              type="button" 
              className="btn-ghost" 
              style={{ padding: '2px 6px', fontSize: '0.65rem' }}
              onClick={() => { if (!futureFeatures.includes('None')) setMeta({ outOfScope: setArray([...futureFeatures, 'None']) }) }}
            >
              Add None
            </button>
          </div>
          {futureFeatures.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '4px' }}>
              {futureFeatures.map(ff => (
                <div key={ff} style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', padding: '6px 8px', background: 'var(--color-bg-muted)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.8rem', flex: 1 }}>{ff}</span>
                  <button type="button" className="btn-ghost" style={{ padding: '2px' }} onClick={() => removeItem('outOfScope', projectMeta.outOfScope, ff)}>
                    <Trash size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: '6px' }}>
            <input
              className="input-glass"
              type="text"
              placeholder="e.g. Stripe checkout, Multi-org workspaces…"
              value={newFutureFeature}
              onChange={(e) => setNewFutureFeature(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('outOfScope', projectMeta.outOfScope, newFutureFeature, setNewFutureFeature))}
              style={{ fontSize: '0.8rem' }}
            />
            <button type="button" className="btn-secondary" style={{ padding: '8px 12px' }} onClick={() => addItem('outOfScope', projectMeta.outOfScope, newFutureFeature, setNewFutureFeature)}>
              Add
            </button>
          </div>
        </motion.div>

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
