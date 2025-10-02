# Migration Scripts

## Migrate Mock Data

This script migrates the mock data from `data/mock-items.ts` to your Supabase database.

### Prerequisites

1. **Supabase setup**: Make sure you have:
   - Supabase project created
   - Environment variables configured (`.env.local`)
   - Database schema applied (`schema.sql`)

2. **Environment variables**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

### Running the Migration

```bash
# Using yarn script
yarn migrate

# Or directly with tsx
npx tsx scripts/migrate-mock-data.ts
```

### What it does

- ✅ Checks if environment variables are configured
- ✅ Verifies database connection
- ✅ Checks for existing items (asks to overwrite if found)
- ✅ Transforms mock data to match database schema
- ✅ Inserts items into the `items` table
- ✅ Provides migration summary

### Sample Data Migrated

- **6 products**: Nintendo Switch, Vintage Camera, Designer Handbag, etc.
- **Complete fields**: name, location, description, value, photo URLs
- **Swedish localization**: All text in Swedish
- **Stockholm locations**: Realistic Swedish cities and neighborhoods

### After Migration

Visit `/dashboard` to see the imported items in your Supabase-powered application!

### Troubleshooting

- **"Missing environment variables"**: Make sure `.env.local` exists with Supabase credentials
- **"Table not found"**: Run the schema.sql in your Supabase SQL editor first
- **"Permission denied"**: Check that RLS policies allow public access (see schema.sql)
