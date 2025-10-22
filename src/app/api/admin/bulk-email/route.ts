import { NextRequest, NextResponse } from 'next/server';
import { getServerAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { sendBulkEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerAuth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { guestIds, subject, message } = await request.json();

    if (!guestIds || !Array.isArray(guestIds) || guestIds.length === 0) {
      return NextResponse.json(
        { error: 'Guest IDs are required' },
        { status: 400 }
      );
    }

    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Subject and message are required' },
        { status: 400 }
      );
    }

    // Get the guests
    const guests = await prisma.guest.findMany({
      where: {
        id: {
          in: guestIds,
        },
      },
    });

    if (guests.length === 0) {
      return NextResponse.json(
        { error: 'No guests found' },
        { status: 404 }
      );
    }

    // Send bulk email
    await sendBulkEmail(guests, subject, message);

    // Create email events for each guest
    const emailEvents = guests.map(guest => ({
      guestId: guest.id,
      type: 'bulk_email',
      subject,
      message,
      sentAt: new Date(),
    }));

    await prisma.emailEvent.createMany({
      data: emailEvents,
    });

    return NextResponse.json({
      success: true,
      message: `Bulk email sent to ${guests.length} guests`,
      sentTo: guests.map(guest => ({
        id: guest.id,
        name: guest.legalName,
        email: guest.email,
      })),
    });

  } catch (error) {
    console.error('Error sending bulk email:', error);
    return NextResponse.json(
      { error: 'Failed to send bulk email' },
      { status: 500 }
    );
  }
}
