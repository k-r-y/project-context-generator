import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Copy, Download, Archive } from 'lucide-react'
import { copyToClipboard, downloadMarkdown, downloadAllAsZip, DOC_META } from '@/lib/downloadUtils'
import useProjectStore from '@/store/useProjectStore'

export default function ActionBar({ activeDoc, content }) {
  const { projectMeta, generatedOutputs } = useProjectStore()
  const [flash, setFlash] = useState(null) // 'copy' | 'zip' | null

  const hit = (key, cb) => async () => {
    await cb()
    setFlash(key)
    setTimeout(() => setFlash(null), 2000)
  }

  const handleCopy = hit('copy', () => copyToClipboard(content))
  const handleDownload = () => downloadMarkdown(content, DOC_META[activeDoc]?.filename)
  const handleZip = hit('zip', () => downloadAllAsZip(generatedOutputs, projectMeta.name))

  const Btn = ({ id, icon: Icon, label, successLabel, onClick, isPrimary }) => (
    <motion.button
      className={isPrimary ? 'btn-primary' : 'btn-ghost'}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: isPrimary ? '7px 14px' : '7px 10px', fontSize: '0.8rem' }}
      aria-label={label}
    >
      <AnimatePresence mode="wait">
        {flash === id
          ? <motion.span key="ok" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Check size={13} /></motion.span>
          : <motion.span key="ic" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Icon size={13} /></motion.span>
        }
      </AnimatePresence>
      <span className="hide-mobile">{flash === id ? successLabel : label}</span>
    </motion.button>
  )

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <Btn id="copy" icon={Copy} label="Copy" successLabel="Copied" onClick={handleCopy} />
      <Btn id="dl" icon={Download} label={DOC_META[activeDoc]?.filename} successLabel="Saved" onClick={handleDownload} />
      <Btn id="zip" icon={Archive} label="Download all" successLabel="Downloaded!" onClick={handleZip} isPrimary />
    </div>
  )
}
