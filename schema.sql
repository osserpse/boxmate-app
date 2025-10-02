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

