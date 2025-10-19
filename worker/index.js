require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Resend } = require('resend');

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

const APP_BASE_URL = process.env.APP_BASE_URL || 'http://localhost:3000';
const EMAIL_FROM = process.env.EMAIL_FROM || 'Dark Lotus <noreply@darklotus.party>';
const REAL_ADDRESS = process.env.REAL_ADDRESS || '123 Mystery Lane, Fremont, CA 94536';
const EVENT_DATE = process.env.EVENT_DATE || '2025-11-01';
const EVENT_START_TIME = process.env.EVENT_START_TIME || '20:00';
const EVENT_END_TIME = process.env.EVENT_END_TIME || '00:00';
const EVENT_TITLE = process.env.EVENT_TITLE || 'The Dark Lotus: A Halloween Murder Mystery';
const EVENT_DESCRIPTION = process.env.EVENT_DESCRIPTION || 'Join us for an unforgettable evening of mystery, intrigue, and Halloween thrills.';

// Helper function to generate calendar links
function generateCalendarLinks() {
  const startDate = new Date(`${EVENT_DATE}T${EVENT_START_TIME}:00`);
  const endDate = new Date(`${EVENT_DATE}T${EVENT_END_TIME}:00`);
  
  // Handle next day for end time
  if (EVENT_END_TIME === '00:00') {
    endDate.setDate(endDate.getDate() + 1);
  }
  
  const formatDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  const startFormatted = formatDate(startDate);
  const endFormatted = formatDate(endDate);
  
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(EVENT_TITLE)}&dates=${startFormatted}/${endFormatted}&details=${encodeURIComponent(EVENT_DESCRIPTION)}&location=${encodeURIComponent(REAL_ADDRESS)}`;
  
  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(EVENT_TITLE)}&startdt=${startFormatted}&enddt=${endFormatted}&body=${encodeURIComponent(EVENT_DESCRIPTION)}&location=${encodeURIComponent(REAL_ADDRESS)}`;
  
  const yahooUrl = `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${encodeURIComponent(EVENT_TITLE)}&st=${startFormatted}&et=${endFormatted}&desc=${encodeURIComponent(EVENT_DESCRIPTION)}&in_loc=${encodeURIComponent(REAL_ADDRESS)}`;
  
  return {
    google: googleCalendarUrl,
    outlook: outlookUrl,
    yahoo: yahooUrl,
    ics: generateICSFile(startDate, endDate)
  };
}

// Generate ICS file content for download
function generateICSFile(startDate, endDate) {
  const formatICSDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Dark Lotus//Event//EN
BEGIN:VEVENT
UID:${Date.now()}@darklotus.party
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:${EVENT_TITLE}
DESCRIPTION:${EVENT_DESCRIPTION}
LOCATION:${REAL_ADDRESS}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
}

