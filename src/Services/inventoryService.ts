import dotenv from "dotenv";
import axios from 'axios';
const cron = require("node-cron")
import { syncBackMarketInventory } from "../Middleware/inventoryUpdate";
import fs from "fs/promises";
import path from "path";

dotenv.config();

const mapOrderToBackMarket = (order: any) => {
    return {
        id: order.id,
        customer: order.customer,
        products: order.line_items.map((item: any) => ({
            sku: item.sku,
            quantity: item.quantity
        }))
    };
};




    const getShopifyProductSku = async (inventoryItemId: string) => {

    try {
      const response = await axios.get(
        `${process.env.SHOPIFY_API_URL}/admin/api/2023-01/inventory_items/${inventoryItemId}.json`,
        {
          headers: {
            "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
          },
        }
      );

      return response.data.inventory_item.sku || null;
    } catch (error) {
      console.error("Failed to fetch SKU from Shopify:", error);
      return null;
    }
  }

  // 📦 Update BackMarket Inventory
    const updateBackMarketStock = async (sku: string, quantity: number) => {

    try {
      await axios.put(
        `${process.env.BACKMARKET_API_URL}/inventory/${sku}`,
        { stock_quantity: quantity },
        {
          headers: { Authorization: `Bearer ${process.env.BACKMARKET_API_KEY}` },
        }
      );
    } catch (error) {
      console.error(`Error updating BackMarket stock for SKU: ${sku}`, error);
    }
  }

  // 🔄 Sync Shopify Inventory with BackMarket
    const syncInventoryWithBackMarket = async (inventoryItemId: string, shopifyQuantity: number) => {
    const shopifySku = await getShopifyProductSku(inventoryItemId);

    if (!shopifySku) {
      console.warn(`⚠️ No SKU found for Inventory Item ID: ${inventoryItemId}`);
      return;
    }

    await updateBackMarketStock(shopifySku, shopifyQuantity);
  }


  const getShopifySku = async (inventoryItemId: number): Promise<string | null> => {
    const shopifyAccessToken = process.env.SHOPIFY_ACCESS_TOKEN;
    const shopifyUrl = `${process.env.SHOPIFY_API_URL}/admin/api/2024-01/inventory_items/${inventoryItemId}.json`;
    try {

      if (!process.env.SHOPIFY_ACCESS_TOKEN || !process.env.SHOPIFY_API_URL) {
        console.error("Missing Shopify API credentials in .env");
        return null;
      }
      const response = await axios.get(shopifyUrl, {
        headers: {
           "X-Shopify-Access-Token": shopifyAccessToken,
           "Content-Type": "application/json",
           },
      });
  
      return response.data.inventory_item.sku;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error response:", error.response?.data);
      } else {
        console.error("Unexpected error:", error);
      }
      return null;
    }
  };
  
  const updateInventory = async (inventoryItemId: any,sku: any, quantity: any) => {
    const shopifySku = await getShopifySku(inventoryItemId);
    if (!shopifySku) {
      return {
        success: false,
        message: "No SKU found for inventory item",
      };
    }
    await syncBackMarketInventory(sku, quantity);
    return {
      success: true,
      message: "Inventory updated successfully",
    };
    
  };

  const fetchBackMarketOrders = async () => {
    try {

      // const authHeader = Buffer.from(`${process.env.BACKMARKET_EMAIL}:${process.env.BACKMARKET_PASSWORD}`).toString("base64");
      //   const response = await axios.get(`${process.env.BACKMARKET_API_URL}/ws/orders`, {
      //     headers: {
      //       "Authorization": `Basic ${authHeader}`,
      //       "Content-Type": "application/json",
      //       "Accept": "application/json",
      //       "User-Agent": "MyApp/1.0"
      //   }
      //   });
      const filePath = path.join(__dirname, "../order.json");

      const data = await fs.readFile(filePath, "utf-8");
      const orders = JSON.parse(data);

        // const newOrders = response.data.filter((order: any) => order.status === "To be processed");
        const newOrders = orders.results.filter((order: any) => order.state === 3);
        return newOrders;
    } catch (error) {
        console.error("Error fetching BackMarket orders:", error);
        return error;
    }
};

