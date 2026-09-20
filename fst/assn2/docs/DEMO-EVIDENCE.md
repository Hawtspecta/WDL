# Demo Evidence Documentation

This document provides the exact checklist of commands and screenshots required to demonstrate the Assignment 2 implementation. **Do not fabricate terminal output or database records.** Run the actual commands and capture real screenshots.

## Screenshots

![Screenshot 1](./Screenshot%202026-09-21%20003107.png)

![Screenshot 2](./Screenshot%202026-09-21%20003135.png)

![Screenshot 3](./Screenshot%202026-09-21%20003204.png)

![Screenshot 4](./Screenshot%202026-09-21%20003233.png)

![Screenshot 5](./Screenshot%202026-09-21%20003251.png)

![Screenshot 6](./Screenshot%202026-09-21%20003320.png)

![Screenshot 7](./Screenshot%202026-09-21%20003341.png)

![Screenshot 8](./Screenshot%202026-09-21%20003411.png)

---

## A. Prisma Generation

### Command
```bash
npm run db:generate
```

### Expected Result
- Prisma Client generates successfully
- No errors in terminal
- Output shows "Generated Prisma Client" or similar success message

---

## B. Database Migration

### Command
```bash
npm run db:migrate
```

### Expected Result
- Database migration runs successfully
- Creates tables based on schema.prisma
- Shows migration file created in prisma/migrations/
- No errors in terminal

---

## C. Seed Execution

### Command
```bash
npm run db:seed
```

### Expected Result
- Seed script executes successfully
- Shows summary of created records:
  - Roles: 3
  - Users: 10 (2 admin, 5 member, 3 guest)
  - Transactions: ~40-80
  - Audit Logs: ~60-120
  - Email Events: ~20-60
- No errors in terminal
- Completion message "Seed completed successfully!"

---

## D. Database Records

### Command
```bash
npm run db:studio
```

### Expected Result
- Prisma Studio opens in browser
- Can view all tables: Role, User, Transaction, AuditLog, EmailEvent
- Records are visible and populated
- Foreign key relationships work (can navigate from User to Transactions)

---

## E. Application Running

### Command
```bash
npm run dev
```

### Expected Result
- Development server starts successfully
- Shows "Ready in ..." message
- Server running on http://localhost:3000
- No compilation errors

---

## F. Authentication

### Steps
1. Navigate to http://localhost:3000
2. Click "Sign In" button
3. Enter any email and password (demo mode)
4. Submit the form

### Expected Result
- Login page loads
- Form submission processes
- Redirects to dashboard after successful login
- Session is established

---

## G. Role-Based Authorization

### Steps
1. Query database to get different user emails and roles:
   ```sql
   SELECT email, "role".name FROM "user" JOIN "role" ON "user"."roleId" = "role".id;
   ```
2. Login as ADMIN user
3. Access /admin - should work
4. Access /audit-logs - should work
5. Logout and login as MEMBER user
6. Access /admin - should redirect to unauthorized
7. Access /audit-logs - should redirect to unauthorized
8. Access /transactions - should work
9. Logout and login as GUEST user
10. Access /transactions - should redirect to unauthorized

### Expected Result
- ADMIN: Full access to all pages
- MEMBER: Access to dashboard and transactions only
- GUEST: Access to dashboard only
- Unauthorized redirects to /unauthorized page

---

## H. API Endpoint Test

### Command
```bash
# Test unauthenticated request
curl http://localhost:3000/api/transactions

# Test authenticated request (after login)
curl http://localhost:3000/api/transactions \
  -H "Cookie: session=YOUR_SESSION_COOKIE"
```

### Expected Result
- Unauthenticated: Returns 401 Unauthorized
- Authenticated: Returns JSON with transaction data
- Response structure: `{ data: [...], errors: null, meta: {...} }`

---

## I. Email Dispatch

### Steps
1. Ensure RESEND_API_KEY is configured in .env
2. Create a new transaction via the UI
3. Check terminal for email dispatch logs
4. Check Resend dashboard for sent emails

### Expected Result
- Transaction created successfully
- Email dispatch triggered after database transaction
- Terminal shows email data or Resend API response
- If Resend configured: Email appears in Resend dashboard
- If Resend not configured: Terminal shows "Resend is not configured" warning with email data

---

## J. Webhook Event

### Steps
1. If Resend is configured, configure webhook URL to point to:
   `https://your-domain.com/api/email/webhook`
2. Send a test email
3. Wait for webhook event
4. Check EmailEvent table in database

