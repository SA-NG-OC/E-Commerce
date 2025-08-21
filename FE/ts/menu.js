
function getAuthHeaders7() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}
// Fixed Notification Manager Class
class NotificationManager {
    constructor() {
        this.notifications = [];
        this.isDropdownOpen = false;
        this.userId = this.getId();
        this.socket = null;

        if (!this.userId) {
            console.warn('User chưa đăng nhập - Notification system disabled');
            return;
        }

        console.log('🎯 Initializing NotificationManager for user:', this.userId);

        this.initializeElements();
        this.bindEvents();
        this.setupSocketConnection();
        this.loadNotifications();
    }

    getId() {
        try {
            const userContext = localStorage.getItem('usercontext');
            if (!userContext) return null;

            const user = JSON.parse(userContext);
            console.log('👤 User context:', user);
            return user._id || user.id || null; // Thêm fallback cho user.id
        } catch (error) {
            console.error('Error getting user ID:', error);
            return null;
        }
    }

    initializeElements() {
        this.bellButton = document.getElementById('notificationBell');
        this.badge = document.getElementById('notificationBadge');
        this.dropdown = document.getElementById('notificationDropdown');
        this.notificationList = document.getElementById('notificationList');
        this.markAllReadBtn = document.getElementById('markAllRead');

        console.log('🔍 Elements found:', {
            bellButton: !!this.bellButton,
            badge: !!this.badge,
            dropdown: !!this.dropdown,
            notificationList: !!this.notificationList,
            markAllReadBtn: !!this.markAllReadBtn
        });
    }

