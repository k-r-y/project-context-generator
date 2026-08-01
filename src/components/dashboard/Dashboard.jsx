import { useState, useEffect } from 'react'
import { toast } from '@/store/useToastStore'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { RotateCcw, Cloud, LogIn, LogOut, Settings, Edit, Eye, Save, Folder, User } from 'lucide-react'
import DocumentNav from './DocumentNav'
import DocumentViewer from './DocumentViewer'
import MetricsChecklist from './MetricsChecklist'
import ActionBar from './ActionBar'
import AIToggle from './AIToggle'
import AuthModal from '../auth/AuthModal'
import useProjectStore from '@/store/useProjectStore'
import { getFirebaseInstance } from '@/lib/firebase'
import { collection, addDoc, doc, setDoc } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { DOC_META } from '@/lib/downloadUtils'
import { pageVariants, bentoGridContainer, bentoGridCell } from '@/lib/animationVariants'
import InteractiveButton from '@/components/ui/InteractiveButton'
import Magnetic from '@/components/ui/Magnetic'

export default function Dashboard() {
  const navigate = useNavigate()
  const {
    projectMeta, pillars, generatedOutputs, setOutput, reset,
    user, setUser, userProjects, setUserProjects, firebaseConfig,
  } = useProjectStore()

  const [activeDoc, setActiveDoc] = useState('prd')
  const [isEditing, setIsEditing] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [currentDocId, setCurrentDocId] = useState(null)

  const content = generatedOutputs[activeDoc] || ''
  const docMeta = DOC_META[activeDoc]

  // Track if current project exists in loaded projects to allow update instead of duplicate save
  useEffect(() => {
    const existing = userProjects.find(p => p.projectMeta?.name === projectMeta.name)
    if (existing) {
      setCurrentDocId(existing.id)
    } else {
      setCurrentDocId(null)
    }
  }, [projectMeta.name, userProjects])

  const handleReset = () => {
    if (window.confirm('Start over? This will clear the current session.')) {
      reset()
      navigate('/')
    }
  }

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to log out?')) {
      return
    }
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

  const handleSaveToCloud = async () => {
    if (!user || user.uid === 'guest-local') {
      toast.error('Cloud saving is not available in Guest Mode. Please sign in or configure your Firebase settings!')
      setShowAuth(true)
      return
    }

    setSaveLoading(true)
    const { db, initialized } = getFirebaseInstance()
    if (!initialized) {
      toast.error('Please configure your Firebase settings first!')
      setSaveLoading(false)
      return
    }

    try {
      const payload = {
        userId: user.uid,
        projectMeta,
        pillars,
        generatedOutputs,
        updatedAt: Date.now(),
      }

      if (currentDocId) {
        // Update existing record
        await setDoc(doc(db, 'projects', currentDocId), payload, { merge: true })
        // Update local store state
        setUserProjects(userProjects.map(p => p.id === currentDocId ? { ...p, ...payload } : p))
        toast.success('Project updated successfully on Cloud!')
      } else {
        // Create new record
        const docRef = await addDoc(collection(db, 'projects'), payload)
        setCurrentDocId(docRef.id)
        setUserProjects([{ id: docRef.id, ...payload }, ...userProjects])
        toast.success('Project saved successfully to Cloud!')
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to save to cloud: ' + err.message)
    } finally {
      setSaveLoading(false)
    }
  }

  const handleEditChange = (val) => {
    setOutput(activeDoc, val)
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
    >
      {/* Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        height: '52px',
        flexShrink: 0,
        borderBottom: '1px solid var(--color-border)',
        gap: '16px',
      }}>
        {/* Left: logo + project name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.02em', flexShrink: 0, color: 'var(--color-text-primary)' }}>
            PCG
          </span>
          <span style={{ width: '1px', height: '16px', background: 'var(--color-border)', flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontWeight: 600,
              fontSize: '0.875rem',
              color: 'var(--color-text-primary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              letterSpacing: '-0.01em',
            }}>
              {projectMeta.name || 'Untitled Project'}
            </div>
          </div>
        </div>

        {/* Right: actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', flexShrink: 1, paddingRight: '4px' }}>
          <ActionBar activeDoc={activeDoc} content={content} />
          
          <span style={{ width: '1px', height: '16px', background: 'var(--color-border)', flexShrink: 0 }} />

          {/* Edit / Preview Toggle */}
          <InteractiveButton
            className={isEditing ? 'btn-primary' : 'btn-ghost'}
            onClick={() => setIsEditing(!isEditing)}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '7px 10px', fontSize: '0.8rem', flexShrink: 0 }}
          >
            {isEditing ? <Eye size={13} /> : <Edit size={13} />}
            <span className="hide-tablet">{isEditing ? 'View Markdown' : 'Edit'}</span>
          </InteractiveButton>

          {/* Save to Cloud */}
          <InteractiveButton
            className="btn-ghost"
            onClick={handleSaveToCloud}
            disabled={saveLoading}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '7px 10px', fontSize: '0.8rem', flexShrink: 0 }}
          >
            <Cloud size={13} />
            <span className="hide-tablet">{saveLoading ? 'Saving…' : currentDocId ? 'Update Cloud' : 'Save to Cloud'}</span>
          </InteractiveButton>

          {/* User Auth Profile */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
              <InteractiveButton
                className="btn-ghost"
                onClick={() => navigate('/projects')}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-primary)' }}
                title="View Saved Projects"
              >
                <Folder size={13} />
                <span className="hide-tablet">{user.displayName || user.email.split('@')[0]}</span>
              </InteractiveButton>
              <InteractiveButton
                className="btn-ghost"
                onClick={handleLogout}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
                aria-label="Logout"
                title="Logout"
              >
                <LogOut size={14} /> <span className="hide-tablet">Log out</span>
              </InteractiveButton>
            </div>
          ) : (
            <InteractiveButton
              className="btn-ghost"
              onClick={() => setShowAuth(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', flexShrink: 0 }}
            >
              <LogIn size={14} /> <span className="hide-tablet">Log in</span>
            </InteractiveButton>
          )}

          <span className="hide-tablet" style={{ width: '1px', height: '16px', background: 'var(--color-border)', flexShrink: 0 }} />

          <button
            className="btn-ghost"
            onClick={() => navigate('/wizard')}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}
            aria-label="Edit config"
          >
            <Settings size={13} />
            <span className="hide-tablet">Edit Config</span>
          </button>

          <button
            className="btn-ghost"
            onClick={handleReset}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}
            aria-label="Start over"
          >
            <RotateCcw size={13} />
            <span className="hide-tablet">Start over</span>
          </button>
        </div>
      </header>

      {/* Main layout */}
      <motion.div
        variants={bentoGridContainer}
        initial="hidden"
        animate="visible"
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '200px 1fr 260px',
          overflow: 'hidden',
        }}
        className="dashboard-grid"
      >
        {/* Col 1 — Document nav */}
        <motion.aside
          variants={bentoGridCell}
          style={{
            borderRight: '1px solid var(--color-border)',
            overflowY: 'auto',
            padding: '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}
        >
          <div className="label-xs" style={{ padding: '4px 8px', marginBottom: '8px' }}>
            Files
          </div>
          <DocumentNav activeDoc={activeDoc} onSelect={setActiveDoc} />

          {/* Tablet-only panel for AI generation & checklist when Col 3 is hidden */}
          <div className="tablet-sidebar-extras" style={{ marginTop: '16px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
            <AIToggle activeDoc={activeDoc} />
            <div style={{ marginTop: '12px' }}>
              <MetricsChecklist />
            </div>
          </div>
        </motion.aside>

        {/* Col 2 — Document viewer */}
        <motion.main
          variants={bentoGridCell}
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            height: '100%',
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          {/* Mobile Document Selector Tabs */}
          <div
            className="mobile-doc-tabs"
            style={{
              display: 'none',
              background: 'rgba(255,255,255,0.01)',
              borderBottom: '1px solid var(--color-border)',
              padding: '8px 16px',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              gap: '6px',
              flexShrink: 0,
            }}
          >
            {['prd', 'architecture', 'design', 'rules', 'schema'].map((key) => {
              const isActive = activeDoc === key
              const label = DOC_META[key]?.label || key.toUpperCase()
              return (
                <InteractiveButton
                  key={key}
                  onClick={() => setActiveDoc(key)}
                  className={`chip ${isActive ? 'chip-active' : ''}`}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                  type="button"
                >
                  {label}
                </InteractiveButton>
              )
            })}
          </div>

          {/* Doc header bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '0 24px',
            height: '44px',
            borderBottom: '1px solid var(--color-border)',
            flexShrink: 0,
          }}>
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.01em',
            }}>
              {docMeta?.label}
            </span>
            <span className="font-mono" style={{
              fontSize: '0.72rem',
              color: 'var(--color-text-muted)',
              marginLeft: '4px',
            }}>
              context/{docMeta?.filename}
            </span>
            {/* Live indicator */}
            <div style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-success)' }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                {isEditing ? 'editing' : 'generated'}
              </span>
            </div>
          </div>
          <DocumentViewer
            content={content}
            docKey={activeDoc}
            isEditing={isEditing}
            onEditChange={handleEditChange}
          />
        </motion.main>

        {/* Col 3 — Right panel */}
        <motion.aside
          variants={bentoGridCell}
          className="desktop-sidebar-extras"
          style={{
            borderLeft: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div style={{ flexShrink: 0, borderBottom: '1px solid var(--color-border)' }}>
            <AIToggle activeDoc={activeDoc} />
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <MetricsChecklist />
          </div>
        </motion.aside>
      </motion.div>

      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} />
      )}

      <style>{`
        .tablet-sidebar-extras { display: none !important; }
        .desktop-sidebar-extras { display: flex !important; }

        @media (max-width: 1100px) {
          .dashboard-grid { grid-template-columns: 210px 1fr !important; }
          .desktop-sidebar-extras { display: none !important; }
          .tablet-sidebar-extras { display: flex !important; flex-direction: column; gap: 12px; }
        }
        @media (max-width: 768px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
          .dashboard-grid > aside:first-child { display: none; }
          .mobile-doc-tabs { display: flex !important; }
        }
      `}</style>
    </motion.div>
  )
}
