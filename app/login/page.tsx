import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-stone-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 bg-lime-500 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-white" />
            </div>
            <span className="font-bold text-3xl text-lime-600">BoxMate</span>
          </Link>
          <p className="text-muted-foreground mt-2">Din lokala marknadsplatsgemenskap</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Välkommen tillbaka</CardTitle>
            <CardDescription>
              Logga in för att komma åt ditt konto och börja sälja
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  E-post
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ange din e-postadress"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Lösenord
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Ange ditt lösenord"
                  className="h-11"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-stone-300" />
                  <span className="text-sm text-muted-foreground">Kom ihåg mig</span>
                </label>
                <Link href="#" className="text-sm text-lime-600 hover:text-lime-700">
                  Glömde lösenordet?
                </Link>
              </div>

              <Button className="w-full h-11 bg-lime-500 hover:bg-lime-600">
                Logga in
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Eller fortsätt med
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-11">
                Fortsätt med Google
              </Button>
              <Button variant="outline" className="h-11">
                Fortsätt med Apple
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Har du inte ett konto?{' '}
              <Link href="#" className="text-lime-600 hover:text-lime-700 font-medium">
                Registrera dig
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Demo button */}
        <div className="mt-6 text-center">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-muted-foreground">
              Fortsätt som demoanvändare →
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground mt-8">
          <p>Demo-inloggningssida - autentisering kommer snart!</p>
        </div>
      </div>
    </div>
  );
}
