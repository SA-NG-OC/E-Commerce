interface HinhAnhSPModel {
    id: string;
    san_pham_id: string;
    duong_dan_hinh_anh: string;
}

interface DanhGiaSPModel {
    id: string;
    san_pham_id: string;
    nguoi_dung_id: string;
    diem_danh_gia: number;
    noi_dung_danh_gia: string;
    ngay_tao: string;
    ho_ten_nguoi_dung?: string;
}

interface SanPham {
    id: string;
    ten_san_pham: string;
    ma_san_pham: string;
    gia_ban: number | string;
    mo_ta?: string | null;
    danh_muc?: string | null;
    thuong_hieu?: string | null;
    so_luong_ton_kho?: number;
    danh_sach_hinh_anh: HinhAnhSPModel[];
}

interface BienTheSPModel {
    id: string;
    san_pham_id: string;
    mau_sac_id: string;
    kich_co_id: string;
    so_luong_ton_kho: number;
}

// ✅ Thêm interface cho màu sắc và kích cỡ
interface MauSacModel {
    id: string;
    ten_Mau_Sac: string;
    ma_Mau: string;
}

interface KichCoModel {
    id: string;
    so_Kich_Co: string;
}

// ✅ Biến global để lưu lựa chọn hiện tại
let selectedColor: MauSacModel | null = null;
let selectedSize: KichCoModel | null = null;
let currentBienThe: BienTheSPModel | null = null;


// ✅ Thêm các function xử lý button vào file TypeScript

// ✅ Cập nhật hàm addToCart
async function addToCart(): Promise<void> {
    const quantityInput = document.getElementById('quantity') as HTMLInputElement;

    if (!quantityInput) {
        console.error('Không tìm thấy input quantity');
        return;
    }

    if (!selectedColor || !selectedSize) {
        alert('Vui lòng chọn màu sắc và kích cỡ!');
        return;
    }

    // ✅ Kiểm tra biến thể có tồn tại không
    if (!currentBienThe) {
        alert('Sản phẩm này hiện không còn hàng!');
        return;
    }

    const quantity = parseInt(quantityInput.value);
    if (quantity < 1) {
        alert('Số lượng phải lớn hơn 0!');
        return;
    }

    // ✅ Kiểm tra số lượng tồn kho
    if (quantity > currentBienThe.so_luong_ton_kho) {
        alert(`Chỉ còn ${currentBienThe.so_luong_ton_kho} sản phẩm trong kho!`);
        return;
    }

    const sanPhamId = getSanPhamIdFromUrl();
    const user = localStorage.getItem('usercontext');
    const userJson = JSON.parse(user || '{}');
    const nguoi_dung_id = userJson._id;

    console.log('Người dùng ID:', nguoi_dung_id);
    if (!nguoi_dung_id) {
        alert('Bạn chưa đăng nhập!');
        return;
    }

    try {
        // 1. Lấy biến thể sản phẩm từ API
        const res = await fetch(`http://localhost:3000/api/bien-the/${selectedColor.id}/${selectedSize.id}/${sanPhamId}`);
        if (!res.ok) {
            alert('Không tìm thấy biến thể sản phẩm!');
            return;
        }
        const bienThe = await res.json();
        const bien_the_id = bienThe._id || bienThe.id;

        // ✅ Kiểm tra lại số lượng tồn kho trước khi thêm vào giỏ
        if (bienThe._so_luong_ton_kho <= 0 || bienThe.so_luong_ton_kho <= 0) {
            alert('Sản phẩm này hiện đã hết hàng!');
            // Cập nhật lại UI
            renderBienTheInfo(selectedColor.id, selectedSize.id);
            return;
        }

        // 2. Gọi API thêm vào giỏ hàng
        const response = await fetch('http://localhost:3000/api/gio-hang/them', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nguoi_dung_id,
                bien_the_id,
                so_luong: quantity
            })
        });

        if (!response.ok) {
            alert('Không thể thêm vào giỏ hàng');
            return;
        }

        alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);

        // ✅ Cập nhật lại thông tin biến thể sau khi thêm vào giỏ
        renderBienTheInfo(selectedColor.id, selectedSize.id);

    } catch (err) {
        console.error('Lỗi khi thêm vào giỏ hàng:', err);
        alert('Đã có lỗi xảy ra!');
    }
}


