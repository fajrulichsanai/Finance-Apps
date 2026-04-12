import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/providers/AuthProvider';

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
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
