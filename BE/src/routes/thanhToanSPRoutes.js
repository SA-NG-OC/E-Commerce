"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/thanhToanRoutes.ts
const express_1 = require("express");
const ThanhToanSPController_1 = require("../controllers/ThanhToanSPController");
const router = (0, express_1.Router)();
// GET /thanh-toan/:bienTheId/:soLuong
router.get('/:bienTheId/:soLuong', ThanhToanSPController_1.getThanhToanSPController);
exports.default = router;
