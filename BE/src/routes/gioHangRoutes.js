"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GioHangController_1 = require("../controllers/GioHangController");
const router = (0, express_1.Router)();
// Lấy giỏ hàng theo người dùng
router.get('/:nguoi_dung_id', GioHangController_1.GioHangController.getGioHang);
// Tạo giỏ hàng mới
router.post('/create/:nguoi_dung_id', GioHangController_1.GioHangController.createGioHang);
// Thêm sản phẩm vào giỏ hàng
router.post('/them', GioHangController_1.GioHangController.themSanPhamVaoGioHang);
// Xóa sản phẩm theo biến thể khỏi giỏ hàng
router.delete('/:gio_hang_id/bien-the/:bien_the_id', GioHangController_1.GioHangController.xoaSanPham);
// Cập nhật số lượng sản phẩm theo biến thể
router.put('/:gio_hang_id/bien-the/:bien_the_id', GioHangController_1.GioHangController.capNhatSoLuong);
exports.default = router;
