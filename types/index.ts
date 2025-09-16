import { User, Product, Order, Review, CartItem, Wishlist } from '@prisma/client'

export type UserWithRelations = User & {
  orders?: Order[]
  reviews?: Review[]
  cart?: CartItem[]
  wishlist?: Wishlist[]
}

export type ProductWithRelations = Product & {
  reviews?: Review[]
  _count?: {
    reviews: number
  }
}

export type OrderWithRelations = Order & {
  items: (OrderItem & {
    product: Product
  })[]
  user: User
}

export type OrderItem = {
  id: string
  orderId: string
  productId: string
  quantity: number
  price: number
}

export type CartItemWithProduct = CartItem & {
  product: Product
}

export interface CheckoutData {
  address: string
  paymentMethod: 'stripe' | 'cod'
}