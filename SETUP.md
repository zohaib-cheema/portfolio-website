# Setup Instructions

Complete guide for setting up the portfolio website with chatbot, calendar, and resume system.

## Step 1: Resume PDF

Your resume is already uploaded to Vercel Blob Storage.

Resume URL:
```
https://nw3l1qo3ggwqlzil.public.blob.vercel-storage.com/Resume%20-%20ZohaibSCheema.pdf
```

Skip to Step 2 to add this URL to environment variables.

### Uploading a Different Resume

**Option A: Vercel Blob Storage**

1. Go to Vercel Dashboard
2. Select your project
3. Click Storage tab
4. Click Create Database
5. Select Blob
6. Name it and choose a region
7. Click Create
8. Upload your PDF file
9. Copy the URL after upload

**Option B: Cloudinary**

1. Sign up at cloudinary.com
2. Go to Media Library
3. Upload your PDF
4. Copy the public URL

## Step 2: Environment Variables

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

**Add RESEND_API_KEY:**
- Name: `RESEND_API_KEY`
- Value: Your Resend API key
- Check all environments (Development, Preview, Production)

**Add RESUME_PDF_URL:**
- Name: `RESUME_PDF_URL`
- Value: `https://nw3l1qo3ggwqlzil.public.blob.vercel-storage.com/Resume%20-%20ZohaibSCheema.pdf`
- Check all environments

**Add GEMINI_API_KEY (Optional):**
- Name: `GEMINI_API_KEY`
- Value: Your Gemini API key from https://aistudio.google.com/app/apikey
- Check all environments

**Add YOUR_EMAIL (Optional):**
- Name: `YOUR_EMAIL`
- Value: Your email address for approval notifications
- Defaults to zohaib.s.cheema9@gmail.com if not set
- Check all environments

## Step 3: Database Setup

1. Go to Vercel Dashboard → Database → psql tab
2. Copy SQL from `database-schema.sql`
3. Paste and run it in the SQL editor

This creates the necessary tables for slots, feedback, and resume requests.

## Step 4: Generate Calendar Slots

**Option A: Manual Generation**

Visit your domain:
```
https://your-domain.com/api/calendar/generate-slots
```

Or use curl:
```bash
curl -X POST https://your-domain.com/api/calendar/generate-slots
```

**Option B: Automatic Generation**

Slots are automatically generated daily at midnight UTC via cron job. No action needed.

The calendar page will also auto-generate slots if none exist when visited.

## Step 5: Testing

**Test Resume Request:**
1. Open your website
2. Click the chatbot button
3. Request a resume with a professional email
4. Check your email for approval notification
5. Click approve to send the resume

**Test Calendar:**
1. Visit `/calendar` page
2. Select a time slot
3. Fill out booking form
4. Check email for confirmation

## Troubleshooting

**Resume PDF not found:**
- Verify the URL works in a browser
- Check environment variable is set correctly
- Ensure PDF is publicly accessible

**No calendar slots showing:**
- Visit the calendar page (it will auto-generate)
- Or manually trigger slot generation
- Check database has slots table

**Email not sending:**
- Verify RESEND_API_KEY is correct
- Check Resend dashboard for usage limits
- Ensure API key is active

**Environment variables not working:**
- Redeploy after adding variables
- Go to Deployments → Latest → Redeploy
- Or push a new commit

