// Interfaces
interface HinhAnhSPModel {
    id: string;
    san_pham_id: string;
    duong_dan_hinh_anh: string;
}

interface SanPham {
    id: string;
    ten_san_pham: string;
    gia_ban: number | string;
    danh_muc?: string | null;
    thuong_hieu?: string | null;
    danh_sach_hinh_anh: HinhAnhSPModel[];
}

interface DanhMucData {
    _id: string;
    _ten_danh_muc: string;
    _icon: string;
}

interface ThuongHieuData {
    _id: string;
    _ten_thuong_hieu: string;
}

// Global state
let currentCategory: string = '';
let currentBrandFilter: string = 'all';
let currentSearchTerm: string = '';
let danhMucs: DanhMucData[] = [];
let thuongHieus: ThuongHieuData[] = [];

// DOM Elements cache
let comboboxInput: HTMLInputElement;
let comboboxArrow: HTMLElement;
let dropdown: HTMLElement;
let categoryGrid: HTMLElement;
let productGrid: HTMLElement;
let productTitle: HTMLElement;
let backBtn: HTMLElement;
let categoriesView: HTMLElement;
let productsView: HTMLElement;
let searchInput: HTMLInputElement;
let loadingContainer: HTMLElement;

// Utility functions
function formatPrice2(price: number | string): string {
    let numPrice = price;
    if (typeof price === 'string') numPrice = parseFloat(price);
    if (isNaN(numPrice as number) || numPrice === null || numPrice === undefined) numPrice = 0;
    return new Intl.NumberFormat('vi-VN').format(numPrice as number);
}

function getDefaultProductImage(): string {
    return `data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60">
            <rect width="60" height="60" fill="#f8f9fa"/>
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#666" font-size="24">👟</text>
        </svg>
    `)}`;
}

function showError3(message: string): void {
    console.error(message);
    alert(message); // Có thể thay bằng toast notification
}

function showLoading(show: boolean): void {
    if (loadingContainer) {
        loadingContainer.style.display = show ? 'flex' : 'none';
    }
}

// API functions
async function loadDanhMucs(): Promise<void> {
    try {
        const response = await fetch('http://localhost:3000/api/danh-muc/');
        const rawData = await response.json();

        if (!response.ok) {
            throw new Error('Lỗi khi tải danh mục');
        }

        danhMucs = rawData.map((item: any) => ({
            _id: String(item._id),
            _ten_danh_muc: item._ten_danh_muc,
            _icon: item._icon || '👟'
        }));

    } catch (error) {
        console.error('Lỗi khi load danh mục:', error);
        throw error;
    }
}

async function loadThuongHieus(): Promise<void> {
    try {
        const response = await fetch('http://localhost:3000/api/thuong-hieu/');
        const rawData = await response.json();

        if (!response.ok) {
            throw new Error('Lỗi khi tải thương hiệu');
        }

        thuongHieus = rawData.map((item: any) => ({
            _id: String(item._id),
            _ten_thuong_hieu: item._ten_thuong_hieu
        }));

    } catch (error) {
        console.error('Lỗi khi load thương hiệu:', error);
        throw error;
    }
}

async function loadProductsByFilter(): Promise<SanPham[]> {
    try {
        let danhMucId = currentCategory && currentCategory !== 'all' ? currentCategory : 'all';
        let thuongHieuId = currentBrandFilter && currentBrandFilter !== 'all' ? currentBrandFilter : 'all';

        let url = `http://localhost:3000/api/san-pham/filter/${danhMucId}/${thuongHieuId}`;

        const response = await fetch(url);
        const rawProducts = await response.json();

        if (!response.ok) {
            throw new Error('Lỗi khi tải sản phẩm');
        }

        // Transform data to match interface
        return rawProducts.map((p: any) => ({
            id: String(p._id),
            ten_san_pham: p._ten_san_pham,
            gia_ban: p._gia_ban,
            danh_muc: p._danh_muc ?? null,
            thuong_hieu: p._thuong_hieu ?? null,
            danh_sach_hinh_anh: (p._danh_sach_hinh_anh || []).map((img: any) => ({
                id: String(img._id),
                san_pham_id: String(img._san_pham_id),
                duong_dan_hinh_anh: img._duong_dan_hinh_anh,
            }))
        }));

    } catch (error) {
        console.error('Lỗi khi load sản phẩm:', error);
        throw error;
    }
}

