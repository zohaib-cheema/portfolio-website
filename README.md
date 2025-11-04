# Portfolio Website

A modern portfolio website with interactive chatbot, calendar scheduling, and resume request system.

## Features

- Interactive chatbot for resume requests and meeting scheduling
- Calendar booking system with automatic slot generation
- Resume approval workflow with email notifications
- Feedback collection system
- Responsive design with smooth animations

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in Vercel:
   - `RESEND_API_KEY` - Email service API key
   - `RESUME_PDF_URL` - URL to your resume PDF
   - `GEMINI_API_KEY` - Optional, for AI responses (free tier available)
   - `YOUR_EMAIL` - Optional, defaults to your main email

3. Run database schema:
   - Go to Vercel Dashboard → Database → psql tab
   - Run the SQL from `database-schema.sql`

4. Generate initial calendar slots:
   - Visit `/api/calendar/generate-slots` or wait for automatic generation

5. Deploy:
```bash
git push
```

## Development

```bash
npm run dev
```

For local API testing:
```bash
vercel dev
```

## Documentation

See `SETUP.md` for detailed setup instructions.
