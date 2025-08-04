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
var orders = [];
function initOrders() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadOrdersData()];
                case 1:
                    orders = _a.sent();
                    displayOrders(orders); // nếu bạn muốn hiển thị ngay sau khi load
                    return [2 /*return*/];
            }
        });
    });
}
var currentEditingOrder = null;
function getAllOrdersApi() {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch('http://localhost:3000/api/don-hang/')];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error('Lỗi khi gọi API lấy đơn hàng');
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 3:
                    error_1 = _a.sent();
                    console.error('Lỗi khi gọi API:', error_1);
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function loadOrdersData() {
    return __awaiter(this, void 0, void 0, function () {
        var rawOrders, convertedOrders;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAllOrdersApi()];
                case 1:
                    rawOrders = _a.sent();
                    convertedOrders = rawOrders.map(function (raw) { return ({
                        id: raw._id,
                        nguoi_dung_id: raw._nguoi_dung_id,
                        tong_thanh_toan: raw._tong_thanh_toan,
                        trang_thai: raw._trang_thai,
                        ngay_tao: raw._ngay_tao,
                        chi_tiet: raw._san_pham.map(function (sp) { return ({
                            bien_the_id: sp.id_bien_the,
                            so_luong: sp.so_luong,
                            gia_ban: sp.gia_ban,
                            ten_san_pham: sp.ten_san_pham,
                            id_san_pham: sp.id_san_pham,
                            mau_sac: sp.mau_sac,
                            kich_co: sp.kich_co,
                            hinh_anh_bien_the: sp.hinh_anh_bien_the,
                        }); })
                    }); });
                    return [2 /*return*/, convertedOrders];
            }
        });
    });
}
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(function (tab) { return tab.classList.remove('active'); });
    document.querySelectorAll('.nav-tab').forEach(function (tab) { return tab.classList.remove('active'); });
    var tab = document.getElementById(tabName);
    if (tab)
        tab.classList.add('active');
    var clickedTab = event === null || event === void 0 ? void 0 : event.target;
    if (clickedTab === null || clickedTab === void 0 ? void 0 : clickedTab.classList.contains('nav-tab')) {
        clickedTab.classList.add('active');
    }
    if (tabName === 'orders') {
        displayOrders();
    }
    else if (tabName === 'dashboard') {
        updateDashboard();
    }
}
function getStatusText(status) {
    var statusMap = {
        cho_xac_nhan: 'Chờ xác nhận',
        da_xac_nhan: 'Đã xác nhận',
        dang_giao: 'Đang giao',
        da_giao: 'Đã giao',
        da_huy: 'Đã hủy'
    };
    return statusMap[status] || status;
}
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}
function formatDate(dateString) {
    var date = new Date(dateString);
    return date.toLocaleString('vi-VN');
}
function createOrderCard(order) {
    return "\n        <div class=\"order-card\">\n            <div class=\"order-header\">\n                <span class=\"order-id\">\u0110\u01A1n h\u00E0ng #".concat(order.id, "</span>\n                <span class=\"status-badge status-").concat(order.trang_thai, "\">\n                    ").concat(getStatusText(order.trang_thai), "\n                </span>\n            </div>\n            <div class=\"order-info\">\n                <div class=\"info-row\">\n                    <span class=\"info-label\">Ng\u01B0\u1EDDi d\u00F9ng:</span>\n                    <span class=\"info-value\">").concat(order.nguoi_dung_id, "</span>\n                </div>\n                <div class=\"info-row\">\n                    <span class=\"info-label\">Ng\u00E0y t\u1EA1o:</span>\n                    <span class=\"info-value\">").concat(formatDate(order.ngay_tao), "</span>\n                </div>\n                <div class=\"info-row\">\n                    <span class=\"info-label\">T\u1ED5ng ti\u1EC1n:</span>\n                    <span class=\"info-value total-amount\">").concat(formatCurrency(order.tong_thanh_toan), "</span>\n                </div>\n            </div>\n            <div class=\"order-actions\">\n                <button class=\"btn btn-primary\" onclick=\"viewOrderDetails('").concat(order.id, "')\" style=\"flex: 2;\">\n                    \uD83D\uDC41\uFE0F Chi ti\u1EBFt\n                </button>\n                <button class=\"btn btn-secondary\" onclick=\"editOrderStatus('").concat(order.id, "')\" style=\"flex: 2;\">\n                    \u270F\uFE0F S\u1EEDa\n                </button>\n                <button class=\"btn\" onclick=\"deleteOrder('").concat(order.id, "')\" style=\"background: #ff4757; color: white; flex: 1;\">\n                    \uD83D\uDDD1\uFE0F\n                </button>\n            </div>\n        </div>\n    ");
}
function displayOrders(filteredOrders) {
    if (filteredOrders === void 0) { filteredOrders = null; }
    var container = document.getElementById('orders-container');
    var ordersToShow = filteredOrders || orders;
    if (ordersToShow.length === 0) {
        container.innerHTML = "\n            <div style=\"text-align: center; color: #666; padding: 40px; grid-column: 1 / -1;\">\n                <h3>Kh\u00F4ng t\u00ECm th\u1EA5y \u0111\u01A1n h\u00E0ng n\u00E0o</h3>\n                <p>Th\u1EED thay \u0111\u1ED5i b\u1ED9 l\u1ECDc ho\u1EB7c th\u00EAm \u0111\u01A1n h\u00E0ng m\u1EDBi</p>\n            </div>\n        ";
        return;
    }
    container.innerHTML = ordersToShow.map(createOrderCard).join('');
}
function viewOrderDetails(orderId) {
    var order = orders.find(function (o) { return o.id === orderId; });
    if (!order)
        return;
    var modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = "\n        <div class=\"order-info\">\n            <div class=\"info-row\"><span class=\"info-label\">M\u00E3 \u0111\u01A1n h\u00E0ng:</span><span class=\"info-value\">".concat(order.id, "</span></div>\n            <div class=\"info-row\"><span class=\"info-label\">Ng\u01B0\u1EDDi d\u00F9ng:</span><span class=\"info-value\">").concat(order.nguoi_dung_id, "</span></div>\n            <div class=\"info-row\"><span class=\"info-label\">Tr\u1EA1ng th\u00E1i:</span>\n                <span class=\"status-badge status-").concat(order.trang_thai, "\">").concat(getStatusText(order.trang_thai), "</span>\n            </div>\n            <div class=\"info-row\"><span class=\"info-label\">Ng\u00E0y t\u1EA1o:</span><span class=\"info-value\">").concat(formatDate(order.ngay_tao), "</span></div>\n            <div class=\"info-row\"><span class=\"info-label\">T\u1ED5ng thanh to\u00E1n:</span><span class=\"info-value total-amount\">").concat(formatCurrency(order.tong_thanh_toan), "</span></div>\n        </div>\n\n        <h3 style=\"color: #F19EDC; margin: 20px 0 10px 0;\">Chi ti\u1EBFt s\u1EA3n ph\u1EA9m:</h3>\n        <table class=\"details-table\">\n            <thead>\n                <tr>\n                    <th>\u1EA2nh</th>\n                    <th>M\u00E3 s\u1EA3n ph\u1EA9m</th>\n                    <th>T\u00EAn s\u1EA3n ph\u1EA9m</th>\n                    <th>M\u00E0u s\u1EAFc</th>\n                    <th>K\u00EDch c\u1EE1</th>\n                    <th>S\u1ED1 l\u01B0\u1EE3ng</th>\n                    <th>Gi\u00E1 b\u00E1n</th>\n                </tr>\n            </thead>\n            <tbody>\n                ").concat(order.chi_tiet.map(function (item) { return "\n                    <tr>\n                        <td><img src=\"".concat(item.hinh_anh_bien_the, "\" alt=\"").concat(item.ten_san_pham, "\" style=\"width: 60px; height: auto; border-radius: 6px;\" /></td>\n                        <td>").concat(item.id_san_pham, "</td>\n                        <td>").concat(item.ten_san_pham, "</td>\n                        <td>").concat(item.mau_sac, "</td>\n                        <td>").concat(item.kich_co, "</td>\n                        <td>").concat(item.so_luong, "</td>\n                        <td>").concat(formatCurrency(item.gia_ban), "</td>\n                    </tr>\n                "); }).join(''), "\n            </tbody>\n        </table>\n    ");
    document.getElementById('order-modal').style.display = 'block';
}
function editOrderStatus(orderId) {
    currentEditingOrder = orderId;
    var order = orders.find(function (o) { return o.id === orderId; });
    if (!order)
        return;
    document.getElementById('new-status').value = order.trang_thai;
    document.getElementById('status-modal').style.display = 'block';
}
function closeModal() {
    document.getElementById('order-modal').style.display = 'none';
}
function closeStatusModal() {
    document.getElementById('status-modal').style.display = 'none';
    currentEditingOrder = null;
}
function updateDashboard() {
    (document.getElementById('total-orders')).textContent = String(orders.length);
    (document.getElementById('pending-orders')).textContent = String(orders.filter(function (o) { return o.trang_thai === 'cho_xac_nhan'; }).length);
    (document.getElementById('confirmed-orders')).textContent = String(orders.filter(function (o) { return o.trang_thai === 'da_xac_nhan'; }).length);
    (document.getElementById('delivered-orders')).textContent = String(orders.filter(function (o) { return o.trang_thai === 'da_giao'; }).length);
}
function setupFilters() {
    var searchInput = document.getElementById('search-input');
    var statusFilter = document.getElementById('status-filter');
    var dateFilter = document.getElementById('date-filter');
    var userFilter = document.getElementById('user-filter'); // 👈 Thêm dòng này
    function applyFilters() {
        var filtered = orders;
        var searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(function (order) {
                return order.id.toLowerCase().includes(searchTerm) ||
                    order.nguoi_dung_id.toLowerCase().includes(searchTerm);
            });
        }
        var statusValue = statusFilter.value;
        if (statusValue) {
            filtered = filtered.filter(function (order) { return order.trang_thai === statusValue; });
        }
        var dateValue = dateFilter.value;
        if (dateValue) {
            var now = new Date();
            var today_1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            filtered = filtered.filter(function (order) {
                var orderDate = new Date(order.ngay_tao);
                switch (dateValue) {
                    case 'today':
                        return orderDate >= today_1;
                    case 'week':
                        var weekAgo = new Date(today_1.getTime() - 7 * 24 * 60 * 60 * 1000);
                        return orderDate >= weekAgo;
                    case 'month':
                        var monthAgo = new Date(today_1.getFullYear(), today_1.getMonth() - 1, today_1.getDate());
                        return orderDate >= monthAgo;
                    default:
                        return true;
                }
            });
        }
        var userValue = userFilter.value.toLowerCase(); // 👈 Thêm lọc theo người dùng
        if (userValue) {
            filtered = filtered.filter(function (order) {
                return order.nguoi_dung_id.toLowerCase().includes(userValue);
            });
        }
        displayOrders(filtered);
    }
    searchInput.addEventListener('input', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    dateFilter.addEventListener('change', applyFilters);
    userFilter.addEventListener('input', applyFilters); // 👈 Thêm ở đây
}
document.addEventListener('DOMContentLoaded', function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, loadOrdersData()];
            case 1:
                orders = _a.sent();
                updateDashboard();
                displayOrders();
                displayOrders();
                setupFilters();
                initOrders();
                document.getElementById('status-form').addEventListener('submit', function (e) {
                    return __awaiter(this, void 0, void 0, function () {
                        var newStatus, response, result, order, error_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    e.preventDefault();
                                    if (!currentEditingOrder) return [3 /*break*/, 5];
                                    newStatus = document.getElementById('new-status').value;
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 4, , 5]);
                                    return [4 /*yield*/, fetch("http://localhost:3000/api/don-hang/cap-nhat-trang-thai/".concat(currentEditingOrder), {
                                            method: 'PUT',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({ trang_thai: newStatus })
                                        })];
                                case 2:
                                    response = _a.sent();
                                    return [4 /*yield*/, response.json()];
                                case 3:
                                    result = _a.sent();
                                    if (response.ok && result.success) {
                                        order = orders.find(function (o) { return o.id === currentEditingOrder; });
                                        if (order) {
                                            order.trang_thai = newStatus;
                                        }
                                        displayOrders();
                                        updateDashboard();
                                        document.getElementById('status-filter').value = '';
                                        document.getElementById('date-filter').value = '';
                                        alert('Cập nhật trạng thái thành công!');
                                    }
                                    else {
                                        alert(result.message || 'Cập nhật trạng thái thất bại!');
                                    }
                                    return [3 /*break*/, 5];
                                case 4:
                                    error_2 = _a.sent();
                                    console.error('Lỗi khi cập nhật trạng thái:', error_2);
                                    alert('Có lỗi xảy ra khi kết nối đến máy chủ!');
                                    return [3 /*break*/, 5];
                                case 5:
                                    closeStatusModal();
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                window.addEventListener('click', function (e) {
                    if (e.target === document.getElementById('order-modal'))
                        closeModal();
                    if (e.target === document.getElementById('status-modal'))
                        closeStatusModal();
                });
                document.addEventListener('keydown', function (e) {
                    if (e.key === 'Escape') {
                        closeModal();
                        closeStatusModal();
                    }
                    if (e.ctrlKey && e.key === 'f') {
                        e.preventDefault();
                        document.getElementById('search-input').focus();
                    }
                });
                return [2 /*return*/];
        }
    });
}); });
//Xóa đơn hàng 
function deleteOrderApi(orderId) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("http://localhost:3000/api/don-hang/".concat(orderId), {
                        method: 'DELETE',
                    })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error('Xóa đơn hàng không thành công');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function deleteOrder(orderId) {
    return __awaiter(this, void 0, void 0, function () {
        var index, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    // Gọi API để xóa trên database
                    return [4 /*yield*/, deleteOrderApi(orderId)];
                case 2:
                    // Gọi API để xóa trên database
                    _a.sent();
                    document.getElementById('status-filter').value = '';
                    document.getElementById('date-filter').value = '';
                    index = orders.findIndex(function (o) { return o.id === orderId; });
                    if (index > -1) {
                        orders.splice(index, 1);
                        displayOrders();
                        updateDashboard();
                        alert('Xóa đơn hàng thành công!');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error('Lỗi khi xóa đơn hàng:', error_3);
                    alert('Xóa đơn hàng thất bại!');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
