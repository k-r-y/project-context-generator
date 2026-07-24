# AI Agent Constraints & Anti-Patterns

## 1. Core Directives
* **Language Constraint:** Strictly use JavaScript (.jsx/.js). Do not generate or suggest TypeScript (.tsx/.ts) under any circumstances.
* **Component Modularity:** Break down the wizard UI into absolute atomic components. Never write a monolithic file that exceeds 150 lines of code.
* **Animation Performance:** Use CSS transforms and Framer Motion's `layout` props. Never animate CSS properties that trigger layout recalculations (e.g., `width`, `height`, `margin`).
* **State Separation:** Isolate all business logic and LLM API calls into custom hooks or Zustand actions. React components must only handle rendering and UI event delegation.

## 2. Anti-Patterns (AVOID AT ALL COSTS)
* **AVOID** heavy, opinionated form libraries (like Formik) that make custom animations and real-time state extraction difficult. Stick to controlled components linked to Zustand.
* **AVOID** building custom UI components from scratch if a `shadcn/ui` primitive exists (e.g., use the shadcn `Select` and `Input` components).
* **AVOID** generating generic placeholder text in the final `.md` outputs. The Node.js backend prompts must strictly enforce highly technical, opinionated, and immediately actionable Markdown generation.