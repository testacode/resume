import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { resumeData } from '@/data/resume';
import './globals.css';

const inter = localFont({
  src: './fonts/InterVariable.woff2',
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = localFont({
  src: './fonts/JetBrainsMono-Variable.woff2',
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
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
  email: personal.email,
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
