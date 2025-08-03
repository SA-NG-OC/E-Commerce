"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DonHangController_1 = require("../controllers/DonHangController");
const router = (0, express_1.Router)();
// Lấy giỏ hàng theo người dùng
router.get('/:nguoi_dung_id', DonHangController_1.DonHangController.getByNguoiDungId);
router.patch('/:don_hang_id/:nguoi_dung_id', DonHangController_1.DonHangController.huyDonHang);
router.post('/tao', DonHangController_1.DonHangController.createDonHang);
router.post('/chi-tiet/them', DonHangController_1.DonHangController.addChiTietDonHang);
router.delete('/:id', DonHangController_1.DonHangController.deleteDonHang);
exports.default = router;
