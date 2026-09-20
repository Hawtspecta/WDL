import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { canViewAuditLogs } from '@/lib/authorization';
import { prisma } from '@/lib/prisma';

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

    // Check authorization - only admins can view audit logs
    if (!canViewAuditLogs({ id: user.id, email: user.email, name: user.name, role: user.role?.name ?? 'GUEST' })) {
      return NextResponse.json(
        { data: null, errors: ['Forbidden: Insufficient permissions'] },
        { status: 403 }
      );
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const entityType = searchParams.get('entityType');
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const where: Record<string, unknown> = {};
    if (action) where.action = action;
    if (entityType) where.entityType = entityType;
    if (userId) where.userId = userId;

    const auditLogs = await prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await prisma.auditLog.count({ where });

    return NextResponse.json({
      data: auditLogs,
      errors: null,
      meta: {
        count: auditLogs.length,
        total,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { data: null, errors: ['Internal server error'] },
      { status: 500 }
    );
  }
}
