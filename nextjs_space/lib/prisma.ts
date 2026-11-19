import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig, Pool } from '@neondatabase/serverless';

// Use ws for WebSocket in Node.js (Vercel serverless)
// eslint-disable-next-line @typescript-eslint/no-require-imports
neonConfig.webSocketConstructor = require('ws');

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Use || not ?? so that empty string also falls back to hardcoded URL
const DB_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_wT6XRd5xQMuI@ep-fragrant-glitter-zag5k8ge-pooler.c-2.eu-west-2.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({ connectionString: DB_URL });
const adapter = new PrismaNeon(pool);

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
