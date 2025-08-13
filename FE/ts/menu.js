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
            const response = await fetch('http://localhost:3000/api/san-pham/');
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
        this.mobileToggle.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navMenu.contains(e.target) && !this.mobileToggle.contains(e.target)) {
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
                this.navMenu.classList.remove('active');
                this.hideSearchResults();
                if (!this.currentPage) {
                    this.showWelcome();
                }
            }
        });

        // Enhanced search functionality
        this.searchBtn.addEventListener('click', () => this.performSearch());

        // Real-time search with debounce
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

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
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
                this.searchInput.value = '';
            });
        });
    }

    showSearchMessage(message) {
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
        this.navMenu.classList.remove('active');
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
        this.currentPage = null;
    }

    performSearch() {
        const query = this.searchInput.value.trim();

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

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const navigation = new AdminNavigation();
    window.adminNavigation = navigation;

    console.log('🎉 Admin Navigation with Search initialized successfully!');
});