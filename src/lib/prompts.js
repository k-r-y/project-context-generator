/**
 * Prompt templates for each context document.
 * Each prompt enforces the exact structure, headings, and format
 * specified in the user's context format guidelines.
 * 
 * Per RULES.md: No filler/placeholder text. All output must be
 * immediately actionable and technically precise.
 */

// Removed computeCSSVariables as we are hardcoding Light/Dark themes now.

const fmtStack = (stack) => stack.join(', ') || 'Not specified'
const fmtList = (arr, fallback = 'None specified') =>
  arr?.length ? arr.map((x) => `- ${x}`).join('\n') : `- ${fallback}`

function generateFallbackPitch(targetAudience, mvpFeatures) {
  const features = mvpFeatures ? mvpFeatures.split(/[,\n]/).map(f => f.trim()).filter(Boolean) : []
  const featureString = features.length >= 2 
    ? `${features[0]} and ${features[1]}` 
    : (features[0] || 'core functionality')
  return `A specialized application designed for ${targetAudience || 'users'}, featuring ${featureString} to streamline workflows.`
}

// ─────────────────────────────────────────────────────────────────────────────
// PRD.md
// ─────────────────────────────────────────────────────────────────────────────
export function buildPRDPrompt(answers) {
  const { meta, pillars } = answers
  const fallbackPitch = meta.targetAudience 
    ? generateFallbackPitch(meta.targetAudience.split('\n').join(', '), meta.mvpFeatures)
    : generateFallbackPitch(meta.targetAudience, meta.mvpFeatures)
  
  const pitch = (meta.pitch && meta.pitch.trim().length > 0 && meta.pitch.trim() !== 'asdas') 
    ? meta.pitch 
    : fallbackPitch

  return `You are a senior product architect. Generate a Product Requirements Document (PRD) in Markdown using EXACTLY this structure. Be technically precise. No filler text. Do not use any emojis. Every field must be specific to this project and build upon the user's answers.

PROJECT NAME: ${meta.name}
PITCH: ${meta.pitch}
TARGET AUDIENCE: ${meta.targetAudience?.split('\\n').join(', ')}
BUSINESS GOALS: ${meta.businessGoals}
SUCCESS METRICS: ${meta.successMetrics}
MVP FEATURES (IN SCOPE): ${meta.mvpFeatures}
FUTURE RELEASES (OUT OF SCOPE): ${meta.outOfScope || 'None specified'}
STACK: ${fmtStack(pillars.architecture.stack)}
RENDERING: ${pillars.architecture.rendering || 'SPA'}
DATABASE: ${pillars.architecture.database || 'None'}
DEPLOYMENT: ${pillars.architecture.deployment || 'Vercel'}

Generate EXACTLY this structure with real, specific content (do not use any emojis):

# Product Requirements Document (PRD)

> **Elevator Pitch:** ${pitch}

## 1. Project Overview
- **Name:** ${meta.name}
- **Elevator Pitch:** ${pitch}
- **Target Audience:** ${meta.targetAudience?.split('\\n').join(', ')}

## 2. Goals & Success Metrics
- **Business Goals:**
  - ${meta.businessGoals}
- **Success Metrics:**
  - ${meta.successMetrics}

## 3. Scope & MVP
### In Scope (MVP)
${meta.mvpFeatures.split(/[,\n]/).map(f => f.trim()).filter(Boolean).map(f => `- ${f}`).join('\n')}

### Out of Scope (Future Releases)
${meta.outOfScope ? meta.outOfScope.split(/[,\n]/).map(f => f.trim()).filter(Boolean).map(f => `- ${f}`).join('\n') : '- None specified'}

## 4. Technical Requirements
- **Platform:** ${meta.platform || 'Not specified'} (${pillars.architecture.rendering || 'SPA'})
- **Stack:** ${fmtStack(pillars.architecture.stack)}
- **Integrations:** [List any specific third-party APIs or integrations required]
- **Performance:** [Specific performance metrics based on the target platform]
- **Hosting/Infrastructure:** ${pillars.architecture.deployment || 'Not specified'}

Be specific. Reference the actual stack and requirements. Do not write generic placeholder text. Do not use emojis.`
}

