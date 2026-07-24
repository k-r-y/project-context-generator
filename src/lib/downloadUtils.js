import JSZip from 'jszip'

/**
 * Copy text to clipboard with fallback for older browsers.
 * Returns a promise that resolves to true on success.
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textarea)
    return success
  }
}

/**
 * Download a single markdown file.
 * @param {string} content - The markdown content
 * @param {string} filename - e.g. 'DESIGN.md'
 */
export function downloadMarkdown(content, filename) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Download all 5 context files as a ZIP archive.
 * @param {Object} outputs - { prd, architecture, design, rules, schema }
 * @param {string} projectName - Used as the ZIP file name
 */
export async function downloadAllAsZip(outputs, projectName) {
  const zip = new JSZip()
  const folder = zip.folder('context')

  const fileMap = {
    prd: 'PRD.md',
    architecture: 'ARCHITECTURE.md',
    design: 'DESIGN.md',
    rules: 'RULES.md',
    schema: 'SCHEMA.md',
  }

  for (const [key, filename] of Object.entries(fileMap)) {
    if (outputs[key]) {
      folder.file(filename, outputs[key])
    }
  }

  const blob = await zip.generateAsync({ type: 'blob' })
  const safeName = projectName?.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'project'
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${safeName}-context.zip`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Map document key to display info (absolutely no emojis).
 */
export const DOC_META = {
  prd: { label: 'PRD', filename: 'PRD.md', color: '#6366f1' },
  architecture: { label: 'Architecture', filename: 'ARCHITECTURE.md', color: '#8b5cf6' },
  design: { label: 'Design', filename: 'DESIGN.md', color: '#a78bfa' },
  rules: { label: 'Rules', filename: 'RULES.md', color: '#c084fc' },
  schema: { label: 'Schema', filename: 'SCHEMA.md', color: '#e879f9' },
}
