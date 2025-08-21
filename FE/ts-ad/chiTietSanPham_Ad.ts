// ChiTietSanPham_Ad.ts - Simplified Version

interface SanPham_Ad {
    id: string;
    ten_san_pham: string;
    ma_san_pham: string;
    gia_ban: number;
    mo_ta: string;
    danh_muc: string;
    thuong_hieu: string;
    danh_sach_hinh_anh: HinhAnh_Ad[];
}

interface HinhAnh_Ad {
    id: string;
    san_pham_id: string;
    duong_dan_hinh_anh: string;
}

interface BienThe_Ad {
    id: string;
    san_pham_id: string;
    mau_sac: string;
    kich_co: string;
    ma_mau: string;
    so_luong_ton_kho: number;
}

interface DanhGia_Ad {
    id: string;
    san_pham_id: string;
    ten_khach_hang: string;
    so_sao: number;
    noi_dung: string;
    ngay_danh_gia: string;
}

function getAuthHeaders2() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

class ChiTietSanPhamManager_Ad {
    private sanPhamId: string | null = null;
    private sanPham: SanPham_Ad | null = null;
    private originalStockData: { [key: string]: number } = {};

    constructor() {
        // Tự động khởi tạo khi DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', async () => {
                // Kiểm tra đăng nhập
                const token = localStorage.getItem('token') || sessionStorage.getItem('token');

                if (!token) {
                    sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
                    window.location.href = '/FE/HTML/DangNhap.html';
                    return;
                }

                try {
                    const res = await fetch("http://localhost:3000/api/nguoi-dung/me", {
                        headers: getAuthHeaders2()
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
                this.init_Ad();
            });
        } else {
            this.init_Ad();
        }
    }

    private async init_Ad(): Promise<void> {
        try {
            this.getSanPhamIdFromUrl_Ad();

            // Load song song
            await Promise.all([
                this.loadMauSacListByProductId_Ad(),
                this.sanPhamId ? this.loadSanPhamData_Ad() : Promise.resolve()
            ]);

            if (!this.sanPhamId) {
                this.showError_Ad('Không tìm thấy ID sản phẩm');
            }

            this.bindEvents_Ad();
            console.log('🥿 ChiTietSanPham_Ad đã được khởi tạo thành công!');
        } catch (error) {
            console.error('Lỗi khởi tạo ChiTietSanPham_Ad:', error);
            this.showError_Ad('Có lỗi xảy ra khi khởi tạo');
        }
    }
    private getSanPhamIdFromUrl_Ad(): void {
        // Lấy ID từ URL params: ?id=xxx
        const urlParams = new URLSearchParams(window.location.search);
        this.sanPhamId = urlParams.get('id');

        console.log('🔍 ID sản phẩm từ URL:', this.sanPhamId);
    }

