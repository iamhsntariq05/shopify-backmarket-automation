import express from 'express';
import handleInventoryUpdate  from '../Controller/inventoryController';


const router = express.Router();
router.post("/shopify-inventory", handleInventoryUpdate);







export default router;
