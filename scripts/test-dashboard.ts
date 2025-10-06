#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

async function testDashboard() {
  try {
    // Create Supabase client for server-side operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    console.log('🔍 Testing dashboard data...')

    // Get all items
    const { data: items, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Error fetching items: ${error.message}`)
    }

    if (!items || items.length === 0) {
      console.log('❌ No items found in database')
      return
    }

    console.log(`✅ Found ${items.length} items:`)

    items.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.name}`)
      console.log(`     - ID: ${item.id}`)
      console.log(`     - Location: ${item.lagerplats}`)
      console.log(`     - Photo URL: ${item.photo_url || 'null'}`)
      console.log(`     - Category: ${item.category || 'null'}`)
      console.log(`     - Condition: ${item.condition || 'null'}`)
      console.log(`     - Value: ${item.value || 'null'}`)
      console.log('')
    })

    // Check for any items with empty photo_url strings
    const emptyPhotoItems = items.filter(item => item.photo_url === '')
    if (emptyPhotoItems.length > 0) {
      console.log(`⚠️  Found ${emptyPhotoItems.length} items with empty photo_url strings:`)
      emptyPhotoItems.forEach(item => {
        console.log(`     - ${item.name} (ID: ${item.id})`)
      })
    } else {
      console.log('✅ All items have proper photo_url handling (null or valid URL)')
    }

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : 'Unknown error')
    process.exit(1)
  }
}

if (require.main === module) {
  testDashboard()
}

export { testDashboard }
