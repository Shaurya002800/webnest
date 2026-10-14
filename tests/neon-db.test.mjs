import assert from 'node:assert/strict'
import test from 'node:test'
import { createNeonDatabase } from '../server/neon-db.js'

test('creates compatible tables and safely binds D1-style parameters for Neon', async () => {
  const calls = []
  const db = createNeonDatabase('unused-in-test', async (sql, values) => {
    calls.push({ sql, values })
    return sql.startsWith('SELECT') ? [{ id: 'WN-A-1' }] : []
  })

  await db.prepare('INSERT INTO leads (id, name) VALUES (?1, ?2)').bind('WN-A-1', "O'Brien").run()
  const result = await db.prepare('SELECT id FROM leads WHERE name = ?1').bind("O'Brien").all()

  assert.deepEqual(result.results, [{ id: 'WN-A-1' }])
  assert.match(calls[0].sql, /^CREATE TABLE IF NOT EXISTS leads/)
  assert.deepEqual(calls.at(-2), { sql: 'INSERT INTO leads (id, name) VALUES ($1, $2)', values: ['WN-A-1', "O'Brien"] })
  assert.deepEqual(calls.at(-1), { sql: 'SELECT id FROM leads WHERE name = $1', values: ["O'Brien"] })
  assert.equal(calls.filter(call => call.sql.startsWith('CREATE TABLE')).length, 3)
})
