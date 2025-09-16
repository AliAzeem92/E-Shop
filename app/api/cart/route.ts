import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: true
      }
    })

    return NextResponse.json(cartItems)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId, quantity } = await request.json()

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId
        }
      }
    })

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true }
      })
      return NextResponse.json(updatedItem)
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        userId: session.user.id,
        productId,
        quantity
      },
      include: { product: true }
    })

    return NextResponse.json(cartItem)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId, quantity } = await request.json()

    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId
          }
        }
      })
      return NextResponse.json({ message: 'Item removed from cart' })
    }

    const cartItem = await prisma.cartItem.update({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId
        }
      },
      data: { quantity },
      include: { product: true }
    })

    return NextResponse.json(cartItem)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (productId) {
      await prisma.cartItem.delete({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId
          }
        }
      })
    } else {
      await prisma.cartItem.deleteMany({
        where: { userId: session.user.id }
      })
    }

    return NextResponse.json({ message: 'Cart updated successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 })
  }
}