// thanhToan.ts - Fixed for duplicate submissions



// Types/Interfaces
interface User {
    _ho: string;
    _ten: string;
    _email: string;
    _so_dien_thoai: string;
    _dia_chi: string;
}

interface ProductVariant {
    _bien_the_id: string;
    _ten_san_pham: string;
    _so_luong: number;
    _don_gia: number;
    _mau_sac: string;
    _kich_co: string;
    _duong_dan_hinh_anh: string;
}

interface OrderData {
    items: ProductVariant[];
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
}

interface CustomerInfo {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    city: string;
    district: string;
    address: string;
    note: string;
}

interface OrderInfo {
    customer: CustomerInfo;
    paymentMethod: string;
    items: ProductVariant[];
    summary: {
        subtotal: number;
        shipping: number;
        discount: number;
        total: number;
    };
}

function getAuthHeaders10() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// Global variables
let orderData: OrderData = {
    items: [],
    subtotal: 0,
    shipping: 30000,
    discount: 0,
    total: 0
};

// 🔧 FIX: Biến để track initialization
let isInitialized = false;
let isProcessingOrder = false; // Prevent double submission

const districts: Record<string, string[]> = {
    'hanoi': ['Ba Đình', 'Hoàn Kiếm', 'Tây Hồ', 'Long Biên', 'Cầu Giấy', 'Đống Đa', 'Hai Bà Trưng', 'Hoàng Mai', 'Thanh Xuân'],
    'hcm': ['Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8', 'Quận 9', 'Quận 10'],
    'danang': ['Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn', 'Liên Chiểu', 'Cẩm Lệ'],
    'haiphong': ['Hồng Bàng', 'Ngô Quyền', 'Lê Chân', 'Hải An', 'Kiến An', 'Đồ Sơn'],
    'cantho': ['Ninh Kiều', 'Bình Thuỷ', 'Cái Răng', 'Ô Môn', 'Thốt Nốt']
};

const cityMap: Record<string, string> = {
    'TP.HCM': 'hcm',
    'Hà Nội': 'hanoi',
    'Đà Nẵng': 'danang',
    'Hải Phòng': 'haiphong',
    'Cần Thơ': 'cantho'
};

// API Functions (giữ nguyên)
function getUserId(): string | null {
    const userStr = localStorage.getItem('usercontext');
    if (!userStr) return null;
    try {
        const user = JSON.parse(userStr);
        return user._id;
    } catch (err) {
        console.error('Lỗi khi parse usercontext:', err);
        return null;
    }
}

async function createDonHang(nguoiDungId: string): Promise<string | null> {
    try {
        const response = await fetch('http://localhost:3000/api/don-hang/tao', {
            method: 'POST',
            headers: getAuthHeaders10(),
            body: JSON.stringify({
                nguoi_dung_id: nguoiDungId
            })
        });

        const result = await response.json();

        if (result.success) {
            return result.id;
        } else {
            console.error('Lỗi tạo đơn hàng:', result.message);
            return null;
        }
    } catch (err) {
        console.error('Lỗi khi gọi API tạo đơn hàng:', err);
        return null;
    }
}

async function addChiTietDonHang(donHangId: string, bienTheId: string, soLuong: number): Promise<boolean> {
    try {
        const response = await fetch('http://localhost:3000/api/don-hang/chi-tiet/them', {
            method: 'POST',
            headers: getAuthHeaders10(),
            body: JSON.stringify({
                don_hang_id: donHangId,
                bien_the_id: bienTheId,
                so_luong: soLuong
            })
        });

        const result = await response.json();
        return result.success;
    } catch (err) {
        console.error('Lỗi khi thêm chi tiết đơn hàng:', err);
        return false;
    }
}

async function createGiaoDichThanhToan(donHangId: string, phuongThucThanhToan: string, ghiChu: string = ''): Promise<boolean> {
    try {
        const response = await fetch('http://localhost:3000/api/giao-dich/', {
            method: 'POST',
            headers: getAuthHeaders10(),
            body: JSON.stringify({
                don_hang_id: donHangId,
                phuong_thuc_thanh_toan: phuongThucThanhToan,
                ghi_chu: ghiChu
            })
        });

        if (response.status === 201) {
            return true;
        } else {
            console.error('Lỗi tạo giao dịch thanh toán:', response.status);
            return false;
        }
    } catch (err) {
        console.error('Lỗi khi gọi API tạo giao dịch thanh toán:', err);
        return false;
    }
}

