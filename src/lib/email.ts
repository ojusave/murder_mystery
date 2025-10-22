import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const APP_BASE_URL = process.env.APP_BASE_URL || 'https://murder-mystery-zumz.onrender.com';
const EMAIL_FROM = process.env.EMAIL_FROM || 'Black Lotus <noreply@saveoj.us>';
const REAL_ADDRESS = process.env.REAL_ADDRESS || '40849 High Street, Fremont';

export async function sendApprovalEmail(guest: any) {
  const guestPortalUrl = `${APP_BASE_URL}/guest/${guest.token}`;
  
  // Calendar event details
  const eventTitle = 'The Black Lotus: A Halloween Murder Mystery';
  const eventDate = '20251101';
  const startTime = '200000';
  const endTime = '000000';
  const eventDescription = 'Join us for an unforgettable evening of mystery and intrigue at The Black Lotus Halloween Murder Mystery Party!';
  
  // Calendar links
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${eventDate}T${startTime}/${eventDate}T${endTime}&details=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent(REAL_ADDRESS)}`;
  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(eventTitle)}&startdt=2025-11-01T20:00:00&enddt=2025-11-02T00:00:00&body=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent(REAL_ADDRESS)}`;
  const appleCalendarUrl = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ADTSTART:20251101T200000%0ADTEND:20251102T000000%0ASUMMARY:${encodeURIComponent(eventTitle)}%0ADESCRIPTION:${encodeURIComponent(eventDescription)}%0ALOCATION:${encodeURIComponent(REAL_ADDRESS)}%0AEND:VEVENT%0AEND:VCALENDAR`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1f2937, #7c3aed); color: white; padding: 20px; border-radius: 10px;">
      <h1 style="text-align: center; margin-bottom: 30px;">The Black Lotus</h1>
      <h2 style="color: #10b981;">🎉 RSVP Approved!</h2>
      <p>Hi ${guest.legalName},</p>
      <p>Great news! Your RSVP for The Black Lotus: A Halloween Murder Mystery has been approved!</p>
      <p>We're excited to have you join us for this unforgettable evening of mystery and intrigue.</p>
      
      <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Event Details:</h3>
        <p><strong>Date:</strong> November 1st, 2025</p>
        <p><strong>Time:</strong> 8:00 PM - 12:00 AM</p>
        <p><strong>Location:</strong> ${REAL_ADDRESS}</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${guestPortalUrl}" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin-right: 10px;">
          View Your Guest Portal
        </a>
      </div>
      
      <div style="text-align: center; margin: 20px 0;">
        <h4 style="margin-bottom: 15px; color: #f59e0b;">📅 Add to Calendar:</h4>
        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
          <a href="${googleCalendarUrl}" style="background: #4285f4; color: white; padding: 10px 15px; text-decoration: none; border-radius: 6px; font-size: 14px; display: inline-block;">
            📅 Google Calendar
          </a>
          <a href="${outlookUrl}" style="background: #0078d4; color: white; padding: 10px 15px; text-decoration: none; border-radius: 6px; font-size: 14px; display: inline-block;">
            📅 Outlook
          </a>
          <a href="${appleCalendarUrl}" style="background: #007aff; color: white; padding: 10px 15px; text-decoration: none; border-radius: 6px; font-size: 14px; display: inline-block;">
            📅 Apple Calendar
          </a>
        </div>
      </div>
      
      <p>In your guest portal, you can:</p>
      <ul>
        <li>View your character assignment (coming soon!)</li>
        <li>Update your RSVP details</li>
        <li>Get the latest event information</li>
      </ul>
      
      <p>If you have any questions, please don't hesitate to contact us.</p>
      <p>Best regards,<br>The Black Lotus Team</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: guest.email,
      subject: 'RSVP Approved - The Black Lotus Murder Mystery',
      html,
    });
    console.log(`Approval email sent to ${guest.email}`);
  } catch (error) {
    console.error(`Error sending approval email to ${guest.email}:`, error);
    throw error;
  }
}

export async function sendRSVPConfirmationEmail(guest: any) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1f2937, #7c3aed); color: white; padding: 20px; border-radius: 10px;">
      <h1 style="text-align: center; margin-bottom: 30px;">The Black Lotus</h1>
      <h2 style="color: #e5e7eb;">RSVP Received!</h2>
      <p>Hi ${guest.legalName},</p>
      <p>Thank you for your RSVP to The Black Lotus: A Halloween Murder Mystery! We've received your submission and will review it shortly.</p>
      <p>You'll receive another email within 24-48 hours with our decision and next steps.</p>
    
      
      <p>If you have any questions, please don't hesitate to contact us.</p>
      <p>Best regards,<br>BrO-J & Half-Chai</p>
    </div>
  `;

  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: guest.email,
      subject: 'RSVP Received - The Black Lotus Murder Mystery',
      html,
    });
    
    console.log(`RSVP confirmation email sent to ${guest.email}`);
    console.log('Resend API response:', result);
    
    // Check if the result indicates success
    if (result.error) {
      console.error('Resend API error:', result.error);
      throw new Error(`Resend API error: ${result.error.message || 'Unknown error'}`);
    }
    
    if (!result.data || !result.data.id) {
      console.error('Unexpected Resend response:', result);
      throw new Error('Unexpected response from Resend API');
    }
    
    console.log('Email sent successfully with ID:', result.data.id);
  } catch (error) {
    console.error(`Error sending RSVP confirmation email to ${guest.email}:`, error);
    throw error;
  }
}

