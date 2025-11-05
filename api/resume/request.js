/**
 * API endpoint to request resume
 * POST /api/resume/request
 * Stores requests as "pending" and sends approval email to Zohaib
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

// Email validation (inline since serverless functions can't import from src)
const PERSONAL_EMAIL_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
  'icloud.com', 'protonmail.com', 'mail.com', 'yandex.com', 'zoho.com',
  'gmx.com', 'live.com', 'msn.com', 'rediffmail.com', 'inbox.com', 'tutanota.com',
];

const isValidEmailFormat = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isPersonalEmailDomain = (email) => {
  const domain = email.split('@')[1]?.toLowerCase();
  return PERSONAL_EMAIL_DOMAINS.includes(domain);
};

const validateProfessionalEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { valid: false, message: 'Please provide an email address.' };
  }
  if (!isValidEmailFormat(email)) {
    return { valid: false, message: 'Please enter a valid email address format (e.g., name@company.com).' };
  }
  if (isPersonalEmailDomain(email)) {
    return { valid: false, message: 'I need a professional email address (like name@companyname.edu or name@company.com). This helps ensure Zohaib\'s resume reaches the right contacts.' };
  }
  return { valid: true, message: 'Email looks good!' };
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Validate professional email
    const validation = validateProfessionalEmail(email);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    if (!process.env.RESEND_API_KEY || !resend) {
      console.error('[RESUME REQUEST] RESEND_API_KEY not configured');
      return res.status(500).json({ 
        error: 'Email service not configured. Please set RESEND_API_KEY environment variable.' 
      });
    }

    // Generate unique ID for the request
    const requestId = `resume_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Store request in database as "pending"
    try {
      await sql`
        INSERT INTO resume_requests (id, requester_email, status, created_at)
        VALUES (${requestId}, ${email}, 'pending', NOW())
      `;
    } catch (dbError) {
      // If table doesn't exist yet, continue (graceful fallback)
      if (!dbError.message?.includes('does not exist') && !dbError.message?.includes('relation')) {
        console.error('Database error:', dbError);
        return res.status(500).json({ error: 'Failed to store resume request' });
      }
    }

    // Send approval email to Zohaib - ALWAYS send to hardcoded email
    // This ensures you always get notified regardless of environment variables
    const hardcodedEmail = 'zohaib.s.cheema9@gmail.com';
    const yourEmail = process.env.YOUR_EMAIL || hardcodedEmail;
    const notificationEmails = [hardcodedEmail];
    
    // Also add YOUR_EMAIL if it's different from the hardcoded one
    if (yourEmail && yourEmail !== hardcodedEmail && !notificationEmails.includes(yourEmail)) {
      notificationEmails.push(yourEmail);
    }
    
    // Get base URL from environment or use default
    let baseUrl = 'https://www.zohaibcheema.com';
    if (process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`;
    } else if (process.env.NEXT_PUBLIC_BASE_URL) {
      baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    }

    const approveUrl = `${baseUrl}/api/resume/approve/${requestId}`;
    const denyUrl = `${baseUrl}/api/resume/deny/${requestId}`;

    // Use Resend's default domain if custom domain isn't verified
    // For production, verify your domain in Resend and use: noreply@zohaibcheema.com
    // For testing, use: onboarding@resend.dev (works without domain verification)
    const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';

    // Send to all notification emails
    for (const notificationEmail of notificationEmails) {
      try {
        console.log(`[RESUME REQUEST EMAIL] ==========================================`);
        console.log(`[RESUME REQUEST EMAIL] Preparing to send to: ${notificationEmail}`);
        console.log(`[RESUME REQUEST EMAIL] From email: ${fromEmail}`);
        console.log(`[RESUME REQUEST EMAIL] Requester email: ${email}`);
        console.log(`[RESUME REQUEST EMAIL] Resend API Key present: ${!!process.env.RESEND_API_KEY}`);
        
        const requestTime = new Date().toLocaleString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        });

        const plainText = `Hi Zohaib,\n\nSomeone has requested your resume:\n\nEmail: ${email}\nTime: ${requestTime}\n\nApprove: ${approveUrl}\nDeny: ${denyUrl}`;

        const emailPayload = {
          from: `Portfolio Bot <${fromEmail}>`,
          to: notificationEmail,
          subject: `Resume Request from ${email}`,
          text: plainText,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #333; border-bottom: 2px solid #0066ff; padding-bottom: 10px;">New Resume Request</h2>
              <p>Hi Zohaib,</p>
              <p>Someone has requested your resume:</p>
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0066ff;">
                <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 8px 0;"><strong>Time:</strong> ${requestTime}</p>
              </div>
              <div style="margin: 30px 0; text-align: center;">
                <a href="${approveUrl}" 
                   style="background-color: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-right: 10px; display: inline-block; font-weight: bold;">
                  ✅ Approve & Send Resume
                </a>
                <a href="${denyUrl}" 
                   style="background-color: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  ❌ Deny Request
                </a>
              </div>
              <p style="color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                Or copy these links:<br>
                <strong>Approve:</strong> <a href="${approveUrl}">${approveUrl}</a><br>
                <strong>Deny:</strong> <a href="${denyUrl}">${denyUrl}</a>
              </p>
            </body>
            </html>
          `,
        };

        console.log(`[RESUME REQUEST EMAIL] Email payload prepared for ${notificationEmail}`);
        console.log(`[RESUME REQUEST EMAIL] Sending email...`);
        
        const emailResult = await resend.emails.send(emailPayload);
        
        // Check multiple possible response structures (Resend SDK may return data.id or id)
        const emailId = emailResult?.id || emailResult?.data?.id || emailResult?.data?.data?.id;
        
        console.log(`[RESUME REQUEST EMAIL] Raw response:`, JSON.stringify(emailResult, null, 2));
        console.log(`[RESUME REQUEST EMAIL] Response type:`, typeof emailResult);
        console.log(`[RESUME REQUEST EMAIL] Response keys:`, Object.keys(emailResult || {}));
        
        // Validate the response
        if (!emailResult) {
          throw new Error(`Empty response from Resend API`);
        }
        
        if (!emailId) {
          // Log the full response but don't throw - email might still be sent
          console.warn(`[RESUME REQUEST EMAIL] WARNING - No email ID in response structure`);
          console.warn(`[RESUME REQUEST EMAIL] Full response:`, JSON.stringify(emailResult, null, 2));
        }
        
        console.log(`[RESUME REQUEST EMAIL] ==========================================`);
        if (emailId) {
          console.log(`[RESUME REQUEST EMAIL] SUCCESS - Email sent to ${notificationEmail}`);
          console.log(`[RESUME REQUEST EMAIL] Email ID: ${emailId}`);
        } else {
          console.log(`[RESUME REQUEST EMAIL] Email sent (but no ID returned) to ${notificationEmail}`);
        }
        console.log(`[RESUME REQUEST EMAIL] Response:`, JSON.stringify(emailResult, null, 2));
        console.log(`[RESUME REQUEST EMAIL] To: ${notificationEmail}`);
        console.log(`[RESUME REQUEST EMAIL] From: ${fromEmail}`);
        console.log(`[RESUME REQUEST EMAIL] ==========================================`);
      } catch (emailError) {
        const errorMsg = `Error sending resume request email to ${notificationEmail}: ${emailError.message || emailError}`;
        console.error(`[RESUME REQUEST EMAIL] ERROR for ${notificationEmail}:`, errorMsg);
        console.error(`[RESUME REQUEST EMAIL] Full error:`, JSON.stringify(emailError, null, 2));
        
        // If this is the hardcoded email and it failed, try a simple fallback
        if (notificationEmail === hardcodedEmail) {
          try {
            console.log(`[RESUME REQUEST EMAIL] Attempting fallback email to ${hardcodedEmail}...`);
            const fallbackResult = await resend.emails.send({
              from: `Portfolio Bot <${fromEmail}>`,
              to: hardcodedEmail,
              subject: `Resume Request Alert - ${email}`,
              text: `Resume requested by: ${email} at ${requestTime}`,
            });
            const fallbackId = fallbackResult?.id || fallbackResult?.data?.id || fallbackResult?.data?.data?.id;
            if (fallbackId) {
              console.log(`[RESUME REQUEST EMAIL] Fallback email sent successfully to ${hardcodedEmail}`);
              console.log(`[RESUME REQUEST EMAIL] Fallback Email ID: ${fallbackId}`);
            } else {
              console.warn(`[RESUME REQUEST EMAIL] Fallback email sent but no ID returned`);
              console.warn(`[RESUME REQUEST EMAIL] Fallback response:`, JSON.stringify(fallbackResult, null, 2));
            }
          } catch (fallbackError) {
            console.error(`[RESUME REQUEST EMAIL] Fallback email also failed for ${hardcodedEmail}:`, fallbackError);
          }
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Resume request submitted. You will receive an email confirmation once approved.'
    });
  } catch (error) {
    console.error('Error processing resume request:', error);
    return res.status(500).json({ error: 'Failed to process resume request' });
  }
}
