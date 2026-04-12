import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/providers/AuthProvider';

const nunito = Nunito({ 
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  title: 'Finance App - Track Your Money',
  description: 'A modern finance tracking app with beautiful UI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={nunito.variable}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
