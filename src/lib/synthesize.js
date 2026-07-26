import { GoogleGenerativeAI } from '@google/generative-ai'
import {
  buildPRDPrompt,
  buildArchitecturePrompt,
  buildDesignPrompt,
  buildRulesPrompt,
  buildSchemaPrompt,
  extractMetricsFromOutputs,
} from './prompts'

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM-GENERATED TEMPLATES
// High-quality structured templates based on user answers.
// Matches the exact format specified in the context documentation guidelines.
// ─────────────────────────────────────────────────────────────────────────────

export function generateSystemPRD(answers) {
  const { meta, pillars } = answers
  const stack = pillars.architecture.stack.join(', ') || 'Not specified'

  return `# Product Requirements Document (PRD)

> **Elevator Pitch:** ${meta.pitch || 'Not specified'}

## 1. Project Overview
- **Name:** ${meta.name}
- **Elevator Pitch:** ${meta.pitch || 'Not specified'}
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
- **Stack:** ${stack}
- **Database:** ${pillars.architecture.database || 'None'}
- **Auth:** ${pillars.architecture.authStrategy || 'None'}
- **Integrations:** [To be defined based on requirements]
- **Performance:** [Target: ${meta.successMetrics}]
- **Hosting/Infrastructure:** ${pillars.architecture.deployment || 'Not specified'}
`
}

// ─────────────────────────────────────────────────────────────────────────────

