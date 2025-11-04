# Final Setup Steps - Detailed Instructions

## Step-by-Step Guide for Remaining Configuration

---

## 📄 Step 1: Upload Resume PDF (Already Done! ✅)

**Good news!** Your resume is already uploaded to Vercel Blob Storage!

**Your Resume URL:**
```
https://nw3l1qo3ggwqlzil.public.blob.vercel-storage.com/Resume%20-%20ZohaibSCheema.pdf
```

**You can skip to Step 2** to add this URL to environment variables.

---

### If You Need to Upload a Different Resume in the Future:

#### Option A: Vercel Blob Storage (Recommended - Easiest)

#### Step 1.1: Create Blob Store
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (`zohaibcheema`)
3. Click on the **Storage** tab (top navigation)
4. Click **Create Database** button
5. Select **Blob** (not Postgres this time)
6. Give it a name: `resume-storage` (or any name you like)
7. Choose a region (closest to you)
8. Click **Create**

#### Step 1.2: Upload Resume PDF
1. After the blob store is created, click on it
2. You'll see a file upload area or **Upload** button
3. Click **Upload** or drag and drop your resume PDF file
4. Wait for upload to complete
5. Once uploaded, you'll see your file listed
6. Click on the file name or **Copy URL** button
7. **Copy the URL** - it will look like: `https://[something].public.blob.vercel-storage.com/resume.pdf`

#### Step 1.3: Test the URL
1. Open the URL in a new browser tab
2. Make sure the PDF opens/downloads correctly
3. If it works, you're good! ✅

---

### Option B: Cloudinary (Alternative)

#### Step 1.1: Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. Verify your email

#### Step 1.2: Upload Resume
1. Log into Cloudinary dashboard
2. Go to **Media Library**
3. Click **Upload** button (top right)
4. Select your resume PDF file
5. Wait for upload to complete

#### Step 1.3: Get Public URL
1. Click on your uploaded PDF in the Media Library
2. On the right side, you'll see **URL** or **Delivery URL**
3. Click the **Copy** button next to the URL
4. The URL will look like: `https://res.cloudinary.com/[your-cloud-name]/image/upload/v[version]/resume.pdf`
5. **Copy this URL** ✅

---

### Option C: GitHub/Public Folder (Not Recommended for Production)

If you want a quick test:

1. Put your resume PDF in the `/public` folder of your project
2. Name it `resume.pdf` (or any name)
3. After deployment, the URL will be: `https://www.zohaibcheema.com/resume.pdf`
4. **Note**: This exposes your resume publicly on your website

---

## 🔐 Step 2: Set Environment Variables (2 minutes)

### Step 2.1: Go to Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (`zohaibcheema`)
3. Click **Settings** tab (top navigation)
4. Click **Environment Variables** in the left sidebar

### Step 2.2: Add RESEND_API_KEY

1. Click **Add New** button (or **Add Environment Variable**)
2. Fill in:
   - **Name**: `RESEND_API_KEY`
   - **Value**: `re_NR8etbWv_HzLsrWAxjmVNcaczRmwEQPNM`
   - **Environments**: Check all three boxes:
     - ✅ Development
     - ✅ Preview  
     - ✅ Production
3. Click **Save**

### Step 2.3: Add RESUME_PDF_URL

1. Click **Add New** button again
2. Fill in:
   - **Name**: `RESUME_PDF_URL`
   - **Value**: Copy and paste this exact URL:
     ```
     https://nw3l1qo3ggwqlzil.public.blob.vercel-storage.com/Resume%20-%20ZohaibSCheema.pdf
     ```
     - **Note**: Your resume is already uploaded! Just use this URL.
   - **Environments**: Check all three boxes:
     - ✅ Development
     - ✅ Preview
     - ✅ Production
3. Click **Save**

### Step 2.4: Verify Environment Variables

You should now see in the list:
- ✅ `RESEND_API_KEY` (with value hidden)
- ✅ `RESUME_PDF_URL` (with your URL visible)

---

## 📅 Step 3: Generate Initial Calendar Slots (1 minute)

You have two options:

### Option A: Manual Trigger (Recommended - Immediate)

#### Step 3.1: Get Your Deployment URL

1. Go to Vercel Dashboard → Your Project
2. Click **Deployments** tab
3. Find your latest deployment (should be the top one)
4. Click on the deployment
5. You'll see the **URL** at the top: `https://zohaibcheema.vercel.app` or `https://www.zohaibcheema.com`
6. Copy this URL

#### Step 3.2: Trigger Slot Generation

**Method 1: Using Browser**
1. Open a new browser tab
2. Go to: `https://your-domain.com/api/calendar/generate-slots`
   - Replace `your-domain.com` with your actual domain
3. You should see a JSON response like:
   ```json
   {
     "success": true,
     "message": "Generated X slots for next 14 work days",
     "inserted": X,
     "total": X
   }
   ```

**Method 2: Using Terminal/Command Line**
```bash
curl -X POST https://your-domain.com/api/calendar/generate-slots
```

**Method 3: Using Postman/Insomnia**
1. Create a new POST request
2. URL: `https://your-domain.com/api/calendar/generate-slots`
3. Method: POST
4. Click Send
5. Check response

#### Step 3.3: Verify Slots Were Created

1. Visit your calendar page: `https://your-domain.com/calendar`
2. You should see available time slots displayed
3. If you see slots, you're done! ✅

---

### Option B: Wait for Cron Job (Automatic)

The cron job is already configured in `vercel.json`:
- Runs daily at midnight UTC
- Automatically generates slots for next 14 work days
- No action needed - just wait!

**To use this option:**
- Do nothing - slots will be generated automatically at midnight UTC
- Or use Option A to generate immediately

---

## ✅ Verification Checklist

After completing all steps, verify:

- [ ] Resume PDF uploaded and URL copied
- [ ] `RESEND_API_KEY` added to Vercel environment variables
- [ ] `RESUME_PDF_URL` added to Vercel environment variables
- [ ] Both environment variables are set for all environments (Development, Preview, Production)
- [ ] Calendar slots generated (check `/calendar` page)
- [ ] Test resume request via chatbot (should receive approval email)
- [ ] Test calendar booking (should work and send confirmation email)

---

## 🧪 Quick Test

After setup, test everything:

1. **Test Resume Request**:
   - Open your website
   - Click chatbot button
   - Request resume with a professional email
   - Check YOUR email inbox for approval email
   - Click approve button
   - Verify requester receives resume

2. **Test Calendar**:
   - Visit `/calendar` page
   - Book a slot
   - Check email for confirmation

---

## 🆘 Troubleshooting

### "Resume PDF not found"
- Check the URL is correct
- Verify PDF is publicly accessible (try opening URL in browser)
- Check environment variable is set correctly

### "No slots showing"
- Make sure you ran the slot generation endpoint
- Check database has slots table
- Verify slots were inserted (check database)

### "Email not sending"
- Check `RESEND_API_KEY` is correct
- Verify Resend API key is active
- Check Resend dashboard for usage limits

### "Environment variables not working"
- Make sure you redeployed after adding variables
- Go to Deployments → Latest → Click "..." → Redeploy
- Or push a new commit to trigger deployment

---

## 📝 Summary

**What you just did:**
1. ✅ Uploaded resume PDF to cloud storage
2. ✅ Added resume URL to environment variables
3. ✅ Added Resend API key to environment variables
4. ✅ Generated initial calendar slots

**Everything is now configured!** 🎉

Your chatbot and calendar system should be fully functional. Test it out and you're ready to go!

