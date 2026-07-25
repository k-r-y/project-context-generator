import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import useProjectStore from '@/store/useProjectStore'

function buildPreviewContent(projectMeta, pillars, currentStep) {
  const { name, pitch, targetAudience, businessGoals, successMetrics, mvpFeatures, outOfScope } = projectMeta
  const { architecture, design, rules } = pillars

  if (!name) return '_Start answering questions to see a preview…_'

  let preview = `# ${name}\n\n`
  if (pitch) preview += `> ${pitch}\n\n`

  // PRD step preview details
  if (currentStep >= 1) {
    preview += `## Product Scope\n`
    if (targetAudience) preview += `- **Target Audience:** ${targetAudience}\n`
    if (businessGoals) preview += `- **Business Goals:** ${businessGoals}\n`
    if (successMetrics) preview += `- **Success Metrics:** ${successMetrics}\n`
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
    preview += `## Design\n**${design.vibe}**${design.primaryColor ? ` · \`${design.primaryColor}\`` : ''}\n\n`
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
