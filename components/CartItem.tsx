'use client'

import Image from 'next/image'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { CartItemWithProduct } from '@/types'

interface CartItemProps {
  item: CartItemWithProduct
  onUpdate: () => void
}

export function CartItem({ item, onUpdate }: CartItemProps) {
  const updateQuantity = async (newQuantity: number) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: item.productId, quantity: newQuantity })
      })

      if (response.ok) {
        onUpdate()
        if (newQuantity === 0) {
          toast.success('Item removed from cart')
        }
      } else {
        toast.error('Failed to update cart')
      }
    } catch (error) {
      toast.error('Failed to update cart')
    }
  }

  const removeItem = async () => {
    try {
      const response = await fetch(`/api/cart?productId=${item.productId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        onUpdate()
        toast.success('Item removed from cart')
      } else {
        toast.error('Failed to remove item')
      }
    } catch (error) {
      toast.error('Failed to remove item')
    }
  }

  return (
    <div className="flex items-center space-x-4 p-4 border-b">
      <Image
        src={item.product.image}
        alt={item.product.name}
        width={80}
        height={80}
        className="rounded-lg"
      />
      
      <div className="flex-1">
        <h3 className="font-semibold">{item.product.name}</h3>
        <p className="text-gray-600">${item.product.price.toFixed(2)}</p>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => updateQuantity(item.quantity - 1)}
          className="p-1 rounded-full hover:bg-gray-100"
          disabled={item.quantity <= 1}
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.quantity + 1)}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      <div className="text-right">
        <p className="font-semibold">
          ${(item.product.price * item.quantity).toFixed(2)}
        </p>
        <button
          onClick={removeItem}
          className="text-red-500 hover:text-red-700 mt-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}