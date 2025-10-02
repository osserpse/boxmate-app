/**
 * Migration script to populate Supabase database with mock data
 * Run with: npx tsx scripts/migrate-mock-data.ts
 */

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { mockItems } from '../data/mock-items'

// Load environment variables from .env.local
config({ path: '.env.local' })

// Supabase configuration from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('Please make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set')
  process.exit(1)
}

// Create Supabase client (using regular client for scripts)
const supabase = createClient(supabaseUrl, supabaseKey)

interface MockItem {
  id: string
  name: string
  location: string
  value: number
  image: string
  photo: string
  createdAt: string
  description?: string
}

async function migrateMockData() {
  console.log('🚀 Starting migration of mock data to Supabase...')

  try {
    // Check if items already exist
    const { data: existingItems, error: checkError } = await supabase
      .from('items')
      .select('id')
      .limit(1)

    if (checkError) {
      console.error('❌ Error checking existing data:', checkError.message)
      process.exit(1)
    }

    if (existingItems && existingItems.length > 0) {
      console.log('⚠️  Items already exist in database')
      const response = await prompt('Do you want to clear existing items and re-populate? (y/N): ')

      if (response.toLowerCase() !== 'y') {
        console.log('Migration cancelled.')
        process.exit(0)
      }

      // Delete existing items
      const { error: deleteError } = await supabase
        .from('items')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all items

      if (deleteError) {
        console.error('❌ Error deleting existing items:', deleteError.message)
        process.exit(1)
      }

      console.log('🗑️  Cleared existing items')
    }

    // Transform mock data to match database schema
    const itemsToInsert = mockItems.map((item: MockItem) => ({
      name: item.name,
      location: item.location,
      description: item.description || null,
      value: item.value || null,
      photo_url: item.image, // Use the image URL from mock data
      // Don't set created_at, let database use default NOW()
    }))

    // Insert items into database
    const { data: insertedItems, error: insertError } = await supabase
      .from('items')
      .insert(itemsToInsert)
      .select()

    if (insertError) {
      console.error('❌ Error inserting items:', insertError.message)
      process.exit(1)
    }

    console.log(`✅ Successfully migrated ${insertedItems?.length || 0} items to Supabase!`)

    // Display summary
    console.log('\n📊 Migration Summary:')
    console.log(`   • Items migrated: ${insertedItems?.length || 0}`)
    console.log(`   • Database table: items`)
    console.log(`   • Storage bucket: item-photos`)

    console.log('\n✨ Migration completed successfully!')
    console.log('You can now visit the dashboard to see the imported items.')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Helper function to prompt user input in Node.js
function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    const readline = require('readline')
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    rl.question(question, (answer: string) => {
      rl.close()
      resolve(answer)
    })
  })
}

// Run migration
migrateMockData()
