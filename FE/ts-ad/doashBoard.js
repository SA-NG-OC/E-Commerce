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
function getAuthHeaders3() {
    var token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': "Bearer ".concat(token)
    };
}
function groupRevenueGiaoDich(giaoDichs, type, filterDate) {
    var result = {};
    giaoDichs.forEach(function (gd) {
        // ✅ Chỉ tính giao dịch đã thanh toán
        if (gd._trang_thai !== 'da_thanh_toan')
            return;
        var date = new Date(gd._ngay_thanh_toan);
        // Nếu có filterDate thì bỏ qua những ngày khác
        if (filterDate && date.toISOString().split('T')[0] !== filterDate) {
            return;
        }
        var key;
        if (type === 'day') {
            key = date.toISOString().split('T')[0]; // YYYY-MM-DD
        }
        else {
            key = "".concat(date.getFullYear(), "-").concat(String(date.getMonth() + 1).padStart(2, '0')); // YYYY-MM
        }
        result[key] = (result[key] || 0) + parseFloat(gd._so_tien);
    });
    var labels = Object.keys(result).sort();
    var data = labels.map(function (label) { return result[label]; });
    // ✅ Giới hạn hiển thị gần nhất (7 ngày hoặc 12 tháng)
    if (type === 'day') {
        if (!filterDate) {
            var startIndex = Math.max(0, labels.length - 7);
            labels = labels.slice(startIndex);
            data = data.slice(startIndex);
        }
    }
    else if (type === 'month') {
        var startIndex = Math.max(0, labels.length - 12);
        labels = labels.slice(startIndex);
        data = data.slice(startIndex);
    }
    return { labels: labels, data: data };
}
var revenueChart = null;
function initRevenueChart() {
    return __awaiter(this, void 0, void 0, function () {
        var ctx, typeSelect, dateFilter, res, giaoDichs, _a, labels, data;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    ctx = (_b = document.getElementById('revenueChart')) === null || _b === void 0 ? void 0 : _b.getContext('2d');
                    if (!ctx)
                        return [2 /*return*/];
                    typeSelect = document.getElementById('typeSelect');
                    dateFilter = document.getElementById('dateFilter');
                    return [4 /*yield*/, fetch('http://localhost:3000/api/giao-dich', {
                            headers: getAuthHeaders3()
                        })];
                case 1:
                    res = _c.sent();
                    if (!res.ok)
                        throw new Error("L\u1ED7i t\u1EA3i giao d\u1ECBch: ".concat(res.status));
                    return [4 /*yield*/, res.json()];
                case 2:
                    giaoDichs = _c.sent();
                    _a = groupRevenueGiaoDich(giaoDichs, typeSelect.value, dateFilter.value || undefined), labels = _a.labels, data = _a.data;
                    // Nếu không có dữ liệu thì báo "Không có doanh thu"
                    if (labels.length === 0 || data.length === 0) {
                        if (revenueChart) {
                            revenueChart.destroy();
                            revenueChart = null;
                        }
                        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                        ctx.font = '16px Arial';
                        ctx.fillStyle = '#999';
                        ctx.textAlign = 'center';
                        ctx.fillText('Ngày hôm đó không có doanh thu', ctx.canvas.width / 2, ctx.canvas.height / 2);
                        return [2 /*return*/];
                    }
                    // Nếu trước đó đã có chart thì xóa
                    if (revenueChart) {
                        revenueChart.destroy();
                    }
                    // Vẽ chart mới
                    revenueChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: [{
                                    label: 'Doanh thu',
                                    data: data,
                                    borderColor: '#F19EDC',
                                    backgroundColor: 'rgba(241, 158, 220, 0.1)',
                                    borderWidth: 3,
                                    fill: true,
                                    tension: 0.4,
                                    pointBackgroundColor: '#F19EDC',
                                    pointBorderColor: '#fff',
                                    pointBorderWidth: 2,
                                    pointRadius: 6
                                }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: { callback: function (value) { return "".concat((Number(value) / 1000000), "M\u20AB"); } },
                                    grid: { color: '#f3f4f6' }
                                },
                                x: { grid: { color: '#f3f4f6' } }
                            }
                        }
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function initStats() {
    return __awaiter(this, void 0, void 0, function () {
        var donHangRes, donHangData, token, khachHangRes, khachHangData, sanPhamRes, sanPhamData, error_1;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 7, , 8]);
                    return [4 /*yield*/, fetch('http://localhost:3000/api/don-hang/count', {
                            headers: getAuthHeaders3()
                        })];
                case 1:
                    donHangRes = _d.sent();
                    return [4 /*yield*/, donHangRes.json()];
                case 2:
                    donHangData = _d.sent();
                    document.querySelectorAll('.stat-card .value')[0].textContent = (_a = donHangData.total) !== null && _a !== void 0 ? _a : '0';
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch('http://localhost:3000/api/nguoi-dung/count', {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer ".concat(token) // 👈 bắt buộc để qua authMiddleware
                            }
                        })];
                case 3:
                    khachHangRes = _d.sent();
                    return [4 /*yield*/, khachHangRes.json()];
                case 4:
                    khachHangData = _d.sent();
                    document.querySelectorAll('.stat-card .value')[1].textContent = (_b = khachHangData.total) !== null && _b !== void 0 ? _b : '0';
                    return [4 /*yield*/, fetch('http://localhost:3000/api/san-pham/count', {
                            headers: getAuthHeaders3()
                        })];
                case 5:
                    sanPhamRes = _d.sent();
                    return [4 /*yield*/, sanPhamRes.json()];
                case 6:
                    sanPhamData = _d.sent();
                    document.querySelectorAll('.stat-card .value')[2].textContent = (_c = sanPhamData.total) !== null && _c !== void 0 ? _c : '0';
                    return [3 /*break*/, 8];
                case 7:
                    error_1 = _d.sent();
                    console.error('Không thể tải thống kê:', error_1);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function generateRandomColors(count) {
    var colors = [];
    var step = 360 / count;
    for (var i = 0; i < count; i++) {
        var hue = Math.floor(i * step);
        colors.push("hsl(".concat(hue, ", 70%, 50%)"));
    }
    return colors;
}
function initCategoryChart() {
    return __awaiter(this, void 0, void 0, function () {
        var ctx, res, danhMucs, labels, data, backgroundColors, error_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ctx = (_a = document.getElementById('categoryChart')) === null || _a === void 0 ? void 0 : _a.getContext('2d');
                    if (!ctx)
                        return [2 /*return*/];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch('http://localhost:3000/api/danh-muc', {
                            headers: getAuthHeaders3()
                        })];
                case 2:
                    res = _b.sent();
                    if (!res.ok)
                        throw new Error('Lỗi tải danh mục');
                    return [4 /*yield*/, res.json()];
                case 3:
                    danhMucs = _b.sent();
                    labels = danhMucs.map(function (dm) { return dm._ten_danh_muc; });
                    data = danhMucs.map(function (dm) { var _a; return ((_a = dm._san_phams) === null || _a === void 0 ? void 0 : _a.length) || 0; });
                    backgroundColors = generateRandomColors(labels.length);
                    new Chart(ctx, {
                        type: 'doughnut',
                        data: {
                            labels: labels,
                            datasets: [{
                                    data: data,
                                    backgroundColor: backgroundColors,
                                    borderWidth: 0,
                                    hoverOffset: 4
                                }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    labels: {
                                        padding: 20,
                                        usePointStyle: true,
                                        font: { size: 12 }
                                    }
                                }
                            }
                        }
                    });
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _b.sent();
                    console.error('Không thể tải biểu đồ danh mục:', error_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function exportReport() {
    if (!revenueChart || !revenueChart.data || !revenueChart.data.labels) {
        alert('Không có dữ liệu để xuất!');
        return;
    }
    // Chuẩn bị dữ liệu dạng mảng 2D cho Excel
    var header = ['Thời gian', 'Doanh thu (VND)'];
    var rows = revenueChart.data.labels.map(function (label, index) {
        return [label, revenueChart.data.datasets[0].data[index]];
    });
    var wsData = __spreadArray([header], rows, true);
    // Tạo worksheet và workbook
    var ws = XLSX.utils.aoa_to_sheet(wsData);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DoanhThu');
    // Xuất file
    XLSX.writeFile(wb, "BaoCaoDoanhThu_".concat(new Date().toISOString().split('T')[0], ".xlsx"));
}
document.addEventListener('DOMContentLoaded', function () { return __awaiter(_this, void 0, void 0, function () {
    var token, res, error_3;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                token = localStorage.getItem('token') || sessionStorage.getItem('token');
                if (!token) {
                    sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
                    window.location.href = '/FE/HTML/DangNhap.html';
                    return [2 /*return*/];
                }
                _d.label = 1;
            case 1:
                _d.trys.push([1, 3, , 4]);
                return [4 /*yield*/, fetch("http://localhost:3000/api/nguoi-dung/me", {
                        headers: { Authorization: "Bearer ".concat(token) }
                    })];
            case 2:
                res = _d.sent();
                if (!res.ok) {
                    localStorage.removeItem('token');
                    sessionStorage.removeItem('token');
                    sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
                    window.location.href = '/FE/HTML/DangNhap.html';
                    return [2 /*return*/];
                }
                return [3 /*break*/, 4];
            case 3:
                error_3 = _d.sent();
                sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
                window.location.href = '/FE/HTML/DangNhap.html';
                return [2 /*return*/];
            case 4:
                initStats();
                initRevenueChart();
                initCategoryChart();
                (_a = document.getElementById('typeSelect')) === null || _a === void 0 ? void 0 : _a.addEventListener('change', initRevenueChart);
                (_b = document.getElementById('dateFilter')) === null || _b === void 0 ? void 0 : _b.addEventListener('change', initRevenueChart);
                (_c = document.getElementById('exportBtn')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', exportReport);
                document.querySelectorAll('.stat-card').forEach(function (card) {
                    card.addEventListener('mouseenter', function () {
                        card.style.transform = 'translateY(-2px)';
                    });
                    card.addEventListener('mouseleave', function () {
                        card.style.transform = 'translateY(0)';
                    });
                });
                return [2 /*return*/];
        }
    });
}); });
