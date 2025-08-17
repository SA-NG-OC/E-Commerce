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
var selectedUserId = null;
var allUsers = [];
var currentNotifications = [];
var socket = null;
var isSocketReady = false; // ✅ Thêm flag để track socket ready
// Khởi tạo
document.addEventListener('DOMContentLoaded', function () {
    initializeSocket();
    loadUsers();
    loadStats();
    var userSearchInput = document.getElementById('userSearch');
    userSearchInput === null || userSearchInput === void 0 ? void 0 : userSearchInput.addEventListener('input', function (e) {
        filterUsers(e.target.value);
    });
    var sendNotificationForm = document.getElementById('sendNotificationForm');
    sendNotificationForm === null || sendNotificationForm === void 0 ? void 0 : sendNotificationForm.addEventListener('submit', function (e) {
        e.preventDefault();
        sendNotification();
    });
});
// ✅ Khởi tạo Socket.IO connection với error handling tốt hơn
function initializeSocket() {
    try {
        // Kiểm tra Socket.IO client có được load chưa
        if (typeof window.io === 'undefined') {
            console.error('❌ Socket.IO client chưa được load! Thêm script tag cho Socket.IO');
            return;
        }
        console.log('🔌 Initializing Socket.IO connection...');
        socket = window.io('http://localhost:3000', {
            transports: ['websocket', 'polling'],
            timeout: 20000,
            forceNew: true
        });
        socket.on('connect', function () {
            console.log('✅ Admin socket connected:', socket.id);
            isSocketReady = true; // ✅ Đánh dấu socket ready
            // ✅ Rejoin room nếu có user đã được chọn
            if (selectedUserId) {
                joinUserRoom(selectedUserId);
            }
        });
        socket.on('disconnect', function (reason) {
            console.log('⚠️ Admin socket disconnected:', reason);
            isSocketReady = false;
            // Auto reconnect sau 2 giây
            setTimeout(function () {
                if (!socket.connected) {
                    console.log('🔄 Attempting to reconnect...');
                    socket.connect();
                }
            }, 2000);
        });
        socket.on('reconnect', function (attemptNumber) {
            console.log('✅ Socket reconnected after', attemptNumber, 'attempts');
            isSocketReady = true;
            // Rejoin room
            if (selectedUserId) {
                joinUserRoom(selectedUserId);
            }
        });
        // ✅ Lắng nghe thông báo mới
        socket.on('thong-bao-moi', function (newNotification) {
            console.log('🔔 Admin received new notification:', newNotification);
            // Chỉ cập nhật nếu thông báo này dành cho user đang được chọn
            if (selectedUserId && newNotification.nguoi_dung_id === selectedUserId) {
                var formattedNotification = {
                    _id: newNotification.id,
                    tieu_de: newNotification.tieu_de,
                    noi_dung: newNotification.noi_dung,
                    ngay_tao: newNotification.ngay_tao
                };
                // ✅ Kiểm tra duplicate trước khi thêm
                var exists = currentNotifications.find(function (n) { return n._id === newNotification.id; });
                if (!exists) {
                    currentNotifications.unshift(formattedNotification);
                    displayNotifications(currentNotifications);
                    updateStats();
                }
                showToast('Thông báo mới đã được gửi thành công!', 'success');
            }
        });
        // ✅ Thêm: Lắng nghe event khi thông báo bị xóa từ client khác
        socket.on('thong-bao-deleted', function (data) {
            console.log('🗑️ Notification deleted from another client:', data.thongBaoId);
            // Update UI nếu đang xem user này
            var notification = currentNotifications.find(function (n) { return n._id === data.thongBaoId; });
            if (notification) {
                currentNotifications = currentNotifications.filter(function (n) { return n._id !== data.thongBaoId; });
                displayNotifications(currentNotifications);
                updateStats();
                showToast('Thông báo đã được xóa', 'info');
            }
        });
        // ✅ Thêm: Lắng nghe event mark as read
        socket.on('thong-bao-mark-read', function (data) {
            console.log('📖 Notification marked as read:', data.thongBaoId);
            // Admin panel không cần xử lý vì không hiển thị trạng thái đã đọc
        });
        socket.on('connect_error', function (error) {
            console.error('❌ Admin socket connection error:', error);
            isSocketReady = false;
            showToast('Lỗi kết nối Socket.IO', 'error');
        });
        // Debug: Log tất cả events
        socket.onAny(function (eventName) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (!['connect', 'disconnect', 'ping', 'pong'].includes(eventName)) {
                console.log('📡 Admin socket event:', eventName, args);
            }
        });
    }
    catch (error) {
        console.error('❌ Lỗi khởi tạo Socket.IO:', error);
        showToast('Lỗi khởi tạo hệ thống thông báo', 'error');
    }
}
// ✅ Hàm join room với validation tốt hơn
function joinUserRoom(userId) {
    if (!socket) {
        console.warn('⚠️ Socket chưa được khởi tạo');
        return;
    }
    if (!socket.connected) {
        console.warn('⚠️ Socket chưa kết nối');
        showToast('Đang kết nối lại...', 'info');
        return;
    }
    // ✅ Sử dụng đúng event name từ backend
    socket.emit('join-user-room', userId);
    console.log('🏠 Admin joined room for user:', userId);
}
// ✅ Hàm leave room
function leaveUserRoom(userId) {
    if (!socket || !socket.connected) {
        console.warn('⚠️ Socket không khả dụng để leave room');
        return;
    }
    // ✅ Tạo custom event để leave room (backend cần thêm handler)
    socket.emit('leave-user-room', userId);
    console.log('🚪 Admin left room for user:', userId);
}
// Tải danh sách người dùng từ API
function loadUsers() {
    return __awaiter(this, void 0, void 0, function () {
        var response, rawUsers, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch('http://localhost:3000/api/nguoi-dung/')];
                case 1:
                    response = _a.sent();
                    if (!response.ok)
                        throw new Error('Không thể tải danh sách người dùng');
                    return [4 /*yield*/, response.json()];
                case 2:
                    rawUsers = _a.sent();
                    // ✅ Validation dữ liệu
                    if (!Array.isArray(rawUsers)) {
                        throw new Error('Dữ liệu người dùng không hợp lệ');
                    }
                    allUsers = rawUsers.map(function (u) { return ({
                        id: u._id || u.id,
                        name: "".concat(u._ho || '', " ").concat(u._ten || '').trim() || 'Không có tên',
                        email: u._email || u.email || 'Không có email'
                    }); });
                    console.log('✅ Loaded', allUsers.length, 'users');
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('❌ Lỗi khi tải danh sách người dùng:', error_1);
                    showToast('Không thể tải danh sách người dùng', 'error');
                    allUsers = [];
                    return [3 /*break*/, 4];
                case 4:
                    displayUsers(allUsers);
                    updateStats();
                    return [2 /*return*/];
            }
        });
    });
}
// Hiển thị danh sách người dùng
function displayUsers(users) {
    var userList = document.getElementById('userList');
    if (!userList) {
        console.error('❌ Không tìm thấy element userList');
        return;
    }
    if (users.length === 0) {
        userList.innerHTML = '<div class="empty-state"><p>Không tìm thấy người dùng nào</p></div>';
        return;
    }
    userList.innerHTML = users.map(function (user) { return "\n        <div class=\"user-item ".concat(selectedUserId === user.id ? 'selected' : '', "\" \n             onclick=\"selectUser('").concat(user.id, "')\">\n            <div class=\"user-info\">\n                <div class=\"user-name\">").concat(escapeHtml(user.name), "</div>\n                <div class=\"user-email\">").concat(escapeHtml(user.email), "</div>\n            </div>\n        </div>\n    "); }).join('');
}
// ✅ Thêm function escape HTML
function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function (m) { return map[m]; });
}
// Lọc người dùng
function filterUsers(searchTerm) {
    var filtered = allUsers.filter(function (user) {
        return user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
    });
    displayUsers(filtered);
}
// ✅ Chọn người dùng với validation tốt hơn
function selectUser(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var notificationsSection, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!userId) {
                        console.error('❌ Invalid userId');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    // Leave previous room
                    if (selectedUserId && selectedUserId !== userId) {
                        leaveUserRoom(selectedUserId);
                    }
                    selectedUserId = userId;
                    displayUsers(allUsers);
                    notificationsSection = document.getElementById('notificationsSection');
                    if (notificationsSection) {
                        notificationsSection.innerHTML = '<div class="loading">⏳ Đang tải thông báo...</div>';
                    }
                    // Join new room (chỉ khi socket ready)
                    if (isSocketReady) {
                        joinUserRoom(userId);
                    }
                    else {
                        console.warn('⚠️ Socket chưa ready, sẽ join room khi kết nối lại');
                    }
                    return [4 /*yield*/, loadUserNotifications(userId)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('❌ Lỗi khi chọn user:', error_2);
                    showToast('Lỗi khi tải thông tin người dùng', 'error');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Tải thông báo của người dùng từ API
function loadUserNotifications(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var notificationsSection, response, rawNotis, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    notificationsSection = document.getElementById('notificationsSection');
                    if (!notificationsSection) {
                        console.error('❌ Không tìm thấy notificationsSection');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("http://localhost:3000/api/thong-bao/".concat(userId))];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP ".concat(response.status, ": ").concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    rawNotis = _a.sent();
                    // ✅ Validation dữ liệu
                    if (!Array.isArray(rawNotis)) {
                        throw new Error('Dữ liệu thông báo không hợp lệ');
                    }
                    currentNotifications = rawNotis.map(function (n) { return ({
                        _id: n.id || n._id,
                        tieu_de: n.tieu_de || '',
                        noi_dung: n.noi_dung || '',
                        ngay_tao: n.ngay_tao || new Date().toISOString()
                    }); });
                    console.log('✅ Loaded', currentNotifications.length, 'notifications for user:', userId);
                    return [3 /*break*/, 5];
                case 4:
                    error_3 = _a.sent();
                    console.error('❌ Lỗi khi tải thông báo:', error_3);
                    notificationsSection.innerHTML = "\n            <div class=\"empty-state\">\n                <p style=\"color: #e41e3f;\">\u274C L\u1ED7i khi t\u1EA3i th\u00F4ng b\u00E1o: ".concat(error_3.message, "</p>\n                <button onclick=\"loadUserNotifications('").concat(userId, "')\" style=\"margin-top: 10px; padding: 8px 16px; background: #1877f2; color: white; border: none; border-radius: 4px; cursor: pointer;\">\n                    \uD83D\uDD04 Th\u1EED l\u1EA1i\n                </button>\n            </div>\n        ");
                    currentNotifications = [];
                    return [2 /*return*/];
                case 5:
                    displayNotifications(currentNotifications);
                    updateStats();
                    return [2 /*return*/];
            }
        });
    });
}
// Hiển thị thông báo
function displayNotifications(notifications) {
    var notificationsSection = document.getElementById('notificationsSection');
    if (!notificationsSection) {
        console.error('❌ Không tìm thấy notificationsSection');
        return;
    }
    if (notifications.length === 0) {
        notificationsSection.innerHTML = "\n            <div class=\"empty-state\">\n                <p>\uD83D\uDCED Ng\u01B0\u1EDDi d\u00F9ng n\u00E0y ch\u01B0a c\u00F3 th\u00F4ng b\u00E1o n\u00E0o</p>\n            </div>\n        ";
        return;
    }
    // ✅ Sort by date descending
    var sortedNotifications = __spreadArray([], notifications, true).sort(function (a, b) {
        return new Date(b.ngay_tao).getTime() - new Date(a.ngay_tao).getTime();
    });
    notificationsSection.innerHTML = sortedNotifications.map(function (notification) { return "\n        <div class=\"notification-item\" id=\"notification-".concat(notification._id, "\">\n            <div class=\"notification-header\">\n                <div>\n                    <div class=\"notification-title\">").concat(escapeHtml(notification.tieu_de), "</div>\n                    <div class=\"notification-date\">").concat(formatDate(notification.ngay_tao), "</div>\n                </div>\n            </div>\n            <div class=\"notification-content\">").concat(escapeHtml(notification.noi_dung), "</div>\n            <div class=\"notification-actions\">\n                <button class=\"btn btn-danger btn-sm\" onclick=\"confirmDelete('").concat(notification._id, "')\">\uD83D\uDDD1\uFE0F X\u00F3a</button>\n            </div>\n        </div>\n    "); }).join('');
}
// ✅ Gửi thông báo với validation tốt hơn
function sendNotification() {
    return __awaiter(this, void 0, void 0, function () {
        var titleInput, contentInput, title, content, sendButton, response, errorData, result, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Validation cơ bản
                    if (!selectedUserId) {
                        showToast('❌ Vui lòng chọn người dùng trước khi gửi thông báo!', 'error');
                        return [2 /*return*/];
                    }
                    titleInput = document.getElementById('notificationTitle');
                    contentInput = document.getElementById('notificationContent');
                    if (!titleInput || !contentInput) {
                        console.error('❌ Không tìm thấy input elements');
                        return [2 /*return*/];
                    }
                    title = titleInput.value.trim();
                    content = contentInput.value.trim();
                    // Validation nội dung
                    if (!title || !content) {
                        showToast('❌ Vui lòng điền đầy đủ tiêu đề và nội dung!', 'error');
                        return [2 /*return*/];
                    }
                    if (title.length > 200) {
                        showToast('❌ Tiêu đề không được quá 200 ký tự!', 'error');
                        return [2 /*return*/];
                    }
                    if (content.length > 1000) {
                        showToast('❌ Nội dung không được quá 1000 ký tự!', 'error');
                        return [2 /*return*/];
                    }
                    sendButton = document.querySelector('#sendNotificationForm button[type="submit"]');
                    if (sendButton) {
                        sendButton.disabled = true;
                        sendButton.textContent = '⏳ Đang gửi...';
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    console.log('📤 Sending notification to user:', selectedUserId);
                    return [4 /*yield*/, fetch('http://localhost:3000/api/thong-bao', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                // ✅ Thêm headers khác nếu cần (auth token, etc.)
                            },
                            body: JSON.stringify({
                                nguoi_dung_id: selectedUserId,
                                tieu_de: title,
                                noi_dung: content
                            })
                        })];
                case 2:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json().catch(function () { return ({}); })];
                case 3:
                    errorData = _a.sent();
                    throw new Error(errorData.message || "HTTP ".concat(response.status, ": ").concat(response.statusText));
                case 4: return [4 /*yield*/, response.json()];
                case 5:
                    result = _a.sent();
                    console.log('✅ Notification sent successfully:', result);
                    // Clear form
                    titleInput.value = '';
                    contentInput.value = '';
                    showToast('✅ Gửi thông báo thành công!', 'success');
                    return [3 /*break*/, 8];
                case 6:
                    error_4 = _a.sent();
                    console.error('❌ Lỗi khi gửi thông báo:', error_4);
                    showToast("\u274C L\u1ED7i khi g\u1EEDi th\u00F4ng b\u00E1o: ".concat(error_4.message), 'error');
                    return [3 /*break*/, 8];
                case 7:
                    // Re-enable form
                    if (sendButton) {
                        sendButton.disabled = false;
                        sendButton.textContent = '📤 Gửi thông báo';
                    }
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
// Xác nhận xóa
function confirmDelete(notificationId) {
    var confirmMessage = document.getElementById('confirmMessage');
    var confirmButton = document.getElementById('confirmButton');
    var confirmModal = document.getElementById('confirmModal');
    if (!confirmMessage || !confirmButton || !confirmModal) {
        console.error('❌ Không tìm thấy modal elements');
        return;
    }
    confirmMessage.textContent = 'Bạn có chắc chắn muốn xóa thông báo này không?';
    confirmButton.onclick = function () { return deleteNotification(notificationId); };
    confirmModal.style.display = 'block';
}
// Xóa thông báo
function deleteNotification(notificationId) {
    return __awaiter(this, void 0, void 0, function () {
        var response, errorData, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    console.log('🗑️ Deleting notification:', notificationId);
                    return [4 /*yield*/, fetch("http://localhost:3000/api/thong-bao/".concat(notificationId), {
                            method: 'DELETE'
                        })];
                case 1:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json().catch(function () { return ({}); })];
                case 2:
                    errorData = _a.sent();
                    throw new Error(errorData.message || "HTTP ".concat(response.status));
                case 3:
                    closeModal();
                    // Xóa khỏi mảng local và cập nhật UI
                    currentNotifications = currentNotifications.filter(function (n) { return n._id !== notificationId; });
                    displayNotifications(currentNotifications);
                    updateStats();
                    showToast('✅ Xóa thông báo thành công!', 'success');
                    return [3 /*break*/, 5];
                case 4:
                    error_5 = _a.sent();
                    console.error('❌ Lỗi khi xóa thông báo:', error_5);
                    showToast("\u274C L\u1ED7i khi x\u00F3a: ".concat(error_5.message), 'error');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Đóng modal
function closeModal() {
    var confirmModal = document.getElementById('confirmModal');
    if (confirmModal) {
        confirmModal.style.display = 'none';
    }
}
// Cập nhật thống kê
function updateStats() {
    var totalUsersEl = document.getElementById('totalUsers');
    var totalNotificationsEl = document.getElementById('totalNotifications');
    if (totalUsersEl)
        totalUsersEl.textContent = allUsers.length.toString();
    if (totalNotificationsEl)
        totalNotificationsEl.textContent = currentNotifications.length.toString();
}
// Tải thống kê chung
function loadStats() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            updateStats();
            return [2 /*return*/];
        });
    });
}
// Format ngày tháng
function formatDate(dateString) {
    try {
        var date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Ngày không hợp lệ';
        }
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    catch (error) {
        console.error('❌ Lỗi format date:', error);
        return 'Lỗi ngày tháng';
    }
}
// ✅ Hiển thị toast notification với styles tốt hơn
function showToast(message, type) {
    if (type === void 0) { type = 'info'; }
    var toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.cssText = "\n            position: fixed;\n            top: 20px;\n            right: 20px;\n            z-index: 10000;\n            pointer-events: none;\n        ";
        document.body.appendChild(toastContainer);
    }
    var toast = document.createElement('div');
    toast.className = "toast toast-".concat(type);
    var colors = {
        success: '#4CAF50',
        error: '#f44336',
        info: '#2196F3'
    };
    toast.style.cssText = "\n        background: ".concat(colors[type], ";\n        color: white;\n        padding: 12px 20px;\n        margin-bottom: 10px;\n        border-radius: 6px;\n        box-shadow: 0 4px 12px rgba(0,0,0,0.15);\n        opacity: 0;\n        transform: translateX(100%);\n        transition: all 0.3s ease;\n        max-width: 350px;\n        word-wrap: break-word;\n        pointer-events: auto;\n    ");
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(function () {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 100);
    setTimeout(function () {
        if (toast.parentNode) {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(function () {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    }, 4000);
}
// ✅ Test function cho Socket
function testSocket() {
    if (!socket) {
        console.error('❌ Socket chưa được khởi tạo');
        return false;
    }
    if (!socket.connected) {
        console.error('❌ Socket chưa kết nối');
        return false;
    }
    console.log('✅ Socket test - connected and ready');
    socket.emit('admin-test', { message: 'Test from admin panel', timestamp: new Date().toISOString() });
    return true;
}
// Đóng modal khi click bên ngoài
window.onclick = function (event) {
    var modal = document.getElementById('confirmModal');
    if (event.target === modal) {
        closeModal();
    }
};
// ✅ Gắn các hàm global cho onclick trong HTML
window.selectUser = selectUser;
window.confirmDelete = confirmDelete;
window.closeModal = closeModal;
window.testSocket = testSocket;
