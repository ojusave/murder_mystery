import { NextRequest, NextResponse } from 'next/server';
import { getServerAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';

async function ensureAdmin(request: NextRequest) {
  const session = await getServerAuth(request);
  if (!session || !session.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export async function GET(request: NextRequest) {
  const unauthorized = await ensureAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const faqs = await prisma.faq.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' },
      ],
    });

    return NextResponse.json(faqs);
  } catch (error) {
    console.error('Failed to fetch FAQs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FAQs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = await ensureAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const { question, answer, order } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { error: 'Question and answer are required' },
        { status: 400 }
      );
    }

    const parsedOrder = order === undefined || order === null
      ? 0
      : Number(order);

    if (Number.isNaN(parsedOrder)) {
      return NextResponse.json(
        { error: 'Order must be a number' },
        { status: 400 }
      );
    }

    const faq = await prisma.faq.create({
      data: {
        question,
        answer,
        order: parsedOrder,
      },
    });

    return NextResponse.json(faq, { status: 201 });
  } catch (error) {
    console.error('Failed to create FAQ:', error);
    return NextResponse.json(
      { error: 'Failed to create FAQ' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const unauthorized = await ensureAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const { id, question, answer, order } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'FAQ id is required' },
        { status: 400 }
      );
    }

    let parsedOrder: number | undefined;
    if (order !== undefined) {
      parsedOrder = Number(order);
      if (Number.isNaN(parsedOrder)) {
        return NextResponse.json(
          { error: 'Order must be a number' },
          { status: 400 }
        );
      }
    }

    const faq = await prisma.faq.update({
      where: { id },
      data: {
        ...(question !== undefined ? { question } : {}),
        ...(answer !== undefined ? { answer } : {}),
        ...(parsedOrder !== undefined ? { order: parsedOrder } : {}),
      },
    });

    return NextResponse.json(faq);
  } catch (error) {
    console.error('Failed to update FAQ:', error);
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'FAQ not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update FAQ' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const unauthorized = await ensureAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'FAQ id is required' },
        { status: 400 }
      );
    }

    await prisma.faq.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete FAQ:', error);
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { error: 'FAQ not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to delete FAQ' },
      { status: 500 }
    );
  }
}
