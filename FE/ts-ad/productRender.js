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
// Thêm function format giá
function formatPriceAd(price) {
    return new Intl.NumberFormat('vi-VN').format(price);
}
// Thêm function tạo product card đẹp hơn
function createProductCardAd(product) {
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
                <div class="price">${formatPriceAd(price)} đ</div>
            </div>
        </div>
    `;
}
function renderProductsAd() {
    return __awaiter(this, void 0, void 0, function* () {
        const loadingContainer = document.getElementById('loadingContainer');
        const grid = document.getElementById('productGrid');
        if (!grid)
            return;
        try {
            // Hiển thị loading
            if (loadingContainer) {
                loadingContainer.style.display = 'flex';
            }
            grid.style.display = 'none';
            const res = yield fetch('http://localhost:3000/api/san-pham/');
            const rawProducts = yield res.json();
            // Chuyển đổi dữ liệu
            const products = rawProducts.map((p) => {
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
            // Ẩn loading
            if (loadingContainer) {
                loadingContainer.style.display = 'none';
            }
            // Render products với card đẹp hơn
            grid.innerHTML = products.map(createProductCardAd).join('');
            grid.style.display = 'grid';
            // Gán sự kiện click cho từng card
            // Trong productRender.js hoặc nơi bạn render product cards
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
        }
        catch (error) {
            console.error('Error loading products:', error);
            if (loadingContainer) {
                loadingContainer.style.display = 'none';
            }
            grid.innerHTML = '<div class="placeholder-text">Không thể tải sản phẩm. Vui lòng thử lại sau.</div>';
            grid.style.display = 'grid';
        }
    });
}
// Hàm khởi tạo trang chủ
function initTrangChuAd() {
    console.log('Initializing Trang Chu...');
    renderProductsAd();
}
// Expose functions globally để router có thể gọi
window.renderProductsAd = renderProductsAd;
window.initTrangChuAd = initTrangChuAd;
// Chạy khi DOMContentLoaded (cho lần đầu load trực tiếp)
document.addEventListener('DOMContentLoaded', initTrangChuAd);
// QUAN TRỌNG: Chạy luôn nếu DOM đã ready (cho router)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTrangChuAd);
}
else {
    // DOM đã ready, chạy luôn
    initTrangChuAd();
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
