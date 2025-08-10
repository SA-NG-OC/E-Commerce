// dangNhap.ts

// Xử lý hiển thị mật khẩu
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

    // Kiểm tra dữ liệu đầu vào
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
            localStorage.setItem('usercontext', JSON.stringify(data.user));
            window.location.href = '/FE/HTML/TrangChu.html';
        } else {
            if (errorDiv) errorDiv.textContent = data.message || 'Đăng nhập thất bại';
        }
    } catch {
        if (errorDiv) errorDiv.textContent = 'Lỗi kết nối máy chủ';
    }
});
