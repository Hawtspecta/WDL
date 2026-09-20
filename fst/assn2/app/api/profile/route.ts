import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ data: null, errors: ['Unauthorized'] }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { role: true },
    });

    if (!user) {
      return NextResponse.json({ data: null, errors: ['User not found'] }, { status: 404 });
    }

    const totalTransactions = await prisma.transaction.count({ where: { userId: user.id } });
    const recentActivity = await prisma.auditLog.count({
      where: {
        userId: user.id,
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    });

    return NextResponse.json({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role?.name ?? 'GUEST',
        createdAt: user.createdAt,
        stats: {
          totalTransactions,
          recentActivity,
        },
      },
      errors: null,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ data: null, errors: ['Internal server error'] }, { status: 500 });
  }
}
