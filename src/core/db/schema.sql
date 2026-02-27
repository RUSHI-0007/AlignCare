-- src/core/db/schema.sql
-- Run this in Supabase SQL editor to initialize the database

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── ENUMS ────────────────────────────────────────────────────────────────

CREATE TYPE appointment_status AS ENUM ('CONFIRMED','CANCELLED','COMPLETED','WALK_IN','BLOCKED');
CREATE TYPE service_type       AS ENUM ('PHYSIOTHERAPY','CANCER_REHAB','HOME_VISIT');
CREATE TYPE visit_type         AS ENUM ('CLINIC','HOME');
CREATE TYPE shift_type         AS ENUM ('MORNING','EVENING');
CREATE TYPE created_by_type    AS ENUM ('PATIENT','ADMIN','AI_AGENT');

-- ─── PATIENTS ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS patients (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name  TEXT NOT NULL,
  phone      TEXT NOT NULL UNIQUE,
  email      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_patients_phone ON patients(phone);

-- ─── APPOINTMENTS ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS appointments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id       UUID NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
  service_type     service_type NOT NULL DEFAULT 'PHYSIOTHERAPY',
  visit_type       visit_type NOT NULL DEFAULT 'CLINIC',
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  shift            shift_type NOT NULL,
  status           appointment_status NOT NULL DEFAULT 'CONFIRMED',
  notes            TEXT,
  created_by       created_by_type NOT NULL DEFAULT 'PATIENT',
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- THE CRITICAL CONSTRAINT:
-- This is the actual race condition prevention at the DB level.
-- Two simultaneous writes to the same slot: one succeeds, one gets error 23505.
CREATE UNIQUE INDEX idx_no_double_booking
  ON appointments(appointment_date, appointment_time)
  WHERE status NOT IN ('CANCELLED');

CREATE INDEX idx_appointments_date       ON appointments(appointment_date);
CREATE INDEX idx_appointments_patient    ON appointments(patient_id);
CREATE INDEX idx_appointments_date_shift ON appointments(appointment_date, shift);

-- ─── BLOCKED SLOTS ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS blocked_slots (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_date  DATE NOT NULL,
  slot_time  TIME NOT NULL,
  reason     TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_blocked_unique ON blocked_slots(slot_date, slot_time);
CREATE INDEX idx_blocked_date ON blocked_slots(slot_date);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────

ALTER TABLE patients      ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all_patients"     ON patients      FOR ALL TO service_role USING (true);
CREATE POLICY "service_role_all_appointments" ON appointments  FOR ALL TO service_role USING (true);
CREATE POLICY "service_role_all_blocked"      ON blocked_slots FOR ALL TO service_role USING (true);
CREATE POLICY "public_insert_appointments"    ON appointments  FOR INSERT TO anon      WITH CHECK (true);

-- ─── REALTIME ─────────────────────────────────────────────────────────────

ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE blocked_slots;

-- ─── AUTO-UPDATE TIMESTAMPS ───────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_patients_updated_at
  BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_appointments_updated_at
  BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
