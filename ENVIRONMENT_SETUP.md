# Environment Variables Setup

To set up your environment variables, create a `.env.local` file in the root directory with the following variables:

## Required Variables

```bash
# Database
DATABASE_URL="your_database_url_here"

# Authentication
NEXTAUTH_SECRET="your_nextauth_secret_here"
NEXTAUTH_URL="http://localhost:3000"

# Email Service (Resend)
RESEND_API_KEY="your_resend_api_key_here"
EMAIL_FROM="Dark Lotus <noreply@darklotus.party>"

# App Configuration
APP_BASE_URL="http://localhost:3000"
```

## New Variables for Real Address and Calendar Integration

```bash
# Real Address (sent to approved guests)
REAL_ADDRESS="123 Mystery Lane, Fremont, CA 94536"

# Event Details for Calendar Integration
EVENT_DATE="2025-11-01"
EVENT_START_TIME="20:00"
EVENT_END_TIME="00:00"
EVENT_TITLE="The Dark Lotus: A Halloween Murder Mystery"
EVENT_DESCRIPTION="Join us for an unforgettable evening of mystery, intrigue, and Halloween thrills. Step into a world where every guest has a secret, every character has a motive, and the truth lies hidden in the shadows."
```

## Features Added

1. **Real Address Integration**: The `REAL_ADDRESS` environment variable is now used in approval and character assignment emails instead of "[Venue TBD]"

2. **Calendar Integration**: Approved guests now receive calendar links for:
   - Google Calendar
   - Outlook
   - Yahoo Calendar
   - ICS file download for any calendar app

3. **Enhanced Email Experience**: Emails now include:
   - Complete event details with real address
   - One-click calendar integration
   - Professional styling with calendar buttons
   - ICS file download option

## How It Works

When an admin approves a guest:
1. The approval email is sent with the real address
2. Calendar links are generated using the event details from environment variables
3. Guests can easily add the event to their preferred calendar
4. The same functionality is included in character assignment emails

The calendar links are generated dynamically based on your environment variables, so you can easily update the event details without changing code.
