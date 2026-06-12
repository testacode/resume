import type { Metadata } from 'next';
import { Bricolage_Grotesque, Instrument_Sans, IBM_Plex_Mono } from 'next/font/google';
import { ThemeProvider } from '@/providers/ThemeProvider';

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
});

const sans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
});
import { resumeData } from '@/data/resume';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://carlosmonti.com'),
  title: 'Carlos Monti | Senior Front End Developer',
  description:
    'Senior Front End Developer with 10+ years of experience building web applications with React, TypeScript, and Next.js.',
  keywords: ['Frontend Developer', 'React', 'TypeScript', 'Next.js', 'Buenos Aires'],
  authors: [{ name: 'Carlos Monti' }],
  alternates: {
    canonical: 'https://carlosmonti.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://carlosmonti.com',
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

const { personal } = resumeData;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: personal.name,
  jobTitle: personal.title,
  url: 'https://carlosmonti.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: personal.address.city,
    addressCountry: personal.address.country,
  },
  sameAs: personal.social
    .filter((s) => s.enabled)
    .map((s) => s.url),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${sans.variable} ${mono.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
