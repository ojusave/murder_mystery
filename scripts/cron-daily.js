import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

const APP_BASE_URL = process.env.APP_BASE_URL || 'http://localhost:3000';
const EMAIL_FROM = process.env.EMAIL_FROM || 'Black Lotus <noreply@saveoj.us>';
const RSVP_DEADLINE = process.env.RSVP_DEADLINE || '2024-10-30';

async function sendRSVPDeadlineReminders() {
  console.log('Sending RSVP deadline reminders...');
  
  try {
    // Find guests with pending RSVPs
    const pendingGuests = await prisma.guest.findMany({
      where: { status: 'pending' },
    });

    console.log(`Found ${pendingGuests.length} pending guests`);

    for (const guest of pendingGuests) {
      try {
        await sendDeadlineReminderEmail(guest);
        console.log(`Reminder sent to ${guest.email}`);
      } catch (error) {
        console.error(`Error sending reminder to ${guest.email}:`, error);
      }
    }
  } catch (error) {
    console.error('Error sending RSVP deadline reminders:', error);
  }
}

async function sendDeadlineReminderEmail(guest: any) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1f2937, #7c3aed); color: white; padding: 20px; border-radius: 10px;">
      <h1 style="text-align: center; margin-bottom: 30px;">The Black Lotus</h1>
      <h2 style="color: #f59e0b;">RSVP Deadline Reminder</h2>
      <p>Hi ${guest.legalName},</p>
      <p>This is a friendly reminder that the RSVP deadline for The Black Lotus: A Halloween Murder Mystery is approaching!</p>
      <div style="background: rgba(245, 158, 11, 0.2); border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #f59e0b;">Important Deadline</h3>
        <p><strong>RSVP Deadline:</strong> ${RSVP_DEADLINE}</p>
        <p><strong>Event Date:</strong> November 1st, 2025</p>
        <p><strong>Time:</strong> 8:00 PM - 12:00 AM</p>
      </div>
      <p>Your RSVP is currently under review. We'll notify you of our decision soon!</p>
      <p>If you have any questions or need to update your RSVP, please contact us immediately.</p>
      <p>Don't miss out on this thrilling evening of mystery and intrigue!</p>
      <p>Best regards,<br>The Black Lotus Team</p>
    </div>
  `;

  await resend.emails.send({
    from: EMAIL_FROM,
    to: guest.email,
    subject: 'RSVP Deadline Reminder - The Black Lotus Murder Mystery',
    html,
  });
}

async function cleanupAbandonedTokens() {
  console.log('Cleaning up abandoned tokens...');
  
  try {
    // Find guests created more than 7 days ago with pending status
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7);

    const abandonedGuests = await prisma.guest.findMany({
      where: {
        status: 'pending',
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    console.log(`Found ${abandonedGuests.length} abandoned RSVPs`);

    // For now, we'll just log them. In a real scenario, you might want to:
    // 1. Send a follow-up email
    // 2. Mark them as expired
    // 3. Delete them after a certain period
    
    for (const guest of abandonedGuests) {
      console.log(`Abandoned RSVP: ${guest.email} (${guest.legalName}) - Created: ${guest.createdAt}`);
    }
  } catch (error) {
    console.error('Error cleaning up abandoned tokens:', error);
  }
}

async function cleanupOldEmailEvents() {
  console.log('Cleaning up old email events...');
  
  try {
    // Delete email events older than 30 days
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);

    const deletedCount = await prisma.emailEvent.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
        status: {
          in: ['sent', 'failed'],
        },
      },
    });

    console.log(`Deleted ${deletedCount.count} old email events`);
  } catch (error) {
    console.error('Error cleaning up old email events:', error);
  }
}

async function generateDailyReport() {
  console.log('Generating daily report...');
  
  try {
    const stats = await prisma.guest.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    const totalGuests = await prisma.guest.count();
    const totalCharacters = await prisma.character.count();
    const pendingEmails = await prisma.emailEvent.count({
      where: { status: 'queued' },
    });

    console.log('=== Daily Report ===');
    console.log(`Total Guests: ${totalGuests}`);
    console.log(`Total Characters Assigned: ${totalCharacters}`);
    console.log(`Pending Emails: ${pendingEmails}`);
    
    stats.forEach(stat => {
      console.log(`${stat.status}: ${stat._count.id}`);
    });
    console.log('==================');
  } catch (error) {
    console.error('Error generating daily report:', error);
  }
}

async function main() {
  console.log('Starting daily cron job...');
  
  try {
    await sendRSVPDeadlineReminders();
    await cleanupAbandonedTokens();
    await cleanupOldEmailEvents();
    await generateDailyReport();
    
    console.log('Daily cron job completed successfully');
  } catch (error) {
    console.error('Error in daily cron job:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down cron job...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down cron job...');
  await prisma.$disconnect();
  process.exit(0);
});

main().catch((error) => {
  console.error('Cron job error:', error);
  process.exit(1);
});
