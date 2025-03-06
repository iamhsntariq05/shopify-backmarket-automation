import { Request, Response } from 'express';
import backmarketService from '../Services/backMarketService';

export const updateInventory = async (req: Request, res: Response) => {
    try {
        const { sku, quantity } = req.body;
        await backmarketService.updateStock(sku, quantity);
        res.status(200).json({ message: 'Inventory updated in BackMarket' });
    } catch (error) {
        console.error('Update Inventory Error:', error);
        res.status(500).json({ error: 'Failed to update inventory' });
    }
};