async function createDiaChiGiaoHang(
    donHangId: string,
    hoTenNguoiNhan: string,
    soDienThoai: string,
    diaChiChiTiet: string,
    phuongXa: string,
    tinhThanh: string,
    ghiChu: string = ''
): Promise<boolean> {
    try {
        const response = await fetch('http://localhost:3000/api/dia-chi/', {
            method: 'POST',
            headers: getAuthHeaders10(),
            body: JSON.stringify({
                don_hang_id: donHangId,
                ho_ten_nguoi_nhan: hoTenNguoiNhan,
                so_dien_thoai: soDienThoai,
                dia_chi_chi_tiet: diaChiChiTiet,
                phuong_xa: phuongXa,
                tinh_thanh: tinhThanh,
                ghi_chu: ghiChu
            })
        });

        if (response.status === 201) {
            return true;
        } else {
            console.error('Lỗi tạo địa chỉ giao hàng:', response.status);
            return false;
        }
    } catch (err) {
        console.error('Lỗi khi gọi API tạo địa chỉ giao hàng:', err);
        return false;
    }
}

async function deleteDonHang(donHangId: string): Promise<boolean> {
    try {
        const response = await fetch(`http://localhost:3000/api/don-hang/${donHangId}`, {
            method: 'DELETE',
            headers: getAuthHeaders10()
        });
        return response.ok;
    } catch (err) {
        console.error('Lỗi khi xóa đơn hàng:', err);
        return false;
    }
}

async function getBienTheById(bienTheId: string): Promise<any | null> {
    try {
        const response = await fetch(`http://localhost:3000/api/bien-the/${bienTheId}`, {
            method: 'GET',
            headers: getAuthHeaders10()
        });

        if (!response.ok) {
            console.error(`Lỗi khi lấy thông tin biến thể ${bienTheId}:`, response.status);
            return null;
        }

        const result = await response.json();

        if (result.success) {
            return result.data;
        } else {
            console.error('Lỗi từ API:', result.message);
            return null;
        }
    } catch (err) {
        console.error('Lỗi khi gọi API lấy biến thể:', err);
        return null;
    }
}

async function updateBienTheSoLuong(bienTheId: string, soLuongMoi: number): Promise<boolean> {
    try {
        const response = await fetch(`http://localhost:3000/api/bien-the/${bienTheId}`, {
            method: 'PUT',
            headers: getAuthHeaders10(),
            body: JSON.stringify({
                so_luong_ton_kho: soLuongMoi
            })
        });

        if (response.ok) {
            const result = await response.json();
            return result.success;
        } else {
            console.error(`Lỗi khi cập nhật số lượng biến thể ${bienTheId}:`, response.status);
            return false;
        }
    } catch (err) {
        console.error('Lỗi khi gọi API cập nhật số lượng:', err);
        return false;
    }
}

