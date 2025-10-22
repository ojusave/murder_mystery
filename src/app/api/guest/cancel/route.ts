import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendCancellationEmail, sendCancellationNotificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { guestId } = await request.json();

    if (!guestId) {
      return NextResponse.json(
        { error: 'Guest ID is required' },
        { status: 400 }
      );
    }

    // Get the guest
    const guest = await prisma.guest.findUnique({
      where: { id: guestId },
    });

    if (!guest) {
      return NextResponse.json(
        { error: 'Guest not found' },
        { status: 404 }
      );
    }

    if (guest.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Registration is already cancelled' },
        { status: 400 }
      );
    }

    // Update guest status to cancelled
    const updatedGuest = await prisma.guest.update({
      where: { id: guestId },
      data: { status: 'cancelled' },
    });

    // Send cancellation email to guest
    await sendCancellationEmail(updatedGuest);

    // Send notification email to host
    await sendCancellationNotificationEmail(updatedGuest);

    // Create email event for cancellation
    await prisma.emailEvent.create({
      data: {
        guestId: guestId,
        type: 'cancellation',
        status: 'sent',
        subject: 'Registration Cancelled - The Black Lotus Murder Mystery',
        message: 'Your registration has been cancelled. We\'re sorry you won\'t be able to join us.',
        sentAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Registration cancelled successfully',
    });

  } catch (error) {
    console.error('Error cancelling registration:', error);
    return NextResponse.json(
      { error: 'Failed to cancel registration' },
      { status: 500 }
    );
  }
}
