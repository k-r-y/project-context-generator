import { AnimatePresence, motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function DocumentViewer({ content, docKey, isEditing, onEditChange }) {
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={docKey + (isEditing ? '-edit' : '-view')}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'absolute',
            inset: 0,
            overflowY: 'auto',
            padding: '24px 28px 48px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {isEditing ? (
            <textarea
              className="input-glass font-mono"
              style={{
                flex: 1,
                width: '100%',
                minHeight: '400px',
                resize: 'none',
                fontSize: '0.82rem',
                lineHeight: 1.55,
                background: 'rgba(255,255,255,0.01)',
                border: 'none',
                outline: 'none',
                padding: 0,
              }}
              value={content}
              onChange={(e) => onEditChange(e.target.value)}
              placeholder="Edit your markdown documentation context here..."
            />
          ) : content ? (
            <div className="markdown-render">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'rgba(255,255,255,0.2)',
                gap: '12px',
              }}
            >
              <span style={{ fontSize: '0.9rem' }}>No content generated</span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
