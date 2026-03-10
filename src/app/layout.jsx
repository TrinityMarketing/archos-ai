import '../styles/global.css';

export const metadata = {
  title: 'Archos AI | Enterprise AI Consulting & Automation',
  description:
    'Archos AI delivers enterprise AI consulting and intelligent automation for businesses doing $1M+ annually. Strategy, integration, and deployment that drives measurable ROI.',
  keywords:
    'AI consulting, enterprise AI, AI automation, intelligent automation, AI integration, AI strategy, business automation, MLOps, AI agents, workflow automation',
  authors: [{ name: 'Archos AI' }],
  openGraph: {
    type: 'website',
    url: 'https://archos-ai.vercel.app/',
    title: 'Archos AI | Enterprise AI Consulting & Automation',
    description:
      'We build AI systems that transform enterprise operations. Strategy, automation, and deployment for businesses doing $1M+ annually.',
    siteName: 'Archos AI',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Archos AI | Enterprise AI Consulting & Automation',
    description:
      'We build AI systems that transform enterprise operations. Strategy, automation, and deployment for businesses doing $1M+ annually.',
  },
  icons: {
    icon: '/favicon.svg',
  },
  alternates: {
    canonical: 'https://archos-ai.vercel.app/',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Archos AI',
              url: 'https://archos-ai.vercel.app',
              description:
                'Enterprise AI consulting and intelligent automation for businesses doing $1M+ annually.',
              email: 'engage@archos.ai',
              sameAs: [],
              serviceType: ['AI Consulting', 'AI Automation', 'AI Integration', 'AI Strategy'],
              areaServed: 'Worldwide',
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
