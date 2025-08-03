"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const KichCoController_1 = require("../controllers/KichCoController");
const router = (0, express_1.Router)();
router.get("/", KichCoController_1.KichCoController.getAll);
router.get("/:sanPhamId", KichCoController_1.KichCoController.getSizesBySanPhamId);
exports.default = router;
