import { useState, useEffect, useRef } from 'react'

/**
 * Character-by-character typewriter effect.
 * @param {string} text - The full text to type out
 * @param {number} speed - Milliseconds per character (default: 45)
 * @param {number} delay - Initial delay in ms before starting (default: 0)
 * @param {string} className - CSS classes for the text element
 * @param {boolean} showCursor - Whether to show the blinking cursor (default: true)
 */
export default function TypewriterText({
  text = '',
  speed = 45,
  delay = 0,
  className = '',
  showCursor = true,
}) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const indexRef = useRef(0)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    indexRef.current = 0

    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        indexRef.current += 1
        setDisplayed(text.slice(0, indexRef.current))
        if (indexRef.current >= text.length) {
          clearInterval(interval)
          setDone(true)
        }
      }, speed)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(startTimeout)
  }, [text, speed, delay])

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{displayed}</span>
      {showCursor && (
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            width: '2px',
            height: '1.1em',
            background: 'currentColor',
            marginLeft: '2px',
            verticalAlign: 'text-bottom',
            animation: done ? 'none' : undefined,
            opacity: done ? 0 : 1,
            transition: 'opacity 0.3s ease',
            borderRadius: '1px',
          }}
          className={done ? '' : 'animate-pulse'}
        />
      )}
    </span>
  )
}
