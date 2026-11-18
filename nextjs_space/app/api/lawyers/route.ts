export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') ?? '';
    const practiceArea = searchParams.get('practiceArea') ?? '';
    const country = searchParams.get('country') ?? '';
    const state = searchParams.get('state') ?? '';
    const city = searchParams.get('city') ?? '';
    const minExperience = parseInt(searchParams.get('minExperience') ?? '0', 10);
    const maxFee = parseFloat(searchParams.get('maxFee') ?? '0');
    const minRating = parseFloat(searchParams.get('minRating') ?? '0');
    const sortBy = searchParams.get('sortBy') ?? 'rating';
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const limit = parseInt(searchParams.get('limit') ?? '12', 10);

    // Always require approved verification — unapproved lawyers must not appear publicly
    const profileFilter: any = { verificationStatus: 'approved' };
    if (minExperience > 0) profileFilter.yearsExperience = { gte: minExperience };
    if (maxFee > 0) profileFilter.consultationFee = { lte: maxFee };
    if (minRating > 0) profileFilter.rating = { gte: minRating };

    const where: any = {
      role: 'lawyer',
      lawyerProfile: { is: profileFilter },
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { lawyerProfile: { lawFirm: { contains: search, mode: 'insensitive' } } },
        { lawyerProfile: { bio: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (country) where.country = country;
    if (state) where.state = state;
    if (city) where.city = city;

    let orderBy: any = { lawyerProfile: { rating: 'desc' } };
    if (sortBy === 'experience') orderBy = { lawyerProfile: { yearsExperience: 'desc' } };
    if (sortBy === 'fee_low') orderBy = { lawyerProfile: { consultationFee: 'asc' } };
    if (sortBy === 'newest') orderBy = { createdAt: 'desc' };

    const [lawyers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: { lawyerProfile: true },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    // Filter by practice area in-memory since it's a JSON field
    let filtered = lawyers;
    if (practiceArea) {
      filtered = lawyers.filter((l: any) => {
        const areas = l?.lawyerProfile?.practiceAreas ?? [];
        return Array.isArray(areas) && areas.includes(practiceArea);
      });
    }

    const sanitized = filtered.map((l: any) => ({
      id: l?.id,
      name: l?.name,
      email: l?.email,
      country: l?.country,
      state: l?.state,
      city: l?.city,
      image: l?.image,
      lawyerProfile: l?.lawyerProfile ? {
        id: l.lawyerProfile.id,
        lawFirm: l.lawyerProfile.lawFirm,
        yearsExperience: l.lawyerProfile.yearsExperience,
        practiceAreas: l.lawyerProfile.practiceAreas,
        bio: l.lawyerProfile.bio,
        consultationFee: l.lawyerProfile.consultationFee,
        profilePhotoUrl: l.lawyerProfile.profilePhotoUrl,
        rating: l.lawyerProfile.rating,
        totalCasesCompleted: l.lawyerProfile.totalCasesCompleted,
        barRegistrationNumber: l.lawyerProfile.barRegistrationNumber,
        languagesSpoken: l.lawyerProfile.languagesSpoken,
        officeAddress: l.lawyerProfile.officeAddress,
        verificationStatus: l.lawyerProfile.verificationStatus,
      } : null,
    }));

    return NextResponse.json({ lawyers: sanitized, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error: any) {
    console.error('Lawyers API error:', error);
    return NextResponse.json({ error: 'Failed to fetch lawyers' }, { status: 500 });
  }
}
