"use strict";
// ChiTietSanPham_Ad.ts - Simplified Version
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class ChiTietSanPhamManager_Ad {
    constructor() {
        this.sanPhamId = null;
        this.sanPham = null;
        this.originalStockData = {};
        this.mauSacList = [];
        // Tự động khởi tạo khi DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.init_Ad();
            });
        }
        else {
            this.init_Ad();
        }
    }
    init_Ad() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.getSanPhamIdFromUrl_Ad();
                // Load song song
                yield Promise.all([
                    this.loadMauSacListByProductId_Ad(),
                    this.sanPhamId ? this.loadSanPhamData_Ad() : Promise.resolve()
                ]);
                if (!this.sanPhamId) {
                    this.showError_Ad('Không tìm thấy ID sản phẩm');
                }
                this.bindEvents_Ad();
                console.log('🥿 ChiTietSanPham_Ad đã được khởi tạo thành công!');
            }
            catch (error) {
                console.error('Lỗi khởi tạo ChiTietSanPham_Ad:', error);
                this.showError_Ad('Có lỗi xảy ra khi khởi tạo');
            }
        });
    }
    getSanPhamIdFromUrl_Ad() {
        // Lấy ID từ URL params: ?id=xxx
        const urlParams = new URLSearchParams(window.location.search);
        this.sanPhamId = urlParams.get('id');
        console.log('🔍 ID sản phẩm từ URL:', this.sanPhamId);
    }
    loadSanPhamData_Ad() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.sanPhamId)
                return;
            try {
                this.showLoading_Ad();
                // Load dữ liệu song song
                const [sanPham, bienTheList, danhGiaList] = yield Promise.all([
                    this.fetchSanPhamById_Ad(this.sanPhamId),
                    this.fetchBienTheByProductId_Ad(this.sanPhamId),
                    this.fetchDanhGiaByProductId_Ad(this.sanPhamId)
                ]);
                if (sanPham) {
                    this.sanPham = sanPham;
                    yield this.initializeCategoriesAndBrands_Ad();
                    this.renderSanPhamInfo_Ad(sanPham);
                    this.renderBienTheTable_Ad(bienTheList);
                    this.renderDanhGiaList_Ad(danhGiaList);
                    this.updateStats_Ad(bienTheList, danhGiaList);
                }
                else {
                    this.showError_Ad('Không tìm thấy sản phẩm');
                }
            }
            catch (error) {
                console.error('Lỗi khi tải dữ liệu:', error);
                this.showError_Ad('Có lỗi xảy ra khi tải dữ liệu');
            }
            finally {
                this.hideLoading_Ad();
            }
        });
    }
    fetchSanPhamById_Ad(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const res = yield fetch(`http://localhost:3000/api/san-pham/${id}`);
                if (!res.ok)
                    return null;
                const p = yield res.json();
                return {
                    id: String(p._id),
                    ten_san_pham: p._ten_san_pham,
                    ma_san_pham: p._ma_san_pham,
                    gia_ban: p._gia_ban,
                    mo_ta: (_a = p._mo_ta) !== null && _a !== void 0 ? _a : '',
                    danh_muc: (_b = p._danh_muc) !== null && _b !== void 0 ? _b : '',
                    thuong_hieu: (_c = p._thuong_hieu) !== null && _c !== void 0 ? _c : '',
                    danh_sach_hinh_anh: (p._danh_sach_hinh_anh || []).map((img) => ({
                        id: String(img._id),
                        san_pham_id: String(img._san_pham_id),
                        duong_dan_hinh_anh: img._duong_dan_hinh_anh,
                    }))
                };
            }
            catch (_d) {
                return null;
            }
        });
    }
    // Hàm lấy danh sách màu sắc từ API
    fetchColors_Ad() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch('http://localhost:3000/api/mau-sac/');
                if (!response.ok) {
                    throw new Error('Không thể tải danh sách màu sắc');
                }
                const data = yield response.json();
                return data;
            }
            catch (error) {
                console.error('Lỗi khi tải màu sắc:', error);
                return [];
            }
        });
    }
    // Hàm lấy danh sách kích cỡ từ API
    fetchSizes_Ad() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch('http://localhost:3000/api/kich-co/');
                if (!response.ok) {
                    throw new Error('Không thể tải danh sách kích cỡ');
                }
                const data = yield response.json();
                return data;
            }
            catch (error) {
                console.error('Lỗi khi tải kích cỡ:', error);
                return [];
            }
        });
    }
    fetchBienTheByProductId_Ad(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield fetch(`http://localhost:3000/api/bien-the/san-pham/${productId}`);
                if (!res.ok)
                    return [];
                const data = yield res.json();
                return data.map((bt) => ({
                    id: String(bt._id),
                    san_pham_id: String(bt._san_pham_id),
                    mau_sac: bt._mau_sac,
                    kich_co: bt._kich_co,
                    ma_mau: bt._ma_mau,
                    so_luong_ton_kho: bt._so_luong_ton_kho
                }));
            }
            catch (_a) {
                return [];
            }
        });
    }
    fetchDanhGiaByProductId_Ad(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield fetch(`http://localhost:3000/api/san-pham/${productId}/danh-gia`);
                if (!res.ok)
                    return [];
                const data = yield res.json();
                return data.map((dg) => ({
                    id: String(dg._id),
                    san_pham_id: String(dg._san_pham_id),
                    ten_khach_hang: dg._ho_ten_nguoi_dung,
                    so_sao: dg._diem_danh_gia,
                    noi_dung: dg._noi_dung_danh_gia,
                    ngay_danh_gia: dg._ngay_tao
                }));
            }
            catch (_a) {
                return [];
            }
        });
    }
    // Hàm khởi tạo - load và render danh mục + thương hiệu (có thể dùng private nếu trong class)
    initializeCategoriesAndBrands_Ad() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Hiển thị loading
                const loadingIndicator = document.getElementById('loadingIndicator');
                if (loadingIndicator) {
                    loadingIndicator.style.display = 'block';
                }
                // Load danh mục
                const [danhMucsResponse, thuongHieusResponse] = yield Promise.all([
                    fetch('http://localhost:3000/api/danh-muc'),
                    fetch('http://localhost:3000/api/thuong-hieu')
                ]);
                if (!danhMucsResponse.ok || !thuongHieusResponse.ok) {
                    throw new Error('Lỗi khi gọi API');
                }
                const [danhMucs, thuongHieus] = yield Promise.all([
                    danhMucsResponse.json(),
                    thuongHieusResponse.json()
                ]);
                // Render danh mục
                const categorySelect = document.getElementById('productCategory');
                if (categorySelect) {
                    categorySelect.innerHTML = '<option value="">Chọn danh mục</option>';
                    danhMucs.forEach((danhMuc) => {
                        const option = document.createElement('option');
                        option.value = danhMuc._id;
                        option.textContent = danhMuc._ten_danh_muc;
                        categorySelect.appendChild(option);
                    });
                }
                // Render thương hiệu
                const brandSelect = document.getElementById('productBrand');
                if (brandSelect) {
                    brandSelect.innerHTML = '<option value="">Chọn thương hiệu</option>';
                    thuongHieus.forEach((thuongHieu) => {
                        const option = document.createElement('option');
                        option.value = thuongHieu._id;
                        option.textContent = thuongHieu._ten_thuong_hieu;
                        brandSelect.appendChild(option);
                    });
                }
                console.log(`Đã load ${danhMucs.length} danh mục và ${thuongHieus.length} thương hiệu`);
            }
            catch (error) {
                console.error('Lỗi khi khởi tạo danh mục và thương hiệu:', error);
                // Hiển thị thông báo lỗi
                const errorDiv = document.getElementById('errorMessage');
                const errorText = document.getElementById('errorText');
                if (errorDiv && errorText) {
                    errorText.textContent = 'Không thể tải danh mục và thương hiệu từ server';
                    errorDiv.style.display = 'block';
                }
            }
            finally {
                // Ẩn loading
                const loadingIndicator = document.getElementById('loadingIndicator');
                if (loadingIndicator) {
                    loadingIndicator.style.display = 'none';
                }
            }
        });
    }
    renderSanPhamInfo_Ad(sanPham) {
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
    renderImages_Ad(images) {
        if (images.length === 0)
            return;
        const mainImage = document.getElementById('mainImage');
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
    renderBienTheTable_Ad(bienTheList) {
        const tbody = document.getElementById('variantsTableBody');
        if (!tbody)
            return;
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
    renderDanhGiaList_Ad(danhGiaList) {
        const reviewsList = document.getElementById('reviewsList');
        if (!reviewsList)
            return;
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
    updateStats_Ad(bienTheList, danhGiaList) {
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
    bindEvents_Ad() {
        // Lắng nghe thay đổi tồn kho
        document.addEventListener('input', (e) => {
            const target = e.target;
            if (target.type === 'number' && target.closest('#variantsTableBody')) {
                this.updateStockStats_Ad();
            }
        });
    }
    // Utility methods
    updateElement_Ad(id, value) {
        const element = document.getElementById(id);
        if (element) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.value = value;
            }
            else {
                element.textContent = value;
            }
        }
    }
    updateSelectByText_Ad(id, text) {
        const select = document.getElementById(id);
        if (select) {
            for (let i = 0; i < select.options.length; i++) {
                if (select.options[i].text === text) {
                    select.selectedIndex = i;
                    break;
                }
            }
        }
    }
    generateStars_Ad(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<span class="star">★</span>';
            }
            else {
                stars += '<span class="star empty">★</span>';
            }
        }
        return stars;
    }
    formatDate_Ad(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    }
    showLoading_Ad() {
        const loadingEl = document.getElementById('loadingIndicator');
        if (loadingEl) {
            loadingEl.classList.add('show');
        }
    }
    hideLoading_Ad() {
        const loadingEl = document.getElementById('loadingIndicator');
        if (loadingEl) {
            loadingEl.classList.remove('show');
        }
    }
    showError_Ad(message) {
        const errorEl = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        if (errorEl && errorText) {
            errorText.textContent = message;
            errorEl.classList.add('show');
        }
        console.error('ChiTietSanPham_Ad Error:', message);
    }
    updateStockStats_Ad() {
        const variantRows = document.querySelectorAll('#variantsTableBody tr');
        let totalStock = 0;
        variantRows.forEach(row => {
            const stockInput = row.querySelector('input[type="number"]');
            totalStock += parseInt(stockInput.value) || 0;
        });
        this.updateElement_Ad('totalStock', totalStock.toString());
    }
    // Public methods (được gọi từ HTML)
    changeMainImage_Ad(thumbnail) {
        const mainImage = document.getElementById('mainImage');
        if (mainImage) {
            mainImage.src = thumbnail.src;
        }
        // Cập nhật trạng thái active
        document.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.classList.remove('active');
        });
        thumbnail.classList.add('active');
    }
    saveProduct_Ad() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!this.sanPham)
                return;
            try {
                const ma_san_pham = document.getElementById('productCode').value.trim();
                const ten_san_pham = document.getElementById('productName').value.trim();
                const mo_ta = document.getElementById('productDescription').value.trim();
                const gia_ban = parseInt(document.getElementById('productPrice').value.trim());
                const ten_danh_muc = ((_a = document.getElementById('productCategory').selectedOptions[0]) === null || _a === void 0 ? void 0 : _a.text.trim()) || '';
                const ten_thuong_hieu = ((_b = document.getElementById('productBrand').selectedOptions[0]) === null || _b === void 0 ? void 0 : _b.text.trim()) || '';
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
                const res = yield fetch(`http://localhost:3000/api/san-pham/${this.sanPham.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(productData)
                });
                if (res.ok) {
                    alert('✅ Đã lưu thông tin sản phẩm thành công!\n\n' +
                        'Tên: ' + ten_san_pham + '\n' +
                        'Mã: ' + ma_san_pham + '\n' +
                        'Giá: ' + new Intl.NumberFormat('vi-VN').format(gia_ban) + ' VNĐ');
                }
                else {
                    const { message } = yield res.json();
                    throw new Error(message || 'Lỗi khi lưu dữ liệu');
                }
            }
            catch (error) {
                console.error('Lỗi khi lưu sản phẩm:', error);
                alert('❌ Có lỗi xảy ra khi lưu sản phẩm\n' + error.message);
            }
        });
    }
    resetForm_Ad() {
        if (confirm('Bạn có chắc muốn đặt lại tất cả thông tin?')) {
            this.loadSanPhamData_Ad(); // Reload dữ liệu gốc
            alert('🔄 Đã đặt lại thông tin sản phẩm!');
        }
    }
    deleteImage_Ad() {
        return __awaiter(this, void 0, void 0, function* () {
            const imgElement = document.getElementById("mainImage");
            if (!imgElement || !imgElement.src) {
                alert("Không tìm thấy ảnh để xóa.");
                return;
            }
            const duongDan = imgElement.src;
            try {
                const response = yield fetch(`http://localhost:3000/api/hinh-anh-sp?duongDan=${encodeURIComponent(duongDan)}`, {
                    method: 'DELETE',
                });
                const result = yield response.json();
                if (result.success) {
                    alert("🗑️ Xóa ảnh thành công!");
                    this.loadSanPhamData_Ad();
                }
                else {
                    alert(`❌ Lỗi: ${result.message}`);
                }
            }
            catch (error) {
                console.error("Lỗi khi gửi yêu cầu xóa ảnh:", error);
                alert("⚠️ Lỗi kết nối tới server.");
            }
        });
    }
    // Hàm load danh sách màu sắc (gọi trong init_Ad)
    loadMauSacListByProductId_Ad() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`http://localhost:3000/api/mau-sac/${this.sanPhamId}`);
                if (response.ok) {
                    const data = yield response.json();
                    this.mauSacList = data.map((item) => ({
                        id: item.id,
                        ten: item._ten_Mau_Sac
                    }));
                }
            }
            catch (error) {
                console.error('Lỗi khi load màu sắc:', error);
            }
        });
    }
    // Hàm addImages_Ad() hoàn chỉnh
    addImages_Ad() {
        return __awaiter(this, void 0, void 0, function* () {
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
            }
            catch (error) {
                console.error('Lỗi khi mở upload:', error);
                alert('❌ Có lỗi xảy ra: ' + error.message);
            }
        });
    }
    // Tạo modal upload
    createUploadModal_Ad() {
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
        const mauSacOptions = this.mauSacList.map(mau => `<option value="${mau.id}">${mau.ten}</option>`).join('');
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
        const fileInput = modal.querySelector('#imageFiles');
        const preview = modal.querySelector('#imagePreview');
        fileInput.addEventListener('change', (e) => {
            this.showImagePreview_Ad(e.target, preview);
        });
        return modal;
    }
    // Hiển thị preview ảnh
    showImagePreview_Ad(input, container) {
        container.innerHTML = '';
        if (!input.files || input.files.length === 0)
            return;
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
                var _a;
                const img = document.createElement('img');
                img.src = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
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
    handleUpload_Ad(button) {
        return __awaiter(this, void 0, void 0, function* () {
            const modal = button.closest('.upload-modal');
            const mauSacSelect = modal.querySelector('#selectMauSac');
            const fileInput = modal.querySelector('#imageFiles');
            const progressContainer = modal.querySelector('#uploadProgress');
            const progressBar = modal.querySelector('#progressBar');
            const progressText = modal.querySelector('#progressText');
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
                formData.append('productId', this.sanPham.id);
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
                        }
                        else {
                            throw new Error(response.message);
                        }
                    }
                    else {
                        throw new Error(`HTTP ${xhr.status}: ${xhr.statusText}`);
                    }
                });
                xhr.addEventListener('error', () => {
                    throw new Error('Lỗi kết nối mạng');
                });
                xhr.open('POST', 'http://localhost:3000/api/hinh-anh-sp/upload');
                xhr.send(formData);
            }
            catch (error) {
                console.error('Lỗi upload:', error);
                alert('❌ Upload thất bại: ' + error.message);
                // Reset UI
                progressContainer.style.display = 'none';
                button.disabled = false;
                button.textContent = '📤 Upload';
            }
        });
    }
    createVariantModal_Ad(colors, sizes) {
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
                            ${colors.map(color => `<option value="${color._ten_Mau_Sac}" data-color="${color._ma_Mau}">
                                    ${color._ten_Mau_Sac}
                                </option>`).join('')}
                        </select>
                        <div class="color-preview-container">
                            <div id="selectedColorPreview" class="color-preview-large"></div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="variantSize">Kích cỡ *</label>
                        <select id="variantSize" required>
                            <option value="">-- Chọn kích cỡ --</option>
                            ${sizes.map(size => `<option value="${size._so_Kich_Co}">${size._so_Kich_Co}</option>`).join('')}
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
    handleColorChange_Ad(selectElement) {
        const selectedOption = selectElement.selectedOptions[0];
        const colorPreview = document.getElementById('selectedColorPreview');
        if (selectedOption && selectedOption.dataset.color && colorPreview) {
            const colorCode = selectedOption.dataset.color; // Lấy từ ._ma_mau
            colorPreview.style.backgroundColor = colorCode;
            colorPreview.style.border = colorCode === '#FFFFFF' || colorCode.toLowerCase() === '#ffffff'
                ? '2px solid #ddd'
                : '2px solid #F19EDC';
        }
        else if (colorPreview) {
            colorPreview.style.backgroundColor = 'transparent';
            colorPreview.style.border = '2px dashed #ddd';
        }
    }
    // Hàm gửi dữ liệu tạo biến thể
    submitVariant_Ad(formData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const productId = (_a = document.getElementById('productId')) === null || _a === void 0 ? void 0 : _a.value;
                if (!productId) {
                    throw new Error('Không tìm thấy ID sản phẩm');
                }
                const variantData = {
                    sanPhamId: productId,
                    tenMau: formData.get('color'),
                    soKichCo: formData.get('size'),
                    soLuongTonKho: parseInt(formData.get('stock'))
                };
                const response = yield fetch('http://localhost:3000/api/bien-the/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(variantData)
                });
                if (!response.ok) {
                    const errorData = yield response.json();
                    throw new Error(errorData.message || 'Lỗi khi tạo biến thể');
                }
                return true;
            }
            catch (error) {
                console.error('Lỗi khi gửi dữ liệu biến thể:', error);
                throw error;
            }
        });
    }
    // Hàm chính để thêm biến thể
    addVariant_Ad() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Hiển thị loading
                const existingModal = document.querySelector('.variant-modal');
                if (existingModal) {
                    existingModal.remove();
                }
                // Tải dữ liệu màu sắc và kích cỡ
                const [colors, sizes] = yield Promise.all([
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
                const colorSelect = modal.querySelector('#variantColor');
                colorSelect.addEventListener('change', () => {
                    this.handleColorChange_Ad(colorSelect);
                });
                // Xử lý submit form
                const form = modal.querySelector('#addVariantForm');
                form.addEventListener('submit', (e) => __awaiter(this, void 0, void 0, function* () {
                    e.preventDefault();
                    const formData = new FormData();
                    const colorValue = modal.querySelector('#variantColor').value;
                    const sizeValue = modal.querySelector('#variantSize').value;
                    const stockValue = modal.querySelector('#variantStock').value;
                    if (!colorValue || !sizeValue || !stockValue) {
                        alert('⚠️ Vui lòng điền đầy đủ thông tin!');
                        return;
                    }
                    formData.append('color', colorValue);
                    formData.append('size', sizeValue);
                    formData.append('stock', stockValue);
                    const loadingIndicator = modal.querySelector('#variantLoadingIndicator');
                    const submitBtn = modal.querySelector('.modal-btn-add');
                    try {
                        // Hiển thị loading
                        loadingIndicator.style.display = 'block';
                        submitBtn.disabled = true;
                        submitBtn.textContent = '⏳ Đang xử lý...';
                        // Gửi dữ liệu
                        yield this.submitVariant_Ad(formData);
                        // Thành công
                        alert('✅ Thêm biến thể thành công!');
                        modal.remove();
                        // Cập nhật lại bảng biến thể (nếu có hàm update)
                        if (typeof this.update_Ad === 'function') {
                            this.update_Ad();
                        }
                    }
                    catch (error) {
                        alert(`❌ Lỗi khi thêm biến thể: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
                    }
                    finally {
                        // Ẩn loading
                        loadingIndicator.style.display = 'none';
                        submitBtn.disabled = false;
                        submitBtn.textContent = '✅ Thêm Biến Thể';
                    }
                }));
                this.loadSanPhamData_Ad();
            }
            catch (error) {
                console.error('Lỗi trong addVariant_Ad:', error);
                alert('❌ Có lỗi xảy ra khi mở form thêm biến thể!');
            }
        });
    }
    deleteVariant_Ad(button) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (confirm('Bạn có chắc muốn xóa biến thể này?')) {
                const row = button.closest('tr');
                const variantId = (_a = row === null || row === void 0 ? void 0 : row.querySelector('input[data-variant-id]')) === null || _a === void 0 ? void 0 : _a.getAttribute('data-variant-id');
                if (!variantId) {
                    alert('Không tìm thấy ID biến thể.');
                    return;
                }
                try {
                    const response = yield fetch(`http://localhost:3000/api/bien-the/${variantId}`, {
                        method: 'DELETE'
                    });
                    if (!response.ok) {
                        const data = yield response.json();
                        throw new Error(data.message || 'Xóa biến thể thất bại.');
                    }
                    if (row) {
                        row.remove();
                        this.updateStockStats_Ad();
                        alert('🗑️ Đã xóa biến thể!');
                    }
                }
                catch (error) {
                    console.error('Lỗi khi gọi API xóa biến thể:', error);
                    alert(`❌ Xóa thất bại: ${error.message}`);
                }
            }
        });
    }
    update_Ad() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const variantInputs = document.querySelectorAll('#variantsTableBody input[data-variant-id]');
                if (variantInputs.length === 0) {
                    alert('❌ Không tìm thấy biến thể nào để cập nhật!');
                    return;
                }
                // Tìm các biến thể có thay đổi
                const changedVariants = [];
                variantInputs.forEach(input => {
                    const variantId = input.getAttribute('data-variant-id');
                    const originalValue = this.originalStockData[variantId];
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
                const errors = [];
                for (const variant of changedVariants) {
                    try {
                        const response = yield fetch(`http://localhost:3000/api/bien-the/${variant.id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                so_luong_ton_kho: variant.newStock
                            })
                        });
                        if (response.ok) {
                            successCount++;
                            // Cập nhật lại giá trị gốc
                            this.originalStockData[variant.id] = variant.newStock;
                            // Cập nhật data-original-value trong DOM
                            const input = document.querySelector(`input[data-variant-id="${variant.id}"]`);
                            if (input) {
                                input.setAttribute('data-original-value', variant.newStock.toString());
                            }
                        }
                        else {
                            const errorData = yield response.json();
                            errorCount++;
                            errors.push(`ID ${variant.id}: ${errorData.message || 'Lỗi không xác định'}`);
                        }
                    }
                    catch (error) {
                        errorCount++;
                        errors.push(`ID ${variant.id}: ${error.message}`);
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
            }
            catch (error) {
                console.error('Lỗi trong quá trình cập nhật:', error);
                alert('❌ Có lỗi xảy ra trong quá trình cập nhật: ' + error.message);
            }
            finally {
                this.hideLoading_Ad();
            }
        });
    }
    deleteReview_Ad(button) {
        return __awaiter(this, void 0, void 0, function* () {
            if (confirm('Bạn có chắc muốn xóa đánh giá này?')) {
                const reviewId = button.getAttribute('data-review-id');
                const reviewItem = button.closest('.review-item');
                if (!reviewId) {
                    alert('Không tìm thấy ID đánh giá.');
                    return;
                }
                try {
                    const response = yield fetch(`http://localhost:3000/api/danh-gia/${reviewId}`, {
                        method: 'DELETE'
                    });
                    if (!response.ok) {
                        const data = yield response.json();
                        throw new Error(data.message || 'Xóa đánh giá thất bại.');
                    }
                    if (reviewItem) {
                        reviewItem.remove();
                        const remainingReviews = document.querySelectorAll('.review-item');
                        this.updateElement_Ad('totalReviews', remainingReviews.length.toString());
                        alert('🗑️ Đã xóa đánh giá!');
                    }
                }
                catch (error) {
                    console.error('Lỗi khi xóa đánh giá:', error);
                    alert(`❌ Xóa thất bại: ${error.message}`);
                }
            }
        });
    }
}
// Khởi tạo instance global
const chiTietSanPhamManager_Ad = new ChiTietSanPhamManager_Ad();
// Export để có thể sử dụng từ HTML
window.chiTietSanPhamManager_Ad = chiTietSanPhamManager_Ad;