async function updateInventoryAfterOrder(orderItems: ProductVariant[]): Promise<boolean> {
    const updateResults: { bienTheId: string; success: boolean; oldQuantity?: number; newQuantity?: number }[] = [];

    try {
        console.log('🔄 Bắt đầu cập nhật số lượng tồn kho...');

        for (const item of orderItems) {
            console.log(`Đang xử lý biến thể: ${item._bien_the_id}, số lượng đặt: ${item._so_luong}`);

            const bienTheInfo = await getBienTheById(item._bien_the_id);

            if (!bienTheInfo) {
                console.error(`❌ Không thể lấy thông tin biến thể ${item._bien_the_id}`);
                updateResults.push({
                    bienTheId: item._bien_the_id,
                    success: false
                });
                continue;
            }

            const soLuongHienTai = bienTheInfo.so_luong_ton_kho;
            const soLuongDat = item._so_luong;
            const soLuongMoi = soLuongHienTai - soLuongDat;

            console.log(`Biến thể ${item._bien_the_id}: ${soLuongHienTai} - ${soLuongDat} = ${soLuongMoi}`);

            if (soLuongMoi < 0) {
                console.error(`❌ Số lượng tồn kho không đủ cho biến thể ${item._bien_the_id}`);
                updateResults.push({
                    bienTheId: item._bien_the_id,
                    success: false,
                    oldQuantity: soLuongHienTai,
                    newQuantity: soLuongMoi
                });
                continue;
            }

            const updateSuccess = await updateBienTheSoLuong(item._bien_the_id, soLuongMoi);

            updateResults.push({
                bienTheId: item._bien_the_id,
                success: updateSuccess,
                oldQuantity: soLuongHienTai,
                newQuantity: soLuongMoi
            });

            if (updateSuccess) {
                console.log(`✓ Cập nhật thành công biến thể ${item._bien_the_id}: ${soLuongHienTai} → ${soLuongMoi}`);
            } else {
                console.error(`❌ Cập nhật thất bại biến thể ${item._bien_the_id}`);
            }
        }

        const failedUpdates = updateResults.filter(result => !result.success);

        if (failedUpdates.length > 0) {
            console.error('❌ Một số biến thể cập nhật thất bại:', failedUpdates);

            failedUpdates.forEach(failed => {
                console.error(`- Biến thể ${failed.bienTheId}: ${failed.oldQuantity !== undefined ? `${failed.oldQuantity} → ${failed.newQuantity}` : 'Không thể lấy thông tin'}`);
            });

            return false;
        }

        console.log('✅ Cập nhật số lượng tồn kho hoàn tất thành công!');
        return true;

    } catch (error) {
        console.error('❌ Lỗi khi cập nhật số lượng tồn kho:', error);
        return false;
    }
}

async function rollbackInventory(orderItems: ProductVariant[]): Promise<void> {
    console.log('🔄 Đang thực hiện rollback số lượng tồn kho...');

    for (const item of orderItems) {
        try {
            const bienTheInfo = await getBienTheById(item._bien_the_id);

            if (bienTheInfo) {
                const soLuongHienTai = bienTheInfo.so_luong_ton_kho;
                const soLuongKhoiPhuc = soLuongHienTai + item._so_luong;

                const rollbackSuccess = await updateBienTheSoLuong(item._bien_the_id, soLuongKhoiPhuc);

                if (rollbackSuccess) {
                    console.log(`✓ Rollback thành công biến thể ${item._bien_the_id}: ${soLuongHienTai} → ${soLuongKhoiPhuc}`);
                } else {
                    console.error(`❌ Rollback thất bại biến thể ${item._bien_the_id}`);
                }
            }
        } catch (error) {
            console.error(`❌ Lỗi khi rollback biến thể ${item._bien_the_id}:`, error);
        }
    }
}

