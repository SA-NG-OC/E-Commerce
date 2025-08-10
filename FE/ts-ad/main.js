class HorizontalMenuNavigation {
    constructor() {
        this.navMenu = document.getElementById('navMenu');
        this.mobileToggle = document.getElementById('mobileToggle');
        this.contentFrame = document.getElementById('contentFrame');
        this.welcomeMessage = document.getElementById('welcomeMessage');
        this.menuLinks = document.querySelectorAll('.menu-link');
        this.currentPage = null;
        this.isMobileMenuOpen = false;

        this.init();
    }

    init() {
        this.attachEventListeners();
        this.loadSavedPage();
    }

    attachEventListeners() {
        // Mobile menu toggle
        this.mobileToggle.addEventListener('click', () => this.toggleMobileMenu());

        // Menu link events
        this.menuLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleMenuClick(e));
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMobileMenuOpen &&
                !this.navMenu.contains(e.target) &&
                !this.mobileToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // Window resize
        window.addEventListener('resize', () => this.handleResize());
    }

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

    loadSavedPage() {
        const savedPage = localStorage.getItem('currentPage');
        if (savedPage) {
            const savedLink = document.querySelector(`[data-page="${savedPage}"]`);
            if (savedLink) {
                this.updateActiveState(savedLink);
                this.loadPage(savedPage);
            }
        }
    }

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
        if (window.innerWidth > 768 && this.isMobileMenuOpen) {
            this.closeMobileMenu();
        }
    }

    navigateToPage(pageName) {
        const link = document.querySelector(`[data-page="${pageName}"]`);
        if (link) {
            link.click();
        }
    }
}

// Initialize horizontal menu navigation when DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    const menuNav = new HorizontalMenuNavigation();
    window.menuNavigation = menuNav;

    console.log('🎉 Horizontal Menu Navigation initialized successfully!');
});