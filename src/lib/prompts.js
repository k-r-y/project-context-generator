/**
 * Prompt templates for each context document.
 * Each prompt enforces the exact structure, headings, and format
 * specified in the user's context format guidelines.
 * 
 * Per RULES.md: No filler/placeholder text. All output must be
 * immediately actionable and technically precise.
 */

const fmtStack = (stack) => stack.join(', ') || 'Not specified'
const fmtList = (arr, fallback = 'None specified') =>
  arr?.length ? arr.map((x) => `- ${x}`).join('\n') : `- ${fallback}`

// ─────────────────────────────────────────────────────────────────────────────
// PRD.md
// ─────────────────────────────────────────────────────────────────────────────
export function buildPRDPrompt(answers) {
  const { meta, pillars } = answers
  return `You are a senior product architect. Generate a Product Requirements Document (PRD) in Markdown using EXACTLY this structure. Be technically precise. No filler text. Do not use any emojis. Every field must be specific to this project and build upon the user's answers.

PROJECT NAME: ${meta.name}
PITCH: ${meta.pitch}
TARGET AUDIENCE: ${meta.targetAudience}
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

## 1. Project Overview
- **Name:** ${meta.name}
- **Objective:** ${meta.pitch}
- **Target Audience:** ${meta.targetAudience}

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
    Client["🖥️ Client (${pillars.architecture.stack[0] || 'React'})"]
    Router["📡 Router / Middleware"]
    Service["⚙️ Service Layer"]
    DB[("🗄️ ${pillars.architecture.database || 'Database'}")]
    
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
  return `You are a senior database architect. Generate a Schema document in Markdown using EXACTLY this structure. Include complete Mermaid ERD, full markdown tables with all columns, RLS policies, and migration strategy.

PROJECT NAME: ${meta.name}
DATABASE: ${pillars.architecture.database || 'Postgres'}
DATA PATTERN: ${pillars.schema?.dataPattern || 'REST'}
DB NAMING: ${pillars.rules?.dbNaming || 'snake_case (plural)'}

Generate EXACTLY this structure:

# Database Schema & Data Models — ${meta.name}

## 1. Entity Relationship Diagram (ERD)

\`\`\`mermaid
erDiagram
    USERS {
        uuid id PK
        string email
        string role
        timestamp created_at
    }
    [ENTITY_2] {
        uuid id PK
        uuid user_id FK
        string name
        timestamp created_at
    }
    USERS ||--o{ [ENTITY_2] : "has many"
\`\`\`

## 2. Tables

### \`users\`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| \`id\` | UUID | Primary Key, Default: gen_random_uuid() | Unique identifier |
| \`email\` | VARCHAR(255) | Unique, Not Null | User's login email |
| \`role\` | ENUM('user','admin') | Default: 'user', Not Null | System permissions |
| \`created_at\` | TIMESTAMPTZ | Default: NOW(), Not Null | Record creation timestamp |
| \`updated_at\` | TIMESTAMPTZ | Default: NOW(), Not Null | Last update timestamp |

[Generate 2-3 more domain-specific tables for this project based on its purpose: ${meta.pitch}. Each table must have the full column definition with all 4 columns filled in the table format above.]

## 3. Row Level Security (RLS) Policies

### Table: \`users\`
- **Select:** Users can only view their own profile row (\`auth.uid() = id\`)
- **Update:** Users can update their own profile. Admins can update any row.
- **Insert:** Handled by auth trigger on signup — not exposed to client.
- **Delete:** Admin-only.

[Generate RLS policies for each domain table specific to ${meta.name}]

## 4. Migrations & Seeding Strategy
- **Tool:** [Prisma Migrate / Supabase CLI / Drizzle / raw SQL files]
- **Convention:** Migration files named \`YYYYMMDDHHMMSS_description.sql\`
- **Seeding:** Development seeds live in \`/seed/dev.sql\`. Never run in production.
- **Rollback:** Each migration must have a corresponding down migration.
- **Indexing:** Add indexes on all foreign key columns and frequently filtered columns (e.g., \`email\`, \`created_at\`, \`status\`).

Generate all table definitions with real column names relevant to "${meta.pitch}". No placeholder column names.`
}

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN.md
// ─────────────────────────────────────────────────────────────────────────────
export function buildDesignPrompt(answers) {
  const { meta, pillars } = answers
  const color = pillars.design.primaryColor || '#6366f1'
  const font = pillars.design.typography || 'Inter'
  const vibe = pillars.design.vibe || 'Dark Premium'
  return `You are a senior design system architect. Generate a Design System document in Markdown using EXACTLY this structure. Include real hex codes, exact pixel values, and specific component rules.

PROJECT NAME: ${meta.name}
DESIGN VIBE: ${vibe}
PRIMARY COLOR: ${color}
TYPOGRAPHY: ${font}
STACK: ${fmtStack(pillars.architecture.stack)}

Generate EXACTLY this structure:

# Design System & UI/UX Guidelines — ${meta.name}

## 1. Brand Identity & Theme
- **Vibe/Style:** ${vibe}
- **Core Concept:** [One precise sentence on the feel — e.g., "A premium dark interface using glassmorphism surfaces and indigo accent colors to convey trust and technical sophistication."]

## 2. Color Palette
- **Primary:** \`${color}\` — Main interactive elements, CTAs, active states
- **Secondary:** \`[computed complementary hex]\` — Supporting accents, hover states
- **Background:** \`#060614\` — Page base surface
- **Surface:** \`#0d0d1f\` — Card and panel backgrounds
- **Border:** \`rgba(255,255,255,0.08)\` — Subtle dividers and card borders
- **Text Primary:** \`#ffffff\` — Headings, critical labels
- **Text Secondary:** \`rgba(255,255,255,0.6)\` — Body text, descriptions
- **Text Muted:** \`rgba(255,255,255,0.3)\` — Placeholders, disabled labels
- **Semantic:**
  - Success: \`#22c55e\`
  - Warning: \`#f59e0b\`
  - Danger: \`#ef4444\`
  - Info: \`#38bdf8\`

## 3. Typography
- **Headings:** ${font}, weights 700/800
- **Body:** ${font}, weights 400/500
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

## 4. Spacing & Layout
- **Grid System:** 12-column CSS Grid with 24px gutters on desktop, 16px on mobile
- **Spacing Unit:** Base 4px scale
  - xs: 4px
  - sm: 8px
  - md: 16px
  - lg: 24px
  - xl: 32px
  - 2xl: 48px
  - 3xl: 64px
- **Border Radius:**
  - Cards: 20px (1.25rem)
  - Buttons: 12px
  - Inputs: 12px
  - Chips/Badges: 9999px (full)
  - Small elements: 6px
- **Breakpoints:**
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1536px

## 5. Animations & Interactions
- **Micro-interactions:** All hover/active states < 200ms, use \`ease-in-out\` or \`cubic-bezier(0.4, 0, 0.2, 1)\`
- **Page Transitions:** Fade + slide-up, 350ms, \`cubic-bezier(0.4, 0, 0.2, 1)\`
- **Spring Animations:** \`cubic-bezier(0.34, 1.56, 0.64, 1)\` for pop/bounce effects
- **Loading States:** Skeleton loaders for data-fetching UI; spinner for user-triggered actions
- **Hover:** Scale 1.02-1.04 on cards; brightness/glow shift on buttons
- **Rules:**
  - Never animate \`width\`, \`height\`, \`margin\`, \`top\`, \`left\` — use \`transform\` only
  - All animations must respect \`prefers-reduced-motion\` media query

## 6. Accessibility (a11y)
- Minimum contrast ratio: **4.5:1** for body text, **3:1** for large text and UI components
- All interactive elements must be keyboard-navigable (Tab, Enter, Space, Escape)
- Focus rings: \`outline: 2px solid ${color}; outline-offset: 2px\`
- ARIA labels required on all icon-only buttons
- Never remove focus indicators — override with a custom visible style only
- Minimum tap target size: 44×44px on touch devices

Fill all sections with values specific to the ${vibe} aesthetic and ${color} primary color.`
}

// ─────────────────────────────────────────────────────────────────────────────
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
