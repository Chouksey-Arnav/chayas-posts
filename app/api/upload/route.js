import { NextResponse } from 'next/server'
import { getAdminClient, getAuthFromRequest } from '@/lib/db'

// Force Node.js runtime (not Edge) — needed for Buffer + FormData
export const runtime = 'nodejs'

// 50 MB max
const MAX_FILE_SIZE = 50 * 1024 * 1024

// ── POST /api/upload  →  Admin — upload audio to Supabase Storage ────
export async function POST(request) {
  // 1. Verify admin
  const payload = await getAuthFromRequest(request)
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    // 2. Parse FormData
    const formData = await request.formData()
    const file = formData.get('audio')

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No audio file received.' }, { status: 400 })
    }

    // 3. Check size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Recording is too large (max 50 MB). Please record a shorter clip.' },
        { status: 413 }
      )
    }

    if (file.size === 0) {
      return NextResponse.json(
        { error: 'Recording is empty. Please try recording again.' },
        { status: 400 }
      )
    }

    // 4. ✅ CRITICAL FIX: Strip codec suffix from MIME type.
    //    Browsers send 'audio/webm;codecs=opus' — Supabase does EXACT matching
    //    on allowed_mime_types so this would be REJECTED unless we strip the codec.
    //    We use only the base type: 'audio/webm', 'audio/ogg', 'audio/mp4', etc.
    const rawMime    = file.type || 'audio/webm'
    const baseMime   = rawMime.split(';')[0].trim().toLowerCase()

    // Normalise to a supported type
    const mimeType =
      baseMime.startsWith('audio/') ? baseMime : 'audio/webm'

    // Derive file extension from base mime
    const ext =
      mimeType === 'audio/ogg'  ? 'ogg'  :
      mimeType === 'audio/mp4'  ? 'mp4'  :
      mimeType === 'audio/mpeg' ? 'mp3'  :
      mimeType === 'audio/wav'  ? 'wav'  :
                                   'webm'

    // 5. Build unique filename
    const timestamp    = Date.now()
    const randomSuffix = Math.random().toString(36).slice(2, 8)
    const fileName     = `recording-${timestamp}-${randomSuffix}.${ext}`

    // 6. Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()

    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      return NextResponse.json(
        { error: 'Failed to read recording data. Please try again.' },
        { status: 500 }
      )
    }

    const adminClient = getAdminClient()

    // 7. ✅ AUTO-CREATE BUCKET if it doesn't exist.
    //    This makes the upload resilient even if schema.sql wasn't run perfectly.
    const { error: bucketErr } = await adminClient.storage.createBucket('recordings', {
      public:          true,
      fileSizeLimit:   MAX_FILE_SIZE,
      // ✅ No allowedMimeTypes restriction — prevents codec suffix rejection
    })
    // Ignore "already exists" error — that just means it's already there
    if (bucketErr && !bucketErr.message?.toLowerCase().includes('already exist')) {
      console.warn('Bucket creation warning (non-fatal):', bucketErr.message)
    }

    // 8. Upload to Supabase Storage
    //    Pass ArrayBuffer directly — avoids Buffer conversion issues.
    //    Use stripped baseMime as contentType — prevents Supabase rejection.
    const { data, error: uploadError } = await adminClient.storage
      .from('recordings')
      .upload(fileName, arrayBuffer, {
        contentType:  mimeType,   // ✅ base type only, no codec suffix
        upsert:       false,
        cacheControl: '31536000', // 1 year cache — audio never changes
      })

    if (uploadError) {
      console.error('Supabase upload error:', JSON.stringify(uploadError))
      return NextResponse.json(
        {
          error: `Upload failed: ${uploadError.message || 'Unknown storage error'}. ` +
                 'Please check your Supabase storage settings and try again.',
        },
        { status: 500 }
      )
    }

    // 9. Get public URL
    const { data: urlData } = adminClient.storage
      .from('recordings')
      .getPublicUrl(data.path)

    if (!urlData?.publicUrl) {
      return NextResponse.json(
        { error: 'Recording uploaded but could not get public URL.' },
        { status: 500 }
      )
    }

    console.log('Audio uploaded successfully:', urlData.publicUrl)
    return NextResponse.json({ url: urlData.publicUrl }, { status: 201 })

  } catch (err) {
    console.error('POST /api/upload unhandled error:', err)
    return NextResponse.json(
      { error: `Server error: ${err.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
}
