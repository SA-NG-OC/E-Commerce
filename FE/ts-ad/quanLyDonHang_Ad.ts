interface OrderDetail {
    bien_the_id: string;
    so_luong: number;
    gia_ban: number;

    // Thêm các thuộc tính chi tiết
    ten_san_pham: string;
    id_san_pham: string;
    mau_sac: string;
    kich_co: string;
    hinh_anh_bien_the: string;
}

interface Order {
    id: string;
    nguoi_dung_id: string;
    tong_thanh_toan: number;
    trang_thai: string;
    ngay_tao: string;
    chi_tiet: OrderDetail[];
}


let orders: Order[] = [];

async function initOrders() {
    orders = await loadOrdersData();
    displayOrders(orders); // nếu bạn muốn hiển thị ngay sau khi load
}


let currentEditingOrder: string | null = null;

async function getAllOrdersApi(): Promise<Order[]> {
    try {
        const response = await fetch('http://localhost:3000/api/don-hang/');
        if (!response.ok) {
            throw new Error('Lỗi khi gọi API lấy đơn hàng');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        return [];
    }
}

async function loadOrdersData(): Promise<Order[]> {
    const rawOrders = await getAllOrdersApi();

    const convertedOrders: Order[] = rawOrders.map((raw: any) => ({
        id: raw._id,
        nguoi_dung_id: raw._nguoi_dung_id,
        tong_thanh_toan: raw._tong_thanh_toan,
        trang_thai: raw._trang_thai,
        ngay_tao: raw._ngay_tao,
        chi_tiet: raw._san_pham.map((sp: any) => ({
            bien_the_id: sp.id_bien_the,
            so_luong: sp.so_luong,
            gia_ban: sp.gia_ban,
            ten_san_pham: sp.ten_san_pham,
            id_san_pham: sp.id_san_pham,
            mau_sac: sp.mau_sac,
            kich_co: sp.kich_co,
            hinh_anh_bien_the: sp.hinh_anh_bien_the,
        }))
    }));

    return convertedOrders;
}


function showTab(tabName: string): void {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));

    const tab = document.getElementById(tabName);
    if (tab) tab.classList.add('active');

    const clickedTab = event?.target as HTMLElement;
    if (clickedTab?.classList.contains('nav-tab')) {
        clickedTab.classList.add('active');
    }

    if (tabName === 'orders') {
        displayOrders();
    } else if (tabName === 'dashboard') {
        updateDashboard();
    }
}

function getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
        cho_xac_nhan: 'Chờ xác nhận',
        da_xac_nhan: 'Đã xác nhận',
        dang_giao: 'Đang giao',
        da_giao: 'Đã giao',
        da_huy: 'Đã hủy'
    };
    return statusMap[status] || status;
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
}

function createOrderCard(order: Order): string {
    return `
        <div class="order-card">
            <div class="order-header">
                <span class="order-id">Đơn hàng #${order.id}</span>
                <span class="status-badge status-${order.trang_thai}">
                    ${getStatusText(order.trang_thai)}
                </span>
            </div>
            <div class="order-info">
                <div class="info-row">
                    <span class="info-label">Người dùng:</span>
                    <span class="info-value">${order.nguoi_dung_id}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Ngày tạo:</span>
                    <span class="info-value">${formatDate(order.ngay_tao)}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Tổng tiền:</span>
                    <span class="info-value total-amount">${formatCurrency(order.tong_thanh_toan)}</span>
                </div>
            </div>
            <div class="order-actions">
                <button class="btn btn-primary" onclick="viewOrderDetails('${order.id}')" style="flex: 2;">
                    👁️ Chi tiết
                </button>
                <button class="btn btn-secondary" onclick="editOrderStatus('${order.id}')" style="flex: 2;">
                    ✏️ Sửa
                </button>
                <button class="btn" onclick="deleteOrder('${order.id}')" style="background: #ff4757; color: white; flex: 1;">
                    🗑️
                </button>
            </div>
        </div>
    `;
}