// ─────────────────────────────────────────────────────────────────────────────
// ARCHITECTURE.md
// ─────────────────────────────────────────────────────────────────────────────
export function buildArchitecturePrompt(answers) {
  const { meta, pillars } = answers
  return `You are a senior software architect. Generate an Architecture document in Markdown using EXACTLY this structure. Include specific versions, real folder trees, and complete data flow descriptions.

PROJECT NAME: ${meta.name}
ELEVATOR PITCH: ${meta.pitch || 'Not specified'}
STACK: ${fmtStack(pillars.architecture.stack)}
RENDERING: ${pillars.architecture.rendering}
DESIGN PATTERN: ${pillars.architecture.designPattern || 'Module-Based'}
DATABASE: ${pillars.architecture.database || 'None'}
DEPLOYMENT: ${pillars.architecture.deployment || 'Vercel'}
AUTH: ${pillars.architecture.authStrategy || 'None'}
DATA PATTERN: ${pillars.schema?.dataPattern || 'REST'}

Generate EXACTLY this structure:

# System Architecture — ${meta.name}

## 1. Top-Level Overview
| Layer | Technology | Notes |
| :--- | :--- | :--- |
| Frontend | [framework + version] | [why chosen] |
| Backend | [framework/environment] | [why chosen] |
| Database | [engine + hosting] | [why chosen] |
| Infrastructure | [hosting + CI/CD] | [deployment strategy] |

## 2. Design Methodology & Patterns
- **Core Pattern:** ${pillars.architecture.designPattern || 'Module-Based'} — [specific rationale for this project]
- **State Management:** [How frontend state is managed — tool, scope, persistence strategy]
- **API Design:** ${pillars.schema?.dataPattern || 'REST'} — [endpoint conventions, versioning, error format]
- **Authentication:** ${pillars.architecture.authStrategy || 'None'} — [implementation details, token lifecycle, refresh strategy]

## 3. Data Flow
1. **Client Request:** [How the client initiates a data request — user action → state update → API call]
2. **Routing/Middleware:** [Auth checks, validation, rate limiting, CORS]
3. **Controller/Service:** [Business logic layer — where it lives, how it's organized]
4. **Database Access:** [ORM/query pattern, connection pooling, caching layer if any]
5. **Response:** [Payload structure, error envelope, HTTP status conventions]

## 4. System Diagrams

\`\`\`mermaid
flowchart TD
    Client["Client (${pillars.architecture.stack[0] || 'React'})"]
    Router["Router / Middleware"]
    Service["Service Layer"]
    DB[("${pillars.architecture.database || 'Database'}")]
    
    Client -->|"${pillars.schema?.dataPattern || 'REST'} Request"| Router
    Router -->|"Validated + Authed"| Service
    Service -->|"Query"| DB
    DB -->|"Result"| Service
    Service -->|"Formatted Response"| Client
\`\`\`

## 5. Tech Stack
| Category | Technology | Version |
| :--- | :--- | :--- |
${pillars.architecture.stack.map((t) => `| [category] | ${t} | latest |`).join('\n')}

## 6. Folder Structure
\`\`\`text
${meta.name.toLowerCase().replace(/\s+/g, '-')}/
├── src/
│   ├── components/      # Reusable UI primitives
│   ├── features/        # Domain-specific feature modules
│   ├── pages/           # Route-level page components
│   ├── hooks/           # Custom React hooks
│   ├── store/           # State management slices
│   ├── lib/             # Utilities, API clients, helpers
│   ├── styles/          # Global CSS, design tokens
│   ├── App.jsx
│   └── main.jsx
├── public/
├── .env.example
└── package.json
\`\`\`

## 7. Setup Checklist
- [ ] \`npm create vite@latest ./ -- --template react\` — Scaffold the project
- [ ] \`npm install\` — Install all dependencies
- [ ] \`cp .env.example .env.local\` — Configure environment variables
- [ ] Configure ${pillars.architecture.database || 'database'} connection string
- [ ] \`git init && git commit -m "chore: initial scaffold"\`
- [ ] Deploy to ${pillars.architecture.deployment || 'Vercel'} and verify build

Make every section specific to the chosen stack. Fill in all table cells with real values.`
}

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMA.md
// ─────────────────────────────────────────────────────────────────────────────
export function buildSchemaPrompt(answers) {
  const { meta, pillars } = answers
  const database = pillars.architecture.database || 'None'
  
  if (database === 'None') {
    return `Generate EXACTLY this structure:

# Database Schema & Data Models — ${meta.name}

No database configured for this MVP. Client-side state management is used exclusively.`
  }

  const entities = pillars.schema?.entities || []

  let customSchemaContext = ''
  if (entities.length > 0) {
    customSchemaContext = `USER-DEFINED DATABASE TABLES (YOU MUST USE THESE EXACT TABLES, COLUMNS, TYPES, AND CONSTRAINTS):\n`
    entities.forEach((entity) => {
      customSchemaContext += `Table: ${entity.name}\n`
      entity.columns.forEach((col) => {
        customSchemaContext += `- Column: "${col.name}" | Type: ${col.type} | Constraints: ${col.constraints || 'None'} | Description: ${col.description || 'None'}\n`
      })
      customSchemaContext += `\n`
    })
    customSchemaContext += `Please generate the Mermaid ERD and the Markdown tables using exactly the tables and columns specified above. Do not invent other tables unless absolutely necessary to complete the core user requirements.\n\n`
  }

  return `You are a senior database architect. Generate a Schema document in Markdown using EXACTLY this structure. Include complete Mermaid ERD, full markdown tables with all columns, RLS policies, and migration strategy.

PROJECT NAME: ${meta.name}
DATABASE: ${pillars.architecture.database || 'Postgres'}
DATA PATTERN: ${pillars.schema?.dataPattern || 'REST'}
DB NAMING: ${pillars.rules?.dbNaming || 'snake_case (plural)'}

${customSchemaContext}
Generate EXACTLY this structure:

# Database Schema & Data Models — ${meta.name}

## 1. Entity Relationship Diagram (ERD)

[Render the Mermaid ERD code block here mapping all relationships]

## 2. Tables

[Generate markdown tables for all of the tables. Each table must have columns for Column, Type, Constraints, and Description, properly populated.]

## 3. Row Level Security (RLS) Policies

[Generate specific security rules/policies for each table. If Firestore, write Firestore Security Rules. If Postgres/Supabase, write standard SQL policies (ALTER TABLE ... ENABLE ROW LEVEL SECURITY; CREATE POLICY ...).]

## 4. Migrations & Seeding Strategy
- **Tool:** [Provide tool recommendations based on stack, e.g. Prisma Migrate, Supabase CLI, Drizzle, etc.]
- **Convention:** Migration files named YYYYMMDDHHMMSS_description.sql
- **Seeding:** Development seeds live in /seed/dev.sql
- **Rollback:** How to handle rollback.
- **Indexing:** Recommend indices for keys and frequently filtered columns.

Make every section specific to the chosen stack. Fill in all table cells with real values.`
}

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN.md
// ─────────────────────────────────────────────────────────────────────────────
export function buildDesignPrompt(answers) {
  const { meta, pillars } = answers
  const primaryColor = pillars.design.primaryColor || '#6366f1'
  const secondaryColor = pillars.design.secondaryColor || '#ec4899'
  const font = pillars.design.typography || 'Inter'
  const vibe = pillars.design.vibe || 'Dark Premium'
  const cssArch = (pillars.design.cssArchitecture || []).join(', ') || 'Tailwind CSS'
  const compLib = (pillars.design.componentLibrary || []).join(', ') || 'None'
  const iconSet = pillars.design.iconSet || 'None'
  const gridMath = pillars.design.gridMath || 'fluid-modular'
  const baseTheme = pillars.design.baseTheme || 'Dark'
  const surfaceTreatment = pillars.design.surfaceTreatment || 'Flat'
  const animationFeel = pillars.design.animationFeel || 'Swift/Linear'
  const elevationStyle = pillars.design.elevationStyle || 'Subtle Shadows'
  const typeScale = pillars.design.typeScale || 'utilitarian'

  let tokens = {}
  if (baseTheme === 'Light') {
    tokens = {
      primary: primaryColor,
      secondary: secondaryColor,
      bg: '#fafafa',
      surface: '#ffffff',
      surfaceElevated: '#f4f4f5',
      border: '#e4e4e7',
      textPrimary: '#18181b',
      textSecondary: '#52525b',
      textMuted: '#a1a1aa'
    }
  } else {
    // Dark theme
    tokens = {
      primary: primaryColor,
      secondary: secondaryColor,
      bg: '#09090b',
      surface: '#18181b',
      surfaceElevated: '#27272a',
      border: '#3f3f46',
      textPrimary: '#fafafa',
      textSecondary: '#a1a1aa',
      textMuted: '#52525b'
    }
  }

  let structuralOverrides = ''
  if (gridMath === 'tight-bento') {
    structuralOverrides = `
- Cards / Modals: \`16px\`
- Buttons / Inputs: \`10px\`
- Grid Gaps: \`16px\`
- Rule: Inner radius must equal outer radius minus padding
`
  } else if (gridMath === 'editorial-asymmetry') {
    structuralOverrides = `
- Cards / Modals: \`0px\`
- Buttons / Inputs: \`0px\`
- Grid Gaps: \`32px\` to \`64px\` (asymmetric)
- Borders: \`1px solid\` or harsh black lines
`
  } else {
    structuralOverrides = `
- Cards / Modals: \`12px\`
- Buttons / Inputs: \`8px\`
- Grid Gaps: \`24px\`
`
  }

  let animationDesc = 'Default transitions.'
  if (animationFeel === 'Swift/Linear') {
    animationDesc = 'Snappy & Direct. `cubic-bezier(0.4, 0, 0.2, 1)`, max 150ms. Zero bounce.'
  } else if (animationFeel === 'Bouncy/Spring') {
    animationDesc = 'Spring Physics. High bounce, natural elasticity.'
  }

  return `You are a senior design system architect. Generate a Design System document in Markdown using EXACTLY this structure. Include real hex codes, exact pixel values, and specific component rules based on Apple HIG and Google Material guidelines.

PROJECT NAME: ${meta.name}
DESIGN VIBE: ${vibe}
PRIMARY COLOR: ${primaryColor}
TYPOGRAPHY: ${font}
CSS ARCHITECTURE: ${cssArch}
COMPONENT LIBRARY: ${compLib}
ICON SET: ${iconSet}
STACK: ${fmtStack(pillars.architecture.stack)}
BASE THEME: ${baseTheme}
SURFACE TREATMENT: ${surfaceTreatment}
ELEVATION: ${elevationStyle}

Generate EXACTLY this structure:

# Design System & UI/UX Guidelines — ${meta.name}

## ⚠️ AI SYSTEM DIRECTIVES: PREVENTING GENERIC DESIGN
> **CRITICAL RULE FOR AI AGENTS:** You are explicitly forbidden from generating "AI Slop" designs (boring layouts, generic blue buttons, uninspired flat white backgrounds, ignoring physics). You must rigorously follow the mathematical layout rules, Apple HIG blurs, Material state layers, and exact animation curves below. Do not deviate.

## 1. Brand Identity & Theme
- **Vibe/Style:** ${vibe}
- **Base Theme:** ${baseTheme}
- **Core Concept:** [One precise sentence on the feel]

## 2. Component Design Tokens
- **CSS Architecture:** ${cssArch}
- **Component Library:** ${compLib}
- **Icon Set:** ${iconSet}

## 3. Color Palette & Material State Layers
- **Primary:** \`${tokens.primary}\` — Main interactive elements, CTAs
- **Secondary:** \`${tokens.secondary}\` — Supporting accents
- **Background:** \`${tokens.bg}\`
- **Surface:** \`${tokens.surface}\`
- **Surface Elevated:** \`${tokens.surfaceElevated}\`
- **Border:** \`${tokens.border}\`
- **Text Primary:** \`${tokens.textPrimary}\`
- **Text Secondary:** \`${tokens.textSecondary}\`
- **Text Muted:** \`${tokens.textMuted}\`

**State Layers (Opacity Modifiers):**
- **Hover:** 8% (0.08)
- **Focus:** 12% (0.12)
- **Pressed:** 16% (0.16)

## 4. Typography (Apple HIG & Material Mixed)
- **Headings (Display/H1):** Playfair Display, weights 700/800
- **Body & UI Text:** Inter, weights 400/500/600
- **Monospace:** JetBrains Mono, weight 400/500
- **Scale:**
  - Display: 3.75rem (60px) / weight 800
  - h1: 2.25rem (36px) / weight 800
  - h2: 1.5rem (24px) / weight 700
  - h3: 1.25rem (20px) / weight 600
  - h4: 1.125rem (18px) / weight 600
  - Body: 1rem (16px) / weight 400
  - Small: 0.875rem (14px) / weight 400
  - Caption: 0.75rem (12px) / weight 500

## 5. Spacing, Layout & Elevation
- **Grid System:** 12-column CSS Grid with 24px gutters (desktop), 16px (mobile)
- **Surface Treatment:** ${surfaceTreatment}
- **Border Radius:**
${structuralOverrides}
- **Material Elevation (Shadows):**
  - Level 1 (Cards): \`0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)\`
  - Level 2 (Dropdowns): \`0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)\`
  - Level 3 (Modals): \`0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)\`
- **HIG Blur Tokens (Backdrop Filters):**
  - Small (Tooltips): \`blur(8px)\`
  - Medium (Bento Cards): \`blur(16px)\`
  - Large (Modals): \`blur(24px)\`

## 6. Animations & Interactions
- **Animation Feel:** ${animationDesc}
- **Loading States:**
  - **Full Page Load:** ${pillars.design.loadingStyle?.page === 'skeleton' ? 'Skeleton loaders.' : pillars.design.loadingStyle?.page === 'spinner' ? 'Centered spinner.' : 'Top-edge progress bar.'}
  - **Data Fetching:** ${pillars.design.loadingStyle?.component === 'skeleton' ? 'Skeleton loaders.' : pillars.design.loadingStyle?.component === 'spinner' ? 'Centered spinner.' : 'Top-edge progress bar.'}
  - **Action:** ${pillars.design.loadingStyle?.action === 'skeleton' ? 'Skeleton loaders.' : pillars.design.loadingStyle?.action === 'spinner' ? 'Spinner inside the button.' : 'Top-edge progress bar.'}
- **Micro-interactions:** Enforce physics on all hover/active states using State Layers.
- **Rules:**
  - Never animate \`width\`, \`height\`, \`margin\`, \`top\`, \`left\` — use \`transform\` only.
  - All animations must respect \`prefers-reduced-motion\` media query.
`
}

