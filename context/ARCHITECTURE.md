# System Architecture

## 1. Tech Stack
* **Frontend Framework:** React (Vite) as a Single Page Application (SPA).
* **Language:** JavaScript (Strictly NO TypeScript).
* **Styling & UI:** Tailwind CSS combined with `shadcn/ui` for accessible, unstyled component primitives.
* **Animations:** Framer Motion for orchestrating fluid question transitions and micro-interactions.
* **State Management:** Zustand for lightweight, globally accessible form state.
* **Backend:** Node.js with Express to handle LLM prompt chaining and Markdown file synthesis.

## 2. Folder Structure (Frontend)
\`\`\`text
src/
├── components/
│   ├── ui/          # shadcn/ui primitives
│   ├── wizard/      # Questionnaire step components (animated)
│   └── dashboard/   # Final output view components (Bento grid)
├── store/           # Zustand state slices
├── lib/             # Utility functions, animation variants, API calls
└── context/         # AI configuration files
\`\`\`

## 3. The Synthesis Engine (Backend Integration)
The generation logic must use **Prompt Chaining**. The frontend form data is dispatched to the Node.js backend, which executes separate, isolated LLM requests for each file (`DESIGN.md`, `RULES.md`, etc.) using strict templates, rather than asking the LLM to write all files in a single pass to prevent truncation.