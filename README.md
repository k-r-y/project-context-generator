# Project Context Generator

Project Context Generator (PCG) is a web application designed to streamline software documentation and context generation for AI-assisted software engineering workflows.

---

## Background

Artificial Intelligence coding assistants rely heavily on detailed project context to deliver accurate, architectural-grade code. Without explicit context regarding product requirements, architecture patterns, design tokens, coding standards, and database schemas, AI models often hallucinate non-existent dependencies, introduce incompatible patterns, or write redundant code.

Writing these context documents manually is time-consuming, repetitive, and inconsistent across teams. Key details are frequently omitted, leading to degraded AI output and unnecessary iteration cycles during development.

---

## Problem Statement

1. **Context Fragmentation**: Project requirements, design decisions, and architectural guidelines are scattered across disparate documents or remain unwritten.
2. **AI Misalignment**: Large language models require structured instructions to maintain consistent code quality, styling, and framework compliance.
3. **Boilerplate Fatigue**: Developers spend substantial time drafting initial Product Requirement Documents (PRDs), design tokens, rules, and database schemas instead of shipping functional code.

---

## Solution

Project Context Generator resolves context fragmentation by guiding developers through a streamlined 5-step wizard. In under 5 minutes, it outputs a standardized, production-ready suite of 5 context files:

1. `PRD.md`: Defines product goals, user personas, core feature specifications, user flows, and success metrics.
2. `ARCHITECTURE.md`: Establishes system topology, selected framework stacks, directory structures, data flows, state management, and security boundaries.
3. `DESIGN.md`: Specifies design system tokens, color palettes, typography hierarchies, animation physics, component styles, and responsiveness guidelines.
4. `RULES.md`: Mandates code style conventions, error handling contracts, workspace rules, linting standards, and testing policies.
5. `SCHEMA.md`: Maps out database entities, field types, relationships, validation constraints, and migration schemas.

---

## Features

- **Interactive 5-Step Wizard**: Step-by-step questionnaire capturing project metadata, stack choices, design aesthetic preferences, code rules, and database parameters.
- **Dual-Generation Engine**:
  - **System Mode**: Instant template generation with zero external dependencies.
  - **AI Mode**: Dynamic, customized document synthesis powered by the Gemini API.
- **Export Options**: Single-click copy to clipboard, individual `.md` downloads, or multi-file ZIP archive creation.
- **Cloud Synchronization**: Optional Firebase Auth sign-in with Cloud Firestore storage for saving and retrieving project suites across devices.
- **Guest Mode**: Full offline capability utilizing `localStorage` persistence.
- **Optimized Performance & Fast Access**:
  - Route-level code splitting (`React.lazy` and `Suspense`) yielding an initial JavaScript bundle under 27 kB.
  - Rollup vendor chunking separating React, Firebase, Markdown rendering, and AI execution dependencies.
- **SEO & Web Standards**: Full Open Graph metadata, Twitter Cards, JSON-LD structured data (`WebApplication`), canonical links, `sitemap.xml`, `robots.txt`, and PWA support.

---

## Tech Stack

- **Core**: React 19, Vite 8, JavaScript (ESNext), HTML5
- **Styling**: Tailwind CSS v4, Vanilla CSS Design System
- **State Management**: Zustand
- **Animations & Icons**: Framer Motion, Lucide React
- **AI Integration**: `@google/generative-ai` (Gemini API)
- **Backend & Auth**: Firebase Auth, Cloud Firestore
- **Markdown & Utilities**: `react-markdown`, `rehype-highlight`, `remark-gfm`, `jszip`

---

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/k-r-y/project-context-generator.git
   cd project-context-generator
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the local development server:
   ```sh
   npm run dev
   ```

4. Build for production:
   ```sh
   npm run build
   ```

---

## Project Structure

```text
PROJECT-CONTEXT-GENERATOR/
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   ├── sitemap.xml
│   └── site.webmanifest
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── ui/
│   │   └── wizard/
│   ├── hooks/
│   │   └── useSEO.js
│   ├── lib/
│   │   ├── animationVariants.js
│   │   ├── downloadUtils.js
│   │   ├── firebase.js
│   │   ├── schemaParser.js
│   │   └── synthesize.js
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   └── ProjectsDashboard.jsx
│   ├── store/
│   │   ├── useProjectStore.js
│   │   └── useToastStore.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## License

This project is open-source and available under the MIT License.