// Function xử lý mua ngay
function buyNow(): void {
    const quantityInput = document.getElementById('quantity') as HTMLInputElement;

    if (!quantityInput) {
        console.error('Không tìm thấy input quantity');
        return;
    }

    if (!selectedColor || !selectedSize) {
        alert('Vui lòng chọn màu sắc và kích cỡ!');
        return;
    }

    if (!currentBienThe) {
        alert('Sản phẩm này hiện không còn hàng!');
        return;
    }

    const quantity = parseInt(quantityInput.value);
    if (quantity < 1) {
        alert('Số lượng phải lớn hơn 0!');
        return;
    }

    if (quantity > currentBienThe.so_luong_ton_kho) {
        alert(`Chỉ còn ${currentBienThe.so_luong_ton_kho} sản phẩm trong kho!`);
        return;
    }

    const params = {
        bien_the_id: currentBienThe.id,
        so_luong: quantity
    };

    // ✅ Dùng smoothRouter nếu có
    if ((window as any).smoothRouter) {
        (window as any).smoothRouter.navigateTo('ThanhToan.html', params);
    } else {
        // Fallback: dùng URL query string
        const query = new URLSearchParams(params as any).toString();
        window.location.href = `/FE/HTML/ThanhToan.html?${query}`;
    }
}


// Function xử lý quantity increase
function increaseQuantity(): void {
    const quantityInput = document.getElementById('quantity') as HTMLInputElement;

    if (!quantityInput) return;

    const currentValue = parseInt(quantityInput.value);
    const maxValue = parseInt(quantityInput.max);

    if (currentValue < maxValue) {
        quantityInput.value = (currentValue + 1).toString();
    }
}

// Function xử lý quantity decrease
function decreaseQuantity(): void {
    const quantityInput = document.getElementById('quantity') as HTMLInputElement;

    if (!quantityInput) return;

    const currentValue = parseInt(quantityInput.value);

    if (currentValue > 1) {
        quantityInput.value = (currentValue - 1).toString();
    }
}

// ✅ Function để bind event listeners (gọi khi DOM loaded)
function initializeButtonEvents(): void {
    // Bind button events
    const addToCartBtn = document.querySelector('.btn.btn-primary') as HTMLButtonElement;
    const buyNowBtn = document.querySelector('.btn.btn-secondary') as HTMLButtonElement;
    const increaseBtn = document.querySelector('.quantity-btn:last-child') as HTMLButtonElement;
    const decreaseBtn = document.querySelector('.quantity-btn:first-child') as HTMLButtonElement;

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', addToCart);
    }

    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', buyNow);
    }

    if (increaseBtn) {
        increaseBtn.addEventListener('click', increaseQuantity);
    }

    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', decreaseQuantity);
    }
    const quantityInput = document.getElementById('quantity') as HTMLInputElement;
    if (quantityInput) {
        quantityInput.setAttribute('readonly', 'true');
        quantityInput.style.cursor = 'default';
        quantityInput.style.backgroundColor = '#f8f9fa';
    }
}

//Sản phẩm//
function getSanPhamIdFromUrl(): string | null {
    // ✅ Kiểm tra cả URL params và history state
    const urlParams = new URLSearchParams(window.location.search);
    const urlId = urlParams.get('id');

    // Kiểm tra trong history state (cho smooth router)
    if (history.state && history.state.params && history.state.params.id) {
        return history.state.params.id;
    }

    return urlId;
}

async function fetchSanPhamById(id: string): Promise<SanPham | null> {
    try {
        const res = await fetch(`http://localhost:3000/api/san-pham/${id}`);
        if (!res.ok) return null;
        const p = await res.json();
        return {
            id: String(p._id),
            ten_san_pham: p._ten_san_pham,
            ma_san_pham: p._ma_san_pham,
            gia_ban: p._gia_ban,
            mo_ta: p._mo_ta ?? '',
            danh_muc: p._danh_muc ?? '',
            thuong_hieu: p._thuong_hieu ?? '',
            danh_sach_hinh_anh: (p._danh_sach_hinh_anh || []).map((img: any) => ({
                id: String(img._id),
                san_pham_id: String(img._san_pham_id),
                duong_dan_hinh_anh: img._duong_dan_hinh_anh,
            }))
        };
    } catch {
        return null;
    }
}

