"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class SmoothRouter {
    constructor() {
        this.isNavigating = false;
        this.currentPage = '';
        window.addEventListener('popstate', (e) => {
            var _a;
            if ((_a = e.state) === null || _a === void 0 ? void 0 : _a.page) {
                this.navigateToPage(e.state.page, false, e.state.params);
            }
        });
    }
    navigateTo(page, params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isNavigating)
                return;
            this.isNavigating = true;
            try {
                yield this.fadeOut();
                yield this.navigateToPage(page, true, params);
            }
            catch (error) {
                if (params) {
                    const queryString = new URLSearchParams(params).toString();
                    window.location.href = `/FE/HTML/${page}${queryString ? '?' + queryString : ''}`;
                }
                else {
                    window.location.href = `/FE/HTML/${page}`;
                }
            }
            finally {
                this.isNavigating = false;
            }
        });
    }
    navigateToPage(page_1) {
        return __awaiter(this, arguments, void 0, function* (page, updateHistory = true, params) {
            var _a;
            try {
                const response = yield fetch(`/FE/HTML/${page}`);
                if (!response.ok)
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                const html = yield response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const newMainContent = doc.querySelector('main, .main-content, .content');
                const newTitle = ((_a = doc.querySelector('title')) === null || _a === void 0 ? void 0 : _a.textContent) || 'E-commerce';
                if (newMainContent) {
                    const currentMain = document.querySelector('main, .main-content, .content');
                    if (currentMain) {
                        currentMain.innerHTML = newMainContent.innerHTML;
                        currentMain.className = newMainContent.className;
                    }
                    document.title = newTitle;
                    yield this.loadPageStyles(page);
                    yield this.loadPageScript(page, params);
                    this.updateActiveNavItem(page);
                    if (updateHistory) {
                        const url = params ?
                            `/FE/HTML/${page}?${new URLSearchParams(params).toString()}` :
                            `/FE/HTML/${page}`;
                        history.pushState({ page, params }, '', url);
                    }
                    this.currentPage = page;
                    yield this.fadeIn();
                }
                else {
                    throw new Error('No main content found in the page');
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    loadPageStyles(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const styleMap = {
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
        });
    }
    loadPageScript(page, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const scriptMap = {
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
                    script.onload = () => __awaiter(this, void 0, void 0, function* () {
                        yield this.waitForFunctionsAndExecute(page, params);
                        resolve();
                    });
                    script.onerror = () => resolve();
                    document.head.appendChild(script);
                });
            }
        });
    }
    waitForFunctionsAndExecute(page, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const maxWaitTime = 2000;
            const checkInterval = 50;
            let elapsedTime = 0;
            const checkFunctions = () => {
                switch (page) {
                    case 'ChiTietSanPham.html':
                        return typeof window.initChiTietSanPham === 'function' ||
                            typeof window.renderChiTietSanPham === 'function';
                    case 'TrangChu.html':
                        return typeof window.initTrangChu === 'function' ||
                            typeof window.renderProducts === 'function';
                    case 'GioHang.html':
                        return typeof window.initGioHang === 'function' ||
                            typeof window.loadGioHang === 'function';
                    case 'DanhMuc.html':
                        return typeof window.initDanhMuc === 'function';
                    case 'YeuThich.html':
                        return typeof window.initYeuThich === 'function';
                    case 'DonHang.html':
                        return typeof window.initDonHang === 'function' ||
                            typeof window.loadDonHangData === 'function';
                    case 'ThanhToan.html':
                        return typeof window.initThanhToan === 'function' ||
                            typeof window.loadProductInfo === 'function';
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
        });
    }
    executePageScript(page, params) {
        try {
            switch (page) {
                case 'TrangChu.html':
                    if (window.initTrangChu) {
                        window.initTrangChu();
                    }
                    else if (window.renderProducts) {
                        window.renderProducts();
                    }
                    break;
                case 'GioHang.html':
                    if (window.initGioHang) {
                        window.initGioHang();
                    }
                    else if (window.loadGioHang) {
                        window.loadGioHang();
                    }
                    break;
                case 'ChiTietSanPham.html':
                    if (params) {
                        history.replaceState({ page, params }, '', window.location.href);
                    }
                    if (window.initChiTietSanPham) {
                        window.initChiTietSanPham();
                    }
                    else if (window.renderChiTietSanPham) {
                        window.renderChiTietSanPham();
                    }
                    break;
                case 'DanhMuc.html':
                    if (window.initDanhMuc) {
                        window.initDanhMuc();
                    }
                    break;
                case 'YeuThich.html':
                    if (window.initYeuThich) {
                        window.initYeuThich();
                    }
                    break;
                case 'DonHang.html':
                    if (window.initDonHang) {
                        window.initDonHang();
                    }
                    else if (window.loadDonHangData) {
                        window.loadDonHangData();
                    }
                case 'ThanhToan.html':
                    if (params) {
                        history.replaceState({ page, params }, '', window.location.href);
                    }
                    if (window.initThanhToan) {
                        window.initThanhToan();
                    }
                    else if (window.loadProductInfo) {
                        window.loadProductInfo();
                    }
                    break;
            }
        }
        catch (_) { }
    }
    fadeOut() {
        return new Promise((resolve) => {
            const mainContent = document.querySelector('main, .main-content, .content');
            if (mainContent) {
                mainContent.style.transition = 'opacity 0.2s ease-out';
                mainContent.style.opacity = '0.3';
                setTimeout(resolve, 200);
            }
            else {
                resolve();
            }
        });
    }
    fadeIn() {
        return new Promise((resolve) => {
            const mainContent = document.querySelector('main, .main-content, .content');
            if (mainContent) {
                mainContent.style.transition = 'opacity 0.3s ease-in';
                mainContent.style.opacity = '1';
                setTimeout(resolve, 300);
            }
            else {
                resolve();
            }
        });
    }
    updateActiveNavItem(page) {
        const navItems = document.querySelectorAll('.nav-bar .nav-item');
        navItems.forEach((item) => {
            const itemPage = item.getAttribute('data-page');
            if (itemPage === page) {
                item.classList.add('active');
            }
            else {
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
window.smoothRouter = new SmoothRouter();
