import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Artisan Bakery Shopify Theme',
  description: 'Production-ready Shopify Online Store 2.0 theme for artisanal bakeries, pastry boutiques, and custom cake shops.',
  openGraph: {
    title: 'Artisan Bakery Shopify Theme',
    description: 'Production-ready Shopify Online Store 2.0 theme for artisanal bakeries, pastry boutiques, and custom cake shops.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artisan Bakery Shopify Theme',
    description: 'Production-ready Shopify Online Store 2.0 theme for artisanal bakeries, pastry boutiques, and custom cake shops.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