export function generateSystemArchitecture(answers) {
  const { meta, pillars } = answers
  const stack = pillars.architecture.stack
  const framework = stack[0] || 'React'
  const db = pillars.architecture.database || 'None'
  const pattern = pillars.architecture.designPattern || 'Module-Based'
  const auth = pillars.architecture.authStrategy || 'None'
  const dataPattern = pillars.schema?.dataPattern || 'REST'
  const deployment = pillars.architecture.deployment || 'Vercel'
  const lang = pillars.rules?.language || 'JavaScript'
  const ext = lang === 'TypeScript' ? 'tsx' : 'jsx'
  const projectSlug = meta.name.toLowerCase().replace(/\s+/g, '-')

  const stackTable = stack.map((t) => {
    const categories = {
      React: 'Frontend', Vue: 'Frontend', Svelte: 'Frontend', Angular: 'Frontend',
      'Next.js': 'Frontend + Backend', Nuxt: 'Frontend + Backend', Remix: 'Frontend + Backend',
      Vite: 'Build Tool', 'Tailwind CSS': 'Styling', 'Framer Motion': 'Animation',
      Zustand: 'State', Redux: 'State', 'TanStack Query': 'Data Fetching',
      'Node.js': 'Backend', Express: 'Backend', Fastify: 'Backend', NestJS: 'Backend',
      'Shadcn/ui': 'UI Primitives', 'Radix UI': 'UI Primitives',
      Prisma: 'ORM', Drizzle: 'ORM', GraphQL: 'API Layer', tRPC: 'API Layer',
    }
    return `| ${categories[t] || 'Library'} | ${t} | Latest stable |`
  }).join('\n')

  return `# System Architecture — ${meta.name}

## 1. Top-Level Overview
| Layer | Technology | Notes |
| :--- | :--- | :--- |
| Frontend | ${framework} | ${pillars.architecture.rendering || 'SPA'} with component-based architecture |
| Build Tool | Vite | Sub-100ms HMR, native ES modules, fast cold starts |
| Styling | ${stack.find((s) => s.includes('Tailwind')) || 'CSS'} | Utility-first, no runtime overhead |
| Database | ${db} | ${db === 'Supabase' ? 'Managed Postgres + Auth + Realtime' : db === 'Firebase' ? 'NoSQL Firestore + Auth + Hosting' : db === 'None' ? 'No database — client-side state only' : `${db} with connection pooling`} |
| Infrastructure | ${deployment} | Zero-config deployments, automatic preview URLs per PR |
| CI/CD | GitHub Actions | Lint → Test → Build → Deploy on push to main |

## 2. Design Methodology & Patterns
- **Core Pattern:** **${pattern}** — ${
    pattern === 'MVC' ? 'Models define data shapes, Views handle rendering, Controllers contain business logic. Clean separation prevents logic leaking into UI components.' :
    pattern === 'Repository Pattern' ? 'All database access abstracted behind repository interfaces. Swap implementations without touching business logic. Enables easy mocking in tests.' :
    pattern === 'Feature-Sliced' ? 'FSD architecture with strict layer rules: app → pages → widgets → features → entities → shared. Prevents spaghetti imports between features.' :
    pattern === 'Microservices' ? 'Independent services per bounded context. Each service owns its data store. Communicate via events or HTTP. Deploy and scale independently.' :
    'Feature modules grouped by domain. Each module is self-contained with its own components, state, and API logic. Scales cleanly as the codebase grows.'
  }
- **State Management:** ${stack.find((s) => ['Zustand', 'Redux', 'Jotai', 'Recoil'].includes(s)) || 'Zustand'} — global state for shared data; local component state for ephemeral UI state. Selectors scoped to prevent unnecessary re-renders.
- **API Design:** **${dataPattern}** — ${
    dataPattern === 'REST' ? 'RESTful endpoints following resource-based URL conventions. Responses follow the envelope pattern: `{ success, data, error, meta }`.' :
    dataPattern === 'GraphQL' ? 'Schema-first GraphQL API. Single `/graphql` endpoint with typed queries, mutations, and subscriptions.' :
    dataPattern === 'tRPC' ? 'End-to-end type-safe procedures. No code generation required — types inferred from router definition.' :
    'Server Actions for mutations, fetch for queries. Colocated with the components that use them.'
  }
- **Authentication:** **${auth}** — ${
    auth === 'JWT' ? 'Short-lived access tokens (15min) + long-lived refresh tokens (7d). Tokens stored in httpOnly cookies. Refresh handled silently by an Axios interceptor.' :
    auth === 'OAuth 2.0' ? 'OAuth2 authorization code flow. Provider tokens exchanged for internal session. User profile cached in database on first login.' :
    auth === 'Session Cookies' ? 'Server-side sessions stored in Redis. HttpOnly, Secure, SameSite=Strict cookies. Session invalidated on logout.' :
    auth === 'Magic Link' ? 'Passwordless email magic links. Links expire after 15 minutes and are single-use. Delivered via Resend/SendGrid.' :
    'No authentication required for MVP. Public access only.'
  }

## 3. Data Flow
1. **Client Request:** User interaction triggers a state update (Zustand action or local setState) → async ${dataPattern} call initiated
2. **Routing/Middleware:** Request hits the ${dataPattern === 'REST' ? 'Express/Fastify router' : dataPattern === 'tRPC' ? 'tRPC middleware chain' : 'API handler'} → CORS check → ${auth !== 'None' ? `${auth} token validation → ` : ''}request body validation
3. **Controller/Service:** Business logic executed in the service layer → input sanitized → domain rules applied
4. **Database Access:** ${stack.find((s) => ['Prisma', 'Drizzle'].includes(s)) || 'Database client'} query executed with parameterized inputs → connection pool managed automatically
5. **Response:** Data serialized to ${dataPattern === 'GraphQL' ? 'GraphQL response shape' : '`{ success: true, data: {...}, error: null, meta: { timestamp } }`'} → sent to client → Zustand/cache updated

## 4. System Diagrams

\`\`\`mermaid
flowchart TD
    Client["Client<br/>(${framework})"]
    Middleware["Middleware<br/>(${auth !== 'None' ? `${auth} Validation` : 'CORS + Validation'})"]
    Service["Service Layer<br/>(Business Logic)"]
    DB[("${db}<br/>Database")]
    Cache["Cache Layer<br/>(Optional)"]

    Client -->|"${dataPattern} Request"| Middleware
    Middleware -->|"Authorized"| Service
    Service -->|"Cache Miss"| DB
    Service -->|"Cache Hit"| Cache
    DB -->|"Query Result"| Service
    Cache -->|"Cached Data"| Service
    Service -->|"Formatted Response"| Client
\`\`\`

## 5. Tech Stack
| Category | Technology | Version |
| :--- | :--- | :--- |
${stackTable || `| Frontend | ${framework} | Latest |`}
| Language | ${lang} | Latest |
| Runtime | Node.js | 20 LTS |

## 6. Folder Structure

\`\`\`text
${projectSlug}/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable primitives (Button, Input, Badge, Card)
│   │   ├── layout/          # Shell, Sidebar, Topbar, Footer
│   │   └── features/        # Domain-specific composed components
│   ├── pages/               # Route-level page components (one per route)
│   ├── hooks/               # Custom React hooks (use*.${lang === 'TypeScript' ? 'ts' : 'js'})
│   ├── store/               # Zustand state slices (one file per domain)
│   ├── lib/                 # API clients, utilities, helpers, constants
│   ├── styles/              # Global CSS, design tokens, animations
│   ├── App.${ext}
│   ├── main.${ext}
│   └── index.css
├── .env.example             # Environment variable template (committed)
├── .env.local               # Actual secrets (gitignored)
├── vite.config.${lang === 'TypeScript' ? 'ts' : 'js'}
${lang === 'TypeScript' ? '├── tsconfig.json\n' : ''}└── package.json
\`\`\`

## 7. Setup Checklist
- [ ] \`npm create vite@latest ./ -- --template ${lang === 'TypeScript' ? 'react-ts' : 'react'}\` — Scaffold the project
- [ ] \`npm install\` — Install all dependencies
- [ ] \`cp .env.example .env.local\` — Set up environment variables
${db !== 'None' ? `- [ ] Configure ${db} connection string in \`.env.local\`\n` : ''}- [ ] \`git init && git add . && git commit -m "chore: initial scaffold"\` — Initialize version control
- [ ] Push to GitHub and connect repo to ${deployment}
- [ ] \`npm run dev\` — Verify dev server starts and hot reload works
- [ ] \`npm run build\` — Verify production build completes with zero errors
`
}

// ─────────────────────────────────────────────────────────────────────────────

