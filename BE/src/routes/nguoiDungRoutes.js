"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const NguoiDungController_1 = require("../controllers/NguoiDungController");
const router = (0, express_1.Router)();
router.post('/nguoi-dung/login', NguoiDungController_1.NguoiDungController.login);
exports.default = router;
