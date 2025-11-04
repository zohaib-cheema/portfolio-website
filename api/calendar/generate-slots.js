/**
 * API endpoint to generate calendar slots for next 14 work days
 * POST /api/calendar/generate-slots
 * Generates random slots between 11:00 AM - 5:00 PM EST (max 3 per day)
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

function convertESTToUTC(year, month, day, hour, minute) {
  // Create date string in EST
  const estDateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
  
  // Create date assuming EST timezone (UTC-5)
  // We'll use a more accurate method by checking DST
  const testDate = new Date(`${estDateStr} GMT-0500`);
  
  // Check if this date is in DST (EDT = UTC-4)
  // DST in US Eastern Time: Second Sunday in March to First Sunday in November
  const dateObj = new Date(year, month - 1, day);
  const march = new Date(year, 2, 1); // March 1
  const november = new Date(year, 10, 1); // November 1
  
  // Find second Sunday in March
  let secondSundayMarch = new Date(march);
  secondSundayMarch.setDate(1 + (7 - march.getDay()) % 7 + 7); // First Sunday + 7 days
  
  // Find first Sunday in November
  let firstSundayNovember = new Date(november);
  firstSundayNovember.setDate(1 + (7 - november.getDay()) % 7);
  
  const isDST = dateObj >= secondSundayMarch && dateObj < firstSundayNovember;
  const offset = isDST ? -4 : -5; // EDT is UTC-4, EST is UTC-5
  
  // Create UTC date
  const utcDate = new Date(Date.UTC(
    year,
    month - 1,
    day,
    hour - offset,
    minute,
    0,
    0
  ));
  
  return utcDate;
}

function generateRandomSlotsForDay(date) {
  const slots = [];
  
  // Get date components
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Generate random number of slots (1-3 slots per day)
  const numberOfSlots = Math.floor(Math.random() * 3) + 1;
  
  // Create all possible 30-minute time slots between 11:00 AM and 5:00 PM EST
  const availableTimes = [];
  for (let hour = 11; hour < 17; hour++) {
    availableTimes.push({ hour, minute: 0 });
    availableTimes.push({ hour, minute: 30 });
  }
  
  // Randomly shuffle and select slots (truly random)
  const shuffled = [...availableTimes].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, numberOfSlots).sort((a, b) => {
    if (a.hour !== b.hour) return a.hour - b.hour;
    return a.minute - b.minute;
  });
  
  // Create slot objects with UTC timestamps
  selected.forEach(({ hour, minute }) => {
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    
    // Convert EST to UTC
    const utcDate = convertESTToUTC(year, month, day, hour, minute);
    
    slots.push({
      id: `slot_${dateStr}_${timeStr.replace(':', '')}`,
      date: dateStr,
      time: timeStr,
      datetime: utcDate.toISOString(),
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
