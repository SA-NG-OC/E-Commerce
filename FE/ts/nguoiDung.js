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
var _this = this;
function getAuthHeaders8() {
    var token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': "Bearer ".concat(token)
    };
}
// Dữ liệu địa chỉ Việt Nam (mẫu)
var vietnamLocations = {
    "Hồ Chí Minh": ["Quận 1", "Quận 2", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7", "Quận 8", "Quận 9", "Quận 10", "Quận 11", "Quận 12", "Quận Bình Tân", "Quận Bình Thạnh", "Quận Gò Vấp", "Quận Phú Nhuận", "Quận Tân Bình", "Quận Tân Phú", "Quận Thủ Đức", "Huyện Bình Chánh", "Huyện Cần Giờ", "Huyện Củ Chi", "Huyện Hóc Môn", "Huyện Nhà Bè"],
    "Hà Nội": ["Quận Ba Đình", "Quận Hoàn Kiếm", "Quận Tây Hồ", "Quận Long Biên", "Quận Cầu Giấy", "Quận Đống Đa", "Quận Hai Bà Trưng", "Quận Hoàng Mai", "Quận Thanh Xuân", "Quận Nam Từ Liêm", "Quận Bắc Từ Liêm", "Quận Hà Đông", "Thị xã Sơn Tây", "Huyện Ba Vì", "Huyện Chương Mỹ", "Huyện Dan Phượng", "Huyện Đông Anh", "Huyện Gia Lâm", "Huyện Hoài Đức", "Huyện Mê Linh", "Huyện Mỹ Đức", "Huyện Phú Xuyên", "Huyện Phúc Thọ", "Huyện Quốc Oai", "Huyện Sóc Sơn", "Huyện Thạch Thất", "Huyện Thanh Oai", "Huyện Thanh Trì", "Huyện Thường Tín", "Huyện Ứng Hòa"],
    "Đà Nẵng": ["Quận Hải Châu", "Quận Thanh Khê", "Quận Sơn Trà", "Quận Ngũ Hành Sơn", "Quận Liên Chiểu", "Quận Cẩm Lệ", "Huyện Hòa Vang", "Huyện Hoàng Sa"],
    "Cần Thơ": ["Quận Ninh Kiều", "Quận Ô Môn", "Quận Bình Thuỷ", "Quận Cái Răng", "Quận Thốt Nốt", "Huyện Vĩnh Thạnh", "Huyện Cờ Đỏ", "Huyện Phong Điền", "Huyện Thới Lai"],
    "Hải Phòng": ["Quận Hồng Bàng", "Quận Ngô Quyền", "Quận Lê Chân", "Quận Hải An", "Quận Kiến An", "Quận Đồ Sơn", "Quận Dương Kinh", "Huyện Thuỷ Nguyên", "Huyện An Dương", "Huyện An Lão", "Huyện Kiến Thuỵ", "Huyện Tiên Lãng", "Huyện Vĩnh Bảo", "Huyện Cát Hải", "Huyện Bạch Long Vĩ"]
};
var currentUser = null;
document.addEventListener('DOMContentLoaded', function () { return __awaiter(_this, void 0, void 0, function () {
    var token, res, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = localStorage.getItem('token') || sessionStorage.getItem('token');
                if (!token) {
                    sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
                    window.location.href = '/HTML/DangNhap.html';
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, fetch("/api/nguoi-dung/me", {
                        headers: { Authorization: "Bearer ".concat(token) }
                    })];
            case 2:
                res = _a.sent();
                if (!res.ok) {
                    localStorage.removeItem('token');
                    sessionStorage.removeItem('token');
                    sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
                    window.location.href = '/HTML/DangNhap.html';
                    return [2 /*return*/];
                }
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
                window.location.href = '/HTML/DangNhap.html';
                return [2 /*return*/];
            case 4:
                loadUserData();
                initializeLocationSelects();
                setupFormHandlers();
                return [2 /*return*/];
        }
    });
}); });
function loadUserData() {
    var userContext = localStorage.getItem('usercontext');
    if (!userContext) {
        alert('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
        return;
    }
    currentUser = JSON.parse(userContext);
    displayUserInfo();
}
function displayUserInfo() {
    if (!currentUser)
        return;
    var firstName = currentUser._ten || 'U';
    document.getElementById('userAvatar').textContent = firstName.charAt(0).toUpperCase();
    document.getElementById('displayName').textContent =
        "".concat(currentUser._ho || '', " ").concat(currentUser._ten || '').trim();
    document.getElementById('displayRole').textContent = currentUser._role || '';
    document.getElementById('displayHo').value = currentUser._ho || '';
    document.getElementById('displayTen').value = currentUser._ten || '';
    document.getElementById('displayEmail').value = currentUser._email || '';
    document.getElementById('displayPhone').value = currentUser._so_dien_thoai || '';
    if (currentUser._ngay_sinh) {
        var birthDate = new Date(currentUser._ngay_sinh);
        document.getElementById('displayBirthday').value = birthDate.toISOString().split('T')[0];
    }
    document.getElementById('displayAddress').value = currentUser._dia_chi || '';
}
function initializeLocationSelects() {
    var provinceSelect = document.getElementById('editProvince');
    var districtSelect = document.getElementById('editDistrict');
    Object.keys(vietnamLocations).forEach(function (province) {
        var option = document.createElement('option');
        option.value = province;
        option.textContent = province;
        provinceSelect.appendChild(option);
    });
    provinceSelect.addEventListener('change', function () {
        districtSelect.innerHTML = '<option value="">Chọn quận/huyện/thị xã</option>';
        var selectedProvince = this.value;
        if (selectedProvince && vietnamLocations[selectedProvince]) {
            vietnamLocations[selectedProvince].forEach(function (district) {
                var option = document.createElement('option');
                option.value = district;
                option.textContent = district;
                districtSelect.appendChild(option);
            });
        }
    });
}
function toggleEditMode() {
    var _a, _b;
    if (!currentUser)
        return;
    (_a = document.getElementById('viewMode')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
    (_b = document.getElementById('editMode')) === null || _b === void 0 ? void 0 : _b.classList.add('active');
    document.getElementById('editHo').value = currentUser._ho || '';
    document.getElementById('editTen').value = currentUser._ten || '';
    document.getElementById('editEmail').value = currentUser._email || '';
    document.getElementById('editPhone').value = currentUser._so_dien_thoai || '';
    if (currentUser._ngay_sinh) {
        var birthDate = new Date(currentUser._ngay_sinh);
        document.getElementById('editBirthday').value = birthDate.toISOString().split('T')[0];
    }
    parseAddress(currentUser._dia_chi || '');
}
function cancelEdit() {
    var _a, _b;
    (_a = document.getElementById('editMode')) === null || _a === void 0 ? void 0 : _a.classList.remove('active');
    (_b = document.getElementById('viewMode')) === null || _b === void 0 ? void 0 : _b.classList.remove('hidden');
    document.getElementById('profileForm').reset();
    document.getElementById('editDistrict').innerHTML = '<option value="">Chọn quận/huyện/thị xã</option>';
}
function parseAddress(address) {
    if (!address)
        return;
    var parts = address.split(',').map(function (part) { return part.trim(); });
    if (parts.length >= 3) {
        document.getElementById('editDetailAddress').value = parts[0] || '';
        var district_1 = parts[1] || '';
        var province = parts[2] || '';
        var provinceSelect = document.getElementById('editProvince');
        provinceSelect.value = province;
        provinceSelect.dispatchEvent(new Event('change'));
        setTimeout(function () {
            document.getElementById('editDistrict').value = district_1;
        }, 100);
    }
}
function preventComma(input) {
    input.value = input.value.replace(/,/g, '');
}
function setupFormHandlers() {
    var _this = this;
    document.getElementById('profileForm').addEventListener('submit', function (e) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    return [4 /*yield*/, updateProfile()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
}
function updateProfile() {
    return __awaiter(this, void 0, void 0, function () {
        var formElement, formData, data, detailAddress, district, province, fullAddress, updateData, response, result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    formElement = document.getElementById('profileForm');
                    formData = new FormData(formElement);
                    data = Object.fromEntries(formData.entries());
                    detailAddress = document.getElementById('editDetailAddress').value.trim();
                    district = document.getElementById('editDistrict').value;
                    province = document.getElementById('editProvince').value;
                    fullAddress = '';
                    if (detailAddress || district || province) {
                        fullAddress = [detailAddress, district, province].filter(function (part) { return part; }).join(', ');
                    }
                    updateData = {
                        id: (currentUser === null || currentUser === void 0 ? void 0 : currentUser._id) || '',
                        email: data.email,
                        ho: data.ho,
                        ten: data.ten,
                        so_dien_thoai: data.so_dien_thoai || '',
                        dia_chi: fullAddress,
                        ngay_sinh: data.ngay_sinh || null,
                        role_id: (currentUser === null || currentUser === void 0 ? void 0 : currentUser._role_id) || 'USER'
                    };
                    if (data.old_password && data.new_password) {
                        if (data.new_password !== data.confirm_password) {
                            showAlert('Mật khẩu xác nhận không khớp!', 'error');
                            return [2 /*return*/];
                        }
                        updateData.mat_khau = data.new_password;
                    }
                    return [4 /*yield*/, fetch('/api/nguoi-dung/update', {
                            method: 'PUT',
                            headers: getAuthHeaders8(),
                            body: JSON.stringify(updateData)
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    result = _a.sent();
                    if (response.ok) {
                        if (currentUser) {
                            currentUser._ho = updateData.ho;
                            currentUser._ten = updateData.ten;
                            currentUser._email = updateData.email;
                            currentUser._so_dien_thoai = updateData.so_dien_thoai;
                            currentUser._dia_chi = updateData.dia_chi;
                            currentUser._ngay_sinh = updateData.ngay_sinh || undefined;
                            localStorage.setItem('usercontext', JSON.stringify(currentUser));
                        }
                        displayUserInfo();
                        cancelEdit();
                        showAlert('Cập nhật thông tin thành công!', 'success');
                    }
                    else {
                        showAlert(result.message || 'Có lỗi xảy ra khi cập nhật!', 'error');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('Lỗi cập nhật:', error_2);
                    showAlert('Có lỗi xảy ra. Vui lòng thử lại!', 'error');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function showAlert(message, type) {
    var alertId = type === 'success' ? 'successAlert' : 'errorAlert';
    var alertElement = document.getElementById(alertId);
    alertElement.textContent = message;
    alertElement.style.display = 'block';
    setTimeout(function () {
        alertElement.style.display = 'none';
    }, 3000);
}
