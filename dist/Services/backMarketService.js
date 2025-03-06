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
const axios_1 = __importDefault(require("axios"));
const backMarketBaseUrl = 'https://api.backmarket.fr';
const createOrder = (order) => __awaiter(void 0, void 0, void 0, function* () {
    yield axios_1.default.post(`${backMarketBaseUrl}/orders`, order, {
        headers: { Authorization: `Bearer ${process.env.BACKMARKET_API_KEY}` }
    });
});
const updateOrderTracking = (orderId, trackingNumber) => __awaiter(void 0, void 0, void 0, function* () {
    yield axios_1.default.put(`${backMarketBaseUrl}/orders/${orderId}/tracking`, {
        tracking_number: trackingNumber
    }, {
        headers: { Authorization: `Bearer ${process.env.BACKMARKET_API_KEY}` }
    });
});
const updateStock = (sku, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    yield axios_1.default.put(`${backMarketBaseUrl}/inventory/${sku}`, {
        stock_quantity: quantity
    }, {
        headers: { Authorization: `Bearer ${process.env.BACKMARKET_API_KEY}` }
    });
});
exports.default = { createOrder, updateOrderTracking, updateStock };
