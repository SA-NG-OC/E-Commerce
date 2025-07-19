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
//Sản phẩm//
function getSanPhamIdFromUrl() {
    var params = new URLSearchParams(window.location.search);
    return params.get('id');
    //
}
function fetchSanPhamById(id) {
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
                                id: img._id,
                                san_pham_id: img._san_pham_id,
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
}
//Review//
function fetchDanhGiaBySanPhamId(id) {
    return __awaiter(this, void 0, void 0, function () {
        var res, data, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("http://localhost:3000/api/san-pham/".concat(id, "/danh-gia"))];
                case 1:
                    res = _b.sent();
                    if (!res.ok)
                        return [2 /*return*/, []];
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = _b.sent();
                    // Map lại field cho đúng interface
                    return [2 /*return*/, data.map(function (r) { return ({
                            id: r._id,
                            san_pham_id: r._san_pham_id,
                            nguoi_dung_id: r._nguoi_dung_id,
                            diem_danh_gia: r._diem_danh_gia,
                            noi_dung_danh_gia: r._noi_dung_danh_gia,
                            ngay_tao: r._ngay_tao,
                            ho_ten_nguoi_dung: r._ho_ten_nguoi_dung
                        }); })];
                case 3:
                    _a = _b.sent();
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function filterReviewByStar(reviews, star) {
    if (star === 'all')
        return reviews;
    if (star === 'user') {
        var userStr = localStorage.getItem('usercontext');
        if (!userStr)
            return [];
        var user_1 = JSON.parse(userStr);
        return reviews.filter(function (r) { return r.nguoi_dung_id === user_1._id; });
    }
    var numStar = Number(star);
    return reviews.filter(function (r) { return r.diem_danh_gia === numStar; });
}
// Hàm tạo và hiển thị dialog quản lý comment
function showCommentDialog(reviewId, currentContent, currentRating) {
    // Tạo overlay
    var overlay = document.createElement('div');
    overlay.className = 'comment-dialog-overlay';
    overlay.style.cssText = "\n        position: fixed;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        background: rgba(0, 0, 0, 0.5);\n        z-index: 1000;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n    ";
    // Tạo dialog
    var dialog = document.createElement('div');
    dialog.className = 'comment-dialog';
    dialog.style.cssText = "\n        background: white;\n        border-radius: 12px;\n        padding: 24px;\n        max-width: 500px;\n        width: 90%;\n        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);\n    ";
    dialog.innerHTML = "\n        <h3 style=\"color: #E91E63; margin-bottom: 20px; font-size: 20px;\">Qu\u1EA3n l\u00FD \u0111\u00E1nh gi\u00E1</h3>\n        \n        <div style=\"margin-bottom: 16px;\">\n            <label style=\"display: block; margin-bottom: 8px; font-weight: 500;\">S\u1ED1 sao:</label>\n            <div class=\"edit-star-rating\" style=\"display: flex; gap: 4px;\">\n                ".concat([1, 2, 3, 4, 5].map(function (i) { return "<span class=\"edit-star\" data-value=\"".concat(i, "\" style=\"font-size: 24px; cursor: pointer; color: ").concat(i <= currentRating ? '#E91E63' : '#F19EDC', ";\">").concat(i <= currentRating ? '★' : '☆', "</span>"); }).join(''), "\n            </div>\n        </div>\n        \n        <div style=\"margin-bottom: 20px;\">\n            <label style=\"display: block; margin-bottom: 8px; font-weight: 500;\">N\u1ED9i dung:</label>\n            <textarea id=\"editReviewContent\" style=\"width: 100%; height: 100px; padding: 10px; border: 1px solid #F19EDC; border-radius: 6px; resize: vertical;\">").concat(currentContent, "</textarea>\n        </div>\n        \n        <div style=\"display: flex; gap: 10px; justify-content: flex-end;\">\n            <button id=\"cancelBtn\" style=\"padding: 10px 20px; border: 1px solid #ddd; background: white; border-radius: 6px; cursor: pointer;\">H\u1EE7y</button>\n            <button id=\"saveBtn\" style=\"padding: 10px 20px; background: linear-gradient(45deg, #F19EDC, #E91E63); color: white; border: none; border-radius: 6px; cursor: pointer;\">L\u01B0u</button>\n            <button id=\"deleteBtn\" style=\"padding: 10px 20px; background: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer;\">X\u00F3a</button>\n        </div>\n        \n        <div id=\"dialogMessage\" style=\"margin-top: 12px; color: #e74c3c;\"></div>\n    ");
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    var selectedRating = currentRating;
    // Xử lý chọn sao
    var editStars = dialog.querySelectorAll('.edit-star');
    editStars.forEach(function (star, idx) {
        star.addEventListener('click', function () {
            selectedRating = idx + 1;
            editStars.forEach(function (s, i) {
                var el = s;
                if (i < selectedRating) {
                    el.style.color = '#E91E63';
                    el.innerHTML = '★';
                }
                else {
                    el.style.color = '#F19EDC';
                    el.innerHTML = '☆';
                }
            });
        });
        star.addEventListener('mouseover', function () {
            var hoverRating = idx + 1;
            editStars.forEach(function (s, i) {
                var el = s;
                if (i < hoverRating) {
                    el.style.color = '#E91E63';
                    el.innerHTML = '★';
                }
                else {
                    el.style.color = '#F19EDC';
                    el.innerHTML = '☆';
                }
            });
        });
        star.addEventListener('mouseout', function () {
            editStars.forEach(function (s, i) {
                var el = s;
                if (i < selectedRating) {
                    el.style.color = '#E91E63';
                    el.innerHTML = '★';
                }
                else {
                    el.style.color = '#F19EDC';
                    el.innerHTML = '☆';
                }
            });
        });
    });
    // Xử lý sự kiện nút
    var cancelBtn = dialog.querySelector('#cancelBtn');
    var saveBtn = dialog.querySelector('#saveBtn');
    var deleteBtn = dialog.querySelector('#deleteBtn');
    var messageEl = dialog.querySelector('#dialogMessage');
    // Đóng dialog
    var closeDialog = function () {
        document.body.removeChild(overlay);
    };
    cancelBtn === null || cancelBtn === void 0 ? void 0 : cancelBtn.addEventListener('click', closeDialog);
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
            closeDialog();
        }
    });
    // Lưu thay đổi
    saveBtn === null || saveBtn === void 0 ? void 0 : saveBtn.addEventListener('click', function () {
        return __awaiter(this, void 0, void 0, function () {
            var newContent, res, err, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        newContent = dialog.querySelector('#editReviewContent').value.trim();
                        if (!newContent) {
                            messageEl.textContent = 'Vui lòng nhập nội dung đánh giá!';
                            return [2 /*return*/];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, fetch("http://localhost:3000/api/danh-gia/".concat(reviewId), {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    diem_danh_gia: selectedRating,
                                    noi_dung_danh_gia: newContent
                                })
                            })];
                    case 2:
                        res = _b.sent();
                        if (!res.ok) return [3 /*break*/, 3];
                        alert('Cập nhật đánh giá thành công!');
                        closeDialog();
                        renderChiTietSanPham();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, res.json()];
                    case 4:
                        err = _b.sent();
                        messageEl.textContent = err.message || 'Cập nhật đánh giá thất bại!';
                        _b.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        _a = _b.sent();
                        messageEl.textContent = 'Lỗi kết nối máy chủ!';
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    });
    // Xóa đánh giá
    deleteBtn === null || deleteBtn === void 0 ? void 0 : deleteBtn.addEventListener('click', function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!confirm('Bạn có chắc muốn xóa đánh giá này?')) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fetch("http://localhost:3000/api/danh-gia/".concat(reviewId), {
                                method: 'DELETE'
                            })];
                    case 2:
                        res = _b.sent();
                        if (res.ok) {
                            alert('Xóa đánh giá thành công!');
                            closeDialog();
                            renderChiTietSanPham();
                        }
                        else {
                            messageEl.textContent = 'Xóa đánh giá thất bại!';
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _b.sent();
                        messageEl.textContent = 'Lỗi kết nối máy chủ!';
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    });
}
// Hàm render chi tiết sản phẩm và đánh giá (bạn tự gắn vào DOM theo id hoặc class tuỳ HTML)
function renderChiTietSanPham() {
    return __awaiter(this, void 0, void 0, function () {
        var id, sanPham, danhGias, mainImage, imageThumbnails, titleEl, codeEl, brandEl, priceEl, stockEl, moTaEl, reviewList, filterStarEl, filteredReviews, selectedStar, userStr, userId_1, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = getSanPhamIdFromUrl();
                    if (!id)
                        return [2 /*return*/];
                    return [4 /*yield*/, fetchSanPhamById(id)];
                case 1:
                    sanPham = _a.sent();
                    return [4 /*yield*/, fetchDanhGiaBySanPhamId(id)];
                case 2:
                    danhGias = _a.sent();
                    if (!sanPham)
                        return [2 /*return*/];
                    mainImage = document.getElementById('mainImage');
                    imageThumbnails = document.getElementById('imageThumbnails');
                    if (mainImage && sanPham.danh_sach_hinh_anh.length > 0) {
                        mainImage.src = sanPham.danh_sach_hinh_anh[0].duong_dan_hinh_anh;
                        mainImage.alt = sanPham.ten_san_pham;
                    }
                    if (imageThumbnails) {
                        imageThumbnails.innerHTML = sanPham.danh_sach_hinh_anh.map(function (img, idx) {
                            return "<img src=\"".concat(img.duong_dan_hinh_anh, "\" alt=\"H\u00ECnh ").concat(idx + 1, "\" class=\"thumbnail").concat(idx === 0 ? ' active' : '', "\" onclick=\"document.getElementById('mainImage').src='").concat(img.duong_dan_hinh_anh, "'; Array.from(document.querySelectorAll('.thumbnail')).forEach(t=>t.classList.remove('active')); this.classList.add('active');\">\n            ");
                        }).join('');
                    }
                    titleEl = document.querySelector('.product-title');
                    if (titleEl)
                        titleEl.textContent = sanPham.ten_san_pham;
                    codeEl = document.querySelector('.product-code');
                    if (codeEl)
                        codeEl.textContent = sanPham.ma_san_pham ? "M\u00E3 s\u1EA3n ph\u1EA9m: ".concat(sanPham.ma_san_pham) : '';
                    brandEl = document.querySelector('.brand-tag');
                    if (brandEl)
                        brandEl.textContent = sanPham.thuong_hieu || '';
                    priceEl = document.querySelector('.original-price');
                    if (priceEl)
                        priceEl.textContent = sanPham.gia_ban ? "".concat(Number(sanPham.gia_ban).toLocaleString(), "\u20AB") : '';
                    stockEl = document.querySelector('.stock-status');
                    if (stockEl)
                        stockEl.textContent = sanPham.so_luong_ton_kho !== undefined ? "C\u00F2n h\u00E0ng: ".concat(sanPham.so_luong_ton_kho, " s\u1EA3n ph\u1EA9m c\u00F3 s\u1EB5n") : '';
                    moTaEl = document.getElementById('moTaSanPham');
                    if (moTaEl)
                        moTaEl.textContent = sanPham.mo_ta || '';
                    reviewList = document.getElementById('reviewList');
                    filterStarEl = document.getElementById('filterStar');
                    filteredReviews = danhGias;
                    if (filterStarEl) {
                        selectedStar = filterStarEl.value;
                        filteredReviews = filterReviewByStar(danhGias, selectedStar);
                        filterStarEl.onchange = function () {
                            var selected = filterStarEl.value;
                            var filtered = filterReviewByStar(danhGias, selected);
                            if (reviewList) {
                                if (filtered.length === 0) {
                                    reviewList.innerHTML = '<div class="placeholder-text">Không có đánh giá nào phù hợp.</div>';
                                }
                                else {
                                    var userStr = localStorage.getItem('usercontext');
                                    var userId_2 = null;
                                    if (userStr) {
                                        try {
                                            var user = JSON.parse(userStr);
                                            userId_2 = user._id;
                                        }
                                        catch (_a) { }
                                    }
                                    reviewList.innerHTML = filtered.map(function (r) {
                                        var isOwner = userId_2 && r.nguoi_dung_id === userId_2;
                                        return "\n                        <div class=\"review-item ".concat(isOwner ? 'user-review clickable' : '', "\" data-review-id=\"").concat(r.id, "\" data-review-content=\"").concat(r.noi_dung_danh_gia, "\" data-review-rating=\"").concat(r.diem_danh_gia, "\" ").concat(isOwner ? 'title="Click để chỉnh sửa đánh giá"' : '', ">\n                            <div class=\"review-header\">\n                                <div class=\"reviewer-avatar\">").concat(r.ho_ten_nguoi_dung ? r.ho_ten_nguoi_dung.charAt(0).toUpperCase() : '?', "</div>\n                                <div class=\"reviewer-info\">\n                                    <div class=\"reviewer-name\">").concat(r.ho_ten_nguoi_dung || 'Ẩn danh', "</div>\n                                    <div class=\"review-date\">").concat(new Date(r.ngay_tao).toLocaleDateString('vi-VN'), "</div>\n                                </div>\n                                <div class=\"review-rating\">").concat('★'.repeat(r.diem_danh_gia)).concat('☆'.repeat(5 - r.diem_danh_gia), "</div>\n                            </div>\n                            <div class=\"review-content\">").concat(r.noi_dung_danh_gia, "</div>\n                        </div>\n                        ");
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
                        }
                        else {
                            userStr = localStorage.getItem('usercontext');
                            userId_1 = null;
                            if (userStr) {
                                try {
                                    user = JSON.parse(userStr);
                                    userId_1 = user._id;
                                }
                                catch (_b) { }
                            }
                            reviewList.innerHTML = filteredReviews.map(function (r) {
                                var isOwner = userId_1 && r.nguoi_dung_id === userId_1;
                                return "\n                <div class=\"review-item ".concat(isOwner ? 'user-review clickable' : '', "\" data-review-id=\"").concat(r.id, "\" data-review-content=\"").concat(r.noi_dung_danh_gia, "\" data-review-rating=\"").concat(r.diem_danh_gia, "\" ").concat(isOwner ? 'title="Click để chỉnh sửa đánh giá"' : '', ">\n                    <div class=\"review-header\">\n                        <div class=\"reviewer-avatar\">").concat(r.ho_ten_nguoi_dung ? r.ho_ten_nguoi_dung.charAt(0).toUpperCase() : '?', "</div>\n                        <div class=\"reviewer-info\">\n                            <div class=\"reviewer-name\">").concat(r.ho_ten_nguoi_dung || 'Ẩn danh', "</div>\n                            <div class=\"review-date\">").concat(new Date(r.ngay_tao).toLocaleDateString('vi-VN'), "</div>\n                        </div>\n                        <div class=\"review-rating\">").concat('★'.repeat(r.diem_danh_gia)).concat('☆'.repeat(5 - r.diem_danh_gia), "</div>\n                    </div>\n                    <div class=\"review-content\">").concat(r.noi_dung_danh_gia, "</div>\n                </div>\n                ");
                            }).join('');
                            // Gắn sự kiện click cho các review của user
                            attachReviewClickEvents();
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
// Hàm gắn sự kiện click cho các review của user
function attachReviewClickEvents() {
    var userReviews = document.querySelectorAll('.review-item.user-review.clickable');
    userReviews.forEach(function (reviewEl) {
        reviewEl.addEventListener('click', function () {
            var reviewId = Number(reviewEl.getAttribute('data-review-id'));
            var reviewContent = reviewEl.getAttribute('data-review-content') || '';
            var reviewRating = Number(reviewEl.getAttribute('data-review-rating')) || 1;
            showCommentDialog(reviewId, reviewContent, reviewRating);
        });
    });
}
document.addEventListener('DOMContentLoaded', function () {
    renderChiTietSanPham();
    // Star rating interaction
    var stars = document.querySelectorAll('#starRating .star');
    var selectedRating = 0;
    stars.forEach(function (star, idx) {
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
    function highlightStars(rating) {
        stars.forEach(function (star, i) {
            if (i < rating) {
                star.classList.add('selected');
                star.innerHTML = '★'; // filled star
            }
            else {
                star.classList.remove('selected');
                star.innerHTML = '☆'; // empty star
            }
        });
    }
    // Prevent submit if chưa chọn số sao
    var reviewForm = document.getElementById('userReviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function (e) {
            return __awaiter(this, void 0, void 0, function () {
                var userStr, user, sanPhamId, reviewContent, res, err, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (selectedRating === 0) {
                                e.preventDefault();
                                document.getElementById('reviewFormMessage').textContent = 'Vui lòng chọn số sao trước khi gửi đánh giá!';
                                return [2 /*return*/];
                            }
                            document.getElementById('reviewFormMessage').textContent = '';
                            e.preventDefault();
                            userStr = localStorage.getItem('usercontext');
                            if (!userStr) {
                                document.getElementById('reviewFormMessage').textContent = 'Bạn cần đăng nhập để gửi đánh giá!';
                                return [2 /*return*/];
                            }
                            user = JSON.parse(userStr);
                            console.log('User:', user);
                            console.log('nguoi_dung_id:', user._id);
                            sanPhamId = getSanPhamIdFromUrl();
                            reviewContent = document.getElementById('reviewContent').value;
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 6, , 7]);
                            return [4 /*yield*/, fetch("http://localhost:3000/api/san-pham/".concat(sanPhamId, "/danh-gia"), {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        san_pham_id: Number(sanPhamId),
                                        nguoi_dung_id: user._id,
                                        diem_danh_gia: selectedRating,
                                        noi_dung_danh_gia: reviewContent
                                    })
                                })];
                        case 2:
                            res = _b.sent();
                            if (!res.ok) return [3 /*break*/, 3];
                            document.getElementById('reviewFormMessage').textContent = 'Gửi đánh giá thành công!';
                            reviewForm.reset();
                            highlightStars(0);
                            selectedRating = 0;
                            // Reload lại danh sách đánh giá
                            renderChiTietSanPham();
                            return [3 /*break*/, 5];
                        case 3: return [4 /*yield*/, res.json()];
                        case 4:
                            err = _b.sent();
                            document.getElementById('reviewFormMessage').textContent = err.message || 'Gửi đánh giá thất bại!';
                            _b.label = 5;
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            _a = _b.sent();
                            document.getElementById('reviewFormMessage').textContent = 'Lỗi kết nối máy chủ!';
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        });
    }
});
document.addEventListener('DOMContentLoaded', renderChiTietSanPham);
