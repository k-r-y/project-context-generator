import { motion } from 'framer-motion'
import { ShieldAlert } from 'lucide-react'
import QuestionCard from '../QuestionCard'
import ChipSelector from '../ChipSelector'
import useProjectStore from '@/store/useProjectStore'
import { staggerContainer, staggerItem } from '@/lib/animationVariants'

const COMPLIANCE_OPTIONS = ['GDPR', 'HIPAA', 'SOC2', 'PCI-DSS', 'None']
const DATA_PROTECTION_OPTIONS = ['Encryption at Rest', 'E2E Encryption', 'Tokenization', 'None']
const API_SECURITY_OPTIONS = ['Rate Limiting', 'CORS', 'WAF', 'IP Allowlisting', 'None']
const VULNERABILITY_OPTIONS = ['CSRF Prevention', 'XSS Sanitization', 'SQLi Protection', 'Session Lockout (30m Idle)', 'None']

export default function StepSecurity({ onNext, onBack }) {
  const { pillars, toggleSecurityItem } = useProjectStore()
  const { compliance = [], dataProtection = [], apiSecurity = [], vulnerabilityProtection = [] } = pillars.security || {}

  const canProceed = 
    compliance.length > 0 &&
    dataProtection.length > 0 &&
    apiSecurity.length > 0 &&
    vulnerabilityProtection.length > 0

  return (
    <QuestionCard>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}
      >
        <motion.div variants={staggerItem} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px', height: '36px', borderRadius: '9px',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <ShieldAlert size={18} color="white" />
          </div>
          <span className="badge badge-brand">Security</span>
        </motion.div>

        <motion.div variants={staggerItem}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '6px' }}>
            Secure your application
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
            Choose the compliance standards and protection mechanisms that apply to your project.
          </p>
        </motion.div>

        {/* Compliance */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
            COMPLIANCE STANDARDS
          </label>
          <ChipSelector
            options={COMPLIANCE_OPTIONS}
            selected={compliance}
            onToggle={(val) => toggleSecurityItem('compliance', val)}
          />
        </motion.div>

        {/* Data Protection */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
            DATA PROTECTION
          </label>
          <ChipSelector
            options={DATA_PROTECTION_OPTIONS}
            selected={dataProtection}
            onToggle={(val) => toggleSecurityItem('dataProtection', val)}
          />
        </motion.div>

        {/* API Security */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
            API SECURITY
          </label>
          <ChipSelector
            options={API_SECURITY_OPTIONS}
            selected={apiSecurity}
            onToggle={(val) => toggleSecurityItem('apiSecurity', val)}
          />
        </motion.div>

        {/* Vulnerability Protection */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
            VULNERABILITY PROTECTION
          </label>
          <ChipSelector
            options={VULNERABILITY_OPTIONS}
            selected={vulnerabilityProtection}
            onToggle={(val) => toggleSecurityItem('vulnerabilityProtection', val)}
          />
        </motion.div>

        <motion.div variants={staggerItem} style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
          <button className="btn-ghost" onClick={onBack} style={{ flex: 1 }}>← Back</button>
          <motion.button
            className="btn-primary"
            onClick={onNext}
            disabled={!canProceed}
            style={{ flex: 2, opacity: canProceed ? 1 : 0.4, cursor: canProceed ? 'pointer' : 'not-allowed' }}
            whileTap={canProceed ? { scale: 0.97 } : {}}
          >
            <span>Continue →</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </QuestionCard>
  )
}
