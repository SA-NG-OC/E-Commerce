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

interface PaymentInfo {
    _id: string;
    _don_hang_id: string;
    _phuong_thuc_thanh_toan: string;
    _so_tien: string;
    _trang_thai: string;
    _ma_giao_dich: number;
    _ngay_thanh_toan: string;
    _ghi_chu: string;
}

interface AddressInfo {
    _id: string;
    _don_hang_id: string;
    _ho_ten_nguoi_nhan: string;
    _so_dien_thoai: string;
    _dia_chi_chi_tiet: string;
    _phuong_xa: string;
    _tinh_thanh: string;
    _ghi_chu: string;
}

// Thêm biến global
let currentPaymentInfo: PaymentInfo | null = null;
let currentAddressInfo: AddressInfo | null = null;
let isEditingPayment: boolean = false;
let isEditingAddress: boolean = false;


let orders: Order[] = [];

async function initOrders() {
    orders = await loadOrdersData();
    displayOrders(orders); // nếu bạn muốn hiển thị ngay sau khi load
}


let currentEditingOrder: string | null = null;

// API functions mới
async function getPaymentInfoApi(orderId: string): Promise<PaymentInfo | null> {
    try {
        const response = await fetch(`http://localhost:3000/api/giao-dich/${orderId}`);
        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error('Lỗi khi gọi API lấy thông tin thanh toán');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Lỗi khi gọi API thanh toán:', error);
        return null;
    }
}

async function getAddressInfoApi(orderId: string): Promise<AddressInfo | null> {
    try {
        const response = await fetch(`http://localhost:3000/api/dia-chi/${orderId}`);
        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error('Lỗi khi gọi API lấy địa chỉ');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Lỗi khi gọi API địa chỉ:', error);
        return null;
    }
}

async function updatePaymentStatusApi(paymentId: string, newStatus: string): Promise<boolean> {
    try {
        const response = await fetch(`http://localhost:3000/api/giao-dich/cap-nhat-trang-thai/${paymentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ trang_thai: newStatus })
        });

        const result = await response.json();
        return response.ok && result.success;
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái thanh toán:', error);
        return false;
    }
}

async function updateAddressApi(addressId: string, addressData: Partial<AddressInfo>): Promise<boolean> {
    try {
        const response = await fetch(`http://localhost:3000/api/dia-chi/cap-nhat/${addressId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(addressData)
        });

        const result = await response.json();
        return response.ok && result.success;
    } catch (error) {
        console.error('Lỗi khi cập nhật địa chỉ:', error);
        return false;
    }
}

// Helper functions
function getPaymentStatusText(status: string): string {
    const statusMap: Record<string, string> = {
        cho_thanh_toan: 'Chờ thanh toán',
        da_thanh_toan: 'Đã thanh toán',
        that_bai: 'Thất bại',
        hoan_tien: 'Hoàn tiền'
    };
    return statusMap[status] || status;
}

function getPaymentMethodText(method: string): string {
    const methodMap: Record<string, string> = {
        cod: 'Thanh toán khi nhận hàng',
        bank_transfer: 'Chuyển khoản ngân hàng',
        credit_card: 'Thẻ tín dụng',
        e_wallet: 'Ví điện tử'
    };
    return methodMap[method] || method;
}

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

// Cập nhật function createOrderCard - thêm nút thông tin thanh toán
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
                <button class="btn btn-success" onclick="viewPaymentInfo('${order.id}')" style="flex: 2;">
                    💳 Thanh toán
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

