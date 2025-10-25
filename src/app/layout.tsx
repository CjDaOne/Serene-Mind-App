import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Providers } from '@/components/providers';

const inter = Inter({ 
  subsets: ['latin'], 
  display: 'swap', 
  variable: '--font-inter' 
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'], 
  display: 'swap', 
  variable: '--font-space' 
});

export const metadata: Metadata = {
  title: 'Digital Mental Wellness: Tools, Goals, and Self-Care',
  description: 'An app for mental wellness, tasks, goals, and self-care.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-body antialiased`}>
      <Providers>
        {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
