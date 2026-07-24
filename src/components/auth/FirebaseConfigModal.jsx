import { useState } from 'react'
import useProjectStore from '@/store/useProjectStore'

export default function FirebaseConfigModal({ onClose }) {
  const { firebaseConfig, setFirebaseConfig } = useProjectStore()
  const [configText, setConfigText] = useState(
    firebaseConfig ? JSON.stringify(firebaseConfig, null, 2) : ''
  )
  const [error, setError] = useState('')

  const handleSave = () => {
    setError('')
    if (!configText.trim()) {
      setFirebaseConfig(null)
      onClose()
      return
    }

    try {
      // Allow pasting direct JSON object from Firebase Console
      const parsed = JSON.parse(configText)
      if (!parsed.apiKey || !parsed.projectId) {
        throw new Error('Object must contain at least apiKey and projectId.')
      }
      setFirebaseConfig(parsed)
      onClose()
    } catch (err) {
      setError('Invalid JSON config object. Make sure you copy/paste the SDK config object from Firebase console.')
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
    }}>
      <div className="surface-elevated animate-fade-in-up" style={{ padding: '24px', maxWidth: '440px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 className="heading-md">Firebase Configuration</h2>
          <button className="btn-ghost" onClick={onClose} style={{ padding: '4px' }}>✕</button>
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
          Paste the web app configuration JSON object from your Firebase Console settings to enable cloud project storage and authentication.
        </p>

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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
          <label className="label-xs">Firebase SDK Config JSON</label>
          <textarea
            className="input-glass font-mono"
            style={{ minHeight: '160px', fontSize: '0.75rem' }}
            placeholder={`{\n  "apiKey": "AIzaSy...",\n  "authDomain": "your-app.firebaseapp.com",\n  "projectId": "your-app-id",\n  "storageBucket": "your-app.appspot.com",\n  "messagingSenderId": "...",\n  "appId": "..."\n}`}
            value={configText}
            onChange={(e) => setConfigText(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyBetween: 'space-between', gap: '8px' }}>
          <button className="btn-ghost" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} style={{ flex: 2 }}>Save Config</button>
        </div>
      </div>
    </div>
  )
}
