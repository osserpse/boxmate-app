'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DialogClose } from '@/components/ui/dialog';
import { DollarSign, Loader2, AlertTriangle } from 'lucide-react';
import { updateItem, AddItemRequest } from '@/lib/actions';
import { FileUpload } from '@/components/file-upload';
import { ConditionDropdown } from '@/components/ui/condition-dropdown';

interface EditItemFormProps {
  itemId: string;
  itemName: string;
  currentLagerplats: string;
  currentLokal?: string;
  currentHyllplats?: string;
  currentDescription: string;
  currentValue?: number;
  currentPhotos?: string[];
  currentCategory?: string;
  currentSubcategory?: string;
  currentCondition?: string;
  onUpdate: () => void;
}

export function EditItemForm({
  itemId,
  itemName: currentItemName,
  currentLagerplats,
  currentLokal = '',
  currentHyllplats = '',
  currentDescription,
  currentValue,
  currentPhotos = [],
  currentCategory = 'electronics',
  currentSubcategory = '',
  currentCondition = 'good',
  onUpdate
}: EditItemFormProps) {
  const [formData, setFormData] = useState({
    name: currentItemName,
    lagerplats: currentLagerplats,
    lokal: currentLokal,
    hyllplats: currentHyllplats,
    description: currentDescription,
    value: currentValue?.toString() || '',
    category: currentCategory,
    subcategory: currentSubcategory,
    condition: currentCondition
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      // Reset subcategory when category changes
      if (field === 'category') {
        newData.subcategory = '';
      }
      return newData;
    });
    if (error) setError(null);
  };

  const handleFilesChange = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    console.log('Edit form submitted', { itemId, formData, files });

    // Validation
    if (!formData.name.trim()) {
      setError('Namn är obligatoriskt');
      return;
    }
    if (!formData.lagerplats.trim()) {
      setError('Lagerplats är obligatorisk');
      return;
    }
    if (formData.category === 'electronics' && !formData.subcategory) {
      setError('Underkategori måste väljas för elektronik');
      return;
    }

    setIsLoading(true);

    try {
      let uploadedPhotoUrls = [...currentPhotos]; // Keep existing photos

      // Upload new files to Supabase Storage first (client-side)
      if (files.length > 0) {
        console.log(`Uploading ${files.length} new files to Supabase Storage...`);

        const { createClient } = await import('@supabase/supabase-js');
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          try {
            console.log(`Uploading new file ${i + 1}: ${file.name}`);

            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-edit-${i}.${fileExt}`;

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
            console.log(`Uploaded new file ${file.name} -> ${publicUrl}`);

          } catch (fileError) {
            console.error(`Error uploading ${file.name}:`, fileError);
            throw new Error(`Fel vid uppladdning av ${file.name}: ${fileError}`);
          }
        }
      }

      // Update item in database
      const updateData = {
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

      console.log('Calling updateItem with:', updateData);
      const result = await updateItem(itemId, updateData);
      console.log('updateItem result:', result);

      if (result.success) {
        console.log('Success! Calling onUpdate callback');
        onUpdate(); // Trigger parent refresh
        setFiles([]); // Clear files
      } else {
        console.error('updateItem failed:', result.error);
        setError(result.error || 'Något gick fel vid uppdatering');
      }

    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError('Något gick fel vid uppdatering av produkten');
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
    <div className="space-y-6">
      {/* Warning Message */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-yellow-800">
          <AlertTriangle className="w-4 h-4" />
          <span className="font-medium">OBS:</span>
          <span className="text-sm">
            Du lägger till nya foton istället för att ersätta de befintliga. Befintliga foton kommer att behållas.
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Photos Display */}
        {currentPhotos.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Befintliga foton</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {currentPhotos.map((photoUrl, i) => (
                  <div key={i} className="aspect-square bg-stone-100 rounded-lg relative overflow-hidden">
                    <Image
                      src={photoUrl}
                      alt={`Befintligt foto ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Du kan lägga till fler foton nedan
              </p>
            </CardContent>
          </Card>
        )}

        {/* New Photo Upload */}
        <FileUpload onFilesChange={handleFilesChange} />

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Produktinformation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Produkttitel *
              </label>
              <Input
                id="name"
                placeholder="Vad säljer du?"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="h-11"
                required
              />
            </div>

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

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Beskrivning
              </label>
              <Textarea
                id="description"
                rows={4}
                placeholder="Beskriv din produkt..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="resize-none"
              />
            </div>

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

            <div>
              <label htmlFor="lagerplats" className="block text-sm font-medium mb-2">
                Lagerplats *
              </label>
              <Input
                id="lagerplats"
                placeholder="ex. Stockholm, Sverige"
                value={formData.lagerplats}
                onChange={(e) => handleInputChange('lagerplats', e.target.value)}
                className="h-11"
                required
              />
            </div>

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
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full bg-lime-500 hover:bg-lime-600" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sparar ändringar...
            </>
          ) : (
            'Uppdatera produkt'
          )}
        </Button>

        <DialogClose asChild>
          <Button type="button" variant="outline" className="w-full">
            Avbryt
          </Button>
        </DialogClose>
      </form>
    </div>
  );
}