//Hàm fetch biến thể từ database
async function fetchBienTheBySanPhamId(selectedColorId: string, selectedSizeId: string): Promise<BienTheSPModel | null> {
    const sanPhamId = getSanPhamIdFromUrl();
    if (!sanPhamId) {
        console.error("Không lấy được ID sản phẩm từ URL");
        return null;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/bien-the/${selectedColorId}/${selectedSizeId}/${sanPhamId}`);
        if (!response.ok) return null;

        const data = await response.json();
        if (!data) return null;

        // Ánh xạ key về đúng interface
        const mapped: BienTheSPModel = {
            id: data._id || data.id,
            san_pham_id: data._san_pham_id || data.san_pham_id,
            mau_sac_id: data._mau_sac_id || data.mau_sac_id,
            kich_co_id: data._kich_co_id || data.kich_co_id,
            so_luong_ton_kho: data._so_luong_ton_kho || data.so_luong_ton_kho,
        };

        return mapped;
    } catch (error) {
        console.error("Lỗi khi fetch biến thể sản phẩm:", error);
        return null;
    }
}


function updateAddToCartButton(isAvailable: boolean, quantity: number = 0) {
    const addToCartBtn = document.querySelector('.add-to-cart-btn, #addToCartBtn, button[onclick*="addToCart"]') as HTMLButtonElement;

    if (!addToCartBtn) {
        console.warn('Không tìm thấy nút Add to Cart');
        return;
    }

    if (!isAvailable || quantity <= 0) {
        // Vô hiệu hóa nút
        addToCartBtn.disabled = true;
        addToCartBtn.style.opacity = '0.5';
        addToCartBtn.style.cursor = 'not-allowed';
        addToCartBtn.style.backgroundColor = '#ccc';
        addToCartBtn.textContent = 'Hết hàng';
    } else {
        // Kích hoạt nút
        addToCartBtn.disabled = false;
        addToCartBtn.style.opacity = '1';
        addToCartBtn.style.cursor = 'pointer';
        addToCartBtn.style.backgroundColor = ''; // Reset về màu gốc
        addToCartBtn.textContent = 'Thêm vào giỏ hàng';
    }
}

// ✅ Cập nhật hàm renderBienTheInfo
// ✅ Cập nhật hàm renderBienTheInfo
async function renderBienTheInfo(selectedColorId: string, selectedSizeId: string) {
    const quantityDiv = document.querySelector(".quantity");
    const quantityInput = document.getElementById('quantity') as HTMLInputElement;

    if (!quantityDiv) return;

    const bienThe = await fetchBienTheBySanPhamId(selectedColorId, selectedSizeId);

    // ✅ Cập nhật biến global
    currentBienThe = bienThe;

    if (bienThe && bienThe.so_luong_ton_kho > 0) {
        quantityDiv.innerHTML = `Số lượng còn lại: <strong>${bienThe.so_luong_ton_kho}</strong>`;

        // ✅ Cập nhật max của input quantity
        if (quantityInput) {
            quantityInput.max = bienThe.so_luong_ton_kho.toString();
            // Reset value nếu vượt quá số lượng tồn kho
            if (parseInt(quantityInput.value) > bienThe.so_luong_ton_kho) {
                quantityInput.value = bienThe.so_luong_ton_kho.toString();
            }
        }

        // ✅ Kích hoạt nút Add to Cart
        updateAddToCartButton(true, bienThe.so_luong_ton_kho);
    } else {
        quantityDiv.innerHTML = `<span style="color:red">Không còn hàng</span>`;

        // ✅ Reset max về mặc định khi không có biến thế
        if (quantityInput) {
            quantityInput.max = "15";
            quantityInput.value = "1";
        }

        // ✅ Vô hiệu hóa nút Add to Cart
        updateAddToCartButton(false);
    }
}



// ✅ Hàm fetch màu sắc từ database
async function fetchMauSac(): Promise<MauSacModel[]> {
    try {
        const sanPhamId: string | null = getSanPhamIdFromUrl();
        const res = await fetch(`http://localhost:3000/api/mau-sac/${sanPhamId}`);
        if (!res.ok) return [];
        const data = await res.json();
        return data.map((item: any) => ({
            id: String(item._id || item.id),
            ten_Mau_Sac: item._ten_Mau_Sac || item.ten_Mau_Sac,
            ma_Mau: item._ma_Mau || item.ma_Mau
        }));
    } catch {
        return [];
    }
}

// ✅ Hàm fetch kích cỡ từ database
async function fetchKichCo(): Promise<KichCoModel[]> {
    try {
        const sanPhamId: string | null = getSanPhamIdFromUrl();
        const res = await fetch(`http://localhost:3000/api/kich-co/${sanPhamId}`);
        if (!res.ok) return [];
        const data = await res.json();
        return data.map((item: any) => ({
            id: String(item._id || item.id),
            so_Kich_Co: item._so_Kich_Co || item.so_Kich_Co
        }));
    } catch {
        return [];
    }
}

