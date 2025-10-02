'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Edit } from 'lucide-react';
import { deleteItem } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EditItemForm } from '@/components/edit-item-form';

interface ItemActionsProps {
  itemId: string;
  itemName: string;
  itemLocation: string;
  itemDescription: string;
  itemValue?: number;
  itemPhotos?: string[];
}

export function ItemActions({
  itemId,
  itemName,
  itemLocation,
  itemDescription,
  itemValue,
  itemPhotos
}: ItemActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const router = useRouter();

  const handleEditComplete = () => {
    setIsEditDialogOpen(false);
    router.refresh(); // Refresh the page to show updated data
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteItem(itemId);

      if (result.success) {
        // Redirect to dashboard after successful delete
        router.push('/dashboard');
      } else {
        alert(`Fel: ${result.error}`);
      }
    } catch (error) {
      alert('Ett oväntat fel uppstod när produkten skulle tas bort');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="border-stone-200">
      <CardHeader>
        <CardTitle className="text-lg">Hantera produkt</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              <Edit className="w-4 h-4 mr-2" />
              Redigera
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Redigera produkt</DialogTitle>
              <DialogDescription>
                Uppdatera information för &ldquo;{itemName}&rdquo;
              </DialogDescription>
            </DialogHeader>
            <EditItemForm
              itemId={itemId}
              itemName={itemName}
              currentLocation={itemLocation}
              currentDescription={itemDescription}
              currentValue={itemValue}
              currentPhotos={itemPhotos}
              onUpdate={handleEditComplete}
            />
          </DialogContent>
        </Dialog>

        <Link href={`/sell/${itemId}`}>
          <Button variant="outline" className="w-full justify-start">
            ↄ Sälj vidare
          </Button>
        </Link>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isDeleting ? 'Tar bort...' : 'Ta bort'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ta bort produkt</DialogTitle>
              <DialogDescription>
                Är du säker på att du vill ta bort &ldquo;{itemName}&rdquo;? Denna åtgärd kan inte ångras.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 pt-4">
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1">
                  Avbryt
                </Button>
              </DialogTrigger>
              <Button
                onClick={handleDelete}
                variant="outline"
                className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                disabled={isDeleting}
              >
                {isDeleting ? 'Tar bort...' : 'Ta bort'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
