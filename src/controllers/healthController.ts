import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  environment: string;
  database: {
    status: 'connected' | 'disconnected';
    responseTime?: number;
  };
  memory: {
    used: string;
    total: string;
    percentage: string;
  };
  dependencies: {
    node: string;
    prisma: string;
  };
}

export const healthCheck = async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  let dbStatus: 'connected' | 'disconnected' = 'disconnected';
  let dbResponseTime: number | undefined;

  try {
    // Test database connection
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbResponseTime = Date.now() - dbStart;
    dbStatus = 'connected';
  } catch (error) {
    console.error('Database health check failed:', error);
  }

  // Get memory usage
  const memUsage = process.memoryUsage();
  const totalMemory = memUsage.heapTotal;
  const usedMemory = memUsage.heapUsed;
  const memoryPercentage = ((usedMemory / totalMemory) * 100).toFixed(2);

  // Get package version
  const packageJson = await import('../../package.json', { assert: { type: 'json' } });

  const healthStatus: HealthStatus = {
    status: dbStatus === 'connected' ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    version: packageJson.default.version,
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'unknown',
    database: {
      status: dbStatus,
      responseTime: dbResponseTime
    },
    memory: {
      used: `${Math.round(usedMemory / 1024 / 1024)} MB`,
      total: `${Math.round(totalMemory / 1024 / 1024)} MB`,
      percentage: `${memoryPercentage}%`
    },
    dependencies: {
      node: process.version,
      prisma: '5.10.2' // Should match your package.json version
    }
  };

  const statusCode = healthStatus.status === 'healthy' ? 200 : 503;
  
  res.status(statusCode).json(healthStatus);
};

export const readinessCheck = async (req: Request, res: Response): Promise<void> => {
  try {
    // Quick database connectivity test
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed'
    });
  }
};

export const livenessCheck = (req: Request, res: Response): void => {
  // Simple liveness check - just verify the process is running
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime())
  });
};