export function generateSystemSchema(answers) {
  const { meta, pillars } = answers
  const db = pillars.architecture.database || 'Postgres'
  const dbNaming = pillars.rules?.dbNaming || 'snake_case (plural)'
  const isNoSQL = db === 'Firebase'
  const entities = pillars.schema?.entities || []
  const migrationType = pillars.architecture.stack.includes('Prisma') ? 'Prisma Migrate' :
    db === 'Supabase' ? 'Supabase CLI' :
    db === 'Firebase' ? 'Firebase Admin SDK' :
    'Raw SQL files'

  let erd = ''
  let tablesMarkdown = ''
  let rlsPolicies = ''

  if (entities.length > 0) {
    // 1. Dynamic Mermaid ERD
    erd = '```mermaid\nerDiagram\n'
    entities.forEach((entity) => {
      erd += `    ${entity.name.toUpperCase()} {\n`
      entity.columns.forEach((col) => {
        // Clean names for Mermaid syntax safety
        const cleanName = col.name.replace(/[^a-zA-Z0-9_]/g, '')
        const cleanType = col.type.replace(/[^a-zA-Z0-9_]/g, '')
        const pkOrFk = col.constraints.toUpperCase().includes('PRIMARY KEY') ? 'PK' :
                       (col.constraints.toUpperCase().includes('FK') || col.constraints.toUpperCase().includes('REFERENCES')) ? 'FK' : ''
        erd += `        ${cleanType || 'varchar'} ${cleanName} ${pkOrFk}\n`
      })
      erd += `    }\n`
    })

    // Relationships mapping
    const relationships = []
    entities.forEach((eB) => {
      eB.columns.forEach((col) => {
        const colUpper = col.constraints.toUpperCase()
        const isFK = colUpper.includes('FK') || colUpper.includes('REFERENCES')
        let referencedTable = null

        const refMatch = col.constraints.match(/REFERENCES\s+([a-zA-Z_0-9]+)/i)
        if (refMatch) {
          referencedTable = refMatch[1]
        } else if (isFK || col.name.endsWith('_id') || col.name.endsWith('Id')) {
          const possibleBaseName = col.name.replace(/(_id|Id)$/, '')
          const matchingTable = entities.find((e) =>
            e.name.toLowerCase() === possibleBaseName.toLowerCase() ||
            e.name.toLowerCase() === (possibleBaseName + 's').toLowerCase()
          )
          if (matchingTable) {
            referencedTable = matchingTable.name
          }
        }

        if (referencedTable) {
          const rel = `    ${referencedTable.toUpperCase()} ||--o{ ${eB.name.toUpperCase()} : "fk_${col.name}"`
          if (!relationships.includes(rel)) {
            relationships.push(rel)
          }
        }
      })
    })

    if (relationships.length > 0) {
      erd += relationships.join('\n') + '\n'
    }
    erd += '```'

    // 2. Dynamic Tables
    if (isNoSQL) {
      tablesMarkdown = '### Firestore Collections\n\n'
      entities.forEach((entity) => {
        tablesMarkdown += `**\`/${entity.name}/{docId}\`**\n`
        tablesMarkdown += `| Field | Type | Constraints | Description |\n`
        tablesMarkdown += `| :--- | :--- | :--- | :--- |\n`
        entity.columns.forEach((col) => {
          tablesMarkdown += `| \`${col.name}\` | ${col.type} | ${col.constraints || '-'} | ${col.description || '-'} |\n`
        })
        tablesMarkdown += '\n'
      })
    } else {
      entities.forEach((entity) => {
        tablesMarkdown += `### Table: \`${entity.name}\`\n\n`
        tablesMarkdown += `| Column | Type | Constraints | Description |\n`
        tablesMarkdown += `| :--- | :--- | :--- | :--- |\n`
        entity.columns.forEach((col) => {
          tablesMarkdown += `| \`${col.name}\` | ${col.type} | ${col.constraints || '-'} | ${col.description || '-'} |\n`
        })
        tablesMarkdown += '\n'
      })
    }

    // 3. Dynamic RLS Policies
    if (isNoSQL) {
      rlsPolicies = `### Firebase Security Rules\n\`\`\`javascript\nrules_version = '2';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n`
      entities.forEach((entity) => {
        const hasUserId = entity.columns.some(c => c.name.toLowerCase() === 'user_id' || c.name.toLowerCase() === 'userid')
        rlsPolicies += `    // Rule for ${entity.name} collection\n`
        rlsPolicies += `    match /${entity.name}/{docId} {\n`
        if (hasUserId) {
          rlsPolicies += `      allow read, update, delete: if request.auth != null && resource.data.userId == request.auth.uid;\n`
          rlsPolicies += `      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;\n`
        } else {
          rlsPolicies += `      allow read: if true;\n`
          rlsPolicies += `      allow write: if request.auth != null;\n`
        }
        rlsPolicies += `    }\n\n`
      })
      rlsPolicies += `  }\n}\n\`\`\``
    } else {
      let rlsSql = '-- Enable RLS on all tables\n'
      entities.forEach((entity) => {
        rlsSql += `ALTER TABLE ${entity.name} ENABLE ROW LEVEL SECURITY;\n`
      })
      rlsSql += '\n'

      entities.forEach((entity) => {
        const hasUserId = entity.columns.some(c => c.name.toLowerCase() === 'user_id' || c.name.toLowerCase() === 'userid')
        rlsPolicies += `### Table: \`${entity.name}\`\n`
        if (hasUserId) {
          rlsPolicies += `- **Select:** Users can only view their own records: \`auth.uid() = user_id\`\n`
          rlsPolicies += `- **Insert:** Authenticated users can insert records owned by themselves: \`auth.uid() = user_id\`\n`
          rlsPolicies += `- **Update/Delete:** Owner only.\n\n`

          rlsSql += `-- Policies for ${entity.name}\n`
          rlsSql += `CREATE POLICY "${entity.name}_select_own" ON ${entity.name} FOR SELECT USING (auth.uid() = user_id);\n`
          rlsSql += `CREATE POLICY "${entity.name}_insert_own" ON ${entity.name} FOR INSERT WITH CHECK (auth.uid() = user_id);\n`
          rlsSql += `CREATE POLICY "${entity.name}_update_own" ON ${entity.name} FOR UPDATE USING (auth.uid() = user_id);\n`
          rlsSql += `CREATE POLICY "${entity.name}_delete_own" ON ${entity.name} FOR DELETE USING (auth.uid() = user_id);\n\n`
        } else {
          rlsPolicies += `- **Select:** Public read allowed.\n`
          rlsPolicies += `- **Insert/Update/Delete:** Authenticated users only.\n\n`

          rlsSql += `-- Policies for ${entity.name}\n`
          rlsSql += `CREATE POLICY "${entity.name}_select_all" ON ${entity.name} FOR SELECT USING (true);\n`
          rlsSql += `CREATE POLICY "${entity.name}_write_auth" ON ${entity.name} FOR ALL TO authenticated USING (true);\n\n`
        }
      })

      rlsPolicies += `\`\`\`sql\n${rlsSql}\`\`\``
    }
  } else {
    // Standard Fallbacks
    erd = isNoSQL ? `\`\`\`mermaid
erDiagram
    USERS {
        string id PK
        string email
        string role
        timestamp createdAt
    }
    ITEMS {
        string id PK
        string userId FK
        string name
        string status
        timestamp createdAt
    }
    USERS ||--o{ ITEMS : "owns"
\`\`\`` : `\`\`\`mermaid
erDiagram
    users {
        uuid id PK
        varchar email
        varchar role
        timestamptz created_at
        timestamptz updated_at
    }
    items {
        uuid id PK
        uuid user_id FK
        varchar name
        varchar status
        timestamptz created_at
        timestamptz updated_at
    }
    users ||--o{ items : "has many"
\`\`\``

    tablesMarkdown = isNoSQL ? `### Firestore Collections

**\`/users/{userId}\`**
| Field | Type | Description |
| :--- | :--- | :--- |
| \`id\` | String (auto) | Firebase UID |
| \`email\` | String | User's login email |
| \`role\` | String | \`'user'\` or \`'admin'\` |
| \`createdAt\` | Timestamp | Account creation time |

**\`/users/{userId}/items/{itemId}\`**
| Field | Type | Description |
| :--- | :--- | :--- |
| \`id\` | String (auto) | Document ID |
| \`name\` | String | Item name |
| \`status\` | String | \`'active'\` or \`'archived'\` |
| \`createdAt\` | Timestamp | Creation timestamp |` : `### \`users\`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| \`id\` | UUID | Primary Key, Default: \`gen_random_uuid()\` | Unique user identifier |
| \`email\` | VARCHAR(255) | Unique, Not Null | User's login email |
| \`role\` | VARCHAR(20) | Default: \`'user'\`, Not Null | System role: \`'user'\` or \`'admin'\` |
| \`created_at\` | TIMESTAMPTZ | Default: \`NOW()\`, Not Null | Record creation timestamp |
| \`updated_at\` | TIMESTAMPTZ | Default: \`NOW()\`, Not Null | Last modification timestamp |

### \`items\`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| \`id\` | UUID | Primary Key, Default: \`gen_random_uuid()\` | Unique item identifier |
| \`user_id\` | UUID | FK → \`users.id\`, On Delete Cascade | Item owner |
| \`name\` | VARCHAR(200) | Not Null | Item display name |
| \`status\` | VARCHAR(20) | Default: \`'active'\`, Not Null | \`'active'\`, \`'archived'\`, \`'deleted'\` |
| \`created_at\` | TIMESTAMPTZ | Default: \`NOW()\`, Not Null | Creation timestamp |
| \`updated_at\` | TIMESTAMPTZ | Default: \`NOW()\`, Not Null | Last update timestamp |`

    rlsPolicies = isNoSQL ? `### Firebase Security Rules
\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow update: if request.auth.uid == userId;
      allow create: if request.auth != null;
      allow delete: if false; // Admin SDK only

      // Items subcollection
      match /items/{itemId} {
        allow read, write: if request.auth.uid == userId;
      }
    }
  }
}
\`\`\`` : `### Table: \`users\`
- **Select:** Users can only view their own row: \`auth.uid() = id\`
- **Update:** Users can update their own row. Admins (\`role = 'admin'\`) can update all.
- **Insert:** Handled automatically by auth trigger on signup — not client-accessible.
- **Delete:** Admin-only via service role key. Users cannot self-delete.

### Table: \`items\`
- **Select:** Users can view only their own items: \`auth.uid() = user_id\`
- **Insert:** Authenticated users can create items owned by themselves: \`auth.uid() = user_id\`
- **Update:** Users can only update their own items.
- **Delete:** Users can only delete their own items. Admins can delete any.

\`\`\`sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- users: self-access only
CREATE POLICY "users_select_own" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON users FOR UPDATE USING (auth.uid() = id);

-- items: owner access
CREATE POLICY "items_select_own" ON items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "items_insert_own" ON items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "items_update_own" ON items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "items_delete_own" ON items FOR DELETE USING (auth.uid() = user_id);
\`\`\``
  }

  return `# Database Schema & Data Models — ${meta.name}

## 1. Entity Relationship Diagram (ERD)

${erd}

## 2. Tables

${tablesMarkdown}

## 3. Row Level Security (RLS) Policies

${rlsPolicies}

## 4. Migrations & Seeding Strategy
- **Tool:** ${migrationType}
- **Convention:** Migration files named \`YYYYMMDDHHMMSS_descriptive_name.sql\`
- **Workflow:**
  1. Write migration file in \`/supabase/migrations/\` or \`/prisma/migrations/\`
  2. Test locally with \`${db === 'Supabase' ? 'supabase db reset' : 'npx prisma migrate dev'}\`
  3. Commit migration file with the feature PR — migrations deploy atomically with the code
- **Seeding:** Development seed data in \`/seed/dev.sql\` or \`/prisma/seed.ts\`. Never runs in production CI.
- **Rollback:** Each migration file must include a corresponding \`down\` migration or rollback script.
- **Indexing Strategy:**
  - Index all foreign key columns (\`user_id\`, \`item_id\`, etc.)
  - Index frequently filtered columns: \`status\`, \`created_at DESC\`, \`email\`
  - Use composite indexes for common multi-column queries
  - Review with \`EXPLAIN ANALYZE\` before merging migration PRs
`
}

