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

    // Validate required fields (check for empty strings too)
    if (!slotId || !name || !email || !meetingType) {
      console.error('[BOOKING API] Missing required fields:', { slotId: !!slotId, name: !!name, email: !!email, meetingType: !!meetingType });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Trim and validate non-empty strings
    const trimmedName = name?.trim();
    const trimmedEmail = email?.trim();
    const trimmedMeetingType = meetingType?.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMeetingType) {
      console.error('[BOOKING API] Empty required fields after trim:', { name: trimmedName, email: trimmedEmail, meetingType: trimmedMeetingType });
      return res.status(400).json({ error: 'Required fields cannot be empty' });
    }

    // Atomic database operation - only update if still available
    // Handle null notes properly for SQL template literal
    const notesValue = notes && typeof notes === 'string' && notes.trim() ? notes.trim() : null;
    
    console.log('[BOOKING API] Attempting to book slot:', { 
      slotId, 
      name: trimmedName, 
      email: trimmedEmail, 
      meetingType: trimmedMeetingType,
      hasNotes: !!notesValue 
    });
    
    const result = await sql`
      UPDATE slots 
      SET 
        available = false,
        booked_by = ${trimmedName},
        booked_email = ${trimmedEmail},
        meeting_type = ${trimmedMeetingType},
        notes = ${notesValue},
        booked_at = NOW()
      WHERE id = ${slotId} AND available = true
      RETURNING 
        id,
        date,
        time,
        datetime,
        meeting_type as "meetingType"
    `;
    
    console.log('[BOOKING API] SQL query result:', { 
      rowCount: result.rows.length,
      slotId: result.rows[0]?.id 
    });

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

        // NOTE: Resend free tier only allows sending to account owner's email
        // We cannot send confirmation emails to attendees without domain verification
        // Users should add the meeting to their Google Calendar which includes all details
        console.log('[ATTENDEE EMAIL] Skipping attendee email - Resend free tier restriction');
        console.log('[ATTENDEE EMAIL] Attendee should add meeting to Google Calendar for confirmation');

        // Send notification to Zohaib
        // CRITICAL: Resend free tier ONLY allows sending to account owner's email
        // Account owner email: zscheema9@gmail.com
        // Sending to other emails will fail with 403 validation_error
        const resendAccountEmail = 'zscheema9@gmail.com'; // Resend account owner email (REQUIRED)
        const notificationEmails = [resendAccountEmail];
        
        // Note: We can't send to zohaib.s.cheema9@gmail.com without domain verification
        // The account owner email (zscheema9@gmail.com) will receive all notifications

        // Send to all notification emails (starting with hardcoded email)
        for (const notificationEmail of notificationEmails) {
          try {
            console.log(`[NOTIFICATION EMAIL] ==========================================`);
            console.log(`[NOTIFICATION EMAIL] Preparing to send to: ${notificationEmail}`);
            console.log(`[NOTIFICATION EMAIL] From email: ${fromEmail}`);
            console.log(`[NOTIFICATION EMAIL] Booking details - Name: ${trimmedName}, Email: ${trimmedEmail}, Date: ${formattedDate}, Time: ${formattedTime}`);
            console.log(`[NOTIFICATION EMAIL] Resend API Key present: ${!!process.env.RESEND_API_KEY}`);
            
            const plainText = `Hi Zohaib,\n\nSomeone has booked a meeting with you:\n\nName: ${trimmedName}\nEmail: ${trimmedEmail}\nDate: ${formattedDate}\nTime: ${formattedTime}\nType: ${trimmedMeetingType}${notesValue ? `\nNotes: ${notesValue}` : ''}${zoomLink ? `\n\nZoom Link: ${zoomLink}` : ''}`;

            const emailPayload = {
              from: `Portfolio Bot <${fromEmail}>`,
              replyTo: trimmedEmail,
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
                  <p style="margin: 8px 0;"><strong>Name:</strong> ${trimmedName}</p>
                  <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${trimmedEmail}" style="color: #0066ff; text-decoration: none;">${trimmedEmail}</a></p>
                  <p style="margin: 8px 0;"><strong>Date:</strong> ${formattedDate}</p>
                  <p style="margin: 8px 0;"><strong>Time:</strong> ${formattedTime}</p>
                  <p style="margin: 8px 0;"><strong>Type:</strong> ${trimmedMeetingType}</p>
                  ${notesValue ? `<p style="margin: 8px 0;"><strong>Notes:</strong> ${notesValue}</p>` : ''}
                  ${zoomLink ? `
                    <p style="margin-top: 15px; margin-bottom: 8px;"><strong>Zoom Link:</strong></p>
                    <p style="margin: 8px 0;"><a href="${zoomLink}" style="color: #0066ff; text-decoration: none; word-break: break-all; font-weight: bold;">${zoomLink}</a></p>
                  ` : ''}
                </div>
                <p style="color: #666; font-size: 12px;">You can reply directly to this email to contact ${trimmedName}.</p>
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
            
            // If sending failed, try a simple fallback email
            if (notificationEmail === resendAccountEmail) {
              try {
                console.log(`[NOTIFICATION EMAIL] Attempting fallback email to ${resendAccountEmail}...`);
                const fallbackResult = await resend.emails.send({
                  from: `Portfolio Bot <${fromEmail}>`,
                  to: resendAccountEmail,
                  subject: `Meeting Booking Alert - ${trimmedName}`,
                  text: `Meeting booked: ${trimmedName} (${trimmedEmail}) on ${formattedDate} at ${formattedTime}`,
                });
                const fallbackId = fallbackResult?.id || fallbackResult?.data?.id || fallbackResult?.data?.data?.id;
                if (fallbackId) {
                  console.log(`[NOTIFICATION EMAIL] Fallback email sent successfully to ${resendAccountEmail}`);
                  console.log(`[NOTIFICATION EMAIL] Fallback Email ID: ${fallbackId}`);
                } else {
                  console.warn(`[NOTIFICATION EMAIL] Fallback email sent but no ID returned`);
                  console.warn(`[NOTIFICATION EMAIL] Fallback response:`, JSON.stringify(fallbackResult, null, 2));
                }
              } catch (fallbackError) {
                console.error(`[NOTIFICATION EMAIL] Fallback email also failed for ${resendAccountEmail}:`, fallbackError);
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
        meetingType: bookedSlot.meetingType,
        zoomLink: zoomLink || '' // Include zoom link in response for Google Calendar
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
    console.error('[BOOKING API] ==========================================');
    console.error('[BOOKING API] ERROR booking slot:', error);
    console.error('[BOOKING API] Error message:', error?.message);
    console.error('[BOOKING API] Error stack:', error?.stack);
    console.error('[BOOKING API] Request body:', JSON.stringify(req.body, null, 2));
    console.error('[BOOKING API] ==========================================');
    
    // Return more detailed error for debugging
    const errorMessage = error?.message || 'Unknown error occurred';
    res.status(500).json({ 
      error: 'Failed to book slot',
      details: errorMessage,
      // Only include details in development
      ...(process.env.NODE_ENV === 'development' && { stack: error?.stack })
    });
  }
}

