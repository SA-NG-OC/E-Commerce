// --- Các hàm xử lý tương tác giỏ hàng ---
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
var _this = this;
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
    calculateTotal();
}
function updateQuantity(button, change) {
    var input = button.parentElement.querySelector('.quantity-input');
    var newValue = parseInt(input.value) + change;
    if (newValue < 1)
        newValue = 1;
    input.value = newValue.toString();
    calculateTotal();
}
function removeItem(button) {
    var item = button.closest('.cart-item');
    if (item)
        item.remove();
    // Cập nhật số lượng item
    var totalItems = document.querySelectorAll('.cart-item').length;
    var itemCount = document.getElementById('itemCount');
    if (itemCount)
        itemCount.textContent = totalItems.toString();
    updateSelection();
    checkEmptyCart();
}
function checkout() {
    var checkedItems = document.querySelectorAll('.item-check:checked');
    if (checkedItems.length === 0) {
        alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán!');
        return;
    }
    var selectedProducts = [];
    checkedItems.forEach(function (checkbox) {
        var _a, _b;
        var item = checkbox.closest('.cart-item');
        var productName = (_a = item === null || item === void 0 ? void 0 : item.querySelector('.product-name')) === null || _a === void 0 ? void 0 : _a.textContent;
        var quantity = (_b = item === null || item === void 0 ? void 0 : item.querySelector('.quantity-input')) === null || _b === void 0 ? void 0 : _b.value;
        selectedProducts.push("".concat(productName, " (x").concat(quantity, ")"));
    });
    alert('Sản phẩm được chọn:\n' + selectedProducts.join('\n') + '\n\nChuyển đến trang thanh toán...');
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
document.addEventListener('DOMContentLoaded', function () { return __awaiter(_this, void 0, void 0, function () {
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
                return [4 /*yield*/, fetch("http://localhost:3000/api/gio-hang/".concat(userId))];
            case 2:
                res = _a.sent();
                console.log(userId);
                if (!res.ok)
                    throw new Error('Không thể lấy dữ liệu giỏ hàng');
                return [4 /*yield*/, res.json()];
            case 3:
                gioHang = _a.sent();
                renderCart(gioHang);
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                cartContent.innerHTML = "<div class=\"empty-cart\"><div class=\"empty-cart-icon\">\uD83D\uDED2</div><h2>L\u1ED7i t\u1EA3i gi\u1ECF h\u00E0ng</h2><p>".concat(err_1, "</p></div>");
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
function renderCart(gioHang) {
    var cartContent = document.getElementById('cartContent');
    if (!cartContent)
        return;
    if (!gioHang || !gioHang._san_pham || gioHang._san_pham.length === 0) {
        cartContent.innerHTML = "<div class=\"empty-cart\"><div class=\"empty-cart-icon\">\uD83D\uDED2</div><h2>Gi\u1ECF h\u00E0ng tr\u1ED1ng</h2><p>Ch\u01B0a c\u00F3 s\u1EA3n ph\u1EA9m n\u00E0o trong gi\u1ECF h\u00E0ng c\u1EE7a b\u1EA1n</p></div>";
        return;
    }
    var html = "\n        <div class=\"select-all\">\n            <input type=\"checkbox\" id=\"selectAll\" onchange=\"selectAllItems()\">\n            <label for=\"selectAll\">Ch\u1ECDn t\u1EA5t c\u1EA3 (<span id=\"itemCount\">".concat(gioHang._san_pham.length, "</span> s\u1EA3n ph\u1EA9m)</label>\n        </div>\n    ");
    for (var _i = 0, _a = gioHang._san_pham; _i < _a.length; _i++) {
        var item = _a[_i];
        var sp = item.san_pham;
        var so_luong = item.so_luong;
        var price = sp._gia_ban;
        var img = (sp._danh_sach_hinh_anh && sp._danh_sach_hinh_anh.length > 0) ? sp._danh_sach_hinh_anh[0]._duong_dan_hinh_anh : '';
        var so_luong_max = sp._so_luong_ton_kho;
        html += "\n        <div class=\"cart-item\" data-product-id=\"".concat(sp._id, "\" data-price=\"").concat(price, "\">\n            <div class=\"item-checkbox\">\n                <input type=\"checkbox\" class=\"item-check\" onchange=\"updateSelection()\">\n            </div>\n            <div class=\"product-image\">").concat(img ? "<img src=\"".concat(img, "\" alt=\"").concat(sp._ten_san_pham, "\" class=\"cart-img\">") : '🛒', "</div>\n            <div class=\"product-info\">\n                <div class=\"product-name\">").concat(sp._ten_san_pham, "</div>\n                <div class=\"product-price\">").concat(formatPriceCart(price), " </div>\n            </div>\n            <div class=\"quantity-controls\">\n                <button class=\"quantity-btn\" onclick=\"updateQuantity(this, -1)\">-</button>\n                <input type=\"number\" class=\"quantity-input\" value=\"").concat(so_luong, "\" min=\"1\"  max=\"").concat(so_luong_max, "\" onchange=\"calculateTotal()\">\n                <button class=\"quantity-btn\" onclick=\"updateQuantity(this, 1)\">+</button>\n            </div>\n            <button class=\"remove-btn\" onclick=\"removeItem(this)\">X\u00F3a</button>\n        </div>\n        ");
    }
    html += "<button id=\"saveButton\">L\u01B0u thay \u0111\u1ED5i</button>";
    html += "\n        <div class=\"cart-summary\">\n            <div class=\"selected-items\" id=\"selectedItems\">\u0110\u00E3 ch\u1ECDn 0 s\u1EA3n ph\u1EA9m</div>\n            <div class=\"summary-row\"><span>T\u1EA1m t\u00EDnh:</span><span id=\"subtotal\">0 \u20AB</span></div>\n            <div class=\"summary-row\"><span>Ph\u00ED v\u1EADn chuy\u1EC3n:</span><span id=\"shipping\">0 \u20AB</span></div>\n            <div class=\"summary-row total\"><span>T\u1ED5ng c\u1ED9ng:</span><span id=\"total\">0 \u20AB</span></div>\n            <button class=\"checkout-btn\" id=\"checkoutBtn\" onclick=\"checkout()\" disabled>Thanh to\u00E1n (<span id=\"selectedCount\">0</span>)</button>\n        </div>\n    ";
    cartContent.innerHTML = html;
    //Nút Lưu thay đổi
    var saveAllBtn = document.getElementById('saveButton');
    if (saveAllBtn) {
        saveAllBtn.onclick = function () {
            return __awaiter(this, void 0, void 0, function () {
                var cartId, items, _i, items_1, item, productId, quantityInput, so_luong, response, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, 6, 7]);
                            saveAllBtn.disabled = true;
                            saveAllBtn.textContent = 'Đang lưu...';
                            cartId = gioHang._id;
                            items = Array.from(document.querySelectorAll('.cart-item'));
                            _i = 0, items_1 = items;
                            _a.label = 1;
                        case 1:
                            if (!(_i < items_1.length)) return [3 /*break*/, 4];
                            item = items_1[_i];
                            productId = item.getAttribute('data-product-id');
                            quantityInput = item.querySelector('.quantity-input');
                            so_luong = quantityInput ? parseInt(quantityInput.value) : 1;
                            return [4 /*yield*/, fetch("http://localhost:3000/api/gio-hang/".concat(cartId, "/san-pham/").concat(productId), {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ so_luong: so_luong })
                                })];
                        case 2:
                            response = _a.sent();
                            if (!response.ok) {
                                throw new Error("L\u1ED7i khi c\u1EADp nh\u1EADt s\u1EA3n ph\u1EA9m ".concat(productId));
                            }
                            _a.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4:
                            alert('✅ Đã lưu tất cả thay đổi!');
                            return [3 /*break*/, 7];
                        case 5:
                            error_1 = _a.sent();
                            console.error('Lỗi khi lưu giỏ hàng:', error_1);
                            alert('❌ Có lỗi xảy ra khi lưu giỏ hàng. Vui lòng thử lại.');
                            return [3 /*break*/, 7];
                        case 6:
                            // Khôi phục trạng thái button
                            saveAllBtn.disabled = false;
                            saveAllBtn.textContent = "L\u01B0u thay \u0111\u1ED5i";
                            return [7 /*endfinally*/];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
    }
    calculateTotal();
}
function calculateTotal() {
    var checkedItems = document.querySelectorAll('.item-check:checked');
    var subtotal = 0;
    var selectedCount = 0;
    checkedItems.forEach(function (checkbox) {
        var item = checkbox.closest('.cart-item');
        if (!item)
            return;
        var price = parseInt((item.dataset.price || '0'));
        var quantityInput = item.querySelector('.quantity-input');
        var quantity = quantityInput ? parseInt(quantityInput.value) : 1;
        subtotal += price * quantity;
        selectedCount++;
    });
    var shipping = selectedCount > 0 ? 30000 : 0;
    var total = subtotal + shipping;
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
    var userContext = localStorage.getItem('usercontext');
    var user = JSON.parse(userContext || '{}');
    var user_id = user._id;
    return user_id || null;
}
fetch('/FE/HTML/NavBar.html')
    .then(function (res) { return res.text(); })
    .then(function (html) {
    var navbar = document.getElementById('navbar');
    if (navbar) {
        navbar.innerHTML = html;
    }
});