// Product card creation
function createProductCard2(product: SanPham): string {
    const images = Array.isArray(product.danh_sach_hinh_anh) ? product.danh_sach_hinh_anh : [];

    let price = product.gia_ban;
    if (price === undefined || price === null) price = 0;
    if (typeof price === 'string') price = parseFloat(price);

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
function initializeElements(): void {
    comboboxInput = document.getElementById('brandCombobox') as HTMLInputElement;
    comboboxArrow = document.getElementById('comboboxArrow') as HTMLElement;
    dropdown = document.getElementById('brandDropdown') as HTMLElement;
    categoryGrid = document.getElementById('categoryGrid') as HTMLElement;
    productGrid = document.getElementById('productGrid') as HTMLElement;
    productTitle = document.getElementById('productTitle') as HTMLElement;
    backBtn = document.getElementById('backBtn') as HTMLElement;
    categoriesView = document.getElementById('categoriesView') as HTMLElement;
    productsView = document.getElementById('productsView') as HTMLElement;
    searchInput = document.getElementById('searchInput') as HTMLInputElement;
    loadingContainer = document.getElementById('loadingContainer') as HTMLElement;
}

// Event handlers
function setupEventListeners3(): void {
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

function showDropdown(): void {
    if (dropdown && comboboxArrow) {
        dropdown.classList.add('show');
        comboboxArrow.classList.add('open');
    }
}

function hideDropdown(): void {
    if (dropdown && comboboxArrow) {
        dropdown.classList.remove('show');
        comboboxArrow.classList.remove('open');
    }
}

function filterBrandOptions(e: Event): void {
    const searchTerm = (e.target as HTMLInputElement).value.toLowerCase();
    const options = dropdown.querySelectorAll('.combobox-option');
    let hasVisibleOptions = false;

    options.forEach((option, index) => {
        const text = option.textContent?.toLowerCase() || '';
        if (index === 0 || text.includes(searchTerm)) {
            option.classList.remove('hidden');
            hasVisibleOptions = true;
        } else {
            option.classList.add('hidden');
        }
    });

    if (hasVisibleOptions) {
        showDropdown();
    }
}

function selectBrandOption(option: Element): void {
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

function handleOutsideClick(e: Event): void {
    const target = e.target as Element;
    if (!target.closest('.combobox-container')) {
        hideDropdown();
    }
}

// Render functions
async function renderCategories(): Promise<void> {
    if (!categoryGrid) return;

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
    } catch (error) {
        console.error('Lỗi khi render danh mục:', error);
        showError3('Không thể hiển thị danh mục');
        showLoading(false);
    }
}

function renderBrandCombobox(): void {
    if (!dropdown) return;

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


async function renderProducts2(): Promise<void> {
    if (!productGrid) return;

    try {
        showLoading(true);
        productGrid.style.display = 'none';

        const products = await loadProductsByFilter();

        // Apply search filter if exists
        let filteredProducts = [...products];
        if (currentSearchTerm) {
            filteredProducts = filteredProducts.filter(product =>
                product.ten_san_pham.toLowerCase().includes(currentSearchTerm.toLowerCase())
            );
        }

        showLoading(false);

        if (filteredProducts.length === 0) {
            productGrid.innerHTML = '<div class="placeholder-text">Không tìm thấy sản phẩm nào</div>';
        } else {
            productGrid.innerHTML = filteredProducts.map(createProductCard2).join('');

            // Gán sự kiện click cho từng card
            productGrid.querySelectorAll('.product-card').forEach(card => {
                card.addEventListener('click', function () {
                    const id = card.getAttribute('data-id');
                    if ((window as any).smoothRouter) {
                        (window as any).smoothRouter.navigateTo('ChiTietSanPham.html', { id: id });
                    } else {
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

    } catch (error) {
        console.error('Error loading products:', error);
        showLoading(false);
        productGrid.innerHTML = '<div class="placeholder-text">Không thể tải sản phẩm. Vui lòng thử lại sau.</div>';
        productGrid.style.display = 'grid';
    }
}

// Navigation functions
async function showProducts(categoryId: string): Promise<void> {
    try {
        currentCategory = categoryId;
        const selectedCategory = danhMucs.find(dm => dm._id === categoryId);

        if (!selectedCategory) {
            showError3('Không tìm thấy danh mục');
            return;
        }

        // Show products view
        if (categoriesView) categoriesView.style.display = 'none';
        if (productsView) productsView.style.display = 'block';
        if (backBtn) backBtn.style.display = 'inline-block';

        // Show search section
        const searchSection = document.getElementById('searchSection');
        if (searchSection) searchSection.style.display = 'flex';

        // Update title
        if (productTitle) productTitle.textContent = selectedCategory._ten_danh_muc;

        // Load products
        await renderProducts2();
    } catch (error) {
        console.error('Lỗi khi hiển thị sản phẩm:', error);
        showError3('Không thể tải sản phẩm. Vui lòng thử lại sau.');
    }
}

function goBack(): void {
    if (categoriesView) categoriesView.style.display = 'block';
    if (productsView) productsView.style.display = 'none';
    if (backBtn) backBtn.style.display = 'none';

    // Hide search section
    const searchSection = document.getElementById('searchSection');
    if (searchSection) searchSection.style.display = 'none';

    currentCategory = '';

    // Reset filters
    currentBrandFilter = 'all';
    currentSearchTerm = '';
    if (searchInput) searchInput.value = '';

    // Reset combobox
    if (comboboxInput) comboboxInput.value = 'Tất cả thương hiệu';
    const options = dropdown?.querySelectorAll('.combobox-option');
    options?.forEach((opt, index) => {
        opt.classList.remove('selected');
        opt.classList.remove('hidden');
        if (index === 0) opt.classList.add('selected');
    });
}

function filterByBrand(brandId: string): void {
    currentBrandFilter = brandId;
    if (currentCategory) {
        renderProducts2();
    }
}

function searchProducts(): void {
    if (searchInput) {
        currentSearchTerm = searchInput.value.trim();
        if (currentCategory) {
            renderProducts2();
        }
    }
}

// Main initialization function
async function initDanhMuc(): Promise<void> {
    console.log('Initializing Danh Muc...');

    try {
        initializeElements();
        setupEventListeners3();

        showLoading(true);

        await Promise.all([
            loadDanhMucs(),
            loadThuongHieus()
        ]);

        await renderCategories();
        renderBrandCombobox();

        showLoading(false);

    } catch (error) {
        console.error('Lỗi khi khởi tạo danh mục:', error);
        showError3('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        showLoading(false);
    }
}

// Expose functions globally để router có thể gọi
(window as any).initDanhMuc = initDanhMuc;
(window as any).showProducts = showProducts;
(window as any).goBack = goBack;
(window as any).searchProducts = searchProducts;
(window as any).filterByBrand = filterByBrand;

// Chạy khi DOMContentLoaded (cho lần đầu load trực tiếp)
document.addEventListener('DOMContentLoaded', initDanhMuc);

// QUAN TRỌNG: Chạy luôn nếu DOM đã ready (cho router)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDanhMuc);
} else {
    // DOM đã ready, chạy luôn
    initDanhMuc();
}