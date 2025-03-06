import axios from 'axios';

const shopifyBaseUrl = `https://${process.env.SHOPIFY_STORE_NAME}.myshopify.com/admin/api/2023-01`;

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

const cancelOrder = async (orderId: string) => {
    await axios.post(`${shopifyBaseUrl}/orders/${orderId}/cancel.json`, {}, {
        auth: {
            username: process.env.SHOPIFY_API_KEY || '',
            password: process.env.SHOPIFY_PASSWORD || ''
        }
    });
};


    const getShopifyProductSku = async (inventoryItemId: string) => {

    try {
      const response = await axios.get(
        `${process.env.SHOPIFY_API_URL}/admin/api/2023-01/inventory_items/${inventoryItemId}.json`,
        {
          headers: {
            "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN!,
          },
        }
      );

      return response.data.inventory_item.sku || null;
    } catch (error) {
      console.error("❌ Failed to fetch SKU from Shopify:", error);
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
      console.log(`✅ Updated BackMarket stock for SKU: ${sku} to quantity: ${quantity}`);
    } catch (error) {
      console.error(`❌ Error updating BackMarket stock for SKU: ${sku}`, error);
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



export default { mapOrderToBackMarket, cancelOrder, syncInventoryWithBackMarket};
