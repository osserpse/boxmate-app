#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import csv from 'csv-parser'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

interface CSVItem {
  name: string
  lagerplats: string
  lokal?: string
  hyllplats?: string
  description?: string
  value?: string
  photo_url?: string
  photos?: string
  category?: string
  subcategory?: string
  condition?: string
}

interface ImportResult {
  success: boolean
  imported: number
  errors: string[]
  items: any[]
}

async function importItemsFromCSV(csvFilePath: string): Promise<ImportResult> {
  const result: ImportResult = {
    success: false,
    imported: 0,
    errors: [],
    items: []
  }

  try {
    console.log(`Reading CSV file: ${csvFilePath}`)

    // Check if file exists
    if (!fs.existsSync(csvFilePath)) {
      throw new Error(`CSV file not found: ${csvFilePath}`)
    }

    // Create Supabase client for server-side operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const items: CSVItem[] = []

    // Read and parse CSV file
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row: CSVItem) => {
          items.push(row)
        })
        .on('end', () => {
          console.log(`Parsed ${items.length} items from CSV`)
          resolve()
        })
        .on('error', (error) => {
          reject(error)
        })
    })

    if (items.length === 0) {
      throw new Error('No items found in CSV file')
    }

    // Validate and import each item
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const rowNumber = i + 2 // +2 because CSV is 1-indexed and has header

      try {
        // Validate required fields
        if (!item.name || !item.lagerplats) {
          result.errors.push(`Row ${rowNumber}: Missing required fields (name and lagerplats are required)`)
          continue
        }

        // Validate category if provided
        if (item.category && !['business', 'electronics', 'other'].includes(item.category)) {
          result.errors.push(`Row ${rowNumber}: Invalid category '${item.category}'. Must be: business, electronics, or other`)
          continue
        }

        // Validate condition if provided
        if (item.condition && !['new', 'excellent', 'good', 'fair', 'broken'].includes(item.condition)) {
          result.errors.push(`Row ${rowNumber}: Invalid condition '${item.condition}'. Must be: new, excellent, good, fair, or broken`)
          continue
        }

        // Validate subcategory if provided
        if (item.subcategory && item.category === 'electronics') {
          const validSubcategories = ['computers-gaming', 'audio-video', 'phones-accessories']
          if (!validSubcategories.includes(item.subcategory)) {
            result.errors.push(`Row ${rowNumber}: Invalid subcategory '${item.subcategory}' for electronics. Must be: ${validSubcategories.join(', ')}`)
            continue
          }
        }

        // Parse value as number
        let value: number | undefined
        if (item.value) {
          const parsedValue = parseFloat(item.value)
          if (isNaN(parsedValue)) {
            result.errors.push(`Row ${rowNumber}: Invalid value '${item.value}'. Must be a number`)
            continue
          }
          value = parsedValue
        }

        // Parse photos array if provided
        let photos: string[] | undefined
        if (item.photos) {
          try {
            photos = item.photos.split(',').map(url => url.trim()).filter(url => url.length > 0)
          } catch (error) {
            result.errors.push(`Row ${rowNumber}: Invalid photos format. Use comma-separated URLs`)
            continue
          }
        }

        // Prepare data for insertion
        const insertData = {
          name: item.name.trim(),
          location: item.lagerplats.trim(), // Keep old location field for compatibility
          lagerplats: item.lagerplats.trim(),
          lokal: item.lokal?.trim() || null,
          hyllplats: item.hyllplats?.trim() || null,
          description: item.description?.trim() || null,
          value: value || null,
          photo_url: item.photo_url?.trim() || null,
          photos: photos ? JSON.stringify(photos) : null,
          category: item.category?.trim() || null,
          subcategory: item.subcategory?.trim() || null,
          condition: item.condition?.trim() || null
        }

        // Insert into database
        const { data: newItem, error } = await supabase
          .from('items')
          .insert(insertData)
          .select()
          .single()

        if (error) {
          result.errors.push(`Row ${rowNumber}: Database error - ${error.message}`)
          continue
        }

        result.items.push(newItem)
        result.imported++
        console.log(`✓ Imported: ${item.name}`)

      } catch (error) {
        result.errors.push(`Row ${rowNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    result.success = result.imported > 0
    return result

  } catch (error) {
    result.errors.push(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return result
  }
}

async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.log('Usage: npm run import-csv <path-to-csv-file>')
    console.log('Example: npm run import-csv ./test-items.csv')
    process.exit(1)
  }

  const csvFilePath = path.resolve(args[0])
  console.log('🚀 Starting CSV import...')
  console.log(`📁 File: ${csvFilePath}`)

  const result = await importItemsFromCSV(csvFilePath)

  console.log('\n📊 Import Results:')
  console.log(`✅ Successfully imported: ${result.imported} items`)
  console.log(`❌ Errors: ${result.errors.length}`)

  if (result.errors.length > 0) {
    console.log('\n❌ Errors encountered:')
    result.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`)
    })
  }

  if (result.imported > 0) {
    console.log('\n✅ Imported items:')
    result.items.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} (${item.lagerplats})`)
    })
  }

  process.exit(result.success ? 0 : 1)
}

if (require.main === module) {
  main().catch(console.error)
}

export { importItemsFromCSV }
