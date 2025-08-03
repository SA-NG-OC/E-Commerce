"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SanPhamController_1 = require("../controllers/SanPhamController");
const router = express_1.default.Router();
router.get('/', SanPhamController_1.SanPhamController.getAllWithImages);
// Lấy sản phẩm theo id
router.get('/:id', SanPhamController_1.SanPhamController.getById);
//router.post('/', SanPhamController.create);
// Đặt các route cụ thể trước
router.get('/filter/:danhMucId/all', SanPhamController_1.SanPhamController.getByDanhMuc);
router.get('/filter/all/:thuongHieuId', SanPhamController_1.SanPhamController.getByThuongHieu);
// Route tổng quát đặt cuối
router.get('/filter/:danhMucId/:thuongHieuId', SanPhamController_1.SanPhamController.getByDanhMuc_ThuongHieu);
router.put('/:id', SanPhamController_1.SanPhamController.updateSanPham);
exports.default = router;
