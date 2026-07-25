/**
 * Utility to parse SQL CREATE TABLE schema definitions or JSON arrays of tables
 * into a structured format for the Project Context Generator store.
 */

export function parseSQL(sqlText) {
  const tables = []
  if (!sqlText) return tables

  // Strip block comments /* ... */ and single-line comments -- ...
  const cleanSql = sqlText
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/--.*$/gm, '')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')

  // Look for CREATE TABLE [IF NOT EXISTS] name (columns...)
  const createTableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:[a-zA-Z_0-9]+?\.)?([a-zA-Z_0-9]+)\s*\((.*?)\)(?:;|\s*WITH|\s*TABLESPACE|$)/gi

  let match
  while ((match = createTableRegex.exec(cleanSql)) !== null) {
    const tableName = match[1].replace(/['"`]/g, '').trim()
    const body = match[2]
    const columns = []

    // Split by commas, but ignore commas inside parentheses (e.g. VARCHAR(255) or DECIMAL(10,2))
    let depth = 0
    let start = 0
    const parts = []
    for (let i = 0; i < body.length; i++) {
      if (body[i] === '(') depth++
      else if (body[i] === ')') depth--
      else if (body[i] === ',' && depth === 0) {
        parts.push(body.substring(start, i).trim())
        start = i + 1
      }
    }
    parts.push(body.substring(start).trim())

    parts.forEach((part) => {
      // Ignore table-level constraints (PRIMARY KEY (...), FOREIGN KEY (...), UNIQUE (...), CHECK (...))
      if (/^(?:PRIMARY\s+KEY|FOREIGN\s+KEY|UNIQUE|CONSTRAINT|KEY|CHECK)/i.test(part.trim())) {
        return
      }

      // Standard column definition is: "col_name data_type [constraints]"
      const tokens = part.split(/\s+/).filter(Boolean)
      if (tokens.length >= 2) {
        const colName = tokens[0].replace(/['"`]/g, '').trim()
        let colType = tokens[1]

        // Re-assemble types with arguments like VARCHAR(255) or DECIMAL(10, 2)
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
          type: colType,
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

export function parseJSON(jsonStr) {
  try {
    const data = JSON.parse(jsonStr)
    if (Array.isArray(data)) {
      const valid = data.every((t) => t && typeof t.name === 'string' && Array.isArray(t.columns))
      if (valid) {
        return data.map((t) => ({
          name: t.name,
          columns: t.columns.map((c) => ({
            name: c.name || 'unnamed',
            type: c.type || 'VARCHAR(255)',
            constraints: c.constraints || '',
            description: c.description || '',
          })),
        }))
      }
    }
  } catch (e) {
    // Ignore and fallback
  }
  return null
}

export function parseSchema(inputText) {
  const trimmed = inputText.trim()
  if (!trimmed) return []

  // Try parsing as JSON first
  const parsedJson = parseJSON(trimmed)
  if (parsedJson) return parsedJson

  // Fallback to SQL parser
  return parseSQL(trimmed)
}
