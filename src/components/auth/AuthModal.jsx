import { useState } from 'react'
import { X } from 'lucide-react'
import { getFirebaseInstance } from '@/lib/firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import useProjectStore from '@/store/useProjectStore'
import { toast } from '@/store/useToastStore'
import InteractiveButton from '@/components/ui/InteractiveButton'

export default function AuthModal({ onClose }) {
  const { setUser } = useProjectStore()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { auth, initialized } = getFirebaseInstance()

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)
    if (!initialized) {
      setError('Firebase is not initialized properly. Click settings to configure.')
      setLoading(false)
      return
    }

    try {
      const provider = new GoogleAuthProvider()
      const credential = await signInWithPopup(auth, provider)
      setUser({
        uid: credential.user.uid,
        email: credential.user.email,
        displayName: credential.user.displayName || credential.user.email.split('@')[0],
      })
      toast.success('Successfully logged in')
      onClose()
    } catch (err) {
      console.error(err)
      setError(err.message || 'Google Sign-In failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!initialized) {
      setError('Firebase is not initialized properly. Click settings to configure.')
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
        toast.success('Account created successfully')
      } else {
        const credential = await signInWithEmailAndPassword(auth, email, password)
        setUser({
          uid: credential.user.uid,
          email: credential.user.email,
          displayName: credential.user.displayName || credential.user.email.split('@')[0],
        })
        toast.success('Successfully logged in')
      }
      onClose()
    } catch (err) {
      console.error(err)
      let msg = err.message || 'Authentication failed.'
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/user-not-found'
      ) {
        msg = 'Invalid email or password. Check your credentials or click "Sign up" to create an account.'
      }
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleGuestSignIn = () => {
    setUser({
      uid: 'guest-local',
      email: 'guest@local.dev',
      displayName: 'Guest User',
      isGuest: true,
    })
    toast.success('Signed in as Guest')
    onClose()
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
          <InteractiveButton className="btn-ghost" onClick={onClose} style={{ padding: '4px' }}><X size={16} /></InteractiveButton>
        </div>

        {/* Removed !initialized warning block */}

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

        {/* Google Sign In Button */}
        <InteractiveButton
          type="button"
          className="btn-secondary"
          onClick={handleGoogleSignIn}
          disabled={loading || !initialized}
          style={{
            width: '100%',
            padding: '11px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '16px',
            fontSize: '0.85rem',
            fontWeight: 600,
            opacity: initialized ? 1 : 0.4,
            cursor: initialized ? 'pointer' : 'not-allowed',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </InteractiveButton>

        <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0', color: 'var(--color-text-muted)' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
          <span style={{ padding: '0 8px', fontSize: '0.72rem', textTransform: 'uppercase' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
        </div>

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
                disabled={!initialized}
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
              disabled={!initialized}
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
              disabled={!initialized}
            />
          </div>

          <InteractiveButton
            className="btn-primary"
            type="submit"
            disabled={loading || !initialized}
            style={{ marginTop: '8px', padding: '11px', opacity: initialized ? 1 : 0.4 }}
          >
            {loading ? 'Processing…' : isSignUp ? 'Sign up' : 'Sign in'}
          </InteractiveButton>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            className="btn-ghost"
            style={{ padding: '0 4px', textDecoration: 'underline', color: 'var(--color-accent-text)' }}
            onClick={() => setIsSignUp(!isSignUp)}
            disabled={!initialized}
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0', color: 'var(--color-text-muted)' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
          <span style={{ padding: '0 8px', fontSize: '0.72rem', textTransform: 'uppercase' }}>guest</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
        </div>

        <InteractiveButton
          type="button"
          className="btn-secondary"
          onClick={handleGuestSignIn}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px dashed rgba(255,255,255,0.15)',
            fontSize: '0.82rem',
            fontWeight: 500,
          }}
        >
          Continue as Guest (Local Mode)
        </InteractiveButton>

        {/* Removed Configure Custom Firebase Project link */}
      </div>
    </div>
  )
}
