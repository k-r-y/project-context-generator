import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function RippleButton({ children, className, onClick, style, disabled, type = 'button', ...props }) {
  const [ripples, setRipples] = useState([])
  const buttonRef = useRef(null)

  const handleClick = (e) => {
    if (disabled) return
    const rect = buttonRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()
    
    setRipples((prev) => [...prev, { x, y, id }])
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 600)

    if (onClick) onClick(e)
  }

  return (
    <button
      ref={buttonRef}
      type={type}
      className={className}
      onClick={handleClick}
      disabled={disabled}
      style={{ position: 'relative', overflow: 'hidden', ...style }}
      {...props}
    >
      <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'inherit' }}>
        {children}
      </span>
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: ripple.x,
              top: ripple.y,
              width: '100px',
              height: '100px',
              marginLeft: '-50px',
              marginTop: '-50px',
              backgroundColor: 'rgba(255,255,255,0.3)',
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: 0
            }}
          />
        ))}
      </AnimatePresence>
    </button>
  )
}
