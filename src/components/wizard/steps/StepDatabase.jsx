import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Database, Plus, Trash, Upload, FileCode, Edit3, ChevronDown, ChevronRight, HelpCircle, Check, AlertCircle } from 'lucide-react'
import QuestionCard from '../QuestionCard'
import useProjectStore from '@/store/useProjectStore'
import { staggerContainer, staggerItem } from '@/lib/animationVariants'
import { parseSchema } from '@/lib/schemaParser'

const DB_OPTIONS = [
  { value: 'Supabase', desc: 'Postgres + Auth + Realtime + Storage. Best for rapid full-stack development.' },
  { value: 'Firebase', desc: 'NoSQL Firestore + Auth + Hosting. Best for real-time apps and mobile.' },
  { value: 'Postgres', desc: 'Self-hosted or managed Postgres (Neon, Railway). Full SQL power.' },
  { value: 'PlanetScale', desc: 'MySQL-compatible serverless DB with branching. Great for scale.' },
  { value: 'MongoDB', desc: 'Flexible document database. Best for varied, schema-less data.' },
  { value: 'SQLite', desc: 'Embedded, serverless. Best for local-first or simple apps.' },
  { value: 'None', desc: 'Frontend-only or using an external API. No database needed.' },
]

const DEPLOY_OPTIONS = [
  { value: 'Vercel' },
  { value: 'Netlify' },
  { value: 'Railway' },
  { value: 'Fly.io' },
  { value: 'AWS' },
  { value: 'Docker' },
  { value: 'None' },
]

const DATA_PATTERNS = ['REST', 'GraphQL', 'tRPC', 'Server Actions', 'None']

const COLUMN_TYPES = [
  'UUID',
  'VARCHAR(255)',
  'TEXT',
  'INTEGER',
  'BOOLEAN',
  'TIMESTAMPTZ',
  'TIMESTAMP',
  'JSONB',
  'NUMERIC',
  'REAL',
  'DATE',
]

const DB_MAPPING = {
  'Supabase': 'Supabase',
  'Firebase': 'Firebase',
  'PostgreSQL': 'Postgres',
  'MySQL': 'PlanetScale',
  'MongoDB': 'MongoDB',
  'SQLite': 'SQLite',
}

