import type { Metadata } from 'next';
import { Fira_Sans } from 'next/font/google';
import './globals.css';

const firaSans = Fira_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-fira-sans',
});

export const metadata: Metadata = {
  title: 'BoxMate - Sell Your Items Locally',
  description: 'A modern marketplace for buying and selling items in your local community',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={firaSans.variable}>
      <body className={`${firaSans.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
