"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Global state
let currentCategory = '';
let currentBrandFilter = 'all';
let currentSearchTerm = '';
let danhMucs = [];
let thuongHieus = [];
// DOM Elements cache
let comboboxInput;
let comboboxArrow;
let dropdown;
let categoryGrid;
let productGrid;
let productTitle;
let backBtn;
let categoriesView;
let productsView;
let searchInput;
let loadingContainer;
// Utility functions
function formatPrice2(price) {
    let numPrice = price;
    if (typeof price === 'string')
        numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice === null || numPrice === undefined)
        numPrice = 0;
    return new Intl.NumberFormat('vi-VN').format(numPrice);
}
function getDefaultProductImage() {
    return `data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60">
            <rect width="60" height="60" fill="#f8f9fa"/>
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#666" font-size="24">👟</text>
        </svg>
    `)}`;
}
function showError(message) {
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
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('http://localhost:3000/api/danh-muc/');
            const rawData = yield response.json();
            if (!response.ok) {
                throw new Error('Lỗi khi tải danh mục');
            }
            danhMucs = rawData.map((item) => ({
                _id: String(item._id),
                _ten_danh_muc: item._ten_danh_muc,
                _icon: item._icon || '👟'
            }));
        }
        catch (error) {
            console.error('Lỗi khi load danh mục:', error);
            throw error;
        }
    });
}
function loadThuongHieus() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('http://localhost:3000/api/thuong-hieu/');
            const rawData = yield response.json();
            if (!response.ok) {
                throw new Error('Lỗi khi tải thương hiệu');
            }
            thuongHieus = rawData.map((item) => ({
                _id: String(item._id),
                _ten_thuong_hieu: item._ten_thuong_hieu
            }));
        }
        catch (error) {
            console.error('Lỗi khi load thương hiệu:', error);
            throw error;
        }
    });
}
function loadProductsByFilter() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let danhMucId = currentCategory && currentCategory !== 'all' ? currentCategory : 'all';
            let thuongHieuId = currentBrandFilter && currentBrandFilter !== 'all' ? currentBrandFilter : 'all';
            let url = `http://localhost:3000/api/san-pham/filter/${danhMucId}/${thuongHieuId}`;
            const response = yield fetch(url);
            const rawProducts = yield response.json();
            if (!response.ok) {
                throw new Error('Lỗi khi tải sản phẩm');
            }
            // Transform data to match interface
            return rawProducts.map((p) => {
                var _a, _b;
                return ({
                    id: String(p._id),
                    ten_san_pham: p._ten_san_pham,
                    gia_ban: p._gia_ban,
                    danh_muc: (_a = p._danh_muc) !== null && _a !== void 0 ? _a : null,
                    thuong_hieu: (_b = p._thuong_hieu) !== null && _b !== void 0 ? _b : null,
                    danh_sach_hinh_anh: (p._danh_sach_hinh_anh || []).map((img) => ({
                        id: String(img._id),
                        san_pham_id: String(img._san_pham_id),
                        duong_dan_hinh_anh: img._duong_dan_hinh_anh,
                    }))
                });
            });
        }
        catch (error) {
            console.error('Lỗi khi load sản phẩm:', error);
            throw error;
        }
    });
}
// Product card creation
function createProductCard2(product) {
    const images = Array.isArray(product.danh_sach_hinh_anh) ? product.danh_sach_hinh_anh : [];
    let price = product.gia_ban;
    if (price === undefined || price === null)
        price = 0;
    if (typeof price === 'string')
        price = parseFloat(price);
    // Xử lý hình ảnh
    const imageContent = images.length > 0
        ? `<img class="product-img" src="${images[0].duong_dan_hinh_anh}" alt="${product.ten_san_pham}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
           <div class="product-img" style="display: none;">${product.ten_san_pham}</div>`
        : `<div class="product-img">${product.ten_san_pham}</div>`;
    return `
        <div class="product-card" data-id="${product.id}">
            ${imageContent}
            <div class="product-info">
                <div class="product-name">${product.ten_san_pham}</div>
                <div class="product-meta">
                    ${product.danh_muc ? `<span class="product-category">${product.danh_muc}</span>` : ''}
                    ${product.thuong_hieu ? `<span class="product-brand">${product.thuong_hieu}</span>` : ''}
                </div>
                <div class="price">${formatPrice2(price)} đ</div>
            </div>
        </div>
    `;
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
function setupEventListeners() {
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
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchProducts();
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
    const searchTerm = e.target.value.toLowerCase();
    const options = dropdown.querySelectorAll('.combobox-option');
    let hasVisibleOptions = false;
    options.forEach((option, index) => {
        var _a;
        const text = ((_a = option.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
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
    const value = option.getAttribute('data-value') || 'all';
    const text = option.textContent || '';
    // Update input value
    comboboxInput.value = text;
    // Update selected option
    dropdown.querySelectorAll('.combobox-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    option.classList.add('selected');
    // Clear search filter
    dropdown.querySelectorAll('.combobox-option').forEach(opt => {
        opt.classList.remove('hidden');
    });
    // Close dropdown
    hideDropdown();
    // Apply filter
    filterByBrand(value);
}
function handleOutsideClick(e) {
    const target = e.target;
    if (!target.closest('.combobox-container')) {
        hideDropdown();
    }
}
// Render functions
function renderCategories() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!categoryGrid)
            return;
        try {
            showLoading(true);
            categoryGrid.innerHTML = '';
            danhMucs.forEach(danhMuc => {
                const categoryItem = document.createElement('div');
                categoryItem.className = 'category-item';
                categoryItem.onclick = () => showProducts(danhMuc._id);
                categoryItem.innerHTML = `
                <div class="category-icon">${danhMuc._icon}</div>
                <div class="category-name">${danhMuc._ten_danh_muc}</div>
            `;
                categoryGrid.appendChild(categoryItem);
            });
            showLoading(false);
        }
        catch (error) {
            console.error('Lỗi khi render danh mục:', error);
            showError('Không thể hiển thị danh mục');
            showLoading(false);
        }
    });
}
function renderBrandCombobox() {
    if (!dropdown)
        return;
    // Clear existing options
    dropdown.innerHTML = '';
    // Add "Tất cả thương hiệu" option
    const allOption = document.createElement('div');
    allOption.className = 'combobox-option selected';
    allOption.setAttribute('data-value', 'all');
    allOption.textContent = 'Tất cả thương hiệu';
    allOption.addEventListener('click', () => selectBrandOption(allOption)); // 👈 THÊM DÒNG NÀY
    dropdown.appendChild(allOption);
    // Add other brand options
    thuongHieus.forEach(thuongHieu => {
        const option = document.createElement('div');
        option.className = 'combobox-option';
        option.setAttribute('data-value', thuongHieu._id);
        option.textContent = thuongHieu._ten_thuong_hieu;
        option.addEventListener('click', () => selectBrandOption(option));
        dropdown.appendChild(option);
    });
    // Set initial input value
    if (comboboxInput) {
        comboboxInput.value = 'Tất cả thương hiệu';
    }
}
function renderProducts2() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!productGrid)
            return;
        try {
            showLoading(true);
            productGrid.style.display = 'none';
            const products = yield loadProductsByFilter();
            // Apply search filter if exists
            let filteredProducts = [...products];
            if (currentSearchTerm) {
                filteredProducts = filteredProducts.filter(product => product.ten_san_pham.toLowerCase().includes(currentSearchTerm.toLowerCase()));
            }
            showLoading(false);
            if (filteredProducts.length === 0) {
                productGrid.innerHTML = '<div class="placeholder-text">Không tìm thấy sản phẩm nào</div>';
            }
            else {
                productGrid.innerHTML = filteredProducts.map(createProductCard2).join('');
                // Gán sự kiện click cho từng card
                productGrid.querySelectorAll('.product-card').forEach(card => {
                    card.addEventListener('click', function () {
                        const id = card.getAttribute('data-id');
                        if (window.smoothRouter) {
                            window.smoothRouter.navigateTo('ChiTietSanPham.html', { id: id });
                        }
                        else {
                            window.location.href = `/FE/HTML/ChiTietSanPham.html?id=${id}`;
                        }
                    });
                });
            }
            productGrid.style.display = 'grid';
            // Add fade-in effect
            setTimeout(() => {
                productGrid.style.opacity = '0';
                productGrid.style.transition = 'opacity 0.5s ease-in-out';
                productGrid.style.opacity = '1';
            }, 100);
        }
        catch (error) {
            console.error('Error loading products:', error);
            showLoading(false);
            productGrid.innerHTML = '<div class="placeholder-text">Không thể tải sản phẩm. Vui lòng thử lại sau.</div>';
            productGrid.style.display = 'grid';
        }
    });
}
// Navigation functions
function showProducts(categoryId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            currentCategory = categoryId;
            const selectedCategory = danhMucs.find(dm => dm._id === categoryId);
            if (!selectedCategory) {
                showError('Không tìm thấy danh mục');
                return;
            }
            // Show products view
            if (categoriesView)
                categoriesView.style.display = 'none';
            if (productsView)
                productsView.style.display = 'block';
            if (backBtn)
                backBtn.style.display = 'inline-block';
            // Show search section
            const searchSection = document.getElementById('searchSection');
            if (searchSection)
                searchSection.style.display = 'flex';
            // Update title
            if (productTitle)
                productTitle.textContent = selectedCategory._ten_danh_muc;
            // Load products
            yield renderProducts2();
        }
        catch (error) {
            console.error('Lỗi khi hiển thị sản phẩm:', error);
            showError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
        }
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
    const searchSection = document.getElementById('searchSection');
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
    const options = dropdown === null || dropdown === void 0 ? void 0 : dropdown.querySelectorAll('.combobox-option');
    options === null || options === void 0 ? void 0 : options.forEach((opt, index) => {
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
function searchProducts() {
    if (searchInput) {
        currentSearchTerm = searchInput.value.trim();
        if (currentCategory) {
            renderProducts2();
        }
    }
}
// Main initialization function
function initDanhMuc() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Initializing Danh Muc...');
        try {
            initializeElements();
            setupEventListeners();
            showLoading(true);
            yield Promise.all([
                loadDanhMucs(),
                loadThuongHieus()
            ]);
            yield renderCategories();
            renderBrandCombobox();
            showLoading(false);
        }
        catch (error) {
            console.error('Lỗi khi khởi tạo danh mục:', error);
            showError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
            showLoading(false);
        }
    });
}
// Expose functions globally để router có thể gọi
window.initDanhMuc = initDanhMuc;
window.showProducts = showProducts;
window.goBack = goBack;
window.searchProducts = searchProducts;
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
