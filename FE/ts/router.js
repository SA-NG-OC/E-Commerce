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
        window.addEventListener('popstate', function (e) {
            var _a;
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
                        if (this.isNavigating)
                            return [2 /*return*/];
                        this.isNavigating = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 5, 6]);
                        return [4 /*yield*/, this.fadeOut()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.navigateToPage(page, true, params)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        error_1 = _a.sent();
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
                        _b.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, fetch("/FE/HTML/".concat(page))];
                    case 1:
                        response = _b.sent();
                        if (!response.ok)
                            throw new Error("HTTP ".concat(response.status, ": ").concat(response.statusText));
                        return [4 /*yield*/, response.text()];
                    case 2:
                        html = _b.sent();
                        parser = new DOMParser();
                        doc = parser.parseFromString(html, 'text/html');
                        newMainContent = doc.querySelector('main, .main-content, .content');
                        newTitle = ((_a = doc.querySelector('title')) === null || _a === void 0 ? void 0 : _a.textContent) || 'E-commerce';
                        if (!newMainContent) return [3 /*break*/, 6];
                        currentMain = document.querySelector('main, .main-content, .content');
                        if (currentMain) {
                            currentMain.innerHTML = newMainContent.innerHTML;
                            currentMain.className = newMainContent.className;
                        }
                        document.title = newTitle;
                        return [4 /*yield*/, this.loadPageStyles(page)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, this.loadPageScript(page, params)];
                    case 4:
                        _b.sent();
                        this.updateActiveNavItem(page);
                        if (updateHistory) {
                            url = params ?
                                "/FE/HTML/".concat(page, "?").concat(new URLSearchParams(params).toString()) :
                                "/FE/HTML/".concat(page);
                            history.pushState({ page: page, params: params }, '', url);
                        }
                        this.currentPage = page;
                        return [4 /*yield*/, this.fadeIn()];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 6: throw new Error('No main content found in the page');
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        error_2 = _b.sent();
                        throw error_2;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    SmoothRouter.prototype.loadPageStyles = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var styleMap, stylePath, existingStyles, link;
            return __generator(this, function (_a) {
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
                if (stylePath) {
                    existingStyles = document.querySelectorAll('link[rel="stylesheet"]:not([href*="NavBar"])');
                    existingStyles.forEach(function (style) { return style.remove(); });
                    link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = stylePath;
                    document.head.appendChild(link);
                }
                return [2 /*return*/];
            });
        });
    };
    SmoothRouter.prototype.loadPageScript = function (page, params) {
        return __awaiter(this, void 0, void 0, function () {
            var scriptMap, scriptPath, existingScripts;
            var _this = this;
            return __generator(this, function (_a) {
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
                if (scriptPath) {
                    existingScripts = document.querySelectorAll('script[src]:not([src*="navBar"]):not([src*="router"])');
                    existingScripts.forEach(function (script) { return script.remove(); });
                    return [2 /*return*/, new Promise(function (resolve) {
                            var script = document.createElement('script');
                            script.src = scriptPath + '?t=' + Date.now();
                            script.onload = function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.waitForFunctionsAndExecute(page, params)];
                                        case 1:
                                            _a.sent();
                                            resolve();
                                            return [2 /*return*/];
                                    }
                                });
                            }); };
                            script.onerror = function () { return resolve(); };
                            document.head.appendChild(script);
                        })];
                }
                return [2 /*return*/];
            });
        });
    };
    SmoothRouter.prototype.waitForFunctionsAndExecute = function (page, params) {
        return __awaiter(this, void 0, void 0, function () {
            var maxWaitTime, checkInterval, elapsedTime, checkFunctions;
            var _this = this;
            return __generator(this, function (_a) {
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
                        case 'DonHang.html':
                            return typeof window.initDonHang === 'function' ||
                                typeof window.loadDonHangData === 'function';
                        default:
                            return true;
                    }
                };
                return [2 /*return*/, new Promise(function (resolve) {
                        var intervalId = setInterval(function () {
                            if (checkFunctions() || elapsedTime >= maxWaitTime) {
                                clearInterval(intervalId);
                                _this.executePageScript(page, params);
                                resolve();
                            }
                            elapsedTime += checkInterval;
                        }, checkInterval);
                    })];
            });
        });
    };
    SmoothRouter.prototype.executePageScript = function (page, params) {
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
                        history.replaceState({ page: page, params: params }, '', window.location.href);
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
                    break;
            }
        }
        catch (_) { }
    };
    SmoothRouter.prototype.fadeOut = function () {
        return new Promise(function (resolve) {
            var mainContent = document.querySelector('main, .main-content, .content');
            if (mainContent) {
                mainContent.style.transition = 'opacity 0.2s ease-out';
                mainContent.style.opacity = '0.3';
                setTimeout(resolve, 200);
            }
            else {
                resolve();
            }
        });
    };
    SmoothRouter.prototype.fadeIn = function () {
        return new Promise(function (resolve) {
            var mainContent = document.querySelector('main, .main-content, .content');
            if (mainContent) {
                mainContent.style.transition = 'opacity 0.3s ease-in';
                mainContent.style.opacity = '1';
                setTimeout(resolve, 300);
            }
            else {
                resolve();
            }
        });
    };
    SmoothRouter.prototype.updateActiveNavItem = function (page) {
        var navItems = document.querySelectorAll('.nav-bar .nav-item');
        navItems.forEach(function (item) {
            var itemPage = item.getAttribute('data-page');
            if (itemPage === page) {
                item.classList.add('active');
            }
            else {
                item.classList.remove('active');
            }
        });
    };
    SmoothRouter.prototype.init = function () {
        var currentPage = window.location.pathname.split('/').pop() || 'TrangChu.html';
        this.currentPage = currentPage;
        this.updateActiveNavItem(currentPage);
    };
    return SmoothRouter;
}());
window.smoothRouter = new SmoothRouter();
