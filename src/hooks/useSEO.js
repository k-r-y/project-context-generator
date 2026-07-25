import { useEffect } from 'react'

/**
 * Custom hook to update document SEO attributes dynamically per route
 * @param {Object} options
 * @param {string} options.title - Document title
 * @param {string} [options.description] - Meta description
 * @param {string} [options.canonical] - Canonical URL path
 */
export default function useSEO({ title, description, canonical }) {
  useEffect(() => {
    // 1. Update Title
    if (title) {
      document.title = title
    }

    // 2. Update Description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]')
      if (!metaDesc) {
        metaDesc = document.createElement('meta')
        metaDesc.setAttribute('name', 'description')
        document.head.appendChild(metaDesc)
      }
      metaDesc.setAttribute('content', description)

      // Also update OG description
      let ogDesc = document.querySelector('meta[property="og:description"]')
      if (ogDesc) {
        ogDesc.setAttribute('content', description)
      }
    }

    // 3. Update Canonical link
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]')
      const fullUrl = `https://project-context-generator.web.app${canonical}`
      if (!canonicalLink) {
        canonicalLink = document.createElement('link')
        canonicalLink.setAttribute('rel', 'canonical')
        document.head.appendChild(canonicalLink)
      }
      canonicalLink.setAttribute('href', fullUrl)

      // Update OG URL
      let ogUrl = document.querySelector('meta[property="og:url"]')
      if (ogUrl) {
        ogUrl.setAttribute('content', fullUrl)
      }
    }
  }, [title, description, canonical])
}
