#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

async function fixEmptyPhotos() {
  try {
    // Create Supabase client for server-side operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    console.log('🔍 Finding items with empty photo_url...')

    // Find items with empty photo_url
    const { data: items, error: fetchError } = await supabase
      .from('items')
      .select('id, name, photo_url')
      .or('photo_url.eq.,photo_url.is.null')

    if (fetchError) {
      throw new Error(`Error fetching items: ${fetchError.message}`)
    }

    if (!items || items.length === 0) {
      console.log('✅ No items with empty photo_url found')
      return
    }

    console.log(`📋 Found ${items.length} items with empty photo_url:`)
    items.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.name} (ID: ${item.id})`)
    })

    // Update items to set photo_url to null
    const { error: updateError } = await supabase
      .from('items')
      .update({ photo_url: null })
      .or('photo_url.eq.,photo_url.is.null')

    if (updateError) {
      throw new Error(`Error updating items: ${updateError.message}`)
    }

    console.log(`✅ Successfully updated ${items.length} items to have null photo_url`)

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : 'Unknown error')
    process.exit(1)
  }
}

if (require.main === module) {
  fixEmptyPhotos()
}

export { fixEmptyPhotos }
