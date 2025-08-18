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
            localStorage.setItem('token', data.token);
            localStorage.setItem('usercontext', JSON.stringify(data.user));

            const redirectPath = sessionStorage.getItem('redirectAfterLogin') ||
                sessionStorage.getItem('adminRedirectAfterLogin');

            if (redirectPath) {
                sessionStorage.removeItem('redirectAfterLogin');
                sessionStorage.removeItem('adminRedirectAfterLogin');
                window.location.href = redirectPath;
            } else {
                window.location.href = '/FE/HTML/Menu.html';
            }
        } else {
            if (errorDiv) errorDiv.textContent = data.message || 'Đăng nhập thất bại';
        }
    } catch {
        if (errorDiv) errorDiv.textContent = 'Lỗi kết nối máy chủ';
    }
});

// ===== CHỨC NĂNG QUÊN MẬT KHẨU =====
let currentStep = 1;
let userEmail = '';
let userOtp = '';

// Xử lý nút "Quên mật khẩu"
document.querySelector('.forgot-password-link')?.addEventListener('click', function () {
    showForgotPasswordModal();
});

function showForgotPasswordModal() {
    currentStep = 1;
    userEmail = '';

    const modal = document.createElement('div');
    modal.id = 'forgot-password-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <div id="step-content">
                ${getStepContent()}
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    modal.querySelector('.close')?.addEventListener('click', closeForgotPasswordModal);

    bindFormEvents();
}

function getStepContent(): string {
    switch (currentStep) {
        case 1:
            return `
                <h3>Quên mật khẩu</h3>
                <form id="email-form">
                    <div class="form-group">
                        <input type="email" id="forgot-email" placeholder="Nhập email của bạn" required>
                    </div>
                    <button type="submit" class="btn-primary">Gửi OTP</button>
                    <div id="forgot-error" class="error-message"></div>
                </form>
            `;
        case 2:
            return `
                <h3>Nhập mã OTP</h3>
                <p>Mã OTP đã được gửi đến <strong>${userEmail}</strong></p>
                <form id="otp-form">
                    <div class="form-group">
                        <input type="text" id="otp" placeholder="Nhập mã OTP 6 số" maxlength="6" required>
                    </div>
                    <button type="submit" class="btn-primary">Xác nhận</button>
                    <button type="button" id="back-to-email" class="btn-secondary">Quay lại</button>
                    <div id="forgot-error" class="error-message"></div>
                </form>
            `;
        case 3:
            return `
                <h3>Đặt lại mật khẩu</h3>
                <form id="password-form">
                    <div class="form-group">
                        <input type="password" id="new-password" placeholder="Mật khẩu mới" required>
                    </div>
                    <div class="form-group">
                        <input type="password" id="confirm-password" placeholder="Xác nhận mật khẩu" required>
                    </div>
                    <button type="submit" class="btn-primary">Đổi mật khẩu</button>
                    <button type="button" id="back-to-otp" class="btn-secondary">Quay lại</button>
                    <div id="forgot-error" class="error-message"></div>
                </form>
            `;
        default:
            return '';
    }
}

function updateModalContent() {
    const stepContent = document.getElementById('step-content');
    if (stepContent) {
        stepContent.innerHTML = getStepContent();
        bindFormEvents();
    }
}

function bindFormEvents() {
    const emailForm = document.getElementById('email-form');
    const otpForm = document.getElementById('otp-form');
    const passwordForm = document.getElementById('password-form');

    if (emailForm) {
        emailForm.addEventListener('submit', handleEmailSubmit);
    }
    if (otpForm) {
        otpForm.addEventListener('submit', handleOTPSubmit);
        document.getElementById('back-to-email')?.addEventListener('click', () => {
            currentStep = 1;
            updateModalContent();
        });
    }
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordSubmit);
        document.getElementById('back-to-otp')?.addEventListener('click', () => {
            currentStep = 2;
            updateModalContent();
        });
    }
}

function showError4(message: string) {
    const errorDiv = document.getElementById('forgot-error');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

function clearError() {
    const errorDiv = document.getElementById('forgot-error');
    if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
    }
}

async function handleEmailSubmit(e: Event) {
    e.preventDefault();
    clearError();

    const emailInput = document.getElementById('forgot-email') as HTMLInputElement;
    const email = emailInput.value.trim();

    if (!email) {
        showError4('Vui lòng nhập email');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/nguoi-dung/forgot-password/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            userEmail = email;
            currentStep = 2;
            updateModalContent();
        } else {
            showError4(data.message || 'Email không tồn tại');
        }
    } catch (error) {
        showError4('Lỗi kết nối máy chủ');
    }
}

async function handleOTPSubmit(e: Event) {
    e.preventDefault();
    clearError();

    const otpInput = document.getElementById('otp') as HTMLInputElement;
    const otp = otpInput.value.trim();

    if (!otp || otp.length !== 6) {
        showError4('Vui lòng nhập mã OTP 6 số');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/nguoi-dung/forgot-password/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail, otp })
        });

        const data = await response.json();

        if (response.ok) {
            userOtp = otp; // ✅ lưu lại OTP đã verify
            currentStep = 3;
            updateModalContent();
        } else {
            showError4(data.message || 'Mã OTP không hợp lệ hoặc đã hết hạn');
        }
    } catch (error) {
        showError4('Lỗi kết nối máy chủ');
    }
}

async function handlePasswordSubmit(e: Event) {
    e.preventDefault();
    clearError();

    const newPasswordInput = document.getElementById('new-password') as HTMLInputElement;
    const confirmPasswordInput = document.getElementById('confirm-password') as HTMLInputElement;

    const newPassword = newPasswordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if (!newPassword || !confirmPassword) {
        showError4('Vui lòng điền đầy đủ thông tin');
        return;
    }

    if (newPassword !== confirmPassword) {
        showError4('Mật khẩu xác nhận không khớp');
        return;
    }

    if (newPassword.length < 6) {
        showError4('Mật khẩu phải có ít nhất 6 ký tự');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/nguoi-dung/forgot-password/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: userEmail,
                otp: userOtp,   // ✅ dùng lại OTP đã lưu
                newPassword
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Mật khẩu đã được đổi thành công! Vui lòng đăng nhập lại.');
            closeForgotPasswordModal();
        } else {
            showError4(data.message || 'Có lỗi xảy ra khi đổi mật khẩu');
        }
    } catch (error) {
        showError4('Lỗi kết nối máy chủ');
    }
}

function closeForgotPasswordModal() {
    const modal = document.getElementById('forgot-password-modal');
    if (modal) {
        modal.remove();
    }
    currentStep = 1;
    userEmail = '';
}