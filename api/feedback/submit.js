/**
 * API endpoint to submit feedback
 * POST /api/feedback/submit
 */

import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Valid rating (1-5) is required' });
    }

    // Generate unique ID
    const id = `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Save to database
    await sql`
      INSERT INTO feedback (id, rating, comment, created_at)
      VALUES (${id}, ${rating}, ${comment || null}, NOW())
    `;

    return res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    
    // If database doesn't exist yet, still return success (graceful fallback)
    if (error.message?.includes('does not exist') || error.message?.includes('relation')) {
      console.log(`Feedback (not saved): Rating: ${rating}, Comment: ${comment || 'None'}`);
      return res.status(200).json({
        success: true,
        message: 'Feedback submitted successfully (database not initialized)'
      });
    }
    
    return res.status(500).json({ error: 'Failed to submit feedback' });
  }
}

