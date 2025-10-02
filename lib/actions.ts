'use server'

import { createClient } from './supabase'
import { revalidatePath } from 'next/cache'

export interface AddItemData {
  name: string
  location: string
  description?: string
  value?: number
  photos?: File[]
}

// Separate interface for file data that can be passed to server actions
export interface FileData {
  name: string
  type: string
  size: number
  data: string // base64 encoded
}

export interface AddItemRequest {
  name: string
  location: string
  description?: string
  value?: number
  photoUrls?: string[]
}

export async function addItem(data: AddItemRequest) {
  try {
    console.log('addItem called with:', data);
    console.log('Creating Supabase client...');
    const supabase = createClient()
    console.log('Supabase client created successfully');

    // Use pre-uploaded photo URLs (uploaded from client side)
    let photo_urls: string[] = data.photoUrls || []

    // For now, we'll store the first photo URL in the existing photo_url field
    // In the future, we could extend the database to support multiple photos
    const primary_photo_url = photo_urls.length > 0 ? photo_urls[0] : undefined

    console.log('Inserting item into database:', {
      name: data.name,
      location: data.location,
      description: data.description,
      value: data.value,
      photo_url: primary_photo_url
    });

    // Insert item into database
    const { data: newItem, error } = await supabase
      .from('items')
      .insert({
        name: data.name,
        location: data.location,
        description: data.description,
        value: data.value,
        photo_url: primary_photo_url
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error);
      throw new Error(`Misslyckades att spara produkt: ${error.message}`)
    }

    console.log('Successfully saved item:', newItem);

    // Revalidate dashboard to show new item
    revalidatePath('/dashboard')

    return {
      success: true,
      item: newItem,
      message: 'Produkt sparad framgångsrikt!'
    }

  } catch (error) {
    console.error('addItem error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Okänt fel uppstod'
    }
  }
}

export async function deleteItem(itemId: string) {
  try {
    const supabase = createClient()

    // First get the item to find the photo URL
    const { data: item, error: fetchError } = await supabase
      .from('items')
      .select('photo_url')
      .eq('id', itemId)
      .single()

    if (fetchError) {
      throw new Error(`Hittade inte produkt: ${fetchError.message}`)
    }

    // Delete photo from storage if it exists
    if (item?.photo_url) {
      const fileName = item.photo_url.split('/').pop()
      if (fileName) {
        const { error: photoError } = await supabase.storage
          .from('item-photos')
          .remove([fileName])

        if (photoError) {
          console.warn('Misslyckades att ta bort foto:', photoError.message)
          // Don't throw here, just log the warning
        }
      }
    }

    // Delete item from database
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', itemId)

    if (error) {
      throw new Error(`Misslyckades att ta bort produkt: ${error.message}`)
    }

    // Revalidate both dashboard and item page
    revalidatePath('/dashboard')
    revalidatePath(`/item/${itemId}`)

    return {
      success: true,
      message: 'Produkt borttagen framgångsrikt!'
    }

  } catch (error) {
    console.error('deleteItem error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Okänt fel uppstod'
    }
  }
}

