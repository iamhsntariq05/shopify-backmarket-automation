import express from 'express';
import { importOrder, updateOrderStatus } from '../Controller/orderController';

const router = express.Router();

router.get('/import', importOrder);
router.post('/update-status', updateOrderStatus);
// router.post('/cancel', cancelOrder);
// router.post('/shopify/inventory-update', (req, res, next) => handleShopifyInventoryUpdate(req, res, next).catch(next));

export default router;
