# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key

## 2. Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

## 3. Database Setup

Run the SQL commands from `schema.sql` in your Supabase SQL editor:

```sql
-- Create items table
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  value NUMERIC,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON items
  FOR SELECT USING (true);

-- Create policy to allow public insert access
CREATE POLICY "Allow public insert access" ON items
  FOR INSERT WITH CHECK (true);

-- Create policy to allow public delete access
CREATE POLICY "Allow public delete access" ON items
  FOR DELETE USING (true);

-- Create policy to allow public update access (for future use)
CREATE POLICY "Allow public update access" ON items
  FOR UPDATE USING (true);

-- Create storage bucket for item photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('item-photos', 'item-photos', true);

-- Create policy to allow public read access to photos
CREATE POLICY "Allow public read access to photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'item-photos');

-- Create policy to allow public upload access to photos
CREATE POLICY "Allow public upload access to photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'item-photos');

-- Create policy to allow public delete access to photos
CREATE POLICY "Allow public delete access to photos" ON storage.objects
  FOR DELETE USING (bucket_id = 'item-photos');
```

## 4. Storage Configuration

Make sure the `item-photos` bucket is created and configured for public access.

## 5. Test the Setup

1. Run `yarn dev`
2. Go to `/dashboard`
3. Click "Lägg till sak"
4. Fill out the form and upload a photo
5. Verify the item appears in the dashboard

## Features Implemented

- ✅ Supabase client setup with cookies
- ✅ Items table with proper schema
- ✅ Photo upload to Supabase Storage
- ✅ Add item functionality with server actions
- ✅ Dashboard fetches from database
- ✅ Item detail page with delete functionality
- ✅ Loading states and error handling
- ✅ Swedish translations throughout
- ✅ Optimistic UI updates

