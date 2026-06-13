export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { lawyerProfile: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      country: user.country,
      state: user.state,
      city: user.city,
      image: user.image,
      lawyerProfile: user.lawyerProfile,
    });
  } catch (error: any) {
    console.error('Profile error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, country, state, city, lawFirm, barRegistrationNumber, yearsExperience, practiceAreas, bio, consultationFee, officeAddress, languagesSpoken, profilePhotoUrl, profilePhotoPath, profilePhotoIsPublic } = body ?? {};

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name ?? undefined,
        phone: phone ?? undefined,
        country: country ?? undefined,
        state: state ?? undefined,
        city: city ?? undefined,
      },
    });

    const role = (session.user as any)?.role;
    if (role === 'lawyer') {
      await prisma.lawyerProfile.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          lawFirm: lawFirm ?? null,
          barRegistrationNumber: barRegistrationNumber ?? null,
          yearsExperience: parseInt(yearsExperience ?? '0', 10) || 0,
          practiceAreas: practiceAreas ?? [],
          bio: bio ?? null,
          consultationFee: parseFloat(consultationFee ?? '0') || null,
          officeAddress: officeAddress ?? null,
          languagesSpoken: languagesSpoken ?? ['English'],
          profilePhotoUrl: profilePhotoUrl ?? null,
          profilePhotoPath: profilePhotoPath ?? null,
          profilePhotoIsPublic: profilePhotoIsPublic ?? true,
        },
        update: {
          lawFirm: lawFirm ?? undefined,
          barRegistrationNumber: barRegistrationNumber ?? undefined,
          yearsExperience: yearsExperience !== undefined ? (parseInt(yearsExperience, 10) || 0) : undefined,
          practiceAreas: practiceAreas ?? undefined,
          bio: bio ?? undefined,
          consultationFee: consultationFee !== undefined ? (parseFloat(consultationFee) || null) : undefined,
          officeAddress: officeAddress ?? undefined,
          languagesSpoken: languagesSpoken ?? undefined,
          profilePhotoUrl: profilePhotoUrl ?? undefined,
          profilePhotoPath: profilePhotoPath ?? undefined,
          profilePhotoIsPublic: profilePhotoIsPublic ?? undefined,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
