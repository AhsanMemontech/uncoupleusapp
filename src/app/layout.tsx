import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import ChatbotWidget from '@/components/ChatbotWidget'
import { ChatbotProvider } from '@/components/ChatbotContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Uncouple - AI-Powered Uncontested Divorce for New York',
  description: 'Streamline your uncontested divorce process in New York State with our AI-powered tool. Get the forms you need, understand the process, and save time and money.',
  keywords: 'divorce, uncontested divorce, New York divorce, divorce forms, AI divorce, legal forms',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className + ' pt-16'}>
        <ChatbotProvider>
          <Header />
          {children}
          <ChatbotWidget />
        </ChatbotProvider>
      </body>
    </html>
  )
} 