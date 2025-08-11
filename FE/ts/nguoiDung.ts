interface User2 {
    _id: string;
    _email: string;
    _ho: string;
    _ten: string;
    _so_dien_thoai?: string;
    _dia_chi?: string;
    _ngay_sinh?: string;
    _role?: string;
    _role_id?: string;
}

interface UpdateUserData {
    id: string;
    email: string;
    ho: string;
    ten: string;
    so_dien_thoai?: string;
    dia_chi?: string;
    ngay_sinh?: string | null;
    role_id: string;
    mat_khau?: string;
}

interface VietnamLocations {
    [province: string]: string[];
}

// Dữ liệu địa chỉ Việt Nam (mẫu)
const vietnamLocations: VietnamLocations = {
    "Hồ Chí Minh": ["Quận 1", "Quận 2", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7", "Quận 8", "Quận 9", "Quận 10", "Quận 11", "Quận 12", "Quận Bình Tân", "Quận Bình Thạnh", "Quận Gò Vấp", "Quận Phú Nhuận", "Quận Tân Bình", "Quận Tân Phú", "Quận Thủ Đức", "Huyện Bình Chánh", "Huyện Cần Giờ", "Huyện Củ Chi", "Huyện Hóc Môn", "Huyện Nhà Bè"],
    "Hà Nội": ["Quận Ba Đình", "Quận Hoàn Kiếm", "Quận Tây Hồ", "Quận Long Biên", "Quận Cầu Giấy", "Quận Đống Đa", "Quận Hai Bà Trưng", "Quận Hoàng Mai", "Quận Thanh Xuân", "Quận Nam Từ Liêm", "Quận Bắc Từ Liêm", "Quận Hà Đông", "Thị xã Sơn Tây", "Huyện Ba Vì", "Huyện Chương Mỹ", "Huyện Dan Phượng", "Huyện Đông Anh", "Huyện Gia Lâm", "Huyện Hoài Đức", "Huyện Mê Linh", "Huyện Mỹ Đức", "Huyện Phú Xuyên", "Huyện Phúc Thọ", "Huyện Quốc Oai", "Huyện Sóc Sơn", "Huyện Thạch Thất", "Huyện Thanh Oai", "Huyện Thanh Trì", "Huyện Thường Tín", "Huyện Ứng Hòa"],
    "Đà Nẵng": ["Quận Hải Châu", "Quận Thanh Khê", "Quận Sơn Trà", "Quận Ngũ Hành Sơn", "Quận Liên Chiểu", "Quận Cẩm Lệ", "Huyện Hòa Vang", "Huyện Hoàng Sa"],
    "Cần Thơ": ["Quận Ninh Kiều", "Quận Ô Môn", "Quận Bình Thuỷ", "Quận Cái Răng", "Quận Thốt Nốt", "Huyện Vĩnh Thạnh", "Huyện Cờ Đỏ", "Huyện Phong Điền", "Huyện Thới Lai"],
    "Hải Phòng": ["Quận Hồng Bàng", "Quận Ngô Quyền", "Quận Lê Chân", "Quận Hải An", "Quận Kiến An", "Quận Đồ Sơn", "Quận Dương Kinh", "Huyện Thuỷ Nguyên", "Huyện An Dương", "Huyện An Lão", "Huyện Kiến Thuỵ", "Huyện Tiên Lãng", "Huyện Vĩnh Bảo", "Huyện Cát Hải", "Huyện Bạch Long Vĩ"]
};

let currentUser: User2 | null = null;

document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    initializeLocationSelects();
    setupFormHandlers();
});

