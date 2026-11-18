import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Admin account — CHANGE PASSWORD BEFORE GOING LIVE
  const adminHash = await bcrypt.hash('admin123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@legalconnect.com' },
    update: {},
    create: {
      email: 'admin@legalconnect.com',
      name: 'Platform Admin',
      passwordHash: adminHash,
      role: 'admin',
      country: 'Nigeria',
    },
  });

  // Test client account
  const passwordHash = await bcrypt.hash('johndoe123', 12);
  await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      name: 'John Doe',
      passwordHash,
      role: 'client',
      phone: '+234 801 234 5678',
      country: 'Nigeria',
      state: 'Lagos',
      city: 'Lagos',
    },
  });

  // Sample lawyers
  const lawyers = [
    {
      email: 'adewale.johnson@legalconnect.com',
      name: 'Adewale Johnson',
      phone: '+234 802 345 6789',
      country: 'Nigeria',
      state: 'Lagos',
      city: 'Victoria Island',
      lawFirm: 'Johnson & Associates',
      barRegistrationNumber: 'NBA-2015-4532',
      yearsExperience: 11,
      practiceAreas: ['Corporate Law', 'Contract Law', 'Banking Law'],
      bio: 'Senior partner specializing in corporate transactions, mergers & acquisitions, and banking regulation. Over a decade of experience serving leading corporations and financial institutions in Nigeria.',
      consultationFee: 75000,
      rating: 4.9,
      totalCasesCompleted: 145,
      languagesSpoken: ['English', 'Yoruba'],
    },
    {
      email: 'fatima.bello@legalconnect.com',
      name: 'Fatima Bello',
      phone: '+234 803 456 7890',
      country: 'Nigeria',
      state: 'Abuja',
      city: 'Abuja',
      lawFirm: 'Bello Legal Chambers',
      barRegistrationNumber: 'NBA-2012-3218',
      yearsExperience: 14,
      practiceAreas: ['Family Law', 'Human Rights Law', 'Civil Law'],
      bio: 'Passionate advocate for family rights and human dignity. Extensive experience in matrimonial disputes, child custody cases, and civil rights litigation.',
      consultationFee: 60000,
      rating: 4.8,
      totalCasesCompleted: 210,
      languagesSpoken: ['English', 'Hausa'],
    },
    {
      email: 'chidi.okonkwo@legalconnect.com',
      name: 'Chidi Okonkwo',
      phone: '+234 804 567 8901',
      country: 'Nigeria',
      state: 'Lagos',
      city: 'Ikeja',
      lawFirm: 'Okonkwo & Partners',
      barRegistrationNumber: 'NBA-2010-2891',
      yearsExperience: 16,
      practiceAreas: ['Criminal Law', 'Civil Law', 'Human Rights Law'],
      bio: 'Renowned criminal defense attorney with an impressive track record. Specializes in high-profile criminal cases and civil liberties defense.',
      consultationFee: 100000,
      rating: 4.7,
      totalCasesCompleted: 320,
      languagesSpoken: ['English', 'Igbo'],
    },
    {
      email: 'amara.eze@legalconnect.com',
      name: 'Amara Eze',
      phone: '+234 805 678 9012',
      country: 'Nigeria',
      state: 'Rivers',
      city: 'Port Harcourt',
      lawFirm: 'Eze & Daughters Legal',
      barRegistrationNumber: 'NBA-2017-6543',
      yearsExperience: 9,
      practiceAreas: ['Property Law', 'Land Dispute', 'Real Estate Law'],
      bio: 'Property law specialist with deep expertise in land disputes and real estate transactions in the Niger Delta region.',
      consultationFee: 50000,
      rating: 4.6,
      totalCasesCompleted: 98,
      languagesSpoken: ['English', 'Igbo'],
    },
    {
      email: 'bola.adesanya@legalconnect.com',
      name: 'Bola Adesanya',
      phone: '+234 806 789 0123',
      country: 'Nigeria',
      state: 'Lagos',
      city: 'Lekki',
      lawFirm: 'TechLaw Partners',
      barRegistrationNumber: 'NBA-2016-5678',
      yearsExperience: 10,
      practiceAreas: ['Intellectual Property', 'Cybercrime Law', 'Corporate Law'],
      bio: 'Tech-savvy lawyer focusing on intellectual property protection, cybersecurity law, and technology company formation. Advises leading tech startups.',
      consultationFee: 80000,
      rating: 4.8,
      totalCasesCompleted: 120,
      languagesSpoken: ['English', 'Yoruba', 'French'],
    },
    {
      email: 'ngozi.uche@legalconnect.com',
      name: 'Ngozi Uche',
      phone: '+234 807 890 1234',
      country: 'Nigeria',
      state: 'Enugu',
      city: 'Enugu',
      lawFirm: 'Uche Legal Consult',
      barRegistrationNumber: 'NBA-2013-4121',
      yearsExperience: 13,
      practiceAreas: ['Employment Law', 'Tax Law', 'Insurance Law'],
      bio: 'Expert in employment law and tax compliance. Helps businesses navigate complex labor regulations and tax obligations across Nigeria.',
      consultationFee: 55000,
      rating: 4.5,
      totalCasesCompleted: 175,
      languagesSpoken: ['English', 'Igbo'],
    },
    {
      email: 'ibrahim.musa@legalconnect.com',
      name: 'Ibrahim Musa',
      phone: '+234 808 901 2345',
      country: 'Nigeria',
      state: 'Kano',
      city: 'Kano',
      lawFirm: 'Musa & Musa Chambers',
      barRegistrationNumber: 'NBA-2011-3567',
      yearsExperience: 15,
      practiceAreas: ['Immigration Law', 'Family Law', 'Civil Law'],
      bio: 'Immigration and family law expert serving clients across Northern Nigeria. Specializes in visa applications, deportation defense, and family court matters.',
      consultationFee: 45000,
      rating: 4.7,
      totalCasesCompleted: 250,
      languagesSpoken: ['English', 'Hausa', 'Arabic'],
    },
  ];

  for (const l of lawyers) {
    const hash = await bcrypt.hash('lawyer123', 12);
    const user = await prisma.user.upsert({
      where: { email: l.email },
      update: {},
      create: {
        email: l.email,
        name: l.name,
        passwordHash: hash,
        role: 'lawyer',
        phone: l.phone,
        country: l.country,
        state: l.state,
        city: l.city,
      },
    });

    await prisma.lawyerProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        lawFirm: l.lawFirm,
        barRegistrationNumber: l.barRegistrationNumber,
        yearsExperience: l.yearsExperience,
        practiceAreas: l.practiceAreas,
        bio: l.bio,
        consultationFee: l.consultationFee,
        rating: l.rating,
        totalCasesCompleted: l.totalCasesCompleted,
        languagesSpoken: l.languagesSpoken,
        // 'approved' here is intentional for seed/demo data only.
        // Real lawyer registrations default to 'pending' and require admin approval.
        verificationStatus: 'approved',
      },
    });
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
