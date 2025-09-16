'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { ShoppingCart, User, Heart, Search } from 'lucide-react'
import { useState, useEffect } from 'react'

export function Navbar() {
  const { data: session } = useSession()
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    if (session) {
      fetchCartCount()
    }
  }, [session])

  const fetchCartCount = async () => {
    try {
      const response = await fetch('/api/cart')
      if (response.ok) {
        const cartItems = await response.json()
        setCartCount(cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0))
      }
    } catch (error) {
      console.error('Failed to fetch cart count:', error)
    }
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            E-Shop
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-gray-700 hover:text-primary-600">
              Products
            </Link>
            <Link href="/products?category=clothing" className="text-gray-700 hover:text-primary-600">
              Clothing
            </Link>
            <Link href="/products?category=electronics" className="text-gray-700 hover:text-primary-600">
              Electronics
            </Link>
            <Link href="/products?category=books" className="text-gray-700 hover:text-primary-600">
              Books
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link href="/wishlist" className="text-gray-700 hover:text-primary-600">
                  <Heart className="w-6 h-6" />
                </Link>
                <Link href="/cart" className="relative text-gray-700 hover:text-primary-600">
                  <ShoppingCart className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                    <User className="w-6 h-6" />
                    <span>{session.user.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    <Link href="/profile/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Orders
                    </Link>
                    {session.user.role === 'ADMIN' && (
                      <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/signin" className="text-gray-700 hover:text-primary-600">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}