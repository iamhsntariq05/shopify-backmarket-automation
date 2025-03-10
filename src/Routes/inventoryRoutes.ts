import express from 'express';
import InventoryUpdate  from '../Controller/inventoryController';


const router = express.Router();
router.post("/sync", InventoryUpdate);


export default router;
