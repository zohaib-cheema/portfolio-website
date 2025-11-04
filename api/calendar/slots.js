/**
 * API endpoint to fetch available calendar slots
 * GET /api/calendar/slots
 */

import { sql } from '@vercel/postgres';

function generateRandomSlotsForDay(date) {
  const slots = [];
  const startHour = 12; // 12pm
  const endHour = 17; // 5pm
  const slotDuration = 30; // minutes
  
  // Generate random number of slots (3-7 slots per day)
  const numberOfSlots = Math.floor(Math.random() * 5) + 3;
  
  // Create all possible time slots
  const availableTimes = [];
  for (let hour = startHour; hour < endHour; hour++) {
    availableTimes.push(`${hour.toString().padStart(2, '0')}:00`);
    availableTimes.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  
  // Randomly select which slots to include
  const shuffled = [...availableTimes].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, numberOfSlots).sort();
  
  // Create slot objects
  selected.forEach(time => {
    const dateStr = date.toISOString().split('T')[0];
    slots.push({
      id: `slot_${dateStr}_${time.replace(':', '')}`,
      date: dateStr,
      time: time,
      datetime: `${dateStr}T${time}:00`,
      available: true,
      bookedBy: null,
      bookedEmail: null,
      meetingType: null,
      notes: null,
      createdAt: new Date().toISOString(),
      bookedAt: null
    });
  });
  
  return slots;
}

// Export for Vercel serverless function
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Fetch available slots from database
    const result = await sql`
      SELECT 
        id,
        date,
        time,
        datetime,
        available,
        booked_by as "bookedBy",
        booked_email as "bookedEmail",
        meeting_type as "meetingType",
        notes,
        created_at as "createdAt",
        booked_at as "bookedAt"
      FROM slots 
      WHERE available = true 
      AND date >= CURRENT_DATE 
      AND date <= CURRENT_DATE + INTERVAL '20 days'
      ORDER BY date, time
    `;

    return res.status(200).json({
      success: true,
      slots: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching slots:', error);
    
    // If database doesn't exist yet, return empty array (graceful fallback)
    if (error.message?.includes('does not exist') || error.message?.includes('relation')) {
      return res.status(200).json({
        success: true,
        slots: [],
        count: 0,
        message: 'Database not initialized. Please run slot generation first.'
      });
    }
    
    return res.status(500).json({ error: 'Failed to fetch slots' });
  }
}

// For Vite dev server, we'll need a proxy or mock API
// Create a simple mock for development
if (typeof window !== 'undefined') {
  // Client-side mock (for development)
  window.mockSlotsAPI = {
    getSlots: async () => {
      // This would be handled by Vite proxy in development
      const response = await fetch('/api/calendar/slots');
      return response.json();
    }
  };
}

