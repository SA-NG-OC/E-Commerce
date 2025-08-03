"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/diaChiGiaoHangRoutes.ts
const express_1 = require("express");
const DiaChiGiaoHangController_1 = require("../controllers/DiaChiGiaoHangController");
const router = (0, express_1.Router)();
router.post('/', DiaChiGiaoHangController_1.DiaChiGiaoHangController.create);
exports.default = router;
