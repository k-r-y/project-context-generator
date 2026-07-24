import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { RotateCcw, Cloud, LogIn, LogOut, Settings, Edit, Eye, Save } from 'lucide-react'
import DocumentNav from './DocumentNav'
import DocumentViewer from './DocumentViewer'
import MetricsChecklist from './MetricsChecklist'
import ActionBar from './ActionBar'
import AIToggle from './AIToggle'
import AuthModal from '../auth/AuthModal'
import FirebaseConfigModal from '../auth/FirebaseConfigModal'
import useProjectStore from '@/store/useProjectStore'
import { getFirebaseInstance } from '@/lib/firebase'
import { collection, addDoc, doc, setDoc } from 'firebase/firestore'
import { DOC_META } from '@/lib/downloadUtils'
import { pageVariants } from '@/lib/animationVariants'

export default function Dashboard() {
  const navigate = useNavigate()
  const {
    projectMeta, pillars, generatedOutputs, setOutput, reset,
    user, setUser, userProjects, setUserProjects, firebaseConfig,
  } = useProjectStore()

  const [activeDoc, setActiveDoc] = useState('prd')
  const [isEditing, setIsEditing] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
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

  const handleLogout = () => {
    setUser(null)
    setUserProjects([])
  }

  const handleSaveToCloud = async () => {
    if (!user) {
      setShowAuth(true)
      return
    }

    setSaveLoading(true)
    const { db, initialized } = getFirebaseInstance()
    if (!initialized) {
      alert('Please configure your Firebase settings first!')
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
        alert('Project updated successfully on Cloud!')
      } else {
        // Create new record
        const docRef = await addDoc(collection(db, 'projects'), payload)
        setCurrentDocId(docRef.id)
        setUserProjects([{ id: docRef.id, ...payload }, ...userProjects])
        alert('Project saved successfully to Cloud!')
      }
    } catch (err) {
      console.error(err)
      alert('Failed to save to cloud: ' + err.message)
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <ActionBar activeDoc={activeDoc} content={content} />
          
          <span style={{ width: '1px', height: '16px', background: 'var(--color-border)' }} />

          {/* Edit / Preview Toggle */}
          <button
            className={isEditing ? 'btn-primary' : 'btn-ghost'}
            onClick={() => setIsEditing(!isEditing)}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '7px 10px', fontSize: '0.8rem' }}
          >
            {isEditing ? <Eye size={13} /> : <Edit size={13} />}
            {isEditing ? 'View Markdown' : 'Edit'}
          </button>

          {/* Save to Cloud */}
          <button
            className="btn-ghost"
            onClick={handleSaveToCloud}
            disabled={saveLoading}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '7px 10px', fontSize: '0.8rem' }}
          >
            <Cloud size={13} />
            {saveLoading ? 'Saving…' : currentDocId ? 'Update Cloud' : 'Save to Cloud'}
          </button>

          <span style={{ width: '1px', height: '16px', background: 'var(--color-border)' }} />

          {/* Settings / Config */}
          <button
            className="btn-ghost"
            onClick={() => setShowConfig(true)}
            aria-label="Firebase settings"
            style={{ padding: '6px' }}
          >
            <Settings size={15} />
          </button>

          {/* User Auth Profile */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                className="btn-ghost"
                onClick={() => navigate('/projects')}
                style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-primary)' }}
              >
                {user.displayName || user.email.split('@')[0]}
              </button>
              <button
                className="btn-ghost"
                onClick={handleLogout}
                style={{ padding: '6px' }}
                aria-label="Logout"
                title="Logout"
              >
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

          <span style={{ width: '1px', height: '16px', background: 'var(--color-border)' }} />

          <button
            className="btn-ghost"
            onClick={handleReset}
            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
            aria-label="Start over"
          >
            <RotateCcw size={13} />
            Start over
          </button>
        </div>
      </header>

      {/* Main layout */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '200px 1fr 260px',
        overflow: 'hidden',
      }} className="dashboard-grid">

        {/* Col 1 — Document nav */}
        <aside style={{
          borderRight: '1px solid var(--color-border)',
          overflowY: 'auto',
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}>
          <div className="label-xs" style={{ padding: '4px 8px', marginBottom: '8px' }}>
            Files
          </div>
          <DocumentNav activeDoc={activeDoc} onSelect={setActiveDoc} />
        </aside>

        {/* Col 2 — Document viewer */}
        <main style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
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
        </main>

        {/* Col 3 — Right panel */}
        <aside style={{
          borderLeft: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div style={{ flexShrink: 0, borderBottom: '1px solid var(--color-border)' }}>
            <AIToggle activeDoc={activeDoc} />
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <MetricsChecklist />
          </div>
        </aside>
      </div>

      {/* Modals */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showConfig && <FirebaseConfigModal onClose={() => setShowConfig(false)} />}

      <style>{`
        @media (max-width: 1100px) {
          .dashboard-grid { grid-template-columns: 180px 1fr !important; }
          .dashboard-grid > aside:last-child { display: none; }
        }
        @media (max-width: 768px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
          .dashboard-grid > aside:first-child { display: none; }
        }
      `}</style>
    </motion.div>
  )
}
