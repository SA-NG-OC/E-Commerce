

// Dữ liệu địa chỉ Việt Nam
const vietnamLocations = {
    "Hồ Chí Minh": ["Quận 1", "Quận 2", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7", "Quận 8", "Quận 9", "Quận 10", "Quận 11", "Quận 12", "Quận Bình Tân", "Quận Bình Thạnh", "Quận Gò Vấp", "Quận Phú Nhuận", "Quận Tân Bình", "Quận Tân Phú", "Quận Thủ Đức", "Huyện Bình Chánh", "Huyện Cần Giờ", "Huyện Củ Chi", "Huyện Hóc Môn", "Huyện Nhà Bè"],
    "Hà Nội": ["Quận Ba Đình", "Quận Hoàn Kiếm", "Quận Tây Hồ", "Quận Long Biên", "Quận Cầu Giấy", "Quận Đống Đa", "Quận Hai Bà Trưng", "Quận Hoàng Mai", "Quận Thanh Xuân", "Quận Nam Từ Liêm", "Quận Bắc Từ Liêm", "Quận Hà Đông", "Thị xã Sơn Tây", "Huyện Ba Vì", "Huyện Chương Mỹ", "Huyện Dan Phượng", "Huyện Đông Anh", "Huyện Gia Lâm", "Huyện Hoài Đức", "Huyện Mê Linh", "Huyện Mỹ Đức", "Huyện Phú Xuyên", "Huyện Phúc Thọ", "Huyện Quốc Oai", "Huyện Sóc Sơn", "Huyện Thạch Thất", "Huyện Thanh Oai", "Huyện Thanh Trì", "Huyện Thường Tín", "Huyện Ứng Hòa"],
    "Đà Nẵng": ["Quận Hải Châu", "Quận Thanh Khê", "Quận Sơn Trà", "Quận Ngũ Hành Sơn", "Quận Liên Chiểu", "Quận Cẩm Lệ", "Huyện Hòa Vang", "Huyện Hoàng Sa"],
    "Cần Thơ": ["Quận Ninh Kiều", "Quận Ô Môn", "Quận Bình Thuỷ", "Quận Cái Răng", "Quận Thốt Nốt", "Huyện Vĩnh Thạnh", "Huyện Cờ Đỏ", "Huyện Phong Điền", "Huyện Thới Lai"],
    "Hải Phòng": ["Quận Hồng Bàng", "Quận Ngô Quyền", "Quận Lê Chân", "Quận Hải An", "Quận Kiến An", "Quận Đồ Sơn", "Quận Dương Kinh", "Huyện Thuỷ Nguyên", "Huyện An Dương", "Huyện An Lão", "Huyện Kiến Thuỵ", "Huyện Tiên Lãng", "Huyện Vĩnh Bảo", "Huyện Cát Hải", "Huyện Bạch Long Vĩ"],
    "An Giang": ["Thành phố Long Xuyên", "Thành phố Châu Đốc", "Huyện An Phú", "Huyện Tân Châu", "Huyện Phú Tân", "Huyện Châu Phú", "Huyện Tịnh Biên", "Huyện Tri Tôn", "Huyện Châu Thành", "Huyện Chợ Mới", "Huyện Thoại Sơn"],
    "Bà Rịa - Vũng Tàu": ["Thành phố Vũng Tàu", "Thành phố Bà Rịa", "Thị xã Phú Mỹ", "Huyện Côn Đảo", "Huyện Tân Thành", "Huyện Châu Đức", "Huyện Xuyên Mộc", "Huyện Long Điền"],
    "Bạc Liêu": ["Thành phố Bạc Liêu", "Huyện Hồng Dân", "Huyện Phước Long", "Huyện Vĩnh Lợi", "Huyện Giá Rai", "Huyện Đông Hải", "Huyện Hoà Bình"]
};

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', function () {
    initializeLocationSelects();
    setupFormValidation();
    setupFormSubmission();
});

function getAuthHeaders() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// Khởi tạo dropdown địa chỉ
function initializeLocationSelects() {
    const provinceSelect = document.getElementById('province');
    const districtSelect = document.getElementById('district');

    // Thêm các tỉnh/thành phố
    Object.keys(vietnamLocations).forEach(province => {
        const option = document.createElement('option');
        option.value = province;
        option.textContent = province;
        provinceSelect.appendChild(option);
    });

    // Xử lý khi chọn tỉnh
    provinceSelect.addEventListener('change', function () {
        districtSelect.innerHTML = '<option value="">Chọn quận/huyện/thị xã</option>';

        if (this.value && vietnamLocations[this.value]) {
            vietnamLocations[this.value].forEach(district => {
                const option = document.createElement('option');
                option.value = district;
                option.textContent = district;
                districtSelect.appendChild(option);
            });
        }
    });
}

// Ngăn chặn nhập dấu phẩy
function preventComma(input) {
    input.value = input.value.replace(/,/g, '');
}

// Thiết lập validation form
function setupFormValidation() {
    const form = document.getElementById('registerForm');
    const inputs = form.querySelectorAll('input[required]');

    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            validateField(this);
        });

        input.addEventListener('input', function () {
            if (this.id === 'password') {
                checkPasswordStrength(this.value);
            }
            if (this.id === 'confirmPassword') {
                validatePasswordMatch();
            }
        });
    });

    // Validation email real-time
    document.getElementById('email').addEventListener('input', function () {
        validateEmail(this.value);
    });

    // Validation phone real-time
    document.getElementById('soDienThoai').addEventListener('input', function () {
        validatePhone(this.value);
    });
}

// Kiểm tra độ mạnh mật khẩu
function checkPasswordStrength(password) {
    const strengthElement = document.getElementById('passwordStrength');
    let strength = '';
    let className = '';

    if (password.length < 6) {
        strength = 'Mật khẩu quá ngắn (tối thiểu 6 ký tự)';
        className = 'weak';
    } else if (password.length < 8) {
        strength = 'Độ mạnh: Yếu';
        className = 'weak';
    } else if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)) {
        strength = 'Độ mạnh: Mạnh';
        className = 'strong';
    } else {
        strength = 'Độ mạnh: Trung bình';
        className = 'medium';
    }

    strengthElement.textContent = strength;
    strengthElement.className = `password-strength ${className}`;
}

// Validate individual field
function validateField(field) {
    const validationElement = document.getElementById(field.id + 'Validation');
    if (!validationElement) return;

    if (field.validity.valueMissing) {
        showValidation(validationElement, 'Trường này không được để trống', 'error');
        return false;
    } else {
        showValidation(validationElement, '', 'success');
        return true;
    }
}

// Validate email
function validateEmail(email) {
    const validationElement = document.getElementById('emailValidation');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email && !emailRegex.test(email)) {
        showValidation(validationElement, 'Email không hợp lệ', 'error');
        return false;
    } else if (email) {
        showValidation(validationElement, 'Email hợp lệ', 'success');
        return true;
    }
    return true;
}

// Validate phone
function validatePhone(phone) {
    const validationElement = document.getElementById('phoneValidation');
    const phoneRegex = /^[0-9]{10,11}$/;

    if (phone && !phoneRegex.test(phone)) {
        showValidation(validationElement, 'Số điện thoại không hợp lệ (10-11 số)', 'error');
        return false;
    } else if (phone) {
        showValidation(validationElement, 'Số điện thoại hợp lệ', 'success');
        return true;
    }
    return true;
}

// Validate password match
function validatePasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const validationElement = document.getElementById('confirmPasswordValidation');

    if (confirmPassword && password !== confirmPassword) {
        showValidation(validationElement, 'Mật khẩu xác nhận không khớp', 'error');
        return false;
    } else if (confirmPassword && password === confirmPassword) {
        showValidation(validationElement, 'Mật khẩu khớp', 'success');
        return true;
    }
    return true;
}

// Show validation message
function showValidation(element, message, type) {
    element.textContent = message;
    element.className = `form-validation ${type}`;
}

// Thiết lập xử lý form submission
function setupFormSubmission() {
    document.getElementById('registerForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        await handleRegistration();
    });
}

// Xử lý đăng ký
async function handleRegistration() {
    // Validate toàn bộ form trước khi submit
    if (!validateForm()) {
        showAlert('Vui lòng kiểm tra lại thông tin đã nhập', 'error');
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    const loadingIndicator = document.getElementById('loadingIndicator');

    try {
        // Hiển thị loading
        submitBtn.disabled = true;
        loadingIndicator.classList.add('show');

        const formData = new FormData(document.getElementById('registerForm'));
        const data = Object.fromEntries(formData.entries());

        // Xây dựng địa chỉ đầy đủ
        const detailAddress = document.getElementById('detailAddress').value.trim();
        const district = document.getElementById('district').value;
        const province = document.getElementById('province').value;

        let fullAddress = '';
        if (detailAddress || district || province) {
            const addressParts = [detailAddress, district, province].filter(part => part);
            fullAddress = addressParts.join(', ');
        }

        // Chuẩn bị dữ liệu đăng ký
        const registerData = {
            email: data.email,
            mat_khau: data.password,
            ho: data.ho,
            ten: data.ten,
            so_dien_thoai: data.so_dien_thoai || '',
            dia_chi: fullAddress,
            ngay_sinh: data.ngay_sinh || null,
            role: 'USER' // Mặc định là USER như yêu cầu
        };

        // Gửi request đăng ký
        const response = await fetch('/api/nguoi-dung/create', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(registerData)
        });

        const result = await response.json();

        if (response.ok) {
            showAlert('Đăng ký thành công! Chuyển hướng đến trang đăng nhập...', 'success');

            // Reset form
            document.getElementById('registerForm').reset();
            document.getElementById('district').innerHTML = '<option value="">Chọn quận/huyện/thị xã</option>';

            // Chuyển hướng sau 0.5 giây
            setTimeout(() => {
                window.location.href = 'DangNhap.html';
            }, 500);
        } else {
            showAlert(result.message || 'Có lỗi xảy ra khi đăng ký!', 'error');
        }

    } catch (error) {
        console.error('Lỗi đăng ký:', error);
        showAlert('Có lỗi xảy ra. Vui lòng thử lại!', 'error');
    } finally {
        // Ẩn loading
        submitBtn.disabled = false;
        loadingIndicator.classList.remove('show');
    }
}

// Validate toàn bộ form
function validateForm() {
    let isValid = true;

    // Kiểm tra các trường bắt buộc
    const requiredFields = ['ho', 'ten', 'email', 'password', 'confirmPassword'];

    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            validateField(field);
            isValid = false;
        }
    });

    // Kiểm tra email
    const email = document.getElementById('email').value;
    if (email && !validateEmail(email)) {
        isValid = false;
    }

    // Kiểm tra mật khẩu
    const password = document.getElementById('password').value;
    if (password.length < 6) {
        isValid = false;
    }

    // Kiểm tra mật khẩu khớp
    if (!validatePasswordMatch()) {
        isValid = false;
    }

    // Kiểm tra số điện thoại nếu có
    const phone = document.getElementById('soDienThoai').value;
    if (phone && !validatePhone(phone)) {
        isValid = false;
    }

    return isValid;
}

// Hiển thị thông báo
function showAlert(message, type) {
    const alertId = type === 'success' ? 'successAlert' : 'errorAlert';
    const alertElement = document.getElementById(alertId);

    // Ẩn alert khác
    document.getElementById('successAlert').style.display = 'none';
    document.getElementById('errorAlert').style.display = 'none';

    alertElement.textContent = message;
    alertElement.style.display = 'block';

    // Scroll đến alert
    alertElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Tự động ẩn sau 5 giây (trừ success message)
    if (type !== 'success') {
        setTimeout(() => {
            alertElement.style.display = 'none';
        }, 5000);
    }
}
