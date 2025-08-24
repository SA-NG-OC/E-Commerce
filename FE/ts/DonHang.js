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
var _a;
// Enum cho trạng thái đơn hàng
var TrangThaiDonHang;
(function (TrangThaiDonHang) {
    TrangThaiDonHang["CHO_XAC_NHAN"] = "cho_xac_nhan";
    TrangThaiDonHang["DA_XAC_NHAN"] = "da_xac_nhan";
    TrangThaiDonHang["DANG_GIAO"] = "dang_giao";
    TrangThaiDonHang["DA_GIAO"] = "da_giao";
    TrangThaiDonHang["DA_HUY"] = "da_huy";
})(TrangThaiDonHang || (TrangThaiDonHang = {}));
// Mapping trạng thái từ API sang display text
var TRANG_THAI_MAP = (_a = {},
    _a[TrangThaiDonHang.CHO_XAC_NHAN] = { text: 'Chờ xác nhận', class: 'pending' },
    _a[TrangThaiDonHang.DA_XAC_NHAN] = { text: 'Đã xác nhận', class: 'confirmed' },
    _a[TrangThaiDonHang.DANG_GIAO] = { text: 'Đang giao', class: 'shipping' },
    _a[TrangThaiDonHang.DA_GIAO] = { text: 'Đã giao', class: 'delivered' },
    _a[TrangThaiDonHang.DA_HUY] = { text: 'Đã hủy', class: 'cancelled' },
    _a);