async function processOrderWithInventory(orderInfo: OrderInfo): Promise<boolean> {
    // 🔧 FIX: Prevent double processing
    if (isProcessingOrder) {
        console.warn('⚠️ Order is already being processed, skipping...');
        return false;
    }

    isProcessingOrder = true;

    let donHangId: string | null = null;
    let createdSteps: string[] = [];
    let inventoryUpdated = false;

    try {
        const userId = getUserId();
        if (!userId) {
            alert('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
            return false;
        }

        console.log('🔍 Kiểm tra số lượng tồn kho...');
        const inventoryCheckSuccess = await updateInventoryAfterOrder(orderInfo.items);

        if (!inventoryCheckSuccess) {
            alert('Không đủ số lượng tồn kho hoặc có lỗi khi cập nhật. Vui lòng thử lại.');
            return false;
        }

        inventoryUpdated = true;
        console.log('✅ Cập nhật tồn kho thành công');

        donHangId = await createDonHang(userId);
        if (!donHangId) {
            throw new Error('Không thể tạo đơn hàng');
        }
        createdSteps.push('don_hang');
        console.log('✓ Tạo đơn hàng thành công:', donHangId);

        let addedItemsCount = 0;
        for (const item of orderInfo.items) {
            const success = await addChiTietDonHang(donHangId, item._bien_the_id, item._so_luong);
            if (!success) {
                throw new Error(`Không thể thêm sản phẩm ${item._ten_san_pham} vào đơn hàng`);
            }
            addedItemsCount++;
            console.log(`✓ Thêm sản phẩm ${addedItemsCount}/${orderInfo.items.length} thành công`);
        }
        createdSteps.push('chi_tiet');

        const paymentSuccess = await createGiaoDichThanhToan(
            donHangId,
            orderInfo.paymentMethod,
            'Giao dịch thanh toán cho đơn hàng'
        );
        if (!paymentSuccess) {
            throw new Error('Không thể tạo thông tin thanh toán');
        }
        createdSteps.push('thanh_toan');
        console.log('✓ Tạo giao dịch thanh toán thành công');

        const hoTenDayDu = `${orderInfo.customer.firstName} ${orderInfo.customer.lastName}`;
        const citySelect = getSelectElement('city');
        const districtSelect = getSelectElement('district');
        const tinhThanhText = citySelect?.options[citySelect.selectedIndex]?.text || orderInfo.customer.city;
        const phuongXaText = districtSelect?.options[districtSelect.selectedIndex]?.text || orderInfo.customer.district;

        const addressSuccess = await createDiaChiGiaoHang(
            donHangId,
            hoTenDayDu,
            orderInfo.customer.phone,
            orderInfo.customer.address,
            phuongXaText,
            tinhThanhText,
            orderInfo.customer.note
        );

        if (!addressSuccess) {
            throw new Error('Không thể lưu địa chỉ giao hàng');
        }
        createdSteps.push('dia_chi');
        console.log('✓ Tạo địa chỉ giao hàng thành công');

        console.log('✅ Đặt hàng hoàn tất thành công!');
        return true;

    } catch (err) {
        console.error('❌ Lỗi trong quá trình xử lý đơn hàng:', err);

        if (inventoryUpdated) {
            console.log('🔄 Đang rollback số lượng tồn kho...');
            await rollbackInventory(orderInfo.items);
        }

        if (donHangId && createdSteps.includes('don_hang')) {
            console.log('🔄 Đang xóa đơn hàng...');
            const deleteSuccess = await deleteDonHang(donHangId);
            if (deleteSuccess) {
                console.log('✓ Rollback đơn hàng thành công');
            } else {
                console.error('❌ Rollback đơn hàng thất bại - cần xóa thủ công:', donHangId);
            }
        }

        if (err instanceof Error) {
            alert(`Đặt hàng thất bại: ${err.message}\nVui lòng thử lại.`);
        } else {
            alert('Có lỗi xảy ra trong quá trình đặt hàng. Vui lòng thử lại.');
        }

        return false;
    } finally {
        // 🔧 FIX: Reset processing flag
        isProcessingOrder = false;
    }
}

// Utility functions
function formatCurrency2(amount: number): string {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}

function getElement(id: string): HTMLElement | null {
    return document.getElementById(id);
}

function getInputElement(id: string): HTMLInputElement | null {
    return document.getElementById(id) as HTMLInputElement | null;
}

function getSelectElement(id: string): HTMLSelectElement | null {
    return document.getElementById(id) as HTMLSelectElement | null;
}

function getTextAreaElement(id: string): HTMLTextAreaElement | null {
    return document.getElementById(id) as HTMLTextAreaElement | null;
}

// Load user information from localStorage
function loadUserInfo(): void {
    const userStr = localStorage.getItem('usercontext');
    if (!userStr) return;

    try {
        const user: User = JSON.parse(userStr);

        const fields: Record<string, string | undefined> = {
            firstName: user._ho,
            lastName: user._ten,
            email: user._email,
            phone: user._so_dien_thoai,
            address: user._dia_chi
        };

        Object.entries(fields).forEach(([fieldId, value]) => {
            const input = getInputElement(fieldId);
            if (input && value) {
                input.value = value;
            }
        });

        if (user._dia_chi) {
            handleAddressParsing(user._dia_chi);
        }
    } catch (err) {
        console.error('Lỗi khi parse usercontext:', err);
    }
}

function handleAddressParsing(address: string): void {
    const parts = address.split(',');
    if (parts.length < 3) return;

    const citySelect = getSelectElement('city');
    const districtSelect = getSelectElement('district');

    if (!citySelect || !districtSelect) return;

    const districtPart = parts[parts.length - 2].trim();
    const cityPart = parts[parts.length - 1].trim();

    const mappedCity = cityMap[cityPart];
    if (mappedCity) {
        citySelect.value = mappedCity;
        citySelect.dispatchEvent(new Event('change'));

        setTimeout(() => {
            const options = Array.from(districtSelect.options);
            const matchedOption = options.find(opt =>
                opt.textContent?.trim() === districtPart ||
                opt.value === districtPart.toLowerCase().replace(/\s+/g, '')
            );
            if (matchedOption) {
                districtSelect.value = matchedOption.value;
            }
        }, 100);
    }
}

// Load product information from URL params
async function loadProductInfo(): Promise<void> {
    // Thử lấy từ URL trước
    let urlParams = new URLSearchParams(window.location.search);
    let bienTheIdsParam = urlParams.get('bien_the_id');
    let soLuongParam = urlParams.get('so_luong');

    // Nếu không có trong URL, thử lấy từ history state (cho router)
    if (!bienTheIdsParam || !soLuongParam) {
        const state = history.state;
        if (state && state.params) {
            bienTheIdsParam = state.params.bien_the_id;
            soLuongParam = state.params.so_luong;
        }
    }

    // Debug log để kiểm tra
    console.log('🔍 Checking params:', {
        fromURL: {
            bien_the_id: new URLSearchParams(window.location.search).get('bien_the_id'),
            so_luong: new URLSearchParams(window.location.search).get('so_luong')
        },
        fromState: history.state?.params,
        final: {
            bien_the_id: bienTheIdsParam,
            so_luong: soLuongParam
        }
    });

    if (!bienTheIdsParam || !soLuongParam) {
        console.error('❌ Không tìm thấy params:', {
            bien_the_id: bienTheIdsParam,
            so_luong: soLuongParam,
            currentURL: window.location.href,
            historyState: history.state
        });
        showError('Không tìm thấy thông tin sản phẩm');
        return;
    }

    // Đảm bảo params là string trước khi split
    const bienTheIdsStr = String(bienTheIdsParam || '');
    const soLuongStr = String(soLuongParam || '');

    const bienTheIds = bienTheIdsStr.split(',')
        .map(id => id.trim())
        .filter(id => id !== '');

    const soLuongList = soLuongStr.split(',')
        .map(sl => parseInt(sl.trim()))
        .filter(sl => !isNaN(sl));

    if (bienTheIds.length !== soLuongList.length) {
        showError('Thông tin sản phẩm không hợp lệ');
        return;
    }

    try {
        console.log('🚀 Loading products with params:', {
            bienTheIds: bienTheIds,
            soLuongList: soLuongList
        });

        const promises = bienTheIds.map((id, index) => {
            const url = `http://localhost:3000/api/thanh-toan/${id}/${soLuongList[index]}`;
            console.log(`📡 Fetching: ${url}`);
            return fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
        });

        const results: ProductVariant[] = await Promise.all(promises);
        console.log('✅ Products loaded successfully:', results);

        orderData.items = results;
        renderOrderItems();
        calculateTotal();

        const checkoutBtn = document.querySelector('.checkout-btn') as HTMLButtonElement;
        if (checkoutBtn) {
            checkoutBtn.disabled = false;
        }

    } catch (error) {
        console.error('Error loading product info:', error);
        showError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
    }
}

// Show error message
function showError(message: string): void {
    const orderItemsContainer = getElement('orderItems');
    if (orderItemsContainer) {
        orderItemsContainer.innerHTML = `
            <div class="error-message">
                ${message}
            </div>
        `;
    }
}

// Render order items
function renderOrderItems(): void {
    const container = getElement('orderItems');
    if (!container) return;

    if (orderData.items.length === 0) {
        container.innerHTML = '<div class="error-message">Không có sản phẩm nào</div>';
        return;
    }

    container.innerHTML = orderData.items.map(item => `
        <div class="order-item">
            <div class="item-image">
                ${item._duong_dan_hinh_anh ?
            `<img src="${item._duong_dan_hinh_anh}" alt="${item._ten_san_pham}" onerror="this.style.display='none'; this.parentNode.innerHTML='Hình ảnh'">` :
            'Hình ảnh'
        }
            </div>
            <div class="item-details">
                <div class="item-name">${item._ten_san_pham}</div>
                <div class="item-variant">Màu: ${item._mau_sac} | Size: ${item._kich_co}</div>
                <div class="item-price">${formatCurrency2(item._don_gia)} x ${item._so_luong}</div>
            </div>
        </div>
    `).join('');
}

// Calculate total amount
function calculateTotal(): void {
    orderData.subtotal = orderData.items.reduce((sum, item) =>
        sum + (item._don_gia * item._so_luong), 0);

    orderData.total = orderData.subtotal + orderData.shipping - orderData.discount;

    updatePriceElement('subtotal', orderData.subtotal);
    updatePriceElement('shipping', orderData.shipping);
    updateDiscountElement();
    updatePriceElement('total', orderData.total);

    const orderTotal = getElement('orderTotal');
    if (orderTotal) {
        orderTotal.style.display = 'block';
    }
}

function updatePriceElement(id: string, amount: number): void {
    const element = getElement(id);
    if (element) {
        element.textContent = formatCurrency2(amount);
    }
}

function updateDiscountElement(): void {
    const discountElement = getElement('discount');
    if (discountElement) {
        discountElement.textContent = orderData.discount > 0 ?
            `-${formatCurrency2(orderData.discount)}` : '0đ';
    }
}

// Handle payment method selection
function handlePaymentMethodSelection(): void {
    // 🔧 FIX: Remove existing listeners first
    document.querySelectorAll('.payment-option').forEach(option => {
        const clonedOption = option.cloneNode(true) as Element;
        option.parentNode?.replaceChild(clonedOption, option);
    });

    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', function (this: Element) {
            document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            const radioInput = this.querySelector('input[type="radio"]') as HTMLInputElement;
            if (radioInput) {
                radioInput.checked = true;
            }
        });
    });
}

