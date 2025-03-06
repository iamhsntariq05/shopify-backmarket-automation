import { Request, Response } from 'express';
import shopifyService from '../Services/shopifyService';
import backmarketService from '../Services/backMarketService';

export const importOrder = async (req: Request, res: Response) => {
    try {
        const order = req.body;
        const mappedOrder = shopifyService.mapOrderToBackMarket(order);
        await backmarketService.createOrder(mappedOrder);
        res.status(200).json({ message: 'Order imported to BackMarket' });
    } catch (error) {
        console.error('Import Order Error:', error);
        res.status(500).json({ error: 'Failed to import order' });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { orderId, trackingNumber } = req.body;
        await backmarketService.updateOrderTracking(orderId, trackingNumber);
        res.status(200).json({ message: 'Order tracking updated in BackMarket' });
    } catch (error) {
        console.error('Update Order Error:', error);
        res.status(500).json({ error: 'Failed to update order status' });
    }
};

export const cancelOrder = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.body;
        await shopifyService.cancelOrder(orderId);
        res.status(200).json({ message: 'Order cancelled in Shopify' });
    } catch (error) {
        console.error('Cancel Order Error:', error);
        res.status(500).json({ error: 'Failed to cancel order' });
    }
};
