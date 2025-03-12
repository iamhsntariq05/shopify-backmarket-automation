import { Request, Response,NextFunction } from 'express';
// import shopifyService from '../Services/shopifyService';
import backmarketService from '../Services/orderService';
import { syncCanceledOrders } from "../Services/orderService";
import webhookService from "../Services/inventoryService";
import axios from 'axios';



// import new products as soon as they appear!
export const importShopifyProducts = async (req: Request, res: Response) => {
    try {
        const data = await backmarketService.getShopifyProducts();
        res.status(200).json({ message: 'Product imported to BackMarket', data : data });
    } catch (error) {
        console.error('Import Order Error:', error);
        res.status(500).json({ error: 'Failed to import order' });
    }
};

// import new order as soon as they appear!
export const importShopifyOrder = async (req: Request, res: Response) => {
    try {
        const data = await backmarketService.getShopifyOrders();
        if(data.success && data.data.length > 0){
          res.status(200).json({ message: 'Order imported to BackMarket', data : data });
        }
        else{
          res.status(200).json({ message: 'No new orders to import' });
        }
    } catch (error) {
        console.error('Import Order Error:', error);
        res.status(500).json({ error: 'Failed to import order' });
    }
}



// orders that are marked  sent and have tracking number
export const updateOrderStatus = async (req: Request, res: Response) => {
    const { shopifyOrderId, trackingNumber } = req.body;
  
    if (!shopifyOrderId || !trackingNumber) {
       res.status(400).json({
        success: false,
        message: "Missing shopifyOrderId or trackingNumber",
      });
      return;
    }
  
    const result = await backmarketService.updateBackMarketOrderStatus(shopifyOrderId, trackingNumber);
  
    if (result.success === false) {
       res.status(404).json(result);
       return;
    }
  
     res.json({ success: true, message: "Order updated successfully", data: result });
     return;
  };

  export const orderCreate = async (req: Request, res: Response) => {
    try {
      const { line_items } = req.body;
      if (!line_items || !Array.isArray(line_items) || line_items.length === 0) {
        res.status(400).json({ success: false, message: "Invalid payload. Missing line items" });
      }
      
    for (const item of line_items) {
    const inventoryData  = await getProductBySKU(item.sku);
    if (!inventoryData) {
      res.status(404).json({ success: false, message: "Inventory not found" });
      return
    }
    let currentStock= inventoryData.inventory_quantity;
    let inventory_item_id = inventoryData.inventory_item_id;
    const { sku, quantity, } = item;
    if (!sku   || !quantity) {
      console.warn(`Skipping item due to missing data:`, item);
      return;
    }
    const newQuantity = Math.max(0, currentStock- quantity);

      const result = await backmarketService.syncInventory(sku, newQuantity, inventory_item_id);

      if (!result?.success) {
         res.status(404).json({ success: result?.success, message: result?.message });
         return;
      }
       res.status(200).json({ success: result?.success, message: result?.message });
       return;

    }
    } catch (error) {
      console.error("Error processing webhook:", error);
       res.status(500).json({ success: false, message: "Error processing inventory update." });
    }
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

  const getInventoryStock = async (variantId: number): Promise<any | null> => {
    const shopifyAccessToken = process.env.SHOPIFY_ACCESS_TOKEN;
    const shopifyUrl = `${process.env.SHOPIFY_API_URL}/admin/api/2024-01/variants/${variantId}.json`;
  
    try {
      const response = await axios.get(shopifyUrl, {
        headers: {
          "X-Shopify-Access-Token": shopifyAccessToken,
          "Content-Type": "application/json",
        },
      });
  
      let inventory_quantity : number = response.data.variant.inventory_quantity;
      let inventory_item_id : number = response.data.variant.inventory_item_id;
      const data :any = {
        inventory_quantity,
        inventory_item_id
      }
      return data;
    } catch (error) {
      return null;
    }
  };

  const getProductBySKU = async (sku: string): Promise<any | null> => {
    const shopifyAccessToken = process.env.SHOPIFY_ACCESS_TOKEN;
    const shopifyUrl = `${process.env.SHOPIFY_API_URL}/admin/api/2024-01/graphql.json`;

    const query = {
        query: `
        {
            productVariants(first: 1, query: "sku:${sku}") {
                edges {
                    node {
                        id
                        sku
                        inventoryQuantity
                        inventoryItem {
                            id
                        }
                        product {
                            id
                            title
                        }
                    }
                }
            }
        }`,
    };

    try {
        const response = await axios.post(shopifyUrl, query, {
            headers: {
                "X-Shopify-Access-Token": shopifyAccessToken,
                "Content-Type": "application/json",
            },
        });

        const variants = response.data.data.productVariants.edges;
        if (variants.length === 0) {
            console.log(`❌ No product found for SKU: ${sku}`);
            return null;
        }

        const variant = variants[0].node;
        return {
            product_id: variant.product.id,
            product_title: variant.product.title,
            variant_id: variant.id,
            inventory_quantity: variant.inventoryQuantity,
            inventory_item_id: extractInventoryItemId(variant.inventoryItem.id),
        };
    } catch (error) {
        console.error("❌ Error fetching product by SKU:", error);
        return null;
    }

    
};

const extractInventoryItemId = (gid: string): number | null => {
  const match = gid.match(/(\d+)$/); // Extract last digits
  return match ? Number(match[0]) : null;
};
