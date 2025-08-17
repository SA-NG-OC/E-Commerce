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
// Thêm function format giá
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price);
}
// Thêm function tạo product card đẹp hơn
function createProductCard(product) {
    var images = Array.isArray(product.danh_sach_hinh_anh) ? product.danh_sach_hinh_anh : [];
    var price = product.gia_ban;
    if (price === undefined || price === null)
        price = 0;
    if (typeof price === 'string')
        price = parseFloat(price);
    // Xử lý hình ảnh
    var imageContent = images.length > 0
        ? "<img class=\"product-img\" src=\"".concat(images[0].duong_dan_hinh_anh, "\" alt=\"").concat(product.ten_san_pham, "\" onerror=\"this.style.display='none'; this.nextElementSibling.style.display='flex';\" />\n           <div class=\"product-img\" style=\"display: none;\">").concat(product.ten_san_pham, "</div>")
        : "<div class=\"product-img\">".concat(product.ten_san_pham, "</div>");
    return "\n        <div class=\"product-card\" data-id=\"".concat(product.id, "\">\n            ").concat(imageContent, "\n            <div class=\"product-info\">\n                <div class=\"product-name\">").concat(product.ten_san_pham, "</div>\n                <div class=\"product-meta\">\n                    ").concat(product.danh_muc ? "<span class=\"product-category\">".concat(product.danh_muc, "</span>") : '', "\n                    ").concat(product.thuong_hieu ? "<span class=\"product-brand\">".concat(product.thuong_hieu, "</span>") : '', "\n                </div>\n                <div class=\"price\">").concat(formatPrice(price), " \u0111</div>\n            </div>\n        </div>\n    ");
}
function renderProducts() {
    return __awaiter(this, void 0, void 0, function () {
        var loadingContainer, grid, res, rawProducts, products, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loadingContainer = document.getElementById('loadingContainer');
                    grid = document.getElementById('productGrid');
                    if (!grid)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    // Hiển thị loading
                    if (loadingContainer) {
                        loadingContainer.style.display = 'flex';
                    }
                    grid.style.display = 'none';
                    return [4 /*yield*/, fetch('http://localhost:3000/api/san-pham/')];
                case 2:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 3:
                    rawProducts = _a.sent();
                    products = rawProducts.map(function (p) {
                        var _a, _b;
                        return ({
                            id: String(p._id),
                            ten_san_pham: p._ten_san_pham,
                            gia_ban: p._gia_ban,
                            danh_muc: (_a = p._danh_muc) !== null && _a !== void 0 ? _a : null,
                            thuong_hieu: (_b = p._thuong_hieu) !== null && _b !== void 0 ? _b : null,
                            danh_sach_hinh_anh: (p._danh_sach_hinh_anh || []).map(function (img) { return ({
                                id: String(img._id),
                                san_pham_id: String(img._san_pham_id),
                                duong_dan_hinh_anh: img._duong_dan_hinh_anh,
                            }); })
                        });
                    });
                    // Ẩn loading
                    if (loadingContainer) {
                        loadingContainer.style.display = 'none';
                    }
                    // Render products với card đẹp hơn
                    grid.innerHTML = products.map(createProductCard).join('');
                    grid.style.display = 'grid';
                    // Gán sự kiện click cho từng card
                    // Trong productRender.js hoặc nơi bạn render product cards
                    grid.querySelectorAll('.product-card').forEach(function (card) {
                        card.addEventListener('click', function () {
                            var id = card.getAttribute('data-id');
                            // Sử dụng smooth router thay vì window.location
                            if (window.smoothRouter) {
                                window.smoothRouter.navigateTo('ChiTietSanPham.html', { id: id });
                            }
                            else {
                                // Fallback nếu router chưa sẵn sàng
                                window.location.href = "/FE/HTML/ChiTietSanPham.html?id=".concat(id);
                            }
                        });
                    });
                    // Thêm fade-in effect
                    setTimeout(function () {
                        grid.style.opacity = '0';
                        grid.style.transition = 'opacity 0.5s ease-in-out';
                        grid.style.opacity = '1';
                    }, 100);
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error('Error loading products:', error_1);
                    if (loadingContainer) {
                        loadingContainer.style.display = 'none';
                    }
                    grid.innerHTML = '<div class="placeholder-text">Không thể tải sản phẩm. Vui lòng thử lại sau.</div>';
                    grid.style.display = 'grid';
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Hàm khởi tạo trang chủ
function initTrangChu() {
    return __awaiter(this, void 0, void 0, function () {
        var token, res, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Initializing Trang Chu...');
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
                    error_2 = _a.sent();
                    sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
                    window.location.href = '/FE/HTML/DangNhap.html';
                    return [2 /*return*/];
                case 4:
                    // Đã đăng nhập, tiếp tục render products
                    renderProducts();
                    return [2 /*return*/];
            }
        });
    });
}
// Expose functions globally để router có thể gọi
window.renderProducts = renderProducts;
window.initTrangChu = initTrangChu;
// Chạy khi DOMContentLoaded (cho lần đầu load trực tiếp)
document.addEventListener('DOMContentLoaded', initTrangChu);
// QUAN TRỌNG: Chạy luôn nếu DOM đã ready (cho router)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTrangChu);
}
else {
    // DOM đã ready, chạy luôn
    initTrangChu();
}
//Phần menu
/*
fetch('/FE/HTML/NavBar.html')
    .then(res => res.text())
    .then(html => {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            navbar.innerHTML = html;
        }
    });
*/ 
