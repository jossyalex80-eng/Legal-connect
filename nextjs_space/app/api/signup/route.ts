export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, fullName, phone, country, state, city, role, lawFirm, barRegistrationNumber, yearsExperience, practiceAreas, bio, consultationFee } = body ?? {};

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: 'Email, password, and full name are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const userRole = role === 'lawyer' ? 'lawyer' : 'client';

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: fullName,
        phone: phone ?? null,
        role: userRole,
        country: country ?? null,
        state: state ?? null,
        city: city ?? null,
      },
    });

    if (userRole === 'lawyer') {
      await prisma.lawyerProfile.create({
        data: {
          userId: user.id,
          lawFirm: lawFirm ?? null,
          barRegistrationNumber: barRegistrationNumber ?? null,
          yearsExperience: parseInt(yearsExperience ?? '0', 10) || 0,
          practiceAreas: practiceAreas ?? [],
          bio: bio ?? null,
          consultationFee: parseFloat(consultationFee ?? '0') || null,
        },
      });
    }

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
