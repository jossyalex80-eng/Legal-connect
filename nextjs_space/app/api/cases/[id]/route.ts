export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const caseData = await prisma.case.findFirst({
      where: { id: params?.id, clientId: session.user.id },
      include: {
        recommendations: {
          include: {
            lawyer: { select: { id: true, name: true, email: true, phone: true, image: true, country: true, state: true, city: true } },
            lawyerProfile: true,
          },
          orderBy: { rank: 'asc' },
        },
      },
    });

    if (!caseData) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    return NextResponse.json({ case: caseData });
  } catch (error: any) {
    console.error('Case detail error:', error);
    return NextResponse.json({ error: 'Failed to fetch case' }, { status: 500 });
  }
}
