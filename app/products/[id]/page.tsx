'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { ProductWithRelations } from '@/types'

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [productId, setProductId] = useState<string>('')
  const { data: session } = useSession()
  const [product, setProduct] = useState<ProductWithRelations | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [review, setReview] = useState({ rating: 5, comment: '' })
  const [showReviewForm, setShowReviewForm] = useState(false)

  useEffect(() => {
    const getParams = async () => {
      const { id } = await params
      setProductId(id)
    }
    getParams()
  }, [])

  useEffect(() => {
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data)
      }
    } catch (error) {
      console.error('Failed to fetch product:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async () => {
    if (!session) {
      toast.error('Please sign in to add items to cart')
      return
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: productId, quantity })
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
        body: JSON.stringify({ productId: productId })
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

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      toast.error('Please sign in to leave a review')
      return
    }

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: productId,
          rating: review.rating,
          comment: review.comment
        })
      })

      if (response.ok) {
        toast.success('Review submitted!')
        setReview({ rating: 5, comment: '' })
        setShowReviewForm(false)
        fetchProduct()
      } else {
        toast.error('Failed to submit review')
      }
    } catch (error) {
      toast.error('Failed to submit review')
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-300 h-96 rounded-lg"></div>
            <div className="space-y-4">
              <div className="bg-gray-300 h-8 rounded"></div>
              <div className="bg-gray-300 h-4 rounded"></div>
              <div className="bg-gray-300 h-6 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
        </div>
      </div>
    )
  }

  const averageRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div>
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={400}
            className="w-full rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600">
              ({product._count?.reviews || 0} reviews)
            </span>
          </div>

          <p className="text-2xl font-bold text-primary-600 mb-4">
            ${product.price.toFixed(2)}
          </p>

          <p className="text-gray-700 mb-6">{product.description}</p>

          <div className="mb-6">
            <span className={`px-3 py-1 rounded-full text-sm ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Quantity:</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="border rounded px-3 py-1"
                disabled={product.stock === 0}
              >
                {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={addToCart}
              disabled={product.stock === 0}
              className="btn-primary flex items-center space-x-2 flex-1"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
            </button>
            <button
              onClick={addToWishlist}
              className="btn-secondary flex items-center space-x-2"
            >
              <Heart className="w-5 h-5" />
              <span>Wishlist</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t pt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Reviews</h2>
          {session && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="btn-primary"
            >
              Write a Review
            </button>
          )}
        </div>

        {showReviewForm && (
          <form onSubmit={submitReview} className="card mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Rating</label>
              <select
                value={review.rating}
                onChange={(e) => setReview({ ...review, rating: parseInt(e.target.value) })}
                className="input-field"
              >
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} Star{rating !== 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Comment</label>
              <textarea
                value={review.comment}
                onChange={(e) => setReview({ ...review, comment: e.target.value })}
                rows={4}
                className="input-field"
                placeholder="Share your thoughts about this product..."
                required
              />
            </div>
            <div className="flex space-x-4">
              <button type="submit" className="btn-primary">
                Submit Review
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review) => (
              <div key={review.id} className="card">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Customer</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
          )}
        </div>
      </div>
    </div>
  )
}