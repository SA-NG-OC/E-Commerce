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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _this = this;
var users = [];
var filteredUsers = __spreadArray([], users, true);
var itemsPerPage = 10;
var currentPage = 1;
var editingUserId = null;
// Helper function để lấy headers với token
function getAuthHeaders() {
    var token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': "Bearer ".concat(token)
    };
}
// Kiểm tra authentication trước khi load trang
function checkAuth() {
    return __awaiter(this, void 0, void 0, function () {
        var token, res, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = localStorage.getItem('token') || sessionStorage.getItem('token');
                    if (!token) {
                        sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
                        window.location.href = '/FE/HTML/DangNhap.html';
                        return [2 /*return*/, false];
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
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/, true];
                case 3:
                    error_1 = _a.sent();
                    sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
                    window.location.href = '/FE/HTML/DangNhap.html';
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
document.addEventListener('DOMContentLoaded', function () { return __awaiter(_this, void 0, void 0, function () {
    var isAuth, response, data, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, checkAuth()];
            case 1:
                isAuth = _a.sent();
                if (!isAuth)
                    return [2 /*return*/];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 5, , 6]);
                return [4 /*yield*/, fetch('http://localhost:3000/api/nguoi-dung/', {
                        headers: getAuthHeaders()
                    })];
            case 3:
                response = _a.sent();
                if (!response.ok)
                    throw new Error('Không thể tải danh sách người dùng');
                return [4 /*yield*/, response.json()];
            case 4:
                data = _a.sent();
                users = data.map(function (item) { return ({
                    id: item._id,
                    email: item._email,
                    mat_khau_hash: item._mat_khau_hash,
                    ho: item._ho,
                    ten: item._ten,
                    so_dien_thoai: item._so_dien_thoai,
                    dia_chi: item._dia_chi,
                    ngay_sinh: item._ngay_sinh,
                    role_id: convertTenVaiTroToRoleId(item._role),
                    ten_vai_tro: item._role
                }); });
                filteredUsers = __spreadArray([], users, true);
                renderTable();
                updateStats2();
                setupEventListeners();
                return [3 /*break*/, 6];
            case 5:
                error_2 = _a.sent();
                console.error('Lỗi khi tải người dùng:', error_2);
                alert('Không thể tải danh sách người dùng. Vui lòng thử lại.');
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
function fetchAndRenderUsers() {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch('http://localhost:3000/api/nguoi-dung/', {
                            headers: getAuthHeaders()
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok)
                        throw new Error('Không thể tải danh sách người dùng');
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    users = data.map(function (item) { return ({
                        id: item._id,
                        email: item._email,
                        mat_khau_hash: item._mat_khau_hash,
                        ho: item._ho,
                        ten: item._ten,
                        so_dien_thoai: item._so_dien_thoai,
                        dia_chi: item._dia_chi,
                        ngay_sinh: item._ngay_sinh,
                        role_id: convertTenVaiTroToRoleId(item._role),
                        ten_vai_tro: item._role
                    }); });
                    filteredUsers = __spreadArray([], users, true);
                    renderTable();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error('Không thể tải danh sách người dùng:', error_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function convertTenVaiTroToRoleId(tenVaiTro) {
    switch (tenVaiTro) {
        case 'Quản trị viên': return 'ADMIN';
        case 'Quản lý': return 'MANAGER';
        case 'Nhân viên': return 'STAFF';
        default: return 'USER';
    }
}
function setupEventListeners() {
    var searchInput = document.getElementById('searchInput');
    var userForm = document.getElementById('userForm');
    searchInput.addEventListener('input', handleSearch);
    userForm.addEventListener('submit', handleFormSubmit);
}
function updateStats2() {
    document.getElementById('totalUsers').textContent = users.length.toString();
    document.getElementById('adminUsers').textContent = users.filter(function (u) { return u.role_id === 'ADMIN'; }).length.toString();
    document.getElementById('regularUsers').textContent = users.filter(function (u) { return u.role_id === 'USER'; }).length.toString();
}
function handleSearch() {
    var searchTerm = document.getElementById('searchInput').value.toLowerCase();
    filteredUsers = users.filter(function (user) {
        return user.id.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            (user.ho + ' ' + user.ten).toLowerCase().includes(searchTerm) ||
            user.so_dien_thoai.includes(searchTerm);
    });
    currentPage = 1;
    renderTable();
}
function renderTable() {
    var tbody = document.getElementById('userTableBody');
    var startIndex = (currentPage - 1) * itemsPerPage;
    var pageUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);
    tbody.innerHTML = pageUsers.map(function (user) { return "\n        <tr>\n            <td><strong>".concat(user.id, "</strong></td>\n            <td>").concat(user.email, "</td>\n            <td>").concat(user.ho, " ").concat(user.ten, "</td>\n            <td>").concat(user.so_dien_thoai || '-', "</td>\n            <td>").concat(user.ngay_sinh ? new Date(user.ngay_sinh).toLocaleDateString('vi-VN') : '-', "</td>\n            <td><span class=\"status-badge status-").concat(user.role_id.toLowerCase(), "\">").concat(user.ten_vai_tro, "</span></td>\n            <td>\n                <button class=\"btn btn-warning\" onclick=\"editUser('").concat(user.id, "')\">\u270F\uFE0F S\u1EEDa</button>\n                <button class=\"btn btn-danger\" onclick=\"deleteUser('").concat(user.id, "')\">\uD83D\uDDD1\uFE0F X\u00F3a</button>\n            </td>\n        </tr>\n    "); }).join('');
    renderPagination();
}
function renderPagination() {
    var pagination = document.getElementById('pagination');
    var totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    var html = '';
    html += "<button ".concat(currentPage === 1 ? 'disabled' : '', " onclick=\"changePage(").concat(currentPage - 1, ")\">\u2039 Tr\u01B0\u1EDBc</button>");
    for (var i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            html += "<button class=\"active\">".concat(i, "</button>");
        }
        else if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            html += "<button onclick=\"changePage(".concat(i, ")\">").concat(i, "</button>");
        }
        else if (i === currentPage - 3 || i === currentPage + 3) {
            html += "<span>...</span>";
        }
    }
    html += "<button ".concat(currentPage === totalPages ? 'disabled' : '', " onclick=\"changePage(").concat(currentPage + 1, ")\">Sau \u203A</button>");
    pagination.innerHTML = html;
}
function changePage(page) {
    var totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderTable();
    }
}
function openAddModal() {
    editingUserId = null;
    document.getElementById('modalTitle').textContent = 'Thêm người dùng mới';
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    document.getElementById('passwordGroup').style.display = 'block';
    document.getElementById('userPassword').required = true;
    document.getElementById('userModal').style.display = 'block';
}
function editUser(id) {
    var user = users.find(function (u) { return u.id === id; });
    if (!user)
        return;
    editingUserId = id;
    document.getElementById('modalTitle').textContent = 'Sửa thông tin người dùng';
    document.getElementById('userId').value = user.id;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userHo').value = user.ho;
    document.getElementById('userTen').value = user.ten;
    document.getElementById('userPhone').value = user.so_dien_thoai;
    document.getElementById('userAddress').value = user.dia_chi;
    document.getElementById('userBirthDate').value = user.ngay_sinh ? new Date(user.ngay_sinh).toISOString().split('T')[0] : '';
    document.getElementById('userRole').value = user.role_id;
    document.getElementById('passwordGroup').style.display = 'block';
    document.getElementById('userPassword').value = '';
    document.getElementById('userPassword').required = false;
    var passwordLabel = document.querySelector('label[for="userPassword"]');
    if (passwordLabel) {
        passwordLabel.textContent = 'Mật khẩu mới (bỏ trống nếu không đổi)';
    }
    document.getElementById('userModal').style.display = 'block';
}
function deleteUser(id) {
    return __awaiter(this, void 0, void 0, function () {
        var response, result, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return [3 /*break*/, 6];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, fetch("http://localhost:3000/api/nguoi-dung/".concat(id), {
                            method: 'DELETE',
                            headers: getAuthHeaders()
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    result = _a.sent();
                    if (!response.ok) {
                        throw new Error(result.message || 'Xóa thất bại');
                    }
                    alert('Đã xóa người dùng thành công!');
                    return [4 /*yield*/, fetchAndRenderUsers()];
                case 4:
                    _a.sent();
                    updateStats2();
                    return [3 /*break*/, 6];
                case 5:
                    error_4 = _a.sent();
                    console.error('Lỗi khi xóa người dùng:', error_4);
                    alert('Đã xảy ra lỗi khi xóa người dùng');
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function closeModal2() {
    document.getElementById('userModal').style.display = 'none';
}
function handleFormSubmit(e) {
    return __awaiter(this, void 0, void 0, function () {
        var selectedRole, formData, payload, response, result, error_5, response, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    selectedRole = document.getElementById('userRole').value;
                    formData = {
                        email: document.getElementById('userEmail').value,
                        mat_khau: document.getElementById('userPassword').value,
                        ho: document.getElementById('userHo').value,
                        ten: document.getElementById('userTen').value,
                        so_dien_thoai: document.getElementById('userPhone').value,
                        dia_chi: document.getElementById('userAddress').value,
                        ngay_sinh: document.getElementById('userBirthDate').value,
                        role: selectedRole
                    };
                    if (!editingUserId) return [3 /*break*/, 7];
                    payload = {
                        id: editingUserId,
                        email: formData.email,
                        ho: formData.ho,
                        ten: formData.ten,
                        so_dien_thoai: formData.so_dien_thoai,
                        dia_chi: formData.dia_chi,
                        ngay_sinh: formData.ngay_sinh,
                        role_id: formData.role,
                        mat_khau: formData.mat_khau.trim() === '' ? null : formData.mat_khau
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, fetch('http://localhost:3000/api/nguoi-dung/update', {
                            method: 'PUT',
                            headers: getAuthHeaders(),
                            body: JSON.stringify(payload)
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    result = _a.sent();
                    if (!response.ok)
                        throw new Error(result.message || 'Lỗi khi cập nhật');
                    alert('Cập nhật thông tin thành công!');
                    return [4 /*yield*/, fetchAndRenderUsers()];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    error_5 = _a.sent();
                    console.error(error_5);
                    alert('Đã có lỗi xảy ra khi cập nhật người dùng');
                    return [3 /*break*/, 6];
                case 6: return [3 /*break*/, 11];
                case 7:
                    _a.trys.push([7, 10, , 11]);
                    return [4 /*yield*/, fetch('http://localhost:3000/api/nguoi-dung/create', {
                            method: 'POST',
                            headers: getAuthHeaders(),
                            body: JSON.stringify(formData)
                        })];
                case 8:
                    response = _a.sent();
                    if (!response.ok)
                        throw new Error('Lỗi khi tạo người dùng');
                    alert('Thêm người dùng thành công!');
                    return [4 /*yield*/, fetchAndRenderUsers()];
                case 9:
                    _a.sent();
                    return [3 /*break*/, 11];
                case 10:
                    error_6 = _a.sent();
                    console.error(error_6);
                    alert('Đã có lỗi xảy ra khi thêm người dùng');
                    return [3 /*break*/, 11];
                case 11:
                    updateStats2();
                    closeModal2();
                    return [2 /*return*/];
            }
        });
    });
}
window.onclick = function (event) {
    var modal = document.getElementById('userModal');
    if (event.target === modal) {
        closeModal2();
    }
};
