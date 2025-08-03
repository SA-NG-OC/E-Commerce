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
var _a;
(_a = document.getElementById('loginForm')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', function (e) {
    return __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');
        if (errorDiv)
            errorDiv.textContent = '';
        try {
            const res = yield fetch('http://localhost:3000/api/nguoi-dung/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = yield res.json();
            if (res.ok) {
                // Lưu user vào localStorage
                localStorage.setItem('usercontext', JSON.stringify(data.user));
                window.location.href = '/FE/HTML/TrangChu.html';
            }
            else {
                if (errorDiv)
                    errorDiv.textContent = data.message || 'Đăng nhập thất bại';
            }
        }
        catch (_a) {
            if (errorDiv)
                errorDiv.textContent = 'Lỗi kết nối máy chủ';
        }
    });
});
