import { Router } from 'express'
import orderRoutes from './orderRoutes';
import inventoryRoutes  from './inventoryRoutes';

const router = Router()


router.use('/orders', orderRoutes);
router.use('/inventory', inventoryRoutes);

export default router
