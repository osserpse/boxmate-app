import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload, Camera, DollarSign } from 'lucide-react';
import Link from 'next/link';

interface SellPageProps {
  params: {
    id: string;
  };
}

export default function SellPage({ params }: SellPageProps) {
  const isNewItem = params.id === 'new';

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-stone-900">
              {isNewItem ? 'Sälj ny produkt' : 'Redigera produkt'}
            </h1>
            <p className="text-muted-foreground">
              {isNewItem ? 'Skapa er annons för din produkt' : 'Uppdatera produktdetaljer'}
            </p>
          </div>
        </div>

        <form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photo Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Foton</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-stone-300 rounded-lg p-8 text-center hover:border-lime-400 transition-colors cursor-pointer">
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 text-muted-foreground mx-8" />
                      <div>
                        <p className="font-medium text-stone-900">Lägg till foton av din produkt</p>
                        <p className="text-sm text-muted-foreground">
                          Dra och släpp eller klicka för att bläddra
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Camera button for mobile */}
                    <Button variant="outline" className="w-full lg:hidden">
                      <Camera className="w-4 h-4 mr-2" />
                      Ta foto
                    </Button>

                  {/* Photo grid placeholder */}
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((index) => (
                      <div key={index} className="aspect-square bg-stone-100 rounded-lg flex items-center justify-center text-sm text-muted-foreground">
                        Foto {index}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Grundinformation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-2">
                    Produkttitel *
                  </label>
                  <Input
                    id="title"
                    placeholder="Vad säljer du?"
                    defaultValue={isNewItem ? '' : 'Nintendo Switch Lite'}
                    className="h-11"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-2">
                    Kategori *
                  </label>
                  <select
                    id="category"
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Välj kategori</option>
                    <option value="electronics">Elektronik</option>
                    <option value="clothing">Kläder</option>
                    <option value="books">Böcker</option>
                    <option value="sports">Sport</option>
                    <option value="home">Hem & trädgård</option>
                    <option value="toys">Leksaker</option>
                    <option value="other">Övrigt</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="condition" className="block text-sm font-medium mb-2">
                    Skick *
                  </label>
                  <select
                    id="condition"
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Välj skick</option>
                    <option value="new">Som ny</option>
                    <option value="excellent">Utmärkt</option>
                    <option value="good">Bra</option>
                    <option value="fair">Skälig</option>
                    <option value="poor">Dålig</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Beskrivning</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-2">
                    Berätta för köpare om din produkt *
                  </label>
                  <textarea
                    id="description"
                    rows={6}
                    placeholder="Beskriv din produkt, dess skick, varför du säljer den och andra relevant detaljer..."
                    defaultValue={isNewItem ? '' : 'Nyskick. Nästan inte använd, kommer med laddare. Perfekt för bärbar gaming.'}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Prissättning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium mb-2">
                    Pris *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="price"
                      type="number"
                      placeholder="0"
                      defaultValue={isNewItem ? '' : '1899'}
                      className="h-11 pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Betrakta liknande produkter vid prissättning
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-stone-300" />
                    <span className="text-sm text-muted-foreground">Pris är förhandlingsbart</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Plats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium mb-2">
                    Stad, Land *
                  </label>
                </div>
                <Input
                  id="location"
                  placeholder="ex. Stockholm, Sverige"
                  className="h-11"
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button type="submit" size="lg" className="w-full bg-lime-500 hover:bg-lime-600">
                {isNewItem ? 'Publicera annons' : 'Uppdatera annons'}
              </Button>

              <Button type="button" variant="outline" size="lg" className="w-full">
                Spara som utkast
              </Button>

              <Link href="/dashboard">
                <Button type="button" variant="ghost" size="lg" className="w-full">
                  Avbryt
                </Button>
              </Link>
            </div>

            {/* Tips */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">💡 Tips för att sälja:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Ta tydliga och välbelysta foton</li>
                  <li>• Skriv detaljerada beskrivningar</li>
                  <li>• Sätt konkurrenskraftiga priser</li>
                  <li>• Svara snabbt på köpare</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </form>
      </main>
    </div>
  );
}