// ───────────────────────────────────────────────────────────────────────────m"J
// ──
// RULES.md
// ─────────────────────────────────────────────────────────────────────────────
export function buildRulesPrompt(answers) {
  const { meta, pillars } = answers
  const lang = pillars.rules?.language || 'TypeScript'
  const testing = pillars.rules?.testing || 'Vitest'
  const fileNaming = pillars.rules?.fileNaming || 'kebab-case'
  const dbNaming = pillars.rules?.dbNaming || 'snake_case (plural)'
  const errorHandling = pillars.rules?.errorHandling || 'Centralized try/catch'
  return `You are a lead engineer enforcing code quality standards. Generate a Coding Standards & Implementation Rules document in Markdown using EXACTLY this structure. Be opinionated and specific — every rule must explain WHY it exists.

PROJECT NAME: ${meta.name}
LANGUAGE: ${lang}
TESTING: ${testing}
FILE NAMING: ${fileNaming}
DB NAMING: ${dbNaming}
ERROR HANDLING: ${errorHandling}
STACK: ${fmtStack(pillars.architecture.stack)}
DESIGN PATTERN: ${pillars.architecture.designPattern || 'Module-Based'}
ANTI-PATTERNS TO PROHIBIT:
${fmtList(pillars.rules?.antiPatterns)}
EXTRA CONSTRAINTS: ${pillars.rules?.extraConstraints || 'None'}

Generate EXACTLY this structure:

# Coding Standards & Implementation Rules — ${meta.name}

## 1. Core Principles
- **SOLID:** Code must adhere strictly to SOLID principles (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion). Every class/module should have one reason to change.
- **KISS:** Keep It Simple, Stupid. Ship the simplest implementation that satisfies the requirement. Never add abstractions preemptively.
- **DRY (Strict):** Do Not Repeat Yourself. If a function, query, or UI pattern is repeated **4 times or more**, it MUST be abstracted into a shared utility, hook, or service. No exceptions.

## 2. Naming Conventions
- **Files:** \`${fileNaming}\` — e.g., \`user-profile.${lang === 'TypeScript' ? 'tsx' : 'jsx'}\`, \`auth-service.${lang === 'TypeScript' ? 'ts' : 'js'}\`
- **Variables/Functions:** \`camelCase\` — e.g., \`getUserById\`, \`isLoading\`, \`handleSubmit\`
- **Classes/Models:** \`PascalCase\` — e.g., \`UserService\`, \`AuthController\`
- **Constants:** \`SCREAMING_SNAKE_CASE\` — e.g., \`MAX_RETRY_COUNT\`, \`API_BASE_URL\`
- **Database Tables:** \`${dbNaming}\` — e.g., \`user_profiles\`, \`order_items\`
- **Database Columns:** \`snake_case\` — e.g., \`created_at\`, \`user_id\`
- **CSS/Tailwind:** Use semantic class names in custom CSS; never use arbitrary Tailwind values

## 3. Error Handling
- **Strategy:** ${errorHandling}
- **Backend:** All async route handlers wrapped in try/catch. Errors returned as standardized JSON: \`{ "success": false, "error": { "code": "ERROR_CODE", "message": "User-facing message" } }\`
- **Frontend:** Use Error Boundaries at the page level. Surface errors as toast notifications — never expose raw error stack traces to users.
- **Logging:** Use structured logging (e.g., \`pino\`, \`winston\`). Never use bare \`console.log\` in production code.
- **Rules:**
  - Never swallow errors silently in catch blocks
  - Always log the full error server-side; send only a sanitized message client-side
  - All promise chains must have \`.catch()\` or be in an async/await try/catch

## 4. Anti-Patterns (AVOID AT ALL COSTS)
${pillars.rules?.antiPatterns?.length
  ? pillars.rules.antiPatterns.map((p, i) => `${i + 1}. **${p}** — Violates ${['SRP', 'DRY', 'KISS', 'OCP', 'SRP'][i % 5]} principle. Creates coupling and makes the codebase resistant to change.`).join('\n')
  : `1. **Prop drilling beyond 2 levels** — Violates encapsulation. Use state management instead.
2. **Monolithic components > 150 lines** — Violates SRP. Break into atomic components.
3. **Inline styles** — Bypasses the design token system. Use CSS classes.
4. **Magic strings/numbers** — Violates maintainability. Extract to named constants.
5. **any/unknown types (${lang})** — Defeats type safety. Always define explicit types.`}

## 5. Commit & Pull Request Guidelines
- **Format:** Conventional Commits — \`type(scope): description\`
- **Types:** \`feat\`, \`fix\`, \`refactor\`, \`chore\`, \`docs\`, \`test\`, \`perf\`, \`style\`
- **Examples:** \`feat(auth): add JWT refresh token rotation\`, \`fix(api): handle null user_id in orders query\`
- **Branch Naming:** \`feat/description\`, \`fix/description\`, \`chore/description\`
- **PR Review Checklist:**
  - [ ] No hardcoded credentials or API keys
  - [ ] ${lang === 'TypeScript' ? 'No `any` types — all types strictly defined' : 'No undeclared variables — use ESLint'}
  - [ ] All async operations handle loading, error, and empty states
  - [ ] Component/function does not exceed 150 lines
  - [ ] Passes linter and all tests: \`npm run lint && npm run test\`
  - [ ] DRY threshold not violated — no logic repeated 4+ times without abstraction

Be opinionated. Every rule must explain WHY it exists, not just WHAT it is.`
}

