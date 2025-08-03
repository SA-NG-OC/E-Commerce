"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DanhMucController_1 = require("../controllers/DanhMucController");
const router = (0, express_1.Router)();
// Lấy tất cả danh mục (kèm sản phẩm và ảnh đại diện)
router.get('/', DanhMucController_1.DanhMucController.getAll);
exports.default = router;
