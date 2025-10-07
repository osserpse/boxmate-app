-- Create ads table for managing advertisements/listing
CREATE TABLE ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  lagerplats TEXT NOT NULL,
  description TEXT,
  value NUMERIC,
  photo_url TEXT,
  photos JSONB, -- Array of photo URLs
  category TEXT,
  subcategory TEXT,
  condition TEXT,
  status TEXT DEFAULT 'draft', -- draft, published, sold, archived
  item_id UUID REFERENCES items(id) ON DELETE CASCADE, -- Link to original item if created from existing item
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON ads
  FOR SELECT USING (true);

-- Create policy to allow public insert access
CREATE POLICY "Allow public insert access" ON ads
  FOR INSERT WITH CHECK (true);

-- Create policy to allow public update access
CREATE POLICY "Allow public update access" ON ads
  FOR UPDATE USING (true);

-- Create policy to allow public delete access
CREATE POLICY "Allow public delete access" ON ads
  FOR DELETE USING (true);

-- Create index for better performance
CREATE INDEX idx_ads_status ON ads(status);
CREATE INDEX idx_ads_category ON ads(category);
CREATE INDEX idx_ads_created_at ON ads(created_at);
CREATE INDEX idx_ads_item_id ON ads(item_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_ads_updated_at
    BEFORE UPDATE ON ads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
