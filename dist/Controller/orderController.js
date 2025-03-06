"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrder = exports.updateOrderStatus = exports.importOrder = void 0;
const shopifyService_1 = __importDefault(require("../Services/shopifyService"));
const backMarketService_1 = __importDefault(require("../Services/backMarketService"));
const importOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = req.body;
        const mappedOrder = shopifyService_1.default.mapOrderToBackMarket(order);
        yield backMarketService_1.default.createOrder(mappedOrder);
        res.status(200).json({ message: 'Order imported to BackMarket' });
    }
    catch (error) {
        console.error('Import Order Error:', error);
        res.status(500).json({ error: 'Failed to import order' });
    }
});
exports.importOrder = importOrder;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId, trackingNumber } = req.body;
        yield backMarketService_1.default.updateOrderTracking(orderId, trackingNumber);
        res.status(200).json({ message: 'Order tracking updated in BackMarket' });
    }
    catch (error) {
        console.error('Update Order Error:', error);
        res.status(500).json({ error: 'Failed to update order status' });
    }
});
exports.updateOrderStatus = updateOrderStatus;
const cancelOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.body;
        yield shopifyService_1.default.cancelOrder(orderId);
        res.status(200).json({ message: 'Order cancelled in Shopify' });
    }
    catch (error) {
        console.error('Cancel Order Error:', error);
        res.status(500).json({ error: 'Failed to cancel order' });
    }
});
exports.cancelOrder = cancelOrder;
