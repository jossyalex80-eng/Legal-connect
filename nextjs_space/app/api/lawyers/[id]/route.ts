export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const lawyer = await prisma.user.findFirst({
      where: {
        id: params?.id,
        role: 'lawyer',
        // Only surface approved lawyers publicly
        lawyerProfile: { is: { verificationStatus: 'approved' } },
      },
      include: { lawyerProfile: true },
    });

    if (!lawyer || !lawyer.lawyerProfile) {
      return NextResponse.json({ error: 'Lawyer not found' }, { status: 404 });
    }

    // Email and phone are only returned to authenticated users (clients or the lawyer themselves)
    const session = await getServerSession(authOptions);
    const isAuthenticated = !!session?.user;

    return NextResponse.json({
      id: lawyer.id,
      name: lawyer.name,
      // Sensitive contact info — authenticated only
      ...(isAuthenticated && { email: lawyer.email }),
      ...(isAuthenticated && lawyer.phone ? { phone: lawyer.phone } : {}),
      country: lawyer.country,
      state: lawyer.state,
      city: lawyer.city,
      image: lawyer.image,
      lawyerProfile: {
        id: lawyer.lawyerProfile.id,
        lawFirm: lawyer.lawyerProfile.lawFirm,
        yearsExperience: lawyer.lawyerProfile.yearsExperience,
        practiceAreas: lawyer.lawyerProfile.practiceAreas,
        bio: lawyer.lawyerProfile.bio,
        consultationFee: lawyer.lawyerProfile.consultationFee,
        profilePhotoUrl: lawyer.lawyerProfile.profilePhotoUrl,
        rating: lawyer.lawyerProfile.rating,
        totalCasesCompleted: lawyer.lawyerProfile.totalCasesCompleted,
        barRegistrationNumber: lawyer.lawyerProfile.barRegistrationNumber,
        languagesSpoken: lawyer.lawyerProfile.languagesSpoken,
        officeAddress: lawyer.lawyerProfile.officeAddress,
        verificationStatus: lawyer.lawyerProfile.verificationStatus,
      },
    });
  } catch (error: any) {
    console.error('Lawyer detail error:', error);
    return NextResponse.json({ error: 'Failed to fetch lawyer' }, { status: 500 });
  }
}
