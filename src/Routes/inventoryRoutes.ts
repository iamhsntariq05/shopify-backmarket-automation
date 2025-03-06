import express from 'express';
import { updateInventory } from '../Controller/inventoryController';

const router = express.Router();

router.post('/update', updateInventory);

export default router;
