import express from 'express';
import { importShopifyProducts,importShopifyOrder, updateOrderStatus,syncCanceledOrdersController } from '../Controller/orderController';

const router = express.Router();

router.get('/import-products', importShopifyProducts);
router.get('/create-orders', importShopifyProducts);
router.get('/import-orders', importShopifyOrder);
router.post('/update-status', updateOrderStatus);

//we can use cronJob here as well!
router.post('/sync-canceled', syncCanceledOrdersController);

export default router;
