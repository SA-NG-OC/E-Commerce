class SmoothRouter {
    private isNavigating: boolean = false;
    private currentPage: string = '';

    constructor() {
        console.log('SmoothRouter initialized');
        window.addEventListener('popstate', (e) => {
            console.log('Popstate event:', e.state);
            if (e.state?.page) {
                this.navigateToPage(e.state.page, false, e.state.params);
            }
        });
    }

    async navigateTo(page: string, params?: any) {
        console.log('NavigateTo called:', page, params);
        console.log('Current isNavigating:', this.isNavigating);
        console.log('Current page:', this.currentPage);

        if (this.isNavigating) {
            console.log('Already navigating, skipping...');
            return;
        }

        // Bỏ check currentPage để luôn cho phép navigate đến ChiTietSanPham
        // if (this.currentPage === page && !params) return;

        this.isNavigating = true;
        console.log('Starting navigation...');

        try {
            console.log('Starting fadeOut...');
            await this.fadeOut();
            console.log('FadeOut completed, starting navigateToPage...');
            await this.navigateToPage(page, true, params);
            console.log('Navigation completed successfully');
        } catch (error) {
            console.error('Navigation error:', error);
            // Fallback về cách cũ nếu có lỗi
            if (params) {
                const queryString = new URLSearchParams(params).toString();
                window.location.href = `/FE/HTML/${page}${queryString ? '?' + queryString : ''}`;
            } else {
                window.location.href = `/FE/HTML/${page}`;
            }
        } finally {
            this.isNavigating = false;
            console.log('Navigation finished, isNavigating set to false');
        }
    }

    private async navigateToPage(page: string, updateHistory: boolean = true, params?: any) {
        console.log('NavigateToPage called:', page, updateHistory, params);

        try {
            console.log('Fetching page:', `/FE/HTML/${page}`);
            const response = await fetch(`/FE/HTML/${page}`);
            console.log('Fetch response:', response.ok, response.status);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const html = await response.text();
            console.log('HTML fetched, length:', html.length);

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const newMainContent = doc.querySelector('main, .main-content, .content');
            const newTitle = doc.querySelector('title')?.textContent || 'E-commerce';

            console.log('Parsed content:', {
                hasMainContent: !!newMainContent,
                title: newTitle
            });

            if (newMainContent) {
                const currentMain = document.querySelector('main, .main-content, .content');
                console.log('Current main element found:', !!currentMain);

                if (currentMain) {
                    currentMain.innerHTML = newMainContent.innerHTML;
                    currentMain.className = newMainContent.className;
                    console.log('Content replaced successfully');
                }

                document.title = newTitle;

                console.log('Loading page styles...');
                await this.loadPageStyles(page);
                console.log('Loading page scripts...');
                await this.loadPageScript(page, params); // ✅ Pass params to loadPageScript
                console.log('Updating active nav item...');
                this.updateActiveNavItem(page);

                if (updateHistory) {
                    const url = params ?
                        `/FE/HTML/${page}?${new URLSearchParams(params).toString()}` :
                        `/FE/HTML/${page}`;
                    console.log('Updating history:', url, { page, params });
                    history.pushState({ page, params }, '', url);
                }

                this.currentPage = page;
                console.log('Starting fadeIn...');
                await this.fadeIn();
                console.log('FadeIn completed');
            } else {
                throw new Error('No main content found in the page');
            }

        } catch (error) {
            console.error('Error in navigateToPage:', error);
            throw error;
        }
    }

    private async loadPageStyles(page: string): Promise<void> {
        console.log('Loading styles for:', page);
        const styleMap: { [key: string]: string } = {
            'TrangChu.html': '/FE/CSS/TrangChu.css',
            'GioHang.html': '/FE/CSS/GioHang.css',
            'DonHang.html': '/FE/CSS/DonHang.css',
            'DanhMuc.html': '/FE/CSS/DanhMuc.css',
            'ThongBao.html': '/FE/CSS/ThongBao.css',
            'YeuThich.html': '/FE/CSS/YeuThich.css',
            'KhuyenMai.html': '/FE/CSS/KhuyenMai.css',
            'ChiTietSanPham.html': '/FE/CSS/ChiTietSanPham.css'
        };

        const stylePath = styleMap[page];
        console.log('Style path:', stylePath);

        if (stylePath) {
            const existingStyles = document.querySelectorAll('link[rel="stylesheet"]:not([href*="NavBar"])');
            console.log('Removing existing styles:', existingStyles.length);
            existingStyles.forEach(style => style.remove());

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = stylePath;
            document.head.appendChild(link);
            console.log('New style added:', stylePath);
        }
    }

    // ✅ Modified to accept params and wait for functions to be available
    private async loadPageScript(page: string, params?: any): Promise<void> {
        console.log('Loading script for:', page);
        const scriptMap: { [key: string]: string } = {
            'TrangChu.html': '/FE/ts/productRender.js',
            'GioHang.html': '/FE/ts/gioHang.js',
            'DonHang.html': '/FE/ts/donHang.js',
            'DanhMuc.html': '/FE/ts/danhMuc.js',
            'ThongBao.html': '/FE/ts/thongBao.js',
            'YeuThich.html': '/FE/ts/yeuThich.js',
            'KhuyenMai.html': '/FE/ts/khuyenMai.js',
            'ChiTietSanPham.html': '/FE/ts/chiTietSanPham.js'
        };

        const scriptPath = scriptMap[page];
        console.log('Script path:', scriptPath);

        if (scriptPath) {
            const existingScripts = document.querySelectorAll('script[src]:not([src*="navBar"]):not([src*="router"])');
            console.log('Removing existing scripts:', existingScripts.length);
            existingScripts.forEach(script => script.remove());

            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = scriptPath + '?t=' + Date.now();
                script.onload = async () => {
                    console.log('Script loaded successfully:', scriptPath);
                    // ✅ Wait for functions to be available before executing
                    await this.waitForFunctionsAndExecute(page, params);
                    resolve();
                };
                script.onerror = (e) => {
                    console.error("Cannot load script:", scriptPath, e);
                    resolve(); // Vẫn resolve để không block
                };
                document.head.appendChild(script);
                console.log('Script tag added to head');
            });
        } else {
            console.log('No script mapping found for page:', page);
        }
    }

    // ✅ New method to wait for functions to be available
    private async waitForFunctionsAndExecute(page: string, params?: any): Promise<void> {
        console.log('Waiting for functions to be available for:', page);

        const maxWaitTime = 2000; // Maximum 2 seconds
        const checkInterval = 50; // Check every 50ms
        let elapsedTime = 0;

        const checkFunctions = (): boolean => {
            switch (page) {
                case 'ChiTietSanPham.html':
                    return typeof (window as any).initChiTietSanPham === 'function' ||
                        typeof (window as any).renderChiTietSanPham === 'function';
                case 'TrangChu.html':
                    return typeof (window as any).initTrangChu === 'function' ||
                        typeof (window as any).renderProducts === 'function';
                case 'GioHang.html':
                    return typeof (window as any).initGioHang === 'function' ||
                        typeof (window as any).loadGioHang === 'function';
                case 'DanhMuc.html':
                    return typeof (window as any).initDanhMuc === 'function';
                case 'YeuThich.html':
                    return typeof (window as any).initYeuThich === 'function';
                default:
                    return true; // For pages without specific functions
            }
        };

        return new Promise((resolve) => {
            const intervalId = setInterval(() => {
                if (checkFunctions() || elapsedTime >= maxWaitTime) {
                    clearInterval(intervalId);
                    console.log(`Functions available for ${page} after ${elapsedTime}ms`);
                    this.executePageScript(page, params);
                    resolve();
                }
                elapsedTime += checkInterval;
            }, checkInterval);
        });
    }

    // ✅ Modified to accept params
    private executePageScript(page: string, params?: any) {
        console.log('Executing page script for:', page, 'with params:', params);
        try {
            switch (page) {
                case 'TrangChu.html':
                    console.log('Executing TrangChu script...');
                    if ((window as any).initTrangChu) {
                        (window as any).initTrangChu();
                    } else if ((window as any).renderProducts) {
                        (window as any).renderProducts();
                    }
                    break;

                case 'GioHang.html':
                    console.log('Executing GioHang script...');
                    if ((window as any).initGioHang) {
                        (window as any).initGioHang();
                    } else if ((window as any).loadGioHang) {
                        (window as any).loadGioHang();
                    }
                    break;

                case 'ChiTietSanPham.html':
                    console.log('Executing ChiTietSanPham script...');
                    console.log('Available functions:', {
                        initChiTietSanPham: typeof (window as any).initChiTietSanPham,
                        renderChiTietSanPham: typeof (window as any).renderChiTietSanPham
                    });

                    // ✅ Store params in history state for ChiTietSanPham
                    if (params) {
                        history.replaceState({ page, params }, '', window.location.href);
                    }

                    if ((window as any).initChiTietSanPham) {
                        (window as any).initChiTietSanPham();
                    } else if ((window as any).renderChiTietSanPham) {
                        (window as any).renderChiTietSanPham();
                    } else {
                        console.warn('No ChiTietSanPham functions available');
                    }
                    break;

                case 'DanhMuc.html':
                    console.log('Executing DanhMuc script...');
                    if ((window as any).initDanhMuc) {
                        (window as any).initDanhMuc();
                    }
                    break;

                case 'YeuThich.html':
                    console.log('Executing YeuThich script...');
                    if ((window as any).initYeuThich) {
                        (window as any).initYeuThich();
                    }
                    break;

                default:
                    console.log('No specific script execution for:', page);
            }
        } catch (error) {
            console.error('Error executing page script:', error);
        }
    }

    private fadeOut(): Promise<void> {
        console.log('FadeOut started');
        return new Promise((resolve) => {
            const mainContent = document.querySelector('main, .main-content, .content') as HTMLElement;
            console.log('Main content for fadeOut:', !!mainContent);
            if (mainContent) {
                mainContent.style.transition = 'opacity 0.2s ease-out';
                mainContent.style.opacity = '0.3';
                setTimeout(() => {
                    console.log('FadeOut completed');
                    resolve();
                }, 200);
            } else {
                console.log('No main content found for fadeOut');
                resolve();
            }
        });
    }

    private fadeIn(): Promise<void> {
        console.log('FadeIn started');
        return new Promise((resolve) => {
            const mainContent = document.querySelector('main, .main-content, .content') as HTMLElement;
            console.log('Main content for fadeIn:', !!mainContent);
            if (mainContent) {
                mainContent.style.transition = 'opacity 0.3s ease-in';
                mainContent.style.opacity = '1';
                setTimeout(() => {
                    console.log('FadeIn completed');
                    resolve();
                }, 300);
            } else {
                console.log('No main content found for fadeIn');
                resolve();
            }
        });
    }

    private updateActiveNavItem(page: string) {
        console.log('Updating active nav item for:', page);
        const navItems = document.querySelectorAll('.nav-bar .nav-item');
        console.log('Nav items found:', navItems.length);
        navItems.forEach((item) => {
            const itemPage = item.getAttribute('data-page');
            if (itemPage === page) {
                item.classList.add('active');
                console.log('Added active class to:', itemPage);
            } else {
                item.classList.remove('active');
            }
        });
    }

    init() {
        console.log('Router init called');
        const currentPage = window.location.pathname.split('/').pop() || 'TrangChu.html';
        console.log('Current page detected:', currentPage);
        this.currentPage = currentPage;
        this.updateActiveNavItem(currentPage);
    }
}

// Khởi tạo router
console.log('Creating SmoothRouter instance');
(window as any).smoothRouter = new SmoothRouter();