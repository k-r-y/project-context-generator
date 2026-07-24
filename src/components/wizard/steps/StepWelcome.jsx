import { useState } from 'react'
import { motion } from 'framer-motion'
import QuestionCard from '../QuestionCard'
import ChipSelector from '../ChipSelector'
import useProjectStore from '@/store/useProjectStore'
import { staggerContainer, staggerItem } from '@/lib/animationVariants'

const PLATFORM_OPTIONS = ['Web', 'iOS', 'Android', 'Cloud', 'Desktop', 'Other']

export default function StepWelcome({ onNext }) {
  const { projectMeta, setMeta } = useProjectStore()
  const [customPlatform, setCustomPlatform] = useState('')
  const [isCustom, setIsCustom] = useState(
    projectMeta.platform && !PLATFORM_OPTIONS.slice(0, 5).includes(projectMeta.platform)
  )

  const handlePlatformSelect = (val) => {
    if (val === 'Other') {
      setIsCustom(true)
      setMeta({ platform: customPlatform || 'Other' })
    } else {
      setIsCustom(false)
      setMeta({ platform: val })
    }
  }

  const handleCustomChange = (e) => {
    const val = e.target.value
    setCustomPlatform(val)
    setMeta({ platform: val || 'Other' })
  }

  const canProceed = projectMeta.name.trim().length > 0 && projectMeta.platform.trim().length > 0

  return (
    <QuestionCard>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
      >
        <motion.div variants={staggerItem}>
          <div className="label-xs" style={{ marginBottom: '12px' }}>Step 1 — Project identity</div>
          <h1 className="heading-lg" style={{ marginBottom: '8px' }}>
            What are you building?
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.65 }}>
            Give your project a name and a platform target. We'll use this to customize all downstream choices dynamically.
          </p>
        </motion.div>

        {/* Project Name */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label htmlFor="project-name" className="label-xs">
            Project name
          </label>
          <input
            id="project-name"
            className="input-glass"
            type="text"
            placeholder="e.g. Nova Dashboard, Helios API…"
            value={projectMeta.name}
            onChange={(e) => setMeta({ name: e.target.value })}
            maxLength={60}
            autoFocus
          />
        </motion.div>

        {/* Platform Selection */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label className="label-xs">Target Platform</label>
          <ChipSelector
            options={PLATFORM_OPTIONS}
            selected={[isCustom ? 'Other' : projectMeta.platform]}
            onToggle={handlePlatformSelect}
            multiSelect={false}
          />
          {isCustom && (
            <input
              className="input-glass"
              type="text"
              placeholder="Describe platform (e.g. Cross-platform IoT, macOS Menu Bar app…)"
              value={customPlatform || (projectMeta.platform !== 'Other' ? projectMeta.platform : '')}
              onChange={handleCustomChange}
              style={{ marginTop: '8px' }}
            />
          )}
        </motion.div>

        {/* Pitch */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label htmlFor="project-pitch" className="label-xs">
              Elevator pitch
            </label>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
              {projectMeta.pitch.length}/300
            </span>
          </div>
          <textarea
            id="project-pitch"
            className="input-glass"
            placeholder="A real-time analytics dashboard for e-commerce teams that surfaces LTV, churn, and cohort data in a single view…"
            value={projectMeta.pitch}
            onChange={(e) => setMeta({ pitch: e.target.value })}
            rows={3}
            maxLength={300}
          />
        </motion.div>

        <motion.div variants={staggerItem}>
          <button
            className="btn-primary"
            onClick={onNext}
            disabled={!canProceed}
            style={{ width: '100%', padding: '11px', fontWeight: 600 }}
          >
            Continue →
          </button>
        </motion.div>
      </motion.div>
    </QuestionCard>
  )
}
