interface User_Ad {
    id: string;
    name: string;
    email: string;
}

interface Notification2 {
    _id: string;
    tieu_de: string;
    noi_dung: string;
    ngay_tao: string;
}

let selectedUserId: string | null = null;
let allUsers: User_Ad[] = [];
let currentNotifications: Notification2[] = [];
let socket: any = null;
let isSocketReady = false; // ✅ Thêm flag để track socket ready

// Helper function để lấy headers với token cho quản lý thông báo
function getAuthHeaders_Ad() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// Kiểm tra authentication trước khi load trang quản lý thông báo
async function checkAuth_Ad() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
        window.location.href = '/FE/HTML/DangNhap.html';
        return false;
    }

    try {
        const res = await fetch("http://localhost:3000/api/nguoi-dung/me", {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
            window.location.href = '/FE/HTML/DangNhap.html';
            return false;
        }
        return true;
    } catch (error) {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
        window.location.href = '/FE/HTML/DangNhap.html';
        return false;
    }
}


// Khởi tạo
// Sửa đổi hàm DOMContentLoaded để thêm check auth
document.addEventListener('DOMContentLoaded', async () => {
    // ✅ Kiểm tra auth trước khi load
    const isAuth = await checkAuth_Ad();
    if (!isAuth) return;

    initializeSocket();
    loadUsers();
    loadStats();

    const userSearchInput = document.getElementById('userSearch') as HTMLInputElement;
    userSearchInput?.addEventListener('input', (e) => {
        filterUsers((e.target as HTMLInputElement).value);
    });

    const sendNotificationForm = document.getElementById('sendNotificationForm') as HTMLFormElement;
    sendNotificationForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        sendNotification();
    });
});

// ✅ Khởi tạo Socket.IO connection với error handling tốt hơn
function initializeSocket(): void {
    try {
        // Kiểm tra Socket.IO client có được load chưa
        if (typeof (window as any).io === 'undefined') {
            console.error('❌ Socket.IO client chưa được load! Thêm script tag cho Socket.IO');
            return;
        }

        console.log('🔌 Initializing Socket.IO connection...');

        socket = (window as any).io('http://localhost:3000', {
            transports: ['websocket', 'polling'],
            timeout: 20000,
            forceNew: true
        });

        socket.on('connect', () => {
            console.log('✅ Admin socket connected:', socket.id);
            isSocketReady = true; // ✅ Đánh dấu socket ready

            // ✅ Rejoin room nếu có user đã được chọn
            if (selectedUserId) {
                joinUserRoom(selectedUserId);
            }
        });

        socket.on('disconnect', (reason: any) => {
            console.log('⚠️ Admin socket disconnected:', reason);
            isSocketReady = false;

            // Auto reconnect sau 2 giây
            setTimeout(() => {
                if (!socket.connected) {
                    console.log('🔄 Attempting to reconnect...');
                    socket.connect();
                }
            }, 2000);
        });

        socket.on('reconnect', (attemptNumber: number) => {
            console.log('✅ Socket reconnected after', attemptNumber, 'attempts');
            isSocketReady = true;

            // Rejoin room
            if (selectedUserId) {
                joinUserRoom(selectedUserId);
            }
        });

        // ✅ Lắng nghe thông báo mới
        socket.on('thong-bao-moi', (newNotification: any) => {
            console.log('🔔 Admin received new notification:', newNotification);

            // Chỉ cập nhật nếu thông báo này dành cho user đang được chọn
            if (selectedUserId && newNotification.nguoi_dung_id === selectedUserId) {
                const formattedNotification: Notification2 = {
                    _id: newNotification.id,
                    tieu_de: newNotification.tieu_de,
                    noi_dung: newNotification.noi_dung,
                    ngay_tao: newNotification.ngay_tao
                };

                // ✅ Kiểm tra duplicate trước khi thêm
                const exists = currentNotifications.find(n => n._id === newNotification.id);
                if (!exists) {
                    currentNotifications.unshift(formattedNotification);
                    displayNotifications(currentNotifications);
                    updateStats();
                }

                showToast('Thông báo mới đã được gửi thành công!', 'success');
            }
        });

        // ✅ Thêm: Lắng nghe event khi thông báo bị xóa từ client khác
        socket.on('thong-bao-deleted', (data: any) => {
            console.log('🗑️ Notification deleted from another client:', data.thongBaoId);

            // Update UI nếu đang xem user này
            const notification = currentNotifications.find(n => n._id === data.thongBaoId);
            if (notification) {
                currentNotifications = currentNotifications.filter(n => n._id !== data.thongBaoId);
                displayNotifications(currentNotifications);
                updateStats();
                showToast('Thông báo đã được xóa', 'info');
            }
        });

        // ✅ Thêm: Lắng nghe event mark as read
        socket.on('thong-bao-mark-read', (data: any) => {
            console.log('📖 Notification marked as read:', data.thongBaoId);
            // Admin panel không cần xử lý vì không hiển thị trạng thái đã đọc
        });

        socket.on('connect_error', (error: any) => {
            console.error('❌ Admin socket connection error:', error);
            isSocketReady = false;
            showToast('Lỗi kết nối Socket.IO', 'error');
        });

        // Debug: Log tất cả events
        socket.onAny((eventName: string, ...args: any[]) => {
            if (!['connect', 'disconnect', 'ping', 'pong'].includes(eventName)) {
                console.log('📡 Admin socket event:', eventName, args);
            }
        });

    } catch (error) {
        console.error('❌ Lỗi khởi tạo Socket.IO:', error);
        showToast('Lỗi khởi tạo hệ thống thông báo', 'error');
    }
}

