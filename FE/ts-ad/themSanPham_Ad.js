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
// API Functions
function getAllDanhMucAd() {
    return __awaiter(this, void 0, void 0, function () {
        var response, rawData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch('http://localhost:3000/api/danh-muc')];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP error! status: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    rawData = _a.sent();
                    // Chuyển đổi dữ liệu từ API format sang interface format
                    return [2 /*return*/, rawData.map(function (item) { return ({
                            id: item._id || item.id,
                            ten_danh_muc: item._ten_danh_muc,
                            mo_ta: item._mo_ta || undefined
                        }); })];
                case 3:
                    error_1 = _a.sent();
                    console.error('Lỗi khi lấy danh mục:', error_1);
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getAllThuongHieuAd() {
    return __awaiter(this, void 0, void 0, function () {
        var response, rawData, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch('http://localhost:3000/api/thuong-hieu')];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP error! status: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    rawData = _a.sent();
                    // Chuyển đổi dữ liệu từ API format sang interface format
                    return [2 /*return*/, rawData.map(function (item) { return ({
                            id: item._id || item.id,
                            ten_thuong_hieu: item._ten_thuong_hieu,
                            mo_ta: item._mo_ta || undefined
                        }); })];
                case 3:
                    error_2 = _a.sent();
                    console.error('Lỗi khi lấy thương hiệu:', error_2);
                    throw error_2;
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Cập nhật hàm createProductAd để phù hợp với API endpoint
function createProductAd(product) {
    return __awaiter(this, void 0, void 0, function () {
        var danhMucSelect, thuongHieuSelect, apiData, response, errorData, result, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    danhMucSelect = document.getElementById('danhMuc');
                    thuongHieuSelect = document.getElementById('thuongHieu');
                    apiData = {
                        ten_san_pham: product.ten_san_pham,
                        ma_san_pham: product.ma_san_pham,
                        mo_ta: product.mo_ta,
                        gia_ban: product.gia_ban,
                        ten_danh_muc: getSelectedTextAd(danhMucSelect), // Truyền tên danh mục
                        ten_thuong_hieu: getSelectedTextAd(thuongHieuSelect) // Truyền tên thương hiệu
                    };
                    return [4 /*yield*/, fetch('http://localhost:3000/api/san-pham', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(apiData)
                        })];
                case 1:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    errorData = _a.sent();
                    throw new Error(errorData.message || "HTTP error! status: ".concat(response.status));
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    result = _a.sent();
                    return [2 /*return*/, result.id || result._id || null];
                case 5:
                    error_3 = _a.sent();
                    console.error('Lỗi khi tạo sản phẩm:', error_3);
                    throw error_3;
                case 6: return [2 /*return*/];
            }
        });
    });
}
// Utility Functions
function formatPriceAd(price) {
    var numPrice = price;
    if (price === undefined || price === null)
        numPrice = 0;
    if (typeof price === 'string')
        numPrice = parseFloat(price);
    if (isNaN(numPrice))
        numPrice = 0;
    return new Intl.NumberFormat('vi-VN').format(numPrice);
}
function validateFormDataAd(data) {
    var _a, _b, _c, _d;
    if (!data.ten_san_pham || !data.ten_san_pham.trim()) {
        alert('⚠️ Vui lòng nhập tên sản phẩm!');
        (_a = document.getElementById('tenSanPham')) === null || _a === void 0 ? void 0 : _a.focus();
        return false;
    }
    if (!data.ma_san_pham || !data.ma_san_pham.trim()) {
        alert('⚠️ Vui lòng nhập mã sản phẩm!');
        (_b = document.getElementById('maSanPham')) === null || _b === void 0 ? void 0 : _b.focus();
        return false;
    }
    // Xử lý validation cho gia_ban kiểu number | string
    var price = data.gia_ban;
    if (typeof price === 'string') {
        price = parseFloat(price);
    }
    if (!price || isNaN(price) || price <= 0) {
        alert('⚠️ Vui lòng nhập giá bán hợp lệ!');
        (_c = document.getElementById('giaBan')) === null || _c === void 0 ? void 0 : _c.focus();
        return false;
    }
    if (data.ma_san_pham.length < 3) {
        alert('⚠️ Mã sản phẩm phải có ít nhất 3 ký tự!');
        (_d = document.getElementById('maSanPham')) === null || _d === void 0 ? void 0 : _d.focus();
        return false;
    }
    return true;
}
function getSelectedTextAd(selectElement) {
    var selectedOption = selectElement.options[selectElement.selectedIndex];
    return selectedOption ? selectedOption.textContent || '' : '';
}
function formatPriceInputAd(input) {
    var value = input.value.replace(/[^\d]/g, '');
    if (value) {
        // Store raw value for form submission
        input.setAttribute('data-raw-value', value);
        // Format hiển thị với dấu phẩy
        var formattedValue = parseInt(value).toLocaleString('vi-VN');
        // Cập nhật placeholder để hiển thị format
        input.placeholder = "".concat(formattedValue, " VN\u0110");
    }
    else {
        input.placeholder = '0';
    }
}
function showSuccessMessageAd(element) {
    element.style.display = 'block';
    element.innerHTML = '🎉 Sản phẩm đã được thêm thành công!';
    element.style.background = 'linear-gradient(135deg, #F19EDC, #e68cc7)';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function hideSuccessMessageAd(element) {
    element.style.display = 'none';
}
function showErrorMessageAd(element, message) {
    // Hiển thị trong success message với màu đỏ
    element.style.display = 'block';
    element.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a52)';
    element.innerHTML = "\u274C ".concat(message);
    // Tự động ẩn sau 5 giây
    setTimeout(function () {
        hideSuccessMessageAd(element);
        // Reset lại màu
        element.style.background = 'linear-gradient(135deg, #F19EDC, #e68cc7)';
    }, 5000);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function populateDanhMucSelectAd(selectElement, danhMucs) {
    // Clear existing options
    selectElement.innerHTML = '<option value="">-- Chọn danh mục --</option>';
    danhMucs.forEach(function (danhMuc) {
        var option = document.createElement('option');
        option.value = danhMuc.id || danhMuc.ten_danh_muc;
        option.textContent = danhMuc.ten_danh_muc;
        option.title = danhMuc.mo_ta || danhMuc.ten_danh_muc; // Tooltip
        selectElement.appendChild(option);
    });
    console.log("\u0110\u00E3 t\u1EA3i ".concat(danhMucs.length, " danh m\u1EE5c"));
}
function populateThuongHieuSelectAd(selectElement, thuongHieus) {
    // Clear existing options
    selectElement.innerHTML = '<option value="">-- Chọn thương hiệu --</option>';
    thuongHieus.forEach(function (thuongHieu) {
        var option = document.createElement('option');
        option.value = thuongHieu.id || thuongHieu.ten_thuong_hieu;
        option.textContent = thuongHieu.ten_thuong_hieu;
        option.title = thuongHieu.mo_ta || thuongHieu.ten_thuong_hieu; // Tooltip
        selectElement.appendChild(option);
    });
    console.log("\u0110\u00E3 t\u1EA3i ".concat(thuongHieus.length, " th\u01B0\u01A1ng hi\u1EC7u"));
}
function setupHoverEffectsAd() {
    var inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(function (input) {
        var element = input;
        element.addEventListener('mouseenter', function () {
            element.style.borderColor = '#e68cc7';
        });
        element.addEventListener('mouseleave', function () {
            if (element !== document.activeElement) {
                element.style.borderColor = '#F19EDC';
            }
        });
    });
}
function setupAnimationsAd() {
    var container = document.querySelector('.container');
    if (container) {
        container.style.opacity = '0';
        container.style.transform = 'translateY(30px)';
        setTimeout(function () {
            container.style.transition = 'all 0.6s ease';
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 100);
    }
}
function getFormDataAd(form) {
    var formData = new FormData(form);
    // Xử lý gia_ban có thể là string hoặc number
    var giaBanValue = formData.get('giaBan');
    var giaBan = parseInt(giaBanValue) || 0;
    // Nếu muốn giữ nguyên dạng string, có thể sử dụng:
    // let giaBan: number | string = giaBanValue || '0';
    return {
        ten_san_pham: formData.get('tenSanPham'),
        ma_san_pham: formData.get('maSanPham'),
        gia_ban: giaBan,
        mo_ta: formData.get('moTa') || null,
        danh_muc: formData.get('danhMuc') || null,
        thuong_hieu: formData.get('thuongHieu') || null
    };
}
function setFormDataAd(data) {
    if (data.ten_san_pham) {
        document.getElementById('tenSanPham').value = data.ten_san_pham;
    }
    if (data.ma_san_pham) {
        document.getElementById('maSanPham').value = data.ma_san_pham;
    }
    if (data.gia_ban !== undefined && data.gia_ban !== null) {
        // Xử lý gia_ban có thể là number hoặc string
        var giaBanValue = typeof data.gia_ban === 'string' ? data.gia_ban : data.gia_ban.toString();
        document.getElementById('giaBan').value = giaBanValue;
    }
    if (data.mo_ta) {
        document.getElementById('moTa').value = data.mo_ta;
    }
    if (data.danh_muc) {
        document.getElementById('danhMuc').value = data.danh_muc;
    }
    if (data.thuong_hieu) {
        document.getElementById('thuongHieu').value = data.thuong_hieu;
    }
}
// Main Functions
function loadDataAd() {
    return __awaiter(this, void 0, void 0, function () {
        var danhMucSelect, thuongHieuSelect, successMessage, _a, danhMucs, thuongHieus, error_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    danhMucSelect = document.getElementById('danhMuc');
                    thuongHieuSelect = document.getElementById('thuongHieu');
                    successMessage = document.getElementById('successMessage');
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, Promise.all([
                            getAllDanhMucAd(),
                            getAllThuongHieuAd()
                        ])];
                case 2:
                    _a = _b.sent(), danhMucs = _a[0], thuongHieus = _a[1];
                    populateDanhMucSelectAd(danhMucSelect, danhMucs);
                    populateThuongHieuSelectAd(thuongHieuSelect, thuongHieus);
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _b.sent();
                    console.error('Lỗi khi load dữ liệu:', error_4);
                    showErrorMessageAd(successMessage, 'Không thể tải dữ liệu danh mục và thương hiệu. Kiểm tra kết nối server.');
                    // Fallback: hiển thị option lỗi
                    danhMucSelect.innerHTML = '<option value="">-- Lỗi tải danh mục --</option>';
                    thuongHieuSelect.innerHTML = '<option value="">-- Lỗi tải thương hiệu --</option>';
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Hàm lấy ID sản phẩm từ mã sản phẩm (nếu cần)
function getProductIdByCode(maSanPham) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("http://localhost:3000/api/san-pham?ma_san_pham=".concat(maSanPham))];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data.id || data._id || null];
                case 3:
                    error_5 = _a.sent();
                    console.error('Lỗi khi lấy ID sản phẩm:', error_5);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Hàm handleSubmitAd được cập nhật
function handleSubmitAd(e) {
    return __awaiter(this, void 0, void 0, function () {
        var form, successMessage, submitButton, productData, productId_1, error_6, errorMessage;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    form = e.target;
                    successMessage = document.getElementById('successMessage');
                    submitButton = form.querySelector('button[type="submit"]');
                    productData = getFormDataAd(form);
                    // Validation
                    if (!validateFormDataAd(productData)) {
                        return [2 /*return*/];
                    }
                    // Disable submit button để tránh double submit
                    if (submitButton) {
                        submitButton.disabled = true;
                        submitButton.textContent = 'Đang thêm...';
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, createProductAd(productData)];
                case 2:
                    productId_1 = _a.sent();
                    // Hiển thị thành công
                    showSuccessMessageAd(successMessage);
                    console.log('Sản phẩm đã được tạo thành công:', productId_1);
                    // Reset form
                    form.reset();
                    // Chờ 2 giây rồi chuyển hướng đến trang chi tiết sản phẩm
                    setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            try {
                                console.log('ID sản phẩm mới:', productId_1);
                                if (productId_1) {
                                    // Chuyển hướng đến trang chi tiết với ID sản phẩm
                                    window.location.href = "/FE/HTML-AD/ChiTietSanPham_Ad.html?id=".concat(productId_1);
                                }
                                else {
                                    // Fallback: chuyển hướng với mã sản phẩm
                                    window.location.href = "/FE/HTML-AD/ChiTietSanPham_Ad.html?ma_san_pham=".concat(encodeURIComponent(productData.ma_san_pham));
                                }
                            }
                            catch (error) {
                                console.error('Lỗi khi chuyển hướng:', error);
                                // Vẫn chuyển hướng với mã sản phẩm nếu có lỗi
                                window.location.href = "/FE/HTML-AD/ChiTietSanPham_Ad.html?ma_san_pham=".concat(encodeURIComponent(productData.ma_san_pham));
                            }
                            return [2 /*return*/];
                        });
                    }); }, 100);
                    return [3 /*break*/, 5];
                case 3:
                    error_6 = _a.sent();
                    console.error('Lỗi khi tạo sản phẩm:', error_6);
                    errorMessage = error_6 instanceof Error ? error_6.message : 'Có lỗi xảy ra khi thêm sản phẩm';
                    showErrorMessageAd(successMessage, errorMessage);
                    return [3 /*break*/, 5];
                case 4:
                    // Re-enable submit button
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.textContent = 'Thêm sản phẩm';
                    }
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function handleResetAd() {
    var successMessage = document.getElementById('successMessage');
    setTimeout(function () {
        hideSuccessMessageAd(successMessage);
    }, 100);
}
function setupEventListenersAd() {
    var form = document.getElementById('productForm');
    var giaBanInput = document.getElementById('giaBan');
    // Submit form
    form.addEventListener('submit', handleSubmitAd);
    // Reset form
    form.addEventListener('reset', handleResetAd);
    // Format giá bán
    giaBanInput.addEventListener('input', function (e) {
        formatPriceInputAd(e.target);
    });
    // Hover effects
    setupHoverEffectsAd();
}
// Initialize function
function initProductFormAd() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadDataAd()];
                case 1:
                    _a.sent();
                    setupEventListenersAd();
                    setupAnimationsAd();
                    return [2 /*return*/];
            }
        });
    });
}
// Initialize khi DOM loaded
document.addEventListener('DOMContentLoaded', initProductFormAd);
// Tất cả functions và interfaces đã sẵn sàng sử dụng
