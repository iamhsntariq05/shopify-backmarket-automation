import express from 'express';
import { importOrder, updateOrderStatus, cancelOrder } from '../Controller/orderController';

const router = express.Router();

router.post('/import', importOrder);
router.post('/update-status', updateOrderStatus);
router.post('/cancel', cancelOrder);

export default router;
