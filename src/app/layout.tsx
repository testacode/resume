import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import { ThemeProvider } from '@/providers/ThemeProvider';
import './globals.css';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Carlos Monti | Senior Front End Developer',
  description:
    'Senior Front End Developer with 10+ years of experience building web applications with React, TypeScript, and Next.js.',
  keywords: ['Frontend Developer', 'React', 'TypeScript', 'Next.js', 'Buenos Aires'],
  authors: [{ name: 'Carlos Monti' }],
  alternates: {
    canonical: 'https://carlosmonti.dev',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://carlosmonti.dev',
    siteName: 'Carlos Monti Portfolio',
    title: 'Carlos Monti | Senior Front End Developer',
    description:
      'Senior Front End Developer with 10+ years of experience building web applications with React, TypeScript, and Next.js.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Carlos Monti | Senior Front End Developer',
    description:
      'Senior Front End Developer with 10+ years of experience building web applications with React, TypeScript, and Next.js.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Carlos Monti',
  jobTitle: 'Senior Front End Developer',
  url: 'https://carlosmonti.dev',
  email: '[email removed]',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Buenos Aires',
    addressCountry: 'Argentina',
  },
  sameAs: [
    'https://linkedin.com/in/carlosmonti',
    'https://github.com/testacode',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable}`}>
        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify(jsonLd)}
        </Script>
        <ThemeProvider>
          <a href="#main-content" className="skip-to-content">
            Skip to content
          </a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
