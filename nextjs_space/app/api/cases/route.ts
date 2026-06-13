export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const role = (session.user as any)?.role;
    let cases;

    if (role === 'lawyer') {
      // Lawyers see cases matched to them
      const recommendations = await prisma.caseRecommendation.findMany({
        where: { lawyerId: session.user.id },
        include: {
          case: {
            include: { client: { select: { id: true, name: true, email: true, city: true, state: true, country: true } } },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      cases = recommendations.map((r: any) => ({
        ...r?.case,
        matchPercentage: r?.matchPercentage,
        matchReason: r?.matchReason,
        rank: r?.rank,
      }));
    } else {
      cases = await prisma.case.findMany({
        where: { clientId: session.user.id },
        include: {
          recommendations: {
            include: {
              lawyer: { select: { id: true, name: true, image: true } },
              lawyerProfile: true,
            },
            orderBy: { rank: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json({ cases });
  } catch (error: any) {
    console.error('Cases API error:', error);
    return NextResponse.json({ error: 'Failed to fetch cases' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, legalCategory, urgencyLevel, budgetRange, country, state, city, preferredConsultationMethod, supportingDocuments } = body ?? {};

    if (!title || !description || !legalCategory) {
      return NextResponse.json({ error: 'Title, description, and legal category are required' }, { status: 400 });
    }

    const newCase = await prisma.case.create({
      data: {
        clientId: session.user.id,
        title,
        description,
        legalCategory,
        urgencyLevel: urgencyLevel ?? 'Normal',
        budgetRange: budgetRange ?? null,
        country: country ?? null,
        state: state ?? null,
        city: city ?? null,
        preferredConsultationMethod: preferredConsultationMethod ?? null,
        supportingDocuments: supportingDocuments ?? [],
        status: 'submitted',
      },
    });

    return NextResponse.json({ success: true, case: newCase });
  } catch (error: any) {
    console.error('Create case error:', error);
    return NextResponse.json({ error: 'Failed to create case' }, { status: 500 });
  }
}
