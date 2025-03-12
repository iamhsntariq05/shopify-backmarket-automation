import express from 'express';
import inventoryUpdate  from '../Controller/inventoryController';


const router = express.Router();
router.post("/sync", inventoryUpdate);


export default router;
