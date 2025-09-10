function getAuthHeaders60() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}
// --- Các hàm xử lý tương tác giỏ hàng ---

function selectAllItems() {
    const selectAllCheckbox = document.getElementById('selectAll') as HTMLInputElement;
    const itemCheckboxes = document.querySelectorAll<HTMLInputElement>('.item-check');
    itemCheckboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
    updateSelection();
}

function formatPriceCart(price: number): string {
    return price.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND'
    });
}

function updateSelection() {
    const itemCheckboxes = document.querySelectorAll<HTMLInputElement>('.item-check');
    const selectAllCheckbox = document.getElementById('selectAll') as HTMLInputElement;
    const checkedItems = document.querySelectorAll<HTMLInputElement>('.item-check:checked');
    selectAllCheckbox.checked = checkedItems.length === itemCheckboxes.length;
    selectAllCheckbox.indeterminate = checkedItems.length > 0 && checkedItems.length < itemCheckboxes.length;
    calculateTotal2();
}

function updateQuantity(button: HTMLElement, change: number) {
    const input = button.parentElement!.querySelector('.quantity-input') as HTMLInputElement;
    const maxQuantity = parseInt(input.getAttribute('max') || '999');
    let newValue = parseInt(input.value) + change;

    if (newValue < 1) newValue = 1;
    if (newValue > maxQuantity) newValue = maxQuantity;

    input.value = newValue.toString();
    calculateTotal2();
}

function removeItem(button: HTMLElement) {
    const item = button.closest('.cart-item');
    if (item) {
        const bienTheId = item.getAttribute('data-bien-the-id');
        const gioHangId = getCurrentCartId();
        const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?');
        if (!confirmDelete) return;
        if (bienTheId && gioHangId) {
            // Gọi API xóa sản phẩm
            removeItemFromCart(gioHangId, bienTheId);
        }

        item.remove();

        // Cập nhật số lượng item
        const totalItems = document.querySelectorAll('.cart-item').length;
        const itemCount = document.getElementById('itemCount');
        if (itemCount) itemCount.textContent = totalItems.toString();

        updateSelection();
        checkEmptyCart();
    }
}

