import axios from 'axios';

const backMarketBaseUrl = 'https://api.backmarket.fr';

const createOrder = async (order: any) => {
    await axios.post(`${backMarketBaseUrl}/orders`, order, {
        headers: { Authorization: `Bearer ${process.env.BACKMARKET_API_KEY}` }
    });
};

const updateOrderTracking = async (orderId: string, trackingNumber: string) => {
    await axios.put(`${backMarketBaseUrl}/orders/${orderId}/tracking`, {
        tracking_number: trackingNumber
    }, {
        headers: { Authorization: `Bearer ${process.env.BACKMARKET_API_KEY}` }
    });
};

const updateStock = async (sku: string, quantity: number) => {
    await axios.put(`${backMarketBaseUrl}/inventory/${sku}`, {
        stock_quantity: quantity
    }, {
        headers: { Authorization: `Bearer ${process.env.BACKMARKET_API_KEY}` }
    });
};

export default { createOrder, updateOrderTracking, updateStock };
