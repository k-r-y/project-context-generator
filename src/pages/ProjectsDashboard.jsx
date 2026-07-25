import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FolderOpen, ArrowLeft, Trash2, Calendar, FileText } from 'lucide-react'
import { getFirebaseInstance } from '@/lib/firebase'
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore'
import useProjectStore from '@/store/useProjectStore'
import { toast } from '@/store/useToastStore'

export default function ProjectsDashboard() {
  const navigate = useNavigate()
  const { user, userProjects, setUserProjects } = useProjectStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchProjects = async () => {
    if (!user) return
    setLoading(true)
    setError('')
    const { db, initialized } = getFirebaseInstance()
    if (!initialized) {
      setError('Firebase is not configured.')
      setLoading(false)
      return
    }

    try {
      const q = query(collection(db, 'projects'), where('userId', '==', user.uid))
      const querySnapshot = await getDocs(q)
      const list = []
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() })
      })
      // Sort newest first
      list.sort((a, b) => b.updatedAt - a.updatedAt)
      setUserProjects(list)
    } catch (err) {
      console.error(err)
      setError('Failed to fetch projects.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }
    fetchProjects()
  }, [user])

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return
    }

    const { db } = getFirebaseInstance()
    try {
      await deleteDoc(doc(db, 'projects', id))
      setUserProjects(userProjects.filter(p => p.id !== id))
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete project.')
    }
  }

  const handleSelectProject = (project) => {
    const store = useProjectStore.getState()
    store.setMeta(project.projectMeta)
    // Map architecture, design, rules, schema
    store.setArchitecture(project.pillars.architecture)
    store.setDesign(project.pillars.design)
    store.setRules(project.pillars.rules)
    store.setSchema(project.pillars.schema)
    store.setAllOutputs(project.generatedOutputs)
    navigate('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: '52px',
        borderBottom: '1px solid var(--color-border)',
        flexShrink: 0,
      }}>
        <button
          className="btn-ghost"
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <ArrowLeft size={14} /> Back
        </button>
        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>
          My Saved Projects
        </span>
        <div style={{ width: '60px' }} />
      </header>

      {/* Main content */}
      <main style={{ flex: 1, padding: '40px 24px', maxWidth: '800px', width: '100%', margin: '0 auto' }}>
        {error && (
          <div style={{
            fontSize: '0.8rem', color: 'var(--color-danger)',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
            padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '20px',
          }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="surface-interactive animate-pulse" style={{
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                height: '74px',
                border: '1px solid var(--color-border)'
              }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)' }} />
                  <div>
                    <div style={{ width: '150px', height: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '8px' }} />
                    <div style={{ width: '100px', height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
                  </div>
                </div>
                <div style={{ width: '28px', height: '28px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
              </div>
            ))}
          </div>
        ) : userProjects.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 40px',
            border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-lg)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
          }}>
            <FolderOpen size={32} color="var(--color-text-muted)" />
            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>No projects saved yet</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', maxWidth: '280px', lineHeight: 1.5 }}>
              Generate custom context documentations, log in to your account, and hit Save to cloud.
            </span>
            <button className="btn-primary" onClick={() => navigate('/wizard')} style={{ marginTop: '10px' }}>
              Create a project
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {userProjects.map((p) => {
              const date = new Date(p.updatedAt).toLocaleDateString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric',
              })
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectProject(p)}
                  className="surface-interactive"
                  style={{
                    padding: '16px 20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '6px',
                      background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--color-text-secondary)', flexShrink: 0,
                    }}>
                      <FileText size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text-primary)', marginBottom: '3px' }}>
                        {p.projectMeta?.name || 'Untitled Project'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} /> {date}
                        </span>
                        <span>·</span>
                        <span>{p.projectMeta?.platform || 'Web'}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-ghost"
                    style={{ padding: '8px', color: 'var(--color-danger)' }}
                    onClick={(e) => handleDelete(p.id, e)}
                    aria-label="Delete project"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