    private async loadSanPhamData_Ad(): Promise<void> {
        if (!this.sanPhamId) return;

        try {
            this.showLoading_Ad();

            // Load dữ liệu song song
            const [sanPham, bienTheList, danhGiaList] = await Promise.all([
                this.fetchSanPhamById_Ad(this.sanPhamId),
                this.fetchBienTheByProductId_Ad(this.sanPhamId),
                this.fetchDanhGiaByProductId_Ad(this.sanPhamId)
            ]);

            if (sanPham) {
                this.sanPham = sanPham;
                await this.initializeCategoriesAndBrands_Ad();
                this.renderSanPhamInfo_Ad(sanPham);
                this.renderBienTheTable_Ad(bienTheList);
                this.renderDanhGiaList_Ad(danhGiaList);
                this.updateStats_Ad(bienTheList, danhGiaList);

            } else {
                this.showError_Ad('Không tìm thấy sản phẩm');
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
            this.showError_Ad('Có lỗi xảy ra khi tải dữ liệu');
        } finally {
            this.hideLoading_Ad();
        }
    }

    private async fetchSanPhamById_Ad(id: string): Promise<SanPham_Ad | null> {
        try {
            const res = await fetch(`http://localhost:3000/api/san-pham/${id}`, {
                headers: getAuthHeaders2()
            });
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

    // Hàm lấy danh sách màu sắc từ API
    private async fetchColors_Ad(): Promise<any[]> {
        try {
            const response = await fetch('http://localhost:3000/api/mau-sac/',
                {
                    headers: getAuthHeaders2()
                }
            );
            if (!response.ok) {
                throw new Error('Không thể tải danh sách màu sắc');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Lỗi khi tải màu sắc:', error);
            return [];
        }
    }

    // Hàm lấy danh sách kích cỡ từ API
    private async fetchSizes_Ad(): Promise<any[]> {
        try {
            const response = await fetch('http://localhost:3000/api/kich-co/', {
                headers: getAuthHeaders2()
            });
            if (!response.ok) {
                throw new Error('Không thể tải danh sách kích cỡ');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Lỗi khi tải kích cỡ:', error);
            return [];
        }
    }

    private async fetchBienTheByProductId_Ad(productId: string): Promise<BienThe_Ad[]> {
        try {
            const res = await fetch(`http://localhost:3000/api/bien-the/san-pham/${productId}`, {
                headers: getAuthHeaders2()
            });
            if (!res.ok) return [];
            const data = await res.json();
            return data.map((bt: any) => ({
                id: String(bt._id),
                san_pham_id: String(bt._san_pham_id),
                mau_sac: bt._mau_sac,
                kich_co: bt._kich_co,
                ma_mau: bt._ma_mau,
                so_luong_ton_kho: bt._so_luong_ton_kho
            }));
        } catch {
            return [];
        }
    }

    private async fetchDanhGiaByProductId_Ad(productId: string): Promise<DanhGia_Ad[]> {
        try {
            const res = await fetch(`http://localhost:3000/api/san-pham/${productId}/danh-gia`, {
                headers: getAuthHeaders2()
            });
            if (!res.ok) return [];
            const data = await res.json();
            return data.map((dg: any) => ({
                id: String(dg._id),
                san_pham_id: String(dg._san_pham_id),
                ten_khach_hang: dg._ho_ten_nguoi_dung,
                so_sao: dg._diem_danh_gia,
                noi_dung: dg._noi_dung_danh_gia,
                ngay_danh_gia: dg._ngay_tao
            }));
        } catch {
            return [];
        }
    }

    // Hàm khởi tạo - load và render danh mục + thương hiệu (có thể dùng private nếu trong class)
    private async initializeCategoriesAndBrands_Ad(): Promise<void> {
        try {
            // Hiển thị loading
            const loadingIndicator = document.getElementById('loadingIndicator');
            if (loadingIndicator) {
                loadingIndicator.style.display = 'block';
            }

            // Load danh mục
            const [danhMucsResponse, thuongHieusResponse] = await Promise.all([
                fetch('http://localhost:3000/api/danh-muc'),
                fetch('http://localhost:3000/api/thuong-hieu')
            ]);

            if (!danhMucsResponse.ok || !thuongHieusResponse.ok) {
                throw new Error('Lỗi khi gọi API');
            }

            const [danhMucs, thuongHieus] = await Promise.all([
                danhMucsResponse.json(),
                thuongHieusResponse.json()
            ]);

            // Render danh mục
            const categorySelect = document.getElementById('productCategory') as HTMLSelectElement;
            if (categorySelect) {
                categorySelect.innerHTML = '<option value="">Chọn danh mục</option>';
                danhMucs.forEach((danhMuc: any) => {
                    const option = document.createElement('option');
                    option.value = danhMuc._id;
                    option.textContent = danhMuc._ten_danh_muc;
                    categorySelect.appendChild(option);
                });
            }

            // Render thương hiệu
            const brandSelect = document.getElementById('productBrand') as HTMLSelectElement;
            if (brandSelect) {
                brandSelect.innerHTML = '<option value="">Chọn thương hiệu</option>';
                thuongHieus.forEach((thuongHieu: any) => {
                    const option = document.createElement('option');
                    option.value = thuongHieu._id;
                    option.textContent = thuongHieu._ten_thuong_hieu;
                    brandSelect.appendChild(option);
                });
            }

            console.log(`Đã load ${danhMucs.length} danh mục và ${thuongHieus.length} thương hiệu`);

        } catch (error) {
            console.error('Lỗi khi khởi tạo danh mục và thương hiệu:', error);

            // Hiển thị thông báo lỗi
            const errorDiv = document.getElementById('errorMessage');
            const errorText = document.getElementById('errorText');
            if (errorDiv && errorText) {
                errorText.textContent = 'Không thể tải danh mục và thương hiệu từ server';
                errorDiv.style.display = 'block';
            }
        } finally {
            // Ẩn loading
            const loadingIndicator = document.getElementById('loadingIndicator');
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
        }
    }


    private renderSanPhamInfo_Ad(sanPham: SanPham_Ad): void {
        // Cập nhật thông tin cơ bản
        this.updateElement_Ad('productId', sanPham.id);
        this.updateElement_Ad('productCode', sanPham.ma_san_pham);
        this.updateElement_Ad('productName', sanPham.ten_san_pham);
        this.updateElement_Ad('productDescription', sanPham.mo_ta);
        this.updateElement_Ad('productPrice', sanPham.gia_ban.toString());

        // Cập nhật danh mục và thương hiệu
        this.updateSelectByText_Ad('productCategory', sanPham.danh_muc);
        this.updateSelectByText_Ad('productBrand', sanPham.thuong_hieu);

        // Cập nhật hình ảnh
        this.renderImages_Ad(sanPham.danh_sach_hinh_anh);
    }

    private renderImages_Ad(images: HinhAnh_Ad[]): void {
        if (images.length === 0) return;

        const mainImage = document.getElementById('mainImage') as HTMLImageElement;
        const imageGallery = document.querySelector('.image-gallery');

        if (mainImage && images[0]) {
            mainImage.src = images[0].duong_dan_hinh_anh;
        }

        if (imageGallery) {
            imageGallery.innerHTML = '';
            images.forEach((img, index) => {
                const thumbnail = document.createElement('img');
                thumbnail.src = img.duong_dan_hinh_anh;
                thumbnail.alt = `Ảnh ${index + 1}`;
                thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
                thumbnail.onclick = () => this.changeMainImage_Ad(thumbnail);
                imageGallery.appendChild(thumbnail);
            });
        }
    }

    private renderBienTheTable_Ad(bienTheList: BienThe_Ad[]): void {
        const tbody = document.getElementById('variantsTableBody');
        if (!tbody) return;

        // Clear dữ liệu gốc trước khi render
        this.originalStockData = {};

        tbody.innerHTML = '';
        bienTheList.forEach(bt => {
            // Lưu số lượng gốc
            this.originalStockData[bt.id] = bt.so_luong_ton_kho;

            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${bt.id}</td>
            <td><span class="color-preview" style="background-color: ${bt.ma_mau};"></span>${bt.mau_sac}</td>
            <td>${bt.kich_co}</td>
            <td><input type="number" value="${bt.so_luong_ton_kho}" min="0" style="width: 80px; padding: 5px;" data-variant-id="${bt.id}" data-original-value="${bt.so_luong_ton_kho}"></td>
            <td>
                <button class="btn btn-danger" onclick="chiTietSanPhamManager_Ad.deleteVariant_Ad(this)" style="padding: 5px 10px; font-size: 12px;">🗑️</button>
            </td>
        `;
            tbody.appendChild(row);
        });
    }


    private renderDanhGiaList_Ad(danhGiaList: DanhGia_Ad[]): void {
        const reviewsList = document.getElementById('reviewsList');
        if (!reviewsList) return;

        reviewsList.innerHTML = '';
        danhGiaList.forEach(dg => {
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';
            reviewItem.innerHTML = `
                <div class="review-header">
                    <div>
                        <div class="review-user">👤 ${dg.ten_khach_hang}</div>
                        <div class="rating">
                            ${this.generateStars_Ad(dg.so_sao)}
                        </div>
                    </div>
                    <div>
                        <div class="review-date">${this.formatDate_Ad(dg.ngay_danh_gia)}</div>
                        <button class="btn btn-danger" onclick="chiTietSanPhamManager_Ad.deleteReview_Ad(this)" data-review-id="${dg.id}" style="padding: 5px 10px; font-size: 12px; margin-top: 5px;">🗑️ Xóa</button>
                    </div>
                </div>
                <div class="review-content">
                    ${dg.noi_dung}
                </div>
            `;
            reviewsList.appendChild(reviewItem);
        });
    }

    private updateStats_Ad(bienTheList: BienThe_Ad[], danhGiaList: DanhGia_Ad[]): void {
        const totalVariants = bienTheList.length;
        const totalStock = bienTheList.reduce((sum, bt) => sum + bt.so_luong_ton_kho, 0);
        const avgRating = danhGiaList.length > 0
            ? (danhGiaList.reduce((sum, dg) => sum + dg.so_sao, 0) / danhGiaList.length).toFixed(1)
            : '0';
        const totalReviews = danhGiaList.length;

        this.updateElement_Ad('totalVariants', totalVariants.toString());
        this.updateElement_Ad('totalStock', totalStock.toString());
        this.updateElement_Ad('avgRating', avgRating);
        this.updateElement_Ad('totalReviews', totalReviews.toString());
    }

    private bindEvents_Ad(): void {
        // Lắng nghe thay đổi tồn kho
        document.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            if (target.type === 'number' && target.closest('#variantsTableBody')) {
                this.updateStockStats_Ad();
            }
        });
    }

    // Utility methods
    private updateElement_Ad(id: string, value: string): void {
        const element = document.getElementById(id) as HTMLInputElement;
        if (element) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.value = value;
            } else {
                element.textContent = value;
            }
        }
    }

    private updateSelectByText_Ad(id: string, text: string): void {
        const select = document.getElementById(id) as HTMLSelectElement;
        if (select) {
            for (let i = 0; i < select.options.length; i++) {
                if (select.options[i].text === text) {
                    select.selectedIndex = i;
                    break;
                }
            }
        }
    }

    private generateStars_Ad(rating: number): string {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<span class="star">★</span>';
            } else {
                stars += '<span class="star empty">★</span>';
            }
        }
        return stars;
    }

    private formatDate_Ad(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    }

    private showLoading_Ad(): void {
        const loadingEl = document.getElementById('loadingIndicator');
        if (loadingEl) {
            loadingEl.classList.add('show');
        }
    }

    private hideLoading_Ad(): void {
        const loadingEl = document.getElementById('loadingIndicator');
        if (loadingEl) {
            loadingEl.classList.remove('show');
        }
    }

    private showError_Ad(message: string): void {
        const errorEl = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        if (errorEl && errorText) {
            errorText.textContent = message;
            errorEl.classList.add('show');
        }
        console.error('ChiTietSanPham_Ad Error:', message);
    }

    private updateStockStats_Ad(): void {
        const variantRows = document.querySelectorAll('#variantsTableBody tr');
        let totalStock = 0;

        variantRows.forEach(row => {
            const stockInput = row.querySelector('input[type="number"]') as HTMLInputElement;
            totalStock += parseInt(stockInput.value) || 0;
        });

        this.updateElement_Ad('totalStock', totalStock.toString());
    }

    // Public methods (được gọi từ HTML)
    public changeMainImage_Ad(thumbnail: HTMLImageElement): void {
        const mainImage = document.getElementById('mainImage') as HTMLImageElement;
        if (mainImage) {
            mainImage.src = thumbnail.src;
        }

        // Cập nhật trạng thái active
        document.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.classList.remove('active');
        });
        thumbnail.classList.add('active');
    }

    public async saveProduct_Ad(): Promise<void> {
        if (!this.sanPham) return;

        try {
            const ma_san_pham = (document.getElementById('productCode') as HTMLInputElement).value.trim();
            const ten_san_pham = (document.getElementById('productName') as HTMLInputElement).value.trim();
            const mo_ta = (document.getElementById('productDescription') as HTMLTextAreaElement).value.trim();
            const gia_ban = parseInt((document.getElementById('productPrice') as HTMLInputElement).value.trim());
            const ten_danh_muc = (document.getElementById('productCategory') as HTMLSelectElement).selectedOptions[0]?.text.trim() || '';
            const ten_thuong_hieu = (document.getElementById('productBrand') as HTMLSelectElement).selectedOptions[0]?.text.trim() || '';

            if (!ma_san_pham || !ten_san_pham || isNaN(gia_ban) || !ten_danh_muc || !ten_thuong_hieu) {
                alert('❌ Vui lòng điền đầy đủ thông tin sản phẩm!');
                return;
            }

            const productData = {
                ma_san_pham,
                ten_san_pham,
                mo_ta,
                gia_ban,
                ten_danh_muc,
                ten_thuong_hieu
            };

            const res = await fetch(`http://localhost:3000/api/san-pham/${this.sanPham.id}`, {
                method: 'PUT',
                headers: getAuthHeaders2(),
                body: JSON.stringify(productData)
            });

            if (res.ok) {
                alert('✅ Đã lưu thông tin sản phẩm thành công!\n\n' +
                    'Tên: ' + ten_san_pham + '\n' +
                    'Mã: ' + ma_san_pham + '\n' +
                    'Giá: ' + new Intl.NumberFormat('vi-VN').format(gia_ban) + ' VNĐ');
            } else {
                const { message } = await res.json();
                throw new Error(message || 'Lỗi khi lưu dữ liệu');
            }
        } catch (error) {
            console.error('Lỗi khi lưu sản phẩm:', error);
            alert('❌ Có lỗi xảy ra khi lưu sản phẩm\n' + (error as Error).message);
        }
    }

    public async deleteProduct_Ad(): Promise<void> {
        if (!this.sanPham || !this.sanPham.id) {
            alert('❌ Không tìm thấy sản phẩm để xóa!');
            return;
        }

        const confirmDelete = confirm('⚠️ Bạn có chắc muốn xóa sản phẩm này không?');
        if (!confirmDelete) return;

        try {
            const res = await fetch(`http://localhost:3000/api/san-pham/${this.sanPham.id}/soft-delete`, {
                headers: getAuthHeaders2(),
                method: 'PATCH'
            });

            if (res.ok) {
                alert('✅ Sản phẩm đã được xóa (ẩn) thành công!');
            } else {
                const contentType = res.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const { message } = await res.json();
                    throw new Error(message || 'Lỗi khi xóa sản phẩm');
                } else {
                    const text = await res.text();
                    console.error('Server trả HTML:', text);
                    throw new Error('❌ Máy chủ trả về dữ liệu không hợp lệ.');
                }
            }
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
            alert('❌ Có lỗi xảy ra khi xóa sản phẩm\n' + (error as Error).message);
        }

    }


    public resetForm_Ad(): void {
        if (confirm('Bạn có chắc muốn đặt lại tất cả thông tin?')) {
            this.loadSanPhamData_Ad(); // Reload dữ liệu gốc
            alert('🔄 Đã đặt lại thông tin sản phẩm!');
        }
    }

    public async deleteImage_Ad(): Promise<void> {
        const imgElement = document.getElementById("mainImage") as HTMLImageElement | null;
        if (!imgElement || !imgElement.src) {
            alert("Không tìm thấy ảnh để xóa.");
            return;
        }

        const duongDan = imgElement.src;

        try {
            const response = await fetch(`http://localhost:3000/api/hinh-anh-sp?duongDan=${encodeURIComponent(duongDan)}`, {
                headers: getAuthHeaders2(),
                method: 'DELETE',
            });

            const result = await response.json();

            if (result.success) {
                alert("🗑️ Xóa ảnh thành công!");
                this.loadSanPhamData_Ad();
            } else {
                alert(`❌ Lỗi: ${result.message}`);
            }
        } catch (error) {
            console.error("Lỗi khi gửi yêu cầu xóa ảnh:", error);
            alert("⚠️ Lỗi kết nối tới server.");
        }
    }


    private mauSacList: Array<{ id: string, ten: string }> = [];

    // Hàm load danh sách màu sắc (gọi trong init_Ad)
    private async loadMauSacListByProductId_Ad(): Promise<void> {
        try {
            const response = await fetch(`http://localhost:3000/api/mau-sac/${this.sanPhamId}`, {
                headers: getAuthHeaders2()
            });
            if (response.ok) {
                const data = await response.json();
                this.mauSacList = data.map((item: any) => ({
                    id: item.id,
                    ten: item._ten_Mau_Sac
                }));
            }
        } catch (error) {
            console.error('Lỗi khi load màu sắc:', error);
        }
    }

    // Hàm addImages_Ad() hoàn chỉnh
    public async addImages_Ad(): Promise<void> {
        if (!this.sanPham) {
            alert('❌ Chưa có thông tin sản phẩm!');
            return;
        }

        try {
            // Tạo modal upload
            const modal = this.createUploadModal_Ad();
            document.body.appendChild(modal);

            // Hiển thị modal
            modal.style.display = 'flex';

        } catch (error) {
            console.error('Lỗi khi mở upload:', error);
            alert('❌ Có lỗi xảy ra: ' + (error as Error).message);
        }
    }

    // Tạo modal upload
    private createUploadModal_Ad(): HTMLElement {
        const modal = document.createElement('div');
        modal.className = 'upload-modal';
        modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

        // Tạo options cho màu sắc
        const mauSacOptions = this.mauSacList.map(mau =>
            `<option value="${mau.id}">${mau.ten}</option>`
        ).join('');

        modal.innerHTML = `
        <div class="upload-content" style="
            background: white;
            padding: 30px;
            border-radius: 10px;
            width: 500px;
            max-width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="margin: 0; color: #333;">📷 Thêm Ảnh Sản Phẩm</h3>
                <button onclick="this.closest('.upload-modal').remove()" style="
                    background: #dc3545;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 5px;
                    cursor: pointer;
                ">✕</button>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Chọn Màu Sắc:</label>
                <select id="selectMauSac" style="
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    font-size: 14px;
                ">
                    <option value="">-- Chọn màu sắc --</option>
                    ${mauSacOptions}
                </select>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Chọn Ảnh:</label>
                <input type="file" id="imageFiles" multiple accept="image/*" style="
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    font-size: 14px;
                ">
                <small style="color: #666; display: block; margin-top: 5px;">
                    * Chấp nhận: JPG, PNG, GIF, WEBP. Tối đa 10 ảnh, mỗi ảnh ≤ 5MB
                </small>
            </div>

            <div id="imagePreview" style="
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-bottom: 20px;
                max-height: 200px;
                overflow-y: auto;
                padding: 10px;
                border: 1px dashed #ddd;
                border-radius: 5px;
            "></div>

            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button onclick="this.closest('.upload-modal').remove()" style="
                    background: #6c757d;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                ">Hủy</button>
                <button onclick="chiTietSanPhamManager_Ad.handleUpload_Ad(this)" style="
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                ">📤 Upload</button>
            </div>

            <div id="uploadProgress" style="
                margin-top: 15px;
                padding: 10px;
                background: #f8f9fa;
                border-radius: 5px;
                display: none;
            ">
                <div style="font-weight: bold; margin-bottom: 5px;">Đang upload...</div>
                <div style="background: #e9ecef; height: 20px; border-radius: 10px; overflow: hidden;">
                    <div id="progressBar" style="
                        background: #007bff;
                        height: 100%;
                        width: 0%;
                        transition: width 0.3s ease;
                    "></div>
                </div>
                <div id="progressText" style="font-size: 12px; margin-top: 5px;">0%</div>
            </div>
        </div>
    `;

        // Bind events
        const fileInput = modal.querySelector('#imageFiles') as HTMLInputElement;
        const preview = modal.querySelector('#imagePreview') as HTMLElement;

        fileInput.addEventListener('change', (e) => {
            this.showImagePreview_Ad(e.target as HTMLInputElement, preview);
        });

        return modal;
    }

    // Hiển thị preview ảnh
    private showImagePreview_Ad(input: HTMLInputElement, container: HTMLElement): void {
        container.innerHTML = '';

        if (!input.files || input.files.length === 0) return;

        if (input.files.length > 10) {
            alert('❌ Chỉ được chọn tối đa 10 ảnh!');
            input.value = '';
            return;
        }

        Array.from(input.files).forEach((file, index) => {
            if (file.size > 5 * 1024 * 1024) {
                alert(`❌ File "${file.name}" quá lớn (> 5MB)!`);
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target?.result as string;
                img.style.cssText = `
                width: 80px;
                height: 80px;
                object-fit: cover;
                border-radius: 5px;
                border: 2px solid #ddd;
            `;
                img.title = file.name;
                container.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    }

    // Xử lý upload
    public async handleUpload_Ad(button: HTMLButtonElement): Promise<void> {
        const modal = button.closest('.upload-modal') as HTMLElement;
        const mauSacSelect = modal.querySelector('#selectMauSac') as HTMLSelectElement;
        const fileInput = modal.querySelector('#imageFiles') as HTMLInputElement;
        const progressContainer = modal.querySelector('#uploadProgress') as HTMLElement;
        const progressBar = modal.querySelector('#progressBar') as HTMLElement;
        const progressText = modal.querySelector('#progressText') as HTMLElement;

        // Validate
        if (!mauSacSelect.value) {
            alert('❌ Vui lòng chọn màu sắc!');
            return;
        }

        if (!fileInput.files || fileInput.files.length === 0) {
            alert('❌ Vui lòng chọn ít nhất 1 ảnh!');
            return;
        }

        try {
            // Hiển thị progress
            progressContainer.style.display = 'block';
            button.disabled = true;
            button.textContent = 'Đang upload...';

            // Tạo FormData
            const formData = new FormData();
            formData.append('productId', this.sanPham!.id);
            formData.append('mauId', mauSacSelect.value);

            Array.from(fileInput.files).forEach(file => {
                formData.append('images', file);
            });

            // Upload với progress tracking
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percentComplete = Math.round((e.loaded / e.total) * 100);
                    progressBar.style.width = percentComplete + '%';
                    progressText.textContent = `${percentComplete}% (${e.loaded}/${e.total} bytes)`;
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    if (response.success) {
                        alert(`✅ ${response.message}`);
                        modal.remove();
                        // Reload ảnh sản phẩm
                        this.loadSanPhamData_Ad();
                    } else {
                        throw new Error(response.message);
                    }
                } else {
                    throw new Error(`HTTP ${xhr.status}: ${xhr.statusText}`);
                }
            });

            xhr.addEventListener('error', () => {
                throw new Error('Lỗi kết nối mạng');
            });

            xhr.open('POST', 'http://localhost:3000/api/hinh-anh-sp/upload');
            xhr.send(formData);

        } catch (error) {
            console.error('Lỗi upload:', error);
            alert('❌ Upload thất bại: ' + (error as Error).message);

            // Reset UI
            progressContainer.style.display = 'none';
            button.disabled = false;
            button.textContent = '📤 Upload';
        }
    }

    private createVariantModal_Ad(colors: any[], sizes: any[]): HTMLElement {
        const modal = document.createElement('div');
        modal.className = 'variant-modal';
        modal.innerHTML = `
            <div class="variant-modal-content">
                <div class="variant-modal-header">
                    <h3>➕ Thêm Biến Thể Mới</h3>
                    <button class="close-btn" onclick="this.closest('.variant-modal').remove()">✖</button>
                </div>
                
                <form id="addVariantForm" class="variant-form">
                    <div class="form-group">
                        <label for="variantColor">Màu sắc *</label>
                        <select id="variantColor" required>
                            <option value="">-- Chọn màu sắc --</option>
                            ${colors.map(color =>
            `<option value="${color._ten_Mau_Sac}" data-color="${color._ma_Mau}">
                                    ${color._ten_Mau_Sac}
                                </option>`
        ).join('')}
                        </select>
                        <div class="color-preview-container">
                            <div id="selectedColorPreview" class="color-preview-large"></div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="variantSize">Kích cỡ *</label>
                        <select id="variantSize" required>
                            <option value="">-- Chọn kích cỡ --</option>
                            ${sizes.map(size =>
            `<option value="${size._so_Kich_Co}">${size._so_Kich_Co}</option>`
        ).join('')}
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="variantStock">Số lượng tồn kho *</label>
                        <input type="number" id="variantStock" min="0" required placeholder="Nhập số lượng">
                        <small>Số lượng phải lớn hơn hoặc bằng 0</small>
                    </div>

                    <div class="variant-modal-actions">
                        <button type="button" class="btn modal-btn-cancel" onclick="this.closest('.variant-modal').remove()">
                            🚫 Hủy
                        </button>
                        <button type="submit" class="btn modal-btn-add">
                            ✅ Thêm Biến Thể
                        </button>
                    </div>
                </form>

                <div id="variantLoadingIndicator" class="variant-loading" style="display: none;">
                    <h4>🔄 Đang tạo biến thể...</h4>
                </div>
            </div>
        `;

        return modal;
    }

    // Hàm xử lý thay đổi màu sắc
    private handleColorChange_Ad(selectElement: HTMLSelectElement): void {
        const selectedOption = selectElement.selectedOptions[0];
        const colorPreview = document.getElementById('selectedColorPreview') as HTMLElement;

        if (selectedOption && selectedOption.dataset.color && colorPreview) {
            const colorCode = selectedOption.dataset.color; // Lấy từ ._ma_mau
            colorPreview.style.backgroundColor = colorCode;
            colorPreview.style.border = colorCode === '#FFFFFF' || colorCode.toLowerCase() === '#ffffff'
                ? '2px solid #ddd'
                : '2px solid #F19EDC';
        } else if (colorPreview) {
            colorPreview.style.backgroundColor = 'transparent';
            colorPreview.style.border = '2px dashed #ddd';
        }
    }

    // Hàm gửi dữ liệu tạo biến thể
    private async submitVariant_Ad(formData: FormData): Promise<boolean> {
        try {
            const productId = (document.getElementById('productId') as HTMLInputElement)?.value;

            if (!productId) {
                throw new Error('Không tìm thấy ID sản phẩm');
            }

            const variantData = {
                sanPhamId: productId,
                tenMau: formData.get('color'),
                soKichCo: formData.get('size'),
                soLuongTonKho: parseInt(formData.get('stock') as string)
            };

            const response = await fetch('http://localhost:3000/api/bien-the/', {
                method: 'POST',
                headers: getAuthHeaders2(),
                body: JSON.stringify(variantData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Lỗi khi tạo biến thể');
            }

            return true;
        } catch (error) {
            console.error('Lỗi khi gửi dữ liệu biến thể:', error);
            throw error;
        }
    }

    // Hàm chính để thêm biến thể
    public async addVariant_Ad(): Promise<void> {
        try {
            // Hiển thị loading
            const existingModal = document.querySelector('.variant-modal');
            if (existingModal) {
                existingModal.remove();
            }

            // Tải dữ liệu màu sắc và kích cỡ
            const [colors, sizes] = await Promise.all([
                this.fetchColors_Ad(),
                this.fetchSizes_Ad()
            ]);

            if (colors.length === 0 || sizes.length === 0) {
                alert('❌ Không thể tải dữ liệu màu sắc hoặc kích cỡ. Vui lòng thử lại!');
                return;
            }

            // Tạo và hiển thị modal
            const modal = this.createVariantModal_Ad(colors, sizes);
            document.body.appendChild(modal);

            // Xử lý sự kiện thay đổi màu
            const colorSelect = modal.querySelector('#variantColor') as HTMLSelectElement;
            colorSelect.addEventListener('change', () => {
                this.handleColorChange_Ad(colorSelect);
            });

            // Xử lý submit form
            const form = modal.querySelector('#addVariantForm') as HTMLFormElement;
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const formData = new FormData();
                const colorValue = (modal.querySelector('#variantColor') as HTMLSelectElement).value;
                const sizeValue = (modal.querySelector('#variantSize') as HTMLSelectElement).value;
                const stockValue = (modal.querySelector('#variantStock') as HTMLInputElement).value;

                if (!colorValue || !sizeValue || !stockValue) {
                    alert('⚠️ Vui lòng điền đầy đủ thông tin!');
                    return;
                }

                formData.append('color', colorValue);
                formData.append('size', sizeValue);
                formData.append('stock', stockValue);

                const loadingIndicator = modal.querySelector('#variantLoadingIndicator') as HTMLElement;
                const submitBtn = modal.querySelector('.modal-btn-add') as HTMLButtonElement;

                try {
                    // Hiển thị loading
                    loadingIndicator.style.display = 'block';
                    submitBtn.disabled = true;
                    submitBtn.textContent = '⏳ Đang xử lý...';

                    // Gửi dữ liệu
                    await this.submitVariant_Ad(formData);

                    // Thành công
                    alert('✅ Thêm biến thể thành công!');
                    modal.remove();

                    // Cập nhật lại bảng biến thể (nếu có hàm update)
                    if (typeof this.update_Ad === 'function') {
                        this.update_Ad();
                    }

                } catch (error) {
                    alert(`❌ Lỗi khi thêm biến thể: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
                } finally {
                    // Ẩn loading
                    loadingIndicator.style.display = 'none';
                    submitBtn.disabled = false;
                    submitBtn.textContent = '✅ Thêm Biến Thể';
                }
            });
            this.loadSanPhamData_Ad();

        } catch (error) {
            console.error('Lỗi trong addVariant_Ad:', error);
            alert('❌ Có lỗi xảy ra khi mở form thêm biến thể!');
        }
    }


    public async deleteVariant_Ad(button: HTMLButtonElement): Promise<void> {
        if (confirm('Bạn có chắc muốn xóa biến thể này?')) {
            const row = button.closest('tr');
            const variantId = row?.querySelector('input[data-variant-id]')?.getAttribute('data-variant-id');

            if (!variantId) {
                alert('Không tìm thấy ID biến thể.');
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/api/bien-the/${variantId}/soft-delete`, {
                    headers: getAuthHeaders2(),
                    method: 'PATCH'
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.message || 'Xóa ảo biến thể thất bại.');
                }

                if (row) {
                    row.remove(); // Hoặc có thể đánh dấu mờ biến thể thay vì remove, tùy UI
                    this.updateStockStats_Ad();
                    alert('🗑️ Đã xóa ảo biến thể!');
                }
            } catch (error: any) {
                console.error('Lỗi khi gọi API xóa ảo biến thể:', error);
                alert(`❌ Xóa thất bại: ${error.message}`);
            }
        }
    }

    public async update_Ad(): Promise<void> {
        try {
            const variantInputs = document.querySelectorAll('#variantsTableBody input[data-variant-id]') as NodeListOf<HTMLInputElement>;

            if (variantInputs.length === 0) {
                alert('❌ Không tìm thấy biến thể nào để cập nhật!');
                return;
            }

            // Tìm các biến thể có thay đổi
            const changedVariants: Array<{ id: string, newStock: number, oldStock: number }> = [];

            variantInputs.forEach(input => {
                const variantId = input.getAttribute('data-variant-id');
                const originalValue = this.originalStockData[variantId!];
                const newValue = parseInt(input.value) || 0;

                if (variantId && originalValue !== undefined && originalValue !== newValue) {
                    changedVariants.push({
                        id: variantId,
                        newStock: newValue,
                        oldStock: originalValue
                    });
                }
            });

            if (changedVariants.length === 0) {
                alert('ℹ️ Không có thay đổi nào cần cập nhật!');
                return;
            }

            // Hiển thị thông tin các thay đổi
            let confirmMessage = `🔄 Sẽ cập nhật ${changedVariants.length} biến thể:\n\n`;
            changedVariants.forEach((variant, index) => {
                confirmMessage += `${index + 1}. ID: ${variant.id}\n   ${variant.oldStock} → ${variant.newStock}\n\n`;
            });
            confirmMessage += 'Bạn có chắc muốn thực hiện cập nhật?';

            if (!confirm(confirmMessage)) {
                return;
            }

            // Hiển thị loading
            this.showLoading_Ad();

            // Cập nhật từng biến thể
            let successCount = 0;
            let errorCount = 0;
            const errors: string[] = [];

            for (const variant of changedVariants) {
                try {
                    const response = await fetch(`http://localhost:3000/api/bien-the/${variant.id}`, {
                        method: 'PUT',
                        headers: getAuthHeaders2(),
                        body: JSON.stringify({
                            so_luong_ton_kho: variant.newStock
                        })
                    });

                    if (response.ok) {
                        successCount++;
                        // Cập nhật lại giá trị gốc
                        this.originalStockData[variant.id] = variant.newStock;

                        // Cập nhật data-original-value trong DOM
                        const input = document.querySelector(`input[data-variant-id="${variant.id}"]`) as HTMLInputElement;
                        if (input) {
                            input.setAttribute('data-original-value', variant.newStock.toString());
                        }
                    } else {
                        const errorData = await response.json();
                        errorCount++;
                        errors.push(`ID ${variant.id}: ${errorData.message || 'Lỗi không xác định'}`);
                    }
                } catch (error) {
                    errorCount++;
                    errors.push(`ID ${variant.id}: ${(error as Error).message}`);
                    console.error(`Lỗi khi cập nhật biến thể ${variant.id}:`, error);
                }
            }

            // Cập nhật lại thống kê tồn kho
            this.updateStockStats_Ad();

            // Hiển thị kết quả
            let resultMessage = `📊 Kết quả cập nhật:\n\n`;
            resultMessage += `✅ Thành công: ${successCount} biến thể\n`;
            if (errorCount > 0) {
                resultMessage += `❌ Thất bại: ${errorCount} biến thể\n\n`;
                resultMessage += `Chi tiết lỗi:\n${errors.join('\n')}`;
            }

            alert(resultMessage);

        } catch (error) {
            console.error('Lỗi trong quá trình cập nhật:', error);
            alert('❌ Có lỗi xảy ra trong quá trình cập nhật: ' + (error as Error).message);
        } finally {
            this.hideLoading_Ad();
        }
    }

    public async deleteReview_Ad(button: HTMLButtonElement): Promise<void> {
        if (confirm('Bạn có chắc muốn xóa đánh giá này?')) {
            const reviewId = button.getAttribute('data-review-id');
            const reviewItem = button.closest('.review-item');

            if (!reviewId) {
                alert('Không tìm thấy ID đánh giá.');
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/api/danh-gia/${reviewId}`, {
                    headers: getAuthHeaders2(),
                    method: 'DELETE'
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.message || 'Xóa đánh giá thất bại.');
                }

                if (reviewItem) {
                    reviewItem.remove();
                    const remainingReviews = document.querySelectorAll('.review-item');
                    this.updateElement_Ad('totalReviews', remainingReviews.length.toString());
                    alert('🗑️ Đã xóa đánh giá!');
                }
            } catch (error: any) {
                console.error('Lỗi khi xóa đánh giá:', error);
                alert(`❌ Xóa thất bại: ${error.message}`);
            }
        }
    }

}

// Khởi tạo instance global
const chiTietSanPhamManager_Ad = new ChiTietSanPhamManager_Ad();

// Export để có thể sử dụng từ HTML
(window as any).chiTietSanPhamManager_Ad = chiTietSanPhamManager_Ad;