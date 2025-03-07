import { Request, Response,NextFunction } from 'express';
// import shopifyService from '../Services/shopifyService';
import backmarketService from '../Services/orderService';
import { syncCanceledOrders } from "../Services/orderService";


// import new order as soon as they appear!
export const importOrder = async (req: Request, res: Response) => {
    try {
        const data = await backmarketService.getOrder();
        res.status(200).json({ message: 'Order imported to BackMarket', data : data });
    } catch (error) {
        console.error('Import Order Error:', error);
        res.status(500).json({ error: 'Failed to import order' });
    }
};



// orders that are marked as sent and have tracking number
export const updateOrderStatus = async (req: Request, res: Response) => {
    const { shopifyOrderId, trackingNumber } = req.body;
  
    if (!shopifyOrderId || !trackingNumber) {
       res.status(400).json({
        success: false,
        message: "Missing shopifyOrderId or trackingNumber",
      });
    }
  
    const result = await backmarketService.updateBackMarketOrderStatus(shopifyOrderId, trackingNumber);
  
    if (result.success === false) {
       res.status(404).json(result);
    }
  
     res.json({ success: true, message: "Order updated successfully", data: result });
  };


// Cancelled orders in Back Market should also be cancelled in Shopify
  export const syncCanceledOrdersController = async (req: Request, res: Response) => {
    try {
      await syncCanceledOrders();
      res.json({ success: true, message: "Sync process completed" });
    } catch (error: any) {
      console.error("Error syncing canceled orders:", error.message);
      res.status(500).json({ success: false, message: "Error syncing canceled orders" });
    }
  };

  



// export const updateOrderStatus = async (req: Request, res: Response) => {
//     try {
//         const { order_id, tracking_number, tracking_url} = req.body;
//         if (!order_id || !tracking_number) {
//         res.status(400).json({error: 'Invalid payload. Missing order_id, tracking_number, or tracking_url' });
//         }
//         // await backmarketService.updateOrderTracking(orderId, trackingNumber);
//         await backmarketService.updateOrderTracking(order_id, tracking_number, tracking_url);

//         res.status(200).json({ message: 'Order tracking updated in BackMarket' });
//     } catch (error) {
//         console.error('Update Order Error:', error);
//         res.status(500).json({ error: 'Failed to update order status' });
//     }
// };

// // Cancelled orders in Back Market should also be cancelled in Shopify
// export const cancelOrder = async (req: Request, res: Response) => {
//     try {
//         const { orderId } = req.body;
//         await shopifyService.cancelOrder(orderId);
//         res.status(200).json({ message: 'Order cancelled in Shopify' });
//     } catch (error) {
//         console.error('Cancel Order Error:', error);
//         res.status(500).json({ error: 'Failed to cancel order' });
//     }
// };

// export const handleShopifyInventoryUpdate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    
//     try {
//       console.log("📦 Shopify inventory update received:", req.body);

//       // Extract SKU and quantity from Shopify webhook payload
//       const { inventory_item_id, available } = req.body;

//       if (!inventory_item_id || available === undefined) {
//         res.status(400).json({ success: false, message: "Invalid webhook payload." });
//       }
//       await shopifyService.syncInventoryWithBackMarket(inventory_item_id, available);


//        res.status(200).json({ success: true, message: "✅ Inventory sync initiated." });
//     } catch (error) {
//       console.error("❌ Error processing webhook:", error);
//        res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
//   }



