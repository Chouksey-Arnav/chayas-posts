-- ═══════════════════════════════════════════════════════════════════════════
-- Chhaya's Posts — Supabase Schema
-- Run this entire file in the Supabase SQL Editor (one click → Run).
-- ═══════════════════════════════════════════════════════════════════════════


-- ─── 1. Posts table ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS posts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  content    TEXT,
  category   TEXT NOT NULL DEFAULT 'note'
               CHECK (category IN ('poem', 'reflection', 'story', 'note')),
  audio_url  TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- At least one of content or audio_url must be present
  CONSTRAINT post_has_content CHECK (
    content IS NOT NULL OR audio_url IS NOT NULL
  )
);

-- Index for fast ordering on the homepage feed
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts (created_at DESC);


-- ─── 2. Auto-update updated_at on row changes ──────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS posts_updated_at ON posts;
CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ─── 3. Row-Level Security ─────────────────────────────────────────────────
-- Enable RLS so the anon key can only READ posts.
-- The service_role key (used by the admin API routes) bypasses RLS.
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read all posts (the public feed)
DROP POLICY IF EXISTS "Allow public read" ON posts;
CREATE POLICY "Allow public read"
  ON posts FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only the service_role (our server-side admin API) can insert/update/delete.
-- service_role bypasses RLS automatically — no extra policy needed.


-- ─── 4. Storage bucket for audio recordings ────────────────────────────────
-- Create the bucket if it doesn't already exist.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'recordings',
  'recordings',
  true,                           -- Public bucket so audio URLs work without signed URLs
  52428800,                       -- 50 MB per file
  ARRAY[
    'audio/webm',
    'audio/ogg',
    'audio/mp4',
    'audio/mpeg',
    'audio/wav',
    'audio/x-wav'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public             = EXCLUDED.public,
  file_size_limit    = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;


-- Storage RLS: allow public to READ (stream audio); only service_role can write.
DROP POLICY IF EXISTS "Public read recordings" ON storage.objects;
CREATE POLICY "Public read recordings"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'recordings');

-- service_role bypasses storage RLS for INSERT/UPDATE/DELETE automatically.


-- ─── 5. Verify setup ───────────────────────────────────────────────────────
DO $$
BEGIN
  RAISE NOTICE '✓ posts table ready';
  RAISE NOTICE '✓ RLS policies applied';
  RAISE NOTICE '✓ recordings storage bucket ready';
  RAISE NOTICE '';
  RAISE NOTICE 'Setup complete! Your database is ready for Chhaya''s Posts.';
END $$;