// Handle city/district selection
function handleLocationSelection(): void {
    const citySelect = getSelectElement('city');
    if (!citySelect) return;

    // 🔧 FIX: Remove existing listeners first
    const clonedCitySelect = citySelect.cloneNode(true) as HTMLSelectElement;
    citySelect.parentNode?.replaceChild(clonedCitySelect, citySelect);

    const newCitySelect = getSelectElement('city');
    if (!newCitySelect) return;

    newCitySelect.addEventListener('change', function (this: HTMLSelectElement) {
        const cityValue = this.value;
        const districtSelect = getSelectElement('district');
        if (!districtSelect) return;

        districtSelect.innerHTML = '<option value="">Chọn phường/xã</option>';

        if (districts[cityValue]) {
            districts[cityValue].forEach(district => {
                const option = document.createElement('option');
                option.value = district.toLowerCase().replace(/\s+/g, '');
                option.textContent = district;
                districtSelect.appendChild(option);
            });
        }
    });
}

// Validate form fields
function validateForm(form: HTMLFormElement): boolean {
    const requiredFields = form.querySelectorAll('[required]') as NodeListOf<HTMLInputElement | HTMLSelectElement>;
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#e74c3c';
            isValid = false;
        } else {
            field.style.borderColor = '#e0e0e0';
        }
    });

    return isValid;
}