export async function sendRejectionEmail(guest: any) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1f2937, #7c3aed); color: white; padding: 20px; border-radius: 10px;">
      <h1 style="text-align: center; margin-bottom: 30px;">The Black Lotus</h1>
      <h2 style="color: #e5e7eb;">RSVP Update</h2>
      <p>Hi ${guest.legalName},</p>
      <p>Thank you for your interest in The Black Lotus: A Halloween Murder Mystery.</p>
      <p>Unfortunately, we're unable to accommodate your RSVP at this time due to capacity constraints.</p>
      <p>We appreciate your understanding and hope you'll consider joining us for future events.</p>
      <p>If you have any questions, please don't hesitate to contact us.</p>
      <p>Best regards,<br>The Black Lotus Team</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: guest.email,
      subject: 'RSVP Update - The Black Lotus Murder Mystery',
      html,
    });
    console.log(`Rejection email sent to ${guest.email}`);
  } catch (error) {
    console.error(`Error sending rejection email to ${guest.email}:`, error);
    throw error;
  }
}

export async function sendHostNotificationEmail(guest: any) {
  const guestPortalUrl = `${APP_BASE_URL}/guest/${guest.token}`;
  const adminUrl = `${APP_BASE_URL}/admin`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1f2937, #7c3aed); color: white; padding: 20px; border-radius: 10px;">
      <h1 style="text-align: center; margin-bottom: 30px;">The Black Lotus</h1>
      <h2 style="color: #f59e0b;">🔔 New RSVP Received!</h2>
      <p>Hello Host,</p>
      <p>A new RSVP has been submitted for The Black Lotus: A Halloween Murder Mystery!</p>
      
      <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #f59e0b;">Guest Details:</h3>
        <p><strong>Name:</strong> ${guest.legalName}</p>
        <p><strong>Email:</strong> ${guest.email}</p>
        <p><strong>Costume Commitment:</strong> ${guest.willDressUp}</p>
        <p><strong>Character Preference:</strong> ${guest.charNameMode}</p>
        ${guest.charNameOther ? `<p><strong>Custom Character Name:</strong> ${guest.charNameOther}</p>` : ''}
        <p><strong>Submitted:</strong> ${guest.createdAt.toLocaleDateString()} at ${guest.createdAt.toLocaleTimeString()}</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${adminUrl}" style="background: #7c3aed; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin-right: 10px;">
          Review in Admin Panel
        </a>
        <a href="${guestPortalUrl}" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
          View Guest Portal
        </a>
      </div>
      
      <p style="font-size: 14px; color: #d1d5db;">
        This is an automated notification. Please review the RSVP in your admin panel to approve or reject the application.
      </p>
      
      <p>Best regards,<br>The Black Lotus System</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: 'delkajuer@gmail.com',
      subject: `New RSVP: ${guest.legalName} - The Black Lotus Murder Mystery`,
      html,
    });
    console.log(`Host notification email sent for ${guest.legalName} (${guest.email})`);
  } catch (error) {
    console.error(`Error sending host notification email for ${guest.email}:`, error);
    throw error;
  }
}

