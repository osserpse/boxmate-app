import { Navigation } from '@/components/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Recycle, DollarSign, Package, Users, Calendar } from 'lucide-react';

export default function AnalyticsPage() {
  // Mock data - will be replaced with real data in future development
  const stats = {
    totalItems: 156,
    soldItems: 89,
    reusedItems: 67,
    totalValue: 125000,
    freedValue: 78000,
    co2Saved: 2.3, // tons
    activeUsers: 12,
    monthlyGrowth: 15.2
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('sv-SE').format(value);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="w-full px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-stone-900 mb-2">Data & insikter</h1>
            <p className="text-muted-foreground">
              Översikt över återbruk, försäljning och frigjort värde
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Totalt värde</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
                <p className="text-xs text-muted-foreground">
                  Alla produkter tillsammans
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Frigjort värde</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.freedValue)}</div>
                <p className="text-xs text-muted-foreground">
                  Genom återbruk och försäljning
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Återbrukade produkter</CardTitle>
                <Recycle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(stats.reusedItems)}</div>
                <p className="text-xs text-muted-foreground">
                  Av {formatNumber(stats.totalItems)} totalt
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CO₂ besparat</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.co2Saved} ton</div>
                <p className="text-xs text-muted-foreground">
                  Genom cirkulär ekonomi
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sales Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Försäljningsöversikt
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Sålda produkter</span>
                  <span className="font-semibold">{formatNumber(stats.soldItems)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Återbrukade produkter</span>
                  <span className="font-semibold">{formatNumber(stats.reusedItems)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Återbruksgrad</span>
                  <span className="font-semibold text-green-600">
                    {Math.round((stats.reusedItems / stats.totalItems) * 100)}%
                  </span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total försäljning</span>
                    <span className="font-semibold text-lg">{formatCurrency(stats.freedValue)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Environmental Impact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Recycle className="h-5 w-5" />
                  Miljöpåverkan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">CO₂ besparat</span>
                  <span className="font-semibold text-green-600">{stats.co2Saved} ton</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Produkter från deponi</span>
                  <span className="font-semibold">{formatNumber(stats.reusedItems)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Nya produkter undvikta</span>
                  <span className="font-semibold">{formatNumber(stats.reusedItems)}</span>
                </div>
                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    <p>Genom cirkulär ekonomi bidrar ni till en mer hållbar framtid.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Growth Metrics */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Tillväxt och aktivitet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">+{stats.monthlyGrowth}%</div>
                    <p className="text-sm text-muted-foreground">Månadsvis tillväxt</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{formatNumber(stats.activeUsers)}</div>
                    <p className="text-sm text-muted-foreground">Aktiva användare</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{formatNumber(stats.totalItems)}</div>
                    <p className="text-sm text-muted-foreground">Totalt produkter</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Placeholder for future charts */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Detaljerade rapporter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Kommer snart</p>
                  <p>Detaljerade diagram och rapporter kommer att utvecklas i framtida uppdateringar.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
