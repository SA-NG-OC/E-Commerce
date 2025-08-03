// thanhToan.ts - Refactored for router compatibility
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// Global variables
var orderData = {
    items: [],
    subtotal: 0,
    shipping: 30000,
    discount: 0,
    total: 0
};
var districts = {
    'hanoi': ['Ba Đình', 'Hoàn Kiếm', 'Tây Hồ', 'Long Biên', 'Cầu Giấy', 'Đống Đa', 'Hai Bà Trưng', 'Hoàng Mai', 'Thanh Xuân'],
    'hcm': ['Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8', 'Quận 9', 'Quận 10'],
    'danang': ['Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn', 'Liên Chiểu', 'Cẩm Lệ'],
    'haiphong': ['Hồng Bàng', 'Ngô Quyền', 'Lê Chân', 'Hải An', 'Kiến An', 'Đồ Sơn'],
    'cantho': ['Ninh Kiều', 'Bình Thuỷ', 'Cái Răng', 'Ô Môn', 'Thốt Nốt']
};
var cityMap = {
    'TP.HCM': 'hcm',
    'Hà Nội': 'hanoi',
    'Đà Nẵng': 'danang',
    'Hải Phòng': 'haiphong',
    'Cần Thơ': 'cantho'
};
// API Functions
function getUserId() {
    var userStr = localStorage.getItem('usercontext');
    if (!userStr)
        return null;
    try {
        var user = JSON.parse(userStr);
        return user._id;
    }
    catch (err) {
        console.error('Lỗi khi parse usercontext:', err);
        return null;
    }
}
function createDonHang(nguoiDungId) {
    return __awaiter(this, void 0, void 0, function () {
        var response, result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch('http://localhost:3000/api/don-hang/tao', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                nguoi_dung_id: nguoiDungId
                            })
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    result = _a.sent();
                    if (result.success) {
                        return [2 /*return*/, result.id];
                    }
                    else {
                        console.error('Lỗi tạo đơn hàng:', result.message);
                        return [2 /*return*/, null];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.error('Lỗi khi gọi API tạo đơn hàng:', err_1);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function addChiTietDonHang(donHangId, bienTheId, soLuong) {
    return __awaiter(this, void 0, void 0, function () {
        var response, result, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch('http://localhost:3000/api/don-hang/chi-tiet/them', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                don_hang_id: donHangId,
                                bien_the_id: bienTheId,
                                so_luong: soLuong
                            })
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, result.success];
                case 3:
                    err_2 = _a.sent();
                    console.error('Lỗi khi thêm chi tiết đơn hàng:', err_2);
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function createGiaoDichThanhToan(donHangId_1, phuongThucThanhToan_1) {
    return __awaiter(this, arguments, void 0, function (donHangId, phuongThucThanhToan, ghiChu) {
        var response, err_3;
        if (ghiChu === void 0) { ghiChu = ''; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fetch('http://localhost:3000/api/giao-dich/', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                don_hang_id: donHangId,
                                phuong_thuc_thanh_toan: phuongThucThanhToan,
                                ghi_chu: ghiChu
                            })
                        })];
                case 1:
                    response = _a.sent();
                    if (response.status === 201) {
                        return [2 /*return*/, true];
                    }
                    else {
                        console.error('Lỗi tạo giao dịch thanh toán:', response.status);
                        return [2 /*return*/, false];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    err_3 = _a.sent();
                    console.error('Lỗi khi gọi API tạo giao dịch thanh toán:', err_3);
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function createDiaChiGiaoHang(donHangId_1, hoTenNguoiNhan_1, soDienThoai_1, diaChiChiTiet_1, phuongXa_1, tinhThanh_1) {
    return __awaiter(this, arguments, void 0, function (donHangId, hoTenNguoiNhan, soDienThoai, diaChiChiTiet, phuongXa, tinhThanh, ghiChu) {
        var response, err_4;
        if (ghiChu === void 0) { ghiChu = ''; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fetch('http://localhost:3000/api/dia-chi/', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                don_hang_id: donHangId,
                                ho_ten_nguoi_nhan: hoTenNguoiNhan,
                                so_dien_thoai: soDienThoai,
                                dia_chi_chi_tiet: diaChiChiTiet,
                                phuong_xa: phuongXa,
                                tinh_thanh: tinhThanh,
                                ghi_chu: ghiChu
                            })
                        })];
                case 1:
                    response = _a.sent();
                    if (response.status === 201) {
                        return [2 /*return*/, true];
                    }
                    else {
                        console.error('Lỗi tạo địa chỉ giao hàng:', response.status);
                        return [2 /*return*/, false];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    err_4 = _a.sent();
                    console.error('Lỗi khi gọi API tạo địa chỉ giao hàng:', err_4);
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function deleteDonHang(donHangId) {
    return __awaiter(this, void 0, void 0, function () {
        var response, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fetch("http://localhost:3000/api/don-hang/".concat(donHangId), {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.ok];
                case 2:
                    err_5 = _a.sent();
                    console.error('Lỗi khi xóa đơn hàng:', err_5);
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getBienTheById(bienTheId) {
    return __awaiter(this, void 0, void 0, function () {
        var response, result, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("http://localhost:3000/api/bien-the/".concat(bienTheId), {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        console.error("L\u1ED7i khi l\u1EA5y th\u00F4ng tin bi\u1EBFn th\u1EC3 ".concat(bienTheId, ":"), response.status);
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    result = _a.sent();
                    if (result.success) {
                        return [2 /*return*/, result.data];
                    }
                    else {
                        console.error('Lỗi từ API:', result.message);
                        return [2 /*return*/, null];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_6 = _a.sent();
                    console.error('Lỗi khi gọi API lấy biến thể:', err_6);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function updateBienTheSoLuong(bienTheId, soLuongMoi) {
    return __awaiter(this, void 0, void 0, function () {
        var response, result, err_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, fetch("http://localhost:3000/api/bien-the/".concat(bienTheId), {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                so_luong_ton_kho: soLuongMoi
                            })
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, result.success];
                case 3:
                    console.error("L\u1ED7i khi c\u1EADp nh\u1EADt s\u1ED1 l\u01B0\u1EE3ng bi\u1EBFn th\u1EC3 ".concat(bienTheId, ":"), response.status);
                    return [2 /*return*/, false];
                case 4: return [3 /*break*/, 6];
                case 5:
                    err_7 = _a.sent();
                    console.error('Lỗi khi gọi API cập nhật số lượng:', err_7);
                    return [2 /*return*/, false];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function updateInventoryAfterOrder(orderItems) {
    return __awaiter(this, void 0, void 0, function () {
        var updateResults, _i, orderItems_1, item, bienTheInfo, soLuongHienTai, soLuongDat, soLuongMoi, updateSuccess, failedUpdates, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    updateResults = [];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    console.log('🔄 Bắt đầu cập nhật số lượng tồn kho...');
                    _i = 0, orderItems_1 = orderItems;
                    _a.label = 2;
                case 2:
                    if (!(_i < orderItems_1.length)) return [3 /*break*/, 6];
                    item = orderItems_1[_i];
                    console.log("\u0110ang x\u1EED l\u00FD bi\u1EBFn th\u1EC3: ".concat(item._bien_the_id, ", s\u1ED1 l\u01B0\u1EE3ng \u0111\u1EB7t: ").concat(item._so_luong));
                    return [4 /*yield*/, getBienTheById(item._bien_the_id)];
                case 3:
                    bienTheInfo = _a.sent();
                    if (!bienTheInfo) {
                        console.error("\u274C Kh\u00F4ng th\u1EC3 l\u1EA5y th\u00F4ng tin bi\u1EBFn th\u1EC3 ".concat(item._bien_the_id));
                        updateResults.push({
                            bienTheId: item._bien_the_id,
                            success: false
                        });
                        return [3 /*break*/, 5];
                    }
                    soLuongHienTai = bienTheInfo.so_luong_ton_kho;
                    soLuongDat = item._so_luong;
                    soLuongMoi = soLuongHienTai - soLuongDat;
                    console.log("Bi\u1EBFn th\u1EC3 ".concat(item._bien_the_id, ": ").concat(soLuongHienTai, " - ").concat(soLuongDat, " = ").concat(soLuongMoi));
                    if (soLuongMoi < 0) {
                        console.error("\u274C S\u1ED1 l\u01B0\u1EE3ng t\u1ED3n kho kh\u00F4ng \u0111\u1EE7 cho bi\u1EBFn th\u1EC3 ".concat(item._bien_the_id));
                        updateResults.push({
                            bienTheId: item._bien_the_id,
                            success: false,
                            oldQuantity: soLuongHienTai,
                            newQuantity: soLuongMoi
                        });
                        return [3 /*break*/, 5];
                    }
                    return [4 /*yield*/, updateBienTheSoLuong(item._bien_the_id, soLuongMoi)];
                case 4:
                    updateSuccess = _a.sent();
                    updateResults.push({
                        bienTheId: item._bien_the_id,
                        success: updateSuccess,
                        oldQuantity: soLuongHienTai,
                        newQuantity: soLuongMoi
                    });
                    if (updateSuccess) {
                        console.log("\u2713 C\u1EADp nh\u1EADt th\u00E0nh c\u00F4ng bi\u1EBFn th\u1EC3 ".concat(item._bien_the_id, ": ").concat(soLuongHienTai, " \u2192 ").concat(soLuongMoi));
                    }
                    else {
                        console.error("\u274C C\u1EADp nh\u1EADt th\u1EA5t b\u1EA1i bi\u1EBFn th\u1EC3 ".concat(item._bien_the_id));
                    }
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 2];
                case 6:
                    failedUpdates = updateResults.filter(function (result) { return !result.success; });
                    if (failedUpdates.length > 0) {
                        console.error('❌ Một số biến thể cập nhật thất bại:', failedUpdates);
                        failedUpdates.forEach(function (failed) {
                            console.error("- Bi\u1EBFn th\u1EC3 ".concat(failed.bienTheId, ": ").concat(failed.oldQuantity !== undefined ? "".concat(failed.oldQuantity, " \u2192 ").concat(failed.newQuantity) : 'Không thể lấy thông tin'));
                        });
                        return [2 /*return*/, false];
                    }
                    console.log('✅ Cập nhật số lượng tồn kho hoàn tất thành công!');
                    return [2 /*return*/, true];
                case 7:
                    error_1 = _a.sent();
                    console.error('❌ Lỗi khi cập nhật số lượng tồn kho:', error_1);
                    return [2 /*return*/, false];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function rollbackInventory(orderItems) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, orderItems_2, item, bienTheInfo, soLuongHienTai, soLuongKhoiPhuc, rollbackSuccess, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🔄 Đang thực hiện rollback số lượng tồn kho...');
                    _i = 0, orderItems_2 = orderItems;
                    _a.label = 1;
                case 1:
                    if (!(_i < orderItems_2.length)) return [3 /*break*/, 8];
                    item = orderItems_2[_i];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 6, , 7]);
                    return [4 /*yield*/, getBienTheById(item._bien_the_id)];
                case 3:
                    bienTheInfo = _a.sent();
                    if (!bienTheInfo) return [3 /*break*/, 5];
                    soLuongHienTai = bienTheInfo.so_luong_ton_kho;
                    soLuongKhoiPhuc = soLuongHienTai + item._so_luong;
                    return [4 /*yield*/, updateBienTheSoLuong(item._bien_the_id, soLuongKhoiPhuc)];
                case 4:
                    rollbackSuccess = _a.sent();
                    if (rollbackSuccess) {
                        console.log("\u2713 Rollback th\u00E0nh c\u00F4ng bi\u1EBFn th\u1EC3 ".concat(item._bien_the_id, ": ").concat(soLuongHienTai, " \u2192 ").concat(soLuongKhoiPhuc));
                    }
                    else {
                        console.error("\u274C Rollback th\u1EA5t b\u1EA1i bi\u1EBFn th\u1EC3 ".concat(item._bien_the_id));
                    }
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    console.error("\u274C L\u1ED7i khi rollback bi\u1EBFn th\u1EC3 ".concat(item._bien_the_id, ":"), error_2);
                    return [3 /*break*/, 7];
                case 7:
                    _i++;
                    return [3 /*break*/, 1];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function processOrderWithInventory(orderInfo) {
    return __awaiter(this, void 0, void 0, function () {
        var donHangId, createdSteps, inventoryUpdated, userId, inventoryCheckSuccess, addedItemsCount, _i, _a, item, success, paymentSuccess, hoTenDayDu, citySelect, districtSelect, tinhThanhText, phuongXaText, addressSuccess, err_8, deleteSuccess;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    donHangId = null;
                    createdSteps = [];
                    inventoryUpdated = false;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 10, , 15]);
                    userId = getUserId();
                    if (!userId) {
                        alert('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
                        return [2 /*return*/, false];
                    }
                    console.log('🔍 Kiểm tra số lượng tồn kho...');
                    return [4 /*yield*/, updateInventoryAfterOrder(orderInfo.items)];
                case 2:
                    inventoryCheckSuccess = _d.sent();
                    if (!inventoryCheckSuccess) {
                        alert('Không đủ số lượng tồn kho hoặc có lỗi khi cập nhật. Vui lòng thử lại.');
                        return [2 /*return*/, false];
                    }
                    inventoryUpdated = true;
                    console.log('✅ Cập nhật tồn kho thành công');
                    return [4 /*yield*/, createDonHang(userId)];
                case 3:
                    donHangId = _d.sent();
                    if (!donHangId) {
                        throw new Error('Không thể tạo đơn hàng');
                    }
                    createdSteps.push('don_hang');
                    console.log('✓ Tạo đơn hàng thành công:', donHangId);
                    addedItemsCount = 0;
                    _i = 0, _a = orderInfo.items;
                    _d.label = 4;
                case 4:
                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                    item = _a[_i];
                    return [4 /*yield*/, addChiTietDonHang(donHangId, item._bien_the_id, item._so_luong)];
                case 5:
                    success = _d.sent();
                    if (!success) {
                        throw new Error("Kh\u00F4ng th\u1EC3 th\u00EAm s\u1EA3n ph\u1EA9m ".concat(item._ten_san_pham, " v\u00E0o \u0111\u01A1n h\u00E0ng"));
                    }
                    addedItemsCount++;
                    console.log("\u2713 Th\u00EAm s\u1EA3n ph\u1EA9m ".concat(addedItemsCount, "/").concat(orderInfo.items.length, " th\u00E0nh c\u00F4ng"));
                    _d.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7:
                    createdSteps.push('chi_tiet');
                    return [4 /*yield*/, createGiaoDichThanhToan(donHangId, orderInfo.paymentMethod, 'Giao dịch thanh toán cho đơn hàng')];
                case 8:
                    paymentSuccess = _d.sent();
                    if (!paymentSuccess) {
                        throw new Error('Không thể tạo thông tin thanh toán');
                    }
                    createdSteps.push('thanh_toan');
                    console.log('✓ Tạo giao dịch thanh toán thành công');
                    hoTenDayDu = "".concat(orderInfo.customer.firstName, " ").concat(orderInfo.customer.lastName);
                    citySelect = getSelectElement('city');
                    districtSelect = getSelectElement('district');
                    tinhThanhText = ((_b = citySelect === null || citySelect === void 0 ? void 0 : citySelect.options[citySelect.selectedIndex]) === null || _b === void 0 ? void 0 : _b.text) || orderInfo.customer.city;
                    phuongXaText = ((_c = districtSelect === null || districtSelect === void 0 ? void 0 : districtSelect.options[districtSelect.selectedIndex]) === null || _c === void 0 ? void 0 : _c.text) || orderInfo.customer.district;
                    return [4 /*yield*/, createDiaChiGiaoHang(donHangId, hoTenDayDu, orderInfo.customer.phone, orderInfo.customer.address, phuongXaText, tinhThanhText, orderInfo.customer.note)];
                case 9:
                    addressSuccess = _d.sent();
                    if (!addressSuccess) {
                        throw new Error('Không thể lưu địa chỉ giao hàng');
                    }
                    createdSteps.push('dia_chi');
                    console.log('✓ Tạo địa chỉ giao hàng thành công');
                    console.log('✅ Đặt hàng hoàn tất thành công!');
                    return [2 /*return*/, true];
                case 10:
                    err_8 = _d.sent();
                    console.error('❌ Lỗi trong quá trình xử lý đơn hàng:', err_8);
                    if (!inventoryUpdated) return [3 /*break*/, 12];
                    console.log('🔄 Đang rollback số lượng tồn kho...');
                    return [4 /*yield*/, rollbackInventory(orderInfo.items)];
                case 11:
                    _d.sent();
                    _d.label = 12;
                case 12:
                    if (!(donHangId && createdSteps.includes('don_hang'))) return [3 /*break*/, 14];
                    console.log('🔄 Đang xóa đơn hàng...');
                    return [4 /*yield*/, deleteDonHang(donHangId)];
                case 13:
                    deleteSuccess = _d.sent();
                    if (deleteSuccess) {
                        console.log('✓ Rollback đơn hàng thành công');
                    }
                    else {
                        console.error('❌ Rollback đơn hàng thất bại - cần xóa thủ công:', donHangId);
                    }
                    _d.label = 14;
                case 14:
                    if (err_8 instanceof Error) {
                        alert("\u0110\u1EB7t h\u00E0ng th\u1EA5t b\u1EA1i: ".concat(err_8.message, "\nVui l\u00F2ng th\u1EED l\u1EA1i."));
                    }
                    else {
                        alert('Có lỗi xảy ra trong quá trình đặt hàng. Vui lòng thử lại.');
                    }
                    return [2 /*return*/, false];
                case 15: return [2 /*return*/];
            }
        });
    });
}
// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}
function getElement(id) {
    return document.getElementById(id);
}
function getInputElement(id) {
    return document.getElementById(id);
}
function getSelectElement(id) {
    return document.getElementById(id);
}
function getTextAreaElement(id) {
    return document.getElementById(id);
}
// Load user information from localStorage
function loadUserInfo() {
    var userStr = localStorage.getItem('usercontext');
    if (!userStr)
        return;
    try {
        var user = JSON.parse(userStr);
        var fields = {
            firstName: user._ho,
            lastName: user._ten,
            email: user._email,
            phone: user._so_dien_thoai,
            address: user._dia_chi
        };
        Object.entries(fields).forEach(function (_a) {
            var fieldId = _a[0], value = _a[1];
            var input = getInputElement(fieldId);
            if (input && value) {
                input.value = value;
            }
        });
        if (user._dia_chi) {
            handleAddressParsing(user._dia_chi);
        }
    }
    catch (err) {
        console.error('Lỗi khi parse usercontext:', err);
    }
}
function handleAddressParsing(address) {
    var parts = address.split(',');
    if (parts.length < 3)
        return;
    var citySelect = getSelectElement('city');
    var districtSelect = getSelectElement('district');
    if (!citySelect || !districtSelect)
        return;
    var districtPart = parts[parts.length - 2].trim();
    var cityPart = parts[parts.length - 1].trim();
    var mappedCity = cityMap[cityPart];
    if (mappedCity) {
        citySelect.value = mappedCity;
        citySelect.dispatchEvent(new Event('change'));
        setTimeout(function () {
            var options = Array.from(districtSelect.options);
            var matchedOption = options.find(function (opt) {
                var _a;
                return ((_a = opt.textContent) === null || _a === void 0 ? void 0 : _a.trim()) === districtPart ||
                    opt.value === districtPart.toLowerCase().replace(/\s+/g, '');
            });
            if (matchedOption) {
                districtSelect.value = matchedOption.value;
            }
        }, 100);
    }
}
// Load product information from URL params
function loadProductInfo() {
    return __awaiter(this, void 0, void 0, function () {
        var urlParams, bienTheIdsParam, soLuongParam, state, bienTheIdsStr, soLuongStr, bienTheIds, soLuongList, promises, results, checkoutBtn, error_3;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    urlParams = new URLSearchParams(window.location.search);
                    bienTheIdsParam = urlParams.get('bien_the_id');
                    soLuongParam = urlParams.get('so_luong');
                    // Nếu không có trong URL, thử lấy từ history state (cho router)
                    if (!bienTheIdsParam || !soLuongParam) {
                        state = history.state;
                        if (state && state.params) {
                            bienTheIdsParam = state.params.bien_the_id;
                            soLuongParam = state.params.so_luong;
                        }
                    }
                    // Debug log để kiểm tra
                    console.log('🔍 Checking params:', {
                        fromURL: {
                            bien_the_id: new URLSearchParams(window.location.search).get('bien_the_id'),
                            so_luong: new URLSearchParams(window.location.search).get('so_luong')
                        },
                        fromState: (_a = history.state) === null || _a === void 0 ? void 0 : _a.params,
                        final: {
                            bien_the_id: bienTheIdsParam,
                            so_luong: soLuongParam
                        }
                    });
                    if (!bienTheIdsParam || !soLuongParam) {
                        console.error('❌ Không tìm thấy params:', {
                            bien_the_id: bienTheIdsParam,
                            so_luong: soLuongParam,
                            currentURL: window.location.href,
                            historyState: history.state
                        });
                        showError('Không tìm thấy thông tin sản phẩm');
                        return [2 /*return*/];
                    }
                    bienTheIdsStr = String(bienTheIdsParam || '');
                    soLuongStr = String(soLuongParam || '');
                    bienTheIds = bienTheIdsStr.split(',')
                        .map(function (id) { return id.trim(); })
                        .filter(function (id) { return id !== ''; });
                    soLuongList = soLuongStr.split(',')
                        .map(function (sl) { return parseInt(sl.trim()); })
                        .filter(function (sl) { return !isNaN(sl); });
                    if (bienTheIds.length !== soLuongList.length) {
                        showError('Thông tin sản phẩm không hợp lệ');
                        return [2 /*return*/];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    console.log('🚀 Loading products with params:', {
                        bienTheIds: bienTheIds,
                        soLuongList: soLuongList
                    });
                    promises = bienTheIds.map(function (id, index) {
                        var url = "http://localhost:3000/api/thanh-toan/".concat(id, "/").concat(soLuongList[index]);
                        console.log("\uD83D\uDCE1 Fetching: ".concat(url));
                        return fetch(url)
                            .then(function (response) {
                            if (!response.ok) {
                                throw new Error("HTTP error! status: ".concat(response.status));
                            }
                            return response.json();
                        });
                    });
                    return [4 /*yield*/, Promise.all(promises)];
                case 2:
                    results = _b.sent();
                    console.log('✅ Products loaded successfully:', results);
                    orderData.items = results;
                    renderOrderItems();
                    calculateTotal();
                    checkoutBtn = document.querySelector('.checkout-btn');
                    if (checkoutBtn) {
                        checkoutBtn.disabled = false;
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _b.sent();
                    console.error('Error loading product info:', error_3);
                    showError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Show error message
function showError(message) {
    var orderItemsContainer = getElement('orderItems');
    if (orderItemsContainer) {
        orderItemsContainer.innerHTML = "\n            <div class=\"error-message\">\n                ".concat(message, "\n            </div>\n        ");
    }
}
// Render order items
function renderOrderItems() {
    var container = getElement('orderItems');
    if (!container)
        return;
    if (orderData.items.length === 0) {
        container.innerHTML = '<div class="error-message">Không có sản phẩm nào</div>';
        return;
    }
    container.innerHTML = orderData.items.map(function (item) { return "\n        <div class=\"order-item\">\n            <div class=\"item-image\">\n                ".concat(item._duong_dan_hinh_anh ?
        "<img src=\"".concat(item._duong_dan_hinh_anh, "\" alt=\"").concat(item._ten_san_pham, "\" onerror=\"this.style.display='none'; this.parentNode.innerHTML='H\u00ECnh \u1EA3nh'\">") :
        'Hình ảnh', "\n            </div>\n            <div class=\"item-details\">\n                <div class=\"item-name\">").concat(item._ten_san_pham, "</div>\n                <div class=\"item-variant\">M\u00E0u: ").concat(item._mau_sac, " | Size: ").concat(item._kich_co, "</div>\n                <div class=\"item-price\">").concat(formatCurrency(item._don_gia), " x ").concat(item._so_luong, "</div>\n            </div>\n        </div>\n    "); }).join('');
}
// Calculate total amount
function calculateTotal() {
    orderData.subtotal = orderData.items.reduce(function (sum, item) {
        return sum + (item._don_gia * item._so_luong);
    }, 0);
    orderData.total = orderData.subtotal + orderData.shipping - orderData.discount;
    updatePriceElement('subtotal', orderData.subtotal);
    updatePriceElement('shipping', orderData.shipping);
    updateDiscountElement();
    updatePriceElement('total', orderData.total);
    var orderTotal = getElement('orderTotal');
    if (orderTotal) {
        orderTotal.style.display = 'block';
    }
}
function updatePriceElement(id, amount) {
    var element = getElement(id);
    if (element) {
        element.textContent = formatCurrency(amount);
    }
}
function updateDiscountElement() {
    var discountElement = getElement('discount');
    if (discountElement) {
        discountElement.textContent = orderData.discount > 0 ?
            "-".concat(formatCurrency(orderData.discount)) : '0đ';
    }
}
// Handle payment method selection
function handlePaymentMethodSelection() {
    document.querySelectorAll('.payment-option').forEach(function (option) {
        option.addEventListener('click', function () {
            document.querySelectorAll('.payment-option').forEach(function (opt) { return opt.classList.remove('selected'); });
            this.classList.add('selected');
            var radioInput = this.querySelector('input[type="radio"]');
            if (radioInput) {
                radioInput.checked = true;
            }
        });
    });
}
// Handle city/district selection
function handleLocationSelection() {
    var citySelect = getSelectElement('city');
    if (!citySelect)
        return;
    citySelect.addEventListener('change', function () {
        var cityValue = this.value;
        var districtSelect = getSelectElement('district');
        if (!districtSelect)
            return;
        districtSelect.innerHTML = '<option value="">Chọn phường/xã</option>';
        if (districts[cityValue]) {
            districts[cityValue].forEach(function (district) {
                var option = document.createElement('option');
                option.value = district.toLowerCase().replace(/\s+/g, '');
                option.textContent = district;
                districtSelect.appendChild(option);
            });
        }
    });
}
// Validate form fields
function validateForm(form) {
    var requiredFields = form.querySelectorAll('[required]');
    var isValid = true;
    requiredFields.forEach(function (field) {
        if (!field.value.trim()) {
            field.style.borderColor = '#e74c3c';
            isValid = false;
        }
        else {
            field.style.borderColor = '#e0e0e0';
        }
    });
    return isValid;
}
// Prepare order information
function prepareOrderInfo() {
    var getFieldValue = function (id) {
        var element = getInputElement(id) || getSelectElement(id) || getTextAreaElement(id);
        return (element === null || element === void 0 ? void 0 : element.value) || '';
    };
    var paymentMethodElement = document.querySelector('input[name="paymentMethod"]:checked');
    return {
        customer: {
            firstName: getFieldValue('firstName'),
            lastName: getFieldValue('lastName'),
            phone: getFieldValue('phone'),
            email: getFieldValue('email'),
            city: getFieldValue('city'),
            district: getFieldValue('district'),
            address: getFieldValue('address'),
            note: getFieldValue('note')
        },
        paymentMethod: (paymentMethodElement === null || paymentMethodElement === void 0 ? void 0 : paymentMethodElement.value) || 'cod',
        items: orderData.items,
        summary: {
            subtotal: orderData.subtotal,
            shipping: orderData.shipping,
            discount: orderData.discount,
            total: orderData.total
        }
    };
}
// Handle form submission
function handleFormSubmission() {
    var form = getElement('checkoutForm');
    if (!form)
        return;
    form.addEventListener('submit', function (e) {
        return __awaiter(this, void 0, void 0, function () {
            var isValid, btn, originalText, orderInfo, success, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        e.preventDefault();
                        isValid = validateForm(this);
                        if (!(isValid && orderData.items.length > 0)) return [3 /*break*/, 6];
                        btn = document.querySelector('.checkout-btn');
                        if (!btn)
                            return [2 /*return*/];
                        originalText = btn.textContent || '';
                        btn.textContent = 'Đang xử lý...';
                        btn.disabled = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        orderInfo = prepareOrderInfo();
                        console.log('Order Info:', orderInfo);
                        return [4 /*yield*/, processOrderWithInventory(orderInfo)];
                    case 2:
                        success = _a.sent();
                        if (success) {
                            alert('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
                            // Có thể chuyển hướng đến trang cảm ơn
                            // window.location.href = '/thank-you';
                        }
                        else {
                            // Lỗi đã được xử lý trong processOrderWithInventory
                        }
                        return [3 /*break*/, 5];
                    case 3:
                        error_4 = _a.sent();
                        console.error('Lỗi khi xử lý đơn hàng:', error_4);
                        alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
                        return [3 /*break*/, 5];
                    case 4:
                        btn.textContent = originalText;
                        btn.disabled = false;
                        return [7 /*endfinally*/];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        if (orderData.items.length === 0) {
                            alert('Không có sản phẩm nào để đặt hàng!');
                        }
                        else {
                            alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
                        }
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    });
}
// Handle mobile smooth scrolling
function handleMobileScrolling() {
    if (window.innerWidth <= 768) {
        document.querySelectorAll('input, select, textarea').forEach(function (field) {
            field.addEventListener('focus', function () {
                var _this = this;
                setTimeout(function () {
                    _this.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }, 300);
            });
        });
    }
}
// MAIN INITIALIZATION FUNCTIONS - tương tự như productRender.ts
// Hàm khởi tạo trang thanh toán
function initThanhToan() {
    console.log('Initializing Thanh Toan...');
    // Reset orderData khi khởi tạo lại
    orderData = {
        items: [],
        subtotal: 0,
        shipping: 30000,
        discount: 0,
        total: 0
    };
    // Khởi tạo các chức năng
    handleLocationSelection();
    loadUserInfo();
    loadProductInfo();
    handlePaymentMethodSelection();
    handleFormSubmission();
    handleMobileScrolling();
}
// Expose functions globally để router có thể gọi
window.initThanhToan = initThanhToan;
window.loadProductInfo = loadProductInfo;
window.loadUserInfo = loadUserInfo;
// Chạy khi DOMContentLoaded (cho lần đầu load trực tiếp)
document.addEventListener('DOMContentLoaded', initThanhToan);
// QUAN TRỌNG: Chạy luôn nếu DOM đã ready (cho router)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThanhToan);
}
else {
    // DOM đã ready, chạy luôn
    initThanhToan();
}
