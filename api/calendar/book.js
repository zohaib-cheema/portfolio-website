/**
 * API endpoint to book a calendar slot
 * POST /api/calendar/book
 */

import { sql } from '@vercel/postgres';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { slotId, name, email, meetingType, notes } = req.body;

    // Validate required fields
    if (!slotId || !name || !email || !meetingType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Atomic database operation - only update if still available
    const result = await sql`
      UPDATE slots 
      SET 
        available = false,
        booked_by = ${name},
        booked_email = ${email},
        meeting_type = ${meetingType},
        notes = ${notes || null},
        booked_at = NOW()
      WHERE id = ${slotId} AND available = true
      RETURNING 
        id,
        date,
        time,
        datetime,
        meeting_type as "meetingType"
    `;

    if (result.rows.length === 0) {
      return res.status(409).json({ error: 'This slot has already been booked or does not exist' });
    }

    const bookedSlot = result.rows[0];

    // Send confirmation emails
    let emailErrors = [];
    
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not set - emails will not be sent');
      emailErrors.push('RESEND_API_KEY not configured');
    } else {
      try {
        const emailDate = new Date(bookedSlot.datetime);
        const formattedDate = emailDate.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        const formattedTime = emailDate.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        });

        // Get Zoom link from environment variable
        const zoomLink = process.env.ZOOM_LINK || '';

        // Use Resend's default domain if custom domain isn't verified
        // For production, verify your domain in Resend and use: noreply@zohaibcheema.com
        // For testing, use: onboarding@resend.dev (works without domain verification)
        const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';

        // Send confirmation to the attendee
        try {
          const attendeeResult = await resend.emails.send({
            from: `Zohaib Cheema <${fromEmail}>`,
            to: email,
            subject: `Meeting Confirmed: ${formattedDate} at ${formattedTime}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Meeting Confirmed!</h2>
                <p>Hi ${name},</p>
                <p>Your meeting with Zohaib has been confirmed:</p>
                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p><strong>Date:</strong> ${formattedDate}</p>
                  <p><strong>Time:</strong> ${formattedTime}</p>
                  <p><strong>Type:</strong> ${meetingType}</p>
                  ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
                  ${zoomLink ? `
                    <p style="margin-top: 15px;"><strong>Zoom Link:</strong></p>
                    <p><a href="${zoomLink}" style="color: #0066ff; text-decoration: none; word-break: break-all;">${zoomLink}</a></p>
                  ` : ''}
                </div>
                <p>We look forward to speaking with you!</p>
                <p>Best regards,<br>Zohaib Cheema</p>
              </div>
            `,
          });
          console.log('Attendee email sent successfully:', attendeeResult);
        } catch (attendeeEmailError) {
          const errorMsg = `Error sending confirmation email to attendee (${email}): ${attendeeEmailError.message || attendeeEmailError}`;
          console.error(errorMsg, attendeeEmailError);
          emailErrors.push(errorMsg);
        }

        // Send notification to Zohaib
        const yourEmail = process.env.YOUR_EMAIL || 'zohaib.s.cheema9@gmail.com';
        try {
          const yourEmailResult = await resend.emails.send({
            from: `Portfolio Bot <${fromEmail}>`,
            to: yourEmail,
            subject: `New Meeting Booking: ${formattedDate} at ${formattedTime}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">New Meeting Booking</h2>
                <p>Hi Zohaib,</p>
                <p>Someone has booked a meeting with you:</p>
                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Date:</strong> ${formattedDate}</p>
                  <p><strong>Time:</strong> ${formattedTime}</p>
                  <p><strong>Type:</strong> ${meetingType}</p>
                  ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
                  ${zoomLink ? `
                    <p style="margin-top: 15px;"><strong>Zoom Link:</strong></p>
                    <p><a href="${zoomLink}" style="color: #0066ff; text-decoration: none; word-break: break-all;">${zoomLink}</a></p>
                  ` : ''}
                </div>
              </div>
            `,
          });
          console.log('Notification email sent successfully to Zohaib:', yourEmailResult);
        } catch (yourEmailError) {
          const errorMsg = `Error sending notification email to Zohaib (${yourEmail}): ${yourEmailError.message || yourEmailError}`;
          console.error(errorMsg, yourEmailError);
          emailErrors.push(errorMsg);
        }
      } catch (emailError) {
        const errorMsg = `General email error: ${emailError.message || emailError}`;
        console.error(errorMsg, emailError);
        emailErrors.push(errorMsg);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Booking confirmed',
      booking: {
        slotId: bookedSlot.id,
        date: bookedSlot.date,
        time: bookedSlot.time,
        datetime: bookedSlot.datetime,
        meetingType: bookedSlot.meetingType
      }
    });
  } catch (error) {
    console.error('Error booking slot:', error);
    res.status(500).json({ error: 'Failed to book slot' });
  }
}

