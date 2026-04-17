import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/providers/AuthProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';

// Import utility to expose lock clearing function to console
if (typeof window !== 'undefined') {
  import('@/lib/utils/clearLocks')
}

const nunito = Nunito({ 
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  title: 'Finance App - Track Your Money',
  description: 'A modern finance tracking app with beautiful UI',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Finance App',
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: '#2563eb',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
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
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Finance App" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={nunito.variable}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