export async function sendBulkEmail(guests: any[], subject: string, message: string) {
  const guestPortalUrl = `${APP_BASE_URL}/guest`;
  
  // Calendar event details
  const eventTitle = 'The Black Lotus: A Halloween Murder Mystery';
  const eventDate = '20251101';
  const startTime = '200000';
  const endTime = '000000';
  const eventDescription = 'Join us for an unforgettable evening of mystery and intrigue at The Black Lotus Halloween Murder Mystery Party!';
  
  // Calendar links
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${eventDate}T${startTime}/${eventDate}T${endTime}&details=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent(REAL_ADDRESS)}`;
  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(eventTitle)}&startdt=2025-11-01T20:00:00&enddt=2025-11-02T00:00:00&body=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent(REAL_ADDRESS)}`;
  const appleCalendarUrl = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ADTSTART:20251101T200000%0ADTEND:20251102T000000%0ASUMMARY:${encodeURIComponent(eventTitle)}%0ADESCRIPTION:${encodeURIComponent(eventDescription)}%0ALOCATION:${encodeURIComponent(REAL_ADDRESS)}%0AEND:VEVENT%0AEND:VCALENDAR`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1f2937, #7c3aed); color: white; padding: 20px; border-radius: 10px;">
      <h1 style="text-align: center; margin-bottom: 30px;">The Black Lotus</h1>
      <h2 style="color: #e5e7eb;">Message from the Hosts</h2>
      
      <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #f59e0b;">${subject}</h3>
        <div style="white-space: pre-wrap; line-height: 1.6;">${message}</div>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${guestPortalUrl}" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
          Visit Your Guest Portal
        </a>
      </div>
      
      <div style="text-align: center; margin: 20px 0;">
        <h4 style="margin-bottom: 15px; color: #f59e0b;">📅 Add Event to Calendar:</h4>
        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
          <a href="${googleCalendarUrl}" style="background: #4285f4; color: white; padding: 10px 15px; text-decoration: none; border-radius: 6px; font-size: 14px; display: inline-block;">
            📅 Google Calendar
          </a>
          <a href="${outlookUrl}" style="background: #0078d4; color: white; padding: 10px 15px; text-decoration: none; border-radius: 6px; font-size: 14px; display: inline-block;">
            📅 Outlook
          </a>
          <a href="${appleCalendarUrl}" style="background: #007aff; color: white; padding: 10px 15px; text-decoration: none; border-radius: 6px; font-size: 14px; display: inline-block;">
            📅 Apple Calendar
          </a>
        </div>
      </div>
      
      <p style="font-size: 14px; color: #d1d5db;">
        This message was sent to all guests of The Black Lotus Murder Mystery event.
      </p>
      
      <p>Best regards,<br>BrO-J & Half-Chai</p>
    </div>
  `;

  try {
    // Send emails to all guests
    const emailPromises = guests.map(guest => 
      resend.emails.send({
        from: EMAIL_FROM,
        to: guest.email,
        subject: `The Black Lotus: ${subject}`,
        html,
      })
    );

    await Promise.all(emailPromises);
    console.log(`Bulk email sent to ${guests.length} guests`);
  } catch (error) {
    console.error(`Error sending bulk email to ${guests.length} guests:`, error);
    throw error;
  }
}

export async function sendCancellationEmail(guest: any) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1f2937, #7c3aed); color: white; padding: 20px; border-radius: 10px;">
      <h1 style="text-align: center; margin-bottom: 30px;">The Black Lotus</h1>
      <h2 style="color: #e5e7eb;">Registration Cancelled</h2>
      <p>Hi ${guest.legalName},</p>
      <p>Your registration for The Black Lotus: A Halloween Murder Mystery has been successfully cancelled.</p>
      <p>We're sorry you won't be able to join us for this event, but we understand that circumstances change.</p>
      <p>If you change your mind and would like to re-register, please visit our RSVP page again.</p>
      <p>Thank you for your interest in our event, and we hope to see you at future gatherings!</p>
      <p>Best regards,<br>BrO-J & Half-Chai</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: guest.email,
      subject: 'Registration Cancelled - The Black Lotus Murder Mystery',
      html,
    });
    console.log(`Cancellation email sent to ${guest.email}`);
  } catch (error) {
    console.error(`Error sending cancellation email to ${guest.email}:`, error);
    throw error;
  }
}

export async function sendCancellationNotificationEmail(guest: any) {
  const adminUrl = `${APP_BASE_URL}/admin`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1f2937, #7c3aed); color: white; padding: 20px; border-radius: 10px;">
      <h1 style="text-align: center; margin-bottom: 30px;">The Black Lotus</h1>
      <h2 style="color: #f59e0b;">🚫 Registration Cancelled</h2>
      <p>Hello Host,</p>
      <p>A guest has cancelled their registration for The Black Lotus: A Halloween Murder Mystery.</p>
      
      <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #f59e0b;">Cancelled Guest Details:</h3>
        <p><strong>Name:</strong> ${guest.legalName}</p>
        <p><strong>Email:</strong> ${guest.email}</p>
        <p><strong>Cancelled:</strong> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${adminUrl}" style="background: #7c3aed; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
          View in Admin Panel
        </a>
      </div>
      
      <p style="font-size: 14px; color: #d1d5db;">
        This is an automated notification. The guest has been notified of their cancellation.
      </p>
      
      <p>Best regards,<br>The Black Lotus System</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: 'delkajuer@gmail.com',
      subject: `Registration Cancelled: ${guest.legalName} - The Black Lotus Murder Mystery`,
      html,
    });
    console.log(`Cancellation notification email sent for ${guest.legalName} (${guest.email})`);
  } catch (error) {
    console.error(`Error sending cancellation notification email for ${guest.email}:`, error);
    throw error;
  }
}
