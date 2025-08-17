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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var ChiTietSanPhamManager_Ad = /** @class */ (function () {
    function ChiTietSanPhamManager_Ad() {
        var _this = this;
        this.sanPhamId = null;
        this.sanPham = null;
        this.originalStockData = {};
        this.mauSacList = [];
        // Tự động khởi tạo khi DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function () { return __awaiter(_this, void 0, void 0, function () {
                var token, res, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            token = localStorage.getItem('token') || sessionStorage.getItem('token');
                            if (!token) {
                                sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
                                window.location.href = '/FE/HTML/DangNhap.html';
                                return [2 /*return*/];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, fetch("http://localhost:3000/api/nguoi-dung/me", {
                                    headers: { Authorization: "Bearer ".concat(token) }
                                })];
                        case 2:
                            res = _a.sent();
                            if (!res.ok) {
                                localStorage.removeItem('token');
                                sessionStorage.removeItem('token');
                                sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
                                window.location.href = '/FE/HTML/DangNhap.html';
                                return [2 /*return*/];
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
                            window.location.href = '/FE/HTML/DangNhap.html';
                            return [2 /*return*/];
                        case 4:
                            this.init_Ad();
                            return [2 /*return*/];
                    }
                });
            }); });
        }
        else {
            this.init_Ad();
        }
    }
    ChiTietSanPhamManager_Ad.prototype.init_Ad = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.getSanPhamIdFromUrl_Ad();
                        // Load song song
                        return [4 /*yield*/, Promise.all([
                                this.loadMauSacListByProductId_Ad(),
                                this.sanPhamId ? this.loadSanPhamData_Ad() : Promise.resolve()
                            ])];
                    case 1:
                        // Load song song
                        _a.sent();
                        if (!this.sanPhamId) {
                            this.showError_Ad('Không tìm thấy ID sản phẩm');
                        }
                        this.bindEvents_Ad();
                        console.log('🥿 ChiTietSanPham_Ad đã được khởi tạo thành công!');
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Lỗi khởi tạo ChiTietSanPham_Ad:', error_2);
                        this.showError_Ad('Có lỗi xảy ra khi khởi tạo');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChiTietSanPhamManager_Ad.prototype.getSanPhamIdFromUrl_Ad = function () {
        // Lấy ID từ URL params: ?id=xxx
        var urlParams = new URLSearchParams(window.location.search);
        this.sanPhamId = urlParams.get('id');
        console.log('🔍 ID sản phẩm từ URL:', this.sanPhamId);
    };
    ChiTietSanPhamManager_Ad.prototype.loadSanPhamData_Ad = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, sanPham, bienTheList, danhGiaList, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.sanPhamId)
                            return [2 /*return*/];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 8]);
                        this.showLoading_Ad();
                        return [4 /*yield*/, Promise.all([
                                this.fetchSanPhamById_Ad(this.sanPhamId),
                                this.fetchBienTheByProductId_Ad(this.sanPhamId),
                                this.fetchDanhGiaByProductId_Ad(this.sanPhamId)
                            ])];
                    case 2:
                        _a = _b.sent(), sanPham = _a[0], bienTheList = _a[1], danhGiaList = _a[2];
                        if (!sanPham) return [3 /*break*/, 4];
                        this.sanPham = sanPham;
                        return [4 /*yield*/, this.initializeCategoriesAndBrands_Ad()];
                    case 3:
                        _b.sent();
                        this.renderSanPhamInfo_Ad(sanPham);
                        this.renderBienTheTable_Ad(bienTheList);
                        this.renderDanhGiaList_Ad(danhGiaList);
                        this.updateStats_Ad(bienTheList, danhGiaList);
                        return [3 /*break*/, 5];
                    case 4:
                        this.showError_Ad('Không tìm thấy sản phẩm');
                        _b.label = 5;
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        error_3 = _b.sent();
                        console.error('Lỗi khi tải dữ liệu:', error_3);
                        this.showError_Ad('Có lỗi xảy ra khi tải dữ liệu');
                        return [3 /*break*/, 8];
                    case 7:
                        this.hideLoading_Ad();
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    ChiTietSanPhamManager_Ad.prototype.fetchSanPhamById_Ad = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var res, p, _a;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch("http://localhost:3000/api/san-pham/".concat(id))];
                    case 1:
                        res = _e.sent();
                        if (!res.ok)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, res.json()];
                    case 2:
                        p = _e.sent();
                        return [2 /*return*/, {
                                id: String(p._id),
                                ten_san_pham: p._ten_san_pham,
                                ma_san_pham: p._ma_san_pham,
                                gia_ban: p._gia_ban,
                                mo_ta: (_b = p._mo_ta) !== null && _b !== void 0 ? _b : '',
                                danh_muc: (_c = p._danh_muc) !== null && _c !== void 0 ? _c : '',
                                thuong_hieu: (_d = p._thuong_hieu) !== null && _d !== void 0 ? _d : '',
                                danh_sach_hinh_anh: (p._danh_sach_hinh_anh || []).map(function (img) { return ({
                                    id: String(img._id),
                                    san_pham_id: String(img._san_pham_id),
                                    duong_dan_hinh_anh: img._duong_dan_hinh_anh,
                                }); })
                            }];
                    case 3:
                        _a = _e.sent();
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Hàm lấy danh sách màu sắc từ API
    ChiTietSanPhamManager_Ad.prototype.fetchColors_Ad = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, data, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch('http://localhost:3000/api/mau-sac/')];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error('Không thể tải danh sách màu sắc');
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 3:
                        error_4 = _a.sent();
                        console.error('Lỗi khi tải màu sắc:', error_4);
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Hàm lấy danh sách kích cỡ từ API
    ChiTietSanPhamManager_Ad.prototype.fetchSizes_Ad = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, data, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch('http://localhost:3000/api/kich-co/')];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error('Không thể tải danh sách kích cỡ');
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 3:
                        error_5 = _a.sent();
                        console.error('Lỗi khi tải kích cỡ:', error_5);
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ChiTietSanPhamManager_Ad.prototype.fetchBienTheByProductId_Ad = function (productId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch("http://localhost:3000/api/bien-the/san-pham/".concat(productId))];
                    case 1:
                        res = _b.sent();
                        if (!res.ok)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, res.json()];
                    case 2:
                        data = _b.sent();
                        return [2 /*return*/, data.map(function (bt) { return ({
                                id: String(bt._id),
                                san_pham_id: String(bt._san_pham_id),
                                mau_sac: bt._mau_sac,
                                kich_co: bt._kich_co,
                                ma_mau: bt._ma_mau,
                                so_luong_ton_kho: bt._so_luong_ton_kho
                            }); })];
                    case 3:
                        _a = _b.sent();
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ChiTietSanPhamManager_Ad.prototype.fetchDanhGiaByProductId_Ad = function (productId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch("http://localhost:3000/api/san-pham/".concat(productId, "/danh-gia"))];
                    case 1:
                        res = _b.sent();
                        if (!res.ok)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, res.json()];
                    case 2:
                        data = _b.sent();
                        return [2 /*return*/, data.map(function (dg) { return ({
                                id: String(dg._id),
                                san_pham_id: String(dg._san_pham_id),
                                ten_khach_hang: dg._ho_ten_nguoi_dung,
                                so_sao: dg._diem_danh_gia,
                                noi_dung: dg._noi_dung_danh_gia,
                                ngay_danh_gia: dg._ngay_tao
                            }); })];
                    case 3:
                        _a = _b.sent();
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Hàm khởi tạo - load và render danh mục + thương hiệu (có thể dùng private nếu trong class)
    ChiTietSanPhamManager_Ad.prototype.initializeCategoriesAndBrands_Ad = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loadingIndicator, _a, danhMucsResponse, thuongHieusResponse, _b, danhMucs, thuongHieus, categorySelect_1, brandSelect_1, error_6, errorDiv, errorText, loadingIndicator;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, 4, 5]);
                        loadingIndicator = document.getElementById('loadingIndicator');
                        if (loadingIndicator) {
                            loadingIndicator.style.display = 'block';
                        }
                        return [4 /*yield*/, Promise.all([
                                fetch('http://localhost:3000/api/danh-muc'),
                                fetch('http://localhost:3000/api/thuong-hieu')
                            ])];
                    case 1:
                        _a = _c.sent(), danhMucsResponse = _a[0], thuongHieusResponse = _a[1];
                        if (!danhMucsResponse.ok || !thuongHieusResponse.ok) {
                            throw new Error('Lỗi khi gọi API');
                        }
                        return [4 /*yield*/, Promise.all([
                                danhMucsResponse.json(),
                                thuongHieusResponse.json()
                            ])];
                    case 2:
                        _b = _c.sent(), danhMucs = _b[0], thuongHieus = _b[1];
                        categorySelect_1 = document.getElementById('productCategory');
                        if (categorySelect_1) {
                            categorySelect_1.innerHTML = '<option value="">Chọn danh mục</option>';
                            danhMucs.forEach(function (danhMuc) {
                                var option = document.createElement('option');
                                option.value = danhMuc._id;
                                option.textContent = danhMuc._ten_danh_muc;
                                categorySelect_1.appendChild(option);
                            });
                        }
                        brandSelect_1 = document.getElementById('productBrand');
                        if (brandSelect_1) {
                            brandSelect_1.innerHTML = '<option value="">Chọn thương hiệu</option>';
                            thuongHieus.forEach(function (thuongHieu) {
                                var option = document.createElement('option');
                                option.value = thuongHieu._id;
                                option.textContent = thuongHieu._ten_thuong_hieu;
                                brandSelect_1.appendChild(option);
                            });
                        }
                        console.log("\u0110\u00E3 load ".concat(danhMucs.length, " danh m\u1EE5c v\u00E0 ").concat(thuongHieus.length, " th\u01B0\u01A1ng hi\u1EC7u"));
                        return [3 /*break*/, 5];
                    case 3:
                        error_6 = _c.sent();
                        console.error('Lỗi khi khởi tạo danh mục và thương hiệu:', error_6);
                        errorDiv = document.getElementById('errorMessage');
                        errorText = document.getElementById('errorText');
                        if (errorDiv && errorText) {
                            errorText.textContent = 'Không thể tải danh mục và thương hiệu từ server';
                            errorDiv.style.display = 'block';
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        loadingIndicator = document.getElementById('loadingIndicator');
                        if (loadingIndicator) {
                            loadingIndicator.style.display = 'none';
                        }
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ChiTietSanPhamManager_Ad.prototype.renderSanPhamInfo_Ad = function (sanPham) {
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
    };
    ChiTietSanPhamManager_Ad.prototype.renderImages_Ad = function (images) {
        var _this = this;
        if (images.length === 0)
            return;
        var mainImage = document.getElementById('mainImage');
        var imageGallery = document.querySelector('.image-gallery');
        if (mainImage && images[0]) {
            mainImage.src = images[0].duong_dan_hinh_anh;
        }
        if (imageGallery) {
            imageGallery.innerHTML = '';
            images.forEach(function (img, index) {
                var thumbnail = document.createElement('img');
                thumbnail.src = img.duong_dan_hinh_anh;
                thumbnail.alt = "\u1EA2nh ".concat(index + 1);
                thumbnail.className = "thumbnail ".concat(index === 0 ? 'active' : '');
                thumbnail.onclick = function () { return _this.changeMainImage_Ad(thumbnail); };
                imageGallery.appendChild(thumbnail);
            });
        }
    };
    ChiTietSanPhamManager_Ad.prototype.renderBienTheTable_Ad = function (bienTheList) {
        var _this = this;
        var tbody = document.getElementById('variantsTableBody');
        if (!tbody)
            return;
        // Clear dữ liệu gốc trước khi render
        this.originalStockData = {};
        tbody.innerHTML = '';
        bienTheList.forEach(function (bt) {
            // Lưu số lượng gốc
            _this.originalStockData[bt.id] = bt.so_luong_ton_kho;
            var row = document.createElement('tr');
            row.innerHTML = "\n            <td>".concat(bt.id, "</td>\n            <td><span class=\"color-preview\" style=\"background-color: ").concat(bt.ma_mau, ";\"></span>").concat(bt.mau_sac, "</td>\n            <td>").concat(bt.kich_co, "</td>\n            <td><input type=\"number\" value=\"").concat(bt.so_luong_ton_kho, "\" min=\"0\" style=\"width: 80px; padding: 5px;\" data-variant-id=\"").concat(bt.id, "\" data-original-value=\"").concat(bt.so_luong_ton_kho, "\"></td>\n            <td>\n                <button class=\"btn btn-danger\" onclick=\"chiTietSanPhamManager_Ad.deleteVariant_Ad(this)\" style=\"padding: 5px 10px; font-size: 12px;\">\uD83D\uDDD1\uFE0F</button>\n            </td>\n        ");
            tbody.appendChild(row);
        });
    };
    ChiTietSanPhamManager_Ad.prototype.renderDanhGiaList_Ad = function (danhGiaList) {
        var _this = this;
        var reviewsList = document.getElementById('reviewsList');
        if (!reviewsList)
            return;
        reviewsList.innerHTML = '';
        danhGiaList.forEach(function (dg) {
            var reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';
            reviewItem.innerHTML = "\n                <div class=\"review-header\">\n                    <div>\n                        <div class=\"review-user\">\uD83D\uDC64 ".concat(dg.ten_khach_hang, "</div>\n                        <div class=\"rating\">\n                            ").concat(_this.generateStars_Ad(dg.so_sao), "\n                        </div>\n                    </div>\n                    <div>\n                        <div class=\"review-date\">").concat(_this.formatDate_Ad(dg.ngay_danh_gia), "</div>\n                        <button class=\"btn btn-danger\" onclick=\"chiTietSanPhamManager_Ad.deleteReview_Ad(this)\" data-review-id=\"").concat(dg.id, "\" style=\"padding: 5px 10px; font-size: 12px; margin-top: 5px;\">\uD83D\uDDD1\uFE0F X\u00F3a</button>\n                    </div>\n                </div>\n                <div class=\"review-content\">\n                    ").concat(dg.noi_dung, "\n                </div>\n            ");
            reviewsList.appendChild(reviewItem);
        });
    };
    ChiTietSanPhamManager_Ad.prototype.updateStats_Ad = function (bienTheList, danhGiaList) {
        var totalVariants = bienTheList.length;
        var totalStock = bienTheList.reduce(function (sum, bt) { return sum + bt.so_luong_ton_kho; }, 0);
        var avgRating = danhGiaList.length > 0
            ? (danhGiaList.reduce(function (sum, dg) { return sum + dg.so_sao; }, 0) / danhGiaList.length).toFixed(1)
            : '0';
        var totalReviews = danhGiaList.length;
        this.updateElement_Ad('totalVariants', totalVariants.toString());
        this.updateElement_Ad('totalStock', totalStock.toString());
        this.updateElement_Ad('avgRating', avgRating);
        this.updateElement_Ad('totalReviews', totalReviews.toString());
    };
    ChiTietSanPhamManager_Ad.prototype.bindEvents_Ad = function () {
        var _this = this;
        // Lắng nghe thay đổi tồn kho
        document.addEventListener('input', function (e) {
            var target = e.target;
            if (target.type === 'number' && target.closest('#variantsTableBody')) {
                _this.updateStockStats_Ad();
            }
        });
    };
    // Utility methods
    ChiTietSanPhamManager_Ad.prototype.updateElement_Ad = function (id, value) {
        var element = document.getElementById(id);
        if (element) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.value = value;
            }
            else {
                element.textContent = value;
            }
        }
    };
    ChiTietSanPhamManager_Ad.prototype.updateSelectByText_Ad = function (id, text) {
        var select = document.getElementById(id);
        if (select) {
            for (var i = 0; i < select.options.length; i++) {
                if (select.options[i].text === text) {
                    select.selectedIndex = i;
                    break;
                }
            }
        }
    };
    ChiTietSanPhamManager_Ad.prototype.generateStars_Ad = function (rating) {
        var stars = '';
        for (var i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<span class="star">★</span>';
            }
            else {
                stars += '<span class="star empty">★</span>';
            }
        }
        return stars;
    };
    ChiTietSanPhamManager_Ad.prototype.formatDate_Ad = function (dateString) {
        var date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };
    ChiTietSanPhamManager_Ad.prototype.showLoading_Ad = function () {
        var loadingEl = document.getElementById('loadingIndicator');
        if (loadingEl) {
            loadingEl.classList.add('show');
        }
    };
    ChiTietSanPhamManager_Ad.prototype.hideLoading_Ad = function () {
        var loadingEl = document.getElementById('loadingIndicator');
        if (loadingEl) {
            loadingEl.classList.remove('show');
        }
    };
    ChiTietSanPhamManager_Ad.prototype.showError_Ad = function (message) {
        var errorEl = document.getElementById('errorMessage');
        var errorText = document.getElementById('errorText');
        if (errorEl && errorText) {
            errorText.textContent = message;
            errorEl.classList.add('show');
        }
        console.error('ChiTietSanPham_Ad Error:', message);
    };
    ChiTietSanPhamManager_Ad.prototype.updateStockStats_Ad = function () {
        var variantRows = document.querySelectorAll('#variantsTableBody tr');
        var totalStock = 0;
        variantRows.forEach(function (row) {
            var stockInput = row.querySelector('input[type="number"]');
            totalStock += parseInt(stockInput.value) || 0;
        });
        this.updateElement_Ad('totalStock', totalStock.toString());
    };
    // Public methods (được gọi từ HTML)
    ChiTietSanPhamManager_Ad.prototype.changeMainImage_Ad = function (thumbnail) {
        var mainImage = document.getElementById('mainImage');
        if (mainImage) {
            mainImage.src = thumbnail.src;
        }
        // Cập nhật trạng thái active
        document.querySelectorAll('.thumbnail').forEach(function (thumb) {
            thumb.classList.remove('active');
        });
        thumbnail.classList.add('active');
    };
    ChiTietSanPhamManager_Ad.prototype.saveProduct_Ad = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ma_san_pham, ten_san_pham, mo_ta, gia_ban, ten_danh_muc, ten_thuong_hieu, productData, res, message, error_7;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!this.sanPham)
                            return [2 /*return*/];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 6, , 7]);
                        ma_san_pham = document.getElementById('productCode').value.trim();
                        ten_san_pham = document.getElementById('productName').value.trim();
                        mo_ta = document.getElementById('productDescription').value.trim();
                        gia_ban = parseInt(document.getElementById('productPrice').value.trim());
                        ten_danh_muc = ((_a = document.getElementById('productCategory').selectedOptions[0]) === null || _a === void 0 ? void 0 : _a.text.trim()) || '';
                        ten_thuong_hieu = ((_b = document.getElementById('productBrand').selectedOptions[0]) === null || _b === void 0 ? void 0 : _b.text.trim()) || '';
                        if (!ma_san_pham || !ten_san_pham || isNaN(gia_ban) || !ten_danh_muc || !ten_thuong_hieu) {
                            alert('❌ Vui lòng điền đầy đủ thông tin sản phẩm!');
                            return [2 /*return*/];
                        }
                        productData = {
                            ma_san_pham: ma_san_pham,
                            ten_san_pham: ten_san_pham,
                            mo_ta: mo_ta,
                            gia_ban: gia_ban,
                            ten_danh_muc: ten_danh_muc,
                            ten_thuong_hieu: ten_thuong_hieu
                        };
                        return [4 /*yield*/, fetch("http://localhost:3000/api/san-pham/".concat(this.sanPham.id), {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(productData)
                            })];
                    case 2:
                        res = _c.sent();
                        if (!res.ok) return [3 /*break*/, 3];
                        alert('✅ Đã lưu thông tin sản phẩm thành công!\n\n' +
                            'Tên: ' + ten_san_pham + '\n' +
                            'Mã: ' + ma_san_pham + '\n' +
                            'Giá: ' + new Intl.NumberFormat('vi-VN').format(gia_ban) + ' VNĐ');
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, res.json()];
                    case 4:
                        message = (_c.sent()).message;
                        throw new Error(message || 'Lỗi khi lưu dữ liệu');
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_7 = _c.sent();
                        console.error('Lỗi khi lưu sản phẩm:', error_7);
                        alert('❌ Có lỗi xảy ra khi lưu sản phẩm\n' + error_7.message);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    ChiTietSanPhamManager_Ad.prototype.deleteProduct_Ad = function () {
        return __awaiter(this, void 0, void 0, function () {
            var confirmDelete, res, contentType, message, text, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.sanPham || !this.sanPham.id) {
                            alert('❌ Không tìm thấy sản phẩm để xóa!');
                            return [2 /*return*/];
                        }
                        confirmDelete = confirm('⚠️ Bạn có chắc muốn xóa sản phẩm này không?');
                        if (!confirmDelete)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        return [4 /*yield*/, fetch("http://localhost:3000/api/san-pham/".concat(this.sanPham.id, "/soft-delete"), {
                                method: 'PATCH'
                            })];
                    case 2:
                        res = _a.sent();
                        if (!res.ok) return [3 /*break*/, 3];
                        alert('✅ Sản phẩm đã được xóa (ẩn) thành công!');
                        return [3 /*break*/, 7];
                    case 3:
                        contentType = res.headers.get("content-type");
                        if (!(contentType && contentType.includes("application/json"))) return [3 /*break*/, 5];
                        return [4 /*yield*/, res.json()];
                    case 4:
                        message = (_a.sent()).message;
                        throw new Error(message || 'Lỗi khi xóa sản phẩm');
                    case 5: return [4 /*yield*/, res.text()];
                    case 6:
                        text = _a.sent();
                        console.error('Server trả HTML:', text);
                        throw new Error('❌ Máy chủ trả về dữ liệu không hợp lệ.');
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        error_8 = _a.sent();
                        console.error('Lỗi khi xóa sản phẩm:', error_8);
                        alert('❌ Có lỗi xảy ra khi xóa sản phẩm\n' + error_8.message);
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    ChiTietSanPhamManager_Ad.prototype.resetForm_Ad = function () {
        if (confirm('Bạn có chắc muốn đặt lại tất cả thông tin?')) {
            this.loadSanPhamData_Ad(); // Reload dữ liệu gốc
            alert('🔄 Đã đặt lại thông tin sản phẩm!');
        }
    };
    ChiTietSanPhamManager_Ad.prototype.deleteImage_Ad = function () {
        return __awaiter(this, void 0, void 0, function () {
            var imgElement, duongDan, response, result, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        imgElement = document.getElementById("mainImage");
                        if (!imgElement || !imgElement.src) {
                            alert("Không tìm thấy ảnh để xóa.");
                            return [2 /*return*/];
                        }
                        duongDan = imgElement.src;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetch("http://localhost:3000/api/hinh-anh-sp?duongDan=".concat(encodeURIComponent(duongDan)), {
                                method: 'DELETE',
                            })];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        result = _a.sent();
                        if (result.success) {
                            alert("🗑️ Xóa ảnh thành công!");
                            this.loadSanPhamData_Ad();
                        }
                        else {
                            alert("\u274C L\u1ED7i: ".concat(result.message));
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_9 = _a.sent();
                        console.error("Lỗi khi gửi yêu cầu xóa ảnh:", error_9);
                        alert("⚠️ Lỗi kết nối tới server.");
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // Hàm load danh sách màu sắc (gọi trong init_Ad)
    ChiTietSanPhamManager_Ad.prototype.loadMauSacListByProductId_Ad = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, data, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, fetch("http://localhost:3000/api/mau-sac/".concat(this.sanPhamId))];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        this.mauSacList = data.map(function (item) { return ({
                            id: item.id,
                            ten: item._ten_Mau_Sac
                        }); });
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_10 = _a.sent();
                        console.error('Lỗi khi load màu sắc:', error_10);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // Hàm addImages_Ad() hoàn chỉnh
    ChiTietSanPhamManager_Ad.prototype.addImages_Ad = function () {
        return __awaiter(this, void 0, void 0, function () {
            var modal;
            return __generator(this, function (_a) {
                if (!this.sanPham) {
                    alert('❌ Chưa có thông tin sản phẩm!');
                    return [2 /*return*/];
                }
                try {
                    modal = this.createUploadModal_Ad();
                    document.body.appendChild(modal);
                    // Hiển thị modal
                    modal.style.display = 'flex';
                }
                catch (error) {
                    console.error('Lỗi khi mở upload:', error);
                    alert('❌ Có lỗi xảy ra: ' + error.message);
                }
                return [2 /*return*/];
            });
        });
    };
    // Tạo modal upload
    ChiTietSanPhamManager_Ad.prototype.createUploadModal_Ad = function () {
        var _this = this;
        var modal = document.createElement('div');
        modal.className = 'upload-modal';
        modal.style.cssText = "\n        position: fixed;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        background: rgba(0,0,0,0.5);\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        z-index: 1000;\n    ";
        // Tạo options cho màu sắc
        var mauSacOptions = this.mauSacList.map(function (mau) {
            return "<option value=\"".concat(mau.id, "\">").concat(mau.ten, "</option>");
        }).join('');
        modal.innerHTML = "\n        <div class=\"upload-content\" style=\"\n            background: white;\n            padding: 30px;\n            border-radius: 10px;\n            width: 500px;\n            max-width: 90%;\n            max-height: 80vh;\n            overflow-y: auto;\n        \">\n            <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;\">\n                <h3 style=\"margin: 0; color: #333;\">\uD83D\uDCF7 Th\u00EAm \u1EA2nh S\u1EA3n Ph\u1EA9m</h3>\n                <button onclick=\"this.closest('.upload-modal').remove()\" style=\"\n                    background: #dc3545;\n                    color: white;\n                    border: none;\n                    padding: 5px 10px;\n                    border-radius: 5px;\n                    cursor: pointer;\n                \">\u2715</button>\n            </div>\n\n            <div style=\"margin-bottom: 20px;\">\n                <label style=\"display: block; margin-bottom: 5px; font-weight: bold;\">Ch\u1ECDn M\u00E0u S\u1EAFc:</label>\n                <select id=\"selectMauSac\" style=\"\n                    width: 100%;\n                    padding: 10px;\n                    border: 1px solid #ddd;\n                    border-radius: 5px;\n                    font-size: 14px;\n                \">\n                    <option value=\"\">-- Ch\u1ECDn m\u00E0u s\u1EAFc --</option>\n                    ".concat(mauSacOptions, "\n                </select>\n            </div>\n\n            <div style=\"margin-bottom: 20px;\">\n                <label style=\"display: block; margin-bottom: 5px; font-weight: bold;\">Ch\u1ECDn \u1EA2nh:</label>\n                <input type=\"file\" id=\"imageFiles\" multiple accept=\"image/*\" style=\"\n                    width: 100%;\n                    padding: 10px;\n                    border: 1px solid #ddd;\n                    border-radius: 5px;\n                    font-size: 14px;\n                \">\n                <small style=\"color: #666; display: block; margin-top: 5px;\">\n                    * Ch\u1EA5p nh\u1EADn: JPG, PNG, GIF, WEBP. T\u1ED1i \u0111a 10 \u1EA3nh, m\u1ED7i \u1EA3nh \u2264 5MB\n                </small>\n            </div>\n\n            <div id=\"imagePreview\" style=\"\n                display: flex;\n                flex-wrap: wrap;\n                gap: 10px;\n                margin-bottom: 20px;\n                max-height: 200px;\n                overflow-y: auto;\n                padding: 10px;\n                border: 1px dashed #ddd;\n                border-radius: 5px;\n            \"></div>\n\n            <div style=\"display: flex; gap: 10px; justify-content: flex-end;\">\n                <button onclick=\"this.closest('.upload-modal').remove()\" style=\"\n                    background: #6c757d;\n                    color: white;\n                    border: none;\n                    padding: 10px 20px;\n                    border-radius: 5px;\n                    cursor: pointer;\n                \">H\u1EE7y</button>\n                <button onclick=\"chiTietSanPhamManager_Ad.handleUpload_Ad(this)\" style=\"\n                    background: #007bff;\n                    color: white;\n                    border: none;\n                    padding: 10px 20px;\n                    border-radius: 5px;\n                    cursor: pointer;\n                \">\uD83D\uDCE4 Upload</button>\n            </div>\n\n            <div id=\"uploadProgress\" style=\"\n                margin-top: 15px;\n                padding: 10px;\n                background: #f8f9fa;\n                border-radius: 5px;\n                display: none;\n            \">\n                <div style=\"font-weight: bold; margin-bottom: 5px;\">\u0110ang upload...</div>\n                <div style=\"background: #e9ecef; height: 20px; border-radius: 10px; overflow: hidden;\">\n                    <div id=\"progressBar\" style=\"\n                        background: #007bff;\n                        height: 100%;\n                        width: 0%;\n                        transition: width 0.3s ease;\n                    \"></div>\n                </div>\n                <div id=\"progressText\" style=\"font-size: 12px; margin-top: 5px;\">0%</div>\n            </div>\n        </div>\n    ");
        // Bind events
        var fileInput = modal.querySelector('#imageFiles');
        var preview = modal.querySelector('#imagePreview');
        fileInput.addEventListener('change', function (e) {
            _this.showImagePreview_Ad(e.target, preview);
        });
        return modal;
    };
    // Hiển thị preview ảnh
    ChiTietSanPhamManager_Ad.prototype.showImagePreview_Ad = function (input, container) {
        container.innerHTML = '';
        if (!input.files || input.files.length === 0)
            return;
        if (input.files.length > 10) {
            alert('❌ Chỉ được chọn tối đa 10 ảnh!');
            input.value = '';
            return;
        }
        Array.from(input.files).forEach(function (file, index) {
            if (file.size > 5 * 1024 * 1024) {
                alert("\u274C File \"".concat(file.name, "\" qu\u00E1 l\u1EDBn (> 5MB)!"));
                return;
            }
            var reader = new FileReader();
            reader.onload = function (e) {
                var _a;
                var img = document.createElement('img');
                img.src = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                img.style.cssText = "\n                width: 80px;\n                height: 80px;\n                object-fit: cover;\n                border-radius: 5px;\n                border: 2px solid #ddd;\n            ";
                img.title = file.name;
                container.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    };
    // Xử lý upload
    ChiTietSanPhamManager_Ad.prototype.handleUpload_Ad = function (button) {
        return __awaiter(this, void 0, void 0, function () {
            var modal, mauSacSelect, fileInput, progressContainer, progressBar, progressText, formData_1, xhr_1;
            var _this = this;
            return __generator(this, function (_a) {
                modal = button.closest('.upload-modal');
                mauSacSelect = modal.querySelector('#selectMauSac');
                fileInput = modal.querySelector('#imageFiles');
                progressContainer = modal.querySelector('#uploadProgress');
                progressBar = modal.querySelector('#progressBar');
                progressText = modal.querySelector('#progressText');
                // Validate
                if (!mauSacSelect.value) {
                    alert('❌ Vui lòng chọn màu sắc!');
                    return [2 /*return*/];
                }
                if (!fileInput.files || fileInput.files.length === 0) {
                    alert('❌ Vui lòng chọn ít nhất 1 ảnh!');
                    return [2 /*return*/];
                }
                try {
                    // Hiển thị progress
                    progressContainer.style.display = 'block';
                    button.disabled = true;
                    button.textContent = 'Đang upload...';
                    formData_1 = new FormData();
                    formData_1.append('productId', this.sanPham.id);
                    formData_1.append('mauId', mauSacSelect.value);
                    Array.from(fileInput.files).forEach(function (file) {
                        formData_1.append('images', file);
                    });
                    xhr_1 = new XMLHttpRequest();
                    xhr_1.upload.addEventListener('progress', function (e) {
                        if (e.lengthComputable) {
                            var percentComplete = Math.round((e.loaded / e.total) * 100);
                            progressBar.style.width = percentComplete + '%';
                            progressText.textContent = "".concat(percentComplete, "% (").concat(e.loaded, "/").concat(e.total, " bytes)");
                        }
                    });
                    xhr_1.addEventListener('load', function () {
                        if (xhr_1.status === 200) {
                            var response = JSON.parse(xhr_1.responseText);
                            if (response.success) {
                                alert("\u2705 ".concat(response.message));
                                modal.remove();
                                // Reload ảnh sản phẩm
                                _this.loadSanPhamData_Ad();
                            }
                            else {
                                throw new Error(response.message);
                            }
                        }
                        else {
                            throw new Error("HTTP ".concat(xhr_1.status, ": ").concat(xhr_1.statusText));
                        }
                    });
                    xhr_1.addEventListener('error', function () {
                        throw new Error('Lỗi kết nối mạng');
                    });
                    xhr_1.open('POST', 'http://localhost:3000/api/hinh-anh-sp/upload');
                    xhr_1.send(formData_1);
                }
                catch (error) {
                    console.error('Lỗi upload:', error);
                    alert('❌ Upload thất bại: ' + error.message);
                    // Reset UI
                    progressContainer.style.display = 'none';
                    button.disabled = false;
                    button.textContent = '📤 Upload';
                }
                return [2 /*return*/];
            });
        });
    };
    ChiTietSanPhamManager_Ad.prototype.createVariantModal_Ad = function (colors, sizes) {
        var modal = document.createElement('div');
        modal.className = 'variant-modal';
        modal.innerHTML = "\n            <div class=\"variant-modal-content\">\n                <div class=\"variant-modal-header\">\n                    <h3>\u2795 Th\u00EAm Bi\u1EBFn Th\u1EC3 M\u1EDBi</h3>\n                    <button class=\"close-btn\" onclick=\"this.closest('.variant-modal').remove()\">\u2716</button>\n                </div>\n                \n                <form id=\"addVariantForm\" class=\"variant-form\">\n                    <div class=\"form-group\">\n                        <label for=\"variantColor\">M\u00E0u s\u1EAFc *</label>\n                        <select id=\"variantColor\" required>\n                            <option value=\"\">-- Ch\u1ECDn m\u00E0u s\u1EAFc --</option>\n                            ".concat(colors.map(function (color) {
            return "<option value=\"".concat(color._ten_Mau_Sac, "\" data-color=\"").concat(color._ma_Mau, "\">\n                                    ").concat(color._ten_Mau_Sac, "\n                                </option>");
        }).join(''), "\n                        </select>\n                        <div class=\"color-preview-container\">\n                            <div id=\"selectedColorPreview\" class=\"color-preview-large\"></div>\n                        </div>\n                    </div>\n\n                    <div class=\"form-group\">\n                        <label for=\"variantSize\">K\u00EDch c\u1EE1 *</label>\n                        <select id=\"variantSize\" required>\n                            <option value=\"\">-- Ch\u1ECDn k\u00EDch c\u1EE1 --</option>\n                            ").concat(sizes.map(function (size) {
            return "<option value=\"".concat(size._so_Kich_Co, "\">").concat(size._so_Kich_Co, "</option>");
        }).join(''), "\n                        </select>\n                    </div>\n\n                    <div class=\"form-group\">\n                        <label for=\"variantStock\">S\u1ED1 l\u01B0\u1EE3ng t\u1ED3n kho *</label>\n                        <input type=\"number\" id=\"variantStock\" min=\"0\" required placeholder=\"Nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng\">\n                        <small>S\u1ED1 l\u01B0\u1EE3ng ph\u1EA3i l\u1EDBn h\u01A1n ho\u1EB7c b\u1EB1ng 0</small>\n                    </div>\n\n                    <div class=\"variant-modal-actions\">\n                        <button type=\"button\" class=\"btn modal-btn-cancel\" onclick=\"this.closest('.variant-modal').remove()\">\n                            \uD83D\uDEAB H\u1EE7y\n                        </button>\n                        <button type=\"submit\" class=\"btn modal-btn-add\">\n                            \u2705 Th\u00EAm Bi\u1EBFn Th\u1EC3\n                        </button>\n                    </div>\n                </form>\n\n                <div id=\"variantLoadingIndicator\" class=\"variant-loading\" style=\"display: none;\">\n                    <h4>\uD83D\uDD04 \u0110ang t\u1EA1o bi\u1EBFn th\u1EC3...</h4>\n                </div>\n            </div>\n        ");
        return modal;
    };
    // Hàm xử lý thay đổi màu sắc
    ChiTietSanPhamManager_Ad.prototype.handleColorChange_Ad = function (selectElement) {
        var selectedOption = selectElement.selectedOptions[0];
        var colorPreview = document.getElementById('selectedColorPreview');
        if (selectedOption && selectedOption.dataset.color && colorPreview) {
            var colorCode = selectedOption.dataset.color; // Lấy từ ._ma_mau
            colorPreview.style.backgroundColor = colorCode;
            colorPreview.style.border = colorCode === '#FFFFFF' || colorCode.toLowerCase() === '#ffffff'
                ? '2px solid #ddd'
                : '2px solid #F19EDC';
        }
        else if (colorPreview) {
            colorPreview.style.backgroundColor = 'transparent';
            colorPreview.style.border = '2px dashed #ddd';
        }
    };
    // Hàm gửi dữ liệu tạo biến thể
    ChiTietSanPhamManager_Ad.prototype.submitVariant_Ad = function (formData) {
        return __awaiter(this, void 0, void 0, function () {
            var productId, variantData, response, errorData, error_11;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        productId = (_a = document.getElementById('productId')) === null || _a === void 0 ? void 0 : _a.value;
                        if (!productId) {
                            throw new Error('Không tìm thấy ID sản phẩm');
                        }
                        variantData = {
                            sanPhamId: productId,
                            tenMau: formData.get('color'),
                            soKichCo: formData.get('size'),
                            soLuongTonKho: parseInt(formData.get('stock'))
                        };
                        return [4 /*yield*/, fetch('http://localhost:3000/api/bien-the/', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(variantData)
                            })];
                    case 1:
                        response = _b.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        errorData = _b.sent();
                        throw new Error(errorData.message || 'Lỗi khi tạo biến thể');
                    case 3: return [2 /*return*/, true];
                    case 4:
                        error_11 = _b.sent();
                        console.error('Lỗi khi gửi dữ liệu biến thể:', error_11);
                        throw error_11;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // Hàm chính để thêm biến thể
    ChiTietSanPhamManager_Ad.prototype.addVariant_Ad = function () {
        return __awaiter(this, void 0, void 0, function () {
            var existingModal, _a, colors, sizes, modal_1, colorSelect_1, form, error_12;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        existingModal = document.querySelector('.variant-modal');
                        if (existingModal) {
                            existingModal.remove();
                        }
                        return [4 /*yield*/, Promise.all([
                                this.fetchColors_Ad(),
                                this.fetchSizes_Ad()
                            ])];
                    case 1:
                        _a = _b.sent(), colors = _a[0], sizes = _a[1];
                        if (colors.length === 0 || sizes.length === 0) {
                            alert('❌ Không thể tải dữ liệu màu sắc hoặc kích cỡ. Vui lòng thử lại!');
                            return [2 /*return*/];
                        }
                        modal_1 = this.createVariantModal_Ad(colors, sizes);
                        document.body.appendChild(modal_1);
                        colorSelect_1 = modal_1.querySelector('#variantColor');
                        colorSelect_1.addEventListener('change', function () {
                            _this.handleColorChange_Ad(colorSelect_1);
                        });
                        form = modal_1.querySelector('#addVariantForm');
                        form.addEventListener('submit', function (e) { return __awaiter(_this, void 0, void 0, function () {
                            var formData, colorValue, sizeValue, stockValue, loadingIndicator, submitBtn, error_13;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        e.preventDefault();
                                        formData = new FormData();
                                        colorValue = modal_1.querySelector('#variantColor').value;
                                        sizeValue = modal_1.querySelector('#variantSize').value;
                                        stockValue = modal_1.querySelector('#variantStock').value;
                                        if (!colorValue || !sizeValue || !stockValue) {
                                            alert('⚠️ Vui lòng điền đầy đủ thông tin!');
                                            return [2 /*return*/];
                                        }
                                        formData.append('color', colorValue);
                                        formData.append('size', sizeValue);
                                        formData.append('stock', stockValue);
                                        loadingIndicator = modal_1.querySelector('#variantLoadingIndicator');
                                        submitBtn = modal_1.querySelector('.modal-btn-add');
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, 4, 5]);
                                        // Hiển thị loading
                                        loadingIndicator.style.display = 'block';
                                        submitBtn.disabled = true;
                                        submitBtn.textContent = '⏳ Đang xử lý...';
                                        // Gửi dữ liệu
                                        return [4 /*yield*/, this.submitVariant_Ad(formData)];
                                    case 2:
                                        // Gửi dữ liệu
                                        _a.sent();
                                        // Thành công
                                        alert('✅ Thêm biến thể thành công!');
                                        modal_1.remove();
                                        // Cập nhật lại bảng biến thể (nếu có hàm update)
                                        if (typeof this.update_Ad === 'function') {
                                            this.update_Ad();
                                        }
                                        return [3 /*break*/, 5];
                                    case 3:
                                        error_13 = _a.sent();
                                        alert("\u274C L\u1ED7i khi th\u00EAm bi\u1EBFn th\u1EC3: ".concat(error_13 instanceof Error ? error_13.message : 'Lỗi không xác định'));
                                        return [3 /*break*/, 5];
                                    case 4:
                                        // Ẩn loading
                                        loadingIndicator.style.display = 'none';
                                        submitBtn.disabled = false;
                                        submitBtn.textContent = '✅ Thêm Biến Thể';
                                        return [7 /*endfinally*/];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); });
                        this.loadSanPhamData_Ad();
                        return [3 /*break*/, 3];
                    case 2:
                        error_12 = _b.sent();
                        console.error('Lỗi trong addVariant_Ad:', error_12);
                        alert('❌ Có lỗi xảy ra khi mở form thêm biến thể!');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChiTietSanPhamManager_Ad.prototype.deleteVariant_Ad = function (button) {
        return __awaiter(this, void 0, void 0, function () {
            var row, variantId, response, data, error_14;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!confirm('Bạn có chắc muốn xóa biến thể này?')) return [3 /*break*/, 6];
                        row = button.closest('tr');
                        variantId = (_a = row === null || row === void 0 ? void 0 : row.querySelector('input[data-variant-id]')) === null || _a === void 0 ? void 0 : _a.getAttribute('data-variant-id');
                        if (!variantId) {
                            alert('Không tìm thấy ID biến thể.');
                            return [2 /*return*/];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, fetch("http://localhost:3000/api/bien-the/".concat(variantId, "/soft-delete"), {
                                method: 'PATCH'
                            })];
                    case 2:
                        response = _b.sent();
                        if (!!response.ok) return [3 /*break*/, 4];
                        return [4 /*yield*/, response.json()];
                    case 3:
                        data = _b.sent();
                        throw new Error(data.message || 'Xóa ảo biến thể thất bại.');
                    case 4:
                        if (row) {
                            row.remove(); // Hoặc có thể đánh dấu mờ biến thể thay vì remove, tùy UI
                            this.updateStockStats_Ad();
                            alert('🗑️ Đã xóa ảo biến thể!');
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        error_14 = _b.sent();
                        console.error('Lỗi khi gọi API xóa ảo biến thể:', error_14);
                        alert("\u274C X\u00F3a th\u1EA5t b\u1EA1i: ".concat(error_14.message));
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ChiTietSanPhamManager_Ad.prototype.update_Ad = function () {
        return __awaiter(this, void 0, void 0, function () {
            var variantInputs, changedVariants_2, confirmMessage_1, successCount, errorCount, errors, _i, changedVariants_1, variant, response, input, errorData, error_15, resultMessage, error_16;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 10, 11, 12]);
                        variantInputs = document.querySelectorAll('#variantsTableBody input[data-variant-id]');
                        if (variantInputs.length === 0) {
                            alert('❌ Không tìm thấy biến thể nào để cập nhật!');
                            return [2 /*return*/];
                        }
                        changedVariants_2 = [];
                        variantInputs.forEach(function (input) {
                            var variantId = input.getAttribute('data-variant-id');
                            var originalValue = _this.originalStockData[variantId];
                            var newValue = parseInt(input.value) || 0;
                            if (variantId && originalValue !== undefined && originalValue !== newValue) {
                                changedVariants_2.push({
                                    id: variantId,
                                    newStock: newValue,
                                    oldStock: originalValue
                                });
                            }
                        });
                        if (changedVariants_2.length === 0) {
                            alert('ℹ️ Không có thay đổi nào cần cập nhật!');
                            return [2 /*return*/];
                        }
                        confirmMessage_1 = "\uD83D\uDD04 S\u1EBD c\u1EADp nh\u1EADt ".concat(changedVariants_2.length, " bi\u1EBFn th\u1EC3:\n\n");
                        changedVariants_2.forEach(function (variant, index) {
                            confirmMessage_1 += "".concat(index + 1, ". ID: ").concat(variant.id, "\n   ").concat(variant.oldStock, " \u2192 ").concat(variant.newStock, "\n\n");
                        });
                        confirmMessage_1 += 'Bạn có chắc muốn thực hiện cập nhật?';
                        if (!confirm(confirmMessage_1)) {
                            return [2 /*return*/];
                        }
                        // Hiển thị loading
                        this.showLoading_Ad();
                        successCount = 0;
                        errorCount = 0;
                        errors = [];
                        _i = 0, changedVariants_1 = changedVariants_2;
                        _a.label = 1;
                    case 1:
                        if (!(_i < changedVariants_1.length)) return [3 /*break*/, 9];
                        variant = changedVariants_1[_i];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 7, , 8]);
                        return [4 /*yield*/, fetch("http://localhost:3000/api/bien-the/".concat(variant.id), {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    so_luong_ton_kho: variant.newStock
                                })
                            })];
                    case 3:
                        response = _a.sent();
                        if (!response.ok) return [3 /*break*/, 4];
                        successCount++;
                        // Cập nhật lại giá trị gốc
                        this.originalStockData[variant.id] = variant.newStock;
                        input = document.querySelector("input[data-variant-id=\"".concat(variant.id, "\"]"));
                        if (input) {
                            input.setAttribute('data-original-value', variant.newStock.toString());
                        }
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, response.json()];
                    case 5:
                        errorData = _a.sent();
                        errorCount++;
                        errors.push("ID ".concat(variant.id, ": ").concat(errorData.message || 'Lỗi không xác định'));
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_15 = _a.sent();
                        errorCount++;
                        errors.push("ID ".concat(variant.id, ": ").concat(error_15.message));
                        console.error("L\u1ED7i khi c\u1EADp nh\u1EADt bi\u1EBFn th\u1EC3 ".concat(variant.id, ":"), error_15);
                        return [3 /*break*/, 8];
                    case 8:
                        _i++;
                        return [3 /*break*/, 1];
                    case 9:
                        // Cập nhật lại thống kê tồn kho
                        this.updateStockStats_Ad();
                        resultMessage = "\uD83D\uDCCA K\u1EBFt qu\u1EA3 c\u1EADp nh\u1EADt:\n\n";
                        resultMessage += "\u2705 Th\u00E0nh c\u00F4ng: ".concat(successCount, " bi\u1EBFn th\u1EC3\n");
                        if (errorCount > 0) {
                            resultMessage += "\u274C Th\u1EA5t b\u1EA1i: ".concat(errorCount, " bi\u1EBFn th\u1EC3\n\n");
                            resultMessage += "Chi ti\u1EBFt l\u1ED7i:\n".concat(errors.join('\n'));
                        }
                        alert(resultMessage);
                        return [3 /*break*/, 12];
                    case 10:
                        error_16 = _a.sent();
                        console.error('Lỗi trong quá trình cập nhật:', error_16);
                        alert('❌ Có lỗi xảy ra trong quá trình cập nhật: ' + error_16.message);
                        return [3 /*break*/, 12];
                    case 11:
                        this.hideLoading_Ad();
                        return [7 /*endfinally*/];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    ChiTietSanPhamManager_Ad.prototype.deleteReview_Ad = function (button) {
        return __awaiter(this, void 0, void 0, function () {
            var reviewId, reviewItem, response, data, remainingReviews, error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!confirm('Bạn có chắc muốn xóa đánh giá này?')) return [3 /*break*/, 6];
                        reviewId = button.getAttribute('data-review-id');
                        reviewItem = button.closest('.review-item');
                        if (!reviewId) {
                            alert('Không tìm thấy ID đánh giá.');
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, fetch("http://localhost:3000/api/danh-gia/".concat(reviewId), {
                                method: 'DELETE'
                            })];
                    case 2:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 4];
                        return [4 /*yield*/, response.json()];
                    case 3:
                        data = _a.sent();
                        throw new Error(data.message || 'Xóa đánh giá thất bại.');
                    case 4:
                        if (reviewItem) {
                            reviewItem.remove();
                            remainingReviews = document.querySelectorAll('.review-item');
                            this.updateElement_Ad('totalReviews', remainingReviews.length.toString());
                            alert('🗑️ Đã xóa đánh giá!');
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        error_17 = _a.sent();
                        console.error('Lỗi khi xóa đánh giá:', error_17);
                        alert("\u274C X\u00F3a th\u1EA5t b\u1EA1i: ".concat(error_17.message));
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return ChiTietSanPhamManager_Ad;
}());
// Khởi tạo instance global
var chiTietSanPhamManager_Ad = new ChiTietSanPhamManager_Ad();
// Export để có thể sử dụng từ HTML
window.chiTietSanPhamManager_Ad = chiTietSanPhamManager_Ad;
