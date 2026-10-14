import { neon } from '@neondatabase/serverless'

const schema = [
  `CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY, kind TEXT NOT NULL CHECK (kind IN ('audit', 'project')),
    name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT,
    contact_preference TEXT NOT NULL DEFAULT 'email', company TEXT,
    fields_json TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'new',
    consent_version TEXT NOT NULL DEFAULT '2026-10-14',
    created_at TEXT NOT NULL, updated_at TEXT NOT NULL
  )`,
  'CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at DESC)',
  'CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status, created_at DESC)',
  `CREATE TABLE IF NOT EXISTS payment_confirmations (
    id TEXT PRIMARY KEY, quote_reference TEXT NOT NULL, name TEXT NOT NULL,
    email TEXT NOT NULL, amount_paise INTEGER NOT NULL CHECK (amount_paise > 0),
    utr TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL, updated_at TEXT NOT NULL
  )`,
  'CREATE UNIQUE INDEX IF NOT EXISTS payment_utr_idx ON payment_confirmations(utr)',
  'CREATE INDEX IF NOT EXISTS payment_reference_idx ON payment_confirmations(quote_reference, created_at DESC)',
]

export function createNeonDatabase(connectionString, query) {
  const execute = query || neon(connectionString).query
  let ready
  const ensureSchema = () => {
    if (!ready) ready = (async () => {
      for (const statement of schema) await execute(statement, [])
    })().catch(error => { ready = undefined; throw error })
    return ready
  }

  const statement = sql => ({
    bind(...values) {
      const text = sql.replace(/\?(\d+)/g, (_, number) => `$${number}`)
      return {
        async run() { await ensureSchema(); await execute(text, values); return { success: true } },
        async all() { await ensureSchema(); return { results: await execute(text, values) } },
      }
    },
  })

  return {
    prepare: statement,
    async batch(statements) { return Promise.all(statements.map(item => item.all())) },
    ensureSchema,
  }
}
