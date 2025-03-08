import dotenv from "dotenv";
import axios from 'axios';

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
  
  const updateInventory = async (inventoryItemId: number, shopifyQuantity: number) => {
    const shopifySku = await getShopifySku(inventoryItemId);
    if (!shopifySku) {
      return {
        success: false,
        message: "No SKU found for inventory item",
      };
    }
    await mapShopifySkuToBackMarketSkus(shopifySku, shopifyQuantity);
  };
  
  const mapShopifySkuToBackMarketSkus = async (shopifySku: string, shopifyQuantity: number) => {
    try {
      const response = await axios.get(`${process.env.BACKMARKET_API_URL}/bm/catalog/listings`, {
        headers: { Authorization: `Bearer ${process.env.BACKMARKET_ACCESS_TOKEN}` },
        params: { sku: shopifySku },
      });
  
      if (response.data.count === 0) {
        console.warn(`No BackMarket products found for SKU: ${shopifySku}`);
        return;
      }
  
      await Promise.all(
        response.data.results.map((product:any) =>
          updateBackMarketInventory(product.id, shopifyQuantity)
        )
      );
    } catch (error) {
      console.error(`Error mapping Shopify SKU: ${shopifySku}`, error);
    }
  };
  
  const updateBackMarketInventory = async (productId: number, newQuantity: number) => {
    try {
      await axios.patch(
        `${process.env.BACKMARKET_API_URL}/bm/catalog/listings/${productId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${process.env.BACKMARKET_ACCESS_TOKEN}` } }
      );
  
      console.log(`Inventory updated for BackMarket Product ID: ${productId}`);
    } catch (error) {
      console.error(`Failed to update inventory for Product ID: ${productId}`, error);
    }
  };



export default { mapOrderToBackMarket, syncInventoryWithBackMarket,updateInventory};
