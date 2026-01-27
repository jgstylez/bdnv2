/**
 * Order Completion Service
 * 
 * Handles post-order completion tasks including:
 * - Creating digital download access for digital products
 * - Sending confirmation emails
 * - Updating inventory
 */

import prisma from '../lib/prisma';
import { createDigitalDownloadAccess } from './digital-download.service';

/**
 * Process order completion - creates download access for digital products
 * Call this when an order status changes to COMPLETED
 */
export async function processOrderCompletion(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  if (order.status !== 'COMPLETED') {
    throw new Error('Order is not completed');
  }

  // Create download access for each digital product
  const downloadAccesses = [];
  for (const item of order.items) {
    if (item.product.type === 'DIGITAL') {
      try {
        const downloadAccess = await createDigitalDownloadAccess(item.id);
        if (downloadAccess) {
          downloadAccesses.push(downloadAccess);
        }
      } catch (error) {
        console.error(
          `Failed to create download access for order item ${item.id}:`,
          error,
        );
        // Continue processing other items even if one fails
      }
    }
  }

  return {
    orderId,
    downloadAccesses,
    count: downloadAccesses.length,
  };
}
