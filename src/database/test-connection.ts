import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function testConnection() {
  try {
    // Try to connect to the database
    await prisma.$connect();
    console.log('✅ Successfully connected to the database');
    
    // Try a simple query
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Successfully executed a test query:', result);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection(); 