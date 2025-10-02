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
              {isNewItem ? 'Sell New Item' : 'Edit Item'}
            </h1>
            <p className="text-muted-foreground">
              {isNewItem ? 'Create a new listing for your item' : 'Update your item details'}
            </p>
          </div>
        </div>

        <form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photo Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-stone-300 rounded-lg p-8 text-center hover:border-lime-400 transition-colors cursor-pointer">
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                      <div>
                        <p className="font-medium text-stone-900">Add photos of your item</p>
                        <p className="text-sm text-muted-foreground">
                          Drag and drop or click to browse
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Camera button for mobile */}
                  <Button variant="outline" className="w-full lg:hidden">
                    <Camera className="w-4 h-4 mr-2" />
                    Take Photo
                  </Button>

                  {/* Photo grid placeholder */}
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((index) => (
                      <div key={index} className="aspect-square bg-stone-100 rounded-lg flex items-center justify-center text-sm text-muted-foreground">
                        Photo {index}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-2">
                    Item Title *
                  </label>
                  <Input
                    id="title"
                    placeholder="What are you selling?"
                    defaultValue={isNewItem ? '' : 'Nintendo Switch Lite'}
                    className="h-11"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select a category</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="books">Books</option>
                    <option value="sports">Sports</option>
                    <option value="home">Home & Garden</option>
                    <option value="toys">Toys</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="condition" className="block text-sm font-medium mb-2">
                    Condition *
                  </label>
                  <select
                    id="condition"
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select condition</option>
                    <option value="new">Like New</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-2">
                    Tell buyers about your item *
                  </label>
                  <textarea
                    id="description"
                    rows={6}
                    placeholder="Describe your item, its condition, why you're selling it, and any other relevant details..."
                    defaultValue={isNewItem ? '' : 'Like new condition. Barely used, comes with charger. Perfect for portable gaming.'}
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
                <CardTitle className="text-xl">Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium mb-2">
                    Price *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="price"
                      type="number"
                      placeholder="0.00"
                      defaultValue={isNewItem ? '' : '199'}
                      className="h-11 pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Consider similar items when pricing
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-stone-300" />
                    <span className="text-sm text-muted-foreground">Price is negotiable</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium mb-2">
                    City, State *
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button type="submit" size="lg" className="w-full bg-lime-500 hover:bg-lime-600">
                {isNewItem ? 'List Item' : 'Update Listing'}
              </Button>

              <Button type="button" variant="outline" size="lg" className="w-full">
                Save as Draft
              </Button>

              <Link href="/dashboard">
                <Button type="button" variant="ghost" size="lg" className="w-full">
                  Cancel
                </Button>
              </Link>
            </div>

            {/* Tips */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">💡 Tips for selling:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Take clear, well-lit photos</li>
                  <li>• Write detailed descriptions</li>
                  <li>• Set competitive prices</li>
                  <li>• Respond quickly to buyers</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </form>
      </main>
    </div>
  );
}
