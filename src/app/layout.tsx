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
import { SITE_URL } from '@/config/site';
import './globals.css';

const { personal } = resumeData;
const pageTitle = `${personal.name} | ${personal.title}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: pageTitle,
  description: personal.tagline,
  keywords: ['Software Engineer', 'AI', 'LLM', 'AI Agents', 'React', 'TypeScript', 'Next.js', 'Buenos Aires'],
  authors: [{ name: personal.name }],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Carlos Monti Portfolio',
    title: pageTitle,
    description: personal.tagline,
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: personal.tagline,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: personal.name,
  jobTitle: personal.title,
  url: SITE_URL,
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
