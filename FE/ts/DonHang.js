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
const TRANG_THAI_MAP = {
    [TrangThaiDonHang.CHO_XAC_NHAN]: { text: 'Chờ xác nhận', class: 'pending' },
    [TrangThaiDonHang.DA_XAC_NHAN]: { text: 'Đã xác nhận', class: 'confirmed' },
    [TrangThaiDonHang.DANG_GIAO]: { text: 'Đang giao', class: 'shipping' },
    [TrangThaiDonHang.DA_GIAO]: { text: 'Đã giao', class: 'delivered' },
    [TrangThaiDonHang.DA_HUY]: { text: 'Đã hủy', class: 'cancelled' }
};
// Utility functions
function getId() {
    try {
        const userContext = localStorage.getItem('usercontext');
        if (!userContext)
            return null;
        const user = JSON.parse(userContext);
        return user._id || null;
    }
    catch (error) {
        console.error('Error getting user ID:', error);
        return null;
    }
}
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
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
function formatCurrency2(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
}
function showError2(message) {
    const container = document.getElementById('orders-container');
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <p style="text-align: center; color: #e74c3c; padding: 20px;">
                    ${message}
                </p>
            </div>
        `;
        container.style.display = 'block';
    }
    hideEmptyState();
}
function showEmptyState() {
    const container = document.getElementById('orders-container');
    const empty = document.getElementById('empty-state');
    console.log('Showing empty state');
    if (container)
        container.style.display = 'none';
    if (empty)
        empty.classList.remove('hidden');
}
function hideEmptyState() {
    const container = document.getElementById('orders-container');
    const empty = document.getElementById('empty-state');
    console.log('Hiding empty state');
    if (container)
        container.style.display = 'block';
    if (empty)
        empty.classList.add('hidden');
}
// Render
function renderProductsOrder(sanPhams) {
    return sanPhams.map(sp => `
        <div class="product" data-id="${sp.id_san_pham}" style="cursor: pointer;">
            <div class="product-img">
                ${sp.hinh_anh_bien_the ?
        `<img src="${sp.hinh_anh_bien_the}" alt="${sp.ten_san_pham}" 
                  style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;"
                  onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                  <span class="shoe-icon" style="display: none;">👟</span>` :
        '<span class="shoe-icon">👟</span>'}
            </div>
            <div class="product-info">
                <h4 class="product-name">${sp.ten_san_pham}</h4>
                <p class="product-variant">Màu: ${sp.mau_sac} | Size: ${sp.kich_co}</p>
                <p class="product-qty">Số lượng: ${sp.so_luong}</p>
            </div>
            <div class="product-price">
                <p class="price">${formatCurrency2(sp.gia_ban * sp.so_luong)}</p>
            </div>
        </div>
    `).join('');
}
function renderOrderActions(trangThai, orderId) {
    switch (trangThai) {
        case TrangThaiDonHang.CHO_XAC_NHAN:
            return `
                <button class="btn danger" onclick="huyDonHang('${orderId}')">Hủy đơn hàng</button>
            `;
        case TrangThaiDonHang.DANG_GIAO:
            return `
                <button class="btn primary" onclick="theoDoiDonHang('${orderId}')">Theo dõi đơn hàng</button>
                <button class="btn secondary" onclick="lienHeHoTro('${orderId}')">Liên hệ hỗ trợ</button>
            `;
        default:
            return `<button class="btn outline" onclick="muaLai('${orderId}')">Mua lại</button>`;
    }
}
function createOrderCard(order) {
    const trangThaiInfo = TRANG_THAI_MAP[order._trang_thai] || { text: 'Không xác định', class: 'unknown' };
    return `
        <div class="order-card" data-status="${order._trang_thai}">
            <div class="order-header">
                <div class="order-info">
                    <h3 class="order-id">Đơn hàng #${order._id}</h3>
                    <p class="order-date">Ngày đặt: ${formatDate(order._ngay_tao)}</p>
                </div>
                <span class="status ${trangThaiInfo.class}">${trangThaiInfo.text}</span>
            </div>
            <div class="products">${renderProductsOrder(order._san_pham)}</div>
            <div class="order-total">
                <div class="total-row">
                    <span class="total-label">Tổng thanh toán:</span>
                    <span class="total-amount">${formatCurrency2(order._tong_thanh_toan)}</span>
                </div>
            </div>
            <div class="order-actions">${renderOrderActions(order._trang_thai, order._id)}</div>
        </div>
    `;
}
// Thêm function để setup event listeners cho products
function setupProductClickEvents() {
    const products = document.querySelectorAll('.product');
    products.forEach(product => {
        product.addEventListener('click', function () {
            const id = product.getAttribute('data-id');
            if (id) {
                // Sử dụng smooth router thay vì window.location
                if (window.smoothRouter) {
                    window.smoothRouter.navigateTo('ChiTietSanPham.html', { id: id });
                }
                else {
                    // Fallback nếu router chưa sẵn sàng
                    window.location.href = `/FE/HTML/ChiTietSanPham.html?id=${id}`;
                }
            }
        });
    });
}
function loadDonHangData() {
    return __awaiter(this, void 0, void 0, function* () {
        const API_BASE_URL = 'http://localhost:3000/api';
        const loadingContainer = document.getElementById('loadingContainer');
        const ordersContainer = document.getElementById('orders-container');
        console.log('Starting to load order data...');
        if (!ordersContainer) {
            console.error('Orders container not found');
            return;
        }
        if (loadingContainer)
            loadingContainer.style.display = 'flex';
        ordersContainer.style.display = 'none';
        const currentUserId = getId();
        console.log('Current User ID:', currentUserId);
        if (!currentUserId) {
            if (loadingContainer)
                loadingContainer.style.display = 'none';
            return showError2('Không tìm thấy thông tin người dùng');
        }
        try {
            const url = `${API_BASE_URL}/don-hang/${currentUserId}`;
            console.log('Fetching from URL:', url);
            const response = yield fetch(url);
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }
            const apiResponse = yield response.json();
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
        }
        catch (error) {
            console.error('Lỗi khi tải dữ liệu đơn hàng:', error);
            if (loadingContainer)
                loadingContainer.style.display = 'none';
            showError2('Không thể tải dữ liệu đơn hàng: ');
        }
    });
}
function renderOrders(orders) {
    const container = document.getElementById('orders-container');
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
    const ordersHtml = orders.map(createOrderCard).join('');
    console.log('Generated HTML length:', ordersHtml.length);
    container.innerHTML = ordersHtml;
    container.style.display = 'block';
    hideEmptyState();
    // Setup product click events sau khi render xong
    setupProductClickEvents();
    // Animation effect
    setTimeout(() => {
        container.style.opacity = '0';
        container.style.transition = 'opacity 0.5s ease-in-out';
        container.style.opacity = '1';
    }, 100);
}
function huyDonHang(orderId) {
    return __awaiter(this, void 0, void 0, function* () {
        const API_BASE_URL = 'http://localhost:3000/api';
        const currentUserId = getId();
        if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?'))
            return;
        try {
            // Sử dụng DELETE method thay vì PUT
            const res = yield fetch(`${API_BASE_URL}/don-hang/${orderId}/${currentUserId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            // Parse response JSON để lấy thông tin chi tiết
            const data = yield res.json();
            if (res.ok && data.success) {
                alert(data.message || 'Đơn hàng đã được hủy thành công');
                yield loadDonHangData();
            }
            else {
                // Hiển thị thông báo lỗi cụ thể từ server
                alert(data.message || 'Không thể hủy đơn hàng');
            }
        }
        catch (error) {
            console.error('Lỗi khi hủy đơn hàng:', error);
            alert('Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại sau.');
        }
    });
}
// Các hàm action khác giữ nguyên
function theoDoiDonHang(orderId) {
    if (window.smoothRouter) {
        window.smoothRouter.navigateTo('TheoDoiDonHang.html', { id: orderId });
    }
    else {
        window.location.href = `/FE/HTML/TheoDoiDonHang.html?id=${orderId}`;
    }
}
function lienHeHoTro(orderId) {
    if (window.smoothRouter) {
        window.smoothRouter.navigateTo('HoTro.html', { orderId });
    }
    else {
        window.location.href = `/FE/HTML/HoTro.html?orderId=${orderId}`;
    }
}
function danhGiaSanPham(orderId) {
    if (window.smoothRouter) {
        window.smoothRouter.navigateTo('DanhGia.html', { orderId });
    }
    else {
        window.location.href = `/FE/HTML/DanhGia.html?orderId=${orderId}`;
    }
}
function muaLai(orderId) {
    window.location.href = `/FE/HTML/ThanhToan.html?orderId=${orderId}`;
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
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', e => {
            e.preventDefault();
            handleFilterClick(tab);
        });
    });
}
function handleFilterClick(clickedTab) {
    document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
    clickedTab.classList.add('active');
    const status = clickedTab.getAttribute('data-status') || 'all';
    filterOrders(status);
}
function filterOrders(status) {
    const cards = document.querySelectorAll('.order-card');
    let visibleCount = 0;
    cards.forEach(card => {
        const cardEl = card;
        const cardStatus = cardEl.getAttribute('data-status') || '';
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
    console.log('Initializing DonHang...');
    setupEventListeners2();
    loadDonHangData();
    const continueBtn = document.querySelector('#empty-state .btn.primary');
    if (continueBtn) {
        continueBtn.addEventListener('click', tiepTucMuaSam);
    }
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
