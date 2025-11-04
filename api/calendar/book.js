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
          const yourEmail = process.env.YOUR_EMAIL || 'zohaib.s.cheema9@gmail.com';
          const plainText = `Hi ${name},\n\nYour meeting with Zohaib has been confirmed:\n\nDate: ${formattedDate}\nTime: ${formattedTime}\nType: ${meetingType}${notes ? `\nNotes: ${notes}` : ''}${zoomLink ? `\n\nZoom Link: ${zoomLink}` : ''}\n\nI look forward to speaking with you!\n\nBest regards,\nZohaib Cheema`;

          const attendeeResult = await resend.emails.send({
            from: `Zohaib Cheema <${fromEmail}>`,
            replyTo: yourEmail,
            to: email,
            subject: `Meeting Confirmed: ${formattedDate} at ${formattedTime}`,
            text: plainText,
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #333; border-bottom: 2px solid #0066ff; padding-bottom: 10px;">Meeting Confirmed!</h2>
                <p>Hi ${name},</p>
                <p>Your meeting with Zohaib has been confirmed:</p>
                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0066ff;">
                  <p style="margin: 8px 0;"><strong>Date:</strong> ${formattedDate}</p>
                  <p style="margin: 8px 0;"><strong>Time:</strong> ${formattedTime}</p>
                  <p style="margin: 8px 0;"><strong>Type:</strong> ${meetingType}</p>
                  ${notes ? `<p style="margin: 8px 0;"><strong>Notes:</strong> ${notes}</p>` : ''}
                  ${zoomLink ? `
                    <p style="margin-top: 15px; margin-bottom: 8px;"><strong>Zoom Link:</strong></p>
                    <p style="margin: 8px 0;"><a href="${zoomLink}" style="color: #0066ff; text-decoration: none; word-break: break-all; font-weight: bold;">${zoomLink}</a></p>
                  ` : ''}
                </div>
                <p>I look forward to speaking with you!</p>
                <p>Best regards,<br><strong>Zohaib Cheema</strong></p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                <p style="color: #666; font-size: 12px;">If you have any questions, please reply to this email.</p>
              </body>
              </html>
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
          const plainText = `Hi Zohaib,\n\nSomeone has booked a meeting with you:\n\nName: ${name}\nEmail: ${email}\nDate: ${formattedDate}\nTime: ${formattedTime}\nType: ${meetingType}${notes ? `\nNotes: ${notes}` : ''}${zoomLink ? `\n\nZoom Link: ${zoomLink}` : ''}`;

          const yourEmailResult = await resend.emails.send({
            from: `Portfolio Bot <${fromEmail}>`,
            replyTo: email,
            to: yourEmail,
            subject: `New Meeting Booking: ${formattedDate} at ${formattedTime}`,
            text: plainText,
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #333; border-bottom: 2px solid #0066ff; padding-bottom: 10px;">New Meeting Booking</h2>
                <p>Hi Zohaib,</p>
                <p>Someone has booked a meeting with you:</p>
                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0066ff;">
                  <p style="margin: 8px 0;"><strong>Name:</strong> ${name}</p>
                  <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #0066ff; text-decoration: none;">${email}</a></p>
                  <p style="margin: 8px 0;"><strong>Date:</strong> ${formattedDate}</p>
                  <p style="margin: 8px 0;"><strong>Time:</strong> ${formattedTime}</p>
                  <p style="margin: 8px 0;"><strong>Type:</strong> ${meetingType}</p>
                  ${notes ? `<p style="margin: 8px 0;"><strong>Notes:</strong> ${notes}</p>` : ''}
                  ${zoomLink ? `
                    <p style="margin-top: 15px; margin-bottom: 8px;"><strong>Zoom Link:</strong></p>
                    <p style="margin: 8px 0;"><a href="${zoomLink}" style="color: #0066ff; text-decoration: none; word-break: break-all; font-weight: bold;">${zoomLink}</a></p>
                  ` : ''}
                </div>
                <p style="color: #666; font-size: 12px;">You can reply directly to this email to contact ${name}.</p>
              </body>
              </html>
            `,
          });
          console.log('Notification email sent successfully to Zohaib:', JSON.stringify(yourEmailResult, null, 2));
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