// Prepare order information
function prepareOrderInfo(): OrderInfo {
    const getFieldValue = (id: string): string => {
        const element = getInputElement(id) || getSelectElement(id) || getTextAreaElement(id);
        return element?.value || '';
    };

    const paymentMethodElement = document.querySelector('input[name="paymentMethod"]:checked') as HTMLInputElement;

    return {
        customer: {
            firstName: getFieldValue('firstName'),
            lastName: getFieldValue('lastName'),
            phone: getFieldValue('phone'),
            email: getFieldValue('email'),
            city: getFieldValue('city'),
            district: getFieldValue('district'),
            address: getFieldValue('address'),
            note: getFieldValue('note')
        },
        paymentMethod: paymentMethodElement?.value || 'cod',
        items: orderData.items,
        summary: {
            subtotal: orderData.subtotal,
            shipping: orderData.shipping,
            discount: orderData.discount,
            total: orderData.total
        }
    };
}

// 🔧 FIX: Store form submit handler reference
let formSubmitHandler: ((e: Event) => void) | null = null;

// Handle form submission
function handleFormSubmission(): void {
    const form = getElement('checkoutForm') as HTMLFormElement;
    if (!form) return;

    // 🔧 FIX: Remove existing listener first
    if (formSubmitHandler) {
        form.removeEventListener('submit', formSubmitHandler);
        formSubmitHandler = null;
    }

    // Create new handler
    formSubmitHandler = async function (e: Event) {
        e.preventDefault();

        // 🔧 FIX: Additional check to prevent double submission
        if (isProcessingOrder) {
            console.warn('⚠️ Form submission blocked - order already processing');
            return;
        }

        const form = e.target as HTMLFormElement;
        const isValid = validateForm(form);

        if (isValid && orderData.items.length > 0) {
            const btn = document.querySelector('.checkout-btn') as HTMLButtonElement;
            if (!btn) return;

            const originalText = btn.textContent || '';
            btn.textContent = 'Đang xử lý...';
            btn.disabled = true;

            try {
                const orderInfo = prepareOrderInfo();
                console.log('Order Info:', orderInfo);

                const success = await processOrderWithInventory(orderInfo);

                if (success) {
                    alert('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
                    // Có thể chuyển hướng đến trang cảm ơn
                    // window.location.href = '/thank-you';
                } else {
                    // Lỗi đã được xử lý trong processOrderWithInventory
                }
            } catch (error) {
                console.error('Lỗi khi xử lý đơn hàng:', error);
                alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
            } finally {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        } else {
            if (orderData.items.length === 0) {
                alert('Không có sản phẩm nào để đặt hàng!');
            } else {
                alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
            }
        }
    };

    // Add new listener
    form.addEventListener('submit', formSubmitHandler);
}

// Handle mobile smooth scrolling
function handleMobileScrolling(): void {
    if (window.innerWidth <= 768) {
        document.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('focus', function (this: Element) {
                setTimeout(() => {
                    this.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }, 300);
            });
        });
    }
}