async function renderMauSac() {
    const mauSacs = await fetchMauSac();
    const colorOptionsContainer = document.querySelector('.color-options');

    if (!colorOptionsContainer || mauSacs.length === 0) return;

    colorOptionsContainer.innerHTML = mauSacs.map((mau, index) => `
        <div class="color-option ${index === 0 ? 'selected' : ''}" 
             data-color-id="${mau.id}" 
             data-color-code="${mau.ma_Mau}" 
             data-color-name="${mau.ten_Mau_Sac}" 
             onclick="selectColor(this)">
            <div class="color-circle" style="background: ${mau.ma_Mau}; ${mau.ma_Mau.toLowerCase() === '#ffffff' || mau.ma_Mau.toLowerCase() === 'white' ? 'border: 1px solid #ddd;' : ''}"></div>
            <div class="color-name">${mau.ten_Mau_Sac}</div>
        </div>
    `).join('');

    // ✅ Chọn màu đầu tiên làm mặc định
    if (mauSacs.length > 0) {
        selectedColor = mauSacs[0];
        updateSelectionInfo();
        // ✅ Load quantity ban đầu nếu đã có size
        if (selectedSize) {
            renderBienTheInfo(selectedColor.id, selectedSize.id);
        }
    }
}

// ✅ Cải tiến hàm renderKichCo để load quantity ban đầu
async function renderKichCo() {
    const kichCos = await fetchKichCo();
    const sizeOptionsContainer = document.querySelector('.size-options');

    if (!sizeOptionsContainer || kichCos.length === 0) return;

    // ✅ Sắp xếp kích cỡ theo thứ tự số
    const sortedKichCos = kichCos.sort((a, b) => {
        const numA = parseFloat(a.so_Kich_Co);
        const numB = parseFloat(b.so_Kich_Co);
        return numA - numB;
    });

    sizeOptionsContainer.innerHTML = sortedKichCos.map((kichCo, index) => `
        <div class="size-option ${index === 0 ? 'selected' : ''}" 
             data-size-id="${kichCo.id}" 
             data-size="${kichCo.so_Kich_Co}" 
             onclick="selectSize(this)">
            ${kichCo.so_Kich_Co}
        </div>
    `).join('');

    // ✅ Chọn kích cỡ đầu tiên làm mặc định
    if (sortedKichCos.length > 0) {
        selectedSize = sortedKichCos[0];
        updateSelectionInfo();
        // ✅ Load quantity ban đầu nếu đã có màu
        if (selectedColor) {
            renderBienTheInfo(selectedColor.id, selectedSize.id);
        }
    }
}

// ✅ Hàm khởi tạo để load quantity ban đầu
async function initializeProductVariant() {
    await Promise.all([renderMauSac(), renderKichCo()]);

    // ✅ Load quantity cho lựa chọn mặc định
    if (selectedColor && selectedSize) {
        renderBienTheInfo(selectedColor.id, selectedSize.id);
    }
}
// ✅ Hàm xử lý chọn màu sắc
function selectColor(element: HTMLElement) {
    // Bỏ selected khỏi tất cả màu
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('selected');
    });

    // Thêm selected vào màu được chọn
    element.classList.add('selected');

    // Cập nhật selectedColor
    const colorId = element.getAttribute('data-color-id');
    const colorCode = element.getAttribute('data-color-code');
    const colorName = element.getAttribute('data-color-name');

    if (colorId && colorCode && colorName) {
        selectedColor = {
            id: colorId,
            ma_Mau: colorCode,
            ten_Mau_Sac: colorName
        };
        updateSelectionInfo();

        // ✅ Cập nhật quantity khi thay đổi màu
        if (selectedSize && colorId) {
            renderBienTheInfo(colorId, selectedSize.id);
        }
    }
}

// ✅ Hàm xử lý chọn kích cỡ
function selectSize(element: HTMLElement) {
    // Kiểm tra nếu size không có sẵn
    if (element.classList.contains('unavailable')) {
        return;
    }

    // Bỏ selected khỏi tất cả size
    document.querySelectorAll('.size-option').forEach(option => {
        option.classList.remove('selected');
    });

    // Thêm selected vào size được chọn
    element.classList.add('selected');

    // Cập nhật selectedSize
    const sizeId = element.getAttribute('data-size-id');
    const sizeValue = element.getAttribute('data-size');

    if (sizeId && sizeValue) {
        selectedSize = {
            id: sizeId,
            so_Kich_Co: sizeValue
        };
        updateSelectionInfo();

        // ✅ Cập nhật quantity khi thay đổi size
        if (selectedColor && sizeId) {
            renderBienTheInfo(selectedColor.id, sizeId);
        }
    }
}

