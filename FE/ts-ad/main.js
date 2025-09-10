class HorizontalMenuNavigation {
    constructor() {
        this.navMenu = document.getElementById('navMenu');
        this.mobileToggle = document.getElementById('mobileToggle');
        this.contentFrame = document.getElementById('contentFrame');
        this.welcomeMessage = document.getElementById('welcomeMessage');
        this.menuLinks = document.querySelectorAll('.menu-link');

        // Profile menu elements
        this.profileIcon = document.getElementById('profileIcon');
        this.profileMenu = document.getElementById('profileMenu');
        this.logoutBtn = document.getElementById('logoutBtn');

        this.currentPage = null;
        this.isMobileMenuOpen = false;
        this.isProfileMenuOpen = false;
        this.logoutTimer = null;

        this.userRole = null;

        this.init();
    }

    init() {
        console.log(this.userRole);
        this.getUserRole(); // Lấy role người dùng
        this.attachEventListeners();
        //this.loadSavedPage();
        this.checkAuthentication();
        this.initAutoLogout();
        this.setupRoleBasedAccess();
    }

    // Hàm mới: Lấy role người dùng
    getUserRole() {
        try {
            const userContext = localStorage.getItem("usercontext");
            if (userContext) {
                const userData = JSON.parse(userContext);
                this.userRole = userData.role || userData._role;
            }
        } catch (error) {
            console.error('Lỗi khi lấy role người dùng:', error);
        }
    }

    // Hàm mới: Thiết lập quyền truy cập theo role
    setupRoleBasedAccess() {
        if (this.userRole === "Nhân viên") {
            this.hideMenuItemsForEmployee();
        }
    }

    // Hàm mới: Ẩn các menu item cho Nhân viên
    hideMenuItemsForEmployee() {
        // Danh sách các menu item cần ẩn cho Nhân viên
        const restrictedMenus = [
            'QuanLyNguoiDung_Ad.html', // Quản lý người dùng
            'DoashBoard.html'          // Dashboard (tuỳ chọn)
        ];

        restrictedMenus.forEach(pageName => {
            const menuItem = document.querySelector(`[data-page="${pageName}"]`);
            if (menuItem) {
                const menuItemParent = menuItem.closest('.menu-item');
                if (menuItemParent) {
                    menuItemParent.style.display = 'none';
                }
            }
        });
    }


    attachEventListeners() {
        // Mobile menu toggle
        this.mobileToggle.addEventListener('click', () => this.toggleMobileMenu());

        // Menu link events
        this.menuLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleMenuClick(e));
        });

        // Profile menu events
        if (this.profileIcon && this.profileMenu) {
            this.profileIcon.addEventListener('click', (e) => this.handleProfileClick(e));
        }

        // Logout button event
        if (this.logoutBtn) {
            this.logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Close menus when clicking outside
        document.addEventListener('click', (e) => this.handleDocumentClick(e));

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.isMobileMenuOpen) this.closeMobileMenu();
                if (this.isProfileMenuOpen) this.closeProfileMenu();
            }
        });

        // Window resize
        window.addEventListener('resize', () => this.handleResize());

        // Activity events for auto logout
        ['click', 'keypress', 'mousemove', 'scroll'].forEach(eventType => {
            document.addEventListener(eventType, () => this.resetLogoutTimer());
        });
    }

    // Profile Menu Methods
    handleProfileClick(event) {
        event.preventDefault();
        event.stopPropagation();

        if (this.isProfileMenuOpen) {
            this.closeProfileMenu();
        } else {
            this.openProfileMenu();
        }
    }

    openProfileMenu() {
        this.isProfileMenuOpen = true;
        if (this.profileMenu) {
            this.profileMenu.style.display = 'block';
            // Add animation class if needed
            this.profileMenu.classList.add('show');
        }
    }

    closeProfileMenu() {
        this.isProfileMenuOpen = false;
        if (this.profileMenu) {
            this.profileMenu.style.display = 'none';
            this.profileMenu.classList.remove('show');
        }
    }

    handleDocumentClick(event) {
        // Close mobile menu
        if (this.isMobileMenuOpen &&
            !this.navMenu.contains(event.target) &&
            !this.mobileToggle.contains(event.target)) {
            this.closeMobileMenu();
        }

        // Close profile menu
        if (this.isProfileMenuOpen &&
            this.profileIcon && this.profileMenu &&
            !this.profileIcon.contains(event.target) &&
            !this.profileMenu.contains(event.target)) {
            this.closeProfileMenu();
        }
    }

    // Authentication Methods
    checkAuthentication() {
        const token = localStorage.getItem("token");
        if (!token) {
            this.redirectToLogin();
            return false;
        }
        return true;
    }

    handleLogout() {
        const confirmLogout = confirm("Bạn có chắc chắn muốn đăng xuất?");
        if (confirmLogout) {
            this.performLogout();
        }
    }

    performLogout() {
        try {
            localStorage.removeItem("token");
            localStorage.removeItem("usercontext");
            window.location.href = "/HTML/DangNhap.html";

        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
            this.redirectToLogin();
        }
    }

    showLogoutMessage() {
        const message = document.createElement('div');
        message.className = 'logout-message';
        message.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                        z-index: 10000; text-align: center;">
                <i class="fas fa-check-circle" style="color: #28a745; font-size: 3rem; margin-bottom: 15px;"></i>
                <h3 style="margin: 0 0 10px 0; color: #333;">Đăng xuất thành công!</h3>
                <p style="margin: 0; color: #666;">Đang chuyển hướng...</p>
            </div>
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                        background: rgba(0,0,0,0.3); z-index: 9999;"></div>
        `;
        document.body.appendChild(message);
    }

    redirectToLogin() {
        window.location.href = "/HTML/DangNhap.html";
    }

    // Auto Logout Methods
    initAutoLogout() {
        this.resetLogoutTimer();
    }

    resetLogoutTimer() {
        if (this.logoutTimer) {
            clearTimeout(this.logoutTimer);
        }

        // Auto logout after 30 minutes of inactivity
        this.logoutTimer = setTimeout(() => {
            this.handleAutoLogout();
        }, 30 * 60 * 1000); // 30 minutes
    }

    handleAutoLogout() {
        alert("Phiên làm việc đã hết hạn. Bạn sẽ được đăng xuất.");
        this.performLogout();
    }

    // Existing Mobile Menu Methods
    toggleMobileMenu() {
        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.isMobileMenuOpen = true;
        this.navMenu.classList.add('active');
        this.mobileToggle.querySelector('i').classList.remove('fa-bars');
        this.mobileToggle.querySelector('i').classList.add('fa-times');
    }

    closeMobileMenu() {
        this.isMobileMenuOpen = false;
        this.navMenu.classList.remove('active');
        this.mobileToggle.querySelector('i').classList.remove('fa-times');
        this.mobileToggle.querySelector('i').classList.add('fa-bars');
    }

    handleMenuClick(event) {
        event.preventDefault();

        const clickedLink = event.currentTarget;
        const pageName = clickedLink.dataset.page;

        if (!pageName) return;

        // Update active state
        this.updateActiveState(clickedLink);

        // Load page
        this.loadPage(pageName);

        // Save current page
        localStorage.setItem('currentPage', pageName);

        // Close mobile menu if open
        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        }

        // Close profile menu if open
        if (this.isProfileMenuOpen) {
            this.closeProfileMenu();
        }

        // Show success feedback
        this.showSuccessFeedback(clickedLink.querySelector('.menu-text').textContent);
    }

    updateActiveState(activeLink) {
        this.menuLinks.forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    loadPage(pageName) {
        try {
            this.welcomeMessage.style.display = 'none';
            this.contentFrame.style.display = 'block';
            this.contentFrame.src = pageName;
            this.currentPage = pageName;

            // Loading indicator
            this.showLoadingIndicator();

            this.contentFrame.onload = () => {
                this.hideLoadingIndicator();
                this.initializePageScripts(pageName);
            };

            this.contentFrame.onerror = () => {
                this.hideLoadingIndicator();
                this.showError(`Không thể tải trang: ${pageName}`);
            };

        } catch (error) {
            console.error('Lỗi khi load trang:', error);
            this.showError('Có lỗi xảy ra khi tải trang');
        }
    }

    showLoadingIndicator() {
        const loader = document.createElement('div');
        loader.id = 'pageLoader';
        loader.className = 'loading-indicator';
        loader.innerHTML = `
            <div class="spinner"></div>
            <span style="color: #666;">Đang tải trang...</span>
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
            const iframe = this.contentFrame;
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

            const scriptMapping = {
                'DoashBoard.html': 'doashBoard.js',
                'QuanLyDM-TH_Ad.html': 'quanLyDM-TH_Ad.js',
                'QuanLyDonHang_Ad.html': 'quanLyDonHang_Ad.js',
                'QuanLyNguoiDung_Ad.html': 'quanLyNguoiDung_Ad.js',
                'ThemSanPham_Ad.html': 'themSanPham_Ad.js',
                'TrangChu_Ad.html': 'productRender.js'
            };

            const jsFile = scriptMapping[pageName];
            if (jsFile) {
                const existingScript = iframeDoc.querySelector(`script[data-page="${pageName}"]`);
                if (!existingScript) {
                    const script = iframeDoc.createElement('script');
                    script.src = jsFile;
                    script.setAttribute('data-page', pageName);
                    script.type = 'module';

                    script.onload = () => {
                        console.log(`✅ Script ${jsFile} loaded successfully`);
                        this.triggerPageInitialization(pageName, iframe);
                    };

                    script.onerror = () => {
                        console.warn(`⚠️ Could not load script: ${jsFile}`);
                    };

                    iframeDoc.head.appendChild(script);
                } else {
                    this.triggerPageInitialization(pageName, iframe);
                }
            }

        } catch (error) {
            console.error('Lỗi khi inject script:', error);
        }
    }

    triggerPageInitialization(pageName, iframe) {
        try {
            const iframeWindow = iframe.contentWindow;

            const initFunctionMap = {
                'DoashBoard.html': 'initDashboard',
                'QuanLyDM-TH_Ad.html': 'initQuanLyDanhMuc',
                'QuanLyDonHang_Ad.html': 'initQuanLyDonHang',
                'QuanLyNguoiDung_Ad.html': 'initQuanLyNguoiDung',
                'ThemSanPham_Ad.html': 'initThemSanPham',
                'TrangChu_Ad.html': 'initTrangChu'
            };

            const initFunction = initFunctionMap[pageName];
            if (initFunction && typeof iframeWindow[initFunction] === 'function') {
                iframeWindow[initFunction]();
                console.log(`🚀 Initialized ${initFunction} for ${pageName}`);
            }

            const event = new CustomEvent('menuNavigated', {
                detail: {
                    pageName: pageName,
                    timestamp: new Date().toISOString()
                }
            });
            iframeWindow.dispatchEvent(event);

        } catch (error) {
            console.error('Lỗi khi trigger page initialization:', error);
        }
    }

    /*loadSavedPage() {
        const savedPage = localStorage.getItem('currentPage');
        if (savedPage) {
            const savedLink = document.querySelector(`[data-page="${savedPage}"]`);
            if (savedLink) {
                this.updateActiveState(savedLink);
                this.loadPage(savedPage);
            }
        }
    }*/

    showError(message) {
        this.contentFrame.style.display = 'none';
        this.welcomeMessage.innerHTML = `
            <h1 style="color: #e74c3c;">Lỗi</h1>
            <p>${message}</p>
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-top: 30px; color: #e74c3c;"></i>
            <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; 
                    background: #F19EDC; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Tải lại trang
            </button>
        `;
        this.welcomeMessage.style.display = 'flex';
    }

    handleResize() {
        if (window.innerWidth > 768) {
            if (this.isMobileMenuOpen) this.closeMobileMenu();
            if (this.isProfileMenuOpen) this.closeProfileMenu();
        }
    }

    navigateToPage(pageName) {
        const link = document.querySelector(`[data-page="${pageName}"]`);
        if (link) {
            link.click();
        }
    }

    // Public methods for external access
    logout() {
        this.handleLogout();
    }

    isAuthenticated() {
        return this.checkAuthentication();
    }
}

// Initialize horizontal menu navigation when DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    const menuNav = new HorizontalMenuNavigation();
    window.menuNavigation = menuNav;

    console.log('🎉 Horizontal Menu Navigation với Profile Menu initialized successfully!');
});