function displayOrders(filteredOrders: Order[] | null = null): void {
    const container = document.getElementById('orders-container')!;
    const ordersToShow = filteredOrders || orders;

    if (ordersToShow.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: #666; padding: 40px; grid-column: 1 / -1;">
                <h3>Không tìm thấy đơn hàng nào</h3>
                <p>Thử thay đổi bộ lọc hoặc thêm đơn hàng mới</p>
            </div>
        `;
        return;
    }

    container.innerHTML = ordersToShow.map(createOrderCard).join('');
}

function viewOrderDetails(orderId: string): void {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const modalBody = document.getElementById('modal-body')!;
    modalBody.innerHTML = `
        <div class="order-info">
            <div class="info-row"><span class="info-label">Mã đơn hàng:</span><span class="info-value">${order.id}</span></div>
            <div class="info-row"><span class="info-label">Người dùng:</span><span class="info-value">${order.nguoi_dung_id}</span></div>
            <div class="info-row"><span class="info-label">Trạng thái:</span>
                <span class="status-badge status-${order.trang_thai}">${getStatusText(order.trang_thai)}</span>
            </div>
            <div class="info-row"><span class="info-label">Ngày tạo:</span><span class="info-value">${formatDate(order.ngay_tao)}</span></div>
            <div class="info-row"><span class="info-label">Tổng thanh toán:</span><span class="info-value total-amount">${formatCurrency(order.tong_thanh_toan)}</span></div>
        </div>

        <h3 style="color: #F19EDC; margin: 20px 0 10px 0;">Chi tiết sản phẩm:</h3>
        <table class="details-table">
            <thead>
                <tr>
                    <th>Ảnh</th>
                    <th>Mã sản phẩm</th>
                    <th>Tên sản phẩm</th>
                    <th>Màu sắc</th>
                    <th>Kích cỡ</th>
                    <th>Số lượng</th>
                    <th>Giá bán</th>
                </tr>
            </thead>
            <tbody>
                ${order.chi_tiet.map(item => `
                    <tr>
                        <td><img src="${item.hinh_anh_bien_the}" alt="${item.ten_san_pham}" style="width: 60px; height: auto; border-radius: 6px;" /></td>
                        <td>${item.id_san_pham}</td>
                        <td>${item.ten_san_pham}</td>
                        <td>${item.mau_sac}</td>
                        <td>${item.kich_co}</td>
                        <td>${item.so_luong}</td>
                        <td>${formatCurrency(item.gia_ban)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    (document.getElementById('order-modal') as HTMLElement).style.display = 'block';
}


function editOrderStatus(orderId: string): void {
    currentEditingOrder = orderId;
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    (document.getElementById('new-status') as HTMLSelectElement).value = order.trang_thai;
    (document.getElementById('status-modal') as HTMLElement).style.display = 'block';
}

function closeModal(): void {
    (document.getElementById('order-modal') as HTMLElement).style.display = 'none';
}

function closeStatusModal(): void {
    (document.getElementById('status-modal') as HTMLElement).style.display = 'none';
    currentEditingOrder = null;
}

function updateDashboard(): void {
    (document.getElementById('total-orders')!).textContent = String(orders.length);
    (document.getElementById('pending-orders')!).textContent = String(orders.filter(o => o.trang_thai === 'cho_xac_nhan').length);
    (document.getElementById('confirmed-orders')!).textContent = String(orders.filter(o => o.trang_thai === 'da_xac_nhan').length);
    (document.getElementById('delivered-orders')!).textContent = String(orders.filter(o => o.trang_thai === 'da_giao').length);
}

function setupFilters(): void {
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    const statusFilter = document.getElementById('status-filter') as HTMLSelectElement;
    const dateFilter = document.getElementById('date-filter') as HTMLSelectElement;
    const userFilter = document.getElementById('user-filter') as HTMLInputElement; // 👈 Thêm dòng này

    function applyFilters(): void {
        let filtered = orders;

        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(order =>
                order.id.toLowerCase().includes(searchTerm) ||
                order.nguoi_dung_id.toLowerCase().includes(searchTerm)
            );
        }

        const statusValue = statusFilter.value;
        if (statusValue) {
            filtered = filtered.filter(order => order.trang_thai === statusValue);
        }

        const dateValue = dateFilter.value;
        if (dateValue) {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            filtered = filtered.filter(order => {
                const orderDate = new Date(order.ngay_tao);
                switch (dateValue) {
                    case 'today':
                        return orderDate >= today;
                    case 'week':
                        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                        return orderDate >= weekAgo;
                    case 'month':
                        const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
                        return orderDate >= monthAgo;
                    default:
                        return true;
                }
            });
        }

        const userValue = userFilter.value.toLowerCase(); // 👈 Thêm lọc theo người dùng
        if (userValue) {
            filtered = filtered.filter(order =>
                order.nguoi_dung_id.toLowerCase().includes(userValue)
            );
        }

        displayOrders(filtered);
    }

    searchInput.addEventListener('input', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    dateFilter.addEventListener('change', applyFilters);
    userFilter.addEventListener('input', applyFilters); // 👈 Thêm ở đây
}


document.addEventListener('DOMContentLoaded', async () => {
    orders = await loadOrdersData();
    updateDashboard();
    displayOrders();
    displayOrders();
    setupFilters();
    initOrders();

    document.getElementById('status-form')!.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (currentEditingOrder) {
            const newStatus = (document.getElementById('new-status') as HTMLSelectElement).value;

            try {
                const response = await fetch(`http://localhost:3000/api/don-hang/cap-nhat-trang-thai/${currentEditingOrder}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ trang_thai: newStatus })
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    // Cập nhật trạng thái trong local orders array
                    const order = orders.find(o => o.id === currentEditingOrder);
                    if (order) {
                        order.trang_thai = newStatus;
                    }

                    displayOrders();
                    updateDashboard();
                    (document.getElementById('status-filter') as HTMLSelectElement).value = '';
                    (document.getElementById('date-filter') as HTMLSelectElement).value = '';

                    alert('Cập nhật trạng thái thành công!');
                } else {
                    alert(result.message || 'Cập nhật trạng thái thất bại!');
                }

            } catch (error) {
                console.error('Lỗi khi cập nhật trạng thái:', error);
                alert('Có lỗi xảy ra khi kết nối đến máy chủ!');
            }
        }

        closeStatusModal();
    });

    window.addEventListener('click', function (e) {
        if (e.target === document.getElementById('order-modal')) closeModal();
        if (e.target === document.getElementById('status-modal')) closeStatusModal();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeModal();
            closeStatusModal();
        }
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            (document.getElementById('search-input') as HTMLInputElement).focus();
        }
    });
});

//Xóa đơn hàng 
async function deleteOrderApi(orderId: string): Promise<void> {
    const response = await fetch(`http://localhost:3000/api/don-hang/${orderId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Xóa đơn hàng không thành công');
    }
}

async function deleteOrder(orderId: string): Promise<void> {
    if (confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
        try {
            // Gọi API để xóa trên database
            await deleteOrderApi(orderId);
            (document.getElementById('status-filter') as HTMLSelectElement).value = '';
            (document.getElementById('date-filter') as HTMLSelectElement).value = '';
            // Xóa trên giao diện
            const index = orders.findIndex(o => o.id === orderId);
            if (index > -1) {
                orders.splice(index, 1);
                displayOrders();
                updateDashboard();
                alert('Xóa đơn hàng thành công!');
            }
        } catch (error) {
            console.error('Lỗi khi xóa đơn hàng:', error);
            alert('Xóa đơn hàng thất bại!');
        }
    }
}