// ✅ Hàm cập nhật thông tin lựa chọn
function updateSelectionInfo() {
    const selectedColorPreview = document.getElementById('selectedColorPreview');
    const selectedColorName = document.getElementById('selectedColorName');
    const selectedSizeName = document.getElementById('selectedSizeName');

    if (selectedColor && selectedColorPreview && selectedColorName) {
        selectedColorPreview.style.background = selectedColor.ma_Mau;
        selectedColorName.textContent = selectedColor.ten_Mau_Sac;

        // Thêm border nếu là màu trắng hoặc sáng
        if (selectedColor.ma_Mau.toLowerCase() === '#ffffff' || selectedColor.ma_Mau.toLowerCase() === 'white') {
            selectedColorPreview.style.border = '1px solid #ddd';
        } else {
            selectedColorPreview.style.border = 'none';
        }
    }

    if (selectedSize && selectedSizeName) {
        selectedSizeName.textContent = selectedSize.so_Kich_Co;
    }
}

// ✅ Expose functions to global scope
(window as any).selectColor = selectColor;
(window as any).selectSize = selectSize;


//Review//
async function fetchDanhGiaBySanPhamId(id: string): Promise<DanhGiaSPModel[]> {
    try {
        const res = await fetch(`http://localhost:3000/api/san-pham/${id}/danh-gia`);
        if (!res.ok) return [];
        const data = await res.json();
        // Map lại field cho đúng interface
        return data.map((r: any) => ({
            id: String(r._id),
            san_pham_id: String(r._san_pham_id),
            nguoi_dung_id: String(r._nguoi_dung_id),
            diem_danh_gia: r._diem_danh_gia,
            noi_dung_danh_gia: r._noi_dung_danh_gia,
            ngay_tao: r._ngay_tao,
            ho_ten_nguoi_dung: r._ho_ten_nguoi_dung
        }));

    } catch {
        return [];
    }
}

function filterReviewByStar(reviews: DanhGiaSPModel[], star: string | number): DanhGiaSPModel[] {
    if (star === 'all') return reviews;
    if (star === 'user') {
        const userStr = localStorage.getItem('usercontext');
        if (!userStr) return [];
        const user = JSON.parse(userStr);
        return reviews.filter(r => r.nguoi_dung_id === user._id);
    }
    const numStar = Number(star);
    return reviews.filter(r => r.diem_danh_gia === numStar);
}

// Hàm tạo và hiển thị dialog quản lý comment
function showCommentDialog(reviewId: string, currentContent: string, currentRating: number) {
    // Tạo overlay
    const overlay = document.createElement('div');
    overlay.className = 'comment-dialog-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    // Tạo dialog
    const dialog = document.createElement('div');
    dialog.className = 'comment-dialog';
    dialog.style.cssText = `
        background: white;
        border-radius: 12px;
        padding: 24px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;

    dialog.innerHTML = `
        <h3 style="color: #E91E63; margin-bottom: 20px; font-size: 20px;">Quản lý đánh giá</h3>
        
        <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Số sao:</label>
            <div class="edit-star-rating" style="display: flex; gap: 4px;">
                ${[1, 2, 3, 4, 5].map(i => `<span class="edit-star" data-value="${i}" style="font-size: 24px; cursor: pointer; color: ${i <= currentRating ? '#E91E63' : '#F19EDC'};">${i <= currentRating ? '★' : '☆'}</span>`).join('')}
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Nội dung:</label>
            <textarea id="editReviewContent" style="width: 100%; height: 100px; padding: 10px; border: 1px solid #F19EDC; border-radius: 6px; resize: vertical;">${currentContent}</textarea>
        </div>
        
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button id="cancelBtn" style="padding: 10px 20px; border: 1px solid #ddd; background: white; border-radius: 6px; cursor: pointer;">Hủy</button>
            <button id="saveBtn" style="padding: 10px 20px; background: linear-gradient(45deg, #F19EDC, #E91E63); color: white; border: none; border-radius: 6px; cursor: pointer;">Lưu</button>
            <button id="deleteBtn" style="padding: 10px 20px; background: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer;">Xóa</button>
        </div>
        
        <div id="dialogMessage" style="margin-top: 12px; color: #e74c3c;"></div>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    let selectedRating = currentRating;

    // Xử lý chọn sao
    const editStars = dialog.querySelectorAll('.edit-star');
    editStars.forEach((star, idx) => {
        star.addEventListener('click', function () {
            selectedRating = idx + 1;
            editStars.forEach((s, i) => {
                const el = s as HTMLElement;
                if (i < selectedRating) {
                    el.style.color = '#E91E63';
                    el.innerHTML = '★';
                } else {
                    el.style.color = '#F19EDC';
                    el.innerHTML = '☆';
                }
            });
        });

        star.addEventListener('mouseover', function () {
            const hoverRating = idx + 1;
            editStars.forEach((s, i) => {
                const el = s as HTMLElement;
                if (i < hoverRating) {
                    el.style.color = '#E91E63';
                    el.innerHTML = '★';
                } else {
                    el.style.color = '#F19EDC';
                    el.innerHTML = '☆';
                }
            });
        });

        star.addEventListener('mouseout', function () {
            editStars.forEach((s, i) => {
                const el = s as HTMLElement;
                if (i < selectedRating) {
                    el.style.color = '#E91E63';
                    el.innerHTML = '★';
                } else {
                    el.style.color = '#F19EDC';
                    el.innerHTML = '☆';
                }
            });
        });
    });

    // Xử lý sự kiện nút
    const cancelBtn = dialog.querySelector('#cancelBtn');
    const saveBtn = dialog.querySelector('#saveBtn');
    const deleteBtn = dialog.querySelector('#deleteBtn');
    const messageEl = dialog.querySelector('#dialogMessage') as HTMLElement;

    // Đóng dialog
    const closeDialog = () => {
        document.body.removeChild(overlay);
    };

    cancelBtn?.addEventListener('click', closeDialog);
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
            closeDialog();
        }
    });

    // Lưu thay đổi
    saveBtn?.addEventListener('click', async function () {
        const newContent = (dialog.querySelector('#editReviewContent') as HTMLTextAreaElement).value.trim();
        if (!newContent) {
            messageEl.textContent = 'Vui lòng nhập nội dung đánh giá!';
            return;
        }

        try {
            const res = await fetch(`http://localhost:3000/api/danh-gia/${reviewId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    diem_danh_gia: selectedRating,
                    noi_dung_danh_gia: newContent
                })
            });

            if (res.ok) {
                alert('Cập nhật đánh giá thành công!');
                closeDialog();
                renderChiTietSanPham();
            } else {
                const err = await res.json();
                messageEl.textContent = err.message || 'Cập nhật đánh giá thất bại!';
            }
        } catch {
            messageEl.textContent = 'Lỗi kết nối máy chủ!';
        }
    });

    // Xóa đánh giá
    deleteBtn?.addEventListener('click', async function () {
        if (confirm('Bạn có chắc muốn xóa đánh giá này?')) {
            try {
                const res = await fetch(`http://localhost:3000/api/danh-gia/${reviewId}`, {
                    method: 'DELETE'
                });

                if (res.ok) {
                    alert('Xóa đánh giá thành công!');
                    closeDialog();
                    renderChiTietSanPham();
                } else {
                    messageEl.textContent = 'Xóa đánh giá thất bại!';
                }
            } catch {
                messageEl.textContent = 'Lỗi kết nối máy chủ!';
            }
        }
    });
}

