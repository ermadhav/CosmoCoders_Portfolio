import type { Metadata } from 'next';

import Layout from '@/components/Layout';

import '@/styles/globals.css';
import '@/styles/themes.css';

export const metadata: Metadata = {
  title: {
    default: 'Madhav Tiwari | Portfolio',
    template: 'Madhav Tiwari | %s',
  },
  description:
    "Madhav Tiwari is an avid full stack web developer building websites and applications you'd love to use",
  keywords: [
    'Madhav Tiwari',
    'nitin',
    'ranganath',
    'web developer portfolio',
    'nitin web developer',
    'nitin developer',
    'mern stack',
    'Madhav Tiwari portfolio',
    'vscode-portfolio',
  ],
  openGraph: {
    title: "Madhav Tiwari's Portfolio",
    description:
      "A full-stack developer building websites that you'd like to use.",
    images: ['https://imgur.com/4zi5KkQ.png'],
    url: 'https://vscode-portfolio.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

const themeScript = `
  (function() {
    const theme = localStorage.getItem('theme');
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
