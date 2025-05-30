import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/custom-animations.css";
import "../styles/custom-chat.css";
import "../styles/chatbot-theme.css"; // Import the new theme based on @chatbot.html
import Script from 'next/script'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CopilotKit Travel",
  description: "A simple travel planner using CopilotKit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Error handler script - load first */}
        <Script
          src="/error-handler.js"
          strategy="beforeInteractive"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <Script
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossOrigin=""
          strategy="lazyOnload"
        />
        <Script
          src="/register-sw.js"
          strategy="lazyOnload"
        />
        <Script
          dangerouslySetInnerHTML={{
            __html: `
              // Handle 404 errors for missing JavaScript files
              window.addEventListener('error', function(e) {
                if (e.target && (e.target.src || e.target.href)) {
                  const resource = e.target.src || e.target.href;
                  if (resource.includes('app-pages-internals.js') ||
                      resource.includes('main-app.js') ||
                      resource.includes('layout.js') ||
                      resource.includes('layout.css')) {
                    console.log('Handled 404 for:', resource);
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }
              }, true);
            `
          }}
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
