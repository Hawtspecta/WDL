# Assignment 2: Architecture Documentation

## 1. System Overview

The Secure Transaction Management Portal is a full-stack Next.js application that demonstrates professional software engineering practices including:

- **Authentication & Authorization**: Secure user authentication with Better Auth and role-based access control
- **Relational Database**: PostgreSQL database with Prisma ORM and automated seeding
- **Transactional Email**: React Email templates with Resend integration and webhook processing
- **API Security**: Protected API endpoints with session validation and authorization checks
- **Audit Logging**: Comprehensive audit trail for all sensitive operations

The application follows a clean architecture with clear separation of concerns, proper security layers, and comprehensive error handling.

## 2. Architecture Diagram

### Request Flow Architecture

```
Browser
   ↓
Next.js UI (React Components)
   ↓
Middleware (middleware.ts)
   ↓
Authentication (Better Auth)
   ↓
Route Handler / Server Action
   ↓
Authorization (lib/authorization/)
   ↓
Prisma ORM
   ↓
PostgreSQL Database
```

### Email Notification Flow

```
Prisma Transaction (Database Mutation)
   ↓
Server Action / API Handler
   ↓
Email Service (lib/email/resend.ts)
   ↓
React Email Template (emails/)
   ↓
Resend API
   ↓
Recipient Email
   ↓
Resend Webhook
   ↓
Next.js Webhook Handler (app/api/email/webhook/)
   ↓
EmailEvent Table (Database)
```

### Component Architecture

```
app/
├── api/                    # API Route Handlers
│   ├── auth/              # Better Auth endpoints
│   ├── transactions/      # Transaction CRUD
│   ├── audit-logs/        # Audit log access
│   └── email/             # Webhook handling
├── actions/               # Server Actions
│   └── transactions.ts    # Transaction mutations
├── dashboard/             # Dashboard page
├── transactions/          # Transaction management
├── audit-logs/            # Audit log viewer
├── admin/                 # Admin panel
├── profile/               # User profile
└── database-demo/         # Database demonstration

lib/
├── auth/                  # Authentication configuration
├── authorization/         # Authorization utilities
├── email/                 # Email service integration
└── prisma.ts              # Prisma client

components/
├── Navigation.tsx         # Main navigation
└── ui/                    # Reusable UI components

emails/                    # React Email templates
├── TransactionCreatedEmail.tsx
└── CriticalActivityEmail.tsx

prisma/
├── schema.prisma          # Database schema
└── seed.ts                # Data seeding script
```

## 3. Data Relationships

### Entity Relationship Model

```
Role (1) ────── (*) User
   │                   │
   │                   │ (1)
   │                   │
   │              (*) Transaction
   │                   │
   │                   │ (1)
   │                   │
   │              (*) AuditLog

EmailEvent (standalone entity for email lifecycle tracking)
```

### Detailed Relationships

**Role → User (1-to-many)**
- One role can be assigned to multiple users
- Each user has exactly one role
- Roles: ADMIN, MEMBER, GUEST

**User → Transaction (1-to-many)**
- One user can have multiple transactions
- Each transaction belongs to exactly one user
- Foreign key: `transactions.userId` → `users.id`

**Transaction → AuditLog (1-to-many)**
- One transaction can have multiple audit logs
- Each audit log references one transaction (or other entity)
- Foreign key: `auditLogs.entityId` → `transactions.id`

**User → AuditLog (1-to-many)**
- One user can have multiple audit logs
- Each audit log is created by one user
- Foreign key: `auditLogs.userId` → `users.id`

**EmailEvent (independent)**
- Tracks email lifecycle events from Resend webhooks
- Not directly linked to other entities
- Contains message ID for correlation with sent emails

### Database Indexes

- `users.email` - For fast user lookup during authentication
- `users.roleId` - For role-based queries
- `transactions.userId` - For user transaction queries
- `transactions.status` - For status filtering
- `transactions.createdAt` - For chronological queries
- `auditLogs.userId` - For user activity tracking
- `auditLogs.action` - For action type filtering
- `auditLogs.entityType` - For entity-based queries
- `auditLogs.createdAt` - For timeline queries
- `emailEvents.messageId` - For webhook correlation
- `emailEvents.eventType` - For event type filtering
- `emailEvents.recipient` - For recipient-based queries

## 4. Authorization Flow

### Request Authorization Pipeline

