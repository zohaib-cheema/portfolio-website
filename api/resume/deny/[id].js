/**
 * API endpoint to deny resume request
 * GET /api/resume/deny/[id]
 */

import { sql } from '@vercel/postgres';

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

    // Update status to denied
    await sql`
      UPDATE resume_requests 
      SET status = 'denied', denied_at = NOW()
      WHERE id = ${id}
    `;

    // Return success page
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Resume Request Denied</title>
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
            h1 { color: #ef4444; margin: 0 0 20px 0; }
            p { color: #666; margin: 10px 0; }
            .email { font-weight: bold; color: #333; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>❌ Request Denied</h1>
            <p>The resume request from</p>
            <p class="email">${request.requester_email}</p>
            <p>has been denied.</p>
            <p style="margin-top: 30px; color: #999; font-size: 14px;">No email was sent. You can close this window.</p>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error denying resume request:', error);
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
            <p>Failed to deny resume request. Please try again.</p>
          </div>
        </body>
      </html>
    `);
  }
}

