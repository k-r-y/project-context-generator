/**
 * Comprehensive parser for SQL CREATE TABLE dumps (MySQL, Postgres, Supabase, SQLite, Oracle, MSSQL),
 * Prisma schemas, and JSON exports into the Project Context Generator store schema format.
 */

/**
 * Cleans quotes, backticks, brackets, and schema prefixes from identifiers (e.g., "public"."users" -> users)
 */
function cleanIdentifier(id) {
  if (!id) return ''
  return id
    .replace(/^["'`\[\\]+|["'`\]\\]+$/g, '')
    .replace(/^.*?\./, '') // Strip schema prefix like public. or dbname.
    .replace(/["'`\[\]]/g, '')
    .trim()
}

export function parseSQL(sqlText) {
  const tables = []
  if (!sqlText) return tables

  // 1. Strip comments: /* block */, -- line, # line
  const cleanSql = sqlText
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(?:--|#).*$/gm, '')

  // 2. Find all CREATE TABLE statements using a robust scanner
  const createTableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([`'"[\w.-]+)/gi

  let match
  while ((match = createTableRegex.exec(cleanSql)) !== null) {
    const rawTableName = match[1]
    const tableName = cleanIdentifier(rawTableName)
    if (!tableName) continue

    // Find the opening parenthesis for this CREATE TABLE
    const startIndex = cleanSql.indexOf('(', match.index + match[0].length)
    if (startIndex === -1) continue

    // Track matching parenthesis depth to extract full table body
    let depth = 1
    let endIndex = -1
    let inSingleQuote = false
    let inDoubleQuote = false
    let inBacktick = false

    for (let i = startIndex + 1; i < cleanSql.length; i++) {
      const char = cleanSql[i]
      const prevChar = cleanSql[i - 1]

      if (char === "'" && prevChar !== '\\' && !inDoubleQuote && !inBacktick) inSingleQuote = !inSingleQuote
      else if (char === '"' && prevChar !== '\\' && !inSingleQuote && !inBacktick) inDoubleQuote = !inDoubleQuote
      else if (char === '`' && prevChar !== '\\' && !inSingleQuote && !inDoubleQuote) inBacktick = !inBacktick

      if (!inSingleQuote && !inDoubleQuote && !inBacktick) {
        if (char === '(') depth++
        else if (char === ')') {
          depth--
          if (depth === 0) {
            endIndex = i
            break
          }
        }
      }
    }

    if (endIndex === -1) continue

    const body = cleanSql.substring(startIndex + 1, endIndex)
    const columns = []

    // Split body into comma-separated parts at depth 0
    let partDepth = 0
    let start = 0
    const parts = []
    let pSingle = false
    let pDouble = false
    let pBacktick = false

    for (let i = 0; i < body.length; i++) {
      const char = body[i]
      const prevChar = body[i - 1]

      if (char === "'" && prevChar !== '\\' && !pDouble && !pBacktick) pSingle = !pSingle
      else if (char === '"' && prevChar !== '\\' && !pSingle && !pBacktick) pDouble = !pDouble
      else if (char === '`' && prevChar !== '\\' && !pSingle && !pDouble) pBacktick = !pBacktick

      if (!pSingle && !pDouble && !pBacktick) {
        if (char === '(') partDepth++
        else if (char === ')') partDepth--
        else if (char === ',' && partDepth === 0) {
          parts.push(body.substring(start, i).trim())
          start = i + 1
        }
      }
    }
    if (start < body.length) {
      parts.push(body.substring(start).trim())
    }

    // Process column definitions
    parts.forEach((part) => {
      const trimmedPart = part.replace(/\s+/g, ' ').trim()
      if (!trimmedPart) return

      // Skip table-level constraints & indexes
      if (
        /^(?:PRIMARY\s+KEY|FOREIGN\s+KEY|UNIQUE|CONSTRAINT|KEY|INDEX|CHECK|FULLTEXT|SPATIAL)/i.test(
          trimmedPart
        )
      ) {
        return
      }

      const tokens = trimmedPart.split(/\s+/).filter(Boolean)
      if (tokens.length >= 2) {
        const colName = cleanIdentifier(tokens[0])
        if (!colName || colName.toUpperCase() === 'PRIMARY' || colName.toUpperCase() === 'FOREIGN') return

        let colType = tokens[1]

        // Re-assemble type with parenthesized parameters like VARCHAR(255) or NUMERIC(10, 2)
        let constraintStartIndex = 2
        if (colType.includes('(') && !colType.includes(')')) {
          for (let j = 2; j < tokens.length; j++) {
            colType += ' ' + tokens[j]
            if (tokens[j].includes(')')) {
              constraintStartIndex = j + 1
              break
            }
          }
        }

        const constraints = tokens.slice(constraintStartIndex).join(' ')
        columns.push({
          name: colName,
          type: colType.toUpperCase(),
          constraints: constraints.trim(),
          description: '',
        })
      }
    })

    if (columns.length > 0) {
      tables.push({
        name: tableName,
        columns,
      })
    }
  }

  return tables
}

/**
 * Parses Prisma schema definitions (model User { id String @id ... })
 */
export function parsePrisma(prismaText) {
  const tables = []
  const modelRegex = /model\s+([A-Za-z0-9_]+)\s*\{([\s\S]*?)\}/g
  let match

  while ((match = modelRegex.exec(prismaText)) !== null) {
    const tableName = match[1].toLowerCase()
    const body = match[2]
    const columns = []

    const lines = body.split('\n')
    lines.forEach((line) => {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('@@')) return

      const parts = trimmed.split(/\s+/).filter(Boolean)
      if (parts.length >= 2) {
        const colName = parts[0]
        const colType = parts[1]
        const constraints = parts.slice(2).join(' ')
        if (!colName.startsWith('@')) {
          columns.push({
            name: colName,
            type: colType,
            constraints: constraints,
            description: '',
          })
        }
      }
    })

    if (columns.length > 0) {
      tables.push({ name: tableName, columns })
    }
  }

  return tables.length > 0 ? tables : null
}

export function parseJSON(jsonStr) {
  try {
    const data = JSON.parse(jsonStr)
    // Array of tables format: [{ name: "users", columns: [...] }]
    if (Array.isArray(data)) {
      const valid = data.every((t) => t && typeof t.name === 'string' && Array.isArray(t.columns))
      if (valid) {
        return data.map((t) => ({
          name: cleanIdentifier(t.name),
          columns: t.columns.map((c) => ({
            name: cleanIdentifier(c.name) || 'unnamed',
            type: c.type || 'VARCHAR(255)',
            constraints: c.constraints || '',
            description: c.description || '',
          })),
        }))
      }
    }
    // Key-value format: { users: [{ name: "id", type: "UUID" }], posts: [...] }
    if (typeof data === 'object' && data !== null) {
      const tables = []
      for (const [tName, cols] of Object.entries(data)) {
        if (Array.isArray(cols)) {
          const columns = cols.map((c) => ({
            name: typeof c === 'string' ? cleanIdentifier(c) : cleanIdentifier(c.name || 'unnamed'),
            type: (typeof c === 'object' && c.type) || 'VARCHAR(255)',
            constraints: (typeof c === 'object' && c.constraints) || '',
            description: (typeof c === 'object' && c.description) || '',
          }))
          tables.push({ name: cleanIdentifier(tName), columns })
        }
      }
      if (tables.length > 0) return tables
    }
  } catch (e) {
    // Fallback
  }
  return null
}

export function parseSchema(inputText) {
  const trimmed = inputText.trim()
  if (!trimmed) return []

  // 1. Try parsing as JSON first
  const parsedJson = parseJSON(trimmed)
  if (parsedJson && parsedJson.length > 0) return parsedJson

  // 2. Try parsing as SQL
  const parsedSql = parseSQL(trimmed)
  if (parsedSql && parsedSql.length > 0) return parsedSql

  // 3. Try parsing as Prisma schema
  const parsedPrisma = parsePrisma(trimmed)
  if (parsedPrisma && parsedPrisma.length > 0) return parsedPrisma

  return []
}