// ✅ Hàm join room với validation tốt hơn
function joinUserRoom(userId: string): void {
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
function leaveUserRoom(userId: string): void {
    if (!socket || !socket.connected) {
        console.warn('⚠️ Socket không khả dụng để leave room');
        return;
    }

    // ✅ Tạo custom event để leave room (backend cần thêm handler)
    socket.emit('leave-user-room', userId);
    console.log('🚪 Admin left room for user:', userId);
}

// Sửa đổi hàm loadUsers để sử dụng auth headers
async function loadUsers(): Promise<void> {
    try {
        const response = await fetch('http://localhost:3000/api/nguoi-dung/', {
            headers: getAuthHeaders_Ad() // ✅ Thêm auth headers
        });
        if (!response.ok) throw new Error('Không thể tải danh sách người dùng');

        const rawUsers = await response.json();

        // ✅ Validation dữ liệu
        if (!Array.isArray(rawUsers)) {
            throw new Error('Dữ liệu người dùng không hợp lệ');
        }

        allUsers = rawUsers.map((u: any) => ({
            id: u._id || u.id,
            name: `${u._ho || ''} ${u._ten || ''}`.trim() || 'Không có tên',
            email: u._email || u.email || 'Không có email'
        }));

        console.log('✅ Loaded', allUsers.length, 'users');
    } catch (error) {
        console.error('❌ Lỗi khi tải danh sách người dùng:', error);
        showToast('Không thể tải danh sách người dùng', 'error');
        allUsers = [];
    }
    displayUsers(allUsers);
    updateStats();
}
// Hiển thị danh sách người dùng
function displayUsers(users: User_Ad[]): void {
    const userList = document.getElementById('userList') as HTMLElement;

    if (!userList) {
        console.error('❌ Không tìm thấy element userList');
        return;
    }

    if (users.length === 0) {
        userList.innerHTML = '<div class="empty-state"><p>Không tìm thấy người dùng nào</p></div>';
        return;
    }

    userList.innerHTML = users.map(user => `
        <div class="user-item ${selectedUserId === user.id ? 'selected' : ''}" 
             onclick="selectUser('${user.id}')">
            <div class="user-info">
                <div class="user-name">${escapeHtml(user.name)}</div>
                <div class="user-email">${escapeHtml(user.email)}</div>
            </div>
        </div>
    `).join('');
}

// ✅ Thêm function escape HTML
function escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function (m) { return map[m]; });
}

// Lọc người dùng
function filterUsers(searchTerm: string): void {
    const filtered = allUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    displayUsers(filtered);
}

// ✅ Chọn người dùng với validation tốt hơn
async function selectUser(userId: string): Promise<void> {
    if (!userId) {
        console.error('❌ Invalid userId');
        return;
    }

    try {
        // Leave previous room
        if (selectedUserId && selectedUserId !== userId) {
            leaveUserRoom(selectedUserId);
        }

        selectedUserId = userId;
        displayUsers(allUsers);

        // Show loading state
        const notificationsSection = document.getElementById('notificationsSection') as HTMLElement;
        if (notificationsSection) {
            notificationsSection.innerHTML = '<div class="loading">⏳ Đang tải thông báo...</div>';
        }

        // Join new room (chỉ khi socket ready)
        if (isSocketReady) {
            joinUserRoom(userId);
        } else {
            console.warn('⚠️ Socket chưa ready, sẽ join room khi kết nối lại');
        }

        await loadUserNotifications(userId);

    } catch (error) {
        console.error('❌ Lỗi khi chọn user:', error);
        showToast('Lỗi khi tải thông tin người dùng', 'error');
    }
}

