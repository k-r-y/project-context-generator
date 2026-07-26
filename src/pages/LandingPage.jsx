import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, FileText, Zap, Package, Settings, LogIn, LogOut, Folder } from 'lucide-react'
import TypewriterText from '@/components/ui/TypewriterText'
import useProjectStore from '@/store/useProjectStore'
import { toast } from '@/store/useToastStore'
import AuthModal from '@/components/auth/AuthModal'
import FirebaseConfigModal from '@/components/auth/FirebaseConfigModal'
import ShinyText from '@/components/ui/ShinyText'
import Magnetic from '@/components/ui/Magnetic'
import InteractiveButton from '@/components/ui/InteractiveButton'
import useSEO from '@/hooks/useSEO'
import { getFirebaseInstance } from '@/lib/firebase'
import { signOut } from 'firebase/auth'

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
  useSEO({
    title: 'Project Context Generator — Stop writing docs. Start shipping.',
    description: 'Answer targeted questions and get a complete suite of AI-crafted context files for your project: PRD, Architecture, Design, Rules, and Schema — in under 5 minutes.',
    canonical: '/',
  })

  const navigate = useNavigate()
  const { generatedOutputs, projectMeta, user, setUser, setUserProjects } = useProjectStore()
  const [showAuth, setShowAuth] = useState(false)
  const [showConfig, setShowConfig] = useState(false)

  const hasPrevious = !!generatedOutputs.prd

  const handleLogout = async () => {
    try {
      const { auth } = getFirebaseInstance()
      if (auth) {
        await signOut(auth)
      }
    } catch (err) {
      console.error('Logout error:', err)
    }
    setUser(null)
    setUserProjects([])
    toast.success('Logged out successfully')
    navigate('/')
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
      <header role="banner" style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '52px', borderBottom: '1px solid var(--color-border)',
        padding: '0 24px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>PCG</span>
        <nav aria-label="Main navigation" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <InteractiveButton
                className="btn-ghost"
                onClick={() => navigate('/projects')}
                style={{ fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                aria-label="View Projects"
              >
                <Folder size={13} /> Projects
              </InteractiveButton>
              <span className="label-xs" style={{ color: 'var(--color-text-secondary)' }}>
                {user.displayName || user.email.split('@')[0]}
              </span>
              <InteractiveButton className="btn-ghost" onClick={handleLogout} style={{ padding: '6px' }} title="Logout" aria-label="Log out">
                <LogOut size={15} />
              </InteractiveButton>
            </div>
          ) : (
            <InteractiveButton
              className="btn-ghost"
              onClick={() => setShowAuth(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
              aria-label="Log in"
            >
              <LogIn size={14} /> Log in
            </InteractiveButton>
          )}
        </nav>
      </header>

      <main role="main" style={{ maxWidth: '620px', width: '100%', textAlign: 'center' }}>

        {/* Eyebrow */}
        <motion.div variants={item} transition={{ duration: 0.5, ease }} style={{ marginBottom: '32px' }}>
          <span className="badge badge-neutral">
            <ShinyText text="Project Context Generator" speed={3.5} />
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
          <InteractiveButton
            className="btn-primary"
            onClick={() => navigate('/wizard')}
            style={{ padding: '12px 24px', fontSize: '0.9rem', fontWeight: 600 }}
          >
            Start building <ArrowRight size={15} />
          </InteractiveButton>

          {user && (
            <InteractiveButton
              className="btn-secondary"
              onClick={() => navigate('/projects')}
              style={{ padding: '12px 20px', fontSize: '0.9rem' }}
            >
              View Saved Projects
            </InteractiveButton>
          )}

          {hasPrevious && (
            <InteractiveButton
              className="btn-secondary"
              onClick={() => navigate('/dashboard')}
              style={{ padding: '12px 20px', fontSize: '0.9rem' }}
            >
              Resume · {projectMeta.name || 'previous session'}
            </InteractiveButton>
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
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
      </main>

      {/* Bottom note */}
      <footer
        role="contentinfo"
        style={{
          marginTop: 'auto',
          paddingTop: '40px',
          paddingBottom: '20px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '6px 12px',
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
            letterSpacing: '0.01em',
            textAlign: 'center',
            maxWidth: '560px',
            width: '100%',
            padding: '0 16px',
          }}
        >
          <span>Dynamic cloud sync</span>
          <span style={{ opacity: 0.35 }}>·</span>
          <span>Runs in browser</span>
          <span style={{ opacity: 0.35 }}>·</span>
          <span>localStorage persistence</span>
        </motion.div>
      </footer>

      {/* Modals */}
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onOpenConfig={() => {
            setShowAuth(false)
            setShowConfig(true)
          }}
        />
      )}
      {showConfig && <FirebaseConfigModal onClose={() => setShowConfig(false)} />}
    </div>
  )
}
