/**
 * API endpoint to book a calendar slot
 * POST /api/calendar/book
 */

import { sql } from '@vercel/postgres';
import { Resend } from 'resend';

// Initialize Resend with validation
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

if (!resend) {
  console.warn('[RESEND] WARNING: RESEND_API_KEY not set - emails will not be sent');
}

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
    
    if (!process.env.RESEND_API_KEY || !resend) {
      console.error('[BOOKING API] RESEND_API_KEY not set - emails will not be sent');
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
        const yourEmail = process.env.YOUR_EMAIL || 'zohaib.s.cheema9@gmail.com';
        const linkedinUrl = 'https://www.linkedin.com/in/zohaibsafdarcheema/';

        // Use Resend's default domain if custom domain isn't verified
        // For production, verify your domain in Resend and use: noreply@zohaibcheema.com
        // For testing, use: onboarding@resend.dev (works without domain verification)
        const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';

        // Send confirmation to the attendee
        try {
          const plainText = `Hi ${name},\n\nYour meeting with Zohaib has been confirmed:\n\nDate: ${formattedDate}\nTime: ${formattedTime}\nType: ${meetingType}${notes ? `\nNotes: ${notes}` : ''}${zoomLink ? `\n\nZoom Link: ${zoomLink}` : ''}\n\nI look forward to speaking with you!\n\nBest regards,\nZohaib Cheema\nEmail: ${yourEmail}\nLinkedIn: ${linkedinUrl}`;

          const attendeeResult = await resend.emails.send({
            from: `Zohaib Cheema <${fromEmail}>`,
            replyTo: yourEmail,
            to: email,
            subject: `Meeting Confirmed - ${formattedDate} at ${formattedTime}`,
            text: plainText,
            headers: {
              'X-Entity-Ref-ID': `meeting-${bookedSlot.id}`,
            },
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
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                  <p style="margin: 5px 0; color: #333; font-size: 14px;"><strong>Zohaib Cheema</strong></p>
                  <p style="margin: 5px 0; color: #666; font-size: 13px;"><a href="mailto:${yourEmail}" style="color: #0066ff; text-decoration: none;">${yourEmail}</a></p>
                  <p style="margin: 5px 0; color: #666; font-size: 13px;"><a href="${linkedinUrl}" style="color: #0066ff; text-decoration: none;">LinkedIn Profile</a></p>
                </div>
                <p style="color: #666; font-size: 12px; margin-top: 20px;">If you have any questions, please reply to this email.</p>
              </body>
              </html>
            `,
          });
          // Validate the response
          if (!attendeeResult || !attendeeResult.id) {
            throw new Error(`Invalid response from Resend API: ${JSON.stringify(attendeeResult)}`);
          }
          console.log('[ATTENDEE EMAIL] SUCCESS - Email sent to attendee');
          console.log('[ATTENDEE EMAIL] Response:', JSON.stringify(attendeeResult, null, 2));
          console.log(`[ATTENDEE EMAIL] Email ID: ${attendeeResult.id}`);
        } catch (attendeeEmailError) {
          const errorMsg = `Error sending confirmation email to attendee (${email}): ${attendeeEmailError.message || attendeeEmailError}`;
          console.error('[ATTENDEE EMAIL] ERROR:', errorMsg);
          console.error('[ATTENDEE EMAIL] Full error:', JSON.stringify(attendeeEmailError, null, 2));
          emailErrors.push(errorMsg);
        }

        // Send notification to Zohaib - ALWAYS send to hardcoded email
        // This ensures you always get notified regardless of environment variables
        const hardcodedEmail = 'zohaib.s.cheema9@gmail.com';
        const notificationEmails = [hardcodedEmail];
        
        // Also add YOUR_EMAIL if it's different from the hardcoded one
        if (yourEmail && yourEmail !== hardcodedEmail && !notificationEmails.includes(yourEmail)) {
          notificationEmails.push(yourEmail);
        }

        // Send to all notification emails (starting with hardcoded email)
        for (const notificationEmail of notificationEmails) {
          try {
            console.log(`[NOTIFICATION EMAIL] ==========================================`);
            console.log(`[NOTIFICATION EMAIL] Preparing to send to: ${notificationEmail}`);
            console.log(`[NOTIFICATION EMAIL] From email: ${fromEmail}`);
            console.log(`[NOTIFICATION EMAIL] Booking details - Name: ${name}, Email: ${email}, Date: ${formattedDate}, Time: ${formattedTime}`);
            console.log(`[NOTIFICATION EMAIL] Resend API Key present: ${!!process.env.RESEND_API_KEY}`);
            
            const plainText = `Hi Zohaib,\n\nSomeone has booked a meeting with you:\n\nName: ${name}\nEmail: ${email}\nDate: ${formattedDate}\nTime: ${formattedTime}\nType: ${meetingType}${notes ? `\nNotes: ${notes}` : ''}${zoomLink ? `\n\nZoom Link: ${zoomLink}` : ''}`;

            const emailPayload = {
              from: `Portfolio Bot <${fromEmail}>`,
              replyTo: email,
              to: notificationEmail,
              subject: `New Meeting Booking: ${formattedDate} at ${formattedTime}`,
              text: plainText,
              headers: {
                'X-Entity-Ref-ID': `notification-${bookedSlot.id}`,
              },
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
            };
            
            console.log(`[NOTIFICATION EMAIL] Email payload prepared for ${notificationEmail}`);
            console.log(`[NOTIFICATION EMAIL] Sending email...`);
            
            const emailResult = await resend.emails.send(emailPayload);
            
            // Check multiple possible response structures (Resend SDK may return data.id or id)
            const emailId = emailResult?.id || emailResult?.data?.id || emailResult?.data?.data?.id;
            
            console.log(`[NOTIFICATION EMAIL] Raw response:`, JSON.stringify(emailResult, null, 2));
            console.log(`[NOTIFICATION EMAIL] Response type:`, typeof emailResult);
            console.log(`[NOTIFICATION EMAIL] Response keys:`, Object.keys(emailResult || {}));
            
            // Validate the response
            if (!emailResult) {
              throw new Error(`Empty response from Resend API`);
            }
            
            if (!emailId) {
              // Log the full response but don't throw - email might still be sent
              console.warn(`[NOTIFICATION EMAIL] WARNING - No email ID in response structure`);
              console.warn(`[NOTIFICATION EMAIL] Full response:`, JSON.stringify(emailResult, null, 2));
            }
            
            console.log(`[NOTIFICATION EMAIL] ==========================================`);
            if (emailId) {
              console.log(`[NOTIFICATION EMAIL] SUCCESS - Email sent to ${notificationEmail}`);
              console.log(`[NOTIFICATION EMAIL] Email ID: ${emailId}`);
            } else {
              console.log(`[NOTIFICATION EMAIL] Email sent (but no ID returned) to ${notificationEmail}`);
            }
            console.log(`[NOTIFICATION EMAIL] Response:`, JSON.stringify(emailResult, null, 2));
            console.log(`[NOTIFICATION EMAIL] To: ${notificationEmail}`);
            console.log(`[NOTIFICATION EMAIL] From: ${fromEmail}`);
            console.log(`[NOTIFICATION EMAIL] ==========================================`);
          } catch (emailError) {
            const errorMsg = `Error sending notification email to ${notificationEmail}: ${emailError.message || emailError}`;
            console.error(`[NOTIFICATION EMAIL] ERROR for ${notificationEmail}:`, errorMsg);
            console.error(`[NOTIFICATION EMAIL] Full error:`, JSON.stringify(emailError, null, 2));
            emailErrors.push(errorMsg);
            
            // If this is the hardcoded email and it failed, try a simple fallback
            if (notificationEmail === hardcodedEmail) {
              try {
                console.log(`[NOTIFICATION EMAIL] Attempting fallback email to ${hardcodedEmail}...`);
                const fallbackResult = await resend.emails.send({
                  from: `Portfolio Bot <${fromEmail}>`,
                  to: hardcodedEmail,
                  subject: `Meeting Booking Alert - ${name}`,
                  text: `Meeting booked: ${name} (${email}) on ${formattedDate} at ${formattedTime}`,
                });
                const fallbackId = fallbackResult?.id || fallbackResult?.data?.id || fallbackResult?.data?.data?.id;
                if (fallbackId) {
                  console.log(`[NOTIFICATION EMAIL] Fallback email sent successfully to ${hardcodedEmail}`);
                  console.log(`[NOTIFICATION EMAIL] Fallback Email ID: ${fallbackId}`);
                } else {
                  console.warn(`[NOTIFICATION EMAIL] Fallback email sent but no ID returned`);
                  console.warn(`[NOTIFICATION EMAIL] Fallback response:`, JSON.stringify(fallbackResult, null, 2));
                }
              } catch (fallbackError) {
                console.error(`[NOTIFICATION EMAIL] Fallback email also failed for ${hardcodedEmail}:`, fallbackError);
              }
            }
          }
        }
      } catch (emailError) {
        const errorMsg = `General email error: ${emailError.message || emailError}`;
        console.error(errorMsg, emailError);
        emailErrors.push(errorMsg);
      }
    }

    // Include email errors in response for debugging (but don't fail the booking)
    const responseData = {
      success: true,
      message: 'Booking confirmed',
      booking: {
        slotId: bookedSlot.id,
        date: bookedSlot.date,
        time: bookedSlot.time,
        datetime: bookedSlot.datetime,
        meetingType: bookedSlot.meetingType
      }
    };

    // Log email status
    if (emailErrors.length > 0) {
      console.error('[BOOKING API] Email errors occurred:', emailErrors);
      responseData.emailWarnings = emailErrors;
    } else {
      console.log('[BOOKING API] All emails sent successfully');
    }

    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Error booking slot:', error);
    res.status(500).json({ error: 'Failed to book slot' });
  }
}

