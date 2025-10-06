# CSV Import Guide for Test Items

This guide explains how to import your 11 test items from a CSV file into your BoxMate app.

## Quick Start

1. **Install the CSV parser dependency:**
   ```bash
   yarn add csv-parser
   ```

2. **Use the provided template:**
   - The file `test-items-template.csv` contains 11 sample items with all required fields
   - You can edit this file with your own items or create a new CSV file

3. **Run the import:**
   ```bash
   yarn import-csv ./test-items-template.csv
   ```

## CSV Format

Your CSV file must have these columns (in this exact order):

| Column | Required | Description | Example Values |
|--------|----------|-------------|----------------|
| `name` | ✅ Yes | Item name | "Nintendo Switch Lite" |
| `lagerplats` | ✅ Yes | Main storage location | "Stockholm, Sverige" |
| `lokal` | ❌ No | Room/area within warehouse | "Lager A" |
| `hyllplats` | ❌ No | Specific shelf position | "Hyll 1" |
| `description` | ❌ No | Item description | "Nyskick. Nästan inte använd..." |
| `value` | ❌ No | Item value (number) | 1899 |
| `photo_url` | ❌ No | Primary photo URL | "https://images.unsplash.com/..." |
| `photos` | ❌ No | Multiple photo URLs (comma-separated) | "url1,url2,url3" |
| `category` | ❌ No | Item category | "electronics", "business", "other" |
| `subcategory` | ❌ No | Subcategory (only for electronics) | "computers-gaming", "audio-video", "phones-accessories" |
| `condition` | ❌ No | Item condition | "new", "excellent", "good", "fair", "broken" |

## Field Constraints

### Categories
- `business` - Business-related items
- `electronics` - Electronic devices and accessories
- `other` - Everything else

### Subcategories (only for electronics)
- `computers-gaming` - Computers, laptops, gaming devices
- `audio-video` - Headphones, cameras, speakers
- `phones-accessories` - Phones and phone accessories

### Conditions
- `new` - Brand new, unused
- `excellent` - Like new, minimal wear
- `good` - Good condition, some wear
- `fair` - Fair condition, noticeable wear
- `broken` - Not working or damaged

## Example CSV Content

```csv
name,lagerplats,lokal,hyllplats,description,value,photo_url,photos,category,subcategory,condition
"Nintendo Switch Lite","Stockholm, Sverige","Lager A","Hyll 1","Nyskick. Nästan inte använd, kommer med laddare. Perfekt för bärbar gaming.",1899,"https://images.unsplash.com/photo-1606144042414-1a44d040c4c8?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1606144042414-1a44d040c4c8?w=400&h=300&fit=crop,https://images.unsplash.com/photo-1606144042414-1a44d040c4c8?w=800&h=600&fit=crop",electronics,computers-gaming,excellent
"MacBook Air M2","Göteborg, Sverige","Lager B","Hyll 2","Utmärkt skick. Bra batteritid. Används för skolprojekt.",8999,"https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop",electronics,computers-gaming,good
```

## Import Process

1. **Prepare your CSV file** with the correct format
2. **Run the import command:**
   ```bash
   yarn import-csv path/to/your/file.csv
   ```
3. **Check the results** - the script will show:
   - Number of successfully imported items
   - Any errors encountered
   - List of imported items

## Error Handling

The import script will:
- ✅ Validate all required fields
- ✅ Check category and condition values
- ✅ Validate subcategory for electronics
- ✅ Parse numeric values correctly
- ✅ Handle multiple photo URLs
- ❌ Skip invalid rows and continue with valid ones
- 📊 Provide detailed error messages for each failed row

## Tips

- **Use quotes** around text fields that contain commas
- **Leave empty fields empty** - don't use "null" or "N/A"
- **Use valid URLs** for photos (the script won't validate URL accessibility)
- **Test with a small file first** before importing all your items
- **Backup your database** before running large imports

## Troubleshooting

### Common Issues

1. **"CSV file not found"**
   - Check the file path is correct
   - Use absolute paths if needed: `/full/path/to/file.csv`

2. **"Missing required fields"**
   - Ensure `name` and `lagerplats` columns are not empty
   - Check for typos in column headers

3. **"Invalid category/condition"**
   - Use only the allowed values listed above
   - Check for typos and case sensitivity

4. **"Database error"**
   - Check your Supabase connection
   - Ensure your database schema is up to date

### Getting Help

If you encounter issues:
1. Check the error messages in the import output
2. Verify your CSV format matches the template
3. Test with the provided `test-items-template.csv` first
4. Check your Supabase connection and database schema
