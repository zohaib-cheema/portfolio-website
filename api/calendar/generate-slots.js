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
  // EST is UTC-5, EDT is UTC-4
  // To convert EST/EDT to UTC, we need to ADD the offset (since EST is behind UTC)
  // 11:00 AM EST = 11:00 + 5 hours = 4:00 PM UTC (16:00 UTC)
  
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
  const offsetHours = isDST ? 4 : 5; // EDT is UTC-4 (add 4), EST is UTC-5 (add 5)
  
  // Create UTC date by adding offset hours
  // EST 11:00 AM = UTC 4:00 PM (11 + 5 = 16)
  const utcDate = new Date(Date.UTC(
    year,
    month - 1,
    day,
    hour + offsetHours,
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
  
  // Use date as seed for consistent generation across all users
  // This ensures the same date always generates the same slots
  const dateSeed = `${year}-${month}-${day}`;
  
  // Seeded random function for consistency
  const seededRandom = (seed) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash) / 2147483647; // Normalize to 0-1
  };
  
  // Generate random number of slots (1-3 slots per day) using seeded random
  const slotCountSeed = seededRandom(dateSeed + 'count');
  const numberOfSlots = Math.floor(slotCountSeed * 3) + 1;
  
  // Create all possible 30-minute time slots between 11:00 AM and 5:00 PM EST
  const availableTimes = [];
  for (let hour = 11; hour < 17; hour++) {
    availableTimes.push({ hour, minute: 0 });
    availableTimes.push({ hour, minute: 30 });
  }
  
  // Shuffle using seeded random for consistency
  const shuffled = [...availableTimes].sort((a, b) => {
    const seedA = dateSeed + `${a.hour}:${a.minute}`;
    const seedB = dateSeed + `${b.hour}:${b.minute}`;
    return seededRandom(seedA) - seededRandom(seedB);
  });
  
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

    // Delete ALL existing slots for work days to ensure clean regeneration
    // This removes any old invalid slots
    const workDayDates = workDays.map(d => {
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const day = d.getDate();
      return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    });
    
    // Delete all slots for these dates (will be regenerated with correct times)
    for (const dateStr of workDayDates) {
      await sql`DELETE FROM slots WHERE date = ${dateStr}`;
    }
    
    // Also remove old slots (past dates)
    await sql`DELETE FROM slots WHERE date < CURRENT_DATE`;
    
    // Delete ANY slots with times outside 11:00-17:00 (11am-5pm EST) - this catches all old invalid slots
    await sql`
      DELETE FROM slots 
      WHERE time < '11:00' OR time >= '17:00'
    `;
    
    // Delete any dates that have more than 3 slots
    await sql`
      DELETE FROM slots
      WHERE date IN (
        SELECT date FROM slots
        GROUP BY date
        HAVING COUNT(*) > 3
      )
    `;

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
