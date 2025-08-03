"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const HinhAnhSPController_1 = require("../controllers/HinhAnhSPController");
const router = (0, express_1.Router)();
// GET /api/hinh-anh-sp/san-pham/:productId - Lấy ảnh theo sản phẩm
router.get('/san-pham/:productId', HinhAnhSPController_1.HinhAnhSPController.getByProductId);
// POST /api/hinh-anh-sp/upload - Upload ảnh
router.post('/upload', HinhAnhSPController_1.HinhAnhSPController.uploadImages);
// DELETE /api/hinh-anh-sp/:id - Xóa ảnh
router.delete('/', HinhAnhSPController_1.HinhAnhSPController.delete);
exports.default = router;
