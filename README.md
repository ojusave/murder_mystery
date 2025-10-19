# The Dark Lotus: A Halloween Murder Mystery

A complete Next.js application for managing a Halloween murder mystery party, built with TypeScript, Tailwind CSS, and deployed on Render.

## 🎭 Features

- **Public Landing Page**: Event details, schedule, and CTAs
- **Multi-Section RSVP Form**: Comprehensive form with validation and progress saving
- **Waiver Management**: Hosted legal document with structured HTML
- **Tokenized Guest Portal**: Secure, read-only access for guests
- **Admin Dashboard**: Complete RSVP and character management
- **Email Notifications**: Automated emails via Resend
- **Background Worker**: Email processing and queue management
- **Cron Jobs**: Daily reminders and cleanup tasks

## 🏗️ Tech Stack

- **Framework**: Next.js 15 (App Router) with TypeScript
- **UI**: Tailwind CSS + shadcn/ui components
- **Database**: PostgreSQL (Render Postgres)
- **Cache/Queue**: Redis (Render Key Value)
- **Authentication**: NextAuth with credentials provider
- **Email**: Resend API
- **Deployment**: Render (Web Service, Background Worker, Cron Job, Databases)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Render account (for deployment)

### Local Development

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd murder_mystery
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your values:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/blacklotus"
   REDIS_URL="redis://localhost:6379"
   NEXTAUTH_SECRET="your-secret-key"
   RESEND_API_KEY="your-resend-api-key"
   APP_BASE_URL="http://localhost:3000"
   RSVP_DEADLINE="2024-10-30"
   EMAIL_FROM="Dark Lotus <noreply@darklotus.party>"
   ADMIN_EMAIL="admin@blacklotus.party"
   ADMIN_PASSWORD="your-admin-password"
   ```

3. **Database Setup**
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Start Background Worker** (in separate terminal)
   ```bash
   npm run worker:start
   ```

## 🌐 One-Click Deployment on Render

### Method 1: Blueprint Deployment

1. **Connect Repository**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository

2. **Deploy Blueprint**
   - Render will automatically detect `render.yaml`
   - Review the services and click "Apply"
   - Wait for all services to deploy

3. **Set Environment Variables**
   - Go to Environment Groups → `black-lotus-env-group`
   - Set `RESEND_API_KEY` with your Resend API key
   - Update other values as needed

4. **Initialize Database**
   - Go to the web service shell
   - Run: `npm run db:push && npm run db:seed`

### Method 2: Manual Service Creation

1. **Create Environment Group**
   - Name: `black-lotus-env-group`
   - Add all environment variables from `.env.example`

2. **Create Databases**
   - PostgreSQL: `black-lotus-db` (Starter plan)
   - Redis: `black-lotus-kv` (Starter plan)

3. **Create Web Service**
   - Connect repository
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Health Check Path: `/api/health`

4. **Create Background Worker**
   - Connect same repository
   - Start Command: `npm run worker:start`

5. **Create Cron Job**
   - Schedule: `0 9 * * *` (Daily at 9 AM PT)
   - Start Command: `npm run cron:daily`

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `REDIS_URL` | Redis connection string | Yes | - |
| `NEXTAUTH_SECRET` | NextAuth secret key | Yes | - |
| `RESEND_API_KEY` | Resend API key for emails | Yes | - |
| `APP_BASE_URL` | Application base URL | Yes | - |
| `RSVP_DEADLINE` | RSVP deadline date | No | `2024-10-30` |
| `EMAIL_FROM` | Email sender address | No | `Dark Lotus <noreply@darklotus.party>` |
| `MAX_GUESTS` | Maximum guest capacity | No | `50` |
| `RATE_LIMIT_PER_MINUTE` | Rate limit per minute | No | `5` |
| `RATE_LIMIT_PER_DAY` | Rate limit per day | No | `100` |
| `ADMIN_EMAIL` | Admin user email | No | `admin@blacklotus.party` |
| `ADMIN_PASSWORD` | Admin user password | No | `admin123` |

### Database Schema

The application uses Prisma with the following main models:

- **Guest**: RSVP information and character assignments
- **Character**: Character details and traits
- **AdminUser**: Host authentication
- **EmailEvent**: Email queue and audit trail

## 📧 Email Configuration

### Resend Setup

1. **Create Account**
   - Sign up at [resend.com](https://resend.com)
   - Verify your domain (optional but recommended)

2. **Get API Key**
   - Go to API Keys in Resend dashboard
   - Create new API key
   - Copy and set as `RESEND_API_KEY`

3. **Email Templates**
   - RSVP Received
   - Approval Notification
   - Rejection Notification
   - Character Assignment

## 🔐 Security Features

- **CSRF Protection**: Built into Next.js
- **Input Validation**: Zod schemas for all forms
- **Rate Limiting**: Redis-based rate limiting
- **Tokenized Access**: Unguessable guest portal tokens
- **Admin Authentication**: Secure credential-based auth
- **SQL Injection Protection**: Prisma ORM

## 📊 Admin Features

### RSVP Management
- View all RSVPs with filtering and search
- Approve/reject RSVPs with one click
- Assign characters to approved guests
- View guest portal as read-only

### Character Management
- Create character assignments
- Set character traits and private notes
- Manage character templates

### Email Management
- View email queue status
- Resend failed emails
- Email audit trail

## 🎯 Guest Experience

### RSVP Flow
1. **Section 1**: Basic info and waiver agreement
2. **Section 2**: Event participation details
3. **Section 3**: Character preferences and acknowledgments
4. **Submission**: Automatic email notification

### Guest Portal
- **Pending**: Shows RSVP under review
- **Approved**: Shows approval and character assignment
- **Rejected**: Shows polite decline message

## 🔄 Background Processing

### Email Worker
- Processes email queue every 30 seconds
- Handles retries with exponential backoff
- Updates email event status

### Cron Jobs
- **Daily at 9 AM PT**:
  - Send RSVP deadline reminders
  - Clean up abandoned tokens
  - Clean up old email events
  - Generate daily reports

## 🐳 Docker Development

For local development with Docker:

```bash
# Start services
docker-compose up -d

