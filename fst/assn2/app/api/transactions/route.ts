import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { canCreateTransaction } from '@/lib/authorization';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createTransactionSchema = z.object({
  amount: z.number().positive(),
  description: z.string().min(1).max(500),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { data: null, errors: ['Unauthorized'] },
        { status: 401 }
      );
    }

    // Get user with role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { role: true },
    });

    if (!user) {
      return NextResponse.json(
        { data: null, errors: ['User not found'] },
        { status: 404 }
      );
    }

    // Build query based on role
    const where = user.role?.name === 'ADMIN' 
      ? {} 
      : { userId: user.id };

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      data: transactions,
      errors: null,
      meta: { count: transactions.length },
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { data: null, errors: ['Internal server error'] },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { data: null, errors: ['Unauthorized'] },
        { status: 401 }
      );
    }

    // Get user with role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { role: true },
    });

    if (!user) {
      return NextResponse.json(
        { data: null, errors: ['User not found'] },
        { status: 404 }
      );
    }

    // Check authorization
    if (!canCreateTransaction({ id: user.id, email: user.email, name: user.name, role: user.role?.name ?? 'GUEST' })) {
      return NextResponse.json(
        { data: null, errors: ['Forbidden: Insufficient permissions'] },
        { status: 403 }
      );
    }

    // Validate request body
    const body = await request.json();
    const validatedData = createTransactionSchema.parse(body);

    // Create transaction with audit log
    const transaction = await prisma.$transaction(async (tx) => {
      const newTransaction = await tx.transaction.create({
        data: {
          userId: user.id,
          amount: validatedData.amount,
          description: validatedData.description,
          status: 'PENDING',
          metadata: validatedData.metadata ? JSON.stringify(validatedData.metadata) : null,
        },
      });

      // Create audit log
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'CREATE_TRANSACTION',
          entityType: 'Transaction',
          entityId: newTransaction.id,
          metadata: JSON.stringify({
            amount: validatedData.amount,
            description: validatedData.description,
          }),
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
        },
      });

      return newTransaction;
    });

    return NextResponse.json({
      data: transaction,
      errors: null,
      meta: { message: 'Transaction created successfully' },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { data: null, errors: error.issues.map((e: z.ZodIssue) => e.message) },
        { status: 400 }
      );
    }

    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { data: null, errors: ['Internal server error'] },
      { status: 500 }
    );
  }
}