    bindEvents() {
        if (!this.bellButton) {
            console.warn('⚠️ Notification bell button not found!');
            return;
        }

        this.bellButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });

        document.addEventListener('click', (e) => {
            if (this.dropdown && !this.dropdown.contains(e.target) && !this.bellButton.contains(e.target)) {
                this.closeDropdown();
            }
        });

        if (this.markAllReadBtn) {
            this.markAllReadBtn.addEventListener('click', () => {
                this.markAllAsRead();
            });
        }
    }

    toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
        if (this.isDropdownOpen) {
            this.openDropdown();
        } else {
            this.closeDropdown();
        }
    }

    openDropdown() {
        if (this.dropdown) {
            this.dropdown.classList.add('show');
        }
        if (this.bellButton) {
            this.bellButton.classList.add('active');
        }
        this.isDropdownOpen = true;
    }

    closeDropdown() {
        if (this.dropdown) {
            this.dropdown.classList.remove('show');
        }
        if (this.bellButton) {
            this.bellButton.classList.remove('active');
        }
        this.isDropdownOpen = false;
    }

    setupSocketConnection() {
        try {
            if (typeof io === 'undefined') {
                console.error('❌ Socket.IO client chưa được load! Thêm script: <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.0.1/socket.io.js"></script>');
                return;
            }

            console.log('🔌 Connecting to Socket.IO...');

            this.socket = io('http://localhost:3000', {
                transports: ['websocket', 'polling'],
                timeout: 20000,
                forceNew: true
            });

            // ✅ Fix: Sử dụng đúng event name
            this.socket.on('connect', () => {
                console.log('✅ Socket connected:', this.socket.id);

                // ✅ Fix: Sử dụng đúng event name từ backend
                this.socket.emit('join-user-room', this.userId);  // Đã sửa từ 'join-room'
                console.log('🏠 Joined room for user:', this.userId);
            });

            // ✅ Lắng nghe thông báo mới
            this.socket.on('thong-bao-moi', (notification) => {
                console.log('🔔 Received notification:', notification);

                // ✅ Fix: So sánh chính xác user ID
                if (notification.nguoi_dung_id === this.userId) {
                    console.log('📨 Processing notification for current user');
                    this.addNewNotification(notification);
                    this.showInstantNotification(notification);
                } else {
                    console.log('🚫 Notification not for current user:', notification.nguoi_dung_id, 'vs', this.userId);
                }
            });

            // ✅ Thêm: Lắng nghe các event khác từ backend
            this.socket.on('thong-bao-mark-all-read', () => {
                console.log('📖 All notifications marked as read from server');
                this.notifications.forEach(n => n.da_doc = true);
                this.renderNotifications();
                this.updateBadge();
            });

            this.socket.on('thong-bao-mark-read', (data) => {
                console.log('📖 Notification marked as read from server:', data.thongBaoId);
                const notification = this.notifications.find(n => n.id === data.thongBaoId);
                if (notification) {
                    notification.da_doc = true;
                    this.renderNotifications();
                    this.updateBadge();
                }
            });

            this.socket.on('thong-bao-deleted', (data) => {
                console.log('🗑️ Notification deleted from server:', data.thongBaoId);
                this.notifications = this.notifications.filter(n => n.id !== data.thongBaoId);
                this.renderNotifications();
                this.updateBadge();
            });

            this.socket.on('disconnect', (reason) => {
                console.log('⚠️ Socket disconnected:', reason);

                setTimeout(() => {
                    if (!this.socket.connected) {
                        console.log('🔄 Attempting to reconnect...');
                        this.socket.connect();
                    }
                }, 2000);
            });

            this.socket.on('reconnect', (attemptNumber) => {
                console.log('✅ Socket reconnected after', attemptNumber, 'attempts');
                this.socket.emit('join-user-room', this.userId); // ✅ Fix: Đã sửa event name
            });

            this.socket.on('connect_error', (error) => {
                console.error('❌ Socket connection error:', error);
                console.error('- Kiểm tra server có chạy không?');
                console.error('- Kiểm tra port 3000 có đúng không?');
                console.error('- Kiểm tra CORS settings');
            });

            // Debug: Log tất cả events  
            this.socket.onAny((eventName, ...args) => {
                if (eventName !== 'connect' && eventName !== 'disconnect') {
                    console.log('📡 Socket event:', eventName, args);
                }
            });

        } catch (error) {
            console.error('❌ Lỗi khởi tạo Socket.IO:', error);
        }
    }

    showInstantNotification(notification) {
        // ✅ Kiểm tra duplicate toast
        const existingToast = document.querySelector(`[data-notification-id="${notification.id}"]`);
        if (existingToast) {
            console.log('🚫 Toast already exists for notification:', notification.id);
            return;
        }

        const toast = document.createElement('div');
        toast.className = 'instant-notification';
        toast.setAttribute('data-notification-id', notification.id); // ✅ Thêm identifier
        toast.innerHTML = `
            <div class="instant-notification-content">
                <div class="instant-notification-icon">🔔</div>
                <div class="instant-notification-text">
                    <div class="instant-notification-title">${this.escapeHtml(notification.tieu_de)}</div>
                    <div class="instant-notification-message">${this.escapeHtml(notification.noi_dung)}</div>
                </div>
                <button class="instant-notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            padding: 16px;
            max-width: 350px;
            z-index: 10000;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }
        }, 5000);
    }

    // ✅ Thêm method để escape HTML
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function (m) { return map[m]; });
    }

    async loadNotifications() {
        if (!this.userId) {
            console.error('Không có user ID để tải thông báo');
            return;
        }

        console.log('📥 Loading notifications for user:', this.userId);

        try {
            const response = await fetch(`http://localhost:3000/api/thong-bao/${this.userId}`, {
                method: 'GET',
                headers: getAuthHeaders7()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const notifications = await response.json();
            console.log('✅ Loaded notifications:', notifications);

            // ✅ Validation dữ liệu
            this.notifications = Array.isArray(notifications) ? notifications : [];
            this.renderNotifications();
            this.updateBadge();

            console.log('✅ Đã tải thành công', this.notifications.length, 'thông báo');
        } catch (error) {
            console.error('❌ Lỗi khi tải thông báo:', error);
            this.showErrorMessage('Không thể tải thông báo. Vui lòng thử lại sau.');
            this.notifications = [];
            this.renderNotifications();
            this.updateBadge();
        }
    }

    showErrorMessage(message) {
        if (!this.notificationList) return;

        this.notificationList.innerHTML = `
            <div class="empty-notifications">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p style="color: #e41e3f;">${message}</p>
                <button onclick="window.notificationManager.loadNotifications()" 
                        style="margin-top: 10px; padding: 6px 12px; background: #1877f2; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Thử lại
                </button>
            </div>
        `;
    }

    renderNotifications() {
        if (!this.notificationList) {
            console.warn('⚠️ Notification list element not found!');
            return;
        }

        if (this.notifications.length === 0) {
            this.notificationList.innerHTML = `
                <div class="empty-notifications">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                    <p>Không có thông báo nào</p>
                </div>
            `;
            return;
        }

        const html = this.notifications
            .sort((a, b) => new Date(b.ngay_tao) - new Date(a.ngay_tao))
            .map(notification => this.createNotificationHTML(notification))
            .join('');

        this.notificationList.innerHTML = html;
    }

    createNotificationHTML(notification) {
        const timeAgo = this.getTimeAgo(notification.ngay_tao);
        const isUnread = !notification.da_doc;

        return `
            <div class="notification-item ${isUnread ? 'unread' : ''}" data-id="${notification.id}">
                <div class="notification-content" onclick="window.notificationManager.markAsRead('${notification.id}')">
                    <div class="notification-title">${this.escapeHtml(notification.tieu_de)}</div>
                    <div class="notification-message">${this.escapeHtml(notification.noi_dung)}</div>
                    <div class="notification-time">${timeAgo}</div>
                </div>
                <div class="notification-actions">
                    ${isUnread ? `
                        <button class="action-btn read" onclick="window.notificationManager.markAsRead('${notification.id}')" title="Đánh dấu đã đọc">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="20,6 9,17 4,12"/>
                            </svg>
                        </button>
                    ` : ''}
                    <button class="action-btn delete" onclick="window.notificationManager.deleteNotification('${notification.id}')" title="Xóa thông báo">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3,6 5,6 21,6"/>
                            <path d="M19,6V20a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6M8,6V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }

    async markAsRead(notificationId) {
        console.log('📖 Marking as read:', notificationId);

        try {
            const response = await fetch(`http://localhost:3000/api/thong-bao/${notificationId}/mark-read`, {
                method: 'POST',
                headers: getAuthHeaders7()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const notification = this.notifications.find(n => n.id === notificationId);
            if (notification && !notification.da_doc) {
                notification.da_doc = true;
                this.renderNotifications();
                this.updateBadge();
                console.log('✅ Marked as read successfully');
            }
        } catch (error) {
            console.error('❌ Lỗi khi đánh dấu đã đọc:', error);
        }
    }

    async deleteNotification(notificationId) {
        console.log('🗑️ Deleting notification:', notificationId);

        try {
            const response = await fetch(`http://localhost:3000/api/thong-bao/${notificationId}`, {
                headers: getAuthHeaders7(),
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.notifications = this.notifications.filter(n => n.id !== notificationId);
            this.renderNotifications();
            this.updateBadge();
            console.log('✅ Deleted successfully');
        } catch (error) {
            console.error('❌ Lỗi khi xóa thông báo:', error);
        }
    }

    async markAllAsRead() {
        console.log('📖 Marking all as read for user:', this.userId);

        try {
            const response = await fetch(`http://localhost:3000/api/thong-bao/mark-all-read/${this.userId}`, {
                method: 'POST',
                headers: getAuthHeaders7()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.notifications.forEach(n => n.da_doc = true);
            this.renderNotifications();
            this.updateBadge();
            console.log('✅ Marked all as read successfully');
        } catch (error) {
            console.error('❌ Lỗi khi đánh dấu tất cả đã đọc:', error);
        }
    }

    updateBadge() {
        if (!this.badge) return;

        const unreadCount = this.notifications.filter(n => !n.da_doc).length;
        console.log('🔢 Unread count:', unreadCount);

        if (unreadCount > 0) {
            this.badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
            this.badge.classList.add('show');
        } else {
            this.badge.classList.remove('show');
        }
    }

    animateBadge() {
        if (!this.badge) return;

        this.badge.classList.add('bounce');
        setTimeout(() => {
            this.badge.classList.remove('bounce');
        }, 600);
    }

    addNewNotification(notification) {
        console.log('➕ Adding new notification:', notification);

        // ✅ Kiểm tra duplicate notification
        const exists = this.notifications.find(n => n.id === notification.id);
        if (exists) {
            console.log('🚫 Notification already exists:', notification.id);
            return;
        }

        const formattedNotification = {
            id: notification.id,
            tieu_de: notification.tieu_de,
            noi_dung: notification.noi_dung,
            ngay_tao: notification.ngay_tao,
            da_doc: false
        };

        this.notifications.unshift(formattedNotification);
        this.renderNotifications();
        this.updateBadge();
        this.animateBadge();

        setTimeout(() => {
            const newItem = document.querySelector(`[data-id="${notification.id}"]`);
            if (newItem) {
                newItem.classList.add('new-notification');
                newItem.style.backgroundColor = '#e3f2fd';

                setTimeout(() => {
                    newItem.classList.remove('new-notification');
                    newItem.style.backgroundColor = '';
                }, 3000);
            }
        }, 100);

        console.log('✅ New notification added successfully');
    }

    getTimeAgo(dateString) {
        const now = new Date();
        const date = new Date(dateString);
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 1) return 'Vừa xong';
        if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} giờ trước`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays} ngày trước`;

        return date.toLocaleDateString('vi-VN');
    }

    testSocket() {
        if (this.socket && this.socket.connected) {
            console.log('✅ Socket is connected and ready');
            this.socket.emit('test-message', { userId: this.userId, message: 'Test from client' });
            return true;
        } else {
            console.error('❌ Socket is not connected');
            return false;
        }
    }

    destroy() {
        console.log('🧹 Cleaning up NotificationManager...');

        if (this.socket) {
            this.socket.emit('leave-room', this.userId);
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

window.NotificationManager = NotificationManager;

// AdminNavigation Class (updated)
class AdminNavigation {
    constructor() {
        this.contentFrame = document.getElementById('contentFrame');
        this.welcomeMessage = document.getElementById('welcomeMessage');
        this.menuLinks = document.querySelectorAll('.nav-item');
        this.mobileToggle = document.getElementById('mobileToggle');
        this.navMenu = document.getElementById('navMenu');
        this.currentPage = null;

        // Search elements
        this.searchInput = document.querySelector('.search-input');
        this.searchBtn = document.querySelector('.search-btn');
        this.searchResults = null;
        this.searchTimeout = null;
        this.allProducts = []; // Cache for products

        this.init();
    }

    init() {
        this.attachEventListeners();
        this.loadSavedPage();
        this.createSearchResultsContainer();
        this.loadAllProducts(); // Load products for search
    }

    createSearchResultsContainer() {
        // Create search results dropdown
        const searchContainer = document.querySelector('.search-container');
        if (!searchContainer) return;

        this.searchResults = document.createElement('div');
        this.searchResults.className = 'search-results';
        this.searchResults.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            max-height: 400px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        searchContainer.appendChild(this.searchResults);
        searchContainer.style.position = 'relative';
    }

    async loadAllProducts() {
        try {
            const response = await fetch('http://localhost:3000/api/san-pham/',
                {
                    header: getAuthHeaders7()
                }
            );
            if (response.ok) {
                this.allProducts = await response.json();
                console.log('✅ Đã tải danh sách sản phẩm cho tìm kiếm');
            } else {
                console.error('❌ Không thể tải danh sách sản phẩm');
            }
        } catch (error) {
            console.error('❌ Lỗi khi tải sản phẩm:', error);
        }
    }

    attachEventListeners() {
        // Menu link events
        this.menuLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleMenuClick(e));
        });

        // Mobile toggle event
        if (this.mobileToggle) {
            this.mobileToggle.addEventListener('click', () => {
                this.navMenu.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.navMenu && this.mobileToggle &&
                !this.navMenu.contains(e.target) && !this.mobileToggle.contains(e.target)) {
                this.navMenu.classList.remove('active');
            }

            // Close search results when clicking outside
            if (!e.target.closest('.search-container')) {
                this.hideSearchResults();
            }
        });

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.navMenu) this.navMenu.classList.remove('active');
                this.hideSearchResults();
                if (!this.currentPage) {
                    this.showWelcome();
                }
            }
        });

        // Enhanced search functionality
        if (this.searchBtn) {
            this.searchBtn.addEventListener('click', () => this.performSearch());
        }

        // Real-time search with debounce
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                clearTimeout(this.searchTimeout);
                const query = e.target.value.trim();

                if (query.length === 0) {
                    this.hideSearchResults();
                    return;
                }

                this.searchTimeout = setTimeout(() => {
                    this.performRealTimeSearch(query);
                }, 300); // Debounce 300ms
            });

            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        }

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.navMenu) {
                this.navMenu.classList.remove('active');
            }
        });
    }

    performRealTimeSearch(query) {
        if (!this.allProducts || this.allProducts.length === 0) {
            this.showSearchMessage('Đang tải dữ liệu sản phẩm...');
            return;
        }

        const results = this.searchProducts(query);
        this.displaySearchResults(results, query);
    }

    searchProducts(query) {
        const searchTerm = query.toLowerCase().trim();

        return this.allProducts.filter(product => {
            const tenSanPham = product._ten_san_pham?.toLowerCase() || '';
            const maSanPham = product._ma_san_pham?.toLowerCase() || '';
            const danhMuc = product._danh_muc?.toLowerCase() || '';
            const thuongHieu = product._thuong_hieu?.toLowerCase() || '';

            return tenSanPham.includes(searchTerm) ||
                maSanPham.includes(searchTerm) ||
                danhMuc.includes(searchTerm) ||
                thuongHieu.includes(searchTerm);
        }).slice(0, 8); // Limit to 8 results
    }

    displaySearchResults(results, query) {
        if (!this.searchResults) return;

        if (results.length === 0) {
            this.showSearchMessage(`Không tìm thấy sản phẩm nào cho "${query}"`);
            return;
        }

        let html = `<div style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #eee; color: #666;">
            Tìm thấy ${results.length} sản phẩm
        </div>`;

        results.forEach(product => {
            const image = product._danh_sach_hinh_anh && product._danh_sach_hinh_anh.length > 0
                ? product._danh_sach_hinh_anh[0]._duong_dan_hinh_anh
                : '/images/no-image.jpg';

            const price = new Intl.NumberFormat('vi-VN').format(product._gia_ban);

            html += `
                <div class="search-result-item" data-product-id="${product._id}" style="
                    display: flex;
                    align-items: center;
                    padding: 12px;
                    cursor: pointer;
                    border-bottom: 1px solid #f0f0f0;
                    transition: background-color 0.2s;
                " onmouseover="this.style.backgroundColor='#f8f9fa'" 
                   onmouseout="this.style.backgroundColor='white'">
                    <img src="${image}" alt="${product._ten_san_pham}" style="
                        width: 50px;
                        height: 50px;
                        object-fit: cover;
                        border-radius: 6px;
                        margin-right: 12px;
                    " onerror="this.src='/images/no-image.jpg'">
                    <div style="flex: 1;">
                        <div style="font-weight: 500; color: #333; margin-bottom: 4px;">
                            ${product._ten_san_pham}
                        </div>
                        <div style="font-size: 0.9em; color: #666; margin-bottom: 2px;">
                            ${product._thuong_hieu} • ${product._danh_muc}
                        </div>
                        <div style="font-weight: bold; color: #e74c3c;">
                            ${price} ₫
                        </div>
                    </div>
                    <i class="fas fa-arrow-right" style="color: #ccc; margin-left: 8px;"></i>
                </div>
            `;
        });

        this.searchResults.innerHTML = html;
        this.searchResults.style.display = 'block';

        // Add click handlers to search results
        this.searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const productId = item.getAttribute('data-product-id');
                this.navigateToProductDetail(productId);
                this.hideSearchResults();
                if (this.searchInput) this.searchInput.value = '';
            });
        });
    }

    showSearchMessage(message) {
        if (!this.searchResults) return;

        this.searchResults.innerHTML = `
            <div style="padding: 20px; text-align: center; color: #666;">
                <i class="fas fa-search" style="font-size: 2em; margin-bottom: 8px; opacity: 0.5;"></i>
                <div>${message}</div>
            </div>
        `;
        this.searchResults.style.display = 'block';
    }

    hideSearchResults() {
        if (this.searchResults) {
            this.searchResults.style.display = 'none';
        }
    }

    navigateToProductDetail(productId) {
        // Navigate to product detail page with ID parameter
        const detailPage = `chiTietSanPham.html?id=${productId}`;

        // Update active state (remove active from all menu items since this is a search result)
        this.menuLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Load the product detail page
        this.loadPage(detailPage);

        // Save current page
        this.saveCurrentPage(detailPage);

        // Show success feedback
        this.showSuccessFeedback('Chi tiết sản phẩm');

        console.log(`🔍 Navigating to product detail: ${productId}`);
    }

    handleMenuClick(event) {
        event.preventDefault();

        const clickedLink = event.currentTarget;
        const pageName = clickedLink.dataset.page;

        if (!pageName) return;

        // Close mobile menu and hide search results
        if (this.navMenu) this.navMenu.classList.remove('active');
        this.hideSearchResults();

        // Update active state
        this.updateActiveState(clickedLink);

        // Load page
        this.loadPage(pageName);

        // Save current page
        this.saveCurrentPage(pageName);

        // Show success feedback
        const pageText = clickedLink.querySelector('.nav-text').textContent.trim();
        this.showSuccessFeedback(pageText);
    }

    updateActiveState(activeLink) {
        this.menuLinks.forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    loadPage(pageName) {
        try {
            // Add navigating class for smooth transition
            document.body.classList.add('navigating');

            // Hide welcome message
            if (this.welcomeMessage) this.welcomeMessage.style.display = 'none';

            // Show content frame
            if (this.contentFrame) {
                this.contentFrame.style.display = 'block';
                this.contentFrame.src = pageName;
            }
            this.currentPage = pageName;

            // Loading indicator
            this.showLoadingIndicator();

            // Handle iframe load events
            if (this.contentFrame) {
                this.contentFrame.onload = () => {
                    this.hideLoadingIndicator();
                    document.body.classList.remove('navigating');
                    this.initializePageScripts(pageName);
                };

                this.contentFrame.onerror = () => {
                    this.hideLoadingIndicator();
                    document.body.classList.remove('navigating');
                    this.showError(`Không thể tải trang: ${pageName}`);
                };
            }

        } catch (error) {
            console.error('Lỗi khi load trang:', error);
            document.body.classList.remove('navigating');
            this.showError('Có lỗi xảy ra khi tải trang');
        }
    }

    showLoadingIndicator() {
        const loader = document.createElement('div');
        loader.id = 'pageLoader';
        loader.className = 'loading-indicator';
        loader.innerHTML = `
            <div class="spinner"></div>
            <span>Đang tải trang...</span>
        `;
        document.body.appendChild(loader);
    }

    hideLoadingIndicator() {
        const loader = document.getElementById('pageLoader');
        if (loader) {
            loader.remove();
        }
    }

    showSuccessFeedback(pageName) {
        const feedback = document.createElement('div');
        feedback.className = 'success-feedback';
        feedback.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Đã chuyển đến: ${pageName}</span>
        `;
        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.remove();
        }, 3000);
    }

    initializePageScripts(pageName) {
        try {
            console.log(`🚀 Page loaded: ${pageName}`);

            // Dispatch custom event
            const event = new CustomEvent('pageLoaded', {
                detail: {
                    pageName: pageName,
                    timestamp: new Date().toISOString()
                }
            });
            window.dispatchEvent(event);

        } catch (error) {
            console.error('Lỗi khi initialize page scripts:', error);
        }
    }

    loadSavedPage() {
        const savedPage = this.getSavedPage();
        if (savedPage) {
            const savedLink = document.querySelector(`[data-page="${savedPage}"]`);
            if (savedLink) {
                setTimeout(() => {
                    this.updateActiveState(savedLink);
                    this.loadPage(savedPage);
                }, 100);
            } else if (savedPage.includes('chiTietSanPham.html')) {
                // Handle product detail pages
                setTimeout(() => {
                    this.loadPage(savedPage);
                }, 100);
            }
        }
    }

    saveCurrentPage(pageName) {
        try {
            const pageData = {
                page: pageName,
                timestamp: new Date().toISOString()
            };
            sessionStorage.setItem('adminCurrentPage', JSON.stringify(pageData));
        } catch (error) {
            console.warn('Không thể lưu trang hiện tại:', error);
        }
    }

    getSavedPage() {
        try {
            const saved = sessionStorage.getItem('adminCurrentPage');
            if (saved) {
                const pageData = JSON.parse(saved);
                return pageData.page;
            }
        } catch (error) {
            console.warn('Không thể đọc trang đã lưu:', error);
        }
        return null;
    }

    showError(message) {
        if (this.contentFrame) this.contentFrame.style.display = 'none';
        if (this.welcomeMessage) {
            this.welcomeMessage.innerHTML = `
                <div style="color: #e74c3c; font-size: 3rem; margin-bottom: 2rem;">⚠️</div>
                <h1 style="color: #e74c3c; font-size: 2rem; margin-bottom: 1rem;">Lỗi</h1>
                <p style="font-size: 1.2rem; margin-bottom: 2rem;">${message}</p>
                <button onclick="location.reload()" style="
                    padding: 12px 24px; 
                    background: #F19EDC; 
                    color: white; 
                    border: none; 
                    border-radius: 8px; 
                    cursor: pointer;
                    font-size: 1rem;
                    transition: background-color 0.3s;
                " onmouseover="this.style.backgroundColor='#E088C8'" 
                   onmouseout="this.style.backgroundColor='#F19EDC'">
                    🔄 Tải lại trang
                </button>
            `;
            this.welcomeMessage.style.display = 'flex';
        }
    }

    showWelcome() {
        if (this.contentFrame) this.contentFrame.style.display = 'none';
        if (this.welcomeMessage) {
            this.welcomeMessage.innerHTML = `
                <div class="welcome-icon">🛠️</div>
                <h1>Chào Mừng Đến Với Hệ Thống Quản Lý</h1>
                <p>Chọn một mục từ menu phía trên để bắt đầu làm việc<br>
                    Hệ thống quản lý E-commerce hiện đại và thân thiện</p>
            `;
            this.welcomeMessage.style.display = 'flex';
        }

        // Remove active state from all menu items
        this.menuLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Clear saved page
        sessionStorage.removeItem('adminCurrentPage');
        this.currentPage = null;
    }

    performSearch() {
        const query = this.searchInput ? this.searchInput.value.trim() : '';

        if (query) {
            this.performRealTimeSearch(query);
            console.log('🔍 Searching for:', query);
        } else {
            this.hideSearchResults();
        }
    }

    // Public method to navigate programmatically
    navigateToPage(pageName) {
        const link = document.querySelector(`[data-page="${pageName}"]`);
        if (link) {
            link.click();
        } else {
            console.warn(`Page not found: ${pageName}`);
        }
    }

    // Public method to refresh products (useful for when products are updated)
    async refreshProducts() {
        console.log('🔄 Refreshing product list...');
        await this.loadAllProducts();
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Kiểm tra đăng nhập
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) {
        window.location.href = '/FE/HTML/DangNhap.html';
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/api/nguoi-dung/me", {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            window.location.href = '/FE/HTML/DangNhap.html';
            return;
        }
    } catch (error) {
        window.location.href = '/FE/HTML/DangNhap.html';
        return;
    }

    // Initialize navigation
    const navigation = new AdminNavigation();
    window.adminNavigation = navigation;

    // Initialize notification manager
    const notificationManager = new NotificationManager();
    window.notificationManager = notificationManager;

    console.log('🎉 Admin Navigation with Search and Notification System initialized successfully!');
});

// Cleanup when page unloads
window.addEventListener('beforeunload', () => {
    if (window.notificationManager) {
        window.notificationManager.destroy();
    }
});

const profileIcon = document.querySelector(".profile-icon");
const profileMenu = document.getElementById("profileMenu");
const logoutBtn = document.getElementById("logoutBtn");

document.querySelector('.profile-icon').addEventListener('click', () => {
    document.getElementById('profileMenu').classList.toggle('show');
});

// Toggle hiển thị menu khi click vào icon
if (profileIcon) {
    profileIcon.addEventListener("click", () => {
        if (profileMenu) {
            profileMenu.style.display = profileMenu.style.display === "block" ? "none" : "block";
        }
    });
}

// Đăng xuất
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usercontext");
        window.location.href = "/FE/HTML/DangNhap.html";
    });
}

// Ẩn menu khi click ra ngoài
document.addEventListener("click", (event) => {
    if (profileIcon && profileMenu) {
        if (!profileIcon.contains(event.target) && !profileMenu.contains(event.target)) {
            profileMenu.style.display = "none";
        }
    }
});
