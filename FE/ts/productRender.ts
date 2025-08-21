//Product Render Script
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

function getAuthHeaders9() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// Thêm function format giá
function formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price);
}

// Thêm function tạo product card đẹp hơn
function createProductCard(product: SanPham): string {
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
                <div class="price">${formatPrice(price)} đ</div>
            </div>
        </div>
    `;
}

async function renderProducts() {
    const loadingContainer = document.getElementById('loadingContainer');
    const grid = document.getElementById('productGrid');

    if (!grid) return;

    try {
        // Hiển thị loading
        if (loadingContainer) {
            loadingContainer.style.display = 'flex';
        }
        grid.style.display = 'none';

        const res = await fetch('http://localhost:3000/api/san-pham/', {
            headers: getAuthHeaders9()
        });
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

        // Ẩn loading
        if (loadingContainer) {
            loadingContainer.style.display = 'none';
        }

        // Render products với card đẹp hơn
        grid.innerHTML = products.map(createProductCard).join('');
        grid.style.display = 'grid';

        // Gán sự kiện click cho từng card
        // Trong productRender.js hoặc nơi bạn render product cards
        grid.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', function () {
                const id = card.getAttribute('data-id');
                // Sử dụng smooth router thay vì window.location
                if ((window as any).smoothRouter) {
                    (window as any).smoothRouter.navigateTo('ChiTietSanPham.html', { id: id });
                } else {
                    // Fallback nếu router chưa sẵn sàng
                    window.location.href = `/FE/HTML/ChiTietSanPham.html?id=${id}`;
                }
            });
        });

        // Thêm fade-in effect
        setTimeout(() => {
            grid.style.opacity = '0';
            grid.style.transition = 'opacity 0.5s ease-in-out';
            grid.style.opacity = '1';
        }, 100);

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
async function initTrangChu() {
    console.log('Initializing Trang Chu...');

    // Kiểm tra đăng nhập
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
        window.location.href = '/FE/HTML/DangNhap.html';
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/api/nguoi-dung/me", {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
            window.location.href = '/FE/HTML/DangNhap.html';
            return;
        }
    } catch (error) {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
        window.location.href = '/FE/HTML/DangNhap.html';
        return;
    }

    // Đã đăng nhập, tiếp tục render products
    renderProducts();
}

// Expose functions globally để router có thể gọi
(window as any).renderProducts = renderProducts;
(window as any).initTrangChu = initTrangChu;

// Chạy khi DOMContentLoaded (cho lần đầu load trực tiếp)
document.addEventListener('DOMContentLoaded', initTrangChu);

// QUAN TRỌNG: Chạy luôn nếu DOM đã ready (cho router)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTrangChu);
} else {
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