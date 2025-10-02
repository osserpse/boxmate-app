-- Migration: Add photos column to items table to support multiple images
ALTER TABLE items ADD COLUMN photos JSONB;