### Expected Result
- Webhook endpoint receives event from Resend
- EmailEvent record created in database
- Event includes: eventType, messageId, recipient, timestamp, metadata

---

## K. Database Demonstration Page

### Steps
1. Navigate to http://localhost:3000/database-demo
2. View all seeded data displayed in tables

### Expected Result
- Page loads successfully
- Shows real database records for:
  - Roles (3 records)
  - Users (10 records with roles)
  - Transactions (recent 20)
  - Audit Logs (recent 20)
  - Email Events (recent 20)
- Data is fetched in real-time from PostgreSQL

---

## L. Transaction Creation with Audit Log

### Steps
1. Login as ADMIN or MEMBER user
2. Navigate to /transactions
3. Click "New Transaction"
4. Fill in amount and description
5. Submit form
6. Check audit logs page

### Expected Result
- Transaction created successfully
- Email notification sent (if configured)
- Audit log entry created for CREATE_TRANSACTION action
- Audit log shows user, action, entity, timestamp, IP address

---

## M. Build Process

### Command
```bash
npm run build
```

### Expected Result
- Build completes successfully
- No TypeScript errors
- No linting errors
- Shows "Build successful" or similar
- Creates .next/build directory

---

## N. Linting

### Command
```bash
npm run lint
```

### Expected Result
- Linting completes successfully
- No linting errors
- Or shows only warnings (not errors)

---

## Additional Evidence

### File Structure
- Project directory structure showing all required files
- Particularly show: prisma/, app/, lib/, components/, emails/, docs/

### Environment Configuration
- .env.example file showing required environment variables
- Note: Do not show actual .env file with real secrets

### Package.json
- package.json showing all dependencies and scripts

---

## Evidence Organization

Create a folder named `evidence/` in your project root and organize screenshots as:

```
evidence/
├── 01-prisma-generation.png
├── 02-database-migration.png
├── 03-seed-execution.png
├── 04-database-records.png
├── 05-application-running.png
├── 06-authentication.png
├── 07-authorization-admin.png
├── 08-authorization-member.png
├── 09-authorization-guest.png
├── 10-api-endpoint-test.png
├── 11-email-dispatch.png
├── 12-webhook-event.png
├── 13-database-demo-page.png
├── 14-transaction-creation.png
├── 15-build-process.png
├── 16-linting.png
├── 17-file-structure.png
├── 18-environment-config.png
└── 19-package-json.png
```

---

## Important Notes

1. **Real Evidence Only**: All screenshots must show actual terminal output and application state
2. **Complete Commands**: Include the full command in screenshots
3. **Timestamps**: Ensure screenshots show current date/time
4. **Clear Visibility**: Make sure text is readable in screenshots
5. **Context**: Include enough context in screenshots to prove authenticity
6. **Database State**: Show that database contains real, seeded data
7. **Working Features**: Demonstrate that features actually work, not just that code exists

---

## Verification Checklist

Before submitting, verify you have:

- [ ] Prisma generation screenshot
- [ ] Database migration screenshot
- [ ] Seed execution screenshot with record counts
- [ ] Database records visible in Prisma Studio
- [ ] Application running screenshot
- [ ] Authentication flow screenshots
- [ ] Role-based authorization screenshots for all roles
- [ ] API endpoint test screenshots
- [ ] Email dispatch evidence (terminal or Resend dashboard)
- [ ] Webhook event evidence (if Resend configured)
- [ ] Database demo page with real data
- [ ] Transaction creation with audit log
- [ ] Build process screenshot
- [ ] Linting screenshot
- [ ] File structure screenshot
- [ ] Environment configuration screenshot
- [ ] Package.json screenshot

---

## Troubleshooting

If any step fails:

1. **Database Connection**: Check DATABASE_URL in .env
2. **Migration Failures**: Drop and recreate database, run migrate again
3. **Seed Errors**: Check seed.ts for errors, ensure database is migrated
4. **Build Errors**: Check TypeScript errors, fix import issues
5. **Authentication Issues**: Check BETTER_AUTH_SECRET in .env
6. **Email Issues**: Check RESEND_API_KEY configuration
7. **Port Conflicts**: Ensure port 3000 is available

---

## Final Notes

This evidence documentation ensures that your Assignment 2 implementation can be properly evaluated. The evaluator will use this checklist to verify that:

1. The database schema is properly designed and implemented
2. The seeding process creates real, relational data
3. Authentication and authorization work correctly
4. API endpoints are properly protected
5. Email integration is functional
6. The application builds without errors
7. All required features are implemented

Run each command, capture the evidence, and organize it according to this structure.
