import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Hardcoded configuration baked directly in
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDCNrDWviQD52nTYmoD4FINVCUXVqWGzgE",
  authDomain: "project-context-generator.firebaseapp.com",
  projectId: "project-context-generator",
  storageBucket: "project-context-generator.firebasestorage.app",
  messagingSenderId: "304014249248",
  appId: "1:304014249248:web:702c68c0ac2f83d9ce5b45"
}

export function getFirebaseInstance() {
  try {
    const app = getApps().length === 0 ? initializeApp(FIREBASE_CONFIG) : getApp()
    const auth = getAuth(app)
    const db = getFirestore(app)
    return { auth, db, initialized: true }
  } catch (err) {
    console.error('Firebase initialization failed:', err)
    return { auth: null, db: null, initialized: false }
  }
}

