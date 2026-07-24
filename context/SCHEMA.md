# Data & State Models

## 1. Zustand State Store (`useProjectStore`)
The application relies on a global, reactive JSON state object to track the user's progress through the interactive wizard without losing data on re-renders.

\`\`\`javascript
{
  projectMeta: {
    name: "",
    pitch: ""
  },
  pillars: {
    architecture: {
      stack: [], // e.g., ["React", "Vite", "Tailwind"]
      rendering: ""
    },
    design: {
      vibe: "",
      primaryColor: ""
    },
    rules: {
      antiPatterns: []
    }
  },
  generatedOutputs: {
    prd: null,
    architecture: null,
    design: null,
    rules: null,
    schema: null,
    metrics: [] // Actionable checklist items
  },
  currentStep: 0
}
\`\`\`

## 2. Backend Payload Schema
When the frontend submits the final questionnaire, it sends a standardized JSON payload to the Node.js backend.
\`\`\`json
{
  "projectId": "uuid",
  "projectData": {
    "meta": {},
    "answers": {}
  }
}
\`\`\`