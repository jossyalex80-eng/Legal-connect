export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/lawyers — list all lawyers with their profiles and verification status
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'pending' | 'approved' | 'rejected' | null (all)

    const lawyers = await prisma.user.findMany({
      where: {
        role: 'lawyer',
        ...(status ? { lawyerProfile: { is: { verificationStatus: status } } } : {}),
      },
      include: {
        lawyerProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ lawyers });
  } catch (error) {
    console.error('Admin lawyers list error:', error);
    return NextResponse.json({ error: 'Failed to fetch lawyers' }, { status: 500 });
  }
}
