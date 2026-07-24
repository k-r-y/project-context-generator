import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import useProjectStore from '@/store/useProjectStore'

// Default fallback configuration baked directly in to run on any device out-of-the-box
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDCNrdWvIQD52nTYmoD4FINVCUXvqWGzgE",
  authDomain: "project-context-generator.firebaseapp.com",
  projectId: "project-context-generator",
  storageBucket: "project-context-generator.firebasestorage.app",
  messagingSenderId: "304014249248",
  appId: "1:304014249248:web:702c68c0ac2f83d9ce5b45"
}

export function getFirebaseInstance() {
  const state = useProjectStore.getState()
  const config = state.firebaseConfig || DEFAULT_FIREBASE_CONFIG

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
