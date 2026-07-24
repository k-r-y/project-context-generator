import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import MeshBackground from '@/components/ui/MeshBackground'
import LandingPage from '@/pages/LandingPage'
import WizardShell from '@/components/wizard/WizardShell'
import Dashboard from '@/components/dashboard/Dashboard'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/wizard" element={<WizardShell />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <MeshBackground />
      <AnimatedRoutes />
    </BrowserRouter>
  )
}
