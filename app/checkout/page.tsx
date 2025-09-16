'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { loadStripe } from '@stripe/stripe-js'
import { CartItemWithProduct } from '@/types'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [address, setAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cod'>('stripe')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    if (session) {
      fetchCart()
    }
  }, [session, status, router])

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart')
      if (response.ok) {
        const data = await response.json()
        setCartItems(data)
        if (data.length === 0) {
          router.push('/cart')
        }
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStripeCheckout = async () => {
    if (!address.trim()) {
      toast.error('Please enter your shipping address')
      return
    }

    setProcessing(true)
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      })

      if (response.ok) {
        const { sessionId } = await response.json()
        const stripe = await stripePromise
        await stripe?.redirectToCheckout({ sessionId })
      } else {
        toast.error('Failed to create checkout session')
      }
    } catch (error) {
      toast.error('Failed to process payment')
    } finally {
      setProcessing(false)
    }
  }

  const handleCODOrder = async () => {
    if (!address.trim()) {
      toast.error('Please enter your shipping address')
      return
    }

    setProcessing(true)
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, paymentMethod: 'cod' })
      })

      if (response.ok) {
        toast.success('Order placed successfully!')
        router.push('/profile/orders')
      } else {
        toast.error('Failed to place order')
      }
    } catch (error) {
      toast.error('Failed to place order')
    } finally {
      setProcessing(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (paymentMethod === 'stripe') {
      handleStripeCheckout()
    } else {
      handleCODOrder()
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="bg-gray-300 h-8 rounded mb-6"></div>
          <div className="bg-gray-300 h-64 rounded"></div>
        </div>
      </div>
    )
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const shipping = subtotal > 50 ? 0 : 10
  const total = subtotal + shipping

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shipping Address */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={4}
                className="input-field"
                placeholder="Enter your full shipping address..."
                required
              />
            </div>

            {/* Payment Method */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="stripe"
                    checked={paymentMethod === 'stripe'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'stripe')}
                    className="mr-3"
                  />
                  <span>Credit/Debit Card (Stripe)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'cod')}
                    className="mr-3"
                  />
                  <span>Cash on Delivery</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="btn-primary w-full"
            >
              {processing ? 'Processing...' : 
               paymentMethod === 'stripe' ? 'Pay with Stripe' : 'Place Order (COD)'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="card sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}