// Hàm render chi tiết sản phẩm và đánh giá (bạn tự gắn vào DOM theo id hoặc class tuỳ HTML)
async function renderChiTietSanPham() {
    const id = getSanPhamIdFromUrl();
    if (!id) return;
    const sanPham = await fetchSanPhamById(id);
    const danhGias = await fetchDanhGiaBySanPhamId(id);
    if (!sanPham) return;

    // Render ảnh chính và thumbnails
    const mainImage = document.getElementById('mainImage') as HTMLImageElement;
    const imageThumbnails = document.getElementById('imageThumbnails');
    if (mainImage && sanPham.danh_sach_hinh_anh.length > 0) {
        mainImage.src = sanPham.danh_sach_hinh_anh[0].duong_dan_hinh_anh;
        mainImage.alt = sanPham.ten_san_pham;
    }
    if (imageThumbnails) {
        imageThumbnails.innerHTML = sanPham.danh_sach_hinh_anh.map((img, idx) =>
            `<img src="${img.duong_dan_hinh_anh}" alt="Hình ${idx + 1}" class="thumbnail${idx === 0 ? ' active' : ''}" onclick="document.getElementById('mainImage').src='${img.duong_dan_hinh_anh}'; Array.from(document.querySelectorAll('.thumbnail')).forEach(t=>t.classList.remove('active')); this.classList.add('active');">
            `
        ).join('');
    }

    // Render thông tin sản phẩm
    const titleEl = document.querySelector('.product-title');
    if (titleEl) titleEl.textContent = sanPham.ten_san_pham;
    const codeEl = document.querySelector('.product-code');
    if (codeEl) codeEl.textContent = sanPham.ma_san_pham ? `Mã sản phẩm: ${sanPham.ma_san_pham}` : '';
    const brandEl = document.querySelector('.brand-tag');
    if (brandEl) brandEl.textContent = sanPham.thuong_hieu || '';
    const priceEl = document.querySelector('.original-price');
    if (priceEl) priceEl.textContent = sanPham.gia_ban ? `${Number(sanPham.gia_ban).toLocaleString()}₫` : '';
    const stockEl = document.querySelector('.stock-status');
    if (stockEl) stockEl.textContent = sanPham.so_luong_ton_kho !== undefined ? `Còn hàng: ${sanPham.so_luong_ton_kho} sản phẩm có sẵn` : '';
    const moTaEl = document.getElementById('moTaSanPham');
    if (moTaEl) moTaEl.textContent = sanPham.mo_ta || '';

    // Render review
    const reviewList = document.getElementById('reviewList');
    const filterStarEl = document.getElementById('filterStar') as HTMLSelectElement;
    let filteredReviews = danhGias;
    if (filterStarEl) {
        const selectedStar = filterStarEl.value;
        filteredReviews = filterReviewByStar(danhGias, selectedStar);
        filterStarEl.onchange = function () {
            const selected = filterStarEl.value;
            const filtered = filterReviewByStar(danhGias, selected);
            if (reviewList) {
                if (filtered.length === 0) {
                    reviewList.innerHTML = '<div class="placeholder-text">Không có đánh giá nào phù hợp.</div>';
                } else {
                    const userStr = localStorage.getItem('usercontext');
                    let userId = null;
                    if (userStr) {
                        try {
                            const user = JSON.parse(userStr);
                            userId = user._id;
                        } catch { }
                    }
                    reviewList.innerHTML = filtered.map(r => {
                        const isOwner = userId && r.nguoi_dung_id === userId;
                        return `
                        <div class="review-item ${isOwner ? 'user-review clickable' : ''}" data-review-id="${r.id}" data-review-content="${r.noi_dung_danh_gia}" data-review-rating="${r.diem_danh_gia}" ${isOwner ? 'title="Click để chỉnh sửa đánh giá"' : ''}>
                            <div class="review-header">
                                <div class="reviewer-avatar">${r.ho_ten_nguoi_dung ? r.ho_ten_nguoi_dung.charAt(0).toUpperCase() : '?'}</div>
                                <div class="reviewer-info">
                                    <div class="reviewer-name">${r.ho_ten_nguoi_dung || 'Ẩn danh'}</div>
                                    <div class="review-date">${new Date(r.ngay_tao).toLocaleDateString('vi-VN')}</div>
                                </div>
                                <div class="review-rating">${'★'.repeat(r.diem_danh_gia)}${'☆'.repeat(5 - r.diem_danh_gia)}</div>
                            </div>
                            <div class="review-content">${r.noi_dung_danh_gia}</div>
                        </div>
                        `;
                    }).join('');
                }
                // Gắn lại sự kiện click cho các review sau khi filter
                attachReviewClickEvents();
            }
        };
    }

    if (reviewList) {
        if (filteredReviews.length === 0) {
            reviewList.innerHTML = '<div class="placeholder-text">Chưa có đánh giá nào cho sản phẩm này.</div>';
        } else {
            const userStr = localStorage.getItem('usercontext');
            let userId = null;
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    userId = user._id;
                } catch { }
            }
            reviewList.innerHTML = filteredReviews.map(r => {
                const isOwner = userId && r.nguoi_dung_id === userId;
                return `
                <div class="review-item ${isOwner ? 'user-review clickable' : ''}" data-review-id="${r.id}" data-review-content="${r.noi_dung_danh_gia}" data-review-rating="${r.diem_danh_gia}" ${isOwner ? 'title="Click để chỉnh sửa đánh giá"' : ''}>
                    <div class="review-header">
                        <div class="reviewer-avatar">${r.ho_ten_nguoi_dung ? r.ho_ten_nguoi_dung.charAt(0).toUpperCase() : '?'}</div>
                        <div class="reviewer-info">
                            <div class="reviewer-name">${r.ho_ten_nguoi_dung || 'Ẩn danh'}</div>
                            <div class="review-date">${new Date(r.ngay_tao).toLocaleDateString('vi-VN')}</div>
                        </div>
                        <div class="review-rating">${'★'.repeat(r.diem_danh_gia)}${'☆'.repeat(5 - r.diem_danh_gia)}</div>
                    </div>
                    <div class="review-content">${r.noi_dung_danh_gia}</div>
                </div>
                `;
            }).join('');

            // Gắn sự kiện click cho các review của user
            attachReviewClickEvents();
        }
    }
}

