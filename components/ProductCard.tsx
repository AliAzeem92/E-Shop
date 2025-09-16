'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { ProductWithRelations } from '@/types'

interface ProductCardProps {
  product: ProductWithRelations
}

export function ProductCard({ product }: ProductCardProps) {
  const { data: session } = useSession()

  const addToCart = async () => {
    if (!session) {
      toast.error('Please sign in to add items to cart')
      return
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1 })
      })

      if (response.ok) {
        toast.success('Added to cart!')
      } else {
        toast.error('Failed to add to cart')
      }
    } catch (error) {
      toast.error('Failed to add to cart')
    }
  }

  const addToWishlist = async () => {
    if (!session) {
      toast.error('Please sign in to add items to wishlist')
      return
    }

    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id })
      })

      if (response.ok) {
        toast.success('Added to wishlist!')
      } else {
        toast.error('Failed to add to wishlist')
      }
    } catch (error) {
      toast.error('Failed to add to wishlist')
    }
  }

  const averageRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0

  return (
    <div className="card group hover:shadow-lg transition-shadow">
      <div className="relative">
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={200}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <button
          onClick={addToWishlist}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>
      
      <Link href={`/products/${product.id}`}>
        <h3 className="font-semibold text-lg mb-2 hover:text-primary-600">
          {product.name}
        </h3>
      </Link>
      
      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
        {product.description}
      </p>
      
      <div className="flex items-center mb-2">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-sm ${i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
            >
              ★
            </span>
          ))}
        </div>
        <span className="text-sm text-gray-500 ml-2">
          ({product._count?.reviews || 0})
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold text-primary-600">
          ${product.price.toFixed(2)}
        </span>
        <button
          onClick={addToCart}
          className="btn-primary flex items-center space-x-2"
          disabled={product.stock === 0}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  )
}