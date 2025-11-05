/**
 * Test endpoint to verify Resend email sending
 * GET /api/test-email
 * This endpoint helps debug email delivery issues
 */

import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Resend free tier only allows sending to account owner's email
  // Based on the error, the account owner email is: zscheema9@gmail.com
  const testEmail = 'zscheema9@gmail.com';
  const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';

  if (!resend) {
    return res.status(500).json({ 
      error: 'RESEND_API_KEY not configured',
      details: 'Please set RESEND_API_KEY in Vercel environment variables'
    });
  }

  try {
    console.log('[TEST EMAIL] ==========================================');
    console.log('[TEST EMAIL] Testing email send to:', testEmail);
    console.log('[TEST EMAIL] From email:', fromEmail);
    console.log('[TEST EMAIL] API Key present:', !!process.env.RESEND_API_KEY);
    console.log('[TEST EMAIL] API Key length:', process.env.RESEND_API_KEY?.length || 0);
    console.log('[TEST EMAIL] API Key prefix:', process.env.RESEND_API_KEY?.substring(0, 10) || 'N/A');
    
    const emailPayload = {
      from: `Test Bot <${fromEmail}>`,
      to: testEmail,
      subject: `Test Email - ${new Date().toISOString()}`,
      text: `This is a test email sent at ${new Date().toISOString()}. If you receive this, email sending is working correctly.`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Test Email</h2>
          <p>This is a test email sent at ${new Date().toISOString()}.</p>
          <p>If you receive this, email sending is working correctly.</p>
        </body>
        </html>
      `,
    };

    console.log('[TEST EMAIL] Sending email...');
    const result = await resend.emails.send(emailPayload);
    
    console.log('[TEST EMAIL] Raw response:', JSON.stringify(result, null, 2));
    console.log('[TEST EMAIL] Response type:', typeof result);
    console.log('[TEST EMAIL] Response keys:', Object.keys(result || {}));
    
    // Check multiple possible response structures
    const emailId = result?.id || result?.data?.id || result?.data?.data?.id;
    
    if (emailId) {
      console.log('[TEST EMAIL] SUCCESS - Email ID:', emailId);
      return res.status(200).json({
        success: true,
        message: 'Test email sent successfully',
        emailId: emailId,
        fullResponse: result,
        instructions: [
          '1. Check your inbox at zohaib.s.cheema9@gmail.com',
          '2. Check your spam/junk folder',
          '3. Check Resend dashboard: https://resend.com/emails',
          '4. Look for email ID: ' + emailId
        ]
      });
    } else {
      console.error('[TEST EMAIL] WARNING - No email ID in response');
      return res.status(200).json({
        success: false,
        message: 'Email sent but no ID returned',
        fullResponse: result,
        warning: 'This might indicate an issue with the Resend API response structure'
      });
    }
  } catch (error) {
    console.error('[TEST EMAIL] ERROR:', error);
    console.error('[TEST EMAIL] Error type:', error?.constructor?.name);
    console.error('[TEST EMAIL] Error message:', error?.message);
    console.error('[TEST EMAIL] Error stack:', error?.stack);
    console.error('[TEST EMAIL] Full error:', JSON.stringify(error, null, 2));
    
    return res.status(500).json({
      success: false,
      error: 'Failed to send test email',
      errorMessage: error?.message || String(error),
      errorType: error?.constructor?.name,
      details: error,
      troubleshooting: [
        '1. Verify RESEND_API_KEY is correct in Vercel environment variables',
        '2. Check Resend dashboard for API key status: https://resend.com/api-keys',
        '3. Verify your Resend account is active',
        '4. Check if there are any rate limits or restrictions'
      ]
    });
  }
}