// ─────────────────────────────────────────────────────────────────────────────

export function generateSystemDesign(answers) {
  const { meta, pillars } = answers
  const vibe = pillars.design.vibe || 'Dark Premium'
  const primaryHex = pillars.design.primaryColor || '#6366f1'
  const secondaryHex = pillars.design.secondaryColor || '#ec4899'
  const shadesList = pillars.design.shades?.length ? pillars.design.shades.join(', ') : '#ffffff, #111827'

  const font = pillars.design.typography === 'Other' && pillars.design.customTypography ? pillars.design.customTypography : pillars.design.typography || 'Inter'
  const secondaryFont = pillars.design.secondaryTypography === 'Other' && pillars.design.customSecondaryTypography ? pillars.design.customSecondaryTypography : pillars.design.secondaryTypography

  const uiLibrariesList = (pillars.design.uiLibraries || [])
    .map(lib => lib === 'Other' && pillars.design.customUiLibrary ? pillars.design.customUiLibrary : lib)
    .join(', ') || 'None'

  const iconSet = pillars.design.iconSet === 'Other' && pillars.design.customIconSet ? pillars.design.customIconSet : pillars.design.iconSet || 'None'

  const layoutConceptsList = (pillars.design.layoutConcepts || [])
    .map(l => l === 'Other' && pillars.design.customLayoutConcept ? pillars.design.customLayoutConcept : l)
    .join(', ') || 'None'

  return `# Design System & UI/UX Guidelines — ${meta.name}

## 1. Brand Identity & Theme
- **Vibe/Style:** ${vibe}
- **Primary Brand Color:** ${primaryHex}
- **Secondary Accent Color:** ${secondaryHex}
- **Neutral Shades (White to Black):** ${shadesList}
- **Core Concept:** ${meta.name} uses a ${vibe.toLowerCase()} aesthetic — ${
    vibe === 'Dark Premium' ? `deep dark surfaces with glassmorphism cards, aurora gradient backgrounds, and ${primaryHex} accent glows to convey technical sophistication and premium quality.` :
    vibe === 'Minimalist' ? `generous whitespace, restrained typography, and a clean color palette (Primary: ${primaryHex}, Secondary: ${secondaryHex}, Shades: ${shadesList}) to keep the focus entirely on the content and user actions.` :
    vibe === 'Bold & Vibrant' ? `strong color blocks (${primaryHex}, ${secondaryHex}), heavy typography, and high-contrast layouts to create a confident, energetic experience.` :
    vibe === 'Corporate' ? `clean layouts, professional accents (${primaryHex}, ${secondaryHex}), and accessibility-first design to convey reliability and trust to business stakeholders.` :
    vibe === 'Playful' ? `rounded corners, bouncy micro-animations, and bright accents (${primaryHex}, ${secondaryHex}) to make the experience feel approachable and fun.` :
    vibe === 'Retro/Cyberpunk' ? `high-contrast neon scanlines, dark retro terminal layouts, custom glowing borders, and monospace font accents to make the UI look like a futuristic deck.` :
    `intentionally raw, stark typography, and minimal decoration to create an opinionated interface.`
  }

## 2. Component Design Tokens
- **Typography:** ${font}${secondaryFont ? ` / ${secondaryFont}` : ''}
- **UI & Frontend Libraries:** ${uiLibrariesList}
- **Iconography Set:** ${iconSet}
- **Layout Concept:** ${layoutConceptsList}

## 3. Color Palette & Shades (Separated Groups)
- **1. Neutral Shades (White to Black):** \`${shadesList}\` — Base surface backgrounds, text contrast, borders
- **2. Primary Brand Color:** \`${primaryHex}\` — Main CTAs, primary interactive elements, active states
- **3. Secondary Accent Color:** \`${secondaryHex}\` — Supporting accents, hover glows, gradient pairs
- **Background:** \`#060614\` — Root page background
- **Surface:** \`#0d0d1f\` — Cards, panels, sidebars
- **Surface Elevated:** \`#12122a\` — Modals, dropdowns, tooltips
- **Border:** \`rgba(255,255,255,0.08)\` — Subtle card borders, dividers
- **Text Primary:** \`#ffffff\` — Headings, critical labels, active nav items
- **Text Secondary:** \`rgba(255,255,255,0.6)\` — Body text, descriptions, secondary labels
- **Text Muted:** \`rgba(255,255,255,0.3)\` — Placeholders, disabled states, metadata
- **Semantic:**
  - Success: \`#22c55e\` — Confirmations, completed states
  - Warning: \`#f59e0b\` — Caution states, non-blocking alerts
  - Danger: \`#ef4444\` — Errors, destructive actions, validation failures
  - Info: \`#38bdf8\` — Informational messages, highlights

\`\`\`css
/* CSS Custom Properties */
:root {
  --color-primary: ${primaryHex};
  --color-secondary: ${secondaryHex};
  --color-bg: #060614;
  --color-surface: #0d0d1f;
  --color-surface-elevated: #12122a;
  --color-border: rgba(255,255,255,0.08);
  --color-text-primary: #ffffff;
  --color-text-secondary: rgba(255,255,255,0.6);
  --color-text-muted: rgba(255,255,255,0.3);
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-info: #38bdf8;
}
\`\`\`

## 4. Typography
- **Headings:** ${font}, weights 700/800
- **Body:** ${font}, weights 400/500
- **Monospace:** JetBrains Mono, weights 400/500

| Element | Size | Weight | Line Height |
| :--- | :--- | :--- | :--- |
| Display | 3.75rem (60px) | 800 | 1.1 |
| h1 | 2.25rem (36px) | 800 | 1.15 |
| h2 | 1.5rem (24px) | 700 | 1.25 |
| h3 | 1.25rem (20px) | 600 | 1.3 |
| h4 | 1.125rem (18px) | 600 | 1.4 |
| Body | 1rem (16px) | 400 | 1.6 |
| Small | 0.875rem (14px) | 400 | 1.5 |
| Caption | 0.75rem (12px) | 500 | 1.4 |
| Mono | 0.875rem (14px) | 400 | 1.6 |

## 5. Spacing & Layout
- **Grid System:** 12-column CSS Grid, 24px gutters on desktop, 16px on mobile
- **Spacing Unit:** Base 4px

| Token | Value | Usage |
| :--- | :--- | :--- |
| xs | 4px | Icon gaps, tight padding |
| sm | 8px | Element padding, chip gaps |
| md | 16px | Section padding, form gaps |
| lg | 24px | Card padding, section spacing |
| xl | 32px | Panel padding |
| 2xl | 48px | Section margins |
| 3xl | 64px | Page section separators |

- **Border Radius:**
  - Cards / Modals: \`20px\` (1.25rem)
  - Buttons / Inputs: \`12px\`
  - Small chips / Badges: \`9999px\` (fully rounded)
  - Inline code blocks: \`6px\`

- **Breakpoints:**
  - sm: 640px | md: 768px | lg: 1024px | xl: 1280px | 2xl: 1536px

## 6. Animations & Interactions
- **Micro-interactions:** All hover/active transitions ≤ 200ms using \`cubic-bezier(0.4, 0, 0.2, 1)\`
- **Page Transitions:** Fade + slide-up, 350ms, \`cubic-bezier(0.4, 0, 0.2, 1)\`
- **Spring / Pop:** \`cubic-bezier(0.34, 1.56, 0.64, 1)\` for chip selection, button press, modal entrance
- **Loading States:**
  - Data fetching → Skeleton loaders (pulsing placeholder shapes)
  - User-triggered actions → Spinner inside the button
  - Page transitions → Framer Motion AnimatePresence fade

- **Rules:**
  - **Do:** Use \`transform\`, \`opacity\`, \`filter\`
  - **Avoid:** Never animate \`width\`, \`height\`, \`margin\`, \`top\`, \`left\`, \`padding\` (causes layout thrash)
  - All animations must respect \`@media (prefers-reduced-motion: reduce)\`

## 7. Accessibility (a11y)
- **Contrast Ratios:** Minimum 4.5:1 for body text; 3:1 for large text (>18px bold) and UI components
- **Keyboard Navigation:** All interactive elements reachable and operable via Tab, Enter, Space, Escape
- **Focus Rings:** \`outline: 2px solid ${primaryHex}; outline-offset: 2px;\` — never use \`outline: none\` without a visible replacement
- **ARIA:** All icon-only buttons must have \`aria-label\`. Dynamic content updates require \`aria-live\` regions.
- **Touch Targets:** Minimum 44×44px tap target on mobile for all interactive elements
- **Color Independence:** Never use color alone to convey state — always pair with icon, text, or pattern
`
}

