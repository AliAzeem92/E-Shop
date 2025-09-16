'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [orderCreated, setOrderCreated] = useState(false)

  useEffect(() => {
    if (sessionId && !orderCreated) {
      createOrder()
    }
  }, [sessionId, orderCreated])

  const createOrder = async () => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          address: 'Stripe Payment Address',
          paymentMethod: 'stripe',
          sessionId 
        })
      })
      
      if (response.ok) {
        setOrderCreated(true)
      }
    } catch (error) {
      console.error('Failed to create order:', error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="mb-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600">
          Thank you for your purchase. Your order has been confirmed.
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-green-800 mb-2">
          What happens next?
        </h2>
        <ul className="text-green-700 space-y-1">
          <li>• You'll receive an email confirmation shortly</li>
          <li>• Your order will be processed within 24 hours</li>
          <li>• Track your order in your profile</li>
        </ul>
      </div>

      <div className="space-y-4">
        <Link href="/profile/orders" className="btn-primary inline-block">
          View My Orders
        </Link>
        <br />
        <Link href="/products" className="btn-secondary inline-block">
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto px-4 py-16 text-center">Loading...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  )
}