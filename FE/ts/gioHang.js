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
function getAuthHeaders60() {
    var token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': "Bearer ".concat(token)
    };
}
// --- Các hàm xử lý tương tác giỏ hàng ---
function selectAllItems() {
    var selectAllCheckbox = document.getElementById('selectAll');
    var itemCheckboxes = document.querySelectorAll('.item-check');
    itemCheckboxes.forEach(function (checkbox) {
        checkbox.checked = selectAllCheckbox.checked;
    });
    updateSelection();
}
function formatPriceCart(price) {
    return price.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND'
    });
}
function updateSelection() {
    var itemCheckboxes = document.querySelectorAll('.item-check');
    var selectAllCheckbox = document.getElementById('selectAll');
    var checkedItems = document.querySelectorAll('.item-check:checked');
    selectAllCheckbox.checked = checkedItems.length === itemCheckboxes.length;
    selectAllCheckbox.indeterminate = checkedItems.length > 0 && checkedItems.length < itemCheckboxes.length;
    calculateTotal2();
}
function updateQuantity(button, change) {
    var input = button.parentElement.querySelector('.quantity-input');
    var maxQuantity = parseInt(input.getAttribute('max') || '999');
    var newValue = parseInt(input.value) + change;
    if (newValue < 1)
        newValue = 1;
    if (newValue > maxQuantity)
        newValue = maxQuantity;
    input.value = newValue.toString();
    calculateTotal2();
}
function removeItem(button) {
    var item = button.closest('.cart-item');
    if (item) {
        var bienTheId = item.getAttribute('data-bien-the-id');
        var gioHangId = getCurrentCartId();
        var confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?');
        if (!confirmDelete)
            return;
        if (bienTheId && gioHangId) {
            // Gọi API xóa sản phẩm
            removeItemFromCart(gioHangId, bienTheId);
        }
        item.remove();
        // Cập nhật số lượng item
        var totalItems = document.querySelectorAll('.cart-item').length;
        var itemCount = document.getElementById('itemCount');
        if (itemCount)
            itemCount.textContent = totalItems.toString();
        updateSelection();
        checkEmptyCart();
    }
}
function removeItemFromCart(gioHangId, bienTheId) {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fetch("http://localhost:3000/api/gio-hang/".concat(gioHangId, "/bien-the/").concat(bienTheId), {
                            headers: getAuthHeaders60(),
                            method: 'DELETE'
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error('Không thể xóa sản phẩm');
                    }
                    console.log('Đã xóa sản phẩm khỏi giỏ hàng');
                    alert('Đã xóa sản phẩm khỏi giỏ hàng');
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Lỗi khi xóa sản phẩm:', error_1);
                    alert('Có lỗi xảy ra khi xóa sản phẩm');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function checkout() {
    return __awaiter(this, void 0, void 0, function () {
        var checkedItems, checkoutBtn, checkoutData_1, bienTheIds_1, soLuongs_1, urlParams, error_2, checkoutBtn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    checkedItems = document.querySelectorAll('.item-check:checked');
                    if (checkedItems.length === 0) {
                        alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán!');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    checkoutBtn = document.getElementById('checkoutBtn');
                    if (checkoutBtn) {
                        checkoutBtn.disabled = true;
                        checkoutBtn.textContent = 'Đang xử lý...';
                    }
                    // Lưu thay đổi số lượng trước khi thanh toán
                    return [4 /*yield*/, saveQuantityChanges()];
                case 2:
                    // Lưu thay đổi số lượng trước khi thanh toán
                    _a.sent();
                    checkoutData_1 = [];
                    checkedItems.forEach(function (checkbox) {
                        var _a, _b, _c;
                        var item = checkbox.closest('.cart-item');
                        if (!item)
                            return;
                        var bienTheId = item.getAttribute('data-bien-the-id');
                        var productName = ((_a = item.querySelector('.product-name')) === null || _a === void 0 ? void 0 : _a.textContent) || '';
                        var variantInfo = ((_b = item.querySelector('.variant-info')) === null || _b === void 0 ? void 0 : _b.textContent) || '';
                        var price = parseInt(item.dataset.price || '0');
                        var quantityInput = item.querySelector('.quantity-input');
                        var soLuong = quantityInput ? parseInt(quantityInput.value) : 1;
                        var image = ((_c = item.querySelector('.cart-img')) === null || _c === void 0 ? void 0 : _c.getAttribute('src')) || '';
                        if (bienTheId) {
                            checkoutData_1.push({
                                bienTheId: bienTheId,
                                soLuong: soLuong,
                                productName: productName,
                                variantInfo: variantInfo,
                                price: price,
                                image: image
                            });
                        }
                    });
                    bienTheIds_1 = [];
                    soLuongs_1 = [];
                    checkoutData_1.forEach(function (item) {
                        bienTheIds_1.push(item.bienTheId);
                        soLuongs_1.push(item.soLuong.toString());
                    });
                    urlParams = "bien_the_id=".concat(bienTheIds_1.join(','), "&so_luong=").concat(soLuongs_1.join(','));
                    // Lưu dữ liệu chi tiết vào localStorage để trang thanh toán có thể sử dụng
                    localStorage.setItem('checkoutData', JSON.stringify(checkoutData_1));
                    // Chuyển đến trang thanh toán sử dụng smooth router
                    if (window.smoothRouter) {
                        window.smoothRouter.navigateTo('ThanhToan.html', {
                            bien_the_id: bienTheIds_1.join(','),
                            so_luong: soLuongs_1.join(',')
                        });
                    }
                    else {
                        // Fallback: chuyển hướng trực tiếp với URL parameters
                        window.location.href = "/FE/HTML/ThanhToan.html?".concat(urlParams);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('Lỗi khi xử lý thanh toán:', error_2);
                    alert('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.');
                    checkoutBtn = document.getElementById('checkoutBtn');
                    if (checkoutBtn) {
                        checkoutBtn.disabled = false;
                        checkoutBtn.textContent = "Thanh to\u00E1n (".concat(checkedItems.length, ")");
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Hàm riêng để lưu thay đổi số lượng
function saveQuantityChanges() {
    return __awaiter(this, void 0, void 0, function () {
        var cartId, items, _loop_1, _i, items_1, item;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!currentCartData) {
                        throw new Error('Không có dữ liệu giỏ hàng');
                    }
                    cartId = currentCartData._id;
                    items = Array.from(document.querySelectorAll('.cart-item'));
                    _loop_1 = function (item) {
                        var bienTheId, quantityInput, soLuong, originalItem, originalQuantity, response;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    bienTheId = item.getAttribute('data-bien-the-id');
                                    quantityInput = item.querySelector('.quantity-input');
                                    if (!bienTheId || !quantityInput)
                                        return [2 /*return*/, "continue"];
                                    soLuong = parseInt(quantityInput.value);
                                    originalItem = currentCartData._san_pham.find(function (sp) { return sp.id_bien_the === bienTheId; });
                                    originalQuantity = originalItem ? parseInt(originalItem.so_luong) : 0;
                                    if (!(soLuong !== originalQuantity)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, fetch("http://localhost:3000/api/gio-hang/".concat(cartId, "/bien-the/").concat(bienTheId), {
                                            method: 'PUT',
                                            headers: getAuthHeaders60(),
                                            body: JSON.stringify({ so_luong: soLuong })
                                        })];
                                case 1:
                                    response = _b.sent();
                                    if (!response.ok) {
                                        throw new Error("L\u1ED7i khi c\u1EADp nh\u1EADt s\u1ED1 l\u01B0\u1EE3ng cho bi\u1EBFn th\u1EC3 ".concat(bienTheId));
                                    }
                                    _b.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, items_1 = items;
                    _a.label = 1;
                case 1:
                    if (!(_i < items_1.length)) return [3 /*break*/, 4];
                    item = items_1[_i];
                    return [5 /*yield**/, _loop_1(item)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    // Cập nhật dữ liệu currentCartData sau khi lưu thành công
                    items.forEach(function (item) {
                        var bienTheId = item.getAttribute('data-bien-the-id');
                        var quantityInput = item.querySelector('.quantity-input');
                        if (bienTheId && quantityInput) {
                            var soLuong = parseInt(quantityInput.value);
                            var itemInData = currentCartData._san_pham.find(function (sp) { return sp.id_bien_the === bienTheId; });
                            if (itemInData) {
                                itemInData.so_luong = soLuong.toString();
                            }
                        }
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function checkEmptyCart() {
    var items = document.querySelectorAll('.cart-item');
    if (items.length === 0) {
        var cartContent = document.getElementById('cartContent');
        if (cartContent) {
            cartContent.innerHTML = "\n                <div class=\"empty-cart\">\n                    <div class=\"empty-cart-icon\">\uD83D\uDED2</div>\n                    <h2>Gi\u1ECF h\u00E0ng tr\u1ED1ng</h2>\n                    <p>Ch\u01B0a c\u00F3 s\u1EA3n ph\u1EA9m n\u00E0o trong gi\u1ECF h\u00E0ng c\u1EE7a b\u1EA1n</p>\n                </div>\n            ";
        }
    }
}
// File: gioHang.ts
// Yêu cầu: Load giỏ hàng từ API và render ra HTML, thay thế dữ liệu mặc định
var currentCartData = null; // Lưu trữ dữ liệu giỏ hàng hiện tại
function loadGioHang() {
    return __awaiter(this, void 0, void 0, function () {
        var userId, cartContent, res, gioHang, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userId = getCurrentUserId();
                    if (!userId)
                        return [2 /*return*/];
                    cartContent = document.getElementById('cartContent');
                    if (!cartContent)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("http://localhost:3000/api/gio-hang/".concat(userId), {
                            headers: getAuthHeaders60()
                        })];
                case 2:
                    res = _a.sent();
                    console.log('User ID:', userId);
                    if (!res.ok)
                        throw new Error('Không thể lấy dữ liệu giỏ hàng');
                    return [4 /*yield*/, res.json()];
                case 3:
                    gioHang = _a.sent();
                    currentCartData = gioHang; // Lưu trữ dữ liệu giỏ hàng
                    renderCart(gioHang);
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    console.error('Lỗi tải giỏ hàng:', err_1);
                    cartContent.innerHTML = "\n            <div class=\"empty-cart\">\n                <div class=\"empty-cart-icon\">\uD83D\uDED2</div>\n                <h2>L\u1ED7i t\u1EA3i gi\u1ECF h\u00E0ng</h2>\n                <p>".concat(err_1, "</p>\n            </div>\n        ");
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function renderCart(gioHang) {
    var cartContent = document.getElementById('cartContent');
    if (!cartContent)
        return;
    // Kiểm tra giỏ hàng rỗng
    if (!gioHang || !gioHang._san_pham || gioHang._san_pham.length === 0) {
        cartContent.innerHTML = "\n            <div class=\"empty-cart\">\n                <div class=\"empty-cart-icon\">\uD83D\uDED2</div>\n                <h2>Gi\u1ECF h\u00E0ng tr\u1ED1ng</h2>\n                <p>Ch\u01B0a c\u00F3 s\u1EA3n ph\u1EA9m n\u00E0o trong gi\u1ECF h\u00E0ng c\u1EE7a b\u1EA1n</p>\n            </div>\n        ";
        return;
    }
    var html = "\n        <div class=\"select-all\">\n            <input type=\"checkbox\" id=\"selectAll\" onchange=\"selectAllItems()\">\n            <label for=\"selectAll\">Ch\u1ECDn t\u1EA5t c\u1EA3 (<span id=\"itemCount\">".concat(gioHang._san_pham.length, "</span> s\u1EA3n ph\u1EA9m)</label>\n        </div>\n    ");
    // Render từng item trong giỏ hàng
    for (var _i = 0, _a = gioHang._san_pham; _i < _a.length; _i++) {
        var item = _a[_i];
        // Lấy thông tin sản phẩm
        var productId = item.id_san_pham;
        var productName = item.ten_san_pham;
        var price = item.gia_ban;
        var soLuong = item.so_luong;
        var maxQuantity = item.so_luong_ton;
        var img = item.hinh_anh_bien_the || '';
        var productColor = item.mau_sac || '';
        var productSize = item.kich_co || '';
        var bienTheID = item.id_bien_the;
        // Tạo thông tin biến thể (màu sắc, kích cỡ)
        var variantInfo = "M\u00E0u: ".concat(productColor, " - Size: ").concat(productSize);
        html += "\n            <div class=\"cart-item\" \n                 data-product-id=\"".concat(productId, "\" \n                 data-bien-the-id=\"").concat(bienTheID, "\" \n                 data-price=\"").concat(price, "\">\n                <div class=\"item-checkbox\">\n                    <input type=\"checkbox\" class=\"item-check\" onchange=\"updateSelection()\">\n                </div>\n                <div class=\"product-image\">\n                    ").concat(img ? "<img src=\"".concat(img, "\" alt=\"").concat(productName, "\" class=\"cart-img\">") : '🛒', "\n                </div>\n                <div class=\"product-info\">\n                    <div class=\"product-name\">").concat(productName, "</div>\n                    <div class=\"variant-info\" style=\"font-size: 12px; color: #666; margin: 4px 0;\">").concat(variantInfo, "</div>\n                    <div class=\"product-price\">").concat(formatPriceCart(price), "</div>\n                </div>\n                <div class=\"quantity-group\">\n                    <div class=\"quantity-controls\">\n                        <button class=\"quantity-btn\" onclick=\"updateQuantity(this, -1)\">-</button>\n                        <input type=\"number\" \n                            class=\"quantity-input\" \n                            value=\"").concat(soLuong, "\" \n                            min=\"1\" \n                            max=\"").concat(maxQuantity, "\" \n                            onchange=\"calculateTotal2()\">\n                        <button class=\"quantity-btn\" onclick=\"updateQuantity(this, 1)\">+</button>\n                    </div>\n                    <div class=\"stock-info\">C\u00F2n ").concat(maxQuantity, " s\u1EA3n ph\u1EA9m</div>\n                </div>\n\n                <button class=\"remove-btn\" onclick=\"removeItem(this)\">X\u00F3a</button>\n            </div>\n        ");
    }
    // Nút lưu thay đổi
    html += "<button id=\"saveButton\" class=\"save-changes-btn\">L\u01B0u thay \u0111\u1ED5i</button>";
    // Phần tổng kết đơn hàng
    html += "\n        <div class=\"cart-summary\">\n            <div class=\"selected-items\" id=\"selectedItems\">\u0110\u00E3 ch\u1ECDn 0 s\u1EA3n ph\u1EA9m</div>\n            <div class=\"summary-row\">\n                <span>T\u1EA1m t\u00EDnh:</span>\n                <span id=\"subtotal\">0 \u20AB</span>\n            </div>\n            <div class=\"summary-row\">\n                <span>Ph\u00ED v\u1EADn chuy\u1EC3n:</span>\n                <span id=\"shipping\">0 \u20AB</span>\n            </div>\n            <div class=\"summary-row total\">\n                <span>T\u1ED5ng c\u1ED9ng:</span>\n                <span id=\"total\">0 \u20AB</span>\n            </div>\n            <button class=\"checkout-btn\" id=\"checkoutBtn\" onclick=\"checkout()\" disabled>\n                Thanh to\u00E1n (<span id=\"selectedCount\">0</span>)\n            </button>\n        </div>\n    ";
    cartContent.innerHTML = html;
    // Xử lý nút "Lưu thay đổi"
    var saveAllBtn = document.getElementById('saveButton');
    if (saveAllBtn) {
        saveAllBtn.onclick = function () {
            return __awaiter(this, void 0, void 0, function () {
                var cartId, items, _i, items_2, item, bienTheId, quantityInput, soLuong, response, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, 6, 7]);
                            saveAllBtn.disabled = true;
                            saveAllBtn.textContent = 'Đang lưu...';
                            cartId = gioHang._id;
                            items = Array.from(document.querySelectorAll('.cart-item'));
                            _i = 0, items_2 = items;
                            _a.label = 1;
                        case 1:
                            if (!(_i < items_2.length)) return [3 /*break*/, 4];
                            item = items_2[_i];
                            bienTheId = item.getAttribute('data-bien-the-id');
                            quantityInput = item.querySelector('.quantity-input');
                            soLuong = quantityInput ? parseInt(quantityInput.value) : 1;
                            if (!bienTheId) return [3 /*break*/, 3];
                            return [4 /*yield*/, fetch("http://localhost:3000/api/gio-hang/".concat(cartId, "/bien-the/").concat(bienTheId), {
                                    method: 'PUT',
                                    headers: getAuthHeaders60(),
                                    body: JSON.stringify({ so_luong: soLuong })
                                })];
                        case 2:
                            response = _a.sent();
                            if (!response.ok) {
                                throw new Error("L\u1ED7i khi c\u1EADp nh\u1EADt bi\u1EBFn th\u1EC3 ".concat(bienTheId));
                            }
                            _a.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4:
                            alert('✅ Đã lưu tất cả thay đổi!');
                            return [3 /*break*/, 7];
                        case 5:
                            error_3 = _a.sent();
                            console.error('Lỗi khi lưu giỏ hàng:', error_3);
                            alert('❌ Có lỗi xảy ra khi lưu giỏ hàng. Vui lòng thử lại.');
                            return [3 /*break*/, 7];
                        case 6:
                            // Khôi phục trạng thái button
                            saveAllBtn.disabled = false;
                            saveAllBtn.textContent = 'Lưu thay đổi';
                            return [7 /*endfinally*/];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
    }
    calculateTotal2();
}
function calculateTotal2() {
    var checkedItems = document.querySelectorAll('.item-check:checked');
    var subtotal = 0;
    var selectedCount = 0;
    checkedItems.forEach(function (checkbox) {
        var item = checkbox.closest('.cart-item');
        if (!item)
            return;
        var price = parseInt(item.dataset.price || '0');
        var quantityInput = item.querySelector('.quantity-input');
        var quantity = quantityInput ? parseInt(quantityInput.value) : 1;
        subtotal += price * quantity;
        selectedCount++;
    });
    var shipping = selectedCount > 0 ? 30000 : 0;
    var total = subtotal + shipping;
    // Cập nhật UI
    var subtotalEl = document.getElementById('subtotal');
    if (subtotalEl)
        subtotalEl.textContent = formatPriceCart(subtotal);
    var shippingEl = document.getElementById('shipping');
    if (shippingEl)
        shippingEl.textContent = formatPriceCart(shipping);
    var totalEl = document.getElementById('total');
    if (totalEl)
        totalEl.textContent = formatPriceCart(total);
    var selectedItemsEl = document.getElementById('selectedItems');
    if (selectedItemsEl)
        selectedItemsEl.textContent = "\u0110\u00E3 ch\u1ECDn ".concat(selectedCount, " s\u1EA3n ph\u1EA9m");
    var selectedCountEl = document.getElementById('selectedCount');
    if (selectedCountEl)
        selectedCountEl.textContent = selectedCount.toString();
    var checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn)
        checkoutBtn.disabled = selectedCount === 0;
}
function getCurrentUserId() {
    try {
        var userContext = localStorage.getItem('usercontext');
        if (!userContext)
            return null;
        var user = JSON.parse(userContext);
        return user._id || null;
    }
    catch (error) {
        console.error('Lỗi khi lấy user ID:', error);
        return null;
    }
}
function getCurrentCartId() {
    return currentCartData ? currentCartData._id : null;
}
// Hàm khởi tạo giỏ hàng
function initGioHang() {
    return __awaiter(this, void 0, void 0, function () {
        var token, res, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = localStorage.getItem('token') || sessionStorage.getItem('token');
                    if (!token) {
                        sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
                        window.location.href = '/FE/HTML/DangNhap.html';
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch("http://localhost:3000/api/nguoi-dung/me", {
                            headers: { Authorization: "Bearer ".concat(token) }
                        })];
                case 2:
                    res = _a.sent();
                    if (!res.ok) {
                        localStorage.removeItem('token');
                        sessionStorage.removeItem('token');
                        sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
                        window.location.href = '/FE/HTML/DangNhap.html';
                        return [2 /*return*/];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
                    window.location.href = '/FE/HTML/DangNhap.html';
                    return [2 /*return*/];
                case 4:
                    console.log('Initializing Gio Hang...');
                    loadGioHang();
                    return [2 /*return*/];
            }
        });
    });
}
// Expose functions globally để router có thể gọi
window.loadGioHang = loadGioHang;
window.initGioHang = initGioHang;
window.selectAllItems = selectAllItems;
window.updateSelection = updateSelection;
window.updateQuantity = updateQuantity;
window.removeItem = removeItem;
window.checkout = checkout;
window.calculateTotal2 = calculateTotal2;
// Chạy khi DOMContentLoaded (cho lần đầu load trực tiếp)
document.addEventListener('DOMContentLoaded', initGioHang);
// QUAN TRỌNG: Chạy luôn nếu DOM đã ready (cho router)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGioHang);
}
else {
    // DOM đã ready, chạy luôn
    initGioHang();
}