// ─────────────────────────────────────────────────────────────────────────────

export function generateSystemRules(answers) {
  const { meta, pillars } = answers
  const lang = pillars.rules?.language || 'JavaScript'
  const ext = lang === 'TypeScript' ? 'ts' : 'js'
  const extx = lang === 'TypeScript' ? 'tsx' : 'jsx'
  const testing = pillars.rules?.testing || 'Vitest'
  const fileNaming = pillars.rules?.fileNaming || 'kebab-case'
  const dbNaming = pillars.rules?.dbNaming || 'snake_case (plural)'
  const errorHandling = pillars.rules?.errorHandling || 'Centralized try/catch'
  const pattern = pillars.architecture.designPattern || 'Module-Based'

  return `# Coding Standards & Implementation Rules — ${meta.name}

## 1. Core Principles
- **SOLID:** Code must adhere strictly to SOLID principles:
  - **S** — Single Responsibility: Every module, class, or function has exactly one reason to change
  - **O** — Open/Closed: Open for extension via composition and hooks, closed for modification
  - **L** — Liskov Substitution: Subtypes must be substitutable for their base types without breaking behavior
  - **I** — Interface Segregation: Components and services should not depend on interfaces they don't use
  - **D** — Dependency Inversion: Depend on abstractions (hooks, interfaces), not concrete implementations
- **KISS:** Keep It Simple, Stupid. Ship the simplest implementation that satisfies the requirement. Avoid premature abstraction and over-engineering.
- **DRY (Strict):** Do Not Repeat Yourself. If a function, query, component pattern, or service call is repeated **4 times or more**, it MUST be abstracted into a shared utility, custom hook, or service. No exceptions.

## 2. Naming Conventions
- **Files:** \`${fileNaming}\` format — e.g., \`${fileNaming === 'PascalCase' ? 'UserProfile' : 'user-profile'}.${extx}\`, \`${fileNaming === 'PascalCase' ? 'AuthService' : 'auth-service'}.${ext}\`
- **Variables / Functions:** \`camelCase\` — e.g., \`getUserById\`, \`isLoading\`, \`handleSubmit\`, \`formatCurrency\`
- **Classes / Models:** \`PascalCase\` — e.g., \`UserService\`, \`AuthController\`, \`OrderRepository\`
- **Constants:** \`SCREAMING_SNAKE_CASE\` — e.g., \`MAX_RETRY_COUNT\`, \`API_BASE_URL\`, \`DEFAULT_TIMEOUT_MS\`
- **Database Tables:** \`${dbNaming}\` — e.g., \`${dbNaming.includes('snake') ? 'user_profiles, order_items' : 'UserProfiles, OrderItems'}\`
- **Database Columns:** \`snake_case\` — e.g., \`created_at\`, \`user_id\`, \`is_active\`
- **CSS Classes:** \`kebab-case\` — e.g., \`card-header\`, \`btn-primary\`

## 3. Error Handling
- **Strategy:** ${errorHandling}
- **Backend:** All async route handlers use centralized try/catch. Errors returned as standardized JSON:
  \`\`\`json
  {
    "success": false,
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "The email field is required.",
      "details": {}
    }
  }
  \`\`\`
- **Frontend:** Error Boundaries at the page level catch render errors. Network/async errors surfaced as toast notifications. Never expose raw stack traces or internal error messages to the user.
- **Logging:** Use structured logging (\`pino\` or \`winston\`). Log format: \`{ level, timestamp, message, requestId, userId, error }\`. Never use bare \`console.log\` in production code.
- **Rules:**
  - Never swallow errors in empty catch blocks: \`catch (e) {}\` is forbidden
  - Always log the full error server-side; send only a sanitized message to the client
  - All promise chains must have error handling — either \`.catch()\` or \`try/await/catch\`

## 4. Anti-Patterns (AVOID AT ALL COSTS)
${pillars.rules?.antiPatterns?.length
  ? pillars.rules.antiPatterns.map((p, i) => {
      const principles = ['SRP', 'DRY', 'KISS', 'OCP', 'DIP']
      return `${i + 1}. **${p}** — Violates ${principles[i % 5]}. Creates technical debt and makes the codebase resistant to change.`
    }).join('\n')
  : `1. **Prop drilling beyond 2 component levels** — Violates encapsulation. Pass state through context or Zustand instead.
2. **Monolithic components exceeding 150 lines** — Violates SRP. Decompose into atomic, focused components.
3. **Inline styles in JSX** — Bypasses the design token system and makes theming impossible. Use CSS classes.
4. **Magic strings and numbers** — Violates maintainability. Extract to named constants in \`/lib/constants.${ext}\`.
5. **\`${lang === 'TypeScript' ? 'any' : 'var'}\` usage** — Defeats ${lang === 'TypeScript' ? 'type safety' : 'block scoping'}. Always use \`${lang === 'TypeScript' ? 'explicit types or generics' : 'const or let'}\`.`}

