import { motion, AnimatePresence } from 'framer-motion'
import { useToastStore } from '@/store/useToastStore'
import { CheckCircle2, XCircle, Info } from 'lucide-react'

export default function ToastProvider() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px',
      display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 9999,
      pointerEvents: 'none'
    }}>
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            style={{
              pointerEvents: 'auto',
              background: 'rgba(20,20,20,0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '12px 16px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              color: 'white',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer'
            }}
            onClick={() => removeToast(t.id)}
          >
            {t.type === 'success' && <CheckCircle2 size={18} color="var(--color-success)" />}
            {t.type === 'error' && <XCircle size={18} color="var(--color-danger)" />}
            {t.type === 'info' && <Info size={18} color="var(--color-accent)" />}
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
