# API Setup Instructions

## Overview
The chatbot and calendar system use Vercel serverless functions located in the `api/` folder. These endpoints need to be connected to a database and email service for production use.

## API Endpoints

### 1. Calendar Slots
- **GET** `/api/calendar/slots` - Fetch available calendar slots
- **POST** `/api/calendar/book` - Book a calendar slot
- **POST** `/api/calendar/generate-slots` - Generate slots (cron job)

### 2. Resume Request
- **POST** `/api/resume/request` - Request resume via email

### 3. Feedback
- **POST** `/api/feedback/submit` - Submit feedback

## Database Setup

The API endpoints currently use in-memory mock data. For production, you need to:

1. **Choose a database:**
   - Vercel Postgres (recommended for Vercel)
   - Supabase (free tier available)
   - Firebase (free tier available)
   - Vercel KV (simple key-value store)

2. **Update API endpoints:**
   - Replace mock data with database queries
   - Implement atomic operations for booking (prevent double booking)
   - Set up slot generation cron job

3. **Database Schema:**
   ```sql
   CREATE TABLE slots (
     id VARCHAR PRIMARY KEY,
     date DATE NOT NULL,
     time VARCHAR NOT NULL,
     datetime TIMESTAMP NOT NULL,
     available BOOLEAN DEFAULT true,
     booked_by VARCHAR,
     booked_email VARCHAR,
     meeting_type VARCHAR,
     notes TEXT,
     created_at TIMESTAMP DEFAULT NOW(),
     booked_at TIMESTAMP
   );

   CREATE TABLE feedback (
     id VARCHAR PRIMARY KEY,
     rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
     comment TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

## Email Service Setup

1. **Choose an email service:**
   - Resend (recommended - simple, developer-friendly)
   - SendGrid
   - Nodemailer with Gmail SMTP

2. **Set environment variables:**
   ```bash
   RESEND_API_KEY=your_api_key_here
   # or
   SENDGRID_API_KEY=your_api_key_here
   ```

3. **Update resume request endpoint:**
   - Uncomment and configure email sending code in `api/resume/request.js`
   - Add resume PDF to storage (Cloudinary, AWS S3, or Vercel Blob)

4. **Update booking confirmation:**
   - Add email sending to `api/calendar/book.js`

## Slot Generation

Set up a cron job to generate slots daily:

1. **Vercel Cron:**
   - Create `vercel.json` with cron configuration
   - Or use Vercel dashboard to set up cron jobs

2. **Manual trigger:**
   - Call `/api/calendar/generate-slots` manually
   - Or set up a scheduled task

## Local Development

For local development, you have two options:

1. **Use Vercel CLI:**
   ```bash
   npm i -g vercel
   vercel dev
   ```
   This will run the API routes locally.

2. **Mock API responses:**
   - Use environment variables to point to mock endpoints
   - Or create a development proxy in `vite.config.js`

## Environment Variables

Create a `.env.local` file (not committed to git):

```bash
# Email Service
RESEND_API_KEY=your_key_here

# Database (if using)
DATABASE_URL=your_database_url

# Resume PDF URL
RESUME_PDF_URL=https://your-resume-url.com/resume.pdf
```

## Next Steps

1. ✅ Frontend components are complete
2. ⏳ Set up database (Vercel Postgres/Supabase)
3. ⏳ Configure email service (Resend/SendGrid)
4. ⏳ Update API endpoints to use real database
5. ⏳ Add resume PDF to storage
6. ⏳ Set up cron job for slot generation
7. ⏳ Test end-to-end flows

## Testing

1. **Local Testing:**
   - Use `vercel dev` to test API routes locally
   - Or deploy to Vercel preview environment

2. **Production Testing:**
   - Test email validation
   - Test booking flow (prevent double booking)
   - Test resume delivery
   - Test feedback submission

