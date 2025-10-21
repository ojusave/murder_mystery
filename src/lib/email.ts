import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const APP_BASE_URL = process.env.APP_BASE_URL || 'https://murder-mystery-zumz.onrender.com';
const EMAIL_FROM = process.env.EMAIL_FROM || 'Black Lotus <noreply@saveoj.us>';
const REAL_ADDRESS = process.env.REAL_ADDRESS || '40849 High Street, Fremont';

export async function sendApprovalEmail(guest: any) {
  const guestPortalUrl = `${APP_BASE_URL}/guest/${guest.token}`;
  
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
        <a href="${guestPortalUrl}" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
          View Your Guest Portal
        </a>
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
      <p>Best regards,<br>BrO-J</p>
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