function loadUserData(): void {
    const userContext = localStorage.getItem('usercontext');
    if (!userContext) {
        alert('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
        return;
    }
    currentUser = JSON.parse(userContext) as User2;
    displayUserInfo();
}

function displayUserInfo(): void {
    if (!currentUser) return;

    const firstName = currentUser._ten || 'U';
    (document.getElementById('userAvatar') as HTMLElement).textContent = firstName.charAt(0).toUpperCase();
    (document.getElementById('displayName') as HTMLElement).textContent =
        `${currentUser._ho || ''} ${currentUser._ten || ''}`.trim();
    (document.getElementById('displayRole') as HTMLElement).textContent = currentUser._role || '';

    (document.getElementById('displayHo') as HTMLInputElement).value = currentUser._ho || '';
    (document.getElementById('displayTen') as HTMLInputElement).value = currentUser._ten || '';
    (document.getElementById('displayEmail') as HTMLInputElement).value = currentUser._email || '';
    (document.getElementById('displayPhone') as HTMLInputElement).value = currentUser._so_dien_thoai || '';

    if (currentUser._ngay_sinh) {
        const birthDate = new Date(currentUser._ngay_sinh);
        (document.getElementById('displayBirthday') as HTMLInputElement).value = birthDate.toISOString().split('T')[0];
    }

    (document.getElementById('displayAddress') as HTMLInputElement).value = currentUser._dia_chi || '';
}

function initializeLocationSelects(): void {
    const provinceSelect = document.getElementById('editProvince') as HTMLSelectElement;
    const districtSelect = document.getElementById('editDistrict') as HTMLSelectElement;

    Object.keys(vietnamLocations).forEach(province => {
        const option = document.createElement('option');
        option.value = province;
        option.textContent = province;
        provinceSelect.appendChild(option);
    });

    provinceSelect.addEventListener('change', function () {
        districtSelect.innerHTML = '<option value="">Chọn quận/huyện/thị xã</option>';
        const selectedProvince = (this as HTMLSelectElement).value;

        if (selectedProvince && vietnamLocations[selectedProvince]) {
            vietnamLocations[selectedProvince].forEach(district => {
                const option = document.createElement('option');
                option.value = district;
                option.textContent = district;
                districtSelect.appendChild(option);
            });
        }
    });
}

function toggleEditMode(): void {
    if (!currentUser) return;

    document.getElementById('viewMode')?.classList.add('hidden');
    document.getElementById('editMode')?.classList.add('active');

    (document.getElementById('editHo') as HTMLInputElement).value = currentUser._ho || '';
    (document.getElementById('editTen') as HTMLInputElement).value = currentUser._ten || '';
    (document.getElementById('editEmail') as HTMLInputElement).value = currentUser._email || '';
    (document.getElementById('editPhone') as HTMLInputElement).value = currentUser._so_dien_thoai || '';

    if (currentUser._ngay_sinh) {
        const birthDate = new Date(currentUser._ngay_sinh);
        (document.getElementById('editBirthday') as HTMLInputElement).value = birthDate.toISOString().split('T')[0];
    }

    parseAddress(currentUser._dia_chi || '');
}

function cancelEdit(): void {
    document.getElementById('editMode')?.classList.remove('active');
    document.getElementById('viewMode')?.classList.remove('hidden');
    (document.getElementById('profileForm') as HTMLFormElement).reset();
    (document.getElementById('editDistrict') as HTMLSelectElement).innerHTML = '<option value="">Chọn quận/huyện/thị xã</option>';
}

function parseAddress(address: string): void {
    if (!address) return;

    const parts = address.split(',').map(part => part.trim());
    if (parts.length >= 3) {
        (document.getElementById('editDetailAddress') as HTMLInputElement).value = parts[0] || '';

        const district = parts[1] || '';
        const province = parts[2] || '';

        const provinceSelect = document.getElementById('editProvince') as HTMLSelectElement;
        provinceSelect.value = province;
        provinceSelect.dispatchEvent(new Event('change'));

        setTimeout(() => {
            (document.getElementById('editDistrict') as HTMLSelectElement).value = district;
        }, 100);
    }
}

function preventComma(input: HTMLInputElement): void {
    input.value = input.value.replace(/,/g, '');
}

function setupFormHandlers(): void {
    (document.getElementById('profileForm') as HTMLFormElement).addEventListener('submit', async (e) => {
        e.preventDefault();
        await updateProfile();
    });
}

async function updateProfile(): Promise<void> {
    try {
        const formElement = document.getElementById('profileForm') as HTMLFormElement;
        const formData = new FormData(formElement);
        const data = Object.fromEntries(
            (formData as any).entries()
        ) as Record<string, string>;


        const detailAddress = (document.getElementById('editDetailAddress') as HTMLInputElement).value.trim();
        const district = (document.getElementById('editDistrict') as HTMLSelectElement).value;
        const province = (document.getElementById('editProvince') as HTMLSelectElement).value;

        let fullAddress = '';
        if (detailAddress || district || province) {
            fullAddress = [detailAddress, district, province].filter(part => part).join(', ');
        }

        const updateData: UpdateUserData = {
            id: currentUser?._id || '',
            email: data.email,
            ho: data.ho,
            ten: data.ten,
            so_dien_thoai: data.so_dien_thoai || '',
            dia_chi: fullAddress,
            ngay_sinh: data.ngay_sinh || null,
            role_id: currentUser?._role_id || 'USER'
        };

        if (data.old_password && data.new_password) {
            if (data.new_password !== data.confirm_password) {
                showAlert('Mật khẩu xác nhận không khớp!', 'error');
                return;
            }
            updateData.mat_khau = data.new_password;
        }

        const response = await fetch('http://localhost:3000/api/nguoi-dung/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });

        const result = await response.json();

        if (response.ok) {
            if (currentUser) {
                currentUser._ho = updateData.ho;
                currentUser._ten = updateData.ten;
                currentUser._email = updateData.email;
                currentUser._so_dien_thoai = updateData.so_dien_thoai;
                currentUser._dia_chi = updateData.dia_chi;
                currentUser._ngay_sinh = updateData.ngay_sinh || undefined;
                localStorage.setItem('usercontext', JSON.stringify(currentUser));
            }
            displayUserInfo();
            cancelEdit();
            showAlert('Cập nhật thông tin thành công!', 'success');
        } else {
            showAlert(result.message || 'Có lỗi xảy ra khi cập nhật!', 'error');
        }
    } catch (error) {
        console.error('Lỗi cập nhật:', error);
        showAlert('Có lỗi xảy ra. Vui lòng thử lại!', 'error');
    }
}

function showAlert(message: string, type: 'success' | 'error'): void {
    const alertId = type === 'success' ? 'successAlert' : 'errorAlert';
    const alertElement = document.getElementById(alertId) as HTMLElement;

    alertElement.textContent = message;
    alertElement.style.display = 'block';

    setTimeout(() => {
        alertElement.style.display = 'none';
    }, 3000);
}
