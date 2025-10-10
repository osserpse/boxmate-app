'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DialogClose } from '@/components/ui/dialog';
import { Plus, DollarSign } from 'lucide-react';
import { addItem, AddItemRequest } from '@/lib/actions';
import { FileUpload } from '@/components/file-upload';
import { ConditionDropdown } from '@/components/ui/condition-dropdown';

interface AddItemFormProps {
  onItemAdded: (item: any) => void;
}

export function AddItemForm({ onItemAdded }: AddItemFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    value: '',
    lagerplats: '',
    lokal: '',
    hyllplats: '',
    category: 'electronics',
    subcategory: '',
    condition: 'good'
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      // Reset subcategory when category changes
      if (field === 'category') {
        newData.subcategory = '';
      }
      return newData;
    });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim() || !formData.lagerplats.trim()) {
      setError('Namn och lagerplats måste fyllas i');
      return;
    }

    if (formData.category === 'electronics' && !formData.subcategory) {
      setError('Underkategori måste väljas för elektronik');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Upload files first if any
      let uploadedPhotoUrls: string[] = [];

      if (files.length > 0) {

        // Create Supabase client for file upload
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          try {

            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${i}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
              .from('item-photos')
              .upload(fileName, file, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: false
              });

            if (uploadError) {
              throw new Error(`Upload failed: ${uploadError.message}`);
            }

            const { data: { publicUrl } } = supabase.storage
              .from('item-photos')
              .getPublicUrl(fileName);

            uploadedPhotoUrls.push(publicUrl);

          } catch (fileError) {
            console.error(`Error uploading ${file.name}:`, fileError);
            throw new Error(`Fel vid uppladdning av ${file.name}: ${fileError}`);
          }
        }
      }

      const addData: AddItemRequest = {
        name: formData.name,
        lagerplats: formData.lagerplats,
        lokal: formData.lokal,
        hyllplats: formData.hyllplats,
        description: formData.description || undefined,
        value: formData.value ? parseFloat(formData.value) : undefined,
        category: formData.category,
        subcategory: formData.subcategory,
        condition: formData.condition,
        photoUrls: uploadedPhotoUrls.length > 0 ? uploadedPhotoUrls : undefined
      };


      const result = await addItem(addData);

      if (result.success && result.item) {
        // Transform Supabase item to match ItemCard expected format
        const transformedItem = {
          ...result.item,
          image: result.item.photo_url || null,
          photo: result.item.photo_url || null,
          createdAt: 'Nu'
        };

        onItemAdded(transformedItem);

        // Reset form
        setFormData({
          name: '',
          description: '',
          value: '',
          lagerplats: '',
          lokal: '',
          hyllplats: '',
          category: 'electronics',
          subcategory: '',
          condition: 'good'
        });
        setFiles([]);
      } else {
        setError(result.error || 'Något gick fel');
      }

    } catch (err) {
      setError('Något gick fel när produkten sparades');
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { value: 'business', label: 'Affärsverksamhet (företag)' },
    { value: 'electronics', label: 'Elektronik' },
    { value: 'other', label: 'Övrigt' }
  ];

  const electronicsSubcategories = [
    { value: 'computers-gaming', label: 'Datorer och TV-spel' },
    { value: 'audio-video', label: 'Ljud och Bild' },
    { value: 'phones-accessories', label: 'Telefoner & tillbehör' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Photo Upload */}
      <FileUpload
        onFilesChange={setFiles}
      />

      {/* Basic Information */}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Namn *
        </label>
        <Input
          id="name"
          placeholder="Namn på produkten"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="h-11"
        />
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-2">
          Kategori *
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => handleInputChange('category', e.target.value)}
          className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategory - only show for electronics */}
      {formData.category === 'electronics' && (
        <div>
          <label htmlFor="subcategory" className="block text-sm font-medium mb-2">
            Underkategori *
          </label>
          <select
            id="subcategory"
            value={formData.subcategory}
            onChange={(e) => handleInputChange('subcategory', e.target.value)}
            className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Välj underkategori</option>
            {electronicsSubcategories.map((subcat) => (
              <option key={subcat.value} value={subcat.value}>
                {subcat.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Condition */}
      <div>
        <label htmlFor="condition" className="block text-sm font-medium mb-2">
          Skick *
        </label>
        <ConditionDropdown
          value={formData.condition}
          onChange={(value) => handleInputChange('condition', value)}
          placeholder="Välj från listan"
        />
      </div>

      {/* Location */}
      <div>
        <label htmlFor="lagerplats" className="block text-sm font-medium mb-2">
          Lagerplats *
        </label>
        <Input
          id="lagerplats"
          placeholder="Stockholm, Sverige"
          value={formData.lagerplats}
          onChange={(e) => handleInputChange('lagerplats', e.target.value)}
          className="h-11"
        />
      </div>

      {/* Lokal */}
      <div>
        <label htmlFor="lokal" className="block text-sm font-medium mb-2">
          Lokal
        </label>
        <Input
          id="lokal"
          placeholder="Lokal A, Lokal B, etc."
          value={formData.lokal}
          onChange={(e) => handleInputChange('lokal', e.target.value)}
          className="h-11"
        />
      </div>

      {/* Hyllplats */}
      <div>
        <label htmlFor="hyllplats" className="block text-sm font-medium mb-2">
          Hyllplats
        </label>
        <Input
          id="hyllplats"
          placeholder="Hyll A1, Hyll B2, etc."
          value={formData.hyllplats}
          onChange={(e) => handleInputChange('hyllplats', e.target.value)}
          className="h-11"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          Beskrivning
        </label>
        <Textarea
          id="description"
          placeholder="Beskriv produkten..."
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          className="resize-none"
        />
      </div>

      {/* Value */}
      <div>
        <label htmlFor="value" className="block text-sm font-medium mb-2">
          Värde (kr)
        </label>
        <div className="relative">
          <Input
            id="value"
            type="number"
            placeholder="0"
            value={formData.value}
            onChange={(e) => handleInputChange('value', e.target.value)}
            className="h-11 pl-4"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
          <p className="text-primary text-sm">Sparar produkt...</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <DialogClose asChild>
          <Button type="button" variant="outline" className="flex-1">
            Avbryt
          </Button>
        </DialogClose>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-primary hover:bg-primary/90"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Sparar...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Lägg till
            </>
          )}
        </Button>
      </div>
    </form>
  );
}