## 5. Commit & Pull Request Guidelines
- **Format:** [Conventional Commits](https://www.conventionalcommits.org/) — \`type(scope): imperative description\`
- **Types:** \`feat\`, \`fix\`, \`refactor\`, \`chore\`, \`docs\`, \`test\`, \`perf\`, \`style\`
- **Good Examples:**
  - \`feat(auth): add JWT refresh token rotation with httpOnly cookies\`
  - \`fix(api): handle null user_id in items query\`
  - \`refactor(store): extract auth slice from root Zustand store\`
- **Branch Naming:** \`feat/description\`, \`fix/description\`, \`chore/description\`
- **PR Review Checklist:**
  - [ ] No hardcoded credentials, API keys, or secrets
  - [ ] ${lang === 'TypeScript' ? 'No `any` types — all types strictly defined' : 'No undeclared variables — ESLint passes cleanly'}
  - [ ] All async operations handle loading state, error state, and empty state
  - [ ] Component or function does not exceed 150 lines of logic
  - [ ] Passes full linter and test suite: \`npm run lint && npm run test\`
  - [ ] DRY rule not violated — no pattern repeated 4+ times without abstraction
  - [ ] New feature has at minimum a smoke test in ${testing}
`
}

// ─────────────────────────────────────────────────────────────────────────────
// AI-generated (Gemini) documents
// ─────────────────────────────────────────────────────────────────────────────

