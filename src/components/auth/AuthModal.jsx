import { useState } from 'react'
import { getFirebaseInstance } from '@/lib/firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import useProjectStore from '@/store/useProjectStore'

export default function AuthModal({ onClose }) {
  const { setUser } = useProjectStore()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { auth, initialized } = getFirebaseInstance()
    if (!initialized) {
      setError('Firebase is not configured. Please paste your config in settings first.')
      setLoading(false)
      return
    }

    try {
      if (isSignUp) {
        const credential = await createUserWithEmailAndPassword(auth, email, password)
        if (name.trim()) {
          await updateProfile(credential.user, { displayName: name.trim() })
        }
        setUser({
          uid: credential.user.uid,
          email: credential.user.email,
          displayName: name.trim() || credential.user.email.split('@')[0],
        })
      } else {
        const credential = await signInWithEmailAndPassword(auth, email, password)
        setUser({
          uid: credential.user.uid,
          email: credential.user.email,
          displayName: credential.user.displayName || credential.user.email.split('@')[0],
        })
      }
      onClose()
    } catch (err) {
      console.error(err)
      setError(err.message || 'Authentication failed. Please check credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
    }}>
      <div className="surface-elevated animate-fade-in-up" style={{ padding: '24px', maxWidth: '360px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="heading-md">{isSignUp ? 'Create account' : 'Sign in'}</h2>
          <button className="btn-ghost" onClick={onClose} style={{ padding: '4px' }}>✕</button>
        </div>

        {error && (
          <div style={{
            fontSize: '0.78rem', color: 'var(--color-danger)',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
            padding: '8px 12px', borderRadius: 'var(--radius-sm)', marginBottom: '16px',
            lineHeight: 1.4,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {isSignUp && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label className="label-xs">Full name</label>
              <input
                className="input-glass"
                type="text"
                placeholder="Ada Lovelace"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label className="label-xs">Email address</label>
            <input
              className="input-glass"
              type="email"
              placeholder="ada@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label className="label-xs">Password</label>
            <input
              className="input-glass"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: '8px', padding: '11px' }}>
            {loading ? 'Processing…' : isSignUp ? 'Sign up' : 'Sign in'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            className="btn-ghost"
            style={{ padding: '0 4px', textDecoration: 'underline', color: 'var(--color-accent-text)' }}
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </div>
      </div>
    </div>
  )
}
