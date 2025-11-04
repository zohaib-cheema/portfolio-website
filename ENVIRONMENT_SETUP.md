# Environment Variables Setup

## Required Environment Variables

### 1. Resend API Key (Required for Email)

1. **Sign up for Resend**:
   - Visit https://resend.com
   - Create a free account (100 emails/day free)

2. **Get API Key**:
   - Go to API Keys section
   - Click "Create API Key"
   - Copy the key (starts with `re_`)

3. **Add to Vercel**:
   - Go to your Vercel project
   - Settings → Environment Variables
   - Add: `RESEND_API_KEY` = `re_your_key_here`
   - Select all environments (Production, Preview, Development)

4. **For Local Development**:
   - Create `.env.local` file in project root
   - Add: `RESEND_API_KEY=re_your_key_here`

### 2. Resume PDF URL (Required for Resume Requests)

1. **Upload Resume PDF**:
   - Option A: Vercel Blob Storage (Recommended)
     - Go to Vercel dashboard → Storage → Create Blob Store
     - Upload resume PDF
     - Copy the public URL
   
   - Option B: Cloudinary
     - Upload to Cloudinary
     - Get public URL
   
   - Option C: Public folder (not recommended for production)
     - Put in `/public` folder
     - Use: `https://yourdomain.com/resume.pdf`

2. **Add to Vercel**:
   - Settings → Environment Variables
   - Add: `RESUME_PDF_URL` = `https://your-resume-url.com/resume.pdf`
   - Select all environments

3. **For Local Development**:
   - Add to `.env.local`: `RESUME_PDF_URL=https://your-resume-url.com/resume.pdf`

### 3. Database (Vercel Postgres - Auto-configured)

If using Vercel Postgres:
- Connection strings are automatically provided by Vercel
- No manual configuration needed
- Just create the database in Vercel dashboard

## Setting Up Database

### Step 1: Create Vercel Postgres Database

1. Go to Vercel Dashboard
2. Select your project
3. Go to "Storage" tab
4. Click "Create Database"
5. Select "Postgres"
6. Choose region
7. Click "Create"

### Step 2: Create Tables

1. Go to Vercel Dashboard → Storage → Your Database
2. Click "SQL Editor"
3. Run the SQL from `database-schema.sql`:

```sql
CREATE TABLE IF NOT EXISTS slots (
  id VARCHAR(255) PRIMARY KEY,
  date DATE NOT NULL,
  time VARCHAR(10) NOT NULL,
  datetime TIMESTAMP NOT NULL,
  available BOOLEAN DEFAULT true,
  booked_by VARCHAR(255),
  booked_email VARCHAR(255),
  meeting_type VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  booked_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS feedback (
  id VARCHAR(255) PRIMARY KEY,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_slots_date ON slots(date);
CREATE INDEX IF NOT EXISTS idx_slots_available ON slots(available);
CREATE INDEX IF NOT EXISTS idx_slots_datetime ON slots(datetime);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at);
```

### Step 3: Generate Initial Slots

After tables are created, generate slots:

**Option 1: Via API** (after deployment):
```bash
curl -X POST https://yourdomain.com/api/calendar/generate-slots
```

**Option 2: Via Vercel Cron** (automatic):
- Cron job is configured in `vercel.json`
- Runs daily at midnight UTC
- Will automatically generate slots

## Verification Checklist

- [ ] Resend API key added to Vercel environment variables
- [ ] Resume PDF URL added to Vercel environment variables
- [ ] Vercel Postgres database created
- [ ] Database tables created (using `database-schema.sql`)
- [ ] Initial slots generated (via API or wait for cron)
- [ ] `.env.local` created for local development (optional)

## Testing

After setup, test:

1. **Resume Request**:
   - Use chatbot to request resume
   - Check email inbox

2. **Calendar Booking**:
   - Visit `/calendar`
   - Book a slot
   - Check email for confirmation

3. **Feedback**:
   - Visit `/feedback`
   - Submit feedback
   - Check database for entry

## Troubleshooting

### "Email service not configured"
- Check `RESEND_API_KEY` is set in Vercel
- Verify API key is correct
- Check Resend dashboard for usage limits

### "Resume PDF not configured"
- Check `RESUME_PDF_URL` is set
- Verify URL is accessible
- Check PDF is publicly accessible

### "Database does not exist"
- Create Vercel Postgres database
- Run SQL from `database-schema.sql`
- Verify tables were created

### "Relation does not exist"
- Tables haven't been created
- Run the SQL from `database-schema.sql`
- Check table names match

