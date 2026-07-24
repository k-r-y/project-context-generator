import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { RotateCcw } from 'lucide-react'
import DocumentNav from './DocumentNav'
import DocumentViewer from './DocumentViewer'
import MetricsChecklist from './MetricsChecklist'
import ActionBar from './ActionBar'
import AIToggle from './AIToggle'
import useProjectStore from '@/store/useProjectStore'
import { DOC_META } from '@/lib/downloadUtils'
import { pageVariants } from '@/lib/animationVariants'

export default function Dashboard() {
  const navigate = useNavigate()
  const { projectMeta, generatedOutputs, reset } = useProjectStore()
  const [activeDoc, setActiveDoc] = useState('prd')
  const content = generatedOutputs[activeDoc] || ''
  const docMeta = DOC_META[activeDoc]

  const handleReset = () => {
    if (window.confirm('Start over? This will clear the current session.')) {
      reset()
      navigate('/')
    }
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
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>generated</span>
            </div>
          </div>
          <DocumentViewer content={content} docKey={activeDoc} />
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
