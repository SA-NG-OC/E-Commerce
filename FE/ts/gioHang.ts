
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
    calculateTotal();
}

function updateQuantity(button: HTMLElement, change: number) {
    const input = button.parentElement!.querySelector('.quantity-input') as HTMLInputElement;
    let newValue = parseInt(input.value) + change;
    if (newValue < 1) newValue = 1;
    input.value = newValue.toString();
    calculateTotal();
}

function removeItem(button: HTMLElement) {
    const item = button.closest('.cart-item');
    if (item) item.remove();
    // Cập nhật số lượng item
    const totalItems = document.querySelectorAll('.cart-item').length;
    const itemCount = document.getElementById('itemCount');
    if (itemCount) itemCount.textContent = totalItems.toString();
    updateSelection();
    checkEmptyCart();
}

function checkout() {
    const checkedItems = document.querySelectorAll<HTMLInputElement>('.item-check:checked');
    if (checkedItems.length === 0) {
        alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán!');
        return;
    }
    let selectedProducts: string[] = [];
    checkedItems.forEach(checkbox => {
        const item = checkbox.closest('.cart-item');
        const productName = item?.querySelector('.product-name')?.textContent;
        const quantity = (item?.querySelector('.quantity-input') as HTMLInputElement)?.value;
        selectedProducts.push(`${productName} (x${quantity})`);
    });
    alert('Sản phẩm được chọn:\n' + selectedProducts.join('\n') + '\n\nChuyển đến trang thanh toán...');
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

document.addEventListener('DOMContentLoaded', async () => {
    const userId = getCurrentUserId();
    if (!userId) return;
    const cartContent = document.getElementById('cartContent');
    if (!cartContent) return;

    // Gọi API lấy giỏ hàng
    try {
        const res = await fetch(`http://localhost:3000/api/gio-hang/${userId}`);
        console.log(userId);
        if (!res.ok) throw new Error('Không thể lấy dữ liệu giỏ hàng');
        const gioHang = await res.json();
        renderCart(gioHang);
    } catch (err) {
        cartContent.innerHTML = `<div class="empty-cart"><div class="empty-cart-icon">🛒</div><h2>Lỗi tải giỏ hàng</h2><p>${err}</p></div>`;
    }
});

function renderCart(gioHang: any) {
    const cartContent = document.getElementById('cartContent');
    if (!cartContent) return;
    if (!gioHang || !gioHang._san_pham || gioHang._san_pham.length === 0) {
        cartContent.innerHTML = `<div class="empty-cart"><div class="empty-cart-icon">🛒</div><h2>Giỏ hàng trống</h2><p>Chưa có sản phẩm nào trong giỏ hàng của bạn</p></div>`;
        return;
    }
    let html = `
        <div class="select-all">
            <input type="checkbox" id="selectAll" onchange="selectAllItems()">
            <label for="selectAll">Chọn tất cả (<span id="itemCount">${gioHang._san_pham.length}</span> sản phẩm)</label>
        </div>
    `;
    for (const item of gioHang._san_pham) {
        const sp = item.san_pham;
        const so_luong = item.so_luong;
        const price = sp._gia_ban;
        const img = (sp._danh_sach_hinh_anh && sp._danh_sach_hinh_anh.length > 0) ? sp._danh_sach_hinh_anh[0]._duong_dan_hinh_anh : '';
        const so_luong_max: number = sp._so_luong_ton_kho;
        html += `
        <div class="cart-item" data-product-id="${sp._id}" data-price="${price}">
            <div class="item-checkbox">
                <input type="checkbox" class="item-check" onchange="updateSelection()">
            </div>
            <div class="product-image">${img ? `<img src="${img}" alt="${sp._ten_san_pham}" class="cart-img">` : '🛒'}</div>
            <div class="product-info">
                <div class="product-name">${sp._ten_san_pham}</div>
                <div class="product-price">${formatPriceCart(price)} </div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(this, -1)">-</button>
                <input type="number" class="quantity-input" value="${so_luong}" min="1"  max="${so_luong_max}" onchange="calculateTotal()">
                <button class="quantity-btn" onclick="updateQuantity(this, 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeItem(this)">Xóa</button>
        </div>
        `;
    }
    html += `<button id="saveButton">Lưu thay đổi</button>`;
    html += `
        <div class="cart-summary">
            <div class="selected-items" id="selectedItems">Đã chọn 0 sản phẩm</div>
            <div class="summary-row"><span>Tạm tính:</span><span id="subtotal">0 ₫</span></div>
            <div class="summary-row"><span>Phí vận chuyển:</span><span id="shipping">0 ₫</span></div>
            <div class="summary-row total"><span>Tổng cộng:</span><span id="total">0 ₫</span></div>
            <button class="checkout-btn" id="checkoutBtn" onclick="checkout()" disabled>Thanh toán (<span id="selectedCount">0</span>)</button>
        </div>
    `;
    cartContent.innerHTML = html;
    //Nút Lưu thay đổi
    const saveAllBtn = document.getElementById('saveButton') as HTMLButtonElement | null;

    if (saveAllBtn) {
        saveAllBtn.onclick = async function () {
            try {
                saveAllBtn.disabled = true;
                saveAllBtn.textContent = 'Đang lưu...';

                const cartId = gioHang._id;
                const items = Array.from(document.querySelectorAll('.cart-item'));

                for (const item of items) {
                    const productId = item.getAttribute('data-product-id');
                    const quantityInput = item.querySelector('.quantity-input') as HTMLInputElement;
                    const so_luong = quantityInput ? parseInt(quantityInput.value) : 1;

                    const response = await fetch(`http://localhost:3000/api/gio-hang/${cartId}/san-pham/${productId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ so_luong })
                    });

                    if (!response.ok) {
                        throw new Error(`Lỗi khi cập nhật sản phẩm ${productId}`);
                    }
                }

                alert('✅ Đã lưu tất cả thay đổi!');
            } catch (error) {
                console.error('Lỗi khi lưu giỏ hàng:', error);
                alert('❌ Có lỗi xảy ra khi lưu giỏ hàng. Vui lòng thử lại.');
            }
            finally {
                // Khôi phục trạng thái button
                saveAllBtn.disabled = false;
                saveAllBtn.textContent = `Lưu thay đổi`;
            }
        };
    }

    calculateTotal();
}

function calculateTotal() {
    const checkedItems = document.querySelectorAll('.item-check:checked');
    let subtotal = 0;
    let selectedCount = 0;

    checkedItems.forEach(checkbox => {
        const item = checkbox.closest('.cart-item') as HTMLElement | null;
        if (!item) return;
        const price = parseInt((item.dataset.price || '0'));
        const quantityInput = item.querySelector('.quantity-input') as HTMLInputElement | null;
        const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
        subtotal += price * quantity;
        selectedCount++;
    });

    const shipping = selectedCount > 0 ? 30000 : 0;
    const total = subtotal + shipping;

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
    let userContext = localStorage.getItem('usercontext');
    const user = JSON.parse(userContext || '{}');
    const user_id: string = user._id;
    return user_id || null;
}

fetch('/FE/HTML/NavBar.html')
    .then(res => res.text())
    .then(html => {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            navbar.innerHTML = html;
        }
    });