function getAuthHeaders50() {
    var token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': "Bearer ".concat(token)
    };
}
// Utility functions
function getId() {
    try {
        var userContext = localStorage.getItem('usercontext');
        if (!userContext)
            return null;
        var user = JSON.parse(userContext);
        return user._id || null;
    }
    catch (error) {
        console.error('Error getting user ID:', error);
        return null;
    }
}
function formatDate2(dateString) {
    try {
        var date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    catch (_a) {
        return dateString;
    }
}
function formatCurrency3(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
}
function showError2(message) {
    var container = document.getElementById('orders-container');
    if (container) {
        container.innerHTML = "\n            <div class=\"error-message\">\n                <p style=\"text-align: center; color: #e74c3c; padding: 20px;\">\n                    ".concat(message, "\n                </p>\n            </div>\n        ");
        container.style.display = 'block';
    }
    hideEmptyState();
}
function showEmptyState() {
    var container = document.getElementById('orders-container');
    var empty = document.getElementById('empty-state');
    console.log('Showing empty state');
    if (container)
        container.style.display = 'none';
    if (empty)
        empty.classList.remove('hidden');
}
function hideEmptyState() {
    var container = document.getElementById('orders-container');
    var empty = document.getElementById('empty-state');
    console.log('Hiding empty state');
    if (container)
        container.style.display = 'block';
    if (empty)
        empty.classList.add('hidden');
}
// Render
function renderProductsOrder(sanPhams) {
    return sanPhams.map(function (sp) { return "\n        <div class=\"product\" data-id=\"".concat(sp.id_san_pham, "\" style=\"cursor: pointer;\">\n            <div class=\"product-img\">\n                ").concat(sp.hinh_anh_bien_the ?
        "<img src=\"".concat(sp.hinh_anh_bien_the, "\" alt=\"").concat(sp.ten_san_pham, "\" \n                  style=\"width: 60px; height: 60px; object-fit: cover; border-radius: 8px;\"\n                  onerror=\"this.style.display='none'; this.nextElementSibling.style.display='flex';\" />\n                  <span class=\"shoe-icon\" style=\"display: none;\">\uD83D\uDC5F</span>") :
        '<span class="shoe-icon">👟</span>', "\n            </div>\n            <div class=\"product-info\">\n                <h4 class=\"product-name\">").concat(sp.ten_san_pham, "</h4>\n                <p class=\"product-variant\">M\u00E0u: ").concat(sp.mau_sac, " | Size: ").concat(sp.kich_co, "</p>\n                <p class=\"product-qty\">S\u1ED1 l\u01B0\u1EE3ng: ").concat(sp.so_luong, "</p>\n            </div>\n            <div class=\"product-price\">\n                <p class=\"price\">").concat(formatCurrency3(sp.gia_ban * sp.so_luong), "</p>\n            </div>\n        </div>\n    "); }).join('');
}
function renderOrderActions(trangThai, orderId, sanPhams) {
    // Tạo chuỗi bien_the_ids và so_luong từ mảng sản phẩm
    var bienTheIds = sanPhams.map(function (sp) { return sp.id_bien_the; }).join(',');
    var soLuongList = sanPhams.map(function (sp) { return sp.so_luong; }).join(',');
    switch (trangThai) {
        case TrangThaiDonHang.CHO_XAC_NHAN:
            return "\n                <button class=\"btn danger\" onclick=\"huyDonHang('".concat(orderId, "')\">H\u1EE7y \u0111\u01A1n h\u00E0ng</button>\n            ");
        case TrangThaiDonHang.DANG_GIAO:
            return "\n                <span>Li\u00EAn h\u1EC7 h\u1ED7 tr\u1EE3 s\u1ED1 \u0111i\u1EC7n tho\u1EA1i: 09120930000</span>\n            ";
        default:
            return "<button class=\"btn outline\" onclick=\"muaLai('".concat(bienTheIds, "', '").concat(soLuongList, "')\">Mua l\u1EA1i</button>");
    }
}
function createOrderCard2(order) {
    var trangThaiInfo = TRANG_THAI_MAP[order._trang_thai] || { text: 'Không xác định', class: 'unknown' };
    return "\n        <div class=\"order-card\" data-status=\"".concat(order._trang_thai, "\">\n            <div class=\"order-header\">\n                <div class=\"order-info\">\n                    <h3 class=\"order-id\">\u0110\u01A1n h\u00E0ng #").concat(order._id, "</h3>\n                    <p class=\"order-date\">Ng\u00E0y \u0111\u1EB7t: ").concat(formatDate2(order._ngay_tao), "</p>\n                </div>\n                <span class=\"status ").concat(trangThaiInfo.class, "\">").concat(trangThaiInfo.text, "</span>\n            </div>\n            <div class=\"products\">").concat(renderProductsOrder(order._san_pham), "</div>\n            <div class=\"order-total\">\n                <div class=\"total-row\">\n                    <span class=\"total-label\">T\u1ED5ng thanh to\u00E1n:</span>\n                    <span class=\"total-amount\">").concat(formatCurrency3(order._tong_thanh_toan), "</span>\n                </div>\n            </div>\n            <div class=\"order-actions\">").concat(renderOrderActions(order._trang_thai, order._id, order._san_pham), "</div>\n        </div>\n    ");
}
// Thêm function để setup event listeners cho products
function setupProductClickEvents() {
    var products = document.querySelectorAll('.product');
    products.forEach(function (product) {
        product.addEventListener('click', function () {
            var id = product.getAttribute('data-id');
            if (id) {
                // Sử dụng smooth router thay vì window.location
                if (window.smoothRouter) {
                    window.smoothRouter.navigateTo('ChiTietSanPham.html', { id: id });
                }
                else {
                    // Fallback nếu router chưa sẵn sàng
                    window.location.href = "/FE/HTML/ChiTietSanPham.html?id=".concat(id);
                }
            }
        });
    });
}
function loadDonHangData() {
    return __awaiter(this, void 0, void 0, function () {
        var API_BASE_URL, loadingContainer, ordersContainer, currentUserId, url, response, apiResponse, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    API_BASE_URL = 'http://localhost:3000/api';
                    loadingContainer = document.getElementById('loadingContainer');
                    ordersContainer = document.getElementById('orders-container');
                    console.log('Starting to load order data...');
                    if (!ordersContainer) {
                        console.error('Orders container not found');
                        return [2 /*return*/];
                    }
                    if (loadingContainer)
                        loadingContainer.style.display = 'flex';
                    ordersContainer.style.display = 'none';
                    currentUserId = getId();
                    console.log('Current User ID:', currentUserId);
                    if (!currentUserId) {
                        if (loadingContainer)
                            loadingContainer.style.display = 'none';
                        return [2 /*return*/, showError2('Không tìm thấy thông tin người dùng')];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    url = "".concat(API_BASE_URL, "/don-hang/").concat(currentUserId);
                    console.log('Fetching from URL:', url);
                    return [4 /*yield*/, fetch(url, {
                            headers: getAuthHeaders50(),
                        })];
                case 2:
                    response = _a.sent();
                    console.log('Response status:', response.status);
                    if (!response.ok) {
                        throw new Error("HTTP error ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    apiResponse = _a.sent();
                    console.log('API Response:', apiResponse);
                    console.log('API Response type:', typeof apiResponse);
                    console.log('Is array?', Array.isArray(apiResponse));
                    if (loadingContainer)
                        loadingContainer.style.display = 'none';
                    // Fix: API trả về trực tiếp array, không wrap trong object
                    if (Array.isArray(apiResponse) && apiResponse.length > 0) {
                        console.log('Found orders, rendering...');
                        renderOrders(apiResponse);
                    }
                    else {
                        console.log('No orders found, showing empty state');
                        showEmptyState();
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error('Lỗi khi tải dữ liệu đơn hàng:', error_1);
                    if (loadingContainer)
                        loadingContainer.style.display = 'none';
                    showError2('Không thể tải dữ liệu đơn hàng: ');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function renderOrders(orders) {
    var container = document.getElementById('orders-container');
    if (!container) {
        console.error('Orders container not found in renderOrders');
        return;
    }
    console.log('Rendering orders:', orders.length);
    container.innerHTML = '';
    if (!orders.length) {
        console.log('No orders to render, showing empty state');
        return showEmptyState();
    }
    var ordersHtml = orders.map(createOrderCard2).join('');
    console.log('Generated HTML length:', ordersHtml.length);
    container.innerHTML = ordersHtml;
    container.style.display = 'block';
    hideEmptyState();
    // Setup product click events sau khi render xong
    setupProductClickEvents();
    // Animation effect
    setTimeout(function () {
        container.style.opacity = '0';
        container.style.transition = 'opacity 0.5s ease-in-out';
        container.style.opacity = '1';
    }, 100);
}
function huyDonHang(orderId) {
    return __awaiter(this, void 0, void 0, function () {
        var API_BASE_URL, currentUserId, res, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    API_BASE_URL = 'http://localhost:3000/api';
                    currentUserId = getId();
                    if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?'))
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/don-hang/").concat(orderId, "/").concat(currentUserId), {
                            method: 'PATCH',
                            headers: getAuthHeaders50(),
                        })];
                case 2:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 3:
                    data = _a.sent();
                    if (!(res.ok && data.success)) return [3 /*break*/, 5];
                    alert(data.message || 'Đơn hàng đã được hủy thành công');
                    return [4 /*yield*/, loadDonHangData()];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    // Hiển thị thông báo lỗi cụ thể từ server
                    alert(data.message || 'Không thể hủy đơn hàng');
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_2 = _a.sent();
                    console.error('Lỗi khi hủy đơn hàng:', error_2);
                    alert('Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại sau.');
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
// Các hàm action khác giữ nguyên
function theoDoiDonHang(orderId) {
    if (window.smoothRouter) {
        window.smoothRouter.navigateTo('TheoDoiDonHang.html', { id: orderId });
    }
    else {
        window.location.href = "/FE/HTML/TheoDoiDonHang.html?id=".concat(orderId);
    }
}
function lienHeHoTro(orderId) {
    if (window.smoothRouter) {
        window.smoothRouter.navigateTo('HoTro.html', { orderId: orderId });
    }
    else {
        window.location.href = "/FE/HTML/HoTro.html?orderId=".concat(orderId);
    }
}
function danhGiaSanPham(orderId) {
    if (window.smoothRouter) {
        window.smoothRouter.navigateTo('DanhGia.html', { orderId: orderId });
    }
    else {
        window.location.href = "/FE/HTML/DanhGia.html?orderId=".concat(orderId);
    }
}
function muaLai(bienTheIds, soLuongList) {
    window.location.href = "/FE/HTML/ThanhToan.html?bien_the_id=".concat(bienTheIds, "&so_luong=").concat(soLuongList);
}
function tiepTucMuaSam() {
    if (window.smoothRouter) {
        window.smoothRouter.navigateTo('TrangChu.html');
    }
    else {
        window.location.href = '/FE/HTML/TrangChu.html';
    }
}
function setupEventListeners2() {
    var filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(function (tab) {
        tab.addEventListener('click', function (e) {
            e.preventDefault();
            handleFilterClick(tab);
        });
    });
}
function handleFilterClick(clickedTab) {
    document.querySelectorAll('.filter-tab').forEach(function (tab) { return tab.classList.remove('active'); });
    clickedTab.classList.add('active');
    var status = clickedTab.getAttribute('data-status') || 'all';
    filterOrders(status);
}
function filterOrders(status) {
    var cards = document.querySelectorAll('.order-card');
    var visibleCount = 0;
    cards.forEach(function (card) {
        var cardEl = card;
        var cardStatus = cardEl.getAttribute('data-status') || '';
        if (status === 'all' || cardStatus === status) {
            cardEl.style.display = 'block';
            visibleCount++;
        }
        else {
            cardEl.style.display = 'none';
        }
    });
    visibleCount === 0 ? showEmptyState() : hideEmptyState();
    // Setup lại product click events sau khi filter
    setupProductClickEvents();
}
// Init
function initDonHang() {
    return __awaiter(this, void 0, void 0, function () {
        var token, res, error_3, continueBtn;
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
                    error_3 = _a.sent();
                    sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
                    window.location.href = '/FE/HTML/DangNhap.html';
                    return [2 /*return*/];
                case 4:
                    console.log('Initializing DonHang...');
                    setupEventListeners2();
                    loadDonHangData();
                    continueBtn = document.querySelector('#empty-state .btn.primary');
                    if (continueBtn) {
                        continueBtn.addEventListener('click', tiepTucMuaSam);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
// Expose
window.loadDonHangData = loadDonHangData;
window.renderOrders = renderOrders;
window.initDonHang = initDonHang;
window.huyDonHang = huyDonHang;
window.theoDoiDonHang = theoDoiDonHang;
window.lienHeHoTro = lienHeHoTro;
window.danhGiaSanPham = danhGiaSanPham;
window.muaLai = muaLai;
window.tiepTucMuaSam = tiepTucMuaSam;
window.setupProductClickEvents = setupProductClickEvents;
document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', initDonHang)
    : initDonHang();
