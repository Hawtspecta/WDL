'use server';

import { auth } from '@/lib/auth/config';
import { headers } from 'next/headers';
import { canCreateTransaction } from '@/lib/authorization';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { sendTransactionEmail } from '@/lib/email/resend';

const createTransactionSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  metadata: z.record(z.string(), z.any()).optional(),
});

export async function createTransaction(formData: FormData) {
  try {
    // Get session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false,
        errors: ['Unauthorized: Please log in'],
      };
    }

    // Get user with role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { role: true },
    });

    if (!user) {
      return {
        success: false,
        errors: ['User not found'],
      };
    }

    const userRoleName = user.role?.name || 'GUEST';

    // Check authorization
    if (!canCreateTransaction({ id: user.id, email: user.email, name: user.name, role: userRoleName })) {
      return {
        success: false,
        errors: ['Forbidden: Insufficient permissions to create transactions'],
      };
    }

    // Extract and validate form data
    const amount = parseFloat(formData.get('amount') as string);
    const description = formData.get('description') as string;
    const metadata = formData.get('metadata') ? JSON.parse(formData.get('metadata') as string) : undefined;

    const validatedData = createTransactionSchema.parse({
      amount,
      description,
      metadata,
    });

    const headerObj = await headers();

    // Create transaction with audit log using Prisma transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the transaction
      const transaction = await tx.transaction.create({
        data: {
          userId: user.id,
          amount: validatedData.amount,
          description: validatedData.description,
          status: 'PENDING',
          metadata: validatedData.metadata ? JSON.stringify(validatedData.metadata) : null,
        },
      });

      // Create audit log
      const auditLog = await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'CREATE_TRANSACTION',
          entityType: 'Transaction',
          entityId: transaction.id,
          metadata: JSON.stringify({
            amount: validatedData.amount,
            description: validatedData.description,
          }),
          ipAddress: headerObj.get('x-forwarded-for') || headerObj.get('x-real-ip') || 'unknown',
          userAgent: headerObj.get('user-agent') || 'unknown',
        },
      });

      return { transaction, auditLog };
    });

    // Send email notification after successful database transaction
    try {
      await sendTransactionEmail({
        to: user.email,
        userName: user.name,
        transactionId: result.transaction.id,
        amount: result.transaction.amount,
        description: result.transaction.description,
        status: result.transaction.status,
      });
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
    }

    return {
      success: true,
      data: result.transaction,
      message: 'Transaction created successfully',
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map((e: z.ZodIssue) => e.message),
      };
    }

    console.error('Error creating transaction:', error);
    return {
      success: false,
      errors: ['Failed to create transaction. Please try again.'],
    };
  }
}

export async function updateTransaction(transactionId: string, formData: FormData) {
  try {
    // Get session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false,
        errors: ['Unauthorized: Please log in'],
      };
    }

    // Get user with role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { role: true },
    });

    if (!user) {
      return {
        success: false,
        errors: ['User not found'],
      };
    }

    const userRoleName = user.role?.name || 'GUEST';

    // Get existing transaction
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!existingTransaction) {
      return {
        success: false,
        errors: ['Transaction not found'],
      };
    }

    // Check authorization (user can only update their own transactions unless admin)
    if (userRoleName !== 'ADMIN' && existingTransaction.userId !== user.id) {
      return {
        success: false,
        errors: ['Forbidden: You can only update your own transactions'],
      };
    }

    // Extract and validate form data
    const amount = formData.get('amount') ? parseFloat(formData.get('amount') as string) : undefined;
    const description = formData.get('description') as string || undefined;
    const status = formData.get('status') as string || undefined;

    const updateData: Record<string, unknown> = {};
    if (amount !== undefined) updateData.amount = amount;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (formData.get('metadata')) {
      updateData.metadata = JSON.stringify(JSON.parse(formData.get('metadata') as string));
    }

    const headerObj = await headers();

    // Update transaction with audit log
    const result = await prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.update({
        where: { id: transactionId },
        data: updateData,
      });

      // Create audit log
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'UPDATE_TRANSACTION',
          entityType: 'Transaction',
          entityId: transaction.id,
          metadata: JSON.stringify({
            changes: updateData,
            previousState: existingTransaction,
          }),
          ipAddress: headerObj.get('x-forwarded-for') || headerObj.get('x-real-ip') || 'unknown',
          userAgent: headerObj.get('user-agent') || 'unknown',
        },
      });

      return transaction;
    });

    return {
      success: true,
      data: result,
      message: 'Transaction updated successfully',
    };
  } catch (error) {
    console.error('Error updating transaction:', error);
    return {
      success: false,
      errors: ['Failed to update transaction. Please try again.'],
    };
  }
}
