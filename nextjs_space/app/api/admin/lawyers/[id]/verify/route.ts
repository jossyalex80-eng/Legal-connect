export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PATCH /api/admin/lawyers/[id]/verify — approve or reject a lawyer profile
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { action } = body; // 'approve' | 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action. Use "approve" or "reject".' }, { status: 400 });
    }

    const lawyerProfile = await prisma.lawyerProfile.findFirst({
      where: { userId: params.id },
    });

    if (!lawyerProfile) {
      return NextResponse.json({ error: 'Lawyer profile not found' }, { status: 404 });
    }

    const updated = await prisma.lawyerProfile.update({
      where: { id: lawyerProfile.id },
      data: { verificationStatus: action === 'approve' ? 'approved' : 'rejected' },
    });

    return NextResponse.json({ success: true, verificationStatus: updated.verificationStatus });
  } catch (error) {
    console.error('Admin verify lawyer error:', error);
    return NextResponse.json({ error: 'Failed to update verification status' }, { status: 500 });
  }
}
