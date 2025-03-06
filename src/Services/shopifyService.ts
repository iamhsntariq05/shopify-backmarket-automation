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

export default { mapOrderToBackMarket, cancelOrder };
