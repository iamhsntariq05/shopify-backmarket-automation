import axios from 'axios';
import { BACKMARKET_API_URL, AUTH_HEADER,SHOPIFY_API_URL,SHOPIFY_HEADERS } from "../Config/index";
import { syncBackMarketInventory, syncShopifyInventory } from '../Middleware/inventoryUpdate';
// import { shopify } from '../Config';


const getShopifyProducts = async () => {
    try {
    const order =  await axios.get(`${BACKMARKET_API_URL}/ws/listings`, {
        headers: AUTH_HEADER,
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

const getShopifyOrders = async () => {
  try{
    const shopifyUrl = `${process.env.SHOPIFY_API_URL}/admin/api/2023-04/orders.json`;
    const SHOPIFY_HEADERS = {
    "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN!,
    "Content-Type": "application/json",
  };
  const response = await axios.get(shopifyUrl, { headers: SHOPIFY_HEADERS });
  
  if (!response.data.orders || response.data.orders.length === 0) {
    return { success: true, message: "📂 No orders found.", data: [] };
  }
  return { success: true, message: "📦 Orders retrieved successfully.", data: response.data.orders };
}
catch (error: any) {
  console.error("Error fetching Shopify orders:", error.response.data.errors);
  return { success: false, message: "Error fetching Shopify orders", error :  error.response.data.errors };
}
}




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
        { headers: AUTH_HEADER}
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
        headers: AUTH_HEADER,
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
        headers: AUTH_HEADER,
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
        await cancelShopifyOrder(shopifyOrderId);
      }
    }
  };


   const syncInventory = async (sku: any, quantity: any, inventory_item_id: any) => {
    
    await syncBackMarketInventory(sku, quantity);
    await syncShopifyInventory(inventory_item_id,quantity);
    return {
      success: true,
      message: "Inventory updated successfully",
    };
    
  };


  




export default { getShopifyProducts, updateBackMarketOrderStatus, getShopifyOrders,syncInventory };
