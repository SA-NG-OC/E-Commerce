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
var _a, _b;
// dangNhap.ts
function getAuthHeaders0() {
    var token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': "Bearer ".concat(token)
    };
}
// Hiển thị mật khẩu
var showPasswordCheckbox = document.getElementById('showPassword');
var passwordInput = document.getElementById('password');
if (showPasswordCheckbox && passwordInput) {
    showPasswordCheckbox.addEventListener('change', function () {
        passwordInput.type = this.checked ? 'text' : 'password';
    });
}
// Xử lý form đăng nhập
(_a = document.getElementById('loginForm')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', function (e) {
    return __awaiter(this, void 0, void 0, function () {
        var email, password, errorDiv, res, data, redirectPath, role, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    e.preventDefault();
                    email = document.getElementById('email').value;
                    password = document.getElementById('password').value;
                    errorDiv = document.getElementById('loginError');
                    if (errorDiv)
                        errorDiv.textContent = '';
                    if (!email || !password) {
                        if (errorDiv)
                            errorDiv.textContent = 'Vui lòng điền đầy đủ thông tin!';
                        return [2 /*return*/];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch('/api/nguoi-dung/login', {
                            method: 'POST',
                            headers: getAuthHeaders0(),
                            body: JSON.stringify({ email: email, password: password })
                        })];
                case 2:
                    res = _b.sent();
                    return [4 /*yield*/, res.json()];
                case 3:
                    data = _b.sent();
                    if (res.ok) {
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('usercontext', JSON.stringify(data.user));
                        redirectPath = sessionStorage.getItem('redirectAfterLogin') ||
                            sessionStorage.getItem('adminRedirectAfterLogin');
                        if (redirectPath) {
                            sessionStorage.removeItem('redirectAfterLogin');
                            sessionStorage.removeItem('adminRedirectAfterLogin');
                            window.location.href = redirectPath;
                        }
                        else {
                            role = data.user._role || data.user.role;
                            if (role === "Khách hàng") {
                                window.location.href = '/HTML/Menu.html';
                            }
                            else {
                                window.location.href = '/HTML-AD/Index.html';
                            }
                        }
                    }
                    else {
                        if (errorDiv)
                            errorDiv.textContent = data.message || 'Đăng nhập thất bại';
                    }
                    return [3 /*break*/, 5];
                case 4:
                    _a = _b.sent();
                    if (errorDiv)
                        errorDiv.textContent = 'Lỗi kết nối máy chủ';
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
});
// ===== CHỨC NĂNG QUÊN MẬT KHẨU =====
var currentStep = 1;
var userEmail = '';
var userOtp = '';
// Xử lý nút "Quên mật khẩu"
(_b = document.querySelector('.forgot-password-link')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
    showForgotPasswordModal();
});
function showForgotPasswordModal() {
    var _a;
    currentStep = 1;
    userEmail = '';
    var modal = document.createElement('div');
    modal.id = 'forgot-password-modal';
    modal.className = 'modal';
    modal.innerHTML = "\n        <div class=\"modal-content\">\n            <span class=\"close\">&times;</span>\n            <div id=\"step-content\">\n                ".concat(getStepContent(), "\n            </div>\n        </div>\n    ");
    document.body.appendChild(modal);
    // Event listeners
    (_a = modal.querySelector('.close')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', closeForgotPasswordModal);
    bindFormEvents();
}
function getStepContent() {
    switch (currentStep) {
        case 1:
            return "\n                <h3>Qu\u00EAn m\u1EADt kh\u1EA9u</h3>\n                <form id=\"email-form\">\n                    <div class=\"form-group\">\n                        <input type=\"email\" id=\"forgot-email\" placeholder=\"Nh\u1EADp email c\u1EE7a b\u1EA1n\" required>\n                    </div>\n                    <button type=\"submit\" class=\"btn-primary\">G\u1EEDi OTP</button>\n                    <div id=\"forgot-error\" class=\"error-message\"></div>\n                </form>\n            ";
        case 2:
            return "\n                <h3>Nh\u1EADp m\u00E3 OTP</h3>\n                <p>M\u00E3 OTP \u0111\u00E3 \u0111\u01B0\u1EE3c g\u1EEDi \u0111\u1EBFn <strong>".concat(userEmail, "</strong></p>\n                <form id=\"otp-form\">\n                    <div class=\"form-group\">\n                        <input type=\"text\" id=\"otp\" placeholder=\"Nh\u1EADp m\u00E3 OTP 6 s\u1ED1\" maxlength=\"6\" required>\n                    </div>\n                    <button type=\"submit\" class=\"btn-primary\">X\u00E1c nh\u1EADn</button>\n                    <button type=\"button\" id=\"back-to-email\" class=\"btn-secondary\">Quay l\u1EA1i</button>\n                    <div id=\"forgot-error\" class=\"error-message\"></div>\n                </form>\n            ");
        case 3:
            return "\n                <h3>\u0110\u1EB7t l\u1EA1i m\u1EADt kh\u1EA9u</h3>\n                <form id=\"password-form\">\n                    <div class=\"form-group\">\n                        <input type=\"password\" id=\"new-password\" placeholder=\"M\u1EADt kh\u1EA9u m\u1EDBi\" required>\n                    </div>\n                    <div class=\"form-group\">\n                        <input type=\"password\" id=\"confirm-password\" placeholder=\"X\u00E1c nh\u1EADn m\u1EADt kh\u1EA9u\" required>\n                    </div>\n                    <button type=\"submit\" class=\"btn-primary\">\u0110\u1ED5i m\u1EADt kh\u1EA9u</button>\n                    <button type=\"button\" id=\"back-to-otp\" class=\"btn-secondary\">Quay l\u1EA1i</button>\n                    <div id=\"forgot-error\" class=\"error-message\"></div>\n                </form>\n            ";
        default:
            return '';
    }
}
function updateModalContent() {
    var stepContent = document.getElementById('step-content');
    if (stepContent) {
        stepContent.innerHTML = getStepContent();
        bindFormEvents();
    }
}
function bindFormEvents() {
    var _a, _b;
    var emailForm = document.getElementById('email-form');
    var otpForm = document.getElementById('otp-form');
    var passwordForm = document.getElementById('password-form');
    if (emailForm) {
        emailForm.addEventListener('submit', handleEmailSubmit);
    }
    if (otpForm) {
        otpForm.addEventListener('submit', handleOTPSubmit);
        (_a = document.getElementById('back-to-email')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
            currentStep = 1;
            updateModalContent();
        });
    }
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordSubmit);
        (_b = document.getElementById('back-to-otp')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
            currentStep = 2;
            updateModalContent();
        });
    }
}
function showError4(message) {
    var errorDiv = document.getElementById('forgot-error');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}
