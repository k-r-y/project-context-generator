import React from 'react'

/**
 * ReactBits inspired ShinyText component.
 * Renders text with a shimmering animated gradient effect.
 */
export default function ShinyText({
  text,
  disabled = false,
  speed = 4,
  className = '',
  style = {},
}) {
  return (
    <span
      className={`shiny-text ${className}`}
      style={{
        animationDuration: `${speed}s`,
        animationPlayState: disabled ? 'paused' : 'running',
        ...style,
      }}
    >
      {text}
    </span>
  )
}
