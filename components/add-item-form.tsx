'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DialogClose } from '@/components/ui/dialog';
import { Plus, DollarSign } from 'lucide-react';
import { addItem, AddItemData } from '@/lib/actions';
import { FileUpload } from '@/components/file-upload';

interface AddItemFormProps {
  onItemAdded: (item: any) => void;
}

export function AddItemForm({ onItemAdded }: AddItemFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    value: '',
    location: '',
    category: 'electronics',
    subcategory: ''
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
    if (!formData.name.trim() || !formData.location.trim()) {
      setError('Namn och plats måste fyllas i');
      return;
    }

    if (formData.category === 'electronics' && !formData.subcategory) {
      setError('Underkategori måste väljas för elektronik');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const addData: AddItemData = {
        name: formData.name,
        location: formData.location,
        description: formData.description || undefined,
        value: formData.value ? parseFloat(formData.value) : undefined,
        photos: files.length > 0 ? files : undefined
      };

      const result = await addItem(addData);

      if (result.success && result.item) {
        // Transform Supabase item to match ItemCard expected format
        const transformedItem = {
          ...result.item,
          image: result.item.photo_url || '/placeholder-image.jpg',
          photo: result.item.photo_url || '/placeholder-image.jpg',
          createdAt: 'Nu'
        };

        onItemAdded(transformedItem);

        // Reset form
        setFormData({
          name: '',
          description: '',
          value: '',
          location: '',
          category: 'electronics',
          subcategory: ''
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

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium mb-2">
          Plats *
        </label>
        <Input
          id="location"
          placeholder="Stockholm, Sverige"
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
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
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            id="value"
            type="number"
            placeholder="0"
            value={formData.value}
            onChange={(e) => handleInputChange('value', e.target.value)}
            className="h-11 pl-10"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-lime-50 border border-lime-200 rounded-lg p-3">
          <p className="text-lime-800 text-sm">Sparar produkt...</p>
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
          className="flex-1 bg-lime-500 hover:bg-lime-600"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Sparar...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Lägg till sak
            </>
          )}
        </Button>
      </div>
    </form>
  );
}