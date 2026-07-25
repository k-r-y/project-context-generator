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
      stack: [],
      rendering: '',
      database: '',
      deployment: '',
      designPattern: '',
      authStrategy: '',
    },
    design: {
      vibe: '',
      primaryColor: '',
      secondaryColor: '',
      typography: '',
      secondaryTypography: '',
      uiLibraries: [],
      iconSet: '',
      layoutConcepts: [],
      spacing: '',
      roundedCorners: '',
    },
    rules: {
      language: '',
      testing: '',
      antiPatterns: [],
      extraConstraints: '',
      fileNaming: '',
      componentNaming: '',
      dbNaming: '',
      errorHandling: '',
    },
    schema: {
      entities: [],
      dataPattern: '',
    },
  },
  generatedOutputs: {
    prd: null,
    architecture: null,
    design: null,
    rules: null,
    schema: null,
    metrics: [],
  },
  outputMode: 'system',
  apiKey: '',
  currentStep: 0,
  totalSteps: 8,
  isGenerating: false,
  generationError: null,

  // Firebase auth & projects sync state
  user: null, // { uid, email }
  userProjects: [], // Array of saved projects from Firestore
  firebaseConfig: null, // Custom Firebase config object if pasted by user
}

const useProjectStore = create(
  persist(
    (set, get) => ({
      ...defaultState,

      // Meta
      setMeta: (meta) =>
        set((s) => ({ projectMeta: { ...s.projectMeta, ...meta } })),

      // Pillars
      setArchitecture: (data) =>
        set((s) => ({
          pillars: { ...s.pillars, architecture: { ...s.pillars.architecture, ...data } },
        })),

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

      toggleStackItem: (item) =>
        set((s) => {
          const stack = s.pillars.architecture.stack
          const next = stack.includes(item) ? stack.filter((x) => x !== item) : [...stack, item]
          return { pillars: { ...s.pillars, architecture: { ...s.pillars.architecture, stack: next } } }
        }),

      toggleAntiPattern: (item) =>
        set((s) => {
          const list = s.pillars.rules.antiPatterns
          const next = list.includes(item) ? list.filter((x) => x !== item) : [...list, item]
          return { pillars: { ...s.pillars, rules: { ...s.pillars.rules, antiPatterns: next } } }
        }),

      // Navigation
      nextStep: () =>
        set((s) => ({ currentStep: Math.min(s.currentStep + 1, s.totalSteps - 1) })),

      prevStep: () =>
        set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),

      goToStep: (step) => set({ currentStep: step }),

      // Outputs
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

      // Auth & Sync Actions
      setUser: (user) => set({ user }),
      setFirebaseConfig: (cfg) => set({ firebaseConfig: cfg }),
      setUserProjects: (projects) => set({ userProjects: projects }),

      // Mode & API key
      setOutputMode: (mode) => set({ outputMode: mode }),
      setApiKey: (key) => set({ apiKey: key }),

      // Generation state
      setGenerating: (val) => set({ isGenerating: val }),
      setGenerationError: (err) => set({ generationError: err }),

      // Reset
      reset: () => {
        const { firebaseConfig, user } = get()
        set({ ...defaultState, firebaseConfig, user })
      },
    }),
    {
      name: 'pcg-project-store-v3',
      partialize: (s) => {
        const { apiKey, isGenerating, generationError, userProjects, ...rest } = s
        return rest
      },
    }
  )
)

export default useProjectStore
