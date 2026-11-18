export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const [
      totalUsers,
      totalClients,
      totalLawyers,
      pendingLawyers,
      approvedLawyers,
      totalCases,
      submittedCases,
      analyzingCases,
      recommendedCases,
      totalRecommendations,
      recentCases,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'client' } }),
      prisma.user.count({ where: { role: 'lawyer' } }),
      prisma.lawyerProfile.count({ where: { verificationStatus: 'pending' } }),
      prisma.lawyerProfile.count({ where: { verificationStatus: 'approved' } }),
      prisma.case.count(),
      prisma.case.count({ where: { status: 'submitted' } }),
      prisma.case.count({ where: { status: 'analyzing' } }),
      prisma.case.count({ where: { status: 'recommended' } }),
      prisma.caseRecommendation.count(),
      prisma.case.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { client: { select: { name: true, email: true } } },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      }),
    ]);

    return NextResponse.json({
      users: { total: totalUsers, clients: totalClients, lawyers: totalLawyers },
      lawyers: { pending: pendingLawyers, approved: approvedLawyers },
      cases: {
        total: totalCases,
        submitted: submittedCases,
        analyzing: analyzingCases,
        recommended: recommendedCases,
      },
      totalRecommendations,
      recentCases,
      recentUsers,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