// ─────────────────────────────────────────────────────────────────────────────
// Metrics extractor from Architecture setup checklist
// ─────────────────────────────────────────────────────────────────────────────
export function extractMetricsFromOutputs(answers) {
  const mvpString = answers?.meta?.mvpFeatures || ''
  const features = mvpString.split(/[\n,]/).map(f => f.trim()).filter(Boolean)
  const metrics = []

  if (features.length > 0) {
    features.forEach((feature, i) => {
      metrics.push({
        id: `feature-metric-${i}`,
        text: `Implement: ${feature}`,
        description: 'Core MVP feature requirement',
        done: false,
      })
    })
  } else {
    const fallbacks = [
      { text: 'Initialize project with chosen framework', description: 'Run the scaffold command' },
      { text: 'Configure environment variables', description: 'Copy .env.example to .env.local' },
      { text: 'Set up version control', description: 'git init && initial commit' },
      { text: 'Configure linting and formatting', description: 'ESLint + Prettier setup' },
      { text: 'Set up testing framework', description: 'Install and configure test runner' },
      { text: 'Configure deployment pipeline', description: 'Connect repo to hosting platform' },
    ]
    fallbacks.forEach(({ text, description }, i) => {
      metrics.push({ id: `metric-${i}`, text, description, done: false })
    })
  }

  return metrics
}