const updateBackMarketOrderStatus = async (orderId: any) => {
  try {
    // const authHeader = Buffer.from(`${process.env.BACKMARKET_EMAIL}:${process.env.BACKMARKET_PASSWORD}`).toString("base64");

    //   await axios.put(
    //       `${process.env.BACKMARKET_API_URL}/orders/${orderId}`,
    //       { status: "To be shipped" },
    //       {
    //         headers: {
    //           "Authorization": `Basic ${authHeader}`,
    //           "Content-Type": "application/json",
    //           "Accept": "application/json",
    //           "User-Agent": "MyApp/1.0"
    //       }
    //       }
    //   );
    const orderFilePath = path.join(__dirname, "../order.json");
    const data = await fs.readFile(orderFilePath, "utf-8");
    const orders = JSON.parse(data); // Ensure this is an object

    // Update the order's state inside results array
    const updatedOrders = {
      ...orders, // Keep other properties
      results: orders.results.map((order: any) =>
        order.order_id === orderId ? { ...order, state: 10 } : order
      ),
    };

    await fs.writeFile(orderFilePath, JSON.stringify(updatedOrders, null, 2), "utf-8");
    return updatedOrders;
  } catch (error) {
      console.error(`❌ Failed to update order ${orderId} status:`, error);
  }
};
const convertBackMarketSkuToShopifySku = (bmSku: string) => {
  return bmSku.split("/")[0];
};

const createShopifyOrder = async (order: any) => {
  const lineItems = order.orderlines.map((item: any) => ({
      sku: convertBackMarketSkuToShopifySku(item.listing),
      quantity: item.quantity,
  }));

  try {
    const response = await axios.post(
      `${process.env.SHOPIFY_API_URL}/admin/api/2024-01/orders.json`,
      {
          order: {
              email: `${order.billing_address.firstName}${order.billing_address.lastName}@gmail.com`,
              financial_status: "paid",
              test: false, 
              processed_at: new Date().toISOString(),
              customer: {
                  first_name: order.billing_address.firstName,
                  last_name: order.billing_address.lastName,
                  email: `${order.billing_address.firstName}${order.billing_address.lastName}@gmail.com`,
                  phone: order.billing_address.phoneNumber  || "",
              },
              line_items: order.orderlines.map((item: any) => ({
                  title: item.product || "Default Product Title", 
                  quantity: item.quantity || 1,
                  price: item.price || 0, 
                  variant_id: item.variant_id || null,
                  sku: convertBackMarketSkuToShopifySku(item.listing) || "",
              })),
              shipping_address: {
                  first_name: order.billing_address.firstName,
                  last_name: order.billing_address.lastName,
                  address1: order.billing_address.street,
                  address2: order.billing_address.street2  || "",
                  city: order.billing_address.city,
                  province: order.billing_address.state  || "",
                  country: order.billing_address.country,
                  zip: order.billing_address.zip?.toString() || "75001",
                  phone: order.billing_address.phoneNumber  || "",
              },
              billing_address: {
                  first_name: order.billing_address.firstName,
                  last_name: order.billing_address.lastName,
                  address1: order.billing_address.address1,
                  address2: order.billing_address.address2 || "",
                  city: order.billing_address.city,
                  province: order.billing_address.state || "",
                  country: order.billing_address.country,
                  zip: order.billing_address.zip,
                  phone: order.billing_address.phoneNumber || "",
              },
              fulfillment_status: "unfulfilled",
          },
      },
      {
          headers: {
              "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
              "Content-Type": "application/json",
          },
      }
  );
//    if (order.tracking_number) {
//     await createFulfillment(response.data.order.id, order.tracking_number, order.shipping_carrier);
// }
  

      console.log(`✅ Order imported into Shopify with ID: ${response.data.order.id}`);
      return response.data.order;
  } catch (error) {
      console.error("❌ Failed to import order into Shopify:", error);
      return null;
  }
};



  const syncBackMarketOrdersToShopify = async () => {
    console.log("🔄 Checking for new BackMarket orders...");

    const orders = await fetchBackMarketOrders();

    for (const order of orders) {
      //  const Updatedorder =  await updateBackMarketOrderStatus(order.order_id );
        const shopifyOrder = await createShopifyOrder(order);
        console.log("🔄 Synced order:", shopifyOrder);
    }
};

// const cronJobFunctions = async () => {
//   await syncBackMarketOrdersToShopify();
// };

// cron.schedule('*/10 * * * * *', syncBackMarketOrdersToShopify); 
 
export default { mapOrderToBackMarket, syncInventoryWithBackMarket,updateInventory,syncBackMarketOrdersToShopify};
