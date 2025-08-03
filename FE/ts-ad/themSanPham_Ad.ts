// Interfaces cho dữ liệu từ API
interface DanhMuc {
    id?: string;
    ten_danh_muc: string;
    mo_ta?: string;
}

interface ThuongHieu {
    id?: string;
    ten_thuong_hieu: string;
    mo_ta?: string;
}

interface SanPham2 {
    ten_san_pham: string;
    ma_san_pham: string;
    gia_ban: number | string;
    mo_ta?: string | null;
    danh_muc?: string | null;
    thuong_hieu?: string | null;
}

// API Functions
async function getAllDanhMucAd(): Promise<DanhMuc[]> {
    try {
        const response = await fetch('http://localhost:3000/api/danh-muc');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const rawData = await response.json();

        // Chuyển đổi dữ liệu từ API format sang interface format
        return rawData.map((item: any) => ({
            id: item._id || item.id,
            ten_danh_muc: item._ten_danh_muc,
            mo_ta: item._mo_ta || undefined
        }));
    } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
        throw error;
    }
}

async function getAllThuongHieuAd(): Promise<ThuongHieu[]> {
    try {
        const response = await fetch('http://localhost:3000/api/thuong-hieu');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const rawData = await response.json();

        // Chuyển đổi dữ liệu từ API format sang interface format
        return rawData.map((item: any) => ({
            id: item._id || item.id,
            ten_thuong_hieu: item._ten_thuong_hieu,
            mo_ta: item._mo_ta || undefined
        }));
    } catch (error) {
        console.error('Lỗi khi lấy thương hiệu:', error);
        throw error;
    }
}

// Cập nhật hàm createProductAd để phù hợp với API endpoint
async function createProductAd(product: SanPham2): Promise<string | null> {
    try {
        // Lấy tên danh mục và thương hiệu từ select elements
        const danhMucSelect = document.getElementById('danhMuc') as HTMLSelectElement;
        const thuongHieuSelect = document.getElementById('thuongHieu') as HTMLSelectElement;

        const apiData = {
            ten_san_pham: product.ten_san_pham,
            ma_san_pham: product.ma_san_pham,
            mo_ta: product.mo_ta,
            gia_ban: product.gia_ban,
            ten_danh_muc: getSelectedTextAd(danhMucSelect), // Truyền tên danh mục
            ten_thuong_hieu: getSelectedTextAd(thuongHieuSelect) // Truyền tên thương hiệu
        };

        const response = await fetch('http://localhost:3000/api/san-pham', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return result.id || result._id || null;
    } catch (error) {
        console.error('Lỗi khi tạo sản phẩm:', error);
        throw error;
    }
}


// Utility Functions
function formatPriceAd(price: number | string): string {
    let numPrice = price;
    if (price === undefined || price === null) numPrice = 0;
    if (typeof price === 'string') numPrice = parseFloat(price);
    if (isNaN(numPrice as number)) numPrice = 0;

    return new Intl.NumberFormat('vi-VN').format(numPrice as number);
}

function validateFormDataAd(data: SanPham2): boolean {
    if (!data.ten_san_pham || !data.ten_san_pham.trim()) {
        alert('⚠️ Vui lòng nhập tên sản phẩm!');
        (document.getElementById('tenSanPham') as HTMLInputElement)?.focus();
        return false;
    }

    if (!data.ma_san_pham || !data.ma_san_pham.trim()) {
        alert('⚠️ Vui lòng nhập mã sản phẩm!');
        (document.getElementById('maSanPham') as HTMLInputElement)?.focus();
        return false;
    }

    // Xử lý validation cho gia_ban kiểu number | string
    let price = data.gia_ban;
    if (typeof price === 'string') {
        price = parseFloat(price);
    }

    if (!price || isNaN(price) || price <= 0) {
        alert('⚠️ Vui lòng nhập giá bán hợp lệ!');
        (document.getElementById('giaBan') as HTMLInputElement)?.focus();
        return false;
    }

    if (data.ma_san_pham.length < 3) {
        alert('⚠️ Mã sản phẩm phải có ít nhất 3 ký tự!');
        (document.getElementById('maSanPham') as HTMLInputElement)?.focus();
        return false;
    }

    return true;
}

function getSelectedTextAd(selectElement: HTMLSelectElement): string {
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    return selectedOption ? selectedOption.textContent || '' : '';
}

function formatPriceInputAd(input: HTMLInputElement): void {
    let value = input.value.replace(/[^\d]/g, '');

    if (value) {
        // Store raw value for form submission
        input.setAttribute('data-raw-value', value);

        // Format hiển thị với dấu phẩy
        const formattedValue = parseInt(value).toLocaleString('vi-VN');

        // Cập nhật placeholder để hiển thị format
        input.placeholder = `${formattedValue} VNĐ`;
    } else {
        input.placeholder = '0';
    }
}

function showSuccessMessageAd(element: HTMLElement): void {
    element.style.display = 'block';
    element.innerHTML = '🎉 Sản phẩm đã được thêm thành công!';
    element.style.background = 'linear-gradient(135deg, #F19EDC, #e68cc7)';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideSuccessMessageAd(element: HTMLElement): void {
    element.style.display = 'none';
}

function showErrorMessageAd(element: HTMLElement, message: string): void {
    // Hiển thị trong success message với màu đỏ
    element.style.display = 'block';
    element.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a52)';
    element.innerHTML = `❌ ${message}`;

    // Tự động ẩn sau 5 giây
    setTimeout(() => {
        hideSuccessMessageAd(element);
        // Reset lại màu
        element.style.background = 'linear-gradient(135deg, #F19EDC, #e68cc7)';
    }, 5000);

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function populateDanhMucSelectAd(selectElement: HTMLSelectElement, danhMucs: DanhMuc[]): void {
    // Clear existing options
    selectElement.innerHTML = '<option value="">-- Chọn danh mục --</option>';

    danhMucs.forEach(danhMuc => {
        const option = document.createElement('option');
        option.value = danhMuc.id || danhMuc.ten_danh_muc;
        option.textContent = danhMuc.ten_danh_muc;
        option.title = danhMuc.mo_ta || danhMuc.ten_danh_muc; // Tooltip
        selectElement.appendChild(option);
    });

    console.log(`Đã tải ${danhMucs.length} danh mục`);
}

function populateThuongHieuSelectAd(selectElement: HTMLSelectElement, thuongHieus: ThuongHieu[]): void {
    // Clear existing options
    selectElement.innerHTML = '<option value="">-- Chọn thương hiệu --</option>';

    thuongHieus.forEach(thuongHieu => {
        const option = document.createElement('option');
        option.value = thuongHieu.id || thuongHieu.ten_thuong_hieu;
        option.textContent = thuongHieu.ten_thuong_hieu;
        option.title = thuongHieu.mo_ta || thuongHieu.ten_thuong_hieu; // Tooltip
        selectElement.appendChild(option);
    });

    console.log(`Đã tải ${thuongHieus.length} thương hiệu`);
}

function setupHoverEffectsAd(): void {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        const element = input as HTMLElement;

        element.addEventListener('mouseenter', () => {
            (element as HTMLInputElement).style.borderColor = '#e68cc7';
        });

        element.addEventListener('mouseleave', () => {
            if (element !== document.activeElement) {
                (element as HTMLInputElement).style.borderColor = '#F19EDC';
            }
        });
    });
}

