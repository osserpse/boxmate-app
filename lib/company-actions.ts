'use server'

import { createClient } from './supabase'
import { revalidatePath } from 'next/cache'

export interface CompanySettings {
  id?: string
  user_id?: string

  // Company Information
  company_description?: string

  // Company Address
  company_name?: string
  org_number?: string
  street_address?: string
  postal_code?: string
  city?: string

  // Contact Information
  info_phone?: string
  info_email?: string
  sales_phone?: string
  sales_email?: string
  support_phone?: string
  support_email?: string

  // Billing Address
  billing_company_name?: string
  billing_org_number?: string
  billing_email?: string

  created_at?: string
  updated_at?: string
}

export interface CompanySettingsUpdate {
  // Company Information
  company_description?: string

  // Company Address
  company_name?: string
  org_number?: string
  street_address?: string
  postal_code?: string
  city?: string

  // Contact Information
  info_phone?: string
  info_email?: string
  sales_phone?: string
  sales_email?: string
  support_phone?: string
  support_email?: string

  // Billing Address
  billing_company_name?: string
  billing_org_number?: string
  billing_email?: string
}

// Get company settings for the current user
export async function getCompanySettings(): Promise<{ success: boolean; data?: CompanySettings; error?: string }> {
  try {
    const supabase = createClient()

    // For now, we'll use a mock user ID since authentication isn't implemented yet
    // TODO: Replace with actual authentication when login system is implemented
    const mockUserId = '00000000-0000-0000-0000-000000000000'

    // Fetch company settings
    const { data: settings, error } = await supabase
      .from('company_settings')
      .select('*')
      .eq('user_id', mockUserId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error fetching company settings:', error)
      return {
        success: false,
        error: `Failed to fetch company settings: ${error.message}`
      }
    }

    return {
      success: true,
      data: settings || null
    }

  } catch (error) {
    console.error('getCompanySettings error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

// Create or update company settings
export async function saveCompanySettings(data: CompanySettingsUpdate): Promise<{ success: boolean; data?: CompanySettings; error?: string }> {
  try {
    const supabase = createClient()

    // For now, we'll use a mock user ID since authentication isn't implemented yet
    // TODO: Replace with actual authentication when login system is implemented
    const mockUserId = '00000000-0000-0000-0000-000000000000'

    // Check if settings already exist
    const { data: existingSettings } = await supabase
      .from('company_settings')
      .select('id')
      .eq('user_id', mockUserId)
      .single()

    let result

    if (existingSettings) {
      // Update existing settings
      const { data: updatedSettings, error: updateError } = await supabase
        .from('company_settings')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', mockUserId)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating company settings:', updateError)
        return {
          success: false,
          error: `Failed to update company settings: ${updateError.message}`
        }
      }

      result = updatedSettings
    } else {
      // Create new settings
      const { data: newSettings, error: insertError } = await supabase
        .from('company_settings')
        .insert({
          user_id: mockUserId,
          ...data
        })
        .select()
        .single()

      if (insertError) {
        console.error('Error creating company settings:', insertError)
        return {
          success: false,
          error: `Failed to create company settings: ${insertError.message}`
        }
      }

      result = newSettings
    }

    // Revalidate the settings page
    revalidatePath('/settings/company/address')

    return {
      success: true,
      data: result
    }

  } catch (error) {
    console.error('saveCompanySettings error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

// Update specific section of company settings
export async function updateCompanySection(section: string, data: Partial<CompanySettingsUpdate>): Promise<{ success: boolean; data?: CompanySettings; error?: string }> {
  try {
    const supabase = createClient()

    // For now, we'll use a mock user ID since authentication isn't implemented yet
    // TODO: Replace with actual authentication when login system is implemented
    const mockUserId = '00000000-0000-0000-0000-000000000000'

    // Check if settings exist
    const { data: existingSettings } = await supabase
      .from('company_settings')
      .select('id')
      .eq('user_id', mockUserId)
      .single()

    let result

    if (existingSettings) {
      // Update existing settings
      const { data: updatedSettings, error: updateError } = await supabase
        .from('company_settings')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', mockUserId)
        .select()
        .single()

      if (updateError) {
        console.error(`Error updating company ${section}:`, updateError)
        return {
          success: false,
          error: `Failed to update ${section}: ${updateError.message}`
        }
      }

      result = updatedSettings
    } else {
      // Create new settings with only the section data
      const { data: newSettings, error: insertError } = await supabase
        .from('company_settings')
        .insert({
          user_id: mockUserId,
          ...data
        })
        .select()
        .single()

      if (insertError) {
        console.error(`Error creating company ${section}:`, insertError)
        return {
          success: false,
          error: `Failed to create ${section}: ${insertError.message}`
        }
      }

      result = newSettings
    }

    // Revalidate the settings page
    revalidatePath('/settings/company/address')

    return {
      success: true,
      data: result
    }

  } catch (error) {
    console.error(`updateCompanySection error (${section}):`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

// Delete company settings
export async function deleteCompanySettings(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    // For now, we'll use a mock user ID since authentication isn't implemented yet
    // TODO: Replace with actual authentication when login system is implemented
    const mockUserId = '00000000-0000-0000-0000-000000000000'

    // Delete company settings
    const { error } = await supabase
      .from('company_settings')
      .delete()
      .eq('user_id', mockUserId)

    if (error) {
      console.error('Error deleting company settings:', error)
      return {
        success: false,
        error: `Failed to delete company settings: ${error.message}`
      }
    }

    // Revalidate the settings page
    revalidatePath('/settings/company/address')

    return {
      success: true
    }

  } catch (error) {
    console.error('deleteCompanySettings error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}
