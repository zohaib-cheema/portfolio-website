# Step-by-Step Setup Instructions

## Step 1: Test Locally (See What's Working)

1. **Install Vercel CLI** (for testing API routes locally):
   ```bash
   npm install -g vercel
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **In a new terminal, run Vercel dev** (for API routes):
   ```bash
   vercel dev
   ```
   This will allow API routes to work locally.

4. **Test the frontend**:
   - Open `http://localhost:5173` (or the port Vite shows)
   - Click the chat button (bottom-right)
   - Try requesting a resume
   - Try scheduling a meeting
   - Check `/calendar` and `/feedback` pages

**Note**: APIs will work with mock data. For production, continue to Step 2.

---

## Step 2: Set Up Database (Choose One Option)

### Option A: Vercel Postgres (Recommended - Easiest with Vercel)

1. **Go to Vercel Dashboard**:
   - Visit https://vercel.com/dashboard
   - Select your project (or create one)

2. **Add Postgres Database**:
   - Go to Storage tab
   - Click "Create Database"
   - Select "Postgres"
   - Choose a region
   - Click "Create"

3. **Get Connection String**:
   - Copy the connection string (looks like: `postgres://...`)
   - Save it for Step 4

4. **Update API Endpoints**:
   - Install Postgres client: `npm install @vercel/postgres`
   - See Step 3 below for updating code

### Option B: Supabase (Free Tier Available)

1. **Create Supabase Account**:
   - Visit https://supabase.com
   - Sign up (free tier is fine)

2. **Create New Project**:
   - Click "New Project"
   - Choose a name and database password
   - Wait for project to be created

3. **Get Connection Details**:
   - Go to Project Settings → Database
   - Copy the connection string
   - Save it for Step 4

4. **Create Tables**:
   - Go to SQL Editor
   - Run the SQL from `API_SETUP.md` (database schema)
   - Or use the Supabase table editor

5. **Update API Endpoints**:
   - Install Supabase client: `npm install @supabase/supabase-js`
   - See Step 3 below for updating code

---

## Step 3: Update API Endpoints to Use Database

### For Vercel Postgres:

1. **Install dependency**:
   ```bash
   npm install @vercel/postgres
   ```

