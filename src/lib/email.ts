import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const APP_BASE_URL = process.env.APP_BASE_URL || 'https://mm.saveoj.us';
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
      <h2 style="color: #10b981;">Plot Twist: You're Actually Invited (Against Our Better Judgment)</h2>
      <p>Hey ${guest.legalName},</p>
      <p>Surprise! Your RSVP didn't get lost in our digital void. You're officially invited to The Black Lotus Murder Mystery - which is great because we already bought snacks and it would be wasteful to throw them away.</p>
      
      <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Event Details:</h3>
        <p><strong>Date:</strong> November 1st, 2025 (mark your calendar or don't, we're not your mom)</p>
        <p><strong>Time:</strong> 8:00 PM - 12:00 AM</p>
        <p><strong>Location:</strong> ${REAL_ADDRESS} (GPS exists for a reason)</p>
        <p><strong>Dress Code:</strong> Costumes encouraged (or required, depending on how much we like your outfit)</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${guestPortalUrl}" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin-right: 10px;">
          View Your Guest Portal
        </a>
      </div>
      
      <div style="text-align: center; margin: 20px 0;">
        <h4 style="margin-bottom: 15px; color: #f59e0b;">📅 Add to Calendar:</h4>
        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; align-items: center;">
          <a href="${googleCalendarUrl}" style="background: #4285f4; color: white; padding: 12px 18px; text-decoration: none; border-radius: 6px; font-size: 14px; display: inline-block; margin: 5px;">
            📅 Google Calendar
          </a>
          <a href="${outlookUrl}" style="background: #0078d4; color: white; padding: 12px 18px; text-decoration: none; border-radius: 6px; font-size: 14px; display: inline-block; margin: 5px;">
            📅 Outlook
          </a>
          <a href="${appleCalendarUrl}" style="background: #007aff; color: white; padding: 12px 18px; text-decoration: none; border-radius: 6px; font-size: 14px; display: inline-block; margin: 5px;">
            📅 Apple Calendar
          </a>
        </div>
      </div>
      
      <p>In your guest portal, you can:</p>
      <ul>
        <li>View your character assignment (coming soon to a theater near you)</li>
        <li>Update your RSVP details (because people change their minds like they change their socks)</li>
        <li>Get the latest event information (spoiler: it's still happening)</li>
      </ul>
      
      <p>Questions? Concerns? Existential dread about attending a murder mystery? Check out our <a href="${APP_BASE_URL}/faq" style="color: #f59e0b; text-decoration: underline;">FAQ page</a> for answers to the most common questions (and some uncommon ones too). We're here for you, but we're not thrilled about it.</p>
      <p>Best regards,<br>BrO-J & Half-Chai</p>
      <p style="font-size: 12px; color: #9ca3af;">(P.S. - The murder is fictional. The mystery is real. You're still annoying.)</p>
    </div>
  `;

  const plainText = `The Black Lotus
Plot Twist: You're Actually Invited (Against Our Better Judgment)

Hey ${guest.legalName},

Surprise! Your RSVP didn't get lost in our digital void. You're officially invited to The Black Lotus Murder Mystery - which is great because we already bought snacks and it would be wasteful to throw them away.

Event Details:
• Date: November 1st, 2025 (mark your calendar or don't, we're not your mom)
• Time: 8:00 PM - 12:00 AM
• Location: ${REAL_ADDRESS} (GPS exists for a reason)
• Dress Code: Costumes encouraged (or required, depending on how much we like your outfit)

View Your Guest Portal: ${guestPortalUrl}

Add to Calendar:
• Google Calendar: ${googleCalendarUrl}
• Outlook: ${outlookUrl}
• Apple Calendar: ${appleCalendarUrl}

In your guest portal, you can:
• View your character assignment (coming soon to a theater near you)
• Update your RSVP details (because people change their minds like they change their socks)
• Get the latest event information (spoiler: it's still happening)

Questions? Concerns? Existential dread about attending a murder mystery? Check out our FAQ page at ${APP_BASE_URL}/faq for answers to the most common questions (and some uncommon ones too). We're here for you, but we're not thrilled about it.

Best regards,
BrO-J & Half-Chai

(P.S. - The murder is fictional. The mystery is real. You're still annoying.)`;

  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: guest.email,
      subject: 'RSVP Approved - The Black Lotus Murder Mystery',
      html,
    });
    console.log(`Approval email sent to ${guest.email}`);
    
    return {
      success: true,
      emailId: result.data?.id,
      subject: 'RSVP Approved - The Black Lotus Murder Mystery',
      plainTextContent: plainText
    };
  } catch (error) {
    console.error(`Error sending approval email to ${guest.email}:`, error);
    throw error;
  }
}

