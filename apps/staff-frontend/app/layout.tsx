import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BiteBase Staff Portal',
  description: 'Staff administration portal for BiteBase restaurant intelligence platform',
  keywords: ['restaurant', 'staff', 'admin', 'monitoring', 'management'],
  authors: [{ name: 'BiteBase Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#10b981',
          colorBackground: '#ffffff',
          colorInputBackground: '#ffffff',
          colorInputText: '#1f2937',
        },
        elements: {
          formButtonPrimary: 'bg-green-600 hover:bg-green-700 text-white',
          card: 'shadow-xl border-0',
          headerTitle: 'text-green-600 font-bold',
          headerSubtitle: 'text-gray-600',
        }
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}
