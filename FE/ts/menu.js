class AdminNavigation {
    constructor() {
        this.contentFrame = document.getElementById('contentFrame');
        this.welcomeMessage = document.getElementById('welcomeMessage');
        this.menuLinks = document.querySelectorAll('.nav-item');
        this.mobileToggle = document.getElementById('mobileToggle');
        this.navMenu = document.getElementById('navMenu');
        this.currentPage = null;

        this.init();
    }

    init() {
        this.attachEventListeners();
        this.loadSavedPage();
    }

    attachEventListeners() {
        // Menu link events
        this.menuLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleMenuClick(e));
        });

        // Mobile toggle event
        this.mobileToggle.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navMenu.contains(e.target) && !this.mobileToggle.contains(e.target)) {
                this.navMenu.classList.remove('active');
            }
        });

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.navMenu.classList.remove('active');
                this.showWelcome();
            }
        });

        // Search functionality
        const searchInput = document.querySelector('.search-input');
        const searchBtn = document.querySelector('.search-btn');

        searchBtn.addEventListener('click', () => this.performSearch());
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.navMenu.classList.remove('active');
            }
        });
    }

    handleMenuClick(event) {
        event.preventDefault();

        const clickedLink = event.currentTarget;
        const pageName = clickedLink.dataset.page;

        if (!pageName) return;

        // Close mobile menu
        this.navMenu.classList.remove('active');

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
            this.welcomeMessage.style.display = 'none';

            // Show content frame
            this.contentFrame.style.display = 'block';
            this.contentFrame.src = pageName;
            this.currentPage = pageName;

            // Loading indicator
            this.showLoadingIndicator();

            // Handle iframe load events
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
        this.contentFrame.style.display = 'none';
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

    showWelcome() {
        this.contentFrame.style.display = 'none';
        this.welcomeMessage.innerHTML = `
                    <div class="welcome-icon">🛠️</div>
                    <h1>Chào Mừng Đến Với Hệ Thống Quản Lý</h1>
                    <p>Chọn một mục từ menu phía trên để bắt đầu làm việc<br>
                        Hệ thống quản lý E-commerce hiện đại và thân thiện</p>
                `;
        this.welcomeMessage.style.display = 'flex';

        // Remove active state from all menu items
        this.menuLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Clear saved page
        sessionStorage.removeItem('adminCurrentPage');
    }

    performSearch() {
        const searchInput = document.querySelector('.search-input');
        const query = searchInput.value.trim();

        if (query) {
            this.showSuccessFeedback(`Tìm kiếm: "${query}"`);
            console.log('Searching for:', query);
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
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const navigation = new AdminNavigation();
    window.adminNavigation = navigation;

    console.log('🎉 Admin Navigation initialized successfully!');
});