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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// Global state
var currentCategory = '';
var currentBrandFilter = 'all';
var currentSearchTerm = '';
var danhMucs = [];
var thuongHieus = [];
// DOM Elements cache
var comboboxInput;
var comboboxArrow;
var dropdown;
var categoryGrid;
var productGrid;
var productTitle;
var backBtn;
var categoriesView;
var productsView;
var searchInput;
var loadingContainer;
function getAuthHeaders11() {
    var token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': "Bearer ".concat(token)
    };
}
// Utility functions
function formatPrice2(price) {
    var numPrice = price;
    if (typeof price === 'string')
        numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice === null || numPrice === undefined)
        numPrice = 0;
    return new Intl.NumberFormat('vi-VN').format(numPrice);
}
function getDefaultProductImage() {
    return "data:image/svg+xml,".concat(encodeURIComponent("\n        <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"60\" height=\"60\" viewBox=\"0 0 60 60\">\n            <rect width=\"60\" height=\"60\" fill=\"#f8f9fa\"/>\n            <text x=\"50%\" y=\"50%\" dominant-baseline=\"middle\" text-anchor=\"middle\" fill=\"#666\" font-size=\"24\">\uD83D\uDC5F</text>\n        </svg>\n    "));
}
function showError3(message) {
    console.error(message);
    alert(message); // Có thể thay bằng toast notification
}
function showLoading(show) {
    if (loadingContainer) {
        loadingContainer.style.display = show ? 'flex' : 'none';
    }
}
// API functions
function loadDanhMucs() {
    return __awaiter(this, void 0, void 0, function () {
        var response, rawData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch('/api/danh-muc/', {
                            headers: getAuthHeaders11()
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    rawData = _a.sent();
                    if (!response.ok) {
                        throw new Error('Lỗi khi tải danh mục');
                    }
                    danhMucs = rawData.map(function (item) { return ({
                        _id: String(item._id),
                        _ten_danh_muc: item._ten_danh_muc,
                        _icon: item._icon || '👟'
                    }); });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Lỗi khi load danh mục:', error_1);
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function loadThuongHieus() {
    return __awaiter(this, void 0, void 0, function () {
        var response, rawData, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch('/api/thuong-hieu/', {
                            headers: getAuthHeaders11()
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    rawData = _a.sent();
                    if (!response.ok) {
                        throw new Error('Lỗi khi tải thương hiệu');
                    }
                    thuongHieus = rawData.map(function (item) { return ({
                        _id: String(item._id),
                        _ten_thuong_hieu: item._ten_thuong_hieu
                    }); });
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('Lỗi khi load thương hiệu:', error_2);
                    throw error_2;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function loadProductsByFilter() {
    return __awaiter(this, void 0, void 0, function () {
        var danhMucId, thuongHieuId, url, response, rawProducts, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    danhMucId = currentCategory && currentCategory !== 'all' ? currentCategory : 'all';
                    thuongHieuId = currentBrandFilter && currentBrandFilter !== 'all' ? currentBrandFilter : 'all';
                    url = "/api/san-pham/filter/".concat(danhMucId, "/").concat(thuongHieuId);
                    return [4 /*yield*/, fetch(url, {
                            headers: getAuthHeaders11()
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    rawProducts = _a.sent();
                    if (!response.ok) {
                        throw new Error('Lỗi khi tải sản phẩm');
                    }
                    // Transform data to match interface
                    return [2 /*return*/, rawProducts.map(function (p) {
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
                        })];
                case 3:
                    error_3 = _a.sent();
                    console.error('Lỗi khi load sản phẩm:', error_3);
                    throw error_3;
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Product card creation
function createProductCard2(product) {
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
    return "\n        <div class=\"product-card\" data-id=\"".concat(product.id, "\">\n            ").concat(imageContent, "\n            <div class=\"product-info\">\n                <div class=\"product-name\">").concat(product.ten_san_pham, "</div>\n                <div class=\"product-meta\">\n                    ").concat(product.danh_muc ? "<span class=\"product-category\">".concat(product.danh_muc, "</span>") : '', "\n                    ").concat(product.thuong_hieu ? "<span class=\"product-brand\">".concat(product.thuong_hieu, "</span>") : '', "\n                </div>\n                <div class=\"price\">").concat(formatPrice2(price), " \u0111</div>\n            </div>\n        </div>\n    ");
}
// DOM initialization
function initializeElements() {
    comboboxInput = document.getElementById('brandCombobox');
    comboboxArrow = document.getElementById('comboboxArrow');
    dropdown = document.getElementById('brandDropdown');
    categoryGrid = document.getElementById('categoryGrid');
    productGrid = document.getElementById('productGrid');
    productTitle = document.getElementById('productTitle');
    backBtn = document.getElementById('backBtn');
    categoriesView = document.getElementById('categoriesView');
    productsView = document.getElementById('productsView');
    searchInput = document.getElementById('searchInput');
    loadingContainer = document.getElementById('loadingContainer');
}
// Event handlers
function setupEventListeners3() {
    if (comboboxInput) {
        comboboxInput.addEventListener('focus', showDropdown);
        comboboxInput.addEventListener('click', showDropdown);
        comboboxInput.addEventListener('input', filterBrandOptions);
    }
    document.addEventListener('click', handleOutsideClick);
    if (backBtn) {
        backBtn.addEventListener('click', goBack);
    }
    if (searchInput) {
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                searchProducts2();
            }
        });
    }
}
function showDropdown() {
    if (dropdown && comboboxArrow) {
        dropdown.classList.add('show');
        comboboxArrow.classList.add('open');
    }
}
function hideDropdown() {
    if (dropdown && comboboxArrow) {
        dropdown.classList.remove('show');
        comboboxArrow.classList.remove('open');
    }
}
function filterBrandOptions(e) {
    var searchTerm = e.target.value.toLowerCase();
    var options = dropdown.querySelectorAll('.combobox-option');
    var hasVisibleOptions = false;
    options.forEach(function (option, index) {
        var _a;
        var text = ((_a = option.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
        if (index === 0 || text.includes(searchTerm)) {
            option.classList.remove('hidden');
            hasVisibleOptions = true;
        }
        else {
            option.classList.add('hidden');
        }
    });
    if (hasVisibleOptions) {
        showDropdown();
    }
}
function selectBrandOption(option) {
    var value = option.getAttribute('data-value') || 'all';
    var text = option.textContent || '';
    // Update input value
    comboboxInput.value = text;
    // Update selected option
    dropdown.querySelectorAll('.combobox-option').forEach(function (opt) {
        opt.classList.remove('selected');
    });
    option.classList.add('selected');
    // Clear search filter
    dropdown.querySelectorAll('.combobox-option').forEach(function (opt) {
        opt.classList.remove('hidden');
    });
    // Close dropdown
    hideDropdown();
    // Apply filter
    filterByBrand(value);
}
function handleOutsideClick(e) {
    var target = e.target;
    if (!target.closest('.combobox-container')) {
        hideDropdown();
    }
}
// Render functions
function renderCategories() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!categoryGrid)
                return [2 /*return*/];
            try {
                showLoading(true);
                categoryGrid.innerHTML = '';
                danhMucs.forEach(function (danhMuc) {
                    var categoryItem = document.createElement('div');
                    categoryItem.className = 'category-item';
                    categoryItem.onclick = function () { return showProducts(danhMuc._id); };
                    categoryItem.innerHTML = "\n                <div class=\"category-icon\">".concat(danhMuc._icon, "</div>\n                <div class=\"category-name\">").concat(danhMuc._ten_danh_muc, "</div>\n            ");
                    categoryGrid.appendChild(categoryItem);
                });
                showLoading(false);
            }
            catch (error) {
                console.error('Lỗi khi render danh mục:', error);
                showError3('Không thể hiển thị danh mục');
                showLoading(false);
            }
            return [2 /*return*/];
        });
    });
}
function renderBrandCombobox() {
    if (!dropdown)
        return;
    // Clear existing options
    dropdown.innerHTML = '';
    // Add "Tất cả thương hiệu" option
    var allOption = document.createElement('div');
    allOption.className = 'combobox-option selected';
    allOption.setAttribute('data-value', 'all');
    allOption.textContent = 'Tất cả thương hiệu';
    allOption.addEventListener('click', function () { return selectBrandOption(allOption); }); // 👈 THÊM DÒNG NÀY
    dropdown.appendChild(allOption);
    // Add other brand options
    thuongHieus.forEach(function (thuongHieu) {
        var option = document.createElement('div');
        option.className = 'combobox-option';
        option.setAttribute('data-value', thuongHieu._id);
        option.textContent = thuongHieu._ten_thuong_hieu;
        option.addEventListener('click', function () { return selectBrandOption(option); });
        dropdown.appendChild(option);
    });
    // Set initial input value
    if (comboboxInput) {
        comboboxInput.value = 'Tất cả thương hiệu';
    }
}
function renderProducts2() {
    return __awaiter(this, void 0, void 0, function () {
        var products, filteredProducts, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!productGrid)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    showLoading(true);
                    productGrid.style.display = 'none';
                    return [4 /*yield*/, loadProductsByFilter()];
                case 2:
                    products = _a.sent();
                    filteredProducts = __spreadArray([], products, true);
                    if (currentSearchTerm) {
                        filteredProducts = filteredProducts.filter(function (product) {
                            return product.ten_san_pham.toLowerCase().includes(currentSearchTerm.toLowerCase());
                        });
                    }
                    showLoading(false);
                    if (filteredProducts.length === 0) {
                        productGrid.innerHTML = '<div class="placeholder-text">Không tìm thấy sản phẩm nào</div>';
                    }
                    else {
                        productGrid.innerHTML = filteredProducts.map(createProductCard2).join('');
                        // Gán sự kiện click cho từng card
                        productGrid.querySelectorAll('.product-card').forEach(function (card) {
                            card.addEventListener('click', function () {
                                var id = card.getAttribute('data-id');
                                if (window.smoothRouter) {
                                    window.smoothRouter.navigateTo('ChiTietSanPham.html', { id: id });
                                }
                                else {
                                    window.location.href = "/HTML/ChiTietSanPham.html?id=".concat(id);
                                }
                            });
                        });
                    }
                    productGrid.style.display = 'grid';
                    // Add fade-in effect
                    setTimeout(function () {
                        productGrid.style.opacity = '0';
                        productGrid.style.transition = 'opacity 0.5s ease-in-out';
                        productGrid.style.opacity = '1';
                    }, 100);
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    console.error('Error loading products:', error_4);
                    showLoading(false);
                    productGrid.innerHTML = '<div class="placeholder-text">Không thể tải sản phẩm. Vui lòng thử lại sau.</div>';
                    productGrid.style.display = 'grid';
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Navigation functions
function showProducts(categoryId) {
    return __awaiter(this, void 0, void 0, function () {
        var selectedCategory, searchSection, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    currentCategory = categoryId;
                    selectedCategory = danhMucs.find(function (dm) { return dm._id === categoryId; });
                    if (!selectedCategory) {
                        showError3('Không tìm thấy danh mục');
                        return [2 /*return*/];
                    }
                    // Show products view
                    if (categoriesView)
                        categoriesView.style.display = 'none';
                    if (productsView)
                        productsView.style.display = 'block';
                    if (backBtn)
                        backBtn.style.display = 'inline-block';
                    searchSection = document.getElementById('searchSection');
                    if (searchSection)
                        searchSection.style.display = 'flex';
                    // Update title
                    if (productTitle)
                        productTitle.textContent = selectedCategory._ten_danh_muc;
                    // Load products
                    return [4 /*yield*/, renderProducts2()];
                case 1:
                    // Load products
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    console.error('Lỗi khi hiển thị sản phẩm:', error_5);
                    showError3('Không thể tải sản phẩm. Vui lòng thử lại sau.');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function goBack() {
    if (categoriesView)
        categoriesView.style.display = 'block';
    if (productsView)
        productsView.style.display = 'none';
    if (backBtn)
        backBtn.style.display = 'none';
    // Hide search section
    var searchSection = document.getElementById('searchSection');
    if (searchSection)
        searchSection.style.display = 'none';
    currentCategory = '';
    // Reset filters
    currentBrandFilter = 'all';
    currentSearchTerm = '';
    if (searchInput)
        searchInput.value = '';
    // Reset combobox
    if (comboboxInput)
        comboboxInput.value = 'Tất cả thương hiệu';
    var options = dropdown === null || dropdown === void 0 ? void 0 : dropdown.querySelectorAll('.combobox-option');
    options === null || options === void 0 ? void 0 : options.forEach(function (opt, index) {
        opt.classList.remove('selected');
        opt.classList.remove('hidden');
        if (index === 0)
            opt.classList.add('selected');
    });
}
function filterByBrand(brandId) {
    currentBrandFilter = brandId;
    if (currentCategory) {
        renderProducts2();
    }
}
function searchProducts2() {
    if (searchInput) {
        currentSearchTerm = searchInput.value.trim();
        if (currentCategory) {
            renderProducts2();
        }
    }
}
// Main initialization function
function initDanhMuc() {
    return __awaiter(this, void 0, void 0, function () {
        var token, res, error_6, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = localStorage.getItem('token') || sessionStorage.getItem('token');
                    if (!token) {
                        sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
                        window.location.href = '/HTML/DangNhap.html';
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch("/api/nguoi-dung/me", {
                            headers: { Authorization: "Bearer ".concat(token) }
                        })];
                case 2:
                    res = _a.sent();
                    if (!res.ok) {
                        localStorage.removeItem('token');
                        sessionStorage.removeItem('token');
                        sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
                        window.location.href = '/HTML/DangNhap.html';
                        return [2 /*return*/];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _a.sent();
                    sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
                    window.location.href = '/HTML/DangNhap.html';
                    return [2 /*return*/];
                case 4:
                    console.log('Initializing Danh Muc...');
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 8, , 9]);
                    initializeElements();
                    setupEventListeners3();
                    showLoading(true);
                    return [4 /*yield*/, Promise.all([
                            loadDanhMucs(),
                            loadThuongHieus()
                        ])];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, renderCategories()];
                case 7:
                    _a.sent();
                    renderBrandCombobox();
                    showLoading(false);
                    return [3 /*break*/, 9];
                case 8:
                    error_7 = _a.sent();
                    console.error('Lỗi khi khởi tạo danh mục:', error_7);
                    showError3('Không thể tải dữ liệu. Vui lòng thử lại sau.');
                    showLoading(false);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
// Expose functions globally để router có thể gọi
window.initDanhMuc = initDanhMuc;
window.showProducts = showProducts;
window.goBack = goBack;
window.searchProducts2 = searchProducts2;
window.filterByBrand = filterByBrand;
// Chạy khi DOMContentLoaded (cho lần đầu load trực tiếp)
document.addEventListener('DOMContentLoaded', initDanhMuc);
// QUAN TRỌNG: Chạy luôn nếu DOM đã ready (cho router)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDanhMuc);
}
else {
    // DOM đã ready, chạy luôn
    initDanhMuc();
}
