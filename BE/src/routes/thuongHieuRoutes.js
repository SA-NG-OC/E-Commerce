"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ThuongHieuController_1 = require("../controllers/ThuongHieuController");
const router = (0, express_1.Router)();
// Lấy tất cả thương hiệu kèm sản phẩm (và ảnh đại diện)
router.get('/', ThuongHieuController_1.ThuongHieuController.getAll);
exports.default = router;
