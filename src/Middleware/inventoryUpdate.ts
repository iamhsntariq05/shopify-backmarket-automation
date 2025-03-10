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
  
      await Promise.all(
        response.data.results.map((product:any) =>
          backMarketInventoryUpdate(product.id, shopifyQuantity)
        )
      );
    } catch (error) {
      console.error(`Error mapping Shopify SKU: ${shopifySku}`, error);
    }
  };
  
  const backMarketInventoryUpdate = async (productId: any, quantity: any) => {
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

  export {syncBackMarketInventory};