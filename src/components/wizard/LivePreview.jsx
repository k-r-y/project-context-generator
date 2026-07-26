import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import useProjectStore from '@/store/useProjectStore'

function buildPreviewContent(projectMeta, pillars, currentStep) {
  const { name, pitch, targetAudience, businessGoals, successMetrics, mvpFeatures, outOfScope } = projectMeta
  const { architecture, design, rules } = pillars

  if (!name && !pitch) return '_Start answering questions to see a preview…_'

  let preview = `# ${name || 'Untitled Project'}\n\n`
  if (pitch) preview += `> **Elevator Pitch:** ${pitch}\n\n`

  // PRD step preview details
  if (currentStep >= 1) {
    preview += `## Product Scope\n`
    if (targetAudience) preview += `- **Target Audience:** ${targetAudience}\n`
    if (businessGoals) {
      preview += `\n### Business Goals:\n`
      businessGoals.split('\n').map(g => g.trim()).filter(Boolean).forEach(g => {
        preview += `- ${g}\n`
      })
    }
    if (successMetrics) {
      preview += `\n### Success Metrics:\n`
      successMetrics.split('\n').map(m => m.trim()).filter(Boolean).forEach(m => {
        preview += `- ${m}\n`
      })
    }
    if (mvpFeatures) {
      preview += `\n### MVP Features (In Scope):\n`
      mvpFeatures.split(/[,\n]/).map(f => f.trim()).filter(Boolean).forEach(f => {
        preview += `- ${f}\n`
      })
    }
    if (outOfScope) {
      preview += `\n### Future Releases (Out of Scope):\n`
      outOfScope.split(/[,\n]/).map(f => f.trim()).filter(Boolean).forEach(f => {
        preview += `- ${f}\n`
      })
    }
    preview += `\n`
  }

  if (currentStep >= 2 && architecture.stack.length > 0) {
    preview += `## Stack\n${architecture.stack.map((s) => `- ${s}`).join('\n')}\n\n`
  }
  if (currentStep >= 3 && architecture.rendering) {
    preview += `## Architecture\n**${architecture.rendering}** — ${architecture.designPattern || 'pattern not selected'}\n\n`
  }
  if (currentStep >= 4 && design.vibe) {
    const shadesBadges = design.shades?.length ? design.shades.map(s => `\`${s}\``).join(' ') : '`#ffffff` `#111827`'
    const priBadge = design.primaryColor ? `\`${design.primaryColor}\`` : ''
    const secBadge = design.secondaryColor ? `\`${design.secondaryColor}\`` : ''
    
    preview += `## Design\n**${design.vibe}**\n`
    preview += `- **Shades:** ${shadesBadges}\n`
    if (priBadge) preview += `- **Primary:** ${priBadge}\n`
    if (secBadge) preview += `- **Secondary:** ${secBadge}\n`
    preview += `\n`
    
    const primaryFont = design.typography === 'Other' && design.customTypography ? design.customTypography : design.typography
    const secondaryFont = design.secondaryTypography === 'Other' && design.customSecondaryTypography ? design.customSecondaryTypography : design.secondaryTypography
    if (primaryFont || secondaryFont) {
      preview += `**Typography:** ${primaryFont || 'Default'}${secondaryFont ? ` / ${secondaryFont}` : ''}\n\n`
    }
    
    if (design.uiLibraries?.length) {
      const libs = design.uiLibraries.map(l => l === 'Other' && design.customUiLibrary ? design.customUiLibrary : l)
      preview += `**UI Libraries:** ${libs.join(', ')}\n\n`
    }
    
    if (design.iconSet) {
      const icon = design.iconSet === 'Other' && design.customIconSet ? design.customIconSet : design.iconSet
      preview += `**Iconography:** ${icon}\n\n`
    }

    if (design.layoutConcepts?.length) {
      const layouts = design.layoutConcepts.map(l => l === 'Other' && design.customLayoutConcept ? design.customLayoutConcept : l)
      preview += `**Layout:** ${layouts.join(', ')}\n\n`
    }
    
    if (design.spacing || design.roundedCorners) {
      preview += `**Spacing:** ${design.spacing || 'Default'} · **Corners:** ${design.roundedCorners || 'Default'}\n\n`
    }
  }
  if (currentStep >= 5 && architecture.database) {
    preview += `## Database\n**${architecture.database}**\n\n`
    const entities = pillars.schema?.entities || []
    if (entities.length > 0) {
      preview += `### Schema Tables:\n`
      entities.forEach((entity) => {
        preview += `- **${entity.name}** (${entity.columns.length} columns)\n`
      })
      preview += `\n`
    }
  }
  if (currentStep >= 6 && rules.language) {
    preview += `## Rules\n**${rules.language}** · ${rules.testing || 'no test runner'} · ${rules.fileNaming || 'default naming'}\n\n`
  }
  if (currentStep >= 7) {
    preview += `---\n_Ready to generate 5 context files._\n`
  }
  return preview
}

export default function LivePreview() {
  const { projectMeta, pillars, currentStep, generatedOutputs } = useProjectStore()
  const content = generatedOutputs.prd || buildPreviewContent(projectMeta, pillars, currentStep)

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        flexShrink: 0,
      }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-success)', flexShrink: 0 }} />
        <span className="label-xs">Preview</span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={content.slice(0, 100)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <div className="markdown-render" style={{ fontSize: '0.78rem' }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
