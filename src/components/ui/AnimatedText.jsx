import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '@/lib/animationVariants'

/**
 * Animates children in with a word-by-word stagger effect.
 * @param {string} text - The text to animate
 * @param {string} className - Additional CSS classes for each word span
 * @param {number} delay - Initial delay before animation starts
 */
export default function AnimatedText({ text = '', className = '', delay = 0 }) {
  const words = text.split(' ')

  return (
    <motion.span
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.25em' }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={staggerItem}
          className={className}
          style={{ display: 'inline-block' }}
          transition={{ delay: delay + i * 0.05 }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}
