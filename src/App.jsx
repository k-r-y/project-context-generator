import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import MeshBackground from '@/components/ui/MeshBackground'
import LandingPage from '@/pages/LandingPage'
import ToastProvider from '@/components/ui/ToastProvider'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { getFirebaseInstance } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import useProjectStore from '@/store/useProjectStore'

// Helper to retry dynamic imports if a new Vercel deployment changed chunk hashes (404 fallback)
function lazyWithRetry(componentImport) {
  return lazy(async () => {
    const pageReloaded = JSON.parse(sessionStorage.getItem('pcg_chunk_reloaded') || 'false')
    try {
      const component = await componentImport()
      sessionStorage.setItem('pcg_chunk_reloaded', 'false')
      return component
    } catch (error) {
      if (!pageReloaded) {
        sessionStorage.setItem('pcg_chunk_reloaded', 'true')
        window.location.reload()
      }
      throw error
    }
  })
}

// Lazy load secondary routes for fast initial access & smaller initial JS bundle
const WizardShell = lazyWithRetry(() => import('@/components/wizard/WizardShell'))
const Dashboard = lazyWithRetry(() => import('@/components/dashboard/Dashboard'))
const ProjectsDashboard = lazyWithRetry(() => import('@/pages/ProjectsDashboard'))

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingSpinner message="Preparing workspace..." />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/wizard" element={<WizardShell />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectsDashboard />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  )
}

export default function App() {
  const { setUser, firebaseConfig } = useProjectStore()

  // Track Firebase Authentication session changes
  useEffect(() => {
    const { auth, initialized } = getFirebaseInstance()
    if (!initialized || !auth) return

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        })
      } else {
        setUser(null)
      }
    })

    return () => unsubscribe()
  }, [firebaseConfig])

  return (
    <BrowserRouter>
      <MeshBackground />
      <ToastProvider />
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

