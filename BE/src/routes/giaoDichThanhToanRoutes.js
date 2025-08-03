"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/giaoDichThanhToanRoutes.ts
const express_1 = __importDefault(require("express"));
const GiaoDichThanhToanController_1 = require("../controllers/GiaoDichThanhToanController");
const router = express_1.default.Router();
router.post('/', GiaoDichThanhToanController_1.GiaoDichThanhToanController.create);
exports.default = router;