// Tải thông báo của người dùng từ API
async function loadUserNotifications(userId: string): Promise<void> {
    const notificationsSection = document.getElementById('notificationsSection') as HTMLElement;

    if (!notificationsSection) {
        console.error('❌ Không tìm thấy notificationsSection');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/thong-bao/${userId}`, {
            headers: getAuthHeaders_Ad() // ✅ Thêm auth headers
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const rawNotis = await response.json();

        // ✅ Validation dữ liệu
        if (!Array.isArray(rawNotis)) {
            throw new Error('Dữ liệu thông báo không hợp lệ');
        }

        currentNotifications = rawNotis.map((n: any) => ({
            _id: n.id || n._id,
            tieu_de: n.tieu_de || '',
            noi_dung: n.noi_dung || '',
            ngay_tao: n.ngay_tao || new Date().toISOString()
        }));

        console.log('✅ Loaded', currentNotifications.length, 'notifications for user:', userId);

    } catch (error) {
        console.error('❌ Lỗi khi tải thông báo:', error);
        notificationsSection.innerHTML = `
            <div class="empty-state">
                <p style="color: #e41e3f;">❌ Lỗi khi tải thông báo: ${(error as Error).message}</p>
                <button onclick="loadUserNotifications('${userId}')" style="margin-top: 10px; padding: 8px 16px; background: #1877f2; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    🔄 Thử lại
                </button>
            </div>
        `;
        currentNotifications = [];
        return;
    }

    displayNotifications(currentNotifications);
    updateStats();
}

// Hiển thị thông báo
function displayNotifications(notifications: Notification2[]): void {
    const notificationsSection = document.getElementById('notificationsSection') as HTMLElement;

    if (!notificationsSection) {
        console.error('❌ Không tìm thấy notificationsSection');
        return;
    }

    if (notifications.length === 0) {
        notificationsSection.innerHTML = `
            <div class="empty-state">
                <p>📭 Người dùng này chưa có thông báo nào</p>
            </div>
        `;
        return;
    }

    // ✅ Sort by date descending
    const sortedNotifications = [...notifications].sort((a, b) =>
        new Date(b.ngay_tao).getTime() - new Date(a.ngay_tao).getTime()
    );

    notificationsSection.innerHTML = sortedNotifications.map(notification => `
        <div class="notification-item" id="notification-${notification._id}">
            <div class="notification-header">
                <div>
                    <div class="notification-title">${escapeHtml(notification.tieu_de)}</div>
                    <div class="notification-date">${formatDate(notification.ngay_tao)}</div>
                </div>
            </div>
            <div class="notification-content">${escapeHtml(notification.noi_dung)}</div>
            <div class="notification-actions">
                <button class="btn btn-danger btn-sm" onclick="confirmDelete('${notification._id}')">🗑️ Xóa</button>
            </div>
        </div>
    `).join('');
}

// ✅ Gửi thông báo với validation tốt hơn
async function sendNotification(): Promise<void> {
    // Validation cơ bản
    if (!selectedUserId) {
        showToast('❌ Vui lòng chọn người dùng trước khi gửi thông báo!', 'error');
        return;
    }

    const titleInput = document.getElementById('notificationTitle') as HTMLInputElement;
    const contentInput = document.getElementById('notificationContent') as HTMLInputElement;

    if (!titleInput || !contentInput) {
        console.error('❌ Không tìm thấy input elements');
        return;
    }

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    // Validation nội dung
    if (!title || !content) {
        showToast('❌ Vui lòng điền đầy đủ tiêu đề và nội dung!', 'error');
        return;
    }

    if (title.length > 200) {
        showToast('❌ Tiêu đề không được quá 200 ký tự!', 'error');
        return;
    }

    if (content.length > 1000) {
        showToast('❌ Nội dung không được quá 1000 ký tự!', 'error');
        return;
    }

    // Disable form để tránh spam
    const sendButton = document.querySelector('#sendNotificationForm button[type="submit"]') as HTMLButtonElement;
    if (sendButton) {
        sendButton.disabled = true;
        sendButton.textContent = '⏳ Đang gửi...';
    }

    try {
        console.log('📤 Sending notification to user:', selectedUserId);

        const response = await fetch('http://localhost:3000/api/thong-bao', {
            method: 'POST',
            headers: getAuthHeaders_Ad(), // ✅ Thêm auth headers
            body: JSON.stringify({
                nguoi_dung_id: selectedUserId,
                tieu_de: title,
                noi_dung: content
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('✅ Notification sent successfully:', result);

        // Clear form
        titleInput.value = '';
        contentInput.value = '';

        showToast('✅ Gửi thông báo thành công!', 'success');

    } catch (error) {
        console.error('❌ Lỗi khi gửi thông báo:', error);
        showToast(`❌ Lỗi khi gửi thông báo: ${(error as Error).message}`, 'error');
    } finally {
        // Re-enable form
        if (sendButton) {
            sendButton.disabled = false;
            sendButton.textContent = '📤 Gửi thông báo';
        }
    }
}

// Xác nhận xóa
function confirmDelete(notificationId: string): void {
    const confirmMessage = document.getElementById('confirmMessage') as HTMLElement;
    const confirmButton = document.getElementById('confirmButton') as HTMLButtonElement;
    const confirmModal = document.getElementById('confirmModal') as HTMLElement;

    if (!confirmMessage || !confirmButton || !confirmModal) {
        console.error('❌ Không tìm thấy modal elements');
        return;
    }

    confirmMessage.textContent = 'Bạn có chắc chắn muốn xóa thông báo này không?';
    confirmButton.onclick = () => deleteNotification(notificationId);
    confirmModal.style.display = 'block';
}

// Xóa thông báo
async function deleteNotification(notificationId: string): Promise<void> {
    try {
        console.log('🗑️ Deleting notification:', notificationId);

        const response = await fetch(`http://localhost:3000/api/thong-bao/${notificationId}`, {
            method: 'DELETE',
            headers: getAuthHeaders_Ad() // ✅ Thêm auth headers
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${response.status}`);
        }

        closeModal();

        // Xóa khỏi mảng local và cập nhật UI
        currentNotifications = currentNotifications.filter(n => n._id !== notificationId);
        displayNotifications(currentNotifications);
        updateStats();

        showToast('✅ Xóa thông báo thành công!', 'success');

    } catch (error) {
        console.error('❌ Lỗi khi xóa thông báo:', error);
        showToast(`❌ Lỗi khi xóa: ${(error as Error).message}`, 'error');
    }
}

// Đóng modal
function closeModal(): void {
    const confirmModal = document.getElementById('confirmModal') as HTMLElement;
    if (confirmModal) {
        confirmModal.style.display = 'none';
    }
}

// Cập nhật thống kê
function updateStats(): void {
    const totalUsersEl = document.getElementById('totalUsers') as HTMLElement;
    const totalNotificationsEl = document.getElementById('totalNotifications') as HTMLElement;

    if (totalUsersEl) totalUsersEl.textContent = allUsers.length.toString();
    if (totalNotificationsEl) totalNotificationsEl.textContent = currentNotifications.length.toString();
}

// Tải thống kê chung
async function loadStats(): Promise<void> {
    updateStats();
}

// Format ngày tháng
function formatDate(dateString: string): string {
    try {
        const date = new Date(dateString);
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
    } catch (error) {
        console.error('❌ Lỗi format date:', error);
        return 'Lỗi ngày tháng';
    }
}

// ✅ Hiển thị toast notification với styles tốt hơn
function showToast(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const colors = {
        success: '#4CAF50',
        error: '#f44336',
        info: '#2196F3'
    };

    toast.style.cssText = `
        background: ${colors[type]};
        color: white;
        padding: 12px 20px;
        margin-bottom: 10px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 350px;
        word-wrap: break-word;
        pointer-events: auto;
    `;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    }, 4000);
}

// ✅ Test function cho Socket
function testSocket(): boolean {
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
(window as any).onclick = function (event: MouseEvent) {
    const modal = document.getElementById('confirmModal') as HTMLElement;
    if (event.target === modal) {
        closeModal();
    }
};

// ✅ Gắn các hàm global cho onclick trong HTML
(window as any).selectUser = selectUser;
(window as any).confirmDelete = confirmDelete;
(window as any).closeModal = closeModal;
(window as any).testSocket = testSocket;