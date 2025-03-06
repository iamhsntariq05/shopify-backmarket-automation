"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inventoryController_1 = require("../Controller/inventoryController");
const router = express_1.default.Router();
router.post('/update', inventoryController_1.updateInventory);
exports.default = router;
