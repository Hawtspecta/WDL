# Secure Transaction Management Portal

A professional full-stack Next.js application demonstrating authentication, authorization, relational database management, and transactional email workflows. Built for Assignment 2 to showcase modern web development practices.

## 🚀 Features

- **Authentication**: Secure login with Better Auth and session management
- **Authorization**: Role-based access control (ADMIN, MEMBER, GUEST)
- **Relational Database**: PostgreSQL with Prisma ORM and automated seeding
- **Transactional Email**: React Email templates with Resend integration
- **Audit Logging**: Comprehensive activity tracking for compliance
- **Protected APIs**: Secure API endpoints with proper validation
- **Modern UI**: Responsive dashboard with Tailwind CSS
- **Real-time Data**: Database-backed records with proper relationships

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety throughout
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **React Server Components** - Server-side rendering

### Backend
- **Next.js API Routes** - RESTful endpoints
- **Server Actions** - Mutations with form handling
- **Prisma ORM** - Database abstraction
- **Better Auth** - Authentication solution

### Database
- **SQLite** - Relational database (for local development)
- **Prisma Migrations** - Schema management
- **Faker.js** - Realistic test data generation

### Email
- **React Email** - Template rendering
- **Resend** - Email delivery service
- **Webhooks** - Event processing

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Navigate to project directory
cd assn2

# Install dependencies
npm install
```

### 2. Environment Setup

Copy the example environment file and configure your variables:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# Database
DATABASE_URL="file:./dev.db"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"

# Resend Email (optional for demo)
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxx"
EMAIL_FROM="noreply@yourdomain.com"

# Application
APP_URL="http://localhost:3000"

# Node Environment
NODE_ENV="development"
```

**Generate Better Auth Secret:**
```bash
openssl rand -base64 32
```

### 3. Database Setup

```bash
# Generate Prisma Client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed database with test data
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
assn2/
├── app/                          # Next.js App Router
│   ├── api/                      # API Route Handlers
│   │   ├── auth/                 # Better Auth endpoints
│   │   ├── transactions/         # Transaction CRUD
│   │   ├── audit-logs/           # Audit log access
│   │   └── email/                # Webhook handling
│   ├── actions/                  # Server Actions
│   │   └── transactions.ts       # Transaction mutations
│   ├── dashboard/                # Dashboard page
│   ├── transactions/             # Transaction management
│   ├── audit-logs/               # Audit log viewer
│   ├── admin/                    # Admin panel
│   ├── profile/                  # User profile
│   ├── database-demo/            # Database demonstration
│   ├── login/                    # Login page
│   ├── unauthorized/             # Unauthorized access page
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # React components
│   ├── Navigation.tsx            # Main navigation
│   └── ui/                       # Reusable UI components
│       ├── button.tsx
│       └── card.tsx
├── emails/                       # React Email templates
│   ├── TransactionCreatedEmail.tsx
│   └── CriticalActivityEmail.tsx
├── lib/                          # Library utilities
│   ├── auth/                     # Authentication configuration
│   │   └── config.ts
│   ├── authorization/            # Authorization utilities
│   │   └── index.ts
│   ├── email/                    # Email service
│   │   └── resend.ts
│   └── prisma.ts                 # Prisma client
├── prisma/                       # Prisma files
│   ├── schema.prisma             # Database schema
│   ├── seed.ts                   # Data seeding script
│   └── migrations/               # Database migrations
├── docs/                         # Documentation
│   ├── assignment-2-architecture.md
│   └── DEMO-EVIDENCE.md
├── .env.example                  # Environment variables template
├── middleware.ts                 # Next.js middleware
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

## 🗄️ Database Schema

### Entities

**Role**
- `id` - Primary key
- `name` - Role name (ADMIN, MEMBER, GUEST)
- `createdAt`, `updatedAt` - Timestamps

**User**
- `id` - Primary key
- `email` - Unique email address
- `name` - User name
- `password` - Hashed password
- `roleId` - Foreign key to Role
- `createdAt`, `updatedAt` - Timestamps

**Transaction**
- `id` - Primary key
- `userId` - Foreign key to User
- `amount` - Transaction amount
- `description` - Transaction description
- `status` - Transaction status (PENDING, COMPLETED, FAILED, CANCELLED)
- `metadata` - Additional JSON data
- `createdAt`, `updatedAt` - Timestamps

**AuditLog**
- `id` - Primary key
- `userId` - Foreign key to User
- `action` - Action type (CREATE_TRANSACTION, UPDATE_TRANSACTION, etc.)
- `entityType` - Type of entity affected
- `entityId` - ID of affected entity
- `metadata` - Additional JSON data
- `ipAddress` - User IP address
- `userAgent` - Browser user agent
- `createdAt` - Timestamp

**EmailEvent**
- `id` - Primary key
- `eventType` - Event type (SENT, DELIVERED, OPENED, etc.)
- `messageId` - Resend message ID
- `recipient` - Email recipient
- `subject` - Email subject
- `timestamp` - Event timestamp
- `metadata` - Additional JSON data
- `processedAt` - Processing timestamp

### Relationships

- Role (1) → (*) User
- User (1) → (*) Transaction
- Transaction (1) → (*) AuditLog
- User (1) → (*) AuditLog
- EmailEvent (standalone)

## 🔐 Authentication & Authorization

### Roles

**ADMIN**
- Full access to all resources
- Can manage users and roles
- Can view all audit logs
- Can delete transactions

**MEMBER**
- Can create and manage own transactions
- Can view own records
- Limited admin access

**GUEST**
- Read-only access
- Limited transaction viewing
- No mutation permissions

### Authorization Flow

1. **Middleware**: First layer of route protection
2. **Session Validation**: Verifies user is authenticated
3. **Role Check**: Ensures user has required role
4. **Permission Check**: Validates specific permissions
5. **Resource Check**: Ensures user can access specific resources

## 📧 Email Integration

### Configuration

Set up Resend API credentials in `.env`:

```env
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxx"
EMAIL_FROM="noreply@yourdomain.com"
```

### Email Templates

- **TransactionCreatedEmail**: Sent when transactions are created
- **CriticalActivityEmail**: Sent for important security events

### Webhook Setup

Configure Resend webhook to point to:
```
https://your-domain.com/api/email/webhook
```

The webhook handler processes events and stores them in the EmailEvent table.

## 🧪 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npm run db:generate      # Generate Prisma Client
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with test data
npm run db:reset         # Reset database and reseed
npm run db:studio        # Open Prisma Studio
npm run reset            # Combined migrate + seed
```

