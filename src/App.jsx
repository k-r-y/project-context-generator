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

// Lazy load secondary routes for fast initial access & smaller initial JS bundle
const WizardShell = lazy(() => import('@/components/wizard/WizardShell'))
const Dashboard = lazy(() => import('@/components/dashboard/Dashboard'))
const ProjectsDashboard = lazy(() => import('@/pages/ProjectsDashboard'))

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

