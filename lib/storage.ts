'use server'

import { createClient } from './supabase'

export async function uploadFiles(files: File[]): Promise<{ success: boolean; urls?: string[]; error?: string }> {
  try {
    const supabase = createClient()
    const urls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error(`${file.name} är inte en giltig bildfil`)
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error(`${file.name} är för stor. Max storlek är 5MB.`)
      }

      try {
        // Generate unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `item-${Date.now()}-${Math.random().toString(36).substring(7)}-${i}.${fileExt}`

        // Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer()

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('item-photos')
          .upload(fileName, arrayBuffer, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          throw new Error(`Misslyckades att ladda upp ${file.name}: ${uploadError.message}`)
        }

        // Get public URL
        const { error: urlError } = await supabase.storage
          .from('item-photos')
          .getPublicUrl(fileName)

        if (urlError || !supabase.storage.from('item-photos').getPublicUrl(fileName).data.publicUrl) {
          throw new Error(`Misslyckades att få URL för ${file.name}`)
        }

        const publicUrl = supabase.storage.from('item-photos').getPublicUrl(fileName).data.publicUrl
        urls.push(publicUrl)

      } catch (error) {
        // Clean up uploaded files if one fails
        for (const url of urls) {
          try {
            const fileName = url.split('/').pop()
            if (fileName) {
              await supabase.storage.from('item-photos').remove([fileName])
            }
          } catch (cleanupError) {
            console.warn('Misslyckades att rensa fil:', cleanupError)
          }
        }

        throw new Error(`Fel vid uppladdning av ${file.name}: ${error instanceof Error ? error.message : 'Okänt fel'}`)
      }
    }

    return { success: true, urls }

  } catch (error) {
    console.error('uploadFiles error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Okänt fel uppstod vid uppladdning'
    }
  }
}

export async function deleteFiles(urls: string[]): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    for (const url of urls) {
      try {
        const fileName = url.split('/').pop()
        if (fileName) {
          const { error } = await supabase.storage
            .from('item-photos')
            .remove([fileName])

          if (error) {
            console.warn(`Misslyckades att ta bort fil ${fileName}:`, error.message)
            // Continue with other files even if one fails
          }
        }
      } catch (error) {
        console.warn('Fel vid borttagning av fil:', error)
      }
    }

    return { success: true }
