import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { 
  sendOneWeekReminderEmail, 
  sendTwoDayReminderEmail, 
  sendOneDayReminderEmail, 
  sendFiveHourReminderEmail 
} from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // Verify this is coming from Render cron job (optional security)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const eventDate = new Date('2025-11-01T20:00:00Z'); // November 1st, 2025 at 8:00 PM UTC
    const now = new Date();
    
    // Calculate time differences
    const timeDiff = eventDate.getTime() - now.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
    
    console.log(`Cron job running. Event in ${daysDiff} days, ${hoursDiff} hours`);

    let remindersSent = 0;
    const errors = [];

    // Get all approved guests who haven't cancelled
    const guests = await prisma.guest.findMany({
      where: {
        status: 'approved',
      },
    });

    console.log(`Found ${guests.length} approved guests`);

    for (const guest of guests) {
      try {
        // One week reminder (7 days before)
        if (daysDiff === 7 && !guest.reminderOneWeekSent) {
          await sendOneWeekReminderEmail(guest);
          await prisma.guest.update({
            where: { id: guest.id },
            data: { reminderOneWeekSent: true },
          });
          await prisma.emailEvent.create({
            data: {
              guestId: guest.id,
              type: 'reminder_one_week',
              status: 'sent',
              subject: 'One Week Reminder - The Black Lotus Murder Mystery',
              message: 'One week reminder sent with preparation tips and calendar links',
              sentAt: new Date(),
            },
          });
          remindersSent++;
          console.log(`One week reminder sent to ${guest.email}`);
        }

        // Two day reminder (2 days before)
        if (daysDiff === 2 && !guest.reminderTwoDaySent) {
          await sendTwoDayReminderEmail(guest);
          await prisma.guest.update({
            where: { id: guest.id },
            data: { reminderTwoDaySent: true },
          });
          await prisma.emailEvent.create({
            data: {
              guestId: guest.id,
              type: 'reminder_two_day',
              status: 'sent',
              subject: 'Two Days to Go - The Black Lotus Murder Mystery',
              message: 'Two day reminder sent with final preparation checklist',
              sentAt: new Date(),
            },
          });
          remindersSent++;
          console.log(`Two day reminder sent to ${guest.email}`);
        }

        // One day reminder (1 day before)
        if (daysDiff === 1 && !guest.reminderOneDaySent) {
          await sendOneDayReminderEmail(guest);
          await prisma.guest.update({
            where: { id: guest.id },
            data: { reminderOneDaySent: true },
          });
          await prisma.emailEvent.create({
            data: {
              guestId: guest.id,
              type: 'reminder_one_day',
              status: 'sent',
              subject: 'Tomorrow\'s the Big Night - The Black Lotus Murder Mystery',
              message: 'One day reminder sent with final preparation tips',
              sentAt: new Date(),
            },
          });
          remindersSent++;
          console.log(`One day reminder sent to ${guest.email}`);
        }

        // Five hour reminder (5 hours before)
        if (hoursDiff === 5 && !guest.reminderFiveHourSent) {
          await sendFiveHourReminderEmail(guest);
          await prisma.guest.update({
            where: { id: guest.id },
            data: { reminderFiveHourSent: true },
          });
          await prisma.emailEvent.create({
            data: {
              guestId: guest.id,
              type: 'reminder_five_hour',
              status: 'sent',
              subject: 'Final Countdown - The Black Lotus Murder Mystery',
              message: 'Five hour reminder sent with final countdown message',
              sentAt: new Date(),
            },
          });
          remindersSent++;
          console.log(`Five hour reminder sent to ${guest.email}`);
        }

      } catch (error) {
        console.error(`Error sending reminder to ${guest.email}:`, error);
        errors.push({
          guestId: guest.id,
          email: guest.email,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Cron job completed. ${remindersSent} reminders sent.`,
      remindersSent,
      errors: errors.length > 0 ? errors : undefined,
      eventDate: eventDate.toISOString(),
      currentTime: now.toISOString(),
      daysUntilEvent: daysDiff,
      hoursUntilEvent: hoursDiff,
    });

  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json(
      { error: 'Cron job failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Allow GET for testing
export async function GET() {
  const eventDate = new Date('2025-11-01T20:00:00Z');
  const now = new Date();
  const timeDiff = eventDate.getTime() - now.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));

  return NextResponse.json({
    message: 'Reminder cron job endpoint',
    eventDate: eventDate.toISOString(),
    currentTime: now.toISOString(),
    daysUntilEvent: daysDiff,
    hoursUntilEvent: hoursDiff,
    nextReminders: {
      oneWeek: daysDiff === 7 ? 'Should send today' : `${7 - daysDiff} days until one week reminder`,
      twoDay: daysDiff === 2 ? 'Should send today' : `${2 - daysDiff} days until two day reminder`,
      oneDay: daysDiff === 1 ? 'Should send today' : `${1 - daysDiff} days until one day reminder`,
      fiveHour: hoursDiff === 5 ? 'Should send today' : `${5 - hoursDiff} hours until five hour reminder`,
    },
  });
}