```
1. Request arrives at Route Handler/Server Action
   ↓
2. Session validation (auth.api.getSession)
   ↓
3. User retrieval with role from database
   ↓
4. Role validation (requireRole or hasPermission)
   ↓
5. Permission check (canAccessResource, canCreateTransaction, etc.)
   ↓
6. Zod input validation
   ↓
7. Database operation
   ↓
8. Audit log creation
   ↓
9. Response
```

### Why Authorization Must Be Server-Side

**Security Reasons:**
1. **Client-side can be bypassed**: Users can modify JavaScript, manipulate DOM, or use API clients directly
2. **Session validation**: Only the server can securely validate session tokens
3. **Database security**: Direct database access must be protected
4. **Audit trail**: Server-side authorization ensures all actions are logged
5. **Role hierarchy**: Complex permission logic should not be exposed to clients

**Implementation:**
- **Middleware**: First layer of protection for route groups
- **Route Handlers**: Independent session and authorization validation
- **Server Actions**: Separate authorization checks before database operations
- **Centralized Utilities**: `lib/authorization/` provides reusable authorization functions

### Authorization Functions

- `getSession()`: Retrieves current user session with role
- `requireSession()`: Ensures user is authenticated, redirects if not
- `requireRole(allowedRoles)`: Ensures user has required role
- `hasPermission(user, requiredRole)`: Checks role hierarchy
- `canAccessResource(user, resourceOwnerId)`: Resource-level authorization
- `canCreateTransaction(user)`: Permission for transaction creation
- `canViewAuditLogs(user)`: Permission for audit log access
- `canManageUsers(user)`: Permission for user management

## 5. Database Seeding

### Seed Script Architecture

**File:** `prisma/seed.ts`

**Purpose:** Generate realistic relational test data using Faker.js

### Seeding Process

```
1. Clean existing data (delete in correct order)
   ↓
2. Create Roles (ADMIN, MEMBER, GUEST)
   ↓
3. Create Users with assigned roles
   ↓
4. Create Transactions for each user
   ↓
5. Create AuditLogs for transactions and users
   ↓
6. Create EmailEvents for transactions
```

### Relational Integrity

The seed script maintains foreign key integrity:

1. **Roles created first**: Users reference roles, so roles must exist
2. **Users reference existing roles**: Each user assigned a valid role ID
3. **Transactions reference existing users**: Each transaction has valid user ID
4. **AuditLogs reference existing users and transactions**: No orphan records
5. **EmailEvents use message IDs**: Correlated with hypothetical email sends

### Faker.js Integration

- **Users**: Realistic names, emails using `faker.internet.email()`
- **Transactions**: Realistic amounts, descriptions using `faker.finance.*`
- **AuditLogs**: Realistic IP addresses, user agents using `faker.internet.*`
- **EmailEvents**: Realistic timestamps, message IDs using `faker.*`

### Seed Workflow Commands

```bash
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Run database migrations
npm run db:seed        # Execute seed script
npm run db:reset       # Reset database and reseed
npm run reset          # Combined migrate + seed
```

## 6. Transactional Email

### Email Dispatch Lifecycle

```
1. User Action (Create Transaction)
   ↓
2. Server Action validates and creates transaction
   ↓
3. Prisma transaction completes successfully
   ↓
4. Audit log created within same transaction
   ↓
5. Email notification triggered (after DB commit)
   ↓
6. React Email template rendered
   ↓
7. Resend API called with rendered HTML
   ↓
8. Email sent to recipient
   ↓
9. Resend webhook fires on events
   ↓
10. Webhook handler processes event
   ↓
11. EmailEvent record created in database
```

### React Email Templates

**TransactionCreatedEmail:**
- Professional transaction confirmation
- Includes transaction details, amount, status
- Call-to-action to view transaction
- Branded styling

**CriticalActivityEmail:**
- Security-focused design (red accents)
- Activity details and timestamps
- Immediate action required messaging
- Links to audit logs

### Resend Integration

**Configuration:**
- API Key: `RESEND_API_KEY` environment variable
- From address: `EMAIL_FROM` environment variable
- Base URL: Automatic Resend API

**Service Functions:**
- `sendTransactionEmail()`: Sends transaction notifications
- `sendCriticalActivityEmail()`: Sends security alerts
- `isEmailConfigured()`: Checks if Resend is properly configured

**Error Handling:**
- Graceful degradation if Resend not configured
- Logs email data when API key missing
- Doesn't fail transactions if email fails
- Comprehensive error logging

### Webhook Processing

**Endpoint:** `app/api/email/webhook/route.ts`

