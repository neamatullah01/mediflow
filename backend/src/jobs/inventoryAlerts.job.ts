import { Queue, Worker } from 'bullmq';
import { prisma } from '../lib/prisma';
import { io } from '../server';
import { env } from '../config';
import logger from '../utils/logger';

const redisConnection = env.BULL_REDIS_URL
  ? { url: env.BULL_REDIS_URL }
  : null;

// Create inventory alert queue (only if Redis is configured)
export const inventoryAlertQueue = redisConnection
  ? new Queue('inventory-alerts', { connection: redisConnection })
  : null;

// Create worker for processing inventory alert jobs (only if Redis is configured)
const inventoryAlertWorker = redisConnection
  ? new Worker(
      'inventory-alerts',
      async (job) => {
        logger.info(`Processing inventory alert job: ${job.id}`);

        try {
          // Query for expired inventory items
          const expiredItems = await prisma.inventoryItem.findMany({
            where: {
              expiryDate: {
                lt: new Date(),
              },
            },
            include: {
              drug: {
                select: {
                  name: true,
                  genericName: true,
                },
              },
              pharmacy: {
                select: {
                  name: true,
                },
              },
            },
          });

          // Query for low stock inventory items
          const lowStockItems = await prisma.inventoryItem.findMany({
            where: {
              status: {
                in: ['LOW_STOCK', 'OUT_OF_STOCK'],
              },
            },
            include: {
              drug: {
                select: {
                  name: true,
                  genericName: true,
                },
              },
              pharmacy: {
                select: {
                  name: true,
                },
              },
            },
          });

          const expiredCount = expiredItems.length;
          const lowStockCount = lowStockItems.length;

          if (expiredCount > 0) {
            // Emit alert to all connected clients
            io.emit('expiry-alert', {
              count: expiredCount,
              items: expiredItems.map((item) => ({
                id: item.id,
                drugName: item.drug.name,
                genericName: item.drug.genericName,
                pharmacyName: item.pharmacy.name,
                batchNumber: item.batchNumber,
                expiryDate: item.expiryDate,
                quantity: item.quantity,
              })),
            });

            logger.warn(`Expiry alert: ${expiredCount} expired items found`);
          } else {
            logger.info('No expired inventory items found');
          }

          if (lowStockCount > 0) {
            // Emit alert to all connected clients
            io.emit('low-stock-alert', {
              count: lowStockCount,
              items: lowStockItems.map((item) => ({
                id: item.id,
                drugName: item.drug.name,
                genericName: item.drug.genericName,
                pharmacyName: item.pharmacy.name,
                batchNumber: item.batchNumber,
                quantity: item.quantity,
                reorderLevel: item.reorderLevel,
              })),
            });

            logger.warn(`Low stock alert: ${lowStockCount} items found below reorder level`);
          } else {
            logger.info('No low stock inventory items found');
          }

          return {
            success: true,
            expiredCount,
            checkedAt: new Date().toISOString(),
          };
        } catch (error) {
          logger.error('Error processing inventory alert job:', error);
          throw error;
        }
      },
      { connection: redisConnection }
    )
  : null;

// Handle worker events
inventoryAlertWorker?.on('completed', (job) => {
  logger.info(`Inventory alert job ${job.id} completed`, {
    result: job.returnvalue,
  });
});

inventoryAlertWorker?.on('failed', (job, err) => {
  logger.error(`Inventory alert job ${job?.id} failed:`, err);
});

// Schedule inventory jobs function
export async function scheduleInventoryJobs(): Promise<void> {
  if (!inventoryAlertQueue) {
    logger.warn('BULL_REDIS_URL not configured — inventory alert jobs disabled');
    return;
  }

  try {
    // Remove any existing repeatable jobs with this ID
    await inventoryAlertQueue.removeRepeatableByKey('daily-expiry-check');

    // Add repeatable job running every night at midnight (0 0 * * *)
    await inventoryAlertQueue.add(
      'check-expired-inventory',
      {},
      {
        repeat: {
          pattern: '0 0 * * *',
        },
        jobId: 'daily-expiry-check',
      }
    );

    logger.info('Inventory alert jobs scheduled successfully (daily at midnight)');
  } catch (error) {
    logger.error('Failed to schedule inventory jobs:', error);
    throw error;
  }
}