2. **Update `api/calendar/slots.js`**:
   ```javascript
   import { sql } from '@vercel/postgres';

   export default async function handler(req, res) {
     if (req.method !== 'GET') {
       return res.status(405).json({ error: 'Method not allowed' });
     }

     try {
       const result = await sql`
         SELECT * FROM slots 
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
       return res.status(500).json({ error: 'Failed to fetch slots' });
     }
   }
   ```

3. **Update `api/calendar/book.js`**:
   ```javascript
   import { sql } from '@vercel/postgres';

   export default async function handler(req, res) {
     if (req.method !== 'POST') {
       return res.status(405).json({ error: 'Method not allowed' });
     }

     try {
       const { slotId, name, email, meetingType, notes } = req.body;

       // Atomic update - only update if still available
       const result = await sql`
         UPDATE slots 
         SET available = false, 
             booked_by = ${name},
             booked_email = ${email},
             meeting_type = ${meetingType},
             notes = ${notes || null},
             booked_at = NOW()
         WHERE id = ${slotId} AND available = true
         RETURNING *
       `;

       if (result.rows.length === 0) {
         return res.status(409).json({ error: 'Slot already booked' });
       }

       return res.status(200).json({
         success: true,
         message: 'Booking confirmed',
         booking: result.rows[0]
       });
     } catch (error) {
       console.error('Error booking slot:', error);
       return res.status(500).json({ error: 'Failed to book slot' });
     }
   }
   ```

4. **Update `api/calendar/generate-slots.js`**:
   ```javascript
   import { sql } from '@vercel/postgres';

   // ... (keep the generation functions)

   export default async function handler(req, res) {
     if (req.method !== 'POST') {
       return res.status(405).json({ error: 'Method not allowed' });
     }

     try {
       const today = new Date();
       const workDays = getNext14WorkDays(today);
       const allSlots = [];
       
       workDays.forEach(date => {
         const slotsForDay = generateRandomSlotsForDay(date);
         allSlots.push(...slotsForDay);
       });

       // Insert slots into database
       for (const slot of allSlots) {
         await sql`
           INSERT INTO slots (id, date, time, datetime, available, created_at)
           VALUES (${slot.id}, ${slot.date}, ${slot.time}, ${slot.datetime}, true, NOW())
           ON CONFLICT (id) DO NOTHING
         `;
       }

       // Remove old slots
       await sql`DELETE FROM slots WHERE date < CURRENT_DATE`;

       return res.status(200).json({
         success: true,
         message: `Generated ${allSlots.length} slots`,
         count: allSlots.length
       });
     } catch (error) {
       console.error('Error generating slots:', error);
       return res.status(500).json({ error: 'Failed to generate slots' });
     }
   }
   ```

5. **Update `api/feedback/submit.js`**:
   ```javascript
   import { sql } from '@vercel/postgres';

   export default async function handler(req, res) {
     if (req.method !== 'POST') {
       return res.status(405).json({ error: 'Method not allowed' });
     }

     try {
       const { rating, comment } = req.body;
       const id = `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

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
       return res.status(500).json({ error: 'Failed to submit feedback' });
     }
   }
   ```

### For Supabase:

1. **Install dependency**:
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Create `lib/supabase.js`**:
   ```javascript
   import { createClient } from '@supabase/supabase-js';

   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
   const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

   export const supabase = createClient(supabaseUrl, supabaseKey);
   ```

3. **Update API endpoints** to use Supabase client instead of `sql` queries (similar pattern, but use Supabase syntax).

---

## Step 4: Set Up Email Service (Resend Recommended)

1. **Create Resend Account**:
   - Visit https://resend.com
   - Sign up (free tier: 100 emails/day)

2. **Get API Key**:
   - Go to API Keys section
   - Create a new API key
   - Copy it (starts with `re_...`)

3. **Add Resume PDF**:
   - Upload your resume PDF to:
     - Vercel Blob Storage (easiest)
     - Cloudinary
     - AWS S3
     - Or keep in `/public` folder (less secure)
   - Get the URL to the PDF

4. **Update `api/resume/request.js`**:
   ```javascript
   export default async function handler(req, res) {
     if (req.method !== 'POST') {
       return res.status(405).json({ error: 'Method not allowed' });
     }

     try {
       const { email } = req.body;
       const validation = validateProfessionalEmail(email);
       
       if (!validation.valid) {
         return res.status(400).json({ error: validation.message });
       }

       // Send email with Resend
       const response = await fetch('https://api.resend.com/emails', {
         method: 'POST',
         headers: {
           'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           from: 'Zohaib Cheema <noreply@yourdomain.com>',
           to: email,
           subject: 'Zohaib Cheema - Resume',
           html: `
             <p>Hi,</p>
             <p>Thank you for your interest! Attached is Zohaib's resume.</p>
             <p>Best regards,<br>Zohaib's Portfolio</p>
           `,
           attachments: [{
             filename: 'Zohaib_Cheema_Resume.pdf',
             path: process.env.RESUME_PDF_URL // Or fetch from storage
           }]
         }),
       });

       const data = await response.json();

       if (!response.ok) {
         throw new Error(data.message);
       }

       return res.status(200).json({
         success: true,
         message: 'Resume sent successfully'
       });
     } catch (error) {
       console.error('Error sending resume:', error);
       return res.status(500).json({ error: 'Failed to send resume' });
     }
   }
   ```

5. **Set Environment Variables**:
   - Create `.env.local` file:
     ```bash
     RESEND_API_KEY=re_your_api_key_here
     RESUME_PDF_URL=https://your-resume-url.com/resume.pdf
     ```
   - Add to Vercel: Go to Project Settings → Environment Variables

---

## Step 5: Set Up Slot Generation (Cron Job)

1. **Create `vercel.json`** in project root:
   ```json
   {
     "crons": [
       {
         "path": "/api/calendar/generate-slots",
         "schedule": "0 0 * * *"
       }
     ]
   }
   ```
   This runs daily at midnight UTC.

2. **Or manually trigger**:
   - Visit `/api/calendar/generate-slots` in browser
   - Or use: `curl -X POST https://yourdomain.com/api/calendar/generate-slots`

---

## Step 6: Deploy to Vercel

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add chatbot and calendar system"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - If not connected: `vercel` in terminal
   - Or connect GitHub repo in Vercel dashboard
   - Vercel will auto-deploy

3. **Add Environment Variables in Vercel**:
   - Go to Project Settings → Environment Variables
   - Add:
     - `RESEND_API_KEY`
     - `RESUME_PDF_URL`
     - Database connection string (if using Vercel Postgres, it's auto-added)

4. **Create Database Tables**:
   - If using Vercel Postgres: Use Vercel dashboard SQL editor
   - Run the SQL from `API_SETUP.md`

---

## Step 7: Test Everything

1. **Test Chatbot**:
   - Request resume with professional email
   - Try scheduling meeting
   - Check feedback link

2. **Test Calendar**:
   - Visit `/calendar`
   - Book a slot
   - Try booking same slot twice (should fail)

3. **Test Email**:
   - Check email inbox for resume
   - Check booking confirmation

4. **Test Slot Generation**:
   - Manually trigger `/api/calendar/generate-slots`
   - Verify slots appear in calendar

---

## Quick Start (Minimum Viable)

If you want to test quickly without full setup:

1. **Just test frontend**:
   ```bash
   npm run dev
   ```
   - Chatbot and calendar UI will work
   - APIs will use mock data

2. **For production**, you need:
   - Database (Vercel Postgres recommended)
   - Email service (Resend recommended)
   - Resume PDF uploaded somewhere

---

## Troubleshooting

- **API routes not working locally**: Make sure `vercel dev` is running
- **Database connection errors**: Check connection string and environment variables
- **Email not sending**: Verify API key and domain setup in Resend
- **Slots not showing**: Run slot generation endpoint first

---

## Need Help?

- Check `API_SETUP.md` for more details
- Vercel docs: https://vercel.com/docs
- Resend docs: https://resend.com/docs