**Supported Events:**
- `sent` - Email successfully sent
- `delivered` - Email delivered to recipient
- `opened` - Recipient opened email
- `clicked` - Recipient clicked link
- `bounced` - Email bounced
- `failed` - Email delivery failed
- `delayed` - Email delivery delayed

**Security:**
- Signature verification (commented - requires webhook secret)
- Only accepts POST requests
- Validates event structure
- Stores raw webhook data in metadata

**Data Persistence:**
- Event type and timestamp
- Message ID for correlation
- Recipient email
- Subject line
- Raw webhook payload
- Event-specific metadata (bounce reasons, etc.)

## 7. Security Considerations

### Session Management

**Better Auth Configuration:**
- Secure session storage (httpOnly cookies)
- Session expiration (7 days)
- Session update age (1 day)
- Secret key protection via environment variables

**Session Validation:**
- Every protected route validates session
- Session includes user ID and role
- Roles fetched from database, not session
- Session invalidation on logout

### Role-Based Authorization

**Role Hierarchy:**
```
ADMIN (level 3)
  ↓ Full access to all resources
  ↓ Can manage users and roles
  ↓ Can view all audit logs

MEMBER (level 2)
  ↓ Can create and manage own transactions
  ↓ Can view own records
  ↓ Limited admin access

GUEST (level 1)
  ↓ Read-only access
  ↓ Limited transaction viewing
  ↓ No mutation permissions
```

**Permission Checks:**
- Server-side validation only
- Centralized authorization utilities
- Resource-level ownership checks
- Action-specific permissions

### Input Validation

**Zod Schemas:**
- Type validation for all inputs
- Range validation (amounts, lengths)
- Required field validation
- Custom error messages

**API Validation:**
- Request body validation before processing
- Parameter validation for route handlers
- File upload validation (if applicable)
- SQL injection prevention via Prisma

### Secret Management

**Environment Variables:**
- `DATABASE_URL`: Database connection string
- `BETTER_AUTH_SECRET`: Session encryption key
- `RESEND_API_KEY`: Email service API key
- `EMAIL_FROM`: Verified sender email
- `APP_URL`: Application base URL

**Security Practices:**
- Never commit secrets to repository
- Use `.env.example` for documentation
- Rotate secrets regularly
- Use different secrets per environment

### Webhook Security

**Signature Verification:**
- HMAC signature validation
- Timestamp verification
- Replay attack prevention
- Secret key protection

**Current Implementation:**
- Signature verification logic included but commented
- Requires `RESEND_WEBHOOK_SECRET` environment variable
- Ready for production enablement

### Audit Logging

**Logged Events:**
- User authentication (login/logout)
- Transaction CRUD operations
- Role changes
- User updates
- Failed authorization attempts

**Audit Log Fields:**
- User ID and action type
- Entity type and ID
- IP address and user agent
- Timestamp
- Metadata (changes, previous state)

**Audit Trail:**
- Immutable records
- Comprehensive coverage
- Admin-only access
- Exportable for compliance

## 8. Technology Stack

### Frontend
- **Next.js 16**: React framework with App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library
- **React Server Components**: Server-side rendering

### Backend
- **Next.js API Routes**: RESTful endpoints
- **Server Actions**: Mutations with form handling
- **Prisma ORM**: Database abstraction
- **Better Auth**: Authentication solution

### Database
- **PostgreSQL**: Relational database
- **Prisma Migrations**: Schema management
- **Indexes**: Performance optimization

### Email
- **React Email**: Template rendering
- **Resend**: Email delivery service
- **Webhooks**: Event processing

### Development
- **tsx**: TypeScript execution
- **Faker.js**: Test data generation
- **Zod**: Schema validation
- **ESLint**: Code linting

## 9. Conclusion

The Secure Transaction Management Portal demonstrates professional full-stack development practices with:

1. **Clean Architecture**: Clear separation of concerns and layered security
2. **Real Database**: PostgreSQL with proper relationships and constraints
3. **Automated Seeding**: Faker.js generates realistic test data
4. **Comprehensive Security**: Multi-layer authentication and authorization
5. **Transactional Email**: Complete email lifecycle with webhook processing
6. **Audit Trail**: Comprehensive logging for compliance and debugging
7. **Type Safety**: TypeScript throughout the application
8. **Modern Stack**: Latest Next.js features and best practices

The application is production-ready and can be extended with additional features like two-factor authentication, advanced reporting, real-time notifications, and more sophisticated role management.
