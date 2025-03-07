import express from 'express';
import { importOrder, updateOrderStatus,syncCanceledOrdersController } from '../Controller/orderController';

const router = express.Router();

router.get('/import', importOrder);
router.post('/update-status', updateOrderStatus);

//we can use cronJob here as well!
router.post('/cancel', syncCanceledOrdersController);
// router.post('/shopify/inventory-update', (req, res, next) => handleShopifyInventoryUpdate(req, res, next).catch(next));

export default router;
