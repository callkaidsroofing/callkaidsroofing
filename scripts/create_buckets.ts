import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://vlnkzpyeppfdmresiaoh.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY. Abort.')
  process.exit(2)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { 
  auth: { persistSession: false } 
})

async function ensureBucket(bucketId: string, isPublic = false) {
  try {
    const { data: buckets, error: listErr } = await supabase.storage.listBuckets()
    if (listErr) throw listErr
    
    const exists = buckets.some(b => b.id === bucketId)
    if (exists) {
      console.log(`✅ Bucket exists: ${bucketId}`)
      return
    }

    const { error: createErr } = await supabase.storage.createBucket(bucketId, { 
      public: isPublic,
      fileSizeLimit: 52428800, // 50MB
      allowedMimeTypes: ['application/json', 'text/markdown', 'image/jpeg', 'image/png', 'application/pdf']
    })
    if (createErr) throw createErr
    console.log(`✅ Bucket created: ${bucketId}`)
  } catch (err: any) {
    console.error(`❌ Error ensuring bucket ${bucketId}:`, err.message)
    throw err
  }
}

async function main() {
  console.log('🪣 Ensuring CKR-GEM storage buckets...')
  await ensureBucket('ckr-assets', false)  // Private: AI-generated content
  await ensureBucket('ckr-agents', false)  // Private: Agent configs
  console.log('✅ All buckets provisioned.')
}

main().catch(e => {
  console.error('❌ Script failed:', e.message)
  process.exit(1)
})
