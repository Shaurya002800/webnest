CREATE TABLE leads (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('audit', 'project')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  contact_preference TEXT NOT NULL DEFAULT 'email',
  company TEXT,
  fields_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  consent_version TEXT NOT NULL DEFAULT '2026-10-14',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX leads_created_at_idx ON leads(created_at DESC);
CREATE INDEX leads_status_idx ON leads(status, created_at DESC);

CREATE TABLE payment_confirmations (
  id TEXT PRIMARY KEY,
  quote_reference TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  amount_paise INTEGER NOT NULL CHECK (amount_paise > 0),
  utr TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE UNIQUE INDEX payment_utr_idx ON payment_confirmations(utr);
CREATE INDEX payment_reference_idx ON payment_confirmations(quote_reference, created_at DESC);
