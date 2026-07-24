import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import useProjectStore from '@/store/useProjectStore'

// Default fallback mock configuration or user-saved config
export function getFirebaseInstance() {
  const state = useProjectStore.getState()
  const config = state.firebaseConfig

  if (!config) {
    return { auth: null, db: null, initialized: false }
  }

  try {
    const app = getApps().length === 0 ? initializeApp(config) : getApp()
    const auth = getAuth(app)
    const db = getFirestore(app)
    return { auth, db, initialized: true }
  } catch (err) {
    console.error('Firebase initialization failed:', err)
    return { auth: null, db: null, initialized: false }
  }
}
