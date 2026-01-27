import { Request, Response } from 'express';
import * as downloadService from '../../services/digital-download.service';

/**
 * GET /api/downloads/:token
 * Secure download endpoint that validates access and serves files
 */
export async function downloadFile(req: Request, res: Response) {
  const { token } = req.params;
  const userId = req.user?.id; // From auth middleware (if implemented)

  try {
    const result = await downloadService.processDownload(
      token,
      req.ip,
      req.get('user-agent'),
    );

    // Option 1: Redirect to the file URL
    if (result.downloadUrl) {
      return res.redirect(result.downloadUrl);
    }

    // Option 2: Return download info if URL not available
    res.json({
      success: true,
      downloadUrl: result.downloadUrl,
      downloadCount: result.downloadCount,
      downloadLimit: result.downloadLimit,
      remainingDownloads: result.remainingDownloads,
    });
  } catch (error: any) {
    console.error('Download error:', error);
    res.status(400).json({
      error: error.message || 'Download failed',
    });
  }
}

/**
 * GET /api/downloads/:token/info
 * Get download information without processing the download
 */
export async function getDownloadInfo(req: Request, res: Response) {
  const { token } = req.params;
  const userId = req.user?.id;

  try {
    const validation = await downloadService.validateDownloadToken(
      token,
      userId,
    );

    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const { digitalDownload, product } = validation;

    res.json({
      productId: product.id,
      productName: product.name,
      downloadCount: digitalDownload.downloadCount,
      downloadLimit: digitalDownload.downloadLimit,
      remainingDownloads:
        digitalDownload.downloadLimit === -1
          ? -1
          : Math.max(
              0,
              digitalDownload.downloadLimit - digitalDownload.downloadCount,
            ),
      expiresAt: digitalDownload.expiresAt,
      lastDownloadAt: digitalDownload.lastDownloadAt,
    });
  } catch (error: any) {
    console.error('Get download info error:', error);
    res.status(500).json({ error: 'Failed to get download info' });
  }
}

/**
 * GET /api/orders/:orderId/downloads
 * Get all downloadable products for an order
 */
export async function getOrderDownloads(req: Request, res: Response) {
  const { orderId } = req.params;
  const userId = req.user?.id || req.body.userId; // Temporary - should come from auth

  try {
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const downloads = await downloadService.getUserDownloads(orderId, userId);
    res.json(downloads);
  } catch (error: any) {
    console.error('Get order downloads error:', error);
    res.status(400).json({ error: error.message || 'Failed to get downloads' });
  }
}

/**
 * POST /api/downloads/:orderItemId/regenerate
 * Regenerate download token (if compromised)
 */
export async function regenerateToken(req: Request, res: Response) {
  const { orderItemId } = req.params;
  const userId = req.user?.id || req.body.userId; // Temporary - should come from auth

  try {
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const updated = await downloadService.regenerateDownloadToken(
      orderItemId,
      userId,
    );

    res.json({
      success: true,
      downloadToken: updated.downloadToken,
    });
  } catch (error: any) {
    console.error('Regenerate token error:', error);
    res.status(400).json({ error: error.message || 'Failed to regenerate token' });
  }
}
