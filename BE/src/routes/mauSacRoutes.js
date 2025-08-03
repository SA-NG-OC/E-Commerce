"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MauSacController_1 = require("../controllers/MauSacController");
const routes = (0, express_1.Router)();
routes.get('/', MauSacController_1.MauSacController.getAll);
routes.get('/:sanPhamId', MauSacController_1.MauSacController.getColorsBySanPhamId);
exports.default = routes;
