'use server'

import { createClient } from './supabase'
import { revalidatePath } from 'next/cache'

export interface AdData {
  name: string
  lagerplats: string
  description?: string
  value?: number
  photos?: File[]
  category?: string
  subcategory?: string
  condition?: string
}

export interface AdRequest {
  name: string
  lagerplats: string
  description?: string
  value?: number
  photoUrls?: string[]
  category?: string
  subcategory?: string
  condition?: string
  itemId?: string // Optional: link to existing item
}

export interface Ad {
  id: string
  name: string
  lagerplats: string
  description?: string
  value?: number
  photo_url?: string
  photos?: string[] // Array of photo URLs
  category?: string
  subcategory?: string
  condition?: string
  status: string
  item_id?: string
  created_at: string
  updated_at: string
  published_at?: string
}

export async function createAd(data: AdRequest) {
  try {
    console.log('createAd called with:', data);
    console.log('Creating Supabase client...');
    const supabase = createClient()
    console.log('Supabase client created successfully');

    // Use pre-uploaded photo URLs (uploaded from client side)
    const photo_urls: string[] = data.photoUrls || []

    // Store all photo URLs as JSON array
    const photos_json = photo_urls.length > 0 ? JSON.stringify(photo_urls) : null
    const primary_photo_url = photo_urls.length > 0 ? photo_urls[0] : undefined

    console.log('Inserting ad into database:', {
      name: data.name,
      lagerplats: data.lagerplats,
      description: data.description,
      value: data.value,
      category: data.category,
      subcategory: data.subcategory,
      condition: data.condition,
      photo_url: primary_photo_url,
      photos: photos_json,
      item_id: data.itemId,
      status: 'draft'
    });

    // Insert ad into database
    const { data: newAd, error } = await supabase
      .from('ads')
      .insert({
        name: data.name,
        lagerplats: data.lagerplats,
        description: data.description,
        value: data.value,
        category: data.category,
        subcategory: data.category === 'electronics' ? data.subcategory : null,
        condition: data.condition,
        photo_url: primary_photo_url,
        photos: photos_json,
        item_id: data.itemId,
        status: 'draft'
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error);
      throw new Error(`Misslyckades att spara annons: ${error.message}`)
    }

    console.log('Successfully saved ad:', newAd);

    // Revalidate dashboard to show new ad
    revalidatePath('/dashboard')

    return {
      success: true,
      ad: newAd,
      message: 'Annons sparad framgångsrikt!'
    }

  } catch (error) {
    console.error('createAd error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Okänt fel uppstod'
    }
  }
}

export async function updateAd(adId: string, data: AdRequest) {
  try {
    console.log('updateAd called with:', { adId, data });
    const supabase = createClient()

    // Handle photo URLs - store all photo URLs as JSON array
    const photo_urls: string[] = data.photoUrls || []
    const photos_json = photo_urls.length > 0 ? JSON.stringify(photo_urls) : null
    const primary_photo_url = photo_urls.length > 0 ? photo_urls[0] : undefined

    console.log('Updating ad in database:', { adId, data });

    // Update ad in database
    const { data: updatedAd, error } = await supabase
      .from('ads')
      .update({
        name: data.name,
        lagerplats: data.lagerplats,
        description: data.description,
        value: data.value,
        category: data.category,
        subcategory: data.category === 'electronics' ? data.subcategory : null,
        condition: data.condition,
        photo_url: primary_photo_url,
        photos: photos_json
      })
      .eq('id', adId)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error);
      throw new Error(`Misslyckades att uppdatera annons: ${error.message}`)
    }

    console.log('Successfully updated ad:', updatedAd);

    // Revalidate dashboard and ad page to reflect changes
    revalidatePath('/dashboard')
    revalidatePath(`/ad/${adId}`)

    return {
      success: true,
      ad: updatedAd,
      message: 'Annons uppdaterad framgångsrikt!'
    }

  } catch (error) {
    console.error('updateAd error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Okänt fel uppstod'
    }
  }
}

export async function publishAd(adId: string) {
  try {
    console.log('publishAd called with:', adId);
    const supabase = createClient()

    // Update ad status to published and set published_at timestamp
    const { data: publishedAd, error } = await supabase
      .from('ads')
      .update({
        status: 'published',
        published_at: new Date().toISOString()
      })
      .eq('id', adId)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error);
      throw new Error(`Misslyckades att publicera annons: ${error.message}`)
    }

    console.log('Successfully published ad:', publishedAd);

    // Revalidate dashboard and ad page to reflect changes
    revalidatePath('/dashboard')
    revalidatePath(`/ad/${adId}`)

    return {
      success: true,
      ad: publishedAd,
      message: 'Annons publicerad framgångsrikt!'
    }

  } catch (error) {
    console.error('publishAd error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Okänt fel uppstod'
    }
  }
}

export async function deleteAd(adId: string) {
  try {
    console.log('deleteAd called with:', adId);
    const supabase = createClient()

    // First get the ad to find the photo URL
    const { data: ad, error: fetchError } = await supabase
      .from('ads')
      .select('photo_url, photos')
      .eq('id', adId)
      .single()

    if (fetchError) {
      throw new Error(`Hittade inte annons: ${fetchError.message}`)
    }

    // Delete photos from storage if they exist
    if (ad?.photos) {
      try {
        const photoUrls = typeof ad.photos === 'string' ? JSON.parse(ad.photos) : ad.photos;
        if (Array.isArray(photoUrls)) {
          for (const photoUrl of photoUrls) {
            const fileName = photoUrl.split('/').pop()
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
        }
      } catch (parseError) {
        console.warn('Error parsing photos JSON:', parseError)
      }
    }

    // Delete ad from database
    const { error } = await supabase
      .from('ads')
      .delete()
      .eq('id', adId)

    if (error) {
      throw new Error(`Misslyckades att ta bort annons: ${error.message}`)
    }

    // Revalidate dashboard
    revalidatePath('/dashboard')

    return {
      success: true,
      message: 'Annons borttagen framgångsrikt!'
    }

  } catch (error) {
    console.error('deleteAd error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Okänt fel uppstod'
    }
  }
}

export async function getAd(adId: string): Promise<Ad | null> {
  try {
    const supabase = createClient()

    const { data: ad, error } = await supabase
      .from('ads')
      .select('*')
      .eq('id', adId)
      .single()

    if (error) {
      console.error('Error fetching ad:', error)
      return null
    }

    // Parse photos JSON if it exists
    if (ad && ad.photos && typeof ad.photos === 'string') {
      try {
        ad.photos = JSON.parse(ad.photos)
      } catch (error) {
        console.error('Error parsing photos JSON:', error)
        ad.photos = []
      }
    }

    return ad
  } catch (error) {
    console.error('getAd error:', error)
    return null
  }
}

export async function getAds(): Promise<Ad[]> {
  try {
    const supabase = createClient()

    const { data: ads, error } = await supabase
      .from('ads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching ads:', error)
      return []
    }

    // Parse photos JSON for each ad
    const processedAds = ads.map(ad => {
      if (ad.photos && typeof ad.photos === 'string') {
        try {
          ad.photos = JSON.parse(ad.photos)
        } catch (error) {
          console.error('Error parsing photos JSON:', error)
          ad.photos = []
        }
      }
      return ad
    })

    return processedAds
  } catch (error) {
    console.error('getAds error:', error)
    return []
  }
}
