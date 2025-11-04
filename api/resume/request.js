/**
 * API endpoint to request resume
 * POST /api/resume/request
 * Stores requests as "pending" and sends approval email to Zohaib
 */

import { sql } from '@vercel/postgres';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    if (!process.env.RESEND_API_KEY) {
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

    // Send approval email to Zohaib
    const yourEmail = process.env.YOUR_EMAIL || 'zohaib.s.cheema9@gmail.com';
    
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

    try {
      await resend.emails.send({
        from: `Portfolio Bot <${fromEmail}>`,
        to: yourEmail,
        subject: `Resume Request from ${email}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Resume Request</h2>
            <p>Someone has requested your resume:</p>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })}</p>
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
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Error sending approval email:', emailError);
      // Continue even if email fails - request is still stored
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