// 🔧 FIX: Cleanup function to remove all event listeners
function cleanupEventListeners(): void {
    console.log('🧹 Cleaning up event listeners...');

    // Remove form submit listener
    const form = getElement('checkoutForm') as HTMLFormElement;
    if (form && formSubmitHandler) {
        form.removeEventListener('submit', formSubmitHandler);
        formSubmitHandler = null;
    }

    // Reset processing flag
    isProcessingOrder = false;
}

// MAIN INITIALIZATION FUNCTIONS

// Hàm khởi tạo trang thanh toán
async function initThanhToan() {

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
    console.log('🚀 Initializing Thanh Toan...');

    // 🔧 FIX: Prevent double initialization
    if (isInitialized) {
        console.log('⚠️ Already initialized, cleaning up first...');
        cleanupEventListeners();
    }

    // Reset orderData khi khởi tạo lại
    orderData = {
        items: [],
        subtotal: 0,
        shipping: 30000,
        discount: 0,
        total: 0
    };

    // Khởi tạo các chức năng
    handleLocationSelection();
    loadUserInfo();
    loadProductInfo();
    handlePaymentMethodSelection();
    handleFormSubmission();
    handleMobileScrolling();

    // 🔧 FIX: Mark as initialized
    isInitialized = true;
    console.log('✅ Thanh Toan initialized successfully');
}

// Expose functions globally để router có thể gọi
(window as any).initThanhToan = initThanhToan;
(window as any).loadProductInfo = loadProductInfo;
(window as any).loadUserInfo = loadUserInfo;
(window as any).cleanupThanhToan = cleanupEventListeners; // For manual cleanup

// 🔧 FIX: Improved initialization logic
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThanhToan);
} else {
    // DOM đã ready, chạy sau một chút để đảm bảo elements đã render
    setTimeout(initThanhToan, 100);
}