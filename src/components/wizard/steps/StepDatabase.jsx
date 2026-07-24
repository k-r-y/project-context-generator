import { motion } from 'framer-motion'
import { Database } from 'lucide-react'
import QuestionCard from '../QuestionCard'
import useProjectStore from '@/store/useProjectStore'
import { staggerContainer, staggerItem } from '@/lib/animationVariants'

const DB_OPTIONS = [
  { value: 'Supabase', desc: 'Postgres + Auth + Realtime + Storage. Best for rapid full-stack development.' },
  { value: 'Firebase', desc: 'NoSQL Firestore + Auth + Hosting. Best for real-time apps and mobile.' },
  { value: 'Postgres', desc: 'Self-hosted or managed Postgres (Neon, Railway). Full SQL power.' },
  { value: 'PlanetScale', desc: 'MySQL-compatible serverless DB with branching. Great for scale.' },
  { value: 'MongoDB', desc: 'Flexible document database. Best for varied, schema-less data.' },
  { value: 'SQLite', desc: 'Embedded, serverless. Best for local-first or simple apps.' },
  { value: 'None', desc: 'Frontend-only or using an external API. No database needed.' },
]

const DEPLOY_OPTIONS = [
  { value: 'Vercel' },
  { value: 'Netlify' },
  { value: 'Railway' },
  { value: 'Fly.io' },
  { value: 'AWS' },
  { value: 'Docker' },
]

const DATA_PATTERNS = ['REST', 'GraphQL', 'tRPC', 'Server Actions']

export default function StepDatabase({ onNext, onBack }) {
  const { pillars, setArchitecture, setSchema } = useProjectStore()
  const { database, deployment } = pillars.architecture
  const { dataPattern } = pillars.schema
  const canProceed = !!database

  return (
    <QuestionCard>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
      >
        <motion.div variants={staggerItem} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px', height: '36px', borderRadius: '9px',
              background: 'linear-gradient(135deg, #14b8a6, #22c55e)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Database size={18} color="white" />
          </div>
          <span className="badge badge-brand">Data Layer</span>
        </motion.div>

        <motion.div variants={staggerItem}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '6px' }}>
            Where does your data live?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
            Choose your database and deployment. These decisions shape your Schema and Architecture documents.
          </p>
        </motion.div>

        {/* Database Options */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {DB_OPTIONS.map((opt) => {
            const isActive = database === opt.value
            return (
              <motion.button
                key={opt.value}
                onClick={() => setArchitecture({ database: opt.value })}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                aria-pressed={isActive}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 14px', borderRadius: '10px',
                  border: `1px solid ${isActive ? 'rgba(20,184,166,0.5)' : 'rgba(255,255,255,0.07)'}`,
                  background: isActive ? 'rgba(20,184,166,0.1)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 150ms ease',
                }}
              >
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 600, color: isActive ? '#5eead4' : 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>
                    {opt.value}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', display: 'block', marginTop: '1px' }}>
                    {opt.desc}
                  </span>
                </div>
                {isActive && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{ fontSize: '1rem' }}
                  >
                    ✓
                  </motion.span>
                )}
              </motion.button>
            )
          })}
        </motion.div>

        {/* Deployment */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>
            DEPLOYMENT PLATFORM
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {DEPLOY_OPTIONS.map((opt) => (
              <motion.button
                key={opt.value}
                onClick={() => setArchitecture({ deployment: opt.value })}
                className={`chip ${deployment === opt.value ? 'chip-active' : ''}`}
                whileTap={{ scale: 0.95 }}
                type="button"
                aria-pressed={deployment === opt.value}
              >
                {opt.value}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Data Pattern */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>
            API DATA PATTERN
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {DATA_PATTERNS.map((p) => (
              <motion.button
                key={p}
                onClick={() => setSchema({ dataPattern: p })}
                className={`chip ${dataPattern === p ? 'chip-active' : ''}`}
                whileTap={{ scale: 0.95 }}
                type="button"
                aria-pressed={dataPattern === p}
              >
                {p}
              </motion.button>
            ))}
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