// Hàm gắn sự kiện click cho các review của user
function attachReviewClickEvents() {
    const userReviews = document.querySelectorAll('.review-item.user-review.clickable');
    userReviews.forEach(reviewEl => {
        reviewEl.addEventListener('click', function () {
            const reviewId = (reviewEl as HTMLElement).getAttribute('data-review-id')!;
            const reviewContent = (reviewEl as HTMLElement).getAttribute('data-review-content') || '';
            const reviewRating = Number((reviewEl as HTMLElement).getAttribute('data-review-rating')) || 1;

            showCommentDialog(reviewId, reviewContent, reviewRating);
        });
    });
}

// ✅ Hàm khởi tạo star rating
function initStarRating() {
    const stars = document.querySelectorAll('#starRating .star');
    let selectedRating = 0;

    stars.forEach((star, idx) => {
        star.addEventListener('mouseover', function () {
            highlightStars(idx + 1);
        });
        star.addEventListener('mouseout', function () {
            highlightStars(selectedRating);
        });
        star.addEventListener('click', function () {
            selectedRating = idx + 1;
            highlightStars(selectedRating);
        });
    });

    function highlightStars(rating: number) {
        stars.forEach((star, i) => {
            if (i < rating) {
                star.classList.add('selected');
                star.innerHTML = '★'; // filled star
            } else {
                star.classList.remove('selected');
                star.innerHTML = '☆'; // empty star
            }
        });
    }

    return selectedRating;
}

