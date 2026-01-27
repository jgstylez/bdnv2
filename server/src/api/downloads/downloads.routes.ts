import express from 'express';
import * as downloadsController from './downloads.controller';

const router = express.Router();

// Get download info without processing download
router.get('/:token/info', downloadsController.getDownloadInfo);

// Process and serve download
router.get('/:token', downloadsController.downloadFile);

// Get all downloads for an order
router.get('/orders/:orderId/downloads', downloadsController.getOrderDownloads);

// Regenerate download token
router.post('/:orderItemId/regenerate', downloadsController.regenerateToken);

export default router;