export default function StepDatabase({ onNext, onBack }) {
  const { pillars, setArchitecture, setSchema } = useProjectStore()
  const { database, deployment } = pillars.architecture
  const { dataPattern, entities = [] } = pillars.schema

  const [schemaExpanded, setSchemaExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState('builder') // 'builder' | 'upload'
  const [pasteContent, setPasteContent] = useState('')
  const [newTableName, setNewTableName] = useState('')
  const [expandedTables, setExpandedTables] = useState({}) // { [tableIndex]: boolean }
  const [statusMessage, setStatusMessage] = useState(null) // { type: 'success'|'error', text: string }

  const fileInputRef = useRef(null)

  const stack = pillars.architecture.stack || []
  // Filter databases, deployment, and apis selected in the Stack step
  const selectedDbs = stack.filter((x) => Object.keys(DB_MAPPING).includes(x))
  const selectedDeploys = stack.filter((x) => DEPLOY_OPTIONS.some(d => d.value === x))
  const selectedApis = stack.filter((x) => DATA_PATTERNS.includes(x))

  // Automatically select if exactly one is selected in Stack
  useEffect(() => {
    const updates = {}
    if (selectedDbs.length === 1) {
      const autoDb = DB_MAPPING[selectedDbs[0]]
      if (database !== autoDb) updates.database = autoDb
    } else if (selectedDbs.length === 0 && !database) {
      updates.database = 'None'
    }

    if (selectedDeploys.length === 1 && deployment !== selectedDeploys[0]) {
      updates.deployment = selectedDeploys[0]
    }
    if (selectedApis.length === 1 && dataPattern !== selectedApis[0]) {
      updates.dataPattern = selectedApis[0]
    }

    if (Object.keys(updates).length > 0) {
      if (updates.dataPattern !== undefined) {
        setSchema({ dataPattern: updates.dataPattern })
        delete updates.dataPattern
      }
      if (Object.keys(updates).length > 0) {
        setArchitecture(updates)
      }
    }
  }, [selectedDbs, selectedDeploys, selectedApis, database, deployment, dataPattern, setArchitecture, setSchema])

  const canProceed = !!database && !!dataPattern && !!deployment

  // Toggle table expansion
  const toggleTable = (idx) => {
    setExpandedTables((prev) => ({ ...prev, [idx]: !prev[idx] }))
  }

  // Set message helper
  const showStatus = (type, text) => {
    setStatusMessage({ type, text })
    setTimeout(() => setStatusMessage(null), 5000)
  }

  // Builder actions
  const handleAddTable = (e) => {
    e.preventDefault()
    const name = newTableName.trim().toLowerCase().replace(/[^a-z0-9_]/g, '')
    if (!name) return

    if (entities.some((t) => t.name === name)) {
      showStatus('error', `Table "${name}" already exists!`)
      return
    }

    const newTable = {
      name,
      columns: [
        { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY', description: 'Unique identifier' },
      ],
    }

    const updated = [...entities, newTable]
    setSchema({ entities: updated })
    setNewTableName('')
    toggleTable(updated.length - 1) // Auto expand new table
    showStatus('success', `Added table "${name}"`)
  }

  const handleDeleteTable = (idx) => {
    const table = entities[idx]
    const updated = entities.filter((_, i) => i !== idx)
    setSchema({ entities: updated })
    showStatus('success', `Deleted table "${table.name}"`)
  }

  const handleUpdateTableName = (idx, newName) => {
    const cleanName = newName.toLowerCase().replace(/[^a-z0-9_]/g, '')
    const updated = entities.map((t, i) => (i === idx ? { ...t, name: cleanName } : t))
    setSchema({ entities: updated })
  }

  // Column actions
  const handleAddColumn = (tableIdx) => {
    const updated = entities.map((t, i) => {
      if (i === tableIdx) {
        return {
          ...t,
          columns: [
            ...t.columns,
            { name: 'new_column', type: 'VARCHAR(255)', constraints: '', description: '' },
          ],
        }
      }
      return t
    })
    setSchema({ entities: updated })
  }

  const handleDeleteColumn = (tableIdx, colIdx) => {
    const updated = entities.map((t, i) => {
      if (i === tableIdx) {
        return {
          ...t,
          columns: t.columns.filter((_, j) => j !== colIdx),
        }
      }
      return t
    })
    setSchema({ entities: updated })
  }

  const handleUpdateColumn = (tableIdx, colIdx, fields) => {
    const updated = entities.map((t, i) => {
      if (i === tableIdx) {
        const nextCols = t.columns.map((c, j) => (j === colIdx ? { ...c, ...fields } : c))
        return { ...t, columns: nextCols }
      }
      return t
    })
    setSchema({ entities: updated })
  }

  // Parse schema paste/upload actions
  const handleParseContent = () => {
    if (!pasteContent.trim()) {
      showStatus('error', 'Please paste some SQL or JSON content first.')
      return
    }
    const parsed = parseSchema(pasteContent)
    if (parsed && parsed.length > 0) {
      setSchema({ entities: parsed })
      setSchemaExpanded(true)
      showStatus('success', `Successfully imported ${parsed.length} table${parsed.length > 1 ? 's' : ''}!`)
    } else {
      showStatus('error', 'Could not parse any CREATE TABLE statements or JSON schema. Check SQL syntax or quotes.')
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      const text = evt.target.result
      setPasteContent(text)
      const parsed = parseSchema(text)
      if (parsed && parsed.length > 0) {
        setSchema({ entities: parsed })
        setSchemaExpanded(true)
        showStatus('success', `Successfully imported ${parsed.length} table${parsed.length > 1 ? 's' : ''} from "${file.name}"!`)
      } else {
        showStatus('error', `Could not parse CREATE TABLE statements from "${file.name}". Check if the file contains CREATE TABLE syntax.`)
      }
    }
    reader.readAsText(file)
    e.target.value = '' // Clear input
  }

  return (
    <QuestionCard>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
      >
        <motion.div variants={staggerItem} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px', height: '36px', borderRadius: '9px',
              background: 'linear-gradient(135deg, #14b8a6, #22c55e)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Database size={18} color="white" />
          </div>
          <span className="badge badge-brand">Data Layer</span>
        </motion.div>

        <motion.div variants={staggerItem}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '6px' }}>
            Where does your data live?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
            Choose deployment platform, API data pattern, and optionally design/upload your database schema.
          </p>
        </motion.div>

        {/* Database Options - Automatically inferred if selected in stack */}
        <motion.div variants={staggerItem}>
          {selectedDbs.length === 1 ? (
            <div style={{
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1px solid rgba(20,184,166,0.2)',
              background: 'rgba(20,184,166,0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#14b8a6', display: 'block', fontWeight: 700, letterSpacing: '0.05em' }}>
                  DATABASE INFERRED FROM TECH STACK
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'white' }}>
                  {database || DB_MAPPING[selectedDbs[0]]}
                </span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#14b8a6', background: 'rgba(20,184,166,0.1)', padding: '4px 10px', borderRadius: '99px', fontWeight: 600 }}>
                Active
              </span>
            </div>
          ) : selectedDbs.length > 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
                SELECT PRIMARY DATABASE (FROM CHOSEN STACK)
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedDbs.map((dbKey) => {
                  const value = DB_MAPPING[dbKey]
                  const isActive = database === value
                  return (
                    <motion.button
                      key={value}
                      onClick={() => setArchitecture({ database: value })}
                      whileHover={{ scale: 1.005 }}
                      whileTap={{ scale: 0.99 }}
                      type="button"
                      aria-pressed={isActive}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 14px', borderRadius: '8px',
                        border: `1px solid ${isActive ? 'rgba(20,184,166,0.5)' : 'rgba(255,255,255,0.07)'}`,
                        background: isActive ? 'rgba(20,184,166,0.1)' : 'rgba(255,255,255,0.02)',
                        cursor: 'pointer', color: isActive ? '#5eead4' : 'rgba(255,255,255,0.85)',
                        fontSize: '0.85rem', fontWeight: 600, transition: 'all 150ms ease',
                      }}
                    >
                      <span>{value}</span>
                      {isActive && <Check size={14} color="#14b8a6" />}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
                DATABASE TYPE
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {DB_OPTIONS.map((opt) => {
                  const isActive = database === opt.value
                  return (
                    <motion.button
                      key={opt.value}
                      onClick={() => setArchitecture({ database: opt.value })}
                      whileHover={{ scale: 1.005 }}
                      whileTap={{ scale: 0.99 }}
                      type="button"
                      aria-pressed={isActive}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '10px 12px', borderRadius: '8px',
                        border: `1px solid ${isActive ? 'rgba(20,184,166,0.5)' : 'rgba(255,255,255,0.07)'}`,
                        background: isActive ? 'rgba(20,184,166,0.1)' : 'rgba(255,255,255,0.02)',
                        cursor: 'pointer', textAlign: 'left', transition: 'all 150ms ease',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <span style={{ fontWeight: 600, color: isActive ? '#5eead4' : 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>
                          {opt.value}
                        </span>
                        <span style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.4)', display: 'block', marginTop: '1px' }}>
                          {opt.desc}
                        </span>
                      </div>
                      {isActive && <Check size={14} color="#14b8a6" />}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          )}
        </motion.div>

        {/* Deployment */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {selectedDeploys.length === 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>
                DEPLOYMENT INFERRED FROM TECH STACK
              </label>
              <div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>{deployment || selectedDeploys[0]}</div>
            </div>
          ) : selectedDeploys.length > 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>
                SELECT PRIMARY DEPLOYMENT (FROM CHOSEN STACK)
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedDeploys.map((val) => (
                  <motion.button
                    key={val}
                    onClick={() => setArchitecture({ deployment: val })}
                    className={`chip ${deployment === val ? 'chip-active' : ''}`}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    aria-pressed={deployment === val}
                  >
                    {val}
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>
                DEPLOYMENT PLATFORM
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {DEPLOY_OPTIONS.map((opt) => (
                  <motion.button
                    key={opt.value}
                    onClick={() => setArchitecture({ deployment: opt.value })}
                    className={`chip ${deployment === opt.value ? 'chip-active' : ''}`}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    aria-pressed={deployment === opt.value}
                  >
                    {opt.value}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Data Pattern */}
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {selectedApis.length === 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>
                API PATTERN INFERRED FROM TECH STACK
              </label>
              <div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>{dataPattern || selectedApis[0]}</div>
            </div>
          ) : selectedApis.length > 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>
                SELECT PRIMARY API PATTERN (FROM CHOSEN STACK)
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedApis.map((p) => (
                  <motion.button
                    key={p}
                    onClick={() => setSchema({ dataPattern: p })}
                    className={`chip ${dataPattern === p ? 'chip-active' : ''}`}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    aria-pressed={dataPattern === p}
                  >
                    {p}
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>
                API DATA PATTERN
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {DATA_PATTERNS.map((p) => (
                  <motion.button
                    key={p}
                    onClick={() => setSchema({ dataPattern: p })}
                    className={`chip ${dataPattern === p ? 'chip-active' : ''}`}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    aria-pressed={dataPattern === p}
                  >
                    {p}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Expandable Database Schema Builder */}
        {database && database !== 'None' && (
          <motion.div
            variants={staggerItem}
            className="surface-muted"
            style={{
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.01)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div
              onClick={() => setSchemaExpanded(!schemaExpanded)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileCode size={16} className="text-accent" style={{ color: '#14b8a6' }} />
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'white' }}>
                  Database Schema & Models ({entities.length} tables defined)
                </span>
              </div>
              <div>
                {schemaExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>
            </div>

            <AnimatePresence>
              {schemaExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '14px' }}
                >
                  <div className="divider" style={{ margin: '4px 0' }} />

                  {/* Schema Tabs */}
                  <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.03)', padding: '3px', borderRadius: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setActiveTab('builder')}
                      style={{
                        flex: 1, padding: '6px 12px', fontSize: '0.78rem', fontWeight: 600,
                        border: 'none', borderRadius: '6px', cursor: 'pointer',
                        background: activeTab === 'builder' ? 'rgba(255,255,255,0.08)' : 'transparent',
                        color: activeTab === 'builder' ? 'white' : 'rgba(255,255,255,0.5)',
                        transition: 'all 120ms ease',
                      }}
                    >
                      Interactive Builder
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('upload')}
                      style={{
                        flex: 1, padding: '6px 12px', fontSize: '0.78rem', fontWeight: 600,
                        border: 'none', borderRadius: '6px', cursor: 'pointer',
                        background: activeTab === 'upload' ? 'rgba(255,255,255,0.08)' : 'transparent',
                        color: activeTab === 'upload' ? 'white' : 'rgba(255,255,255,0.5)',
                        transition: 'all 120ms ease',
                      }}
                    >
                      Upload / Paste SQL
                    </button>
                  </div>

                  {/* Status Banner */}
                  {statusMessage && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '8px 12px', borderRadius: '8px',
                      fontSize: '0.75rem',
                      background: statusMessage.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                      border: `1px solid ${statusMessage.type === 'success' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                      color: statusMessage.type === 'success' ? '#4ade80' : '#f87171',
                    }}>
                      {statusMessage.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
                      <span>{statusMessage.text}</span>
                    </div>
                  )}

                  {/* Tab 1: Builder */}
                  {activeTab === 'builder' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {/* Add Table form */}
                      <form onSubmit={handleAddTable} style={{ display: 'flex', gap: '6px' }}>
                        <input
                          type="text"
                          placeholder="Add new table name... (e.g. users, posts)"
                          className="input-glass"
                          style={{ padding: '8px 12px', fontSize: '0.8rem', flex: 1 }}
                          value={newTableName}
                          onChange={(e) => setNewTableName(e.target.value)}
                        />
                        <button type="submit" className="btn-primary" style={{ padding: '8px 14px', fontSize: '0.8rem' }}>
                          <Plus size={14} /> Table
                        </button>
                      </form>

                      {/* Tables list */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {entities.length === 0 ? (
                          <div style={{ padding: '16px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '0.78rem' }}>
                            No custom tables defined yet. Add tables or import via the upload tab.
                          </div>
                        ) : (
                          entities.map((table, tableIdx) => {
                            const isExpanded = !!expandedTables[tableIdx]
                            return (
                              <div
                                key={tableIdx}
                                style={{
                                  border: '1px solid rgba(255,255,255,0.06)',
                                  borderRadius: '8px',
                                  background: 'rgba(255,255,255,0.01)',
                                }}
                              >
                                {/* Table header */}
                                <div
                                  style={{
                                    display: 'flex', alignItems: 'center', justifyBetween: 'space-between',
                                    padding: '8px 12px', cursor: 'pointer', userSelect: 'none',
                                    gap: '8px',
                                  }}
                                  onClick={() => toggleTable(tableIdx)}
                                >
                                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Edit3 size={12} style={{ color: 'rgba(255,255,255,0.3)' }} />
                                    <input
                                      type="text"
                                      value={table.name}
                                      onChange={(e) => handleUpdateTableName(tableIdx, e.target.value)}
                                      onClick={(e) => e.stopPropagation()} // Stop accordion toggle
                                      style={{
                                        background: 'none', border: 'none', color: '#5eead4',
                                        fontSize: '0.85rem', fontWeight: 600, outline: 'none',
                                        width: '120px',
                                      }}
                                    />
                                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)' }}>
                                      ({table.columns.length} columns)
                                    </span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeleteTable(tableIdx)
                                      }}
                                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(239,68,68,0.5)' }}
                                      title="Delete table"
                                    >
                                      <Trash size={13} />
                                    </button>
                                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                  </div>
                                </div>

                                {/* Expanded columns editor */}
                                <AnimatePresence>
                                  {isExpanded && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      style={{
                                        overflow: 'hidden', padding: '0 12px 12px',
                                        display: 'flex', flexDirection: 'column', gap: '8px',
                                      }}
                                    >
                                      <div className="divider" style={{ marginBottom: '4px', opacity: 0.5 }} />

                                      {/* Columns Header */}
                                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1.2fr 24px', gap: '6px', opacity: 0.4, fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.04em' }}>
                                        <span>COLUMN NAME</span>
                                        <span>TYPE</span>
                                        <span>CONSTRAINTS</span>
                                        <span>DESCRIPTION</span>
                                        <span />
                                      </div>

                                      {/* Column rows */}
                                      {table.columns.map((col, colIdx) => (
                                        <div
                                          key={colIdx}
                                          style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1.2fr 1fr 1fr 1.2fr 24px',
                                            gap: '6px',
                                            alignItems: 'center',
                                          }}
                                        >
                                          <input
                                            type="text"
                                            className="input-glass"
                                            style={{ padding: '5px 8px', fontSize: '0.76rem', borderRadius: '4px' }}
                                            value={col.name}
                                            onChange={(e) => handleUpdateColumn(tableIdx, colIdx, { name: e.target.value })}
                                            placeholder="column_name"
                                          />
                                          <select
                                            className="input-glass"
                                            style={{ padding: '5px 8px', fontSize: '0.76rem', borderRadius: '4px', cursor: 'pointer' }}
                                            value={col.type}
                                            onChange={(e) => handleUpdateColumn(tableIdx, colIdx, { type: e.target.value })}
                                          >
                                            {COLUMN_TYPES.map((t) => (
                                              <option key={t} value={t} style={{ background: '#1c1c1c' }}>
                                                {t}
                                              </option>
                                            ))}
                                          </select>
                                          <input
                                            type="text"
                                            className="input-glass"
                                            style={{ padding: '5px 8px', fontSize: '0.76rem', borderRadius: '4px' }}
                                            value={col.constraints}
                                            onChange={(e) => handleUpdateColumn(tableIdx, colIdx, { constraints: e.target.value })}
                                            placeholder="PK, UNIQUE, DEFAULT..."
                                          />
                                          <input
                                            type="text"
                                            className="input-glass"
                                            style={{ padding: '5px 8px', fontSize: '0.76rem', borderRadius: '4px' }}
                                            value={col.description}
                                            onChange={(e) => handleUpdateColumn(tableIdx, colIdx, { description: e.target.value })}
                                            placeholder="What is this column..."
                                          />
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteColumn(tableIdx, colIdx)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(239,68,68,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                          >
                                            <Trash size={12} />
                                          </button>
                                        </div>
                                      ))}

                                      <button
                                        type="button"
                                        className="btn-ghost"
                                        onClick={() => handleAddColumn(tableIdx)}
                                        style={{ alignSelf: 'flex-start', padding: '4px 8px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '4px' }}
                                      >
                                        <Plus size={12} /> Add column
                                      </button>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Upload/Paste */}
                  {activeTab === 'upload' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {/* File Upload Zone */}
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          border: '2px dashed rgba(255,255,255,0.08)',
                          borderRadius: '8px',
                          padding: '20px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          background: 'rgba(255,255,255,0.01)',
                          transition: 'all 150ms ease',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.borderColor = 'rgba(20,184,166,0.3)')}
                        onMouseOut={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                      >
                        <Upload size={22} style={{ margin: '0 auto 8px', color: '#14b8a6', opacity: 0.8 }} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'rgba(255,255,255,0.7)', display: 'block' }}>
                          Upload Schema File (.sql, .json, .txt)
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', display: 'block', marginTop: '2px' }}>
                          Drag & drop or click to choose file
                        </span>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".sql,.json,.txt"
                          onChange={handleFileUpload}
                          style={{ display: 'none' }}
                        />
                      </div>

                      {/* Text Paste */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>
                          OR PASTE SQL CREATE TABLE STATEMENTS
                        </label>
                        <textarea
                          className="input-glass font-mono"
                          style={{ minHeight: '120px', fontSize: '0.74rem', resize: 'vertical' }}
                          placeholder={`CREATE TABLE users (\n  id UUID PRIMARY KEY,\n  email VARCHAR(255) UNIQUE NOT NULL\n);`}
                          value={pasteContent}
                          onChange={(e) => setPasteContent(e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn-primary"
                          onClick={handleParseContent}
                          style={{ alignSelf: 'flex-end', padding: '8px 14px', fontSize: '0.8rem' }}
                        >
                          Parse & Import Schema
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Schema Visualization Preview */}
                  {entities.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>
                        DATABASE SCHEMA PREVIEW
                      </div>
                      <div
                        className="surface"
                        style={{
                          maxHeight: '180px', overflowY: 'auto', padding: '12px',
                          borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)',
                          background: 'rgba(255,255,255,0.01)',
                          display: 'flex', flexDirection: 'column', gap: '10px',
                        }}
                      >
                        {entities.map((t, idx) => (
                          <div key={idx} style={{ fontSize: '0.76rem' }}>
                            <div style={{ color: '#22c55e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span>{t.name}</span>
                              <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 400 }}>table</span>
                            </div>
                            <div style={{ paddingLeft: '10px', marginTop: '2px', borderLeft: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              {t.columns.map((c, cidx) => (
                                <div key={cidx} style={{ display: 'flex', gap: '6px', color: 'rgba(255,255,255,0.5)' }}>
                                  <span style={{ color: 'rgba(255,255,255,0.85)' }}>{c.name}</span>
                                  <span style={{ color: '#4ade80', fontSize: '0.7rem' }}>{c.type}</span>
                                  {c.constraints && <span style={{ color: '#f59e0b', fontSize: '0.7rem' }}>[{c.constraints}]</span>}
                                  {c.description && <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem' }}>// {c.description}</span>}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Buttons */}
        <motion.div variants={staggerItem} style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-ghost" onClick={onBack} style={{ flex: 1 }}>← Back</button>
          <motion.button
            className="btn-primary"
            onClick={onNext}
            disabled={!canProceed}
            style={{ flex: 2, opacity: canProceed ? 1 : 0.4, cursor: canProceed ? 'pointer' : 'not-allowed' }}
            whileTap={canProceed ? { scale: 0.97 } : {}}
          >
            <span>Continue →</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </QuestionCard>
  )
}
