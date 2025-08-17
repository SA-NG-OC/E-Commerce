// dangNhap.ts

// Hiển thị mật khẩu
const showPasswordCheckbox = document.getElementById('showPassword') as HTMLInputElement | null;
const passwordInput = document.getElementById('password') as HTMLInputElement | null;

if (showPasswordCheckbox && passwordInput) {
    showPasswordCheckbox.addEventListener('change', function () {
        passwordInput.type = this.checked ? 'text' : 'password';
    });
}

// Xử lý form đăng nhập
document.getElementById('loginForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const errorDiv = document.getElementById('loginError');

    if (errorDiv) errorDiv.textContent = '';

    if (!email || !password) {
        if (errorDiv) errorDiv.textContent = 'Vui lòng điền đầy đủ thông tin!';
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/api/nguoi-dung/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('token', data.token);              // lưu token
            localStorage.setItem('usercontext', JSON.stringify(data.user)); // lưu user

            // Kiểm tra có trang redirect không
            const redirectPath = sessionStorage.getItem('redirectAfterLogin') ||
                sessionStorage.getItem('adminRedirectAfterLogin');

            if (redirectPath) {
                // Xóa redirect path
                sessionStorage.removeItem('redirectAfterLogin');
                sessionStorage.removeItem('adminRedirectAfterLogin');
                // Redirect về trang ban đầu
                window.location.href = redirectPath;
            } else {
                // Mặc định về trang chủ
                window.location.href = '/FE/HTML/Menu.html';
            }
        } else {
            if (errorDiv) errorDiv.textContent = data.message || 'Đăng nhập thất bại';
        }
    } catch {
        if (errorDiv) errorDiv.textContent = 'Lỗi kết nối máy chủ';
    }
});