export async function sendRSVPConfirmationEmail(guest: any) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1f2937, #7c3aed); color: white; padding: 20px; border-radius: 10px;">
      <h1 style="text-align: center; margin-bottom: 30px;">The Black Lotus</h1>
      <h2 style="color: #e5e7eb;">RSVP Received - Don't Get Too Excited</h2>
      <p>Hi ${guest.legalName},</p>
      <p>We got your RSVP. Congratulations on successfully clicking a button - it's harder than it looks for some people.</p>
      <p>We'll review it when we feel like it. Or maybe we won't. Time is relative when you're planning a murder mystery and dealing with people who can't even fill out forms properly.</p>
      <p>If you have questions, keep them to yourself. We're not your personal assistants.</p>
      <p>Whatever,<br>BrO-J & Half-Chai</p>
      <p style="font-size: 12px; color: #9ca3af;">(P.S. - We're not actually murderers. Probably.)</p>
    </div>
  `;

  const plainText = `The Black Lotus
RSVP Received - Don't Get Too Excited

Hi ${guest.legalName},

We got your RSVP. Congratulations on successfully clicking a button - it's harder than it looks for some people.

We'll review it when we feel like it. Or maybe we won't. Time is relative when you're planning a murder mystery and dealing with people who can't even fill out forms properly.

If you have questions, keep them to yourself. We're not your personal assistants.

Whatever,
BrO-J & Half-Chai

(P.S. - We're not actually murderers. Probably.)`;

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
    
    return {
      success: true,
      emailId: result.data.id,
      subject: 'RSVP Received - The Black Lotus Murder Mystery',
      plainTextContent: plainText
    };
  } catch (error) {
    console.error(`Error sending RSVP confirmation email to ${guest.email}:`, error);
    throw error;
  }
}