// ✅ Hàm khởi tạo form review
function initReviewForm() {
    const reviewForm = document.getElementById('userReviewForm') as HTMLFormElement;
    const stars = document.querySelectorAll('#starRating .star');
    let selectedRating = 0;

    // Khởi tạo star rating
    stars.forEach((star, idx) => {
        star.addEventListener('mouseover', function () {
            highlightStars(idx + 1);
        });
        star.addEventListener('mouseout', function () {
            highlightStars(selectedRating);
        });
        star.addEventListener('click', function () {
            selectedRating = idx + 1;
            highlightStars(selectedRating);
        });
    });

    function highlightStars(rating: number) {
        stars.forEach((star, i) => {
            if (i < rating) {
                star.classList.add('selected');
                star.innerHTML = '★';
            } else {
                star.classList.remove('selected');
                star.innerHTML = '☆';
            }
        });
    }

    if (reviewForm) {
        reviewForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            if (selectedRating === 0) {
                document.getElementById('reviewFormMessage')!.textContent = 'Vui lòng chọn số sao trước khi gửi đánh giá!';
                return;
            }

            document.getElementById('reviewFormMessage')!.textContent = '';

            // Lấy user từ localStorage
            const userStr = localStorage.getItem('usercontext');
            if (!userStr) {
                document.getElementById('reviewFormMessage')!.textContent = 'Bạn cần đăng nhập để gửi đánh giá!';
                return;
            }

            const user = JSON.parse(userStr);
            const sanPhamId = getSanPhamIdFromUrl();
            const reviewContent = (document.getElementById('reviewContent') as HTMLTextAreaElement).value;

            try {
                const res = await fetch(`http://localhost:3000/api/san-pham/${sanPhamId}/danh-gia`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        san_pham_id: sanPhamId,
                        nguoi_dung_id: user._id,
                        diem_danh_gia: selectedRating,
                        noi_dung_danh_gia: reviewContent
                    })
                });

                if (res.ok) {
                    document.getElementById('reviewFormMessage')!.textContent = 'Gửi đánh giá thành công!';
                    reviewForm.reset();
                    highlightStars(0);
                    selectedRating = 0;
                    renderChiTietSanPham();
                } else {
                    const err = await res.json();
                    document.getElementById('reviewFormMessage')!.textContent = err.message || 'Gửi đánh giá thất bại!';
                }
            } catch {
                document.getElementById('reviewFormMessage')!.textContent = 'Lỗi kết nối máy chủ!';
            }
        });
    }
}

// ✅ Hàm khởi tạo chính - sẽ được gọi bởi smooth router
function initChiTietSanPham() {
    console.log('initChiTietSanPham called');
    renderChiTietSanPham();
    initReviewForm();
    initializeProductVariant();
    initializeButtonEvents();
}

// ✅ Export functions to window để smooth router có thể gọi
(window as any).initChiTietSanPham = initChiTietSanPham;
(window as any).renderChiTietSanPham = renderChiTietSanPham;

// ✅ Chỉ khởi tạo khi trang được load trực tiếp (không phải qua smooth router)
document.addEventListener('DOMContentLoaded', () => {
    // Kiểm tra xem có đang trong smooth router hay không
    if (!history.state || !history.state.page) {
        // Đang load trực tiếp, không qua smooth router
        initChiTietSanPham();

        // Load NavBar nếu cần
        /*const navbar = document.getElementById('navbar');
        if (navbar && !navbar.innerHTML.trim()) {
            fetch('/FE/HTML/NavBar.html')
                .then(res => res.text())
                .then(html => {
                    navbar.innerHTML = html;
                })
                .catch(error => {
                    console.error('Không thể load navbar:', error);
                });
        }*/
    }
});