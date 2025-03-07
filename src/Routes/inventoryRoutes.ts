import express from 'express';
import handleInventoryUpdate  from '../Controller/inventoryController';
// import {handleShopifyOrderFulfilled}  from '../Middleware/inventoryHandleWebhook';


const router = express.Router();
router.post("/shopify-inventory", handleInventoryUpdate);

// router.post('/webhook/shopify/fulfillment', handleShopifyOrderFulfilled); 






export default router;
