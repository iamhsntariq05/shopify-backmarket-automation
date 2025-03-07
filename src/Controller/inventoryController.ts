import { Request, Response } from 'express';
import webhookService from "../Services/shopifyService";


//update inventory stock quantity when shopify stock quantity is changed

const handleInventoryUpdate = async (req: Request, res: Response) => {
    try {
      const { inventory_item_id, available } = req.body;
  
      await webhookService.updateInventory(inventory_item_id, available);
  
      res.status(200).json({ success: true, message: "Inventory update processed." });
    } catch (error) {
      console.error("❌ Error processing webhook:", error);
      res.status(500).json({ success: false, message: "Error processing inventory update." });
    }
  };
  export default handleInventoryUpdate;