function clearError() {
    var errorDiv = document.getElementById('forgot-error');
    if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
    }
}
function handleEmailSubmit(e) {
    return __awaiter(this, void 0, void 0, function () {
        var emailInput, email, response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    clearError();
                    emailInput = document.getElementById('forgot-email');
                    email = emailInput.value.trim();
                    if (!email) {
                        showError4('Vui lòng nhập email');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch('/api/nguoi-dung/forgot-password/send-otp', {
                            method: 'POST',
                            headers: getAuthHeaders0(),
                            body: JSON.stringify({ email: email })
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (response.ok) {
                        userEmail = email;
                        currentStep = 2;
                        updateModalContent();
                    }
                    else {
                        showError4(data.message || 'Email không tồn tại');
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    showError4('Lỗi kết nối máy chủ');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function handleOTPSubmit(e) {
    return __awaiter(this, void 0, void 0, function () {
        var otpInput, otp, response, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    clearError();
                    otpInput = document.getElementById('otp');
                    otp = otpInput.value.trim();
                    if (!otp || otp.length !== 6) {
                        showError4('Vui lòng nhập mã OTP 6 số');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch('/api/nguoi-dung/forgot-password/verify-otp', {
                            method: 'POST',
                            headers: getAuthHeaders0(),
                            body: JSON.stringify({ email: userEmail, otp: otp })
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (response.ok) {
                        userOtp = otp; // ✅ lưu lại OTP đã verify
                        currentStep = 3;
                        updateModalContent();
                    }
                    else {
                        showError4(data.message || 'Mã OTP không hợp lệ hoặc đã hết hạn');
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    showError4('Lỗi kết nối máy chủ');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function handlePasswordSubmit(e) {
    return __awaiter(this, void 0, void 0, function () {
        var newPasswordInput, confirmPasswordInput, newPassword, confirmPassword, response, data, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    clearError();
                    newPasswordInput = document.getElementById('new-password');
                    confirmPasswordInput = document.getElementById('confirm-password');
                    newPassword = newPasswordInput.value.trim();
                    confirmPassword = confirmPasswordInput.value.trim();
                    if (!newPassword || !confirmPassword) {
                        showError4('Vui lòng điền đầy đủ thông tin');
                        return [2 /*return*/];
                    }
                    if (newPassword !== confirmPassword) {
                        showError4('Mật khẩu xác nhận không khớp');
                        return [2 /*return*/];
                    }
                    if (newPassword.length < 6) {
                        showError4('Mật khẩu phải có ít nhất 6 ký tự');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch('/api/nguoi-dung/forgot-password/reset-password', {
                            method: 'POST',
                            headers: getAuthHeaders0(),
                            body: JSON.stringify({
                                email: userEmail,
                                otp: userOtp, // ✅ dùng lại OTP đã lưu
                                newPassword: newPassword
                            })
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (response.ok) {
                        alert('Mật khẩu đã được đổi thành công! Vui lòng đăng nhập lại.');
                        closeForgotPasswordModal();
                    }
                    else {
                        showError4(data.message || 'Có lỗi xảy ra khi đổi mật khẩu');
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_3 = _a.sent();
                    showError4('Lỗi kết nối máy chủ');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function closeForgotPasswordModal() {
    var modal = document.getElementById('forgot-password-modal');
    if (modal) {
        modal.remove();
    }
    currentStep = 1;
    userEmail = '';
}
