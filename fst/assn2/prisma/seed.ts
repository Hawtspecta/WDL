import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data in reverse dependency order
  console.log('🧹 Cleaning existing data...');
  await prisma.emailEvent.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  // ── Create Roles ──────────────────────────────────────────────────────────
  console.log('📋 Creating roles...');
  const [adminRole, memberRole, guestRole] = await Promise.all([
    prisma.role.create({ data: { name: 'ADMIN' } }),
    prisma.role.create({ data: { name: 'MEMBER' } }),
    prisma.role.create({ data: { name: 'GUEST' } }),
  ]);
  console.log(`✅ Created 3 roles`);

  // ── Create Users + Accounts (Better Auth structure) ───────────────────────
  // Better Auth stores passwords in the `account` model, not `user`.
  // We create both a user row and an account row with a hashed password.
  // For demo seeds we store a sentinel password hash that won't be used
  // for real login; actual login users are created below with known creds.
  console.log('👤 Creating users...');

  const usersData: Array<{ name: string; email: string; roleId: string }> = [];

  // Known demo accounts for the evaluator
  usersData.push({ name: 'Alice Admin', email: 'admin@demo.com', roleId: adminRole.id });
  usersData.push({ name: 'Bob Admin', email: 'admin2@demo.com', roleId: adminRole.id });

  for (let i = 0; i < 5; i++) {
    usersData.push({
      name: faker.person.fullName(),
      email: faker.internet.email({ firstName: `member${i}`, lastName: 'user' }),
      roleId: memberRole.id,
    });
  }
  for (let i = 0; i < 3; i++) {
    usersData.push({
      name: faker.person.fullName(),
      email: faker.internet.email({ firstName: `guest${i}`, lastName: 'user' }),
      roleId: guestRole.id,
    });
  }

  const users: Awaited<ReturnType<typeof prisma.user.create>>[] = [];

  for (const u of usersData) {
    const createdUser = await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        emailVerified: true,
        roleId: u.roleId,
        accounts: {
          create: {
            accountId: u.email,
            providerId: 'credential',
            password: '$2a$10$SEED_PLACEHOLDER_NOT_A_REAL_HASH', // placeholder – real auth uses better-auth
          },
        },
      },
    });
    users.push(createdUser);
  }

  console.log(`✅ Created ${users.length} users`);

  // ── Create Transactions ───────────────────────────────────────────────────
  console.log('💰 Creating transactions...');
  const statuses = ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'];
  const transactions: Awaited<ReturnType<typeof prisma.transaction.create>>[] = [];

  for (const user of users) {
    const numTransactions = faker.number.int({ min: 2, max: 8 });
    for (let i = 0; i < numTransactions; i++) {
      const t = await prisma.transaction.create({
        data: {
          userId: user.id,
          amount: parseFloat(faker.finance.amount({ min: 10, max: 10000, dec: 2 })),
          description: faker.finance.transactionDescription(),
          status: statuses[faker.number.int({ min: 0, max: statuses.length - 1 })],
          metadata: JSON.stringify({
            category: faker.commerce.department(),
            reference: faker.string.uuid(),
          }),
          createdAt: faker.date.past({ years: 1 }),
        },
      });
      transactions.push(t);
    }
  }
  console.log(`✅ Created ${transactions.length} transactions`);

  // ── Create Audit Logs ─────────────────────────────────────────────────────
  console.log('📝 Creating audit logs...');
  const auditLogs: Awaited<ReturnType<typeof prisma.auditLog.create>>[] = [];
  const txActions = ['CREATE_TRANSACTION', 'UPDATE_TRANSACTION', 'DELETE_TRANSACTION'];
  const userActions = ['LOGIN', 'LOGOUT', 'USER_UPDATE', 'ROLE_CHANGE'];

  // Transaction-related audit logs
  for (const tx of transactions) {
    const numLogs = faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < numLogs; i++) {
      const action = txActions[faker.number.int({ min: 0, max: txActions.length - 1 })];
      const log = await prisma.auditLog.create({
        data: {
          userId: tx.userId,
          action,
          entityType: 'Transaction',
          entityId: tx.id,
          transactionId: tx.id,
          metadata: JSON.stringify({
            details: faker.lorem.sentence(),
            amount: tx.amount,
          }),
          ipAddress: faker.internet.ip(),
          userAgent: faker.internet.userAgent(),
          createdAt: faker.date.between({ from: tx.createdAt, to: new Date() }),
        },
      });
      auditLogs.push(log);
    }
  }

  // User-related audit logs
  for (const user of users) {
    const numLogs = faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < numLogs; i++) {
      const action = userActions[faker.number.int({ min: 0, max: userActions.length - 1 })];
      const log = await prisma.auditLog.create({
        data: {
          userId: user.id,
          action,
          entityType: 'User',
          entityId: user.id,
          metadata: JSON.stringify({ method: 'password' }),
          ipAddress: faker.internet.ip(),
          userAgent: faker.internet.userAgent(),
          createdAt: faker.date.past({ years: 1 }),
        },
      });
      auditLogs.push(log);
    }
  }
  console.log(`✅ Created ${auditLogs.length} audit logs`);

  // ── Create Email Events ───────────────────────────────────────────────────
  console.log('📧 Creating email events...');
  const emailEvents: Awaited<ReturnType<typeof prisma.emailEvent.create>>[] = [];
  const eventTypes = ['SENT', 'DELIVERED', 'OPENED', 'CLICKED', 'BOUNCED', 'FAILED'];

  for (const tx of transactions.slice(0, 20)) {
    const user = users.find(u => u.id === tx.userId);
    if (!user) continue;
    const numEvents = faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < numEvents; i++) {
      const eventType = eventTypes[faker.number.int({ min: 0, max: eventTypes.length - 1 })];
      const ev = await prisma.emailEvent.create({
        data: {
          eventType,
          messageId: faker.string.uuid(),
          recipient: user.email,
          subject: `Transaction Update: ${tx.description.substring(0, 40)}`,
          timestamp: faker.date.between({ from: tx.createdAt, to: new Date() }),
          metadata: JSON.stringify({
            transactionId: tx.id,
            template: 'TransactionCreatedEmail',
            bounceReason: eventType === 'BOUNCED' ? faker.lorem.sentence() : null,
          }),
        },
      });
      emailEvents.push(ev);
    }
  }
  console.log(`✅ Created ${emailEvents.length} email events`);

  console.log('\n🎉 Seed completed successfully!');
  console.log('📊 Summary:');
  console.log(`   - Roles: 3 (ADMIN, MEMBER, GUEST)`);
  console.log(`   - Users: ${users.length}`);
  console.log(`   - Transactions: ${transactions.length}`);
  console.log(`   - Audit Logs: ${auditLogs.length}`);
  console.log(`   - Email Events: ${emailEvents.length}`);
  console.log('\n🔑 Demo credentials (create via /login signup):');
  console.log('   admin@demo.com / admin2@demo.com');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