# Run migrations
npm run db:push

# Seed database
npm run db:seed

# Start development server
npm run dev
```

## 📝 API Endpoints

### Public
- `GET /` - Landing page
- `GET /rsvp` - RSVP form
- `GET /waiver` - Waiver page
- `GET /thanks` - Thank you page
- `GET /guest/[token]` - Guest portal

### Admin
- `GET /admin/login` - Admin login
- `GET /admin` - Admin dashboard
- `POST /api/rsvp` - Submit RSVP
- `GET /api/admin/guests` - List guests
- `PATCH /api/admin/guests` - Update guest status
- `POST /api/admin/characters` - Assign character

### System
- `GET /api/health` - Health check

## 🧪 Testing

### Manual Testing Checklist

- [ ] RSVP form validation
- [ ] Multi-section form progression
- [ ] Waiver agreement requirement
- [ ] Admin login/logout
- [ ] Guest approval/rejection
- [ ] Character assignment
- [ ] Email notifications
- [ ] Guest portal access
- [ ] Rate limiting
- [ ] Error handling

### Automated Tests

```bash
# Run tests (when implemented)
npm test

# Run E2E tests (when implemented)
npm run test:e2e
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check `DATABASE_URL` format
   - Ensure database is running
   - Verify network connectivity

2. **Email Not Sending**
   - Verify `RESEND_API_KEY`
   - Check Resend account status
   - Review email event logs

3. **Admin Login Issues**
   - Run seed script to create admin user
   - Check password hashing
   - Verify session configuration

4. **Background Worker Not Processing**
   - Check worker service status
   - Review worker logs
   - Ensure Redis connection

### Logs and Monitoring

- **Web Service**: Application logs in Render dashboard
- **Background Worker**: Worker-specific logs
- **Database**: Query logs in PostgreSQL
- **Email Events**: Audit trail in database

## 🔄 Maintenance

### Regular Tasks

1. **Monitor Email Queue**
   - Check for failed emails
   - Resend if necessary
   - Update email templates

2. **Database Maintenance**
   - Monitor connection pool
   - Clean up old data
   - Backup regularly

3. **Security Updates**
   - Update dependencies
   - Review access logs
   - Rotate secrets

### Backup Strategy

- **Database**: Automated daily backups via Render
- **Code**: Git repository
- **Secrets**: Secure environment variable storage

## 📈 Performance Optimization

### Recommendations

1. **Database**
   - Add indexes for frequent queries
   - Use connection pooling
   - Monitor query performance

2. **Caching**
   - Cache frequently accessed data
   - Use Redis for session storage
   - Implement CDN for static assets

3. **Email Processing**
   - Batch email processing
   - Implement retry logic
   - Monitor queue depth

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- **Email**: host@blacklotus.party
- **Issues**: GitHub Issues
- **Documentation**: This README

## 🎉 Acknowledgments

- Built with Next.js and Tailwind CSS
- Deployed on Render
- Email service by Resend
- UI components by shadcn/ui

---

**Happy Mystery Solving! 🕵️‍♀️🎃**