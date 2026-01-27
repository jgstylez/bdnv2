import prisma from '../lib/prisma';
import crypto from 'crypto';

/**
 * Create digital download access for an order item
 * Called when an order with digital products is completed
 */
export async function createDigitalDownloadAccess(orderItemId: string) {
  const orderItem = await prisma.orderItem.findUnique({
    where: { id: orderItemId },
    include: {
      order: true,
      product: true,
    },
  });

  if (!orderItem) {
    throw new Error('Order item not found');
  }

  // Only create download access for digital products
  if (orderItem.product.type !== 'DIGITAL') {
    return null;
  }

  // Check if download access already exists
  const existingDownload = await prisma.digitalDownload.findUnique({
    where: { orderItemId },
  });

  if (existingDownload) {
    return existingDownload;
  }

  // Generate secure token
  const downloadToken = crypto.randomBytes(32).toString('hex');

  // Get download limit from product (default to -1 for unlimited)
  const downloadLimit = orderItem.product.downloadLimit ?? -1;

  // Calculate expiration (if product has expirationDate)
  const expiresAt = orderItem.product.expirationDate
    ? new Date(orderItem.product.expirationDate)
    : null;

  const digitalDownload = await prisma.digitalDownload.create({
    data: {
      orderItemId,
      userId: orderItem.order.userId,
      productId: orderItem.productId,
      downloadToken,
      downloadLimit,
      expiresAt,
    },
  });

  return digitalDownload;
}

/**
 * Get download access for a user's order
 */
export async function getUserDownloads(orderId: string, userId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
          digitalDownload: {
            include: {
              downloads: {
                orderBy: { downloadedAt: 'desc' },
                take: 10, // Last 10 downloads
              },
            },
          },
        },
      },
    },
  });

  if (!order || order.userId !== userId) {
    throw new Error('Order not found or access denied');
  }

  // Filter to only digital products with download access
  return order.items
    .filter((item) => item.product.type === 'DIGITAL')
    .map((item) => ({
      orderItemId: item.id,
      productId: item.productId,
      productName: item.product.name,
      downloadToken: item.digitalDownload?.downloadToken,
      downloadCount: item.digitalDownload?.downloadCount ?? 0,
      downloadLimit: item.digitalDownload?.downloadLimit ?? -1,
      expiresAt: item.digitalDownload?.expiresAt,
      lastDownloadAt: item.digitalDownload?.lastDownloadAt,
      isExpired:
        item.digitalDownload?.expiresAt &&
        new Date(item.digitalDownload.expiresAt) < new Date(),
      isLimitReached:
        item.digitalDownload?.downloadLimit !== -1 &&
        (item.digitalDownload?.downloadCount ?? 0) >=
          (item.digitalDownload?.downloadLimit ?? 0),
      downloadUrl: item.product.downloadUrl,
    }));
}

/**
 * Validate download token and get download info
 */
export async function validateDownloadToken(token: string, userId?: string) {
  const digitalDownload = await prisma.digitalDownload.findUnique({
    where: { downloadToken: token },
    include: {
      orderItem: {
        include: {
          order: true,
          product: true,
        },
      },
    },
  });

  if (!digitalDownload) {
    return { valid: false, error: 'Download not found' };
  }

  // Verify user owns this download (if userId provided)
  if (userId && digitalDownload.userId !== userId) {
    return { valid: false, error: 'Access denied' };
  }

  // Check expiration
  if (digitalDownload.expiresAt && digitalDownload.expiresAt < new Date()) {
    return { valid: false, error: 'Download link has expired' };
  }

  // Check download limit
  if (
    digitalDownload.downloadLimit !== -1 &&
    digitalDownload.downloadCount >= digitalDownload.downloadLimit
  ) {
    return {
      valid: false,
      error: 'Download limit reached',
      downloadCount: digitalDownload.downloadCount,
      downloadLimit: digitalDownload.downloadLimit,
    };
  }

  // Verify order is completed
  if (digitalDownload.orderItem.order.status !== 'COMPLETED') {
    return { valid: false, error: 'Order not completed' };
  }

  return {
    valid: true,
    digitalDownload,
    product: digitalDownload.orderItem.product,
    downloadUrl: digitalDownload.orderItem.product.downloadUrl,
  };
}

/**
 * Process a download - logs the download and increments count
 */
export async function processDownload(
  token: string,
  ipAddress?: string,
  userAgent?: string,
) {
  const validation = await validateDownloadToken(token);

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const { digitalDownload } = validation;

  // Log download
  await prisma.downloadLog.create({
    data: {
      digitalDownloadId: digitalDownload.id,
      ipAddress,
      userAgent,
    },
  });

  // Increment download count
  const updated = await prisma.digitalDownload.update({
    where: { id: digitalDownload.id },
    data: {
      downloadCount: { increment: 1 },
      lastDownloadAt: new Date(),
    },
  });

  return {
    downloadUrl: validation.downloadUrl,
    downloadCount: updated.downloadCount,
    downloadLimit: updated.downloadLimit,
    remainingDownloads:
      updated.downloadLimit === -1
        ? -1
        : Math.max(0, updated.downloadLimit - updated.downloadCount),
  };
}

/**
 * Regenerate download token (if compromised)
 */
export async function regenerateDownloadToken(orderItemId: string, userId: string) {
  const digitalDownload = await prisma.digitalDownload.findUnique({
    where: { orderItemId },
  });

  if (!digitalDownload || digitalDownload.userId !== userId) {
    throw new Error('Download access not found or access denied');
  }

  const newToken = crypto.randomBytes(32).toString('hex');

  const updated = await prisma.digitalDownload.update({
    where: { id: digitalDownload.id },
    data: { downloadToken: newToken },
  });

  return updated;
}
