import dotenv from "dotenv";
import axios from 'axios';
import { AUTH_HEADER} from "../Config";

dotenv.config();

const syncBackMarketInventory = async (shopifySku: string, shopifyQuantity: number) => {
    try {
      const response = await axios.get(`${process.env.BACKMARKET_API_URL}/bm/catalog/listings`, {
        headers: AUTH_HEADER,
        params: { sku: shopifySku },
      });
  
      if (response.data.count === 0) {
        console.log(`${shopifySku} not found`);
        return;
      }
  
      const data = await Promise.all(
        response.data.results.map((product:any) =>
          backMarketinventoryUpdate(product.id, shopifyQuantity)
        )
      );
      console.log(data);
      return data;
    } catch (error) {
      console.error(`Error mapping Shopify SKU: ${shopifySku}`, error);
    }
  };

  const syncShopifyInventory = async ( shopifyQuantity: number, inventory_item_id : number) => {
    try {
  
      await updateShopifyStock(shopifyQuantity, inventory_item_id);
    } catch (error) {
      console.error("Error reducing Shopify stock:", error);
    }
  };
  
  const backMarketinventoryUpdate = async (productId: any, quantity: any) => {
    try {

      const updateUrl = `${process.env.BACKMARKET_API_URL}/ws/listings/${productId}`;
      const payload = { quantity: quantity };

      const response = await axios.post(updateUrl, payload, {
        headers: AUTH_HEADER,
      });

      if (response.status !== 200) {
        console.error(`inventory update Falied due to some issue`, response.data);
        return {message: `Failed to update inventory` };
      }
      return {message: `Updated Quantity, new quantity is${quantity}` };

    
    } catch (error) {
      console.error(`Failed to update inventory for Product ID: ${productId}`, error);
    }
  };


  async function updateShopifyStock(inventoryItemId: any, newQuantity: number) {
    try {
      const response = await axios.post(
        `${process.env.SHOPIFY_API_URL}/admin/api/2024-01/inventory_levels/set.json`,
        {
          location_id: process.env.SHOPIFY_LOCATION_ID,
          inventory_item_id: inventoryItemId,
          available: newQuantity,
        },
        {
          headers: { "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN },
        }
      );
      console.log(`Shopify stock updated: ${newQuantity}`);
      return response.data;
    } catch (error) {
      console.error("Error updating Shopify stock:", error);
    }
  }

  export {syncBackMarketInventory,syncShopifyInventory};