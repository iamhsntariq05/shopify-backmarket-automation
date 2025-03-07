import { Request, Response } from 'express';
import webhookService from "../Services/inventoryService";


//update inventory stock quantity when shopify stock quantity is changed

const InventoryUpdate = async (req: Request, res: Response) => {
  try {
    const { inventory_item_id, available } = req.body;

    const response = await webhookService.updateInventory(inventory_item_id, available);

    if (!response?.success) {
       res.status(404).json({ success: response?.success, message: response?.message });
       return;
    }
     res.status(200).json({ success: response?.success, message: response?.message });
  } catch (error) {
    console.error("Error processing webhook:", error);
     res.status(500).json({ success: false, message: "Error processing inventory update." });
  }
};


  export default InventoryUpdate;
