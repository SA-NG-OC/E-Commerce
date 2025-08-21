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
var danhMucs2 = [];
var thuongHieus2 = [];
function getAuthHeaders5() {
    var token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': "Bearer ".concat(token)
    };
}
function fetchData() {
    return __awaiter(this, void 0, void 0, function () {
        var resDanhMuc, rawDanhMucs, resThuongHieu, rawThuongHieus, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, fetch('http://localhost:3000/api/danh-muc', {
                            headers: getAuthHeaders5()
                        })];
                case 1:
                    resDanhMuc = _a.sent();
                    return [4 /*yield*/, resDanhMuc.json()];
                case 2:
                    rawDanhMucs = _a.sent();
                    danhMucs2 = rawDanhMucs.map(function (dm) { return ({
                        id: dm._id,
                        ten_danh_muc: dm._ten_danh_muc,
                        icon: dm._icon,
                        san_pham: dm._san_phams.map(function (sp) { return ({
                            id: sp._id,
                            ten_san_pham: sp._ten_san_pham
                        }); })
                    }); });
                    return [4 /*yield*/, fetch('http://localhost:3000/api/thuong-hieu', {
                            headers: getAuthHeaders5()
                        })];
                case 3:
                    resThuongHieu = _a.sent();
                    return [4 /*yield*/, resThuongHieu.json()];
                case 4:
                    rawThuongHieus = _a.sent();
                    thuongHieus2 = rawThuongHieus.map(function (th) { return ({
                        id: th._id,
                        ten_thuong_hieu: th._ten_thuong_hieu,
                        san_pham: th._san_phams.map(function (sp) { return ({
                            id: sp._id,
                            ten_san_pham: sp._ten_san_pham
                        }); })
                    }); });
                    // Sau khi load xong thì hiển thị
                    displayCategories();
                    displayBrands();
                    updateStats3();
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    console.error('❌ Lỗi khi load dữ liệu từ server:', err_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function loadProductOptions() {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, select_1, searchInput_1, originalData_1, renderOptions_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch('http://localhost:3000/api/san-pham/id', {
                            headers: getAuthHeaders5()
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    select_1 = document.getElementById('productName');
                    searchInput_1 = document.getElementById('searchProductInput');
                    originalData_1 = data;
                    renderOptions_1 = function (filterText) {
                        select_1.innerHTML = '';
                        var filtered = originalData_1.filter(function (sp) {
                            return "".concat(sp.id, " - ").concat(sp.ten_san_pham).toLowerCase().includes(filterText.toLowerCase());
                        });
                        filtered.forEach(function (sp) {
                            var option = document.createElement('option');
                            option.value = sp.id;
                            option.textContent = "".concat(sp.id, " - ").concat(sp.ten_san_pham);
                            select_1.appendChild(option);
                        });
                    };
                    renderOptions_1(''); // render all initially
                    searchInput_1.addEventListener('input', function () {
                        renderOptions_1(searchInput_1.value);
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Lỗi khi tải sản phẩm:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function showTab2(tabName) {
    var _a, _b;
    document.querySelectorAll('.tab-content').forEach(function (tab) { return tab.classList.remove('active'); });
    document.querySelectorAll('.tab-button').forEach(function (btn) { return btn.classList.remove('active'); });
    (_a = document.getElementById(tabName)) === null || _a === void 0 ? void 0 : _a.classList.add('active');
    (_b = event === null || event === void 0 ? void 0 : event.target) === null || _b === void 0 ? void 0 : _b.classList.add('active');
}
function updateStats3() {
    var totalProducts = danhMucs2.reduce(function (sum, dm) { return sum + dm.san_pham.length; }, 0);
    document.getElementById('totalCategories').textContent = danhMucs2.length.toString();
    document.getElementById('totalBrands').textContent = thuongHieus2.length.toString();
    document.getElementById('totalProducts').textContent = totalProducts.toString();
}
function displayCategories() {
    var categoryList = document.getElementById('categoryList');
    categoryList.innerHTML = '';
    danhMucs2.forEach(function (dm) {
        var div = document.createElement('div');
        div.className = 'item-card';
        div.innerHTML = "\n            <div class=\"item-header\">\n                <div>\n                    <div class=\"item-title\">\n                        <span class=\"item-icon\">".concat(dm.icon, "</span>\n                        ").concat(dm.ten_danh_muc, "\n                    </div>\n                    <small style=\"color: #666;\">").concat(dm.san_pham.length, " s\u1EA3n ph\u1EA9m</small>\n                </div>\n            </div>\n            <div class=\"product-list\">\n                ").concat(dm.san_pham.map(function (sp) { return "<div class=\"product-item\">".concat(sp.ten_san_pham, "</div>"); }).join(''), "\n            </div>\n            <div class=\"item-actions\">\n                <button class=\"btn\" onclick=\"showAddProductModal('").concat(dm.id, "', 'category')\">Th\u00EAm s\u1EA3n ph\u1EA9m</button>\n                <button class=\"btn btn-danger\" onclick=\"deleteCategory('").concat(dm.id, "')\">X\u00F3a</button>\n            </div>\n        ");
        categoryList.appendChild(div);
    });
    updateCategorySelect();
}
function displayBrands() {
    var brandList = document.getElementById('brandList');
    brandList.innerHTML = '';
    thuongHieus2.forEach(function (th) {
        var div = document.createElement('div');
        div.className = 'item-card';
        div.innerHTML = "\n            <div class=\"item-header\">\n                <div>\n                    <div class=\"item-title\">\uD83C\uDFF7\uFE0F ".concat(th.ten_thuong_hieu, "</div>\n                    <small style=\"color: #666;\">").concat(th.san_pham.length, " s\u1EA3n ph\u1EA9m</small>\n                </div>\n            </div>\n            <div class=\"product-list\">\n                ").concat(th.san_pham.map(function (sp) { return "<div class=\"product-item\">".concat(sp.ten_san_pham, "</div>"); }).join(''), "\n            </div>\n            <div class=\"item-actions\">\n                <button class=\"btn\" onclick=\"showAddProductModal('").concat(th.id, "', 'brand')\">Th\u00EAm s\u1EA3n ph\u1EA9m</button>\n                <button class=\"btn btn-danger\" onclick=\"deleteBrand('").concat(th.id, "')\">X\u00F3a</button>\n            </div>\n        ");
        brandList.appendChild(div);
    });
    updateBrandSelect();
}
function updateCategorySelect() {
    var select = document.getElementById('updateCategorySelect');
    select.innerHTML = '<option value="">-- Chọn danh mục --</option>';
    danhMucs2.forEach(function (dm) {
        var option = document.createElement('option');
        option.value = dm.id;
        option.textContent = "".concat(dm.icon, " ").concat(dm.ten_danh_muc);
        select.appendChild(option);
    });
}
function updateBrandSelect() {
    var select = document.getElementById('updateBrandSelect');
    select.innerHTML = '<option value="">-- Chọn thương hiệu --</option>';
    thuongHieus2.forEach(function (th) {
        var option = document.createElement('option');
        option.value = th.id;
        option.textContent = th.ten_thuong_hieu;
        select.appendChild(option);
    });
}
window.showAddProductModal = function (parentId, parentType) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    document.getElementById('productParentId').value = parentId;
                    document.getElementById('productParentType').value = parentType;
                    return [4 /*yield*/, loadProductOptions()];
                case 1:
                    _a.sent(); // ← gọi tại đây để mỗi lần mở modal đều có danh sách mới
                    document.getElementById('productModal').style.display = 'block';
                    return [2 /*return*/];
            }
        });
    });
};
window.deleteCategory = function (id) {
    return __awaiter(this, void 0, void 0, function () {
        var response, result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return [3 /*break*/, 8];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, fetch("http://localhost:3000/api/danh-muc/".concat(id), {
                            headers: getAuthHeaders5(),
                            method: 'DELETE',
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    result = _a.sent();
                    if (!response.ok) return [3 /*break*/, 5];
                    // Xóa khỏi danh sách tạm thời trên frontend
                    danhMucs2 = danhMucs2.filter(function (dm) { return dm.id !== id; });
                    return [4 /*yield*/, fetchData()];
                case 4:
                    _a.sent();
                    alert('✅ ' + result.message);
                    return [3 /*break*/, 6];
                case 5:
                    alert('❌ ' + result.message); // lỗi như khóa ngoại sẽ vào đây
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_2 = _a.sent();
                    alert('❌ Lỗi khi kết nối tới server');
                    console.error(error_2);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
};
window.deleteBrand = function (id) {
    return __awaiter(this, void 0, void 0, function () {
        var response, result, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) return [3 /*break*/, 8];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, fetch("http://localhost:3000/api/thuong-hieu/".concat(id), {
                            headers: getAuthHeaders5(),
                            method: 'DELETE',
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    result = _a.sent();
                    if (!response.ok) return [3 /*break*/, 5];
                    // Cập nhật giao diện sau khi xóa
                    thuongHieus2 = thuongHieus2.filter(function (th) { return th.id !== id; });
                    return [4 /*yield*/, fetchData()];
                case 4:
                    _a.sent();
                    alert('✅ ' + result.message);
                    return [3 /*break*/, 6];
                case 5:
                    alert('❌ ' + result.message); // lỗi do bị dùng bởi sản phẩm
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_3 = _a.sent();
                    alert('❌ Lỗi khi kết nối tới server');
                    console.error(error_3);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
};
document.addEventListener('DOMContentLoaded', function () { return __awaiter(_this, void 0, void 0, function () {
    var token, res, error_4;
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
                error_4 = _a.sent();
                sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
                window.location.href = '/FE/HTML/DangNhap.html';
                return [2 /*return*/];
            case 4:
                fetchData(); // Load từ API thay vì dữ liệu mẫu
                // Add form listeners
                document.getElementById('addCategoryForm').addEventListener('submit', function (e) {
                    return __awaiter(this, void 0, void 0, function () {
                        var name, icon, res, data, err_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    e.preventDefault();
                                    name = document.getElementById('categoryName').value.trim();
                                    icon = document.getElementById('categoryIcon').value.trim() || '📁';
                                    if (!name) {
                                        alert('Vui lòng nhập tên danh mục');
                                        return [2 /*return*/];
                                    }
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 7, , 8]);
                                    return [4 /*yield*/, fetch('http://localhost:3000/api/danh-muc', {
                                            method: 'POST',
                                            headers: getAuthHeaders5(),
                                            body: JSON.stringify({ icon: icon, ten_danh_muc: name })
                                        })];
                                case 2:
                                    res = _a.sent();
                                    return [4 /*yield*/, res.json()];
                                case 3:
                                    data = _a.sent();
                                    if (!res.ok) return [3 /*break*/, 5];
                                    alert('✅ Thêm danh mục thành công!');
                                    this.reset();
                                    // Cập nhật danhMucs2 local
                                    return [4 /*yield*/, fetchData()];
                                case 4:
                                    // Cập nhật danhMucs2 local
                                    _a.sent(); // ← Lấy lại dữ liệu mới từ DB
                                    displayCategories(); // ← Hiển thị lại bảng danh mục
                                    updateCategorySelect(); // ← Làm mới dropdown
                                    updateStats3();
                                    return [3 /*break*/, 6];
                                case 5:
                                    alert("\u274C L\u1ED7i: ".concat(data.message));
                                    _a.label = 6;
                                case 6: return [3 /*break*/, 8];
                                case 7:
                                    err_2 = _a.sent();
                                    console.error(err_2);
                                    alert('❌ Không thể kết nối tới máy chủ');
                                    return [3 /*break*/, 8];
                                case 8: return [2 /*return*/];
                            }
                        });
                    });
                });
                document.getElementById('updateCategoryForm').addEventListener('submit', function (e) {
                    return __awaiter(this, void 0, void 0, function () {
                        var id, name, icon, res, result, err_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    e.preventDefault();
                                    id = document.getElementById('updateCategorySelect').value;
                                    name = document.getElementById('updateCategoryName').value.trim();
                                    icon = document.getElementById('updateCategoryIcon').value.trim();
                                    if (!id || !name) {
                                        alert('❌ Vui lòng chọn danh mục và nhập tên danh mục.');
                                        return [2 /*return*/];
                                    }
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 5, , 6]);
                                    return [4 /*yield*/, fetch("http://localhost:3000/api/danh-muc/".concat(id), {
                                            method: 'PUT',
                                            headers: getAuthHeaders5(),
                                            body: JSON.stringify({ ten_danh_muc: name, icon: icon }),
                                        })];
                                case 2:
                                    res = _a.sent();
                                    return [4 /*yield*/, res.json()];
                                case 3:
                                    result = _a.sent();
                                    if (!res.ok) {
                                        throw new Error(result.message || 'Cập nhật thất bại');
                                    }
                                    alert('✅ Cập nhật danh mục thành công!');
                                    // Cập nhật danhMucs2 local
                                    return [4 /*yield*/, fetchData()];
                                case 4:
                                    // Cập nhật danhMucs2 local
                                    _a.sent(); // ← Lấy lại dữ liệu mới từ DB
                                    displayCategories(); // ← Hiển thị lại bảng danh mục
                                    updateCategorySelect(); // ← Làm mới dropdown
                                    this.reset(); // Reset form
                                    return [3 /*break*/, 6];
                                case 5:
                                    err_3 = _a.sent();
                                    console.error('Lỗi cập nhật danh mục:', err_3);
                                    alert('❌ Có lỗi xảy ra khi cập nhật danh mục.');
                                    return [3 /*break*/, 6];
                                case 6: return [2 /*return*/];
                            }
                        });
                    });
                });
                document.getElementById('addBrandForm').addEventListener('submit', function (e) {
                    return __awaiter(this, void 0, void 0, function () {
                        var name, res, data, err_4;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    e.preventDefault();
                                    name = document.getElementById('brandName').value.trim();
                                    if (!name) {
                                        alert('Vui lòng nhập tên thương hiệu');
                                        return [2 /*return*/];
                                    }
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 7, , 8]);
                                    return [4 /*yield*/, fetch('http://localhost:3000/api/thuong-hieu', {
                                            method: 'POST',
                                            headers: getAuthHeaders5(),
                                            body: JSON.stringify({ ten_thuong_hieu: name })
                                        })];
                                case 2:
                                    res = _a.sent();
                                    return [4 /*yield*/, res.json()];
                                case 3:
                                    data = _a.sent();
                                    if (!res.ok) return [3 /*break*/, 5];
                                    alert('✅ Thêm thương hiệu thành công!');
                                    this.reset();
                                    // Cập nhật danhMucs2 local
                                    return [4 /*yield*/, fetchData()];
                                case 4:
                                    // Cập nhật danhMucs2 local
                                    _a.sent(); // ← Lấy lại dữ liệu mới từ DB
                                    displayCategories(); // ← Hiển thị lại bảng danh mục
                                    updateCategorySelect(); // ← Làm mới dropdown
                                    updateStats3();
                                    return [3 /*break*/, 6];
                                case 5:
                                    alert("\u274C L\u1ED7i: ".concat(data.message));
                                    _a.label = 6;
                                case 6: return [3 /*break*/, 8];
                                case 7:
                                    err_4 = _a.sent();
                                    console.error(err_4);
                                    alert('❌ Không thể kết nối tới máy chủ');
                                    return [3 /*break*/, 8];
                                case 8: return [2 /*return*/];
                            }
                        });
                    });
                });
                document.getElementById('updateBrandForm').addEventListener('submit', function (e) {
                    return __awaiter(this, void 0, void 0, function () {
                        var id, name, res, data, th, err_5;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    e.preventDefault();
                                    id = document.getElementById('updateBrandSelect').value;
                                    name = document.getElementById('updateBrandName').value.trim();
                                    if (!id || !name) {
                                        alert('Vui lòng chọn thương hiệu và nhập tên mới.');
                                        return [2 /*return*/];
                                    }
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 4, , 5]);
                                    return [4 /*yield*/, fetch("http://localhost:3000/api/thuong-hieu/".concat(id), {
                                            method: 'PUT',
                                            headers: getAuthHeaders5(),
                                            body: JSON.stringify({ ten_thuong_hieu: name })
                                        })];
                                case 2:
                                    res = _a.sent();
                                    return [4 /*yield*/, res.json()];
                                case 3:
                                    data = _a.sent();
                                    if (res.ok) {
                                        th = thuongHieus2.find(function (th) { return th.id === id; });
                                        if (th) {
                                            th.ten_thuong_hieu = name;
                                            displayBrands();
                                        }
                                        this.reset();
                                        alert('✅ Cập nhật thương hiệu thành công!');
                                    }
                                    else {
                                        alert("\u274C L\u1ED7i: ".concat(data.message));
                                    }
                                    return [3 /*break*/, 5];
                                case 4:
                                    err_5 = _a.sent();
                                    console.error(err_5);
                                    alert('❌ Lỗi khi kết nối đến máy chủ.');
                                    return [3 /*break*/, 5];
                                case 5: return [2 /*return*/];
                            }
                        });
                    });
                });
                document.getElementById('addProductForm').addEventListener('submit', function (e) {
                    return __awaiter(this, void 0, void 0, function () {
                        var select, selectedOption, id, ten_san_pham, parentId, parentType, product, res, res, error_5, err;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    e.preventDefault();
                                    select = document.getElementById('productName');
                                    selectedOption = select.options[select.selectedIndex];
                                    id = selectedOption.value;
                                    ten_san_pham = selectedOption.textContent.split(' - ').slice(1).join(' - ');
                                    parentId = document.getElementById('productParentId').value;
                                    parentType = document.getElementById('productParentType').value;
                                    product = { id: id, ten_san_pham: ten_san_pham };
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 8, , 9]);
                                    if (!(parentType === 'category')) return [3 /*break*/, 4];
                                    return [4 /*yield*/, fetch('http://localhost:3000/api/san-pham/update-danh-muc', {
                                            method: 'PUT',
                                            headers: getAuthHeaders5(),
                                            body: JSON.stringify({ sanPhamId: id, danhMucId: parentId })
                                        })];
                                case 2:
                                    res = _a.sent();
                                    if (!res.ok)
                                        throw new Error('Cập nhật danh mục thất bại');
                                    return [4 /*yield*/, fetchData()];
                                case 3:
                                    _a.sent();
                                    return [3 /*break*/, 7];
                                case 4: return [4 /*yield*/, fetch('http://localhost:3000/api/san-pham/update-thuong-hieu', {
                                        method: 'PUT',
                                        headers: getAuthHeaders5(),
                                        body: JSON.stringify({ sanPhamId: id, thuongHieuId: parentId })
                                    })];
                                case 5:
                                    res = _a.sent();
                                    if (!res.ok)
                                        throw new Error('Cập nhật thương hiệu thất bại');
                                    return [4 /*yield*/, fetchData()];
                                case 6:
                                    _a.sent();
                                    _a.label = 7;
                                case 7:
                                    updateStats3();
                                    document.getElementById('productModal').style.display = 'none';
                                    this.reset();
                                    alert('✅ Thêm sản phẩm thành công!');
                                    return [3 /*break*/, 9];
                                case 8:
                                    error_5 = _a.sent();
                                    err = error_5;
                                    alert('❌ ' + err.message);
                                    return [3 /*break*/, 9];
                                case 9: return [2 /*return*/];
                            }
                        });
                    });
                });
                document.getElementById('updateCategorySelect').addEventListener('change', function () {
                    var id = this.value;
                    var dm = danhMucs2.find(function (dm) { return dm.id === id; });
                    if (dm) {
                        document.getElementById('updateCategoryName').value = dm.ten_danh_muc;
                        document.getElementById('updateCategoryIcon').value = dm.icon;
                    }
                });
                document.getElementById('updateBrandSelect').addEventListener('change', function () {
                    var id = this.value;
                    var th = thuongHieus2.find(function (th) { return th.id === id; });
                    if (th) {
                        document.getElementById('updateBrandName').value = th.ten_thuong_hieu;
                    }
                });
                document.querySelector('.close').addEventListener('click', function () {
                    document.getElementById('productModal').style.display = 'none';
                });
                window.addEventListener('click', function (event) {
                    var modal = document.getElementById('productModal');
                    if (modal && event.target === modal) {
                        modal.style.display = 'none';
                    }
                });
                return [2 /*return*/];
        }
    });
}); });
