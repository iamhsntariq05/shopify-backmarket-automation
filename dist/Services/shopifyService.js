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
const shopifyBaseUrl = `https://${process.env.SHOPIFY_STORE_NAME}.myshopify.com/admin/api/2023-01`;
const mapOrderToBackMarket = (order) => {
    return {
        id: order.id,
        customer: order.customer,
        products: order.line_items.map((item) => ({
            sku: item.sku,
            quantity: item.quantity
        }))
    };
};
const cancelOrder = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    yield axios_1.default.post(`${shopifyBaseUrl}/orders/${orderId}/cancel.json`, {}, {
        auth: {
            username: process.env.SHOPIFY_API_KEY || '',
            password: process.env.SHOPIFY_PASSWORD || ''
        }
    });
});
exports.default = { mapOrderToBackMarket, cancelOrder };
