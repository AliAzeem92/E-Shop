import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId, rating, comment } = await request.json()

    const review = await prisma.review.create({
      data: {
        productId,
        userId: session.user.id,
        rating: parseInt(rating),
        comment
      },
      include: {
        user: {
          select: { name: true }
        }
      }
    })

    return NextResponse.json(review)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
}