function setupAnimationsAd(): void {
    const container = document.querySelector('.container') as HTMLElement;
    if (container) {
        container.style.opacity = '0';
        container.style.transform = 'translateY(30px)';

        setTimeout(() => {
            container.style.transition = 'all 0.6s ease';
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 100);
    }
}

function getFormDataAd(form: HTMLFormElement): SanPham2 {
    const formData = new FormData(form);

    // Xử lý gia_ban có thể là string hoặc number
    const giaBanValue = formData.get('giaBan') as string;
    let giaBan: number | string = parseInt(giaBanValue) || 0;

    // Nếu muốn giữ nguyên dạng string, có thể sử dụng:
    // let giaBan: number | string = giaBanValue || '0';

    return {
        ten_san_pham: formData.get('tenSanPham') as string,
        ma_san_pham: formData.get('maSanPham') as string,
        gia_ban: giaBan,
        mo_ta: formData.get('moTa') as string || null,
        danh_muc: formData.get('danhMuc') as string || null,
        thuong_hieu: formData.get('thuongHieu') as string || null
    };
}

function setFormDataAd(data: Partial<SanPham2>): void {
    if (data.ten_san_pham) {
        (document.getElementById('tenSanPham') as HTMLInputElement).value = data.ten_san_pham;
    }
    if (data.ma_san_pham) {
        (document.getElementById('maSanPham') as HTMLInputElement).value = data.ma_san_pham;
    }
    if (data.gia_ban !== undefined && data.gia_ban !== null) {
        // Xử lý gia_ban có thể là number hoặc string
        const giaBanValue = typeof data.gia_ban === 'string' ? data.gia_ban : data.gia_ban.toString();
        (document.getElementById('giaBan') as HTMLInputElement).value = giaBanValue;
    }
    if (data.mo_ta) {
        (document.getElementById('moTa') as HTMLTextAreaElement).value = data.mo_ta;
    }
    if (data.danh_muc) {
        (document.getElementById('danhMuc') as HTMLSelectElement).value = data.danh_muc;
    }
    if (data.thuong_hieu) {
        (document.getElementById('thuongHieu') as HTMLSelectElement).value = data.thuong_hieu;
    }
}

// Main Functions
async function loadDataAd(): Promise<void> {
    const danhMucSelect = document.getElementById('danhMuc') as HTMLSelectElement;
    const thuongHieuSelect = document.getElementById('thuongHieu') as HTMLSelectElement;
    const successMessage = document.getElementById('successMessage') as HTMLElement;

    try {
        // Load danh mục và thương hiệu song song
        const [danhMucs, thuongHieus] = await Promise.all([
            getAllDanhMucAd(),
            getAllThuongHieuAd()
        ]);

        populateDanhMucSelectAd(danhMucSelect, danhMucs);
        populateThuongHieuSelectAd(thuongHieuSelect, thuongHieus);

    } catch (error) {
        console.error('Lỗi khi load dữ liệu:', error);
        showErrorMessageAd(successMessage, 'Không thể tải dữ liệu danh mục và thương hiệu. Kiểm tra kết nối server.');

        // Fallback: hiển thị option lỗi
        danhMucSelect.innerHTML = '<option value="">-- Lỗi tải danh mục --</option>';
        thuongHieuSelect.innerHTML = '<option value="">-- Lỗi tải thương hiệu --</option>';
    }
}

// Hàm lấy ID sản phẩm từ mã sản phẩm (nếu cần)
async function getProductIdByCode(maSanPham: string): Promise<string | null> {
    try {
        const response = await fetch(`http://localhost:3000/api/san-pham?ma_san_pham=${maSanPham}`);
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data.id || data._id || null;
    } catch (error) {
        console.error('Lỗi khi lấy ID sản phẩm:', error);
        return null;
    }
}

// Hàm handleSubmitAd được cập nhật
async function handleSubmitAd(e: Event): Promise<void> {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const successMessage = document.getElementById('successMessage') as HTMLElement;
    const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;

    const productData = getFormDataAd(form);

    // Validation
    if (!validateFormDataAd(productData)) {
        return;
    }

    // Disable submit button để tránh double submit
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Đang thêm...';
    }

    try {
        // Gọi API để tạo sản phẩm mới
        const productId: string | null = await createProductAd(productData);

        // Hiển thị thành công
        showSuccessMessageAd(successMessage);
        console.log('Sản phẩm đã được tạo thành công:', productId);

        // Reset form
        form.reset();

        // Chờ 2 giây rồi chuyển hướng đến trang chi tiết sản phẩm
        setTimeout(async () => {
            try {
                console.log('ID sản phẩm mới:', productId);
                if (productId) {
                    // Chuyển hướng đến trang chi tiết với ID sản phẩm
                    window.location.href = `/FE/HTML-AD/ChiTietSanPham_Ad.html?id=${productId}`;
                } else {
                    // Fallback: chuyển hướng với mã sản phẩm
                    window.location.href = `/FE/HTML-AD/ChiTietSanPham_Ad.html?ma_san_pham=${encodeURIComponent(productData.ma_san_pham)}`;
                }
            } catch (error) {
                console.error('Lỗi khi chuyển hướng:', error);
                // Vẫn chuyển hướng với mã sản phẩm nếu có lỗi
                window.location.href = `/FE/HTML-AD/ChiTietSanPham_Ad.html?ma_san_pham=${encodeURIComponent(productData.ma_san_pham)}`;
            }
        }, 100);

    } catch (error) {
        console.error('Lỗi khi tạo sản phẩm:', error);
        const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi thêm sản phẩm';
        showErrorMessageAd(successMessage, errorMessage);
    } finally {
        // Re-enable submit button
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Thêm sản phẩm';
        }
    }
}

function handleResetAd(): void {
    const successMessage = document.getElementById('successMessage') as HTMLElement;
    setTimeout(() => {
        hideSuccessMessageAd(successMessage);
    }, 100);
}

function setupEventListenersAd(): void {
    const form = document.getElementById('productForm') as HTMLFormElement;
    const giaBanInput = document.getElementById('giaBan') as HTMLInputElement;

    // Submit form
    form.addEventListener('submit', handleSubmitAd);

    // Reset form
    form.addEventListener('reset', handleResetAd);

    // Format giá bán
    giaBanInput.addEventListener('input', (e) => {
        formatPriceInputAd(e.target as HTMLInputElement);
    });

    // Hover effects
    setupHoverEffectsAd();
}

// Initialize function
async function initProductFormAd(): Promise<void> {
    await loadDataAd();
    setupEventListenersAd();
    setupAnimationsAd();
}

// Initialize khi DOM loaded
document.addEventListener('DOMContentLoaded', initProductFormAd);

// Tất cả functions và interfaces đã sẵn sàng sử dụng