import "dotenv/config";
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  connectionLimit: 5,
});

const prisma = new PrismaClient({ 
  adapter,
  log: ['error', 'warn'],
});

export { prisma }