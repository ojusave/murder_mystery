import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/faqs - Get active FAQs for public display
export async function GET() {
  try {
    const faqs = await prisma.fAQ.findMany({
      where: {
        isActive: true
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' }
      ]
    })

    return NextResponse.json(faqs)
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 })
  }
}