async function removeItemFromCart(gioHangId: string, bienTheId: string) {
    try {
        const response = await fetch(`/api/gio-hang/${gioHangId}/bien-the/${bienTheId}`, {
            headers: getAuthHeaders60(),
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Không thể xóa sản phẩm');
        }

        console.log('Đã xóa sản phẩm khỏi giỏ hàng');
        alert('Đã xóa sản phẩm khỏi giỏ hàng');
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        alert('Có lỗi xảy ra khi xóa sản phẩm');
    }
}

async function checkout() {
    const checkedItems = document.querySelectorAll<HTMLInputElement>('.item-check:checked');
    if (checkedItems.length === 0) {
        alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán!');
        return;
    }

    try {
        // Disable checkout button để tránh click nhiều lần
        const checkoutBtn = document.getElementById('checkoutBtn') as HTMLButtonElement;
        if (checkoutBtn) {
            checkoutBtn.disabled = true;
            checkoutBtn.textContent = 'Đang xử lý...';
        }

        // Lưu thay đổi số lượng trước khi thanh toán
        await saveQuantityChanges();

        // Chuẩn bị dữ liệu thanh toán
        const checkoutData: Array<{
            bienTheId: string;
            soLuong: number;
            productName: string;
            variantInfo: string;
            price: number;
            image: string;
        }> = [];

        checkedItems.forEach(checkbox => {
            const item = checkbox.closest('.cart-item') as HTMLElement;
            if (!item) return;

            const bienTheId = item.getAttribute('data-bien-the-id');
            const productName = item.querySelector('.product-name')?.textContent || '';
            const variantInfo = item.querySelector('.variant-info')?.textContent || '';
            const price = parseInt(item.dataset.price || '0');
            const quantityInput = item.querySelector('.quantity-input') as HTMLInputElement;
            const soLuong = quantityInput ? parseInt(quantityInput.value) : 1;
            const image = item.querySelector('.cart-img')?.getAttribute('src') || '';

            if (bienTheId) {
                checkoutData.push({
                    bienTheId,
                    soLuong,
                    productName,
                    variantInfo,
                    price,
                    image
                });
            }
        });

        // Chuẩn bị URL parameters
        const bienTheIds: string[] = [];
        const soLuongs: string[] = [];

        checkoutData.forEach(item => {
            bienTheIds.push(item.bienTheId);
            soLuongs.push(item.soLuong.toString());
        });

        const urlParams = `bien_the_id=${bienTheIds.join(',')}&so_luong=${soLuongs.join(',')}`;

        // Lưu dữ liệu chi tiết vào localStorage để trang thanh toán có thể sử dụng
        localStorage.setItem('checkoutData', JSON.stringify(checkoutData));

        // Chuyển đến trang thanh toán sử dụng smooth router
        if ((window as any).smoothRouter) {
            (window as any).smoothRouter.navigateTo('ThanhToan.html', {
                bien_the_id: bienTheIds.join(','),
                so_luong: soLuongs.join(',')
            });
        } else {
            // Fallback: chuyển hướng trực tiếp với URL parameters
            window.location.href = `/HTML/ThanhToan.html?${urlParams}`;
        }

    } catch (error) {
        console.error('Lỗi khi xử lý thanh toán:', error);
        alert('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.');

        // Khôi phục trạng thái button
        const checkoutBtn = document.getElementById('checkoutBtn') as HTMLButtonElement;
        if (checkoutBtn) {
            checkoutBtn.disabled = false;
            checkoutBtn.textContent = `Thanh toán (${checkedItems.length})`;
        }
    }
}

// Hàm riêng để lưu thay đổi số lượng
async function saveQuantityChanges(): Promise<void> {
    if (!currentCartData) {
        throw new Error('Không có dữ liệu giỏ hàng');
    }

    const cartId = currentCartData._id;
    const items = Array.from(document.querySelectorAll('.cart-item'));

    // Cập nhật từng sản phẩm
    for (const item of items) {
        const bienTheId = item.getAttribute('data-bien-the-id');
        const quantityInput = item.querySelector('.quantity-input') as HTMLInputElement;

        if (!bienTheId || !quantityInput) continue;

        const soLuong = parseInt(quantityInput.value);

        // Tìm số lượng ban đầu từ dữ liệu giỏ hàng
        const originalItem = currentCartData._san_pham.find((sp: any) => sp.id_bien_the === bienTheId);
        const originalQuantity = originalItem ? parseInt(originalItem.so_luong) : 0;

        // Chỉ cập nhật nếu số lượng thay đổi
        if (soLuong !== originalQuantity) {
            const response = await fetch(`/api/gio-hang/${cartId}/bien-the/${bienTheId}`, {
                method: 'PUT',
                headers: getAuthHeaders60(),
                body: JSON.stringify({ so_luong: soLuong })
            });

            if (!response.ok) {
                throw new Error(`Lỗi khi cập nhật số lượng cho biến thể ${bienTheId}`);
            }
        }
    }

    // Cập nhật dữ liệu currentCartData sau khi lưu thành công
    items.forEach(item => {
        const bienTheId = item.getAttribute('data-bien-the-id');
        const quantityInput = item.querySelector('.quantity-input') as HTMLInputElement;

        if (bienTheId && quantityInput) {
            const soLuong = parseInt(quantityInput.value);
            const itemInData = currentCartData._san_pham.find((sp: any) => sp.id_bien_the === bienTheId);
            if (itemInData) {
                itemInData.so_luong = soLuong.toString();
            }
        }
    });
}

function checkEmptyCart() {
    const items = document.querySelectorAll('.cart-item');
    if (items.length === 0) {
        const cartContent = document.getElementById('cartContent');
        if (cartContent) {
            cartContent.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">🛒</div>
                    <h2>Giỏ hàng trống</h2>
                    <p>Chưa có sản phẩm nào trong giỏ hàng của bạn</p>
                </div>
            `;
        }
    }
}

// File: gioHang.ts
// Yêu cầu: Load giỏ hàng từ API và render ra HTML, thay thế dữ liệu mặc định

let currentCartData: any = null; // Lưu trữ dữ liệu giỏ hàng hiện tại

async function loadGioHang() {
    const userId = getCurrentUserId();
    if (!userId) return;

    const cartContent = document.getElementById('cartContent');
    if (!cartContent) return;

    // Gọi API lấy giỏ hàng
    try {
        const res = await fetch(`/api/gio-hang/${userId}`, {
            headers: getAuthHeaders60()
        });
        console.log('User ID:', userId);

        if (!res.ok) throw new Error('Không thể lấy dữ liệu giỏ hàng');

        const gioHang = await res.json();
        currentCartData = gioHang; // Lưu trữ dữ liệu giỏ hàng
        renderCart(gioHang);
    } catch (err) {
        console.error('Lỗi tải giỏ hàng:', err);
        cartContent.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h2>Lỗi tải giỏ hàng</h2>
                <p>${err}</p>
            </div>
        `;
    }
}

function renderCart(gioHang: any) {
    const cartContent = document.getElementById('cartContent');
    if (!cartContent) return;

    // Kiểm tra giỏ hàng rỗng
    if (!gioHang || !gioHang._san_pham || gioHang._san_pham.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h2>Giỏ hàng trống</h2>
                <p>Chưa có sản phẩm nào trong giỏ hàng của bạn</p>
            </div>
        `;
        return;
    }

    let html = `
        <div class="select-all">
            <input type="checkbox" id="selectAll" onchange="selectAllItems()">
            <label for="selectAll">Chọn tất cả (<span id="itemCount">${gioHang._san_pham.length}</span> sản phẩm)</label>
        </div>
    `;

    // Render từng item trong giỏ hàng
    for (const item of gioHang._san_pham) {
        // Lấy thông tin sản phẩm
        const productId: string = item.id_san_pham;
        const productName: string = item.ten_san_pham;
        const price: number = item.gia_ban;
        const soLuong: string = item.so_luong;
        const maxQuantity: number = item.so_luong_ton;
        const img: string = item.hinh_anh_bien_the || '';
        const productColor: string = item.mau_sac || '';
        const productSize: string = item.kich_co || '';
        const bienTheID: string = item.id_bien_the;

        // Tạo thông tin biến thể (màu sắc, kích cỡ)
        const variantInfo = `Màu: ${productColor} - Size: ${productSize}`;

        html += `
            <div class="cart-item" 
                 data-product-id="${productId}" 
                 data-bien-the-id="${bienTheID}" 
                 data-price="${price}">
                <div class="item-checkbox">
                    <input type="checkbox" class="item-check" onchange="updateSelection()">
                </div>
                <div class="product-image">
                    ${img ? `<img src="${img}" alt="${productName}" class="cart-img">` : '🛒'}
                </div>
                <div class="product-info">
                    <div class="product-name">${productName}</div>
                    <div class="variant-info" style="font-size: 12px; color: #666; margin: 4px 0;">${variantInfo}</div>
                    <div class="product-price">${formatPriceCart(price)}</div>
                </div>
                <div class="quantity-group">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(this, -1)">-</button>
                        <input type="number" 
                            class="quantity-input" 
                            value="${soLuong}" 
                            min="1" 
                            max="${maxQuantity}" 
                            onchange="calculateTotal2()">
                        <button class="quantity-btn" onclick="updateQuantity(this, 1)">+</button>
                    </div>
                    <div class="stock-info">Còn ${maxQuantity} sản phẩm</div>
                </div>

                <button class="remove-btn" onclick="removeItem(this)">Xóa</button>
            </div>
        `;
    }

    // Nút lưu thay đổi
    html += `<button id="saveButton" class="save-changes-btn">Lưu thay đổi</button>`;

    // Phần tổng kết đơn hàng
    html += `
        <div class="cart-summary">
            <div class="selected-items" id="selectedItems">Đã chọn 0 sản phẩm</div>
            <div class="summary-row">
                <span>Tạm tính:</span>
                <span id="subtotal">0 ₫</span>
            </div>
            <div class="summary-row">
                <span>Phí vận chuyển:</span>
                <span id="shipping">0 ₫</span>
            </div>
            <div class="summary-row total">
                <span>Tổng cộng:</span>
                <span id="total">0 ₫</span>
            </div>
            <button class="checkout-btn" id="checkoutBtn" onclick="checkout()" disabled>
                Thanh toán (<span id="selectedCount">0</span>)
            </button>
        </div>
    `;

    cartContent.innerHTML = html;

    // Xử lý nút "Lưu thay đổi"
    const saveAllBtn = document.getElementById('saveButton') as HTMLButtonElement | null;
    if (saveAllBtn) {
        saveAllBtn.onclick = async function () {
            try {
                saveAllBtn.disabled = true;
                saveAllBtn.textContent = 'Đang lưu...';

                const cartId = gioHang._id;
                const items = Array.from(document.querySelectorAll('.cart-item'));

                // Cập nhật từng sản phẩm
                for (const item of items) {
                    const bienTheId = item.getAttribute('data-bien-the-id');
                    const quantityInput = item.querySelector('.quantity-input') as HTMLInputElement;
                    const soLuong = quantityInput ? parseInt(quantityInput.value) : 1;

                    if (bienTheId) {
                        const response = await fetch(`/api/gio-hang/${cartId}/bien-the/${bienTheId}`, {
                            method: 'PUT',
                            headers: getAuthHeaders60(),
                            body: JSON.stringify({ so_luong: soLuong })
                        });

                        if (!response.ok) {
                            throw new Error(`Lỗi khi cập nhật biến thể ${bienTheId}`);
                        }
                    }
                }

                alert('✅ Đã lưu tất cả thay đổi!');
            } catch (error) {
                console.error('Lỗi khi lưu giỏ hàng:', error);
                alert('❌ Có lỗi xảy ra khi lưu giỏ hàng. Vui lòng thử lại.');
            } finally {
                // Khôi phục trạng thái button
                saveAllBtn.disabled = false;
                saveAllBtn.textContent = 'Lưu thay đổi';
            }
        };
    }

    calculateTotal2();
}

function calculateTotal2() {
    const checkedItems = document.querySelectorAll('.item-check:checked');
    let subtotal = 0;
    let selectedCount = 0;

    checkedItems.forEach(checkbox => {
        const item = checkbox.closest('.cart-item') as HTMLElement | null;
        if (!item) return;

        const price = parseInt(item.dataset.price || '0');
        const quantityInput = item.querySelector('.quantity-input') as HTMLInputElement | null;
        const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

        subtotal += price * quantity;
        selectedCount++;
    });

    const shipping = selectedCount > 0 ? 30000 : 0;
    const total = subtotal + shipping;

    // Cập nhật UI
    const subtotalEl = document.getElementById('subtotal');
    if (subtotalEl) subtotalEl.textContent = formatPriceCart(subtotal);

    const shippingEl = document.getElementById('shipping');
    if (shippingEl) shippingEl.textContent = formatPriceCart(shipping);

    const totalEl = document.getElementById('total');
    if (totalEl) totalEl.textContent = formatPriceCart(total);

    const selectedItemsEl = document.getElementById('selectedItems');
    if (selectedItemsEl) selectedItemsEl.textContent = `Đã chọn ${selectedCount} sản phẩm`;

    const selectedCountEl = document.getElementById('selectedCount');
    if (selectedCountEl) selectedCountEl.textContent = selectedCount.toString();

    const checkoutBtn = document.getElementById('checkoutBtn') as HTMLButtonElement | null;
    if (checkoutBtn) checkoutBtn.disabled = selectedCount === 0;
}

function getCurrentUserId(): string | null {
    try {
        const userContext = localStorage.getItem('usercontext');
        if (!userContext) return null;

        const user = JSON.parse(userContext);
        return user._id || null;
    } catch (error) {
        console.error('Lỗi khi lấy user ID:', error);
        return null;
    }
}

function getCurrentCartId(): string | null {
    return currentCartData ? currentCartData._id : null;
}

// Hàm khởi tạo giỏ hàng
async function initGioHang() {
    // Kiểm tra đăng nhập
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
        window.location.href = '/HTML/DangNhap.html';
        return;
    }

    try {
        const res = await fetch("/api/nguoi-dung/me", {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
            window.location.href = '/HTML/DangNhap.html';
            return;
        }
    } catch (error) {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
        window.location.href = '/HTML/DangNhap.html';
        return;
    }
    console.log('Initializing Gio Hang...');
    loadGioHang();
}

// Expose functions globally để router có thể gọi
(window as any).loadGioHang = loadGioHang;
(window as any).initGioHang = initGioHang;
(window as any).selectAllItems = selectAllItems;
(window as any).updateSelection = updateSelection;
(window as any).updateQuantity = updateQuantity;
(window as any).removeItem = removeItem;
(window as any).checkout = checkout;
(window as any).calculateTotal2 = calculateTotal2;

// Chạy khi DOMContentLoaded (cho lần đầu load trực tiếp)
document.addEventListener('DOMContentLoaded', initGioHang);

// QUAN TRỌNG: Chạy luôn nếu DOM đã ready (cho router)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGioHang);
} else {
    // DOM đã ready, chạy luôn
    initGioHang();
}