import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import MeshBackground from '@/components/ui/MeshBackground'
import LandingPage from '@/pages/LandingPage'
import WizardShell from '@/components/wizard/WizardShell'
import Dashboard from '@/components/dashboard/Dashboard'
import ProjectsDashboard from '@/pages/ProjectsDashboard'
import { getFirebaseInstance } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import useProjectStore from '@/store/useProjectStore'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/wizard" element={<WizardShell />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<ProjectsDashboard />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
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
      <AnimatedRoutes />
    </BrowserRouter>
  )
}
