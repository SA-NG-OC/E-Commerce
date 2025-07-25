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
var SmoothRouter = /** @class */ (function () {
    function SmoothRouter() {
        var _this = this;
        this.isNavigating = false;
        this.currentPage = '';
        console.log('SmoothRouter initialized');
        window.addEventListener('popstate', function (e) {
            var _a;
            console.log('Popstate event:', e.state);
            if ((_a = e.state) === null || _a === void 0 ? void 0 : _a.page) {
                _this.navigateToPage(e.state.page, false, e.state.params);
            }
        });
    }
    SmoothRouter.prototype.navigateTo = function (page, params) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1, queryString;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('NavigateTo called:', page, params);
                        console.log('Current isNavigating:', this.isNavigating);
                        console.log('Current page:', this.currentPage);
                        if (this.isNavigating) {
                            console.log('Already navigating, skipping...');
                            return [2 /*return*/];
                        }
                        // Bỏ check currentPage để luôn cho phép navigate đến ChiTietSanPham
                        // if (this.currentPage === page && !params) return;
                        this.isNavigating = true;
                        console.log('Starting navigation...');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 5, 6]);
                        console.log('Starting fadeOut...');
                        return [4 /*yield*/, this.fadeOut()];
                    case 2:
                        _a.sent();
                        console.log('FadeOut completed, starting navigateToPage...');
                        return [4 /*yield*/, this.navigateToPage(page, true, params)];
                    case 3:
                        _a.sent();
                        console.log('Navigation completed successfully');
                        return [3 /*break*/, 6];
                    case 4:
                        error_1 = _a.sent();
                        console.error('Navigation error:', error_1);
                        // Fallback về cách cũ nếu có lỗi
                        if (params) {
                            queryString = new URLSearchParams(params).toString();
                            window.location.href = "/FE/HTML/".concat(page).concat(queryString ? '?' + queryString : '');
                        }
                        else {
                            window.location.href = "/FE/HTML/".concat(page);
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        this.isNavigating = false;
                        console.log('Navigation finished, isNavigating set to false');
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    SmoothRouter.prototype.navigateToPage = function (page_1) {
        return __awaiter(this, arguments, void 0, function (page, updateHistory, params) {
            var response, html, parser, doc, newMainContent, newTitle, currentMain, url, error_2;
            var _a;
            if (updateHistory === void 0) { updateHistory = true; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('NavigateToPage called:', page, updateHistory, params);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 9, , 10]);
                        console.log('Fetching page:', "/FE/HTML/".concat(page));
                        return [4 /*yield*/, fetch("/FE/HTML/".concat(page))];
                    case 2:
                        response = _b.sent();
                        console.log('Fetch response:', response.ok, response.status);
                        if (!response.ok) {
                            throw new Error("HTTP ".concat(response.status, ": ").concat(response.statusText));
                        }
                        return [4 /*yield*/, response.text()];
                    case 3:
                        html = _b.sent();
                        console.log('HTML fetched, length:', html.length);
                        parser = new DOMParser();
                        doc = parser.parseFromString(html, 'text/html');
                        newMainContent = doc.querySelector('main, .main-content, .content');
                        newTitle = ((_a = doc.querySelector('title')) === null || _a === void 0 ? void 0 : _a.textContent) || 'E-commerce';
                        console.log('Parsed content:', {
                            hasMainContent: !!newMainContent,
                            title: newTitle
                        });
                        if (!newMainContent) return [3 /*break*/, 7];
                        currentMain = document.querySelector('main, .main-content, .content');
                        console.log('Current main element found:', !!currentMain);
                        if (currentMain) {
                            currentMain.innerHTML = newMainContent.innerHTML;
                            currentMain.className = newMainContent.className;
                            console.log('Content replaced successfully');
                        }
                        document.title = newTitle;
                        console.log('Loading page styles...');
                        return [4 /*yield*/, this.loadPageStyles(page)];
                    case 4:
                        _b.sent();
                        console.log('Loading page scripts...');
                        return [4 /*yield*/, this.loadPageScript(page, params)];
                    case 5:
                        _b.sent(); // ✅ Pass params to loadPageScript
                        console.log('Updating active nav item...');
                        this.updateActiveNavItem(page);
                        if (updateHistory) {
                            url = params ?
                                "/FE/HTML/".concat(page, "?").concat(new URLSearchParams(params).toString()) :
                                "/FE/HTML/".concat(page);
                            console.log('Updating history:', url, { page: page, params: params });
                            history.pushState({ page: page, params: params }, '', url);
                        }
                        this.currentPage = page;
                        console.log('Starting fadeIn...');
                        return [4 /*yield*/, this.fadeIn()];
                    case 6:
                        _b.sent();
                        console.log('FadeIn completed');
                        return [3 /*break*/, 8];
                    case 7: throw new Error('No main content found in the page');
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_2 = _b.sent();
                        console.error('Error in navigateToPage:', error_2);
                        throw error_2;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    SmoothRouter.prototype.loadPageStyles = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var styleMap, stylePath, existingStyles, link;
            return __generator(this, function (_a) {
                console.log('Loading styles for:', page);
                styleMap = {
                    'TrangChu.html': '/FE/CSS/TrangChu.css',
                    'GioHang.html': '/FE/CSS/GioHang.css',
                    'DonHang.html': '/FE/CSS/DonHang.css',
                    'DanhMuc.html': '/FE/CSS/DanhMuc.css',
                    'ThongBao.html': '/FE/CSS/ThongBao.css',
                    'YeuThich.html': '/FE/CSS/YeuThich.css',
                    'KhuyenMai.html': '/FE/CSS/KhuyenMai.css',
                    'ChiTietSanPham.html': '/FE/CSS/ChiTietSanPham.css'
                };
                stylePath = styleMap[page];
                console.log('Style path:', stylePath);
                if (stylePath) {
                    existingStyles = document.querySelectorAll('link[rel="stylesheet"]:not([href*="NavBar"])');
                    console.log('Removing existing styles:', existingStyles.length);
                    existingStyles.forEach(function (style) { return style.remove(); });
                    link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = stylePath;
                    document.head.appendChild(link);
                    console.log('New style added:', stylePath);
                }
                return [2 /*return*/];
            });
        });
    };
    // ✅ Modified to accept params and wait for functions to be available
    SmoothRouter.prototype.loadPageScript = function (page, params) {
        return __awaiter(this, void 0, void 0, function () {
            var scriptMap, scriptPath, existingScripts;
            var _this = this;
            return __generator(this, function (_a) {
                console.log('Loading script for:', page);
                scriptMap = {
                    'TrangChu.html': '/FE/ts/productRender.js',
                    'GioHang.html': '/FE/ts/gioHang.js',
                    'DonHang.html': '/FE/ts/donHang.js',
                    'DanhMuc.html': '/FE/ts/danhMuc.js',
                    'ThongBao.html': '/FE/ts/thongBao.js',
                    'YeuThich.html': '/FE/ts/yeuThich.js',
                    'KhuyenMai.html': '/FE/ts/khuyenMai.js',
                    'ChiTietSanPham.html': '/FE/ts/chiTietSanPham.js'
                };
                scriptPath = scriptMap[page];
                console.log('Script path:', scriptPath);
                if (scriptPath) {
                    existingScripts = document.querySelectorAll('script[src]:not([src*="navBar"]):not([src*="router"])');
                    console.log('Removing existing scripts:', existingScripts.length);
                    existingScripts.forEach(function (script) { return script.remove(); });
                    return [2 /*return*/, new Promise(function (resolve) {
                            var script = document.createElement('script');
                            script.src = scriptPath + '?t=' + Date.now();
                            script.onload = function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            console.log('Script loaded successfully:', scriptPath);
                                            // ✅ Wait for functions to be available before executing
                                            return [4 /*yield*/, this.waitForFunctionsAndExecute(page, params)];
                                        case 1:
                                            // ✅ Wait for functions to be available before executing
                                            _a.sent();
                                            resolve();
                                            return [2 /*return*/];
                                    }
                                });
                            }); };
                            script.onerror = function (e) {
                                console.error("Cannot load script:", scriptPath, e);
                                resolve(); // Vẫn resolve để không block
                            };
                            document.head.appendChild(script);
                            console.log('Script tag added to head');
                        })];
                }
                else {
                    console.log('No script mapping found for page:', page);
                }
                return [2 /*return*/];
            });
        });
    };
    // ✅ New method to wait for functions to be available
    SmoothRouter.prototype.waitForFunctionsAndExecute = function (page, params) {
        return __awaiter(this, void 0, void 0, function () {
            var maxWaitTime, checkInterval, elapsedTime, checkFunctions;
            var _this = this;
            return __generator(this, function (_a) {
                console.log('Waiting for functions to be available for:', page);
                maxWaitTime = 2000;
                checkInterval = 50;
                elapsedTime = 0;
                checkFunctions = function () {
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
                        default:
                            return true; // For pages without specific functions
                    }
                };
                return [2 /*return*/, new Promise(function (resolve) {
                        var intervalId = setInterval(function () {
                            if (checkFunctions() || elapsedTime >= maxWaitTime) {
                                clearInterval(intervalId);
                                console.log("Functions available for ".concat(page, " after ").concat(elapsedTime, "ms"));
                                _this.executePageScript(page, params);
                                resolve();
                            }
                            elapsedTime += checkInterval;
                        }, checkInterval);
                    })];
            });
        });
    };
    // ✅ Modified to accept params
    SmoothRouter.prototype.executePageScript = function (page, params) {
        console.log('Executing page script for:', page, 'with params:', params);
        try {
            switch (page) {
                case 'TrangChu.html':
                    console.log('Executing TrangChu script...');
                    if (window.initTrangChu) {
                        window.initTrangChu();
                    }
                    else if (window.renderProducts) {
                        window.renderProducts();
                    }
                    break;
                case 'GioHang.html':
                    console.log('Executing GioHang script...');
                    if (window.initGioHang) {
                        window.initGioHang();
                    }
                    else if (window.loadGioHang) {
                        window.loadGioHang();
                    }
                    break;
                case 'ChiTietSanPham.html':
                    console.log('Executing ChiTietSanPham script...');
                    console.log('Available functions:', {
                        initChiTietSanPham: typeof window.initChiTietSanPham,
                        renderChiTietSanPham: typeof window.renderChiTietSanPham
                    });
                    // ✅ Store params in history state for ChiTietSanPham
                    if (params) {
                        history.replaceState({ page: page, params: params }, '', window.location.href);
                    }
                    if (window.initChiTietSanPham) {
                        window.initChiTietSanPham();
                    }
                    else if (window.renderChiTietSanPham) {
                        window.renderChiTietSanPham();
                    }
                    else {
                        console.warn('No ChiTietSanPham functions available');
                    }
                    break;
                case 'DanhMuc.html':
                    console.log('Executing DanhMuc script...');
                    if (window.initDanhMuc) {
                        window.initDanhMuc();
                    }
                    break;
                case 'YeuThich.html':
                    console.log('Executing YeuThich script...');
                    if (window.initYeuThich) {
                        window.initYeuThich();
                    }
                    break;
                default:
                    console.log('No specific script execution for:', page);
            }
        }
        catch (error) {
            console.error('Error executing page script:', error);
        }
    };
    SmoothRouter.prototype.fadeOut = function () {
        console.log('FadeOut started');
        return new Promise(function (resolve) {
            var mainContent = document.querySelector('main, .main-content, .content');
            console.log('Main content for fadeOut:', !!mainContent);
            if (mainContent) {
                mainContent.style.transition = 'opacity 0.2s ease-out';
                mainContent.style.opacity = '0.3';
                setTimeout(function () {
                    console.log('FadeOut completed');
                    resolve();
                }, 200);
            }
            else {
                console.log('No main content found for fadeOut');
                resolve();
            }
        });
    };
    SmoothRouter.prototype.fadeIn = function () {
        console.log('FadeIn started');
        return new Promise(function (resolve) {
            var mainContent = document.querySelector('main, .main-content, .content');
            console.log('Main content for fadeIn:', !!mainContent);
            if (mainContent) {
                mainContent.style.transition = 'opacity 0.3s ease-in';
                mainContent.style.opacity = '1';
                setTimeout(function () {
                    console.log('FadeIn completed');
                    resolve();
                }, 300);
            }
            else {
                console.log('No main content found for fadeIn');
                resolve();
            }
        });
    };
    SmoothRouter.prototype.updateActiveNavItem = function (page) {
        console.log('Updating active nav item for:', page);
        var navItems = document.querySelectorAll('.nav-bar .nav-item');
        console.log('Nav items found:', navItems.length);
        navItems.forEach(function (item) {
            var itemPage = item.getAttribute('data-page');
            if (itemPage === page) {
                item.classList.add('active');
                console.log('Added active class to:', itemPage);
            }
            else {
                item.classList.remove('active');
            }
        });
    };
    SmoothRouter.prototype.init = function () {
        console.log('Router init called');
        var currentPage = window.location.pathname.split('/').pop() || 'TrangChu.html';
        console.log('Current page detected:', currentPage);
        this.currentPage = currentPage;
        this.updateActiveNavItem(currentPage);
    };
    return SmoothRouter;
}());
// Khởi tạo router
console.log('Creating SmoothRouter instance');
window.smoothRouter = new SmoothRouter();