export async function sendRejectionEmail(guest: any) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1f2937, #7c3aed); color: white; padding: 20px; border-radius: 10px;">
      <h1 style="text-align: center; margin-bottom: 30px;">The Black Lotus</h1>
      <h2 style="color: #e5e7eb;">Your RSVP Status: Declined (As Expected)</h2>
      <p>Dear ${guest.legalName},</p>
      <p>We regret to inform you that your RSVP for The Black Lotus Murder Mystery has been declined. The event has reached its capacity limit, much like a cemetery on a busy day.</p>
      <p>While we appreciate your interest in our macabre gathering, we cannot accommodate additional guests. Perhaps you can find solace in the darkness elsewhere, or plan your own murder mystery party (though we doubt you'd be capable of organizing anything more complex than a grocery list).</p>
      <p>Should you have questions about this decision, feel free to inquire. We maintain records of all rejected applications, should circumstances change (though we sincerely hope they don't).</p>
      <p>Sincerely,<br>The Black Lotus Team</p>
      <p style="font-size: 12px; color: #9ca3af;">(P.S. - We keep your information on file in case someone mysteriously disappears before the event. You're our backup plan.)</p>
    </div>
  `;

  const plainText = `The Black Lotus
Your RSVP Status: Declined (As Expected)

Dear ${guest.legalName},

We regret to inform you that your RSVP for The Black Lotus Murder Mystery has been declined. The event has reached its capacity limit, much like a cemetery on a busy day.

While we appreciate your interest in our macabre gathering, we cannot accommodate additional guests. Perhaps you can find solace in the darkness elsewhere, or plan your own murder mystery party (though we doubt you'd be capable of organizing anything more complex than a grocery list).

Should you have questions about this decision, feel free to inquire. We maintain records of all rejected applications, should circumstances change (though we sincerely hope they don't).

Sincerely,
The Black Lotus Team

(P.S. - We keep your information on file in case someone mysteriously disappears before the event. You're our backup plan.)`;

  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: guest.email,
      subject: 'RSVP Update - The Black Lotus Murder Mystery',
      html,
    });
    console.log(`Rejection email sent to ${guest.email}`);
    
    return {
      success: true,
      emailId: result.data?.id,
      subject: 'RSVP Update - The Black Lotus Murder Mystery',
      plainTextContent: plainText
    };
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
        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; align-items: center;">
          <a href="${googleCalendarUrl}" style="background: #4285f4; color: white; padding: 12px 18px; text-decoration: none; border-radius: 6px; font-size: 14px; display: inline-block; margin: 5px;">
            📅 Google Calendar
          </a>
          <a href="${outlookUrl}" style="background: #0078d4; color: white; padding: 12px 18px; text-decoration: none; border-radius: 6px; font-size: 14px; display: inline-block; margin: 5px;">
            📅 Outlook
          </a>
          <a href="${appleCalendarUrl}" style="background: #007aff; color: white; padding: 12px 18px; text-decoration: none; border-radius: 6px; font-size: 14px; display: inline-block; margin: 5px;">
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

  const plainText = `The Black Lotus
Message from the Hosts

${subject}

${message}

Visit Your Guest Portal: ${guestPortalUrl}

Add Event to Calendar:
• Google Calendar: ${googleCalendarUrl}
• Outlook: ${outlookUrl}
• Apple Calendar: ${appleCalendarUrl}

This message was sent to all guests of The Black Lotus Murder Mystery event.

Best regards,
BrO-J & Half-Chai`;

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
    
    return {
      success: true,
      subject: `The Black Lotus: ${subject}`,
      plainTextContent: plainText
    };
  } catch (error) {
    console.error(`Error sending bulk email to ${guests.length} guests:`, error);
    throw error;
  }
}

export async function sendCancellationEmail(guest: any) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1f2937, #7c3aed); color: white; padding: 20px; border-radius: 10px;">
      <h1 style="text-align: center; margin-bottom: 30px;">The Black Lotus</h1>
      <h2 style="color: #ef4444;">Registration Cancelled - Good Riddance</h2>
      <p>Hey ${guest.legalName},</p>
      <p>Your registration for The Black Lotus: A Halloween Murder Mystery has been successfully cancelled. We're not surprised you couldn't handle the commitment.</p>
      
      <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #ef4444;">What This Means:</h3>
        <p>You're officially out of our murder mystery. No more emails, no more character assignments, no more pretending you're interesting enough for our event.</p>
        <p>We're honestly relieved. One less person to worry about disappointing us on the night of the event.</p>
        <p>Your spot has been freed up for someone who actually has the backbone to follow through with their commitments.</p>
      </div>
      
      <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h4 style="margin-top: 0; color: #f59e0b;">If You Change Your Mind (We Doubt You Will):</h4>
        <p>You can try to re-register, but honestly, we're not holding our breath. Once a quitter, always a quitter.</p>
        <p>Just know that if you do come crawling back, we'll remember this little display of cowardice.</p>
      </div>
      
      <p>Thanks for wasting our time and proving our low expectations of you were correct.</p>
      <p>Best regards,<br>BrO-J & Half-Chai</p>
      <p style="font-size: 12px; color: #9ca3af;">(P.S. - Don't worry, we'll find someone more interesting to fill your spot. It won't be hard.)</p>
    </div>
  `;

  const plainText = `The Black Lotus
Registration Cancelled - Good Riddance

Hey ${guest.legalName},

Your registration for The Black Lotus: A Halloween Murder Mystery has been successfully cancelled. We're not surprised you couldn't handle the commitment.

What This Means:
• You're officially out of our murder mystery. No more emails, no more character assignments, no more pretending you're interesting enough for our event.
• We're honestly relieved. One less person to worry about disappointing us on the night of the event.
• Your spot has been freed up for someone who actually has the backbone to follow through with their commitments.

If You Change Your Mind (We Doubt You Will):
• You can try to re-register, but honestly, we're not holding our breath. Once a quitter, always a quitter.
• Just know that if you do come crawling back, we'll remember this little display of cowardice.

Thanks for wasting our time and proving our low expectations of you were correct.

Best regards,
BrO-J & Half-Chai

(P.S. - Don't worry, we'll find someone more interesting to fill your spot. It won't be hard.)`;

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: guest.email,
      subject: 'Registration Cancelled - Good Riddance',
      html,
    });
    console.log(`Cancellation email sent to ${guest.email}`);
  } catch (error) {
    console.error(`Error sending cancellation email to ${guest.email}:`, error);
    throw error;
  }
}