async function processEmailQueue() {
  console.log('Processing email queue...');
  
  try {
    // Get queued email events
    const emailEvents = await prisma.emailEvent.findMany({
      where: { status: 'queued' },
      include: {
        guest: {
          include: {
            character: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
      take: 10, // Process in batches
    });

    for (const emailEvent of emailEvents) {
      try {
        await processEmailEvent(emailEvent);
        
        // Mark as sent
        await prisma.emailEvent.update({
          where: { id: emailEvent.id },
          data: { status: 'sent' },
        });
        
        console.log(`Email sent successfully for event ${emailEvent.id}`);
      } catch (error) {
        console.error(`Error processing email event ${emailEvent.id}:`, error);
        
        // Mark as failed
        await prisma.emailEvent.update({
          where: { id: emailEvent.id },
          data: { 
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        });
      }
    }
  } catch (error) {
    console.error('Error processing email queue:', error);
  }
}

async function processEmailEvent(emailEvent) {
  const { guest } = emailEvent;
  
  switch (emailEvent.type) {
    case 'rsvp_received':
      await sendRSVPReceivedEmail(guest);
      break;
    case 'approved':
      await sendApprovalEmail(guest);
      break;
    case 'rejected':
      await sendRejectionEmail(guest);
      break;
    case 'character_assigned':
      await sendCharacterAssignedEmail(guest);
      break;
    default:
      throw new Error(`Unknown email type: ${emailEvent.type}`);
  }
}

async function sendRSVPReceivedEmail(guest) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1f2937, #7c3aed); color: white; padding: 20px; border-radius: 10px;">
      <h1 style="text-align: center; margin-bottom: 30px;">The Dark Lotus</h1>
      <h2 style="color: #e5e7eb;">RSVP Received!</h2>
      <p>Hi ${guest.legalName},</p>
      <p>Thank you for your RSVP to The Dark Lotus: A Halloween Murder Mystery! We've received your submission and will review it shortly.</p>
      <p>You'll receive another email within 24-48 hours with our decision and next steps.</p>
      <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Event Details:</h3>
        <p><strong>Date:</strong> November 1st, 2025</p>
        <p><strong>Time:</strong> 8:00 PM - 12:00 AM</p>
        <p><strong>Location:</strong> [Venue TBD]</p>
      </div>
      <p>If you have any questions, please don't hesitate to contact us.</p>
      <p>Best regards,<br>The Dark Lotus Team</p>
    </div>
  `;

  await resend.emails.send({
    from: EMAIL_FROM,
    to: guest.email,
    subject: 'RSVP Received - The Dark Lotus Murder Mystery',
    html,
  });
}

async function sendApprovalEmail(guest) {
  const guestPortalUrl = `${APP_BASE_URL}/guest/${guest.token}`;
  const calendarLinks = generateCalendarLinks();
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1f2937, #7c3aed); color: white; padding: 20px; border-radius: 10px;">
      <h1 style="text-align: center; margin-bottom: 30px;">The Dark Lotus</h1>
      <h2 style="color: #10b981;">You're In!</h2>
      <p>Hi ${guest.legalName},</p>
      <p>Great news! Your RSVP has been approved for The Dark Lotus: A Halloween Murder Mystery!</p>
      <p>We're excited to have you join us for this thrilling evening of mystery and intrigue.</p>
      <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Event Details:</h3>
        <p><strong>Date:</strong> November 1st, 2025</p>
        <p><strong>Time:</strong> 8:00 PM - 12:00 AM</p>
        <p><strong>Location:</strong> ${REAL_ADDRESS}</p>
        <p><strong>Dress Code:</strong> Costumes encouraged!</p>
      </div>
      
      <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #a855f7;">📅 Add to Calendar</h3>
        <p style="margin-bottom: 15px;">Click below to add this event to your calendar:</p>
        <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
          <a href="${calendarLinks.google}" style="background: #4285f4; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; font-size: 14px;">
            📅 Google Calendar
          </a>
          <a href="${calendarLinks.outlook}" style="background: #0078d4; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; font-size: 14px;">
            📅 Outlook
          </a>
          <a href="${calendarLinks.yahoo}" style="background: #6001d2; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; font-size: 14px;">
            📅 Yahoo Calendar
          </a>
        </div>
        <p style="margin-top: 15px; font-size: 12px; color: #d1d5db;">
          Or download the <a href="data:text/calendar;charset=utf8,${encodeURIComponent(calendarLinks.ics)}" style="color: #a855f7;">ICS file</a> to import into any calendar app.
        </p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${guestPortalUrl}" style="background: #7c3aed; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
          View Your Guest Portal
        </a>
      </div>
      <p>Your character assignment will be sent to you soon. Keep an eye on your email!</p>
      <p>If you have any questions, please don't hesitate to contact us.</p>
      <p>Best regards,<br>The Dark Lotus Team</p>
    </div>
  `;

  await resend.emails.send({
    from: EMAIL_FROM,
    to: guest.email,
    subject: 'You\'re In: Dark Lotus Murder Mystery - Event Details Inside!',
    html,
  });
}

async function sendRejectionEmail(guest) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1f2937, #7c3aed); color: white; padding: 20px; border-radius: 10px;">
      <h1 style="text-align: center; margin-bottom: 30px;">The Dark Lotus</h1>
      <h2 style="color: #e5e7eb;">RSVP Update</h2>
      <p>Hi ${guest.legalName},</p>
      <p>Thank you for your interest in The Dark Lotus: A Halloween Murder Mystery.</p>
      <p>Unfortunately, we're unable to accommodate your RSVP at this time due to capacity constraints.</p>
      <p>We appreciate your understanding and hope you'll consider joining us for future events.</p>
      <p>If you have any questions, please don't hesitate to contact us.</p>
      <p>Best regards,<br>The Dark Lotus Team</p>
    </div>
  `;

  await resend.emails.send({
    from: EMAIL_FROM,
    to: guest.email,
    subject: 'RSVP Update - The Dark Lotus Murder Mystery',
    html,
  });
}

async function sendCharacterAssignedEmail(guest) {
  const guestPortalUrl = `${APP_BASE_URL}/guest/${guest.token}`;
  const character = guest.character;
  const calendarLinks = generateCalendarLinks();
  
  if (!character) {
    throw new Error('Character not found for guest');
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1f2937, #7c3aed); color: white; padding: 20px; border-radius: 10px;">
      <h1 style="text-align: center; margin-bottom: 30px;">The Dark Lotus</h1>
      <h2 style="color: #a855f7;">Your Character is Ready!</h2>
      <p>Hi ${guest.legalName},</p>
      <p>Your character assignment for The Dark Lotus Murder Mystery is ready!</p>
      <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #a855f7;">Meet ${character.displayName}</h3>
        <div style="margin: 15px 0;">
          ${Object.entries(character.traits).map(([key, value]) => 
            `<p><strong style="color: #e5e7eb;">${key}:</strong> ${value}</p>`
          ).join('')}
        </div>
      </div>
      
      <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Event Details:</h3>
        <p><strong>Date:</strong> November 1st, 2025</p>
        <p><strong>Time:</strong> 8:00 PM - 12:00 AM</p>
        <p><strong>Location:</strong> ${REAL_ADDRESS}</p>
        <p><strong>Dress Code:</strong> Costumes encouraged!</p>
      </div>
      
      <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #a855f7;">📅 Add to Calendar</h3>
        <p style="margin-bottom: 15px;">Click below to add this event to your calendar:</p>
        <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
          <a href="${calendarLinks.google}" style="background: #4285f4; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; font-size: 14px;">
            📅 Google Calendar
          </a>
          <a href="${calendarLinks.outlook}" style="background: #0078d4; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; font-size: 14px;">
            📅 Outlook
          </a>
          <a href="${calendarLinks.yahoo}" style="background: #6001d2; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; font-size: 14px;">
            📅 Yahoo Calendar
          </a>
        </div>
        <p style="margin-top: 15px; font-size: 12px; color: #d1d5db;">
          Or download the <a href="data:text/calendar;charset=utf8,${encodeURIComponent(calendarLinks.ics)}" style="color: #a855f7;">ICS file</a> to import into any calendar app.
        </p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${guestPortalUrl}" style="background: #7c3aed; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
          View Full Character Details
        </a>
      </div>
      <p>Study your character carefully and get ready to bring them to life on November 1st!</p>
      <p>If you have any questions about your character or the event, please don't hesitate to contact us.</p>
      <p>Best regards,<br>The Dark Lotus Team</p>
    </div>
  `;

  await resend.emails.send({
    from: EMAIL_FROM,
    to: guest.email,
    subject: 'Your Character is Ready - The Dark Lotus',
    html,
  });
}

// Main worker loop
async function main() {
  console.log('Starting email worker...');
  
  // Process emails every 30 seconds
  setInterval(async () => {
    await processEmailQueue();
  }, 30000);
  
  // Also process immediately on startup
  await processEmailQueue();
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down email worker...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down email worker...');
  await prisma.$disconnect();
  process.exit(0);
});

main().catch((error) => {
  console.error('Email worker error:', error);
  process.exit(1);
});
