export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/lawyer/dashboard — returns matched cases + stats for the logged-in lawyer
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || (session.user as any).role !== 'lawyer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const lawyerId = session.user.id;

    const [profile, recommendations, totalMatches] = await Promise.all([
      prisma.lawyerProfile.findFirst({
        where: { userId: lawyerId },
      }),
      prisma.caseRecommendation.findMany({
        where: { lawyerId },
        include: {
          case: {
            include: {
              client: {
                select: { name: true, email: true, city: true, state: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      prisma.caseRecommendation.count({ where: { lawyerId } }),
    ]);

    // Profile completeness check
    const completenessFields = [
      profile?.bio,
      profile?.barRegistrationNumber,
      profile?.lawFirm,
      profile?.officeAddress,
      profile?.consultationFee,
      Array.isArray(profile?.practiceAreas) && (profile.practiceAreas as string[]).length > 0,
    ];
    const completedFields = completenessFields.filter(Boolean).length;
    const profileCompleteness = Math.round((completedFields / completenessFields.length) * 100);

    // Group recommendations by rank for quick stats
    const rank1Matches = recommendations.filter((r) => r.rank === 1).length;

    const matchedCases = recommendations.map((rec) => ({
      recommendationId: rec.id,
      rank: rec.rank,
      matchPercentage: rec.matchPercentage,
      matchReason: rec.matchReason,
      createdAt: rec.createdAt,
      case: {
        id: rec.case.id,
        title: rec.case.title,
        description: rec.case.description,
        legalCategory: rec.case.legalCategory,
        urgencyLevel: rec.case.urgencyLevel,
        budgetRange: rec.case.budgetRange,
        status: rec.case.status,
        city: rec.case.city,
        state: rec.case.state,
        createdAt: rec.case.createdAt,
        client: rec.case.client,
      },
    }));

    return NextResponse.json({
      profile,
      stats: {
        totalMatches,
        topMatches: rank1Matches,
        profileCompleteness,
        verificationStatus: profile?.verificationStatus ?? 'pending',
        rating: profile?.rating ?? 5.0,
        totalCasesCompleted: profile?.totalCasesCompleted ?? 0,
      },
      matchedCases,
    });
  } catch (error) {
    console.error('Lawyer dashboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
