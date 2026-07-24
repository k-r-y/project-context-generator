import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, FileText, Zap, Package, Settings, LogIn, LogOut, Folder } from 'lucide-react'
import TypewriterText from '@/components/ui/TypewriterText'
import useProjectStore from '@/store/useProjectStore'
import AuthModal from '@/components/auth/AuthModal'
import FirebaseConfigModal from '@/components/auth/FirebaseConfigModal'

const ease = [0.16, 1, 0.3, 1]

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}

const FEATURES = [
  {
    icon: FileText,
    title: '5 context files',
    description: 'PRD, Architecture, Design, Rules, Schema — one flow.',
  },
  {
    icon: Zap,
    title: 'System or AI mode',
    description: 'Instant templates or Gemini-generated docs per file.',
  },
  {
    icon: Package,
    title: 'Export everything',
    description: 'Copy, download .md, or ZIP all 5 at once.',
  },
]

const FILES = ['PRD.md', 'ARCHITECTURE.md', 'DESIGN.md', 'RULES.md', 'SCHEMA.md']

export default function LandingPage() {
  const navigate = useNavigate()
  const { generatedOutputs, projectMeta, user, setUser, setUserProjects } = useProjectStore()
  const [showAuth, setShowAuth] = useState(false)
  const [showConfig, setShowConfig] = useState(false)

  const hasPrevious = !!generatedOutputs.prd

  const handleLogout = () => {
    setUser(null)
    setUserProjects([])
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px 60px',
      }}
    >
      {/* Top Navbar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '52px', borderBottom: '1px solid var(--color-border)',
        padding: '0 24px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>PCG</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                className="btn-ghost"
                onClick={() => navigate('/projects')}
                style={{ fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Folder size={13} /> Projects
              </button>
              <span className="label-xs" style={{ color: 'var(--color-text-secondary)' }}>
                {user.displayName || user.email.split('@')[0]}
              </span>
              <button className="btn-ghost" onClick={handleLogout} style={{ padding: '6px' }} title="Logout">
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              className="btn-ghost"
              onClick={() => setShowAuth(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
            >
              <LogIn size={14} /> Log in
            </button>
          )}
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        style={{ maxWidth: '620px', width: '100%', textAlign: 'center' }}
      >
        {/* Eyebrow */}
        <motion.div variants={item} transition={{ duration: 0.5, ease }} style={{ marginBottom: '32px' }}>
          <span className="badge badge-neutral">
            Project Context Generator
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={item}
          transition={{ duration: 0.6, ease }}
          className="heading-xl"
          style={{ marginBottom: '20px' }}
        >
          Stop writing docs.{' '}
          <span className="text-blue-400">
            <TypewriterText text="Start shipping." speed={55} delay={700} showCursor={false} />
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={item}
          transition={{ duration: 0.5, ease }}
          style={{
            fontSize: '1rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.7,
            marginBottom: '40px',
            maxWidth: '480px',
            margin: '0 auto 40px',
          }}
        >
          Answer a few questions about your project. Get a complete suite of
          opinionated context files in under 5 minutes.
        </motion.p>

        {/* File list */}
        <motion.div
          variants={item}
          transition={{ duration: 0.5, ease }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            justifyContent: 'center',
            marginBottom: '40px',
          }}
        >
          {FILES.map((f) => (
            <span
              key={f}
              className="font-mono"
              style={{
                fontSize: '0.75rem',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-muted)',
                letterSpacing: '0.02em',
              }}
            >
              {f}
            </span>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          variants={item}
          transition={{ duration: 0.5, ease }}
          style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '12px' }}
        >
          <motion.button
            className="btn-primary"
            onClick={() => navigate('/wizard')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            style={{ padding: '12px 24px', fontSize: '0.9rem', fontWeight: 600 }}
          >
            Start building <ArrowRight size={15} />
          </motion.button>

          {user && (
            <motion.button
              className="btn-secondary"
              onClick={() => navigate('/projects')}
              whileTap={{ scale: 0.97 }}
              style={{ padding: '12px 20px', fontSize: '0.9rem' }}
            >
              View Saved Projects
            </motion.button>
          )}

          {hasPrevious && (
            <motion.button
              className="btn-secondary"
              onClick={() => navigate('/dashboard')}
              whileTap={{ scale: 0.97 }}
              style={{ padding: '12px 20px', fontSize: '0.9rem' }}
            >
              Resume · {projectMeta.name || 'previous session'}
            </motion.button>
          )}
        </motion.div>

        {hasPrevious && (
          <motion.p
            variants={item}
            style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}
          >
            Session found in localStorage
          </motion.p>
        )}

        {/* Feature strip */}
        <motion.div
          variants={item}
          transition={{ duration: 0.5, ease }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1px',
            marginTop: '80px',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            background: 'var(--color-border)',
          }}
        >
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              style={{
                padding: '24px 20px',
                background: 'var(--color-bg-subtle)',
                textAlign: 'left',
              }}
            >
              <Icon size={16} color="var(--color-text-muted)" style={{ marginBottom: '12px' }} />
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-primary)', marginBottom: '6px', letterSpacing: '-0.01em' }}>
                {title}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.55 }}>
                {description}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        style={{
          position: 'fixed',
          bottom: '20px',
          fontSize: '0.72rem',
          color: 'var(--color-text-muted)',
          letterSpacing: '0.01em',
        }}
      >
        Dynamic cloud sync · Runs in browser · localStorage persistence
      </motion.p>

      {/* Modals */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showConfig && <FirebaseConfigModal onClose={() => setShowConfig(false)} />}
    </div>
  )
}
