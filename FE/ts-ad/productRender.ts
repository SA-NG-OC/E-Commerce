//Product Render Script with Search Functionality
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

// Biến global để lưu trữ danh sách sản phẩm gốc
let originalProducts: SanPham[] = [];

// Thêm function format giá
function formatPriceAd2(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price);
}

// Thêm function tạo product card đẹp hơn
function createProductCardAd(product: SanPham): string {
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
                <div class="price">${formatPriceAd2(price)} đ</div>
            </div>
        </div>
    `;
}

// Hàm tìm kiếm sản phẩm theo tên
function searchProducts(query: string): SanPham[] {
    if (!query || query.trim() === '') {
        return originalProducts;
    }

    const searchTerm = query.toLowerCase().trim();
    return originalProducts.filter(product =>
        product.ten_san_pham.toLowerCase().includes(searchTerm) ||
        (product.danh_muc && product.danh_muc.toLowerCase().includes(searchTerm)) ||
        (product.thuong_hieu && product.thuong_hieu.toLowerCase().includes(searchTerm))
    );
}

// Hàm hiển thị kết quả tìm kiếm
function displaySearchResults(products: SanPham[]) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    if (products.length === 0) {
        grid.innerHTML = '<div class="placeholder-text">Không tìm thấy sản phẩm nào phù hợp.</div>';
    } else {
        grid.innerHTML = products.map(createProductCardAd).join('');

        // Gán sự kiện click cho từng card
        grid.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', function () {
                const id = card.getAttribute('data-id');
                window.location.href = `/FE/HTML-AD/ChiTietSanPham_Ad.html?id=${id}`;
            });
        });
    }

    // Thêm fade-in effect
    grid.style.opacity = '0';
    grid.style.transition = 'opacity 0.3s ease-in-out';
    setTimeout(() => {
        grid.style.opacity = '1';
    }, 50);
}

// Hàm xử lý sự kiện tìm kiếm
function handleSearch2() {
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    if (!searchInput) return;

    const query = searchInput.value;
    const filteredProducts = searchProducts(query);
    displaySearchResults(filteredProducts);

    // Thêm thông tin số lượng kết quả tìm kiếm (tùy chọn)
    const resultInfo = document.getElementById('searchResultInfo');
    if (resultInfo) {
        if (query.trim() === '') {
            resultInfo.textContent = `Hiển thị tất cả ${originalProducts.length} sản phẩm`;
        } else {
            resultInfo.textContent = `Tìm thấy ${filteredProducts.length} sản phẩm cho "${query}"`;
        }
    }
}

// Hàm khởi tạo search functionality
function initSearchFunctionality() {
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    const searchBtn = document.getElementById('searchBtn') as HTMLButtonElement;

    if (searchInput) {
        // Tìm kiếm khi gõ (debounce)
        let searchTimeout: NodeJS.Timeout;
        searchInput.addEventListener('input', function () {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                handleSearch2();
            }, 300); // Delay 300ms để tránh tìm kiếm quá nhiều
        });

        // Tìm kiếm khi nhấn Enter
        searchInput.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleSearch2();
            }
        });

        // Xóa tìm kiếm khi focus và input rỗng
        searchInput.addEventListener('focus', function () {
            if (this.value.trim() === '') {
                displaySearchResults(originalProducts);
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', function (event) {
            event.preventDefault();
            handleSearch2();
        });
    }
}

// Hàm reset về hiển thị tất cả sản phẩm
function resetSearch() {
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    if (searchInput) {
        searchInput.value = '';
    }
    displaySearchResults(originalProducts);
}

async function renderProductsAd() {
    const loadingContainer = document.getElementById('loadingContainer');
    const grid = document.getElementById('productGrid');

    if (!grid) return;

    try {
        // Hiển thị loading
        if (loadingContainer) {
            loadingContainer.style.display = 'flex';
        }
        grid.style.display = 'none';

        const res = await fetch('http://localhost:3000/api/san-pham/');
        const rawProducts = await res.json();

        // Chuyển đổi dữ liệu
        const products: SanPham[] = rawProducts.map((p: any) => ({
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

        // Lưu danh sách sản phẩm gốc vào biến global
        originalProducts = products;

        // Ẩn loading
        if (loadingContainer) {
            loadingContainer.style.display = 'none';
        }

        // Render products với card đẹp hơn
        grid.innerHTML = products.map(createProductCardAd).join('');
        grid.style.display = 'grid';

        // Gán sự kiện click cho từng card
        grid.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', function () {
                const id = card.getAttribute('data-id');
                window.location.href = `/FE/HTML-AD/ChiTietSanPham_Ad.html?id=${id}`;
            });
        });

        // Thêm fade-in effect
        setTimeout(() => {
            grid.style.opacity = '0';
            grid.style.transition = 'opacity 0.5s ease-in-out';
            grid.style.opacity = '1';
        }, 100);

        // Khởi tạo search functionality sau khi render xong
        initSearchFunctionality();

    } catch (error) {
        console.error('Error loading products:', error);

        if (loadingContainer) {
            loadingContainer.style.display = 'none';
        }

        grid.innerHTML = '<div class="placeholder-text">Không thể tải sản phẩm. Vui lòng thử lại sau.</div>';
        grid.style.display = 'grid';
    }
}

// Hàm khởi tạo trang chủ
function initTrangChuAd() {
    console.log('Initializing Trang Chu...');
    renderProductsAd();
}

// Expose functions globally để router có thể gọi
(window as any).renderProductsAd = renderProductsAd;
(window as any).initTrangChuAd = initTrangChuAd;
(window as any).searchProducts = searchProducts;
(window as any).handleSearch2 = handleSearch2;
(window as any).resetSearch = resetSearch;

// Chạy khi DOMContentLoaded (cho lần đầu load trực tiếp)
document.addEventListener('DOMContentLoaded', initTrangChuAd);

// QUAN TRỌNG: Chạy luôn nếu DOM đã ready (cho router)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTrangChuAd);
} else {
    // DOM đã ready, chạy luôn
    initTrangChuAd();
}