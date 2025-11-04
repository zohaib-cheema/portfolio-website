/**
 * API endpoint to approve and send resume
 * GET /api/resume/approve/[id]
 */

import { sql } from '@vercel/postgres';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Request ID is required' });
    }

    // Get request from database
    const requestResult = await sql`
      SELECT requester_email, status 
      FROM resume_requests 
      WHERE id = ${id}
    `;

    if (requestResult.rows.length === 0) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Request Not Found</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              }
              .container {
                background: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                text-align: center;
              }
              h1 { color: #ef4444; }
              p { color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>❌ Request Not Found</h1>
              <p>The resume request was not found in the database.</p>
            </div>
          </body>
        </html>
      `);
    }

    const request = requestResult.rows[0];

    // Check if already processed
    if (request.status !== 'pending') {
      const statusMessage = request.status === 'approved' 
        ? 'This request has already been approved and the resume was sent.' 
        : 'This request has already been denied.';
      
      return res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Request Already Processed</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              }
              .container {
                background: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                text-align: center;
              }
              h1 { color: #f59e0b; }
              p { color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>⚠️ Already Processed</h1>
              <p>${statusMessage}</p>
            </div>
          </body>
        </html>
      `);
    }

    // Update status to approved
    await sql`
      UPDATE resume_requests 
      SET status = 'approved', approved_at = NOW()
      WHERE id = ${id}
    `;

    // Send resume to requester
    if (!process.env.RESUME_PDF_URL) {
      return res.status(500).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Configuration Error</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              }
              .container {
                background: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                text-align: center;
              }
              h1 { color: #ef4444; }
              p { color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>❌ Configuration Error</h1>
              <p>Resume PDF URL is not configured. Please set RESUME_PDF_URL environment variable.</p>
            </div>
          </body>
        </html>
      `);
    }

    // Fetch resume PDF
    let resumeAttachment = null;
    try {
      const pdfResponse = await fetch(process.env.RESUME_PDF_URL);
      if (pdfResponse.ok) {
        const pdfBuffer = await pdfResponse.arrayBuffer();
        resumeAttachment = {
          filename: 'Zohaib_Cheema_Resume.pdf',
          content: Buffer.from(pdfBuffer),
        };
      }
    } catch (error) {
      console.error('Error fetching resume PDF:', error);
    }

    // Send email to requester
    try {
      const emailData = {
        from: 'Zohaib Cheema <noreply@zohaibcheema.com>',
        to: request.requester_email,
        subject: 'Zohaib Cheema - Resume',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Thank you for your interest!</h2>
            <p>Hi there,</p>
            <p>Thank you for requesting Zohaib's resume. You'll find it attached to this email.</p>
            <p>If you'd like to schedule a meeting or have any questions, feel free to reach out!</p>
            <p>Best regards,<br>Zohaib Cheema</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              This email was sent from Zohaib's portfolio website.<br>
              Contact: zohaib.s.cheema9@gmail.com
            </p>
          </div>
        `,
      };

      if (resumeAttachment) {
        emailData.attachments = [resumeAttachment];
      }

      await resend.emails.send(emailData);
    } catch (emailError) {
      console.error('Error sending resume email:', emailError);
      // Don't fail the approval if email fails - status is already updated
    }

    // Return success page
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Resume Approved</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 10px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.3);
              text-align: center;
              max-width: 500px;
            }
            h1 { color: #10b981; margin: 0 0 20px 0; }
            p { color: #666; margin: 10px 0; }
            .email { font-weight: bold; color: #333; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✅ Resume Approved!</h1>
            <p>The resume has been sent to</p>
            <p class="email">${request.requester_email}</p>
            <p style="margin-top: 30px; color: #999; font-size: 14px;">You can close this window.</p>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error approving resume request:', error);
    return res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Error</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 10px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.3);
              text-align: center;
            }
            h1 { color: #ef4444; }
            p { color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>❌ Error</h1>
            <p>Failed to approve resume request. Please try again.</p>
          </div>
        </body>
      </html>
    `);
  }
}

