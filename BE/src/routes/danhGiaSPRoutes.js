"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DanhGiaSPController_1 = require("../controllers/DanhGiaSPController");
const router = (0, express_1.Router)();
// Lấy tất cả đánh giá của 1 sản phẩm
router.get('/san-pham/:san_pham_id/danh-gia', DanhGiaSPController_1.DanhGiaSPController.getBySanPhamId);
router.post('/san-pham/:san_pham_id/danh-gia', DanhGiaSPController_1.DanhGiaSPController.create);
router.put('/danh-gia/:id', DanhGiaSPController_1.DanhGiaSPController.update);
router.delete('/danh-gia/:id', DanhGiaSPController_1.DanhGiaSPController.delete);
exports.default = router;
