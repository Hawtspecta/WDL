import { PrismaClient, UserRole, TransactionStatus, AuditAction, EmailEventType } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.emailEvent.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  // Create Roles
  console.log('📋 Creating roles...');
  const roles = await Promise.all([
    prisma.role.create({
      data: { name: UserRole.ADMIN },
    }),
    prisma.role.create({
      data: { name: UserRole.MEMBER },
    }),
    prisma.role.create({
      data: { name: UserRole.GUEST },
    }),
  ]);

  console.log(`✅ Created ${roles.length} roles`);

  // Create Users
  console.log('👤 Creating users...');
  const users = [];
  
  // Create admin users
  for (let i = 0; i < 2; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email({ firstName: `admin${i}`, lastName: 'user' }),
        name: faker.person.fullName(),
        password: 'hashed_password_here', // In production, use proper hashing
        roleId: roles.find(r => r.name === UserRole.ADMIN)!.id,
      },
    });
    users.push(user);
  }

  // Create member users
  for (let i = 0; i < 5; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email({ firstName: `member${i}`, lastName: 'user' }),
        name: faker.person.fullName(),
        password: 'hashed_password_here',
        roleId: roles.find(r => r.name === UserRole.MEMBER)!.id,
      },
    });
    users.push(user);
  }

  // Create guest users
  for (let i = 0; i < 3; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email({ firstName: `guest${i}`, lastName: 'user' }),
        name: faker.person.fullName(),
        password: 'hashed_password_here',
        roleId: roles.find(r => r.name === UserRole.GUEST)!.id,
      },
    });
    users.push(user);
  }

  console.log(`✅ Created ${users.length} users`);

  // Create Transactions
  console.log('💰 Creating transactions...');
  const transactions = [];
  const statuses = Object.values(TransactionStatus);

  for (const user of users) {
    const numTransactions = faker.number.int({ min: 2, max: 8 });
    
    for (let i = 0; i < numTransactions; i++) {
      const transaction = await prisma.transaction.create({
        data: {
          userId: user.id,
          amount: parseFloat(faker.finance.amount({ min: 10, max: 10000, dec: 2 })),
          description: faker.finance.transactionDescription(),
          status: statuses[faker.number.int({ min: 0, max: statuses.length - 1 })],
          metadata: {
            category: faker.commerce.department(),
            reference: faker.string.uuid(),
          },
          createdAt: faker.date.past({ years: 1 }),
        },
      });
      transactions.push(transaction);
    }
  }

  console.log(`✅ Created ${transactions.length} transactions`);

  // Create Audit Logs
  console.log('📝 Creating audit logs...');
  const auditLogs = [];
  const actions = Object.values(AuditAction);

  for (const transaction of transactions) {
    const numLogs = faker.number.int({ min: 1, max: 3 });
    
    for (let i = 0; i < numLogs; i++) {
      const action = actions[faker.number.int({ min: 0, max: actions.length - 1 })];
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: transaction.userId,
          action: action,
          entityType: 'Transaction',
          entityId: transaction.id,
          metadata: {
            details: faker.lorem.sentence(),
            previousState: i > 0 ? faker.lorem.word() : null,
          },
          ipAddress: faker.internet.ip(),
          userAgent: faker.internet.userAgent(),
          createdAt: faker.date.between({
            from: transaction.createdAt,
            to: new Date(),
          }),
        },
      });
      auditLogs.push(auditLog);
    }
  }

  // Add some user-related audit logs
  for (const user of users) {
    const numLogs = faker.number.int({ min: 1, max: 2 });
    
    for (let i = 0; i < numLogs; i++) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: AuditAction.LOGIN,
          entityType: 'User',
          entityId: user.id,
          metadata: {
            loginMethod: 'password',
          },
          ipAddress: faker.internet.ip(),
          userAgent: faker.internet.userAgent(),
          createdAt: faker.date.past({ months: 6 }),
        },
      });
      auditLogs.push(auditLog);
    }
  }

  console.log(`✅ Created ${auditLogs.length} audit logs`);

  // Create Email Events
  console.log('📧 Creating email events...');
  const emailEvents = [];
  const eventTypes = Object.values(EmailEventType);

  for (const transaction of transactions.slice(0, 20)) {
    const user = users.find(u => u.id === transaction.userId);
    if (!user) continue;

    const numEvents = faker.number.int({ min: 1, max: 3 });
    
    for (let i = 0; i < numEvents; i++) {
      const eventType = eventTypes[faker.number.int({ min: 0, max: eventTypes.length - 1 })];
      const emailEvent = await prisma.emailEvent.create({
        data: {
          eventType: eventType,
          messageId: faker.string.uuid(),
          recipient: user.email,
          subject: `Transaction Update: ${transaction.description.substring(0, 30)}...`,
          timestamp: faker.date.between({
            from: transaction.createdAt,
            to: new Date(),
          }),
          metadata: {
            transactionId: transaction.id,
            template: 'TransactionUpdate',
            bounceReason: eventType === EmailEventType.BOUNCED ? faker.lorem.sentence() : null,
          },
        },
      });
      emailEvents.push(emailEvent);
    }
  }

  console.log(`✅ Created ${emailEvents.length} email events`);

  console.log('🎉 Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Roles: ${roles.length}`);
  console.log(`   - Users: ${users.length}`);
  console.log(`   - Transactions: ${transactions.length}`);
  console.log(`   - Audit Logs: ${auditLogs.length}`);
  console.log(`   - Email Events: ${emailEvents.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
