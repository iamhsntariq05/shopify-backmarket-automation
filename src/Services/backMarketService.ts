import axios from 'axios';
import { BACKMARKET_API_URL, BACKMARKET_HEADERS,SHOPIFY_API_URL,SHOPIFY_HEADERS } from "../Config/index";
import { shopify } from '../index';


const getOrder = async () => {
    try {
    const order =  await axios.get(`${BACKMARKET_API_URL}/ws/listings`, {
        headers: BACKMARKET_HEADERS,
      });
      if (order.data.results) {
        return order.data.results
      } else { 
        return {
          success: false,
          message: "Error",
        };
      }
    } catch (error: any) {
        console.error(" Error", error.message);
        return {
          success: false,
          message: "Error",
        };
      }
};

// const updateOrderTracking = async (orderId: string, trackingNumber: string, trackingUrl: string) => {
//     const response = await axios.put(`${process.env.BACKMARKET_API_URL}/orders/${orderId}/tracking`, {
//         tracking_number: trackingNumber,
//         tracking_url: trackingUrl

//     }, {
//         headers: { Authorization: `Bearer ${process.env.BACKMARKET_API_KEY}` }
//     });
//     if (response.status === 204 || !response.data) {
//             return { message: "No data to update" };
//         }

// };

// const updateStock = async (sku: string, quantity: number) => {
//     await axios.put(`${process.env.BACKMARKET_API_URL}/inventory/${sku}`, {
//         quantity: quantity
//     }, {
//         headers: { Authorization: `Bearer ${process.env.BACKMARKET_API_KEY}` }
//     });
// };

// const syncShopifyInventoryWithBackMarket = async () => {
//     try {
//         const products = await shopify.product.list();

//         if (products.length === 0) {
//             console.warn("No products found in Shopify.");
//             return;
//         }

//         await Promise.all(products.map(async (product: any) => {
//             const variant = product.variants[0];

//             if (!variant || !variant.sku) {
//                 console.log(`⚠️ Missing SKU for product: ${product.title}`);
//                 return;
//             }

//             const shopifySku = variant.sku;
//             const shopifyQuantity = variant.inventory_quantity;

//             console.log(`🔄 Syncing SKU: ${shopifySku} with quantity: ${shopifyQuantity}`);
            
//             await updateStock(shopifySku, shopifyQuantity);
//         }));

//         console.log("✅ Inventory sync process completed.");
//     } catch (error) {
//         console.error("❌ Error syncing inventory:", error);
//     }
// };


const updateBackMarketOrderStatus = async (
    shopifyOrderId: string,
    trackingNumber: string
  ) => {
    try {
      const backMarketOrderId = await findBackMarketOrder(shopifyOrderId);
      if (!backMarketOrderId) {
        return { success: false, message: "Order not found in BackMarket" };
      }
  
      const response = await axios.put(
        `${BACKMARKET_API_URL}/ws/orders/${backMarketOrderId}/status`,
        {
          status: "sent",
          tracking_number: trackingNumber,
        },
        { headers: BACKMARKET_HEADERS }
      );
  
      return response.data;
    } catch (error: any) {
      console.error("Error updating BackMarket order status:", error.message);
      return { success: false, message: "Error updating order status" };
    }
  };
  
  const findBackMarketOrder = async (shopifyOrderId: string) => {
    try {
      const response = await axios.get(`${BACKMARKET_API_URL}/ws/orders`, {
        headers: BACKMARKET_HEADERS,
      });
  
      const orders = response.data.results || [];
  
      const order = orders.find((o: any) => o.shopify_order_id === shopifyOrderId);
  
      return order ? order.id : null;
    } catch (error: any) {
      console.error("Error fetching BackMarket orders:", error.message);
      return null;
    }
  };

  export const getCanceledBackMarketOrders = async () => {
    try {
      const response = await axios.get(`${BACKMARKET_API_URL}/ws/orders?status=canceled`, {
        headers: BACKMARKET_HEADERS,
      });
  
      return response.data.results || [];
    } catch (error: any) {
      console.error("Error fetching canceled orders from BackMarket:", error.message);
      return [];
    }
  };
  
  
  export const cancelShopifyOrder = async (shopifyOrderId: string) => {
    try {
      const response = await axios.post(
        `${SHOPIFY_API_URL}/orders/${shopifyOrderId}/cancel.json`,
        {},
        { headers: SHOPIFY_HEADERS }
      );
  
      return response.data;
    } catch (error: any) {
      console.error(`Error canceling Shopify order ${shopifyOrderId}:`, error.message);
      return { success: false, message: "Error canceling Shopify order" };
    }
  };
  

  export const syncCanceledOrders = async () => {
    const canceledOrders = await getCanceledBackMarketOrders();
  
    for (const order of canceledOrders) {
      const shopifyOrderId = order.shopify_order_id; 
  
      if (shopifyOrderId) {
        console.log(`Canceling order ${shopifyOrderId} in Shopify...`);
        await cancelShopifyOrder(shopifyOrderId);
      }
    }
  };

export default { getOrder, updateBackMarketOrderStatus };
