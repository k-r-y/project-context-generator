import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const defaultState = {
  projectMeta: {
    name: '',
    pitch: '',
    problemToSolve: '',
    platform: '', // 'Web' | 'iOS' | 'Android' | 'Cloud' | 'Desktop' | 'Other'
    targetAudience: '',
    businessGoals: '',
    successMetrics: '',
    mvpFeatures: '',
    outOfScope: '',
    expectedUsers: '',
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
      primaryColor: '#6366f1',
      secondaryColor: '#ec4899',
      selectedColors: [],
      typography: '',
      secondaryTypography: '',
      customTypography: '',
      customSecondaryTypography: '',
      cssArchitecture: [],
      customCssArchitecture: '',
      componentLibrary: [],
      customComponentLibrary: '',
      iconSet: '',
      customIconSet: '',
      baseTheme: 'Dark',
      surfaceTreatment: '',
      layoutConcepts: [],
      customLayoutConcept: '',
      spacing: '',
      roundedCorners: '',
      gridMath: '',
      elevationStyle: '',
      animationFeel: '',
      typeScale: '',
      loadingStyle: {
        page: 'skeleton',
        component: 'spinner',
        action: 'spinner',
        scroll: 'spinner'
      },
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
    security: {
      compliance: [],
      dataProtection: [],
      apiSecurity: [],
      vulnerabilityProtection: [],
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
  totalSteps: 9,
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

      setSecurity: (data) =>
        set((s) => ({
          pillars: { ...s.pillars, security: { ...s.pillars.security, ...data } },
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
          const list = s.pillars.rules.antiPatterns || []
          let next
          if (list.includes(item)) {
            next = list.filter((x) => x !== item)
          } else {
            if (item === 'None') {
              next = ['None']
            } else {
              next = [...list.filter((x) => x !== 'None'), item]
            }
          }
          return { pillars: { ...s.pillars, rules: { ...s.pillars.rules, antiPatterns: next } } }
        }),

      toggleSecurityItem: (category, item) =>
        set((s) => {
          const list = s.pillars.security[category] || []
          let next;
          if (item === 'None') {
            next = ['None']
          } else {
            next = list.includes(item) ? list.filter((x) => x !== item) : [...list.filter(x => x !== 'None'), item]
          }
          if (next.length === 0) next = []
          return { pillars: { ...s.pillars, security: { ...s.pillars.security, [category]: next } } }
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
