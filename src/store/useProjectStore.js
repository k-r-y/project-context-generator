import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const defaultState = {
  projectMeta: {
    name: '',
    pitch: '',
    platform: '', // 'Web' | 'iOS' | 'Android' | 'Cloud' | 'Desktop' | 'Other'
    targetAudience: '',
    businessGoals: '',
    successMetrics: '',
    mvpFeatures: '',
    outOfScope: '',
  },
  pillars: {
    architecture: {
      stack: [],           // ['React', 'Vite', 'Tailwind', ...]
      rendering: '',       // 'SPA' | 'SSR' | 'SSG' | 'Hybrid'
      database: '',        // 'Postgres' | 'Supabase' | 'Firebase' | 'PlanetScale' | 'None'
      deployment: '',      // 'Vercel' | 'Netlify' | 'Railway' | 'Docker' | 'AWS'
      designPattern: '',   // 'MVC' | 'Repository Pattern' | 'Module-Based' | 'Microservices' | 'Feature-Sliced'
      authStrategy: '',    // 'JWT' | 'Session' | 'OAuth' | 'Magic Link' | 'None'
    },
    design: {
      vibe: '',         // 'Minimalist' | 'Bold' | 'Playful' | 'Corporate' | 'Dark Premium'
      primaryColor: '', // hex string
      typography: '',   // 'Inter' | 'Plus Jakarta' | 'Geist' | 'DM Sans'
    },
    rules: {
      language: '',           // 'JavaScript' | 'TypeScript'
      testing: '',            // 'Vitest' | 'Jest' | 'Playwright' | 'None'
      antiPatterns: [],       // string[]
      extraConstraints: '',   // freeform
      fileNaming: '',         // 'kebab-case' | 'PascalCase' | 'camelCase'
      componentNaming: '',    // 'PascalCase.tsx' | 'kebab-case.tsx'
      dbNaming: '',           // 'snake_case' | 'camelCase'
      errorHandling: '',      // 'centralized try/catch' | 'Result pattern' | 'Error boundaries'
    },
    schema: {
      entities: [],         // [{ name, fields }]
      dataPattern: '',      // 'REST' | 'GraphQL' | 'tRPC' | 'Server Actions'
    },
  },
  generatedOutputs: {
    prd: null,
    architecture: null,
    design: null,
    rules: null,
    schema: null,
    metrics: [],          // [{ id, text, done }]
  },
  outputMode: 'system',   // 'system' | 'ai' — user can toggle per-document
  apiKey: '',             // Gemini API key (entered by user in UI)
  currentStep: 0,
  totalSteps: 8,
  isGenerating: false,
  generationError: null,
}

const useProjectStore = create(
  persist(
    (set, get) => ({
      ...defaultState,

      // ── Meta ──────────────────────────────────────────────
      setMeta: (meta) =>
        set((s) => ({ projectMeta: { ...s.projectMeta, ...meta } })),

      // ── Pillars ───────────────────────────────────────────
      setArchitecture: (data) =>
        set((s) => ({
          pillars: { ...s.pillars, architecture: { ...s.pillars.architecture, ...data } },
        })),

      toggleStackItem: (item) =>
        set((s) => {
          const stack = s.pillars.architecture.stack
          const next = stack.includes(item) ? stack.filter((x) => x !== item) : [...stack, item]
          return { pillars: { ...s.pillars, architecture: { ...s.pillars.architecture, stack: next } } }
        }),

      setDesign: (data) =>
        set((s) => ({
          pillars: { ...s.pillars, design: { ...s.pillars.design, ...data } },
        })),

      setRules: (data) =>
        set((s) => ({
          pillars: { ...s.pillars, rules: { ...s.pillars.rules, ...data } },
        })),

      setSchema: (data) =>
        set((s) => ({
          pillars: { ...s.pillars, schema: { ...s.pillars.schema, ...data } },
        })),

      // ── Tech stack chips toggle ───────────────────────────
      toggleStackItem: (item) =>
        set((s) => {
          const stack = s.pillars.architecture.stack
          const next = stack.includes(item) ? stack.filter((x) => x !== item) : [...stack, item]
          return { pillars: { ...s.pillars, architecture: { ...s.pillars.architecture, stack: next } } }
        }),

      // ── Anti-pattern chips toggle ─────────────────────────
      toggleAntiPattern: (item) =>
        set((s) => {
          const list = s.pillars.rules.antiPatterns
          const next = list.includes(item) ? list.filter((x) => x !== item) : [...list, item]
          return { pillars: { ...s.pillars, rules: { ...s.pillars.rules, antiPatterns: next } } }
        }),

      // ── Navigation ───────────────────────────────────────
      nextStep: () =>
        set((s) => ({ currentStep: Math.min(s.currentStep + 1, s.totalSteps - 1) })),

      prevStep: () =>
        set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),

      goToStep: (step) => set({ currentStep: step }),

      // ── Outputs ───────────────────────────────────────────
      setOutput: (key, value) =>
        set((s) => ({ generatedOutputs: { ...s.generatedOutputs, [key]: value } })),

      setAllOutputs: (outputs) =>
        set((s) => ({ generatedOutputs: { ...s.generatedOutputs, ...outputs } })),

      toggleMetricDone: (id) =>
        set((s) => ({
          generatedOutputs: {
            ...s.generatedOutputs,
            metrics: s.generatedOutputs.metrics.map((m) =>
              m.id === id ? { ...m, done: !m.done } : m
            ),
          },
        })),

      // ── Mode & API key ────────────────────────────────────
      setOutputMode: (mode) => set({ outputMode: mode }),
      setApiKey: (key) => set({ apiKey: key }),

      // ── Generation state ─────────────────────────────────
      setGenerating: (val) => set({ isGenerating: val }),
      setGenerationError: (err) => set({ generationError: err }),

      // ── Reset ─────────────────────────────────────────────
      reset: () => set({ ...defaultState }),
    }),
    {
      name: 'pcg-project-store',
      // Don't persist the API key to localStorage for security
      partialize: (s) => {
        const { apiKey, isGenerating, generationError, ...rest } = s
        return rest
      },
    }
  )
)

export default useProjectStore