async function viewPaymentInfo(orderId: string): Promise<void> {
    const payment = await getPaymentInfoApi(orderId);
    const address = await getAddressInfoApi(orderId);

    if (!payment && !address) {
        alert('Không tìm thấy thông tin thanh toán hoặc địa chỉ!');
        return;
    }

    currentPaymentInfo = payment;
    currentAddressInfo = address;

    const modalBody = document.getElementById('modal-body')!;
    modalBody.innerHTML = `
        <h3 style="color: #2ED573;">Thông tin thanh toán</h3>
        ${payment ? `
        <div class="info-row"><span class="info-label">Mã giao dịch:</span><span class="info-value">${payment._ma_giao_dich}</span></div>
        <div class="info-row"><span class="info-label">Phương thức:</span><span class="info-value">${getPaymentMethodText(payment._phuong_thuc_thanh_toan)}</span></div>
        <div class="info-row"><span class="info-label">Số tiền:</span><span class="info-value">${formatCurrency(Number(payment._so_tien))}</span></div>
        <div class="info-row"><span class="info-label">Trạng thái:</span>
            ${isEditingPayment ? `
                <select id="edit-payment-status" class="form-control">
                    <option value="cho_thanh_toan">Chờ thanh toán</option>
                    <option value="da_thanh_toan">Đã thanh toán</option>
                    <option value="that_bai">Thất bại</option>
                    <option value="hoan_tien">Hoàn tiền</option>
                </select>
                <button class="btn btn-success" onclick="savePaymentStatus('${payment._id}')">💾 Lưu</button>
                <button class="btn btn-secondary" onclick="cancelEditPayment()">❌ Hủy</button>
            ` : `
                <span class="status-badge status-${payment._trang_thai}">
                ${getPaymentStatusText(payment._trang_thai)}
                </span>
                <div style="margin-top: 6px;">
                    <button class="btn btn-outline small-button" onclick="enableEditPayment()">✏️ Sửa</button>
                </div>
            `}
        </div>
        <div class="info-row"><span class="info-label">Ngày thanh toán:</span><span class="info-value">${formatDate(payment._ngay_thanh_toan)}</span></div>
        <div class="info-row"><span class="info-label">Ghi chú:</span><span class="info-value">${payment._ghi_chu || '(Không có)'}</span></div>
        ` : '<p>Không có dữ liệu thanh toán</p>'}

        <hr style="margin: 20px 0;" />

        <h3 style="color: #70A1FF;">Thông tin giao hàng</h3>
        ${address ? `
        <div class="info-row"><span class="info-label">Họ tên:</span>
            ${isEditingAddress ? `<input id="edit-name" value="${address._ho_ten_nguoi_nhan}" />` : `<span class="info-value">${address._ho_ten_nguoi_nhan}</span>`}
        </div>
        <div class="info-row"><span class="info-label">SĐT:</span>
            ${isEditingAddress ? `<input id="edit-phone" value="${address._so_dien_thoai}" />` : `<span class="info-value">${address._so_dien_thoai}</span>`}
        </div>
        <div class="info-row"><span class="info-label">Địa chỉ:</span>
            ${isEditingAddress ? `
                <input id="edit-detail" value="${address._dia_chi_chi_tiet}" placeholder="Chi tiết" />
                <input id="edit-ward" value="${address._phuong_xa}" placeholder="Phường/Xã" />
                <input id="edit-city" value="${address._tinh_thanh}" placeholder="Tỉnh/Thành" />
            ` : `<span class="info-value">${address._dia_chi_chi_tiet}, ${address._phuong_xa}, ${address._tinh_thanh}</span>`}
        </div>
        <div class="info-row"><span class="info-label">Ghi chú:</span>
            ${isEditingAddress ? `<input id="edit-note" value="${address._ghi_chu}" />` : `<span class="info-value">${address._ghi_chu || '(Không có)'}</span>`}
        </div>
        ${isEditingAddress ? `
            <button class="btn btn-success" onclick="saveAddress('${address._id}')">💾 Lưu</button>
            <button class="btn btn-secondary" onclick="cancelEditAddress()">❌ Hủy</button>
        ` : `<button class="btn btn-outline" onclick="enableEditAddress()">✏️ Sửa</button>`}
        ` : '<p>Không có dữ liệu địa chỉ</p>'}
    `;

    (document.getElementById('order-modal') as HTMLElement).style.display = 'block';
}

function enableEditPayment(): void {
    isEditingPayment = true;
    viewPaymentInfo(currentPaymentInfo!._don_hang_id);
}

function cancelEditPayment(): void {
    isEditingPayment = false;
    viewPaymentInfo(currentPaymentInfo!._don_hang_id);
}

async function savePaymentStatus(paymentId: string): Promise<void> {
    const newStatus = (document.getElementById('edit-payment-status') as HTMLSelectElement).value;
    const success = await updatePaymentStatusApi(paymentId, newStatus);

    if (success) {
        currentPaymentInfo!._trang_thai = newStatus;
        isEditingPayment = false;
        viewPaymentInfo(currentPaymentInfo!._don_hang_id);
        alert('Cập nhật trạng thái thanh toán thành công!');
    } else {
        alert('Cập nhật thất bại!');
    }
}

function enableEditAddress(): void {
    isEditingAddress = true;
    viewPaymentInfo(currentAddressInfo!._don_hang_id);
}

function cancelEditAddress(): void {
    isEditingAddress = false;
    viewPaymentInfo(currentAddressInfo!._don_hang_id);
}

async function saveAddress(addressId: string): Promise<void> {
    const updatedData: Partial<AddressInfo> = {
        _ho_ten_nguoi_nhan: (document.getElementById('edit-name') as HTMLInputElement).value,
        _so_dien_thoai: (document.getElementById('edit-phone') as HTMLInputElement).value,
        _dia_chi_chi_tiet: (document.getElementById('edit-detail') as HTMLInputElement).value,
        _phuong_xa: (document.getElementById('edit-ward') as HTMLInputElement).value,
        _tinh_thanh: (document.getElementById('edit-city') as HTMLInputElement).value,
        _ghi_chu: (document.getElementById('edit-note') as HTMLInputElement).value,
    };

    const success = await updateAddressApi(addressId, updatedData);

    if (success) {
        Object.assign(currentAddressInfo!, updatedData);
        isEditingAddress = false;
        viewPaymentInfo(currentAddressInfo!._don_hang_id);
        alert('Cập nhật địa chỉ thành công!');
    } else {
        alert('Cập nhật địa chỉ thất bại!');
    }
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

function closeModal2(): void {
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
        if (e.target === document.getElementById('order-modal')) closeModal2();
        if (e.target === document.getElementById('status-modal')) closeStatusModal();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeModal2();
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