export async function sendCharacterAssignedEmail(guest: any) {
  const guestPortalUrl = `${APP_BASE_URL}/guest/${guest.token}`;
  const character = guest.character;
  
  if (!character) {
    throw new Error('Character not found for guest');
  }

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
      <h2 style="color: #a855f7;">Your Character Assignment</h2>
      <p>Hi ${guest.legalName},</p>
      <p>Thank you for joining The Black Lotus Murder Mystery! We're excited to have you participate in this immersive experience.</p>
      
      <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #a855f7;">Character Details:</h3>
        <p><strong>Name:</strong> ${character.displayName}</p>
        <p><strong>Background:</strong> ${character.traits.backstory}</p>
      </div>
      
      <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Event Details:</h3>
        <p><strong>Date:</strong> November 1st, 2025</p>
        <p><strong>Time:</strong> 8:00 PM - 12:00 AM</p>
        <p><strong>Location:</strong> ${REAL_ADDRESS}</p>
        <p><strong>Dress Code:</strong> Costumes encouraged!</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${guestPortalUrl}" style="background: #a855f7; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin-right: 10px;">
          View Your Guest Portal
        </a>
        <a href="${APP_BASE_URL}/guest-list/${guest.token}" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
          View Guest List
        </a>
      </div>
      
      <div style="text-align: center; margin: 20px 0;">
        <h4 style="margin-bottom: 15px; color: #f59e0b;">📅 Add to Calendar:</h4>
        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; align-items: center;">
          <a href="${googleCalendarUrl}" style="background: #4285f4; color: white; padding: 12px 18px; text-decoration: none; border-radius: 6px; font-size: 14px; display: inline-block; margin: 5px;">
            📅 Google Calendar
          </a>
          <a href="${outlookUrl}" style="background: #0078d4; color: white; padding: 12px 18px; text-decoration: none; border-radius: 6px; font-size: 14px; display: inline-block; margin: 5px;">
            📅 Outlook
          </a>
          <a href="${appleCalendarUrl}" style="background: #007aff; color: white; padding: 12px 18px; text-decoration: none; border-radius: 6px; font-size: 14px; display: inline-block; margin: 5px;">
            📅 Apple Calendar
          </a>
        </div>
      </div>
      
      <p>We look forward to seeing you there!</p>
      <p>Best regards,<br>BrO-J & Half-Chai</p>
    </div>
  `;

  const plainText = `The Black Lotus
Your Character Assignment

Hi ${guest.legalName},

Thank you for joining The Black Lotus Murder Mystery! We're excited to have you participate in this immersive experience.

Character Details:
• Name: ${character.displayName}
• Background: ${character.traits.backstory}

Event Details:
• Date: November 1st, 2025
• Time: 8:00 PM - 12:00 AM
• Location: ${REAL_ADDRESS}
• Dress Code: Costumes encouraged!

View Your Guest Portal: ${guestPortalUrl}
View Guest List: ${APP_BASE_URL}/guest-list/${guest.token}

Add to Calendar:
• Google Calendar: ${googleCalendarUrl}
• Outlook: ${outlookUrl}
• Apple Calendar: ${appleCalendarUrl}

We look forward to seeing you there!

Best regards,
BrO-J & Half-Chai`;

  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: guest.email,
      subject: 'Your Character Assignment - The Black Lotus Murder Mystery',
      html,
    });
    console.log(`Character assignment email sent to ${guest.email}`);
    
    return {
      success: true,
      emailId: result.data?.id,
      subject: 'Your Character Assignment - The Black Lotus Murder Mystery',
      plainTextContent: plainText
    };
  } catch (error) {
    console.error(`Error sending character assignment email to ${guest.email}:`, error);
    throw error;
  }
}

export async function sendCharacterUpdatedEmail(guest: any) {
  const guestPortalUrl = `${APP_BASE_URL}/guest/${guest.token}`;
  const character = guest.character;
  
  if (!character) {
    throw new Error('Character not found for guest');
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1f2937, #7c3aed); color: white; padding: 20px; border-radius: 10px;">
      <h1 style="text-align: center; margin-bottom: 30px;">The Black Lotus</h1>
      <h2 style="color: #f59e0b;">Character Details Updated - Because You Probably Messed Up</h2>
      <p>Hey ${guest.legalName},</p>
      <p>Your character details have been updated! Because apparently, you couldn't handle the original assignment.</p>
      
      <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #f59e0b;">Updated Character: ${character.displayName}</h3>
        <p><strong>Background:</strong> ${character.traits.backstory}</p>
        <p><strong>Your Role:</strong> Try to act like you belong here (still)</p>
      </div>
      
      <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h4 style="margin-top: 0; color: #f59e0b;">Changes Made:</h4>
        <ul style="margin: 0; padding-left: 20px;">
          <li>We fixed your character because you probably would have ruined it</li>
          <li>Updated the backstory because the original was too complex for you</li>
          <li>Simplified everything because we don't trust you with anything complicated</li>
        </ul>
      </div>
      
      <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Event Details:</h3>
        <p><strong>Date:</strong> November 1st, 2025 (still the same date, still not changing)</p>
        <p><strong>Time:</strong> 8:00 PM - 12:00 AM (still your life we're wasting)</p>
        <p><strong>Location:</strong> ${REAL_ADDRESS} (still the same place, still not moving)</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${guestPortalUrl}" style="background: #7c3aed; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
          View Updated Character Details
        </a>
      </div>
      
      <p>Please review the updated character information and try not to mess it up this time.</p>
      <p>Questions? Concerns? Existential dread about your inability to handle simple tasks? We're here for you, but we're not happy about it.</p>
      <p>Best regards,<br>BrO-J & Half-Chai</p>
      <p style="font-size: 12px; color: #9ca3af;">(P.S. - The character is fictional. The mystery is real. Your incompetence is legendary.)</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: guest.email,
      subject: 'Character Details Updated - Because You Probably Messed Up',
      html,
    });
    console.log(`Character updated email sent to ${guest.email}`);
  } catch (error) {
    console.error(`Error sending character updated email to ${guest.email}:`, error);
    throw error;
  }
}

export async function sendCharacterRemovedEmail(guest: any) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1f2937, #7c3aed); color: white; padding: 20px; border-radius: 10px;">
      <h1 style="text-align: center; margin-bottom: 30px;">The Black Lotus</h1>
      <h2 style="color: #ef4444;">Character Assignment Removed - You Probably Deserved It</h2>
      <p>Hi ${guest.legalName},</p>
      <p>Your character assignment for The Black Lotus Murder Mystery has been removed. You probably deserved it.</p>
      
      <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #ef4444;">What This Means:</h3>
        <p>This may be due to changes in the event planning or character assignments. Or maybe we just realized you're not cut out for this.</p>
        <p>You may receive a new character assignment soon. Or maybe you won't. We'll see how we feel about it.</p>
        <p>Don't worry - you're still invited to the event! We're just adjusting the character assignments because apparently, you couldn't handle the responsibility.</p>
      </div>
      
      <p>If you have any questions about this change, feel free to ask. We probably won't answer them, but you can try.</p>
      <p>Best regards,<br>BrO-J & Half-Chai</p>
      <p style="font-size: 12px; color: #9ca3af;">(P.S. - Maybe next time you'll be more careful with your character assignment. Or maybe not.)</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: guest.email,
      subject: 'Character Assignment Removed - You Probably Deserved It',
      html,
    });
    console.log(`Character removed email sent to ${guest.email}`);
  } catch (error) {
    console.error(`Error sending character removed email to ${guest.email}:`, error);
    throw error;
  }
}

export async function sendCancellationNotificationEmail(guest: any) {
  const adminUrl = `${APP_BASE_URL}/admin`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1f2937, #7c3aed); color: white; padding: 20px; border-radius: 10px;">
      <h1 style="text-align: center; margin-bottom: 30px;">The Black Lotus</h1>
      <h2 style="color: #f59e0b;">Registration Cancelled</h2>
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

// Reminder email functions
export async function sendOneWeekReminderEmail(guest: any) {
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
      <h2 style="color: #f59e0b;">One Week Warning - The Mystery Approaches (Prepare for Disappointment)</h2>
      <p>Dear ${guest.legalName},</p>
      <p>One week until The Black Lotus Murder Mystery. The anticipation builds like a storm before the inevitable chaos you'll bring.</p>
      
      <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Event Details:</h3>
        <p><strong>Date:</strong> November 1st, 2025 (that's next week, in case you forgot)</p>
        <p><strong>Time:</strong> 8:00 PM - 12:00 AM (prime time for mystery and mayhem)</p>
        <p><strong>Location:</strong> ${REAL_ADDRESS} (still the same place, still not moving)</p>
        <p><strong>Dress Code:</strong> Costumes encouraged! (seriously, don't be that person who shows up in jeans)</p>
      </div>
      
      <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h4 style="margin-top: 0; color: #f59e0b;">Preparation Tips:</h4>
        <ul style="margin: 0; padding-left: 20px;">
          <li>Start thinking about your costume (or panic-buy one on Amazon like the rest of us)</li>
          <li>Review any character information you've received (if you've received any)</li>
          <li>Plan your transportation (Uber, Lyft, or teleportation - your choice)</li>
          <li>Bring your mystery-solving skills (or at least bring snacks)</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${guestPortalUrl}" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
          View Your Guest Portal
        </a>
      </div>
      
      <div style="text-align: center; margin: 20px 0;">
        <h4 style="margin-bottom: 15px; color: #f59e0b;">📅 Add to Calendar:</h4>
        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; align-items: center;">
          <a href="${googleCalendarUrl}" style="background: #4285f4; color: white; padding: 12px 18px; text-decoration: none; border-radius: 6px; font-size: 14px; display: inline-block; margin: 5px;">
            📅 Google Calendar
          </a>
          <a href="${outlookUrl}" style="background: #0078d4; color: white; padding: 12px 18px; text-decoration: none; border-radius: 6px; font-size: 14px; display: inline-block; margin: 5px;">
            📅 Outlook
          </a>
          <a href="${appleCalendarUrl}" style="background: #007aff; color: white; padding: 12px 18px; text-decoration: none; border-radius: 6px; font-size: 14px; display: inline-block; margin: 5px;">
            📅 Apple Calendar
          </a>
        </div>
      </div>
      
      <p>We're getting excited to see you there! Or at least pretending to be excited while secretly hoping everyone shows up on time.</p>
      <p>Best regards,<br>BrO-J & Half-Chai</p>
      <p style="font-size: 12px; color: #9ca3af;">(P.S. - If you're running late, just say you were investigating a lead. We'll probably believe you.)</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: guest.email,
      subject: 'One Week Reminder - The Black Lotus Murder Mystery',
      html,
    });
    console.log(`One week reminder sent to ${guest.email}`);
  } catch (error) {
    console.error(`Error sending one week reminder to ${guest.email}:`, error);
    throw error;
  }
}

export async function sendTwoDayReminderEmail(guest: any) {
  const guestPortalUrl = `${APP_BASE_URL}/guest/${guest.token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1f2937, #7c3aed); color: white; padding: 20px; border-radius: 10px;">
      <h1 style="text-align: center; margin-bottom: 30px;">The Black Lotus</h1>
      <h2 style="color: #f59e0b;">🎃 Two Days to Go!</h2>
      <p>Hi ${guest.legalName},</p>
      <p>The Black Lotus: A Halloween Murder Mystery is just two days away! The excitement is building.</p>
      
      <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Final Details:</h3>
        <p><strong>Date:</strong> November 1st, 2025</p>
        <p><strong>Time:</strong> 8:00 PM - 12:00 AM</p>
        <p><strong>Location:</strong> ${REAL_ADDRESS}</p>
        <p><strong>Arrival:</strong> Please arrive between 7:45-8:00 PM</p>
      </div>
      
      <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h4 style="margin-top: 0; color: #f59e0b;">Last-Minute Checklist:</h4>
        <ul style="margin: 0; padding-left: 20px;">
          <li>Finalize your costume</li>
          <li>Check the weather forecast</li>
          <li>Plan your route to the venue</li>
          <li>Bring a valid ID</li>
          <li>Charge your phone (for photos!)</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${guestPortalUrl}" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
          View Your Guest Portal
        </a>
      </div>
      
      <p>We can't wait to see you there! Get ready for an unforgettable evening of mystery and intrigue.</p>
      <p>Best regards,<br>BrO-J & Half-Chai</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: guest.email,
      subject: 'Two Days to Go - The Black Lotus Murder Mystery',
      html,
    });
    console.log(`Two day reminder sent to ${guest.email}`);
  } catch (error) {
    console.error(`Error sending two day reminder to ${guest.email}:`, error);
    throw error;
  }
}

