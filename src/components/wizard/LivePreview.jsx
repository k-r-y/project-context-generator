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
  if (targetAudience || businessGoals || successMetrics || mvpFeatures || outOfScope) {
    preview += `## Product Scope\n`
    if (targetAudience) preview += `- **Target Audience:** ${targetAudience.split('\\n').join(', ')}\n`
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

  if (architecture.stack?.length > 0) {
    preview += `## Stack\n${architecture.stack.map((s) => `- ${s}`).join('\n')}\n\n`
  }
  if (architecture.rendering || architecture.designPattern) {
    preview += `## Architecture\n**${architecture.rendering || 'None'}** — ${architecture.designPattern || 'None'}\n\n`
  }
  if (design.vibe) {
    const priBadge = design.primaryColor ? `\`${design.primaryColor}\`` : ''
    const secBadge = design.secondaryColor ? `\`${design.secondaryColor}\`` : ''
    
    preview += `## Design\n**${design.vibe}**\n`
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
    
    if (design.gridMath || design.surfaceStyle || design.interactionPhysics || design.typeScale) {
      preview += `**Engine Overrides:**\n`
      if (design.gridMath) preview += `- **Grid Math:** ${design.gridMath}\n`
      if (design.surfaceStyle) preview += `- **Surface Style:** ${design.surfaceStyle}\n`
      if (design.interactionPhysics) preview += `- **Physics:** ${design.interactionPhysics}\n`
      if (design.typeScale) preview += `- **Type Scale:** ${design.typeScale}\n`
      preview += `\n`
    }
    
    if (design.loadingStyle) {
      preview += `**Loading & Feedback:**\n`
      preview += `- **Page:** ${design.loadingStyle.page || 'none'}\n`
      preview += `- **Component:** ${design.loadingStyle.component || 'none'}\n`
      preview += `- **Action:** ${design.loadingStyle.action || 'none'}\n\n`
    }
  }
  if (architecture.database) {
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

  if (pillars.security?.compliance?.length || pillars.security?.dataProtection?.length || pillars.security?.apiSecurity?.length || pillars.security?.vulnerabilityProtection?.length) {
    preview += `## Security\n`
    if (pillars.security.compliance?.length) preview += `- **Compliance:** ${pillars.security.compliance.join(', ')}\n`
    if (pillars.security.dataProtection?.length) preview += `- **Data Protection:** ${pillars.security.dataProtection.join(', ')}\n`
    if (pillars.security.apiSecurity?.length) preview += `- **API Security:** ${pillars.security.apiSecurity.join(', ')}\n`
    if (pillars.security.vulnerabilityProtection?.length) preview += `- **Vulnerabilities:** ${pillars.security.vulnerabilityProtection.join(', ')}\n`
    preview += `\n`
  }

  if (rules.language) {
    preview += `## Rules\n`
    preview += `- **Language:** ${rules.language}\n`
    if (rules.testing) preview += `- **Testing:** ${rules.testing}\n`
    if (rules.fileNaming) preview += `- **File Naming:** ${rules.fileNaming}\n`
    if (rules.dbNaming) preview += `- **DB Naming:** ${rules.dbNaming}\n`
    if (rules.errorHandling) preview += `- **Error Handling:** ${rules.errorHandling}\n`
    if (rules.antiPatterns?.length) preview += `- **Anti-Patterns:** ${rules.antiPatterns.join(', ')}\n`
    if (rules.extraConstraints) preview += `- **Constraints:** ${rules.extraConstraints}\n`
    preview += `\n`
  }
  if (currentStep >= 8) {
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