## 📖 API Endpoints

### Authentication
- `POST /api/auth/signin` - Sign in with email/password
- `POST /api/auth/signout` - Sign out

### Transactions
- `GET /api/transactions` - List transactions (filtered by role)
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/[id]` - Get specific transaction
- `PATCH /api/transactions/[id]` - Update transaction
- `DELETE /api/transactions/[id]` - Delete transaction (admin only)

### Audit Logs
- `GET /api/audit-logs` - List audit logs (admin only)

### Email Webhook
- `POST /api/email/webhook` - Process Resend webhooks

## 🧪 Testing & Verification

### Manual Testing Workflow

1. **Database Connection**
   ```bash
   npm run db:studio
   ```
   Verify tables are created and seeded.

2. **Authentication**
   - Navigate to `/login`
   - Sign in with any email/password
   - Verify redirect to dashboard

3. **Authorization**
   - Test with different user roles
   - Verify role-based access controls
   - Check unauthorized redirects

4. **API Testing**
   ```bash
   # Test unauthenticated access
   curl http://localhost:3000/api/transactions
   
   # Test authenticated access (after login)
   curl http://localhost:3000/api/transactions \
     -H "Cookie: session=YOUR_SESSION_COOKIE"
   ```

5. **Transaction Creation**
   - Create transaction via UI
   - Verify database record
   - Check audit log entry
   - Verify email dispatch (if configured)

6. **Build Verification**
   ```bash
   npm run build
   npm run lint
   ```

### Automated Testing

The project includes manual testing workflows. For automated testing, consider adding:
- Unit tests for authorization functions
- Integration tests for API endpoints
- E2E tests with Playwright or Cypress

## 📚 Documentation

- **Architecture Documentation**: `docs/assignment-2-architecture.md`
- **Demo Evidence Guide**: `docs/DEMO-EVIDENCE.md`

## 🔧 Troubleshooting

### Database Connection Issues

```bash
# Check DATABASE_URL in .env
# Ensure SQLite file path is correct
# For PostgreSQL users, ensure PostgreSQL is running
```

### Migration Failures

```bash
# Reset database
npm run db:reset

# Or manually:
npx prisma migrate reset
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Authentication Issues

```bash
# Verify BETTER_AUTH_SECRET is set
# Check session cookie configuration
# Clear browser cookies and try again
```

### Email Issues

```bash
# Verify RESEND_API_KEY is valid
# Check EMAIL_FROM is verified in Resend
# Test Resend API directly
curl https://api.resend.com/emails \
  -H "Authorization: Bearer $RESEND_API_KEY"
```

## 🚀 Deployment

### Environment Variables

Ensure all required environment variables are set in production:

- `DATABASE_URL` - Production database connection
- `BETTER_AUTH_SECRET` - Strong, unique secret
- `RESEND_API_KEY` - Resend API key
- `EMAIL_FROM` - Verified sender email
- `APP_URL` - Production application URL
- `NODE_ENV` - Set to `production`

### Build & Deploy

```bash
# Build application
npm run build

# Start production server
npm run start
```

### Database Migration

```bash
# Run migrations in production
npm run db:migrate

# Seed production database (if needed)
npm run db:seed
```

## 📝 License

This project is created for educational purposes for Assignment 2.

## 👥 Credits

Built with modern web technologies and best practices for Assignment 2 demonstration.

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the architecture documentation
3. Consult the demo evidence guide
4. Check Next.js, Prisma, and Better Auth documentation

---

**Note**: This is a demonstration project for educational purposes. For production use, additional security measures, testing, and optimization would be required.
