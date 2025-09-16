'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { User, Package, Heart, Settings } from 'lucide-react'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="bg-gray-300 h-8 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-300 h-32 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-gray-600 mt-2">Welcome back, {session.user.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="card">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <User className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold">Profile Information</h3>
              <p className="text-sm text-gray-600">Manage your account details</p>
            </div>
          </div>
          <div className="space-y-2">
            <p><span className="font-medium">Name:</span> {session.user.name}</p>
            <p><span className="font-medium">Email:</span> {session.user.email}</p>
            <p><span className="font-medium">Role:</span> {session.user.role}</p>
          </div>
        </div>

        {/* Orders */}
        <Link href="/profile/orders" className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">My Orders</h3>
              <p className="text-sm text-gray-600">View your order history</p>
            </div>
          </div>
          <p className="text-primary-600 font-medium">View Orders →</p>
        </Link>

        {/* Wishlist */}
        <Link href="/wishlist" className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold">My Wishlist</h3>
              <p className="text-sm text-gray-600">Saved items for later</p>
            </div>
          </div>
          <p className="text-primary-600 font-medium">View Wishlist →</p>
        </Link>

        {/* Admin Dashboard (if admin) */}
        {session.user.role === 'ADMIN' && (
          <Link href="/admin" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Admin Dashboard</h3>
                <p className="text-sm text-gray-600">Manage products and orders</p>
              </div>
            </div>
            <p className="text-primary-600 font-medium">Go to Dashboard →</p>
          </Link>
        )}
      </div>
    </div>
  )
}