export async function sendOneDayReminderEmail(guest: any) {
  const guestPortalUrl = `${APP_BASE_URL}/guest/${guest.token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1f2937, #7c3aed); color: white; padding: 20px; border-radius: 10px;">
      <h1 style="text-align: center; margin-bottom: 30px;">The Black Lotus</h1>
      <h2 style="color: #f59e0b;">Tomorrow's the Big Night!</h2>
      <p>Hi ${guest.legalName},</p>
      <p>Tomorrow is the night! The Black Lotus: A Halloween Murder Mystery is finally here. We're so excited to see you!</p>
      
      <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Event Details:</h3>
        <p><strong>Date:</strong> November 1st, 2025 (TOMORROW!)</p>
        <p><strong>Time:</strong> 8:00 PM - 12:00 AM</p>
        <p><strong>Location:</strong> ${REAL_ADDRESS}</p>
        <p><strong>Arrival:</strong> Please arrive between 7:45-8:00 PM</p>
      </div>
      
      <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h4 style="margin-top: 0; color: #f59e0b;">🎃 Tonight's Preparation:</h4>
        <ul style="margin: 0; padding-left: 20px;">
          <li>Lay out your costume</li>
          <li>Check your route and traffic</li>
          <li>Get a good night's sleep</li>
          <li>Prepare your mystery-solving mindset</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${guestPortalUrl}" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
          View Your Guest Portal
        </a>
      </div>
      
      <p style="text-align: center; font-size: 18px; color: #f59e0b; font-weight: bold;">
        See you tomorrow night for an unforgettable evening of mystery and intrigue!
      </p>
      <p>Best regards,<br>BrO-J & Half-Chai</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: guest.email,
      subject: 'Tomorrow\'s the Big Night - The Black Lotus Murder Mystery',
      html,
    });
    console.log(`One day reminder sent to ${guest.email}`);
  } catch (error) {
    console.error(`Error sending one day reminder to ${guest.email}:`, error);
    throw error;
  }
}

export async function sendFiveHourReminderEmail(guest: any) {
  const guestPortalUrl = `${APP_BASE_URL}/guest/${guest.token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1f2937, #7c3aed); color: white; padding: 20px; border-radius: 10px;">
      <h1 style="text-align: center; margin-bottom: 30px;">The Black Lotus</h1>
      <h2 style="color: #f59e0b;">🕐 Final Countdown!</h2>
      <p>Hi ${guest.legalName},</p>
      <p>Just 5 hours until The Black Lotus: A Halloween Murder Mystery begins! The mystery awaits...</p>
      
      <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Tonight's Event:</h3>
        <p><strong>Date:</strong> November 1st, 2025</p>
        <p><strong>Time:</strong> 8:00 PM - 12:00 AM</p>
        <p><strong>Location:</strong> ${REAL_ADDRESS}</p>
        <p><strong>Arrival:</strong> Please arrive between 7:45-8:00 PM</p>
      </div>
      
      <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h4 style="margin-top: 0; color: #f59e0b;">Final Preparations:</h4>
        <ul style="margin: 0; padding-left: 20px;">
          <li>Put on your costume</li>
          <li>Check traffic conditions</li>
          <li>Bring your ID</li>
          <li>Prepare for mystery and intrigue!</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${guestPortalUrl}" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
          View Your Guest Portal
        </a>
      </div>
      
      <p style="text-align: center; font-size: 20px; color: #f59e0b; font-weight: bold;">
        🎃 The mystery begins in just a few hours! 🎃
      </p>
      <p>Best regards,<br>BrO-J & Half-Chai</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: guest.email,
      subject: 'Final Countdown - The Black Lotus Murder Mystery',
      html,
    });
    console.log(`Five hour reminder sent to ${guest.email}`);
  } catch (error) {
    console.error(`Error sending five hour reminder to ${guest.email}:`, error);
    throw error;
  }
}
