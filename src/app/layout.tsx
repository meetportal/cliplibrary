import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { type ReactNode, Suspense } from 'react';
import { AuthReturn } from '@/components/auth/auth-return';
import { ThemeProvider } from '@/components/theme-provider';
import { shareMetadata } from '@/lib/share-metadata';
import { SITE_URL } from '@/lib/site-url';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  ...shareMetadata(
    'Neuclip',
    'Editable motion clips, poster packs and websites. Change anything in the browser, then export or publish.',
  ),
  metadataBase: SITE_URL,
  appleWebApp: { title: 'Neuclip', statusBarStyle: 'black-translucent' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

const themeBootstrap = `(function(){try{var t=localStorage.getItem('neuclip-theme');var d=t==='dark'||((t===null||t==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d){document.documentElement.classList.add('dark');}}catch(e){}})();`;

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en" className={inter.variable} suppressHydrationWarning>
    <head>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static, inline theme bootstrap to avoid a flash of the wrong theme */}
      <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
    </head>
    <body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
      <ClerkProvider signInUrl="/sign-in" signUpUrl="/sign-up">
        <ThemeProvider>{children}</ThemeProvider>
        <Suspense fallback={null}>
          <AuthReturn />
        </Suspense>
      </ClerkProvider>
    </body>
  </html>
);

export default RootLayout;
