import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { canAccessResource } from '@/lib/authorization';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateTransactionSchema = z.object({
  amount: z.number().positive().optional(),
  description: z.string().min(1).max(500).optional(),
  status: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        auditLogs: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { data: null, errors: ['Transaction not found'] },
        { status: 404 }
      );
    }

    const userRole = user.role?.name || 'GUEST';

    // Check authorization
    if (!canAccessResource({ id: user.id, email: user.email, name: user.name, role: userRole }, transaction.userId)) {
      return NextResponse.json(
        { data: null, errors: ['Forbidden: Insufficient permissions'] },
        { status: 403 }
      );
    }

    return NextResponse.json({
      data: transaction,
      errors: null,
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(
      { data: null, errors: ['Internal server error'] },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const existingTransaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existingTransaction) {
      return NextResponse.json(
        { data: null, errors: ['Transaction not found'] },
        { status: 404 }
      );
    }

    const userRole = user.role?.name || 'GUEST';

    // Check authorization
    if (!canAccessResource({ id: user.id, email: user.email, name: user.name, role: userRole }, existingTransaction.userId)) {
      return NextResponse.json(
        { data: null, errors: ['Forbidden: Insufficient permissions'] },
        { status: 403 }
      );
    }

    // Validate request body
    const body = await request.json();
    const validatedData = updateTransactionSchema.parse(body);

    // Update transaction with audit log
    const transaction = await prisma.$transaction(async (tx) => {
      const updatedTransaction = await tx.transaction.update({
        where: { id },
        data: {
          ...validatedData,
          metadata: validatedData.metadata ? JSON.stringify(validatedData.metadata) : null,
        },
      });

      // Create audit log
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'UPDATE_TRANSACTION',
          entityType: 'Transaction',
          entityId: updatedTransaction.id,
          metadata: JSON.stringify({
            changes: validatedData,
            previousState: existingTransaction,
          }),
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
        },
      });

      return updatedTransaction;
    });

    return NextResponse.json({
      data: transaction,
      errors: null,
      meta: { message: 'Transaction updated successfully' },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { data: null, errors: error.issues.map((e: z.ZodIssue) => e.message) },
        { status: 400 }
      );
    }

    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { data: null, errors: ['Internal server error'] },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const existingTransaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existingTransaction) {
      return NextResponse.json(
        { data: null, errors: ['Transaction not found'] },
        { status: 404 }
      );
    }

    const userRole = user.role?.name || 'GUEST';

    // Check authorization - only admins can delete
    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { data: null, errors: ['Forbidden: Insufficient permissions'] },
        { status: 403 }
      );
    }

    // Delete transaction with audit log
    await prisma.$transaction(async (tx) => {
      await tx.transaction.delete({
        where: { id },
      });

      // Create audit log
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'DELETE_TRANSACTION',
          entityType: 'Transaction',
          entityId: id,
          metadata: JSON.stringify({
            deletedTransaction: existingTransaction,
          }),
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
        },
      });
    });

    return NextResponse.json({
      data: null,
      errors: null,
      meta: { message: 'Transaction deleted successfully' },
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { data: null, errors: ['Internal server error'] },
      { status: 500 }
    );
  }
}
