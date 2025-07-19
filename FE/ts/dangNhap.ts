document.getElementById('loginForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const errorDiv = document.getElementById('loginError');
    if (errorDiv) errorDiv.textContent = '';
    try {
        const res = await fetch('http://localhost:3000/api/nguoi-dung/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            // Lưu user vào localStorage
            localStorage.setItem('usercontext', JSON.stringify(data.user));
            window.location.href = '/FE/HTML/TrangChu.html';
        } else {
            if (errorDiv) errorDiv.textContent = data.message || 'Đăng nhập thất bại';
        }
    } catch {
        if (errorDiv) errorDiv.textContent = 'Lỗi kết nối máy chủ';
    }
});
