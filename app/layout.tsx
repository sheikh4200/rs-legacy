// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import { CartProvider } from './lib/cart-context'
import Header from './components/Header'
import Footer from './components/Footer'
import { WishlistProvider } from './lib/wishlist-context'
import { AuthProvider } from './lib/auth-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ShopNow - Modern E-Commerce Platform',
  description: 'Discover amazing products at unbeatable prices. Quality guaranteed with fast shipping and excellent customer service.',
  keywords: 'e-commerce, shopping, products, electronics, clothing, sports',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
         <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
      </head>
      <body className={inter.className}
      suppressHydrationWarning={true}
      >
        <div className="min-h-screen bg-gray-50">
          <AuthProvider>
          <CartProvider>
            <WishlistProvider>
            <Header/>
          {children}
          <Footer/>
            </WishlistProvider>
          </CartProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  )
}