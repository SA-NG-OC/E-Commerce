let isLoading = false;

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(inputId + '-icon');

    if (input.type === 'password') {
        input.type = 'text';
        icon.innerHTML = '<path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>';
    } else {
        input.type = 'password';
        icon.innerHTML = '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>';
    }
}

// Clear error when user starts typing
function clearError(fieldId) {
    const errorElement = document.getElementById(fieldId + '-error');
    const inputElement = document.getElementById(fieldId);

    if (errorElement) {
        errorElement.style.display = 'none';
    }

    if (inputElement) {
        inputElement.classList.remove('error');
    }
}

// Add event listeners to clear errors
// Sự kiện click để chuyển sang màn đăng nhập
document.addEventListener('DOMContentLoaded', function () {
    // Clear error khi gõ (code cũ của bạn)
    const inputs = ['email', 'ho', 'ten', 'mat_khau', 'confirmPassword', 'so_dien_thoai'];
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', () => clearError(inputId));
        }
    });

    // Chuyển sang màn DangNhap.html
    const goToLogin = document.getElementById('goToLogin');
    if (goToLogin) {
        goToLogin.addEventListener('click', function (e) {
            e.preventDefault(); // Không load lại trang theo link #
            window.location.href = 'DangNhap.html';
        });
    }
});



// Show error message
function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + '-error');
    const inputElement = document.getElementById(fieldId);

    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    if (inputElement) {
        inputElement.classList.add('error');
    }
}

// Show message
function showMessage(message, type) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.className = `message ${type}`;
    messageElement.style.display = 'block';
}

// Validate form
function validateForm() {
    let isValid = true;

    // Get form values
    const email = document.getElementById('email').value.trim();
    const mat_khau = document.getElementById('mat_khau').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const ho = document.getElementById('ho').value.trim();
    const ten = document.getElementById('ten').value.trim();
    const so_dien_thoai = document.getElementById('so_dien_thoai').value.trim();

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        showError('email', 'Email là bắt buộc');
        isValid = false;
    } else if (!emailRegex.test(email)) {
        showError('email', 'Email không hợp lệ');
        isValid = false;
    }

    // Password validation
    if (!mat_khau) {
        showError('mat_khau', 'Mật khẩu là bắt buộc');
        isValid = false;
    } else if (mat_khau.length < 6) {
        showError('mat_khau', 'Mật khẩu phải có ít nhất 6 ký tự');
        isValid = false;
    }

    // Confirm password validation
    if (mat_khau !== confirmPassword) {
        showError('confirmPassword', 'Mật khẩu xác nhận không khớp');
        isValid = false;
    }

    // Name validation
    if (!ho) {
        showError('ho', 'Họ là bắt buộc');
        isValid = false;
    }
    if (!ten) {
        showError('ten', 'Tên là bắt buộc');
        isValid = false;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10,11}$/;
    if (so_dien_thoai && !phoneRegex.test(so_dien_thoai)) {
        showError('so_dien_thoai', 'Số điện thoại không hợp lệ (10-11 số)');
        isValid = false;
    }

    return isValid;
}

// Handle form submission
async function handleSubmit() {
    if (isLoading || !validateForm()) {
        return;
    }

    setLoading(true);
    document.getElementById('message').style.display = 'none';

    try {
        const formData = {
            email: document.getElementById('email').value.trim(),
            mat_khau: document.getElementById('mat_khau').value,
            ho: document.getElementById('ho').value.trim(),
            ten: document.getElementById('ten').value.trim(),
            so_dien_thoai: document.getElementById('so_dien_thoai').value.trim(),
            dia_chi: document.getElementById('dia_chi').value.trim(),
            ngay_sinh: document.getElementById('ngay_sinh').value,
            role: 'USER' // Mặc định là USER cho đăng ký
        };

        const response = await fetch('http://localhost:3000/api/nguoi-dung/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            showMessage('Đăng ký tài khoản thành công!', 'success');
            // Reset form
            resetForm();
            // Chuyển sang màn đăng nhập sau 1-2 giây
            setTimeout(() => {
                window.location.href = 'DangNhap.html';
            }, 1500); // 1.5 giây để người dùng kịp thấy thông báo
        }
        else {
            showMessage(result.message || 'Có lỗi xảy ra khi đăng ký', 'error');
        }
    } catch (error) {
        console.error('Lỗi khi đăng ký:', error);
        showMessage('Không thể kết nối đến máy chủ', 'error');
    } finally {
        setLoading(false);
    }
}

// Set loading state
function setLoading(loading) {
    isLoading = loading;
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');

    if (loading) {
        submitBtn.disabled = true;
        btnText.innerHTML = '<div class="spinner"></div>Đang xử lý...';
    } else {
        submitBtn.disabled = false;
        btnText.textContent = 'Đăng ký tài khoản';
    }
}

// Reset form
function resetForm() {
    const inputs = ['email', 'mat_khau', 'confirmPassword', 'ho', 'ten', 'so_dien_thoai', 'dia_chi', 'ngay_sinh'];
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.value = '';
            input.classList.remove('error');
        }

        const errorElement = document.getElementById(inputId + '-error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    });
}

// Allow Enter key to submit
document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !isLoading) {
        handleSubmit();
    }
});