import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import ErrorBoundary from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: {
    default: "Smart Recipe Generator",
    template: "%s | Smart Recipe Generator"
  },
  description: "AI-powered recipe suggestions based on your available ingredients. Upload images or input ingredients manually to discover delicious recipes.",
  keywords: ["recipe generator", "AI recipes", "ingredient recognition", "cooking", "food", "meal planning"],
  authors: [{ name: "Smart Recipe Generator" }],
  creator: "Smart Recipe Generator",
  publisher: "Smart Recipe Generator",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://smart-recipe-generator.vercel.app'),
  openGraph: {
    title: "Smart Recipe Generator",
    description: "AI-powered recipe suggestions based on your available ingredients",
    type: "website",
    locale: "en_US",
    siteName: "Smart Recipe Generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Recipe Generator",
    description: "AI-powered recipe suggestions based on your available ingredients",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        <ErrorBoundary>
          <Navigation />
          <main role="main">
            {children}
          </main>
        </ErrorBoundary>
      </body>
    </html>
  );
}