async function callGemini(apiKey, prompt) {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  const result = await model.generateContent(prompt)
  return result.response.text()
}

// ─────────────────────────────────────────────────────────────────────────────
// Main synthesis entry point
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Synthesizes all 5 context documents.
 * @param {Object} answers - { meta, pillars }
 * @param {'system'|'ai'} mode
 * @param {string} apiKey - Gemini API key (required if mode === 'ai')
 * @param {Function} onProgress - (docName, index, total) callback
 */
export async function synthesizeAll(answers, mode, apiKey, onProgress) {
  const docs = [
    { key: 'prd', label: 'PRD', systemFn: generateSystemPRD, promptFn: buildPRDPrompt },
    { key: 'architecture', label: 'Architecture', systemFn: generateSystemArchitecture, promptFn: buildArchitecturePrompt },
    { key: 'design', label: 'Design', systemFn: generateSystemDesign, promptFn: buildDesignPrompt },
    { key: 'rules', label: 'Rules', systemFn: generateSystemRules, promptFn: buildRulesPrompt },
    { key: 'schema', label: 'Schema', systemFn: generateSystemSchema, promptFn: buildSchemaPrompt },
  ]

  const outputs = {}

  for (let i = 0; i < docs.length; i++) {
    const { key, label, systemFn, promptFn } = docs[i]
    onProgress?.(label, i + 1, docs.length)

    if (mode === 'ai' && apiKey) {
      try {
        outputs[key] = await callGemini(apiKey, promptFn(answers))
      } catch (err) {
        console.warn(`Gemini failed for ${key}, falling back to system:`, err)
        outputs[key] = systemFn(answers)
      }
    } else {
      outputs[key] = systemFn(answers)
    }

    await new Promise((r) => setTimeout(r, 250))
  }

  outputs.metrics = extractMetricsFromOutputs(answers)
  return outputs
}

/**
 * Regenerate a single document (for the per-doc AI toggle on the dashboard).
 */
export async function regenerateSingle(key, answers, mode, apiKey) {
  const map = {
    prd: { systemFn: generateSystemPRD, promptFn: buildPRDPrompt },
    architecture: { systemFn: generateSystemArchitecture, promptFn: buildArchitecturePrompt },
    design: { systemFn: generateSystemDesign, promptFn: buildDesignPrompt },
    rules: { systemFn: generateSystemRules, promptFn: buildRulesPrompt },
    schema: { systemFn: generateSystemSchema, promptFn: buildSchemaPrompt },
  }

  const { systemFn, promptFn } = map[key]

  if (mode === 'ai' && apiKey) {
    try {
      return await callGemini(apiKey, promptFn(answers))
    } catch {
      return systemFn(answers)
    }
  }

  return systemFn(answers)
}
