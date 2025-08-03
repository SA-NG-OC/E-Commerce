class SmoothRouter {
    private isNavigating: boolean = false;
    private currentPage: string = '';

    constructor() {
        window.addEventListener('popstate', (e) => {
            if (e.state?.page) {
                this.navigateToPage(e.state.page, false, e.state.params);
            }
        });
    }

    async navigateTo(page: string, params?: any) {
        if (this.isNavigating) return;
        this.isNavigating = true;

        try {
            await this.fadeOut();
            await this.navigateToPage(page, true, params);
        } catch (error) {
            if (params) {
                const queryString = new URLSearchParams(params).toString();
                window.location.href = `/FE/HTML/${page}${queryString ? '?' + queryString : ''}`;
            } else {
                window.location.href = `/FE/HTML/${page}`;
            }
        } finally {
            this.isNavigating = false;
        }
    }

    private async navigateToPage(page: string, updateHistory: boolean = true, params?: any) {
        try {
            const response = await fetch(`/FE/HTML/${page}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const newMainContent = doc.querySelector('main, .main-content, .content');
            const newTitle = doc.querySelector('title')?.textContent || 'E-commerce';

            if (newMainContent) {
                const currentMain = document.querySelector('main, .main-content, .content');
                if (currentMain) {
                    currentMain.innerHTML = newMainContent.innerHTML;
                    currentMain.className = newMainContent.className;
                }

                document.title = newTitle;

                await this.loadPageStyles(page);
                await this.loadPageScript(page, params);
                this.updateActiveNavItem(page);

                if (updateHistory) {
                    const url = params ?
                        `/FE/HTML/${page}?${new URLSearchParams(params).toString()}` :
                        `/FE/HTML/${page}`;
                    history.pushState({ page, params }, '', url);
                }

                this.currentPage = page;
                await this.fadeIn();
            } else {
                throw new Error('No main content found in the page');
            }
        } catch (error) {
            throw error;
        }
    }

    private async loadPageStyles(page: string): Promise<void> {
        const styleMap: { [key: string]: string } = {
            'TrangChu.html': '/FE/CSS/TrangChu.css',
            'GioHang.html': '/FE/CSS/GioHang.css',
            'DonHang.html': '/FE/CSS/DonHang.css',
            'DanhMuc.html': '/FE/CSS/DanhMuc.css',
            'ThongBao.html': '/FE/CSS/ThongBao.css',
            'YeuThich.html': '/FE/CSS/YeuThich.css',
            'KhuyenMai.html': '/FE/CSS/KhuyenMai.css',
            'ChiTietSanPham.html': '/FE/CSS/ChiTietSanPham.css',
            'ThanhToan.html': '/FE/CSS/ThanhToan.css'
        };

        const stylePath = styleMap[page];
        if (stylePath) {
            const existingStyles = document.querySelectorAll('link[rel="stylesheet"]:not([href*="NavBar"])');
            existingStyles.forEach(style => style.remove());

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = stylePath;
            document.head.appendChild(link);
        }
    }

    private async loadPageScript(page: string, params?: any): Promise<void> {
        const scriptMap: { [key: string]: string } = {
            'TrangChu.html': '/FE/ts/productRender.js',
            'GioHang.html': '/FE/ts/gioHang.js',
            'DonHang.html': '/FE/ts/donHang.js',
            'DanhMuc.html': '/FE/ts/danhMuc.js',
            'ThongBao.html': '/FE/ts/thongBao.js',
            'YeuThich.html': '/FE/ts/yeuThich.js',
            'KhuyenMai.html': '/FE/ts/khuyenMai.js',
            'ChiTietSanPham.html': '/FE/ts/chiTietSanPham.js',
            'ThanhToan.html': '/FE/ts/thanhToan.js'
        };

        const scriptPath = scriptMap[page];
        if (scriptPath) {
            const existingScripts = document.querySelectorAll('script[src]:not([src*="navBar"]):not([src*="router"])');
            existingScripts.forEach(script => script.remove());

            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = scriptPath + '?t=' + Date.now();
                script.onload = async () => {
                    await this.waitForFunctionsAndExecute(page, params);
                    resolve();
                };
                script.onerror = () => resolve();
                document.head.appendChild(script);
            });
        }
    }

    private async waitForFunctionsAndExecute(page: string, params?: any): Promise<void> {
        const maxWaitTime = 2000;
        const checkInterval = 50;
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
                case 'DonHang.html':
                    return typeof (window as any).initDonHang === 'function' ||
                        typeof (window as any).loadDonHangData === 'function';
                case 'ThanhToan.html':
                    return typeof (window as any).initThanhToan === 'function' ||
                        typeof (window as any).loadProductInfo === 'function';
                default:
                    return true;
            }
        };

        return new Promise((resolve) => {
            const intervalId = setInterval(() => {
                if (checkFunctions() || elapsedTime >= maxWaitTime) {
                    clearInterval(intervalId);
                    this.executePageScript(page, params);
                    resolve();
                }
                elapsedTime += checkInterval;
            }, checkInterval);
        });
    }

    private executePageScript(page: string, params?: any) {
        try {
            switch (page) {
                case 'TrangChu.html':
                    if ((window as any).initTrangChu) {
                        (window as any).initTrangChu();
                    } else if ((window as any).renderProducts) {
                        (window as any).renderProducts();
                    }
                    break;
                case 'GioHang.html':
                    if ((window as any).initGioHang) {
                        (window as any).initGioHang();
                    } else if ((window as any).loadGioHang) {
                        (window as any).loadGioHang();
                    }
                    break;
                case 'ChiTietSanPham.html':
                    if (params) {
                        history.replaceState({ page, params }, '', window.location.href);
                    }
                    if ((window as any).initChiTietSanPham) {
                        (window as any).initChiTietSanPham();
                    } else if ((window as any).renderChiTietSanPham) {
                        (window as any).renderChiTietSanPham();
                    }
                    break;
                case 'DanhMuc.html':
                    if ((window as any).initDanhMuc) {
                        (window as any).initDanhMuc();
                    }
                    break;
                case 'YeuThich.html':
                    if ((window as any).initYeuThich) {
                        (window as any).initYeuThich();
                    }
                    break;
                case 'DonHang.html':
                    if ((window as any).initDonHang) {
                        (window as any).initDonHang();
                    } else if ((window as any).loadDonHangData) {
                        (window as any).loadDonHangData();
                    }
                case 'ThanhToan.html':
                    if (params) {
                        history.replaceState({ page, params }, '', window.location.href);
                    }
                    if ((window as any).initThanhToan) {
                        (window as any).initThanhToan();
                    } else if ((window as any).loadProductInfo) {
                        (window as any).loadProductInfo();
                    }
                    break;
            }
        } catch (_) { }
    }

    private fadeOut(): Promise<void> {
        return new Promise((resolve) => {
            const mainContent = document.querySelector('main, .main-content, .content') as HTMLElement;
            if (mainContent) {
                mainContent.style.transition = 'opacity 0.2s ease-out';
                mainContent.style.opacity = '0.3';
                setTimeout(resolve, 200);
            } else {
                resolve();
            }
        });
    }

    private fadeIn(): Promise<void> {
        return new Promise((resolve) => {
            const mainContent = document.querySelector('main, .main-content, .content') as HTMLElement;
            if (mainContent) {
                mainContent.style.transition = 'opacity 0.3s ease-in';
                mainContent.style.opacity = '1';
                setTimeout(resolve, 300);
            } else {
                resolve();
            }
        });
    }

    private updateActiveNavItem(page: string) {
        const navItems = document.querySelectorAll('.nav-bar .nav-item');
        navItems.forEach((item) => {
            const itemPage = item.getAttribute('data-page');
            if (itemPage === page) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    init() {
        const currentPage = window.location.pathname.split('/').pop() || 'TrangChu.html';
        this.currentPage = currentPage;
        this.updateActiveNavItem(currentPage);
    }
}

(window as any).smoothRouter = new SmoothRouter();
