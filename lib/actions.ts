'use server'

import { createClient } from './supabase'
import { revalidatePath } from 'next/cache'

export interface AddItemData {
  name: string
  location: string
  description?: string
  value?: number
  photo?: File
}

export async function addItem(data: AddItemData) {
  try {
    const supabase = createClient()

    // Handle photo upload first if provided
    let photo_url: string | undefined = undefined

    if (data.photo) {
      // Generate unique filename
      const fileExt = data.photo.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      // Convert File to ArrayBuffer
      const arrayBuffer = await data.photo.arrayBuffer()
      const { error: uploadError } = await supabase.storage
        .from('item-photos')
        .upload(fileName, arrayBuffer, {
          contentType: data.photo.type,
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw new Error(`Foto upload misslyckades: ${uploadError.message}`)
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('item-photos')
        .getPublicUrl(fileName)

      photo_url = publicUrl
    }

    // Insert item into database
    const { data: newItem, error } = await supabase
      .from('items')
      .insert({
        name: data.name,
        location: data.location,
        description: data.description,
        value: data.value,
        photo_url: photo_url
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Misslyckades att spara produkt: ${error.message}`)
    }

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

