/**
 * API endpoint to generate calendar slots for next 14 work days
 * POST /api/calendar/generate-slots
 * This should be protected or run via cron job
 */

import { sql } from '@vercel/postgres';

function getNext14WorkDays(startDate) {
  const workDays = [];
  let currentDate = new Date(startDate);
  let workDaysFound = 0;
  
  while (workDaysFound < 14) {
    const dayOfWeek = currentDate.getDay();
    
    // Monday = 1, Friday = 5
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      workDaysFound++;
      workDays.push(new Date(currentDate));
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return workDays;
}

function generateRandomSlotsForDay(date) {
  const slots = [];
  const startHour = 12; // 12pm
  const endHour = 17; // 5pm
  
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

export default async function handler(req, res) {
  // In production, add authentication/authorization check
  // if (!isAuthorized(req)) {
  //   return res.status(401).json({ error: 'Unauthorized' });
  // }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const workDays = getNext14WorkDays(today);
      const allSlots = [];

      workDays.forEach(date => {
        const slotsForDay = generateRandomSlotsForDay(date);
        allSlots.push(...slotsForDay);
      });

      // Save slots to database (upsert - skip if already exists)
      let insertedCount = 0;
      for (const slot of allSlots) {
        try {
          await sql`
            INSERT INTO slots (id, date, time, datetime, available, created_at)
            VALUES (${slot.id}, ${slot.date}, ${slot.time}, ${slot.datetime}, true, NOW())
            ON CONFLICT (id) DO NOTHING
          `;
          insertedCount++;
        } catch (error) {
          // If slot already exists, skip it
          if (!error.message?.includes('duplicate')) {
            console.error(`Error inserting slot ${slot.id}:`, error);
          }
        }
      }

      // Remove old slots (past dates)
      await sql`DELETE FROM slots WHERE date < CURRENT_DATE`;

      return res.status(200).json({
        success: true,
        message: `Generated ${allSlots.length} slots for next 14 work days`,
        inserted: insertedCount,
        total: allSlots.length
      });
  } catch (error) {
    console.error('Error generating slots:', error);
    res.status(500).json({ error: 'Failed to generate slots' });
  }
}

