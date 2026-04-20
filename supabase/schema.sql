-- ═══════════════════════════════════════════════════════════════════════════
-- Chhaya's Posts — Supabase Schema  (run once in SQL Editor → New Query → Run)
-- ═══════════════════════════════════════════════════════════════════════════


-- ─── 1. Posts table ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS posts (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT        NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  content    TEXT,
  category   TEXT        NOT NULL DEFAULT 'note'
               CHECK (category IN ('poem', 'reflection', 'story', 'note')),
  audio_url  TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- At least one of content or audio_url must be present
  CONSTRAINT post_has_content CHECK (
    content IS NOT NULL OR audio_url IS NOT NULL
  )
);

-- Fast ordering for the homepage feed
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


-- ─── 3. Row-Level Security on posts ────────────────────────────────────────
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Public can read all posts (the homepage feed)
DROP POLICY IF EXISTS "Allow public read" ON posts;
CREATE POLICY "Allow public read"
  ON posts FOR SELECT
  TO anon, authenticated
  USING (true);

-- service_role (our admin API) bypasses RLS automatically for INSERT/UPDATE/DELETE


-- ─── 4. Storage bucket for audio recordings ────────────────────────────────
--
-- ✅ CRITICAL: We do NOT set allowed_mime_types here.
--
-- Why? Because browsers append codec info to MIME types:
--   'audio/webm'           → standard
--   'audio/webm;codecs=opus' → what Chrome/Edge actually sends
--
-- Supabase does EXACT string matching on allowed_mime_types.
-- If we set ['audio/webm'] it REJECTS 'audio/webm;codecs=opus'.
-- Leaving allowed_mime_types as NULL means ALL audio types are accepted.
-- Our API route (upload/route.js) already validates the MIME type safely.
--
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'recordings',
  'recordings',
  true,       -- Public: audio files stream without signed URLs
  52428800,   -- 50 MB per file
  NULL        -- ✅ NULL = accept all types (our API validates them)
)
ON CONFLICT (id) DO UPDATE SET
  public             = EXCLUDED.public,
  file_size_limit    = EXCLUDED.file_size_limit,
  allowed_mime_types = NULL;  -- ✅ Remove any old restrictions


-- ─── 5. Storage RLS policies ───────────────────────────────────────────────

-- Anyone can stream/download recordings (needed for the AudioPlayer)
DROP POLICY IF EXISTS "Public can read recordings" ON storage.objects;
CREATE POLICY "Public can read recordings"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'recordings');

-- service_role bypasses RLS for INSERT/UPDATE/DELETE automatically.
-- No extra INSERT policy needed — our admin client uses the service_role key.


-- ─── 6. Verify ─────────────────────────────────────────────────────────────
DO $$
BEGIN
  RAISE NOTICE '✓ posts table ready';
  RAISE NOTICE '✓ Row-Level Security applied';
  RAISE NOTICE '✓ recordings storage bucket ready (no MIME type restriction)';
  RAISE NOTICE '';
  RAISE NOTICE 'Setup complete! Database is ready for Chhaya''s Posts.';
END $$;
