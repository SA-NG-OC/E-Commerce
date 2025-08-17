interface NguoiDung {
    id: string;
    email: string;
    mat_khau_hash: string;
    ho: string;
    ten: string;
    so_dien_thoai: string;
    dia_chi: string;
    ngay_sinh: string;
    role_id: 'ADMIN' | 'MANAGER' | 'USER' | 'STAFF';
    ten_vai_tro: string;
}

let users: NguoiDung[] = [];
let filteredUsers: NguoiDung[] = [...users];
const itemsPerPage = 10;
let currentPage = 1;
let editingUserId: string | null = null;

// Helper function để lấy headers với token
function getAuthHeaders() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// Kiểm tra authentication trước khi load trang
async function checkAuth() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
        window.location.href = '/FE/HTML/DangNhap.html';
        return false;
    }

    try {
        const res = await fetch("http://localhost:3000/api/nguoi-dung/me", {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
            window.location.href = '/FE/HTML/DangNhap.html';
            return false;
        }
        return true;
    } catch (error) {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
        window.location.href = '/FE/HTML/DangNhap.html';
        return false;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Kiểm tra auth trước
    const isAuth = await checkAuth();
    if (!isAuth) return;

    try {
        const response = await fetch('http://localhost:3000/api/nguoi-dung/', {
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error('Không thể tải danh sách người dùng');

        const data = await response.json();

        users = data.map((item: any) => ({
            id: item._id,
            email: item._email,
            mat_khau_hash: item._mat_khau_hash,
            ho: item._ho,
            ten: item._ten,
            so_dien_thoai: item._so_dien_thoai,
            dia_chi: item._dia_chi,
            ngay_sinh: item._ngay_sinh,
            role_id: convertTenVaiTroToRoleId(item._role),
            ten_vai_tro: item._role
        }));

        filteredUsers = [...users];
        renderTable();
        updateStats2();
        setupEventListeners();
    } catch (error) {
        console.error('Lỗi khi tải người dùng:', error);
        alert('Không thể tải danh sách người dùng. Vui lòng thử lại.');
    }
});

async function fetchAndRenderUsers() {
    try {
        const response = await fetch('http://localhost:3000/api/nguoi-dung/', {
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error('Không thể tải danh sách người dùng');

        const data = await response.json();

        users = data.map((item: any) => ({
            id: item._id,
            email: item._email,
            mat_khau_hash: item._mat_khau_hash,
            ho: item._ho,
            ten: item._ten,
            so_dien_thoai: item._so_dien_thoai,
            dia_chi: item._dia_chi,
            ngay_sinh: item._ngay_sinh,
            role_id: convertTenVaiTroToRoleId(item._role),
            ten_vai_tro: item._role
        }));

        filteredUsers = [...users];
        renderTable();
    } catch (error) {
        console.error('Không thể tải danh sách người dùng:', error);
    }
}

function convertTenVaiTroToRoleId(tenVaiTro: string): 'ADMIN' | 'MANAGER' | 'USER' | 'STAFF' {
    switch (tenVaiTro) {
        case 'Quản trị viên': return 'ADMIN';
        case 'Quản lý': return 'MANAGER';
        case 'Nhân viên': return 'STAFF';
        default: return 'USER';
    }
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    const userForm = document.getElementById('userForm') as HTMLFormElement;
    searchInput.addEventListener('input', handleSearch);
    userForm.addEventListener('submit', handleFormSubmit);
}

function updateStats2() {
    (document.getElementById('totalUsers') as HTMLElement).textContent = users.length.toString();
    (document.getElementById('adminUsers') as HTMLElement).textContent = users.filter(u => u.role_id === 'ADMIN').length.toString();
    (document.getElementById('regularUsers') as HTMLElement).textContent = users.filter(u => u.role_id === 'USER').length.toString();
}

function handleSearch() {
    const searchTerm = (document.getElementById('searchInput') as HTMLInputElement).value.toLowerCase();
    filteredUsers = users.filter(user =>
        user.id.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        (user.ho + ' ' + user.ten).toLowerCase().includes(searchTerm) ||
        user.so_dien_thoai.includes(searchTerm)
    );
    currentPage = 1;
    renderTable();
}

function renderTable() {
    const tbody = document.getElementById('userTableBody') as HTMLElement;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const pageUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

    tbody.innerHTML = pageUsers.map(user => `
        <tr>
            <td><strong>${user.id}</strong></td>
            <td>${user.email}</td>
            <td>${user.ho} ${user.ten}</td>
            <td>${user.so_dien_thoai || '-'}</td>
            <td>${user.ngay_sinh ? new Date(user.ngay_sinh).toLocaleDateString('vi-VN') : '-'}</td>
            <td><span class="status-badge status-${user.role_id.toLowerCase()}">${user.ten_vai_tro}</span></td>
            <td>
                <button class="btn btn-warning" onclick="editUser('${user.id}')">✏️ Sửa</button>
                <button class="btn btn-danger" onclick="deleteUser('${user.id}')">🗑️ Xóa</button>
            </td>
        </tr>
    `).join('');

    renderPagination();
}

function renderPagination() {
    const pagination = document.getElementById('pagination') as HTMLElement;
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    let html = '';

    html += `<button ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">‹ Trước</button>`;

    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            html += `<button class="active">${i}</button>`;
        } else if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            html += `<button onclick="changePage(${i})">${i}</button>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += `<span>...</span>`;
        }
    }

    html += `<button ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">Sau ›</button>`;

    pagination.innerHTML = html;
}

function changePage(page: number) {
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderTable();
    }
}

function openAddModal() {
    editingUserId = null;
    (document.getElementById('modalTitle') as HTMLElement).textContent = 'Thêm người dùng mới';
    (document.getElementById('userForm') as HTMLFormElement).reset();
    (document.getElementById('userId') as HTMLInputElement).value = '';
    (document.getElementById('passwordGroup') as HTMLElement).style.display = 'block';
    (document.getElementById('userPassword') as HTMLInputElement).required = true;
    (document.getElementById('userModal') as HTMLElement).style.display = 'block';
}

function editUser(id: string) {
    const user = users.find(u => u.id === id);
    if (!user) return;

    editingUserId = id;
    (document.getElementById('modalTitle') as HTMLElement).textContent = 'Sửa thông tin người dùng';
    (document.getElementById('userId') as HTMLInputElement).value = user.id;
    (document.getElementById('userEmail') as HTMLInputElement).value = user.email;
    (document.getElementById('userHo') as HTMLInputElement).value = user.ho;
    (document.getElementById('userTen') as HTMLInputElement).value = user.ten;
    (document.getElementById('userPhone') as HTMLInputElement).value = user.so_dien_thoai;
    (document.getElementById('userAddress') as HTMLTextAreaElement).value = user.dia_chi;
    (document.getElementById('userBirthDate') as HTMLInputElement).value = user.ngay_sinh ? new Date(user.ngay_sinh).toISOString().split('T')[0] : '';
    (document.getElementById('userRole') as HTMLSelectElement).value = user.role_id;

    (document.getElementById('passwordGroup') as HTMLElement).style.display = 'block';
    (document.getElementById('userPassword') as HTMLInputElement).value = '';
    (document.getElementById('userPassword') as HTMLInputElement).required = false;

    const passwordLabel = document.querySelector('label[for="userPassword"]') as HTMLLabelElement;
    if (passwordLabel) {
        passwordLabel.textContent = 'Mật khẩu mới (bỏ trống nếu không đổi)';
    }

    (document.getElementById('userModal') as HTMLElement).style.display = 'block';
}

async function deleteUser(id: string) {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
        try {
            const response = await fetch(`http://localhost:3000/api/nguoi-dung/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Xóa thất bại');
            }

            alert('Đã xóa người dùng thành công!');
            await fetchAndRenderUsers();
            updateStats2();
        } catch (error) {
            console.error('Lỗi khi xóa người dùng:', error);
            alert('Đã xảy ra lỗi khi xóa người dùng');
        }
    }
}

function closeModal2() {
    (document.getElementById('userModal') as HTMLElement).style.display = 'none';
}

async function handleFormSubmit(e: Event) {
    e.preventDefault();

    const selectedRole = (document.getElementById('userRole') as HTMLSelectElement).value as 'ADMIN' | 'MANAGER' | 'USER' | 'STAFF';

    const formData = {
        email: (document.getElementById('userEmail') as HTMLInputElement).value,
        mat_khau: (document.getElementById('userPassword') as HTMLInputElement).value,
        ho: (document.getElementById('userHo') as HTMLInputElement).value,
        ten: (document.getElementById('userTen') as HTMLInputElement).value,
        so_dien_thoai: (document.getElementById('userPhone') as HTMLInputElement).value,
        dia_chi: (document.getElementById('userAddress') as HTMLTextAreaElement).value,
        ngay_sinh: (document.getElementById('userBirthDate') as HTMLInputElement).value,
        role: selectedRole
    };

    if (editingUserId) {
        const payload = {
            id: editingUserId,
            email: formData.email,
            ho: formData.ho,
            ten: formData.ten,
            so_dien_thoai: formData.so_dien_thoai,
            dia_chi: formData.dia_chi,
            ngay_sinh: formData.ngay_sinh,
            role_id: formData.role,
            mat_khau: formData.mat_khau.trim() === '' ? null : formData.mat_khau
        };

        try {
            const response = await fetch('http://localhost:3000/api/nguoi-dung/update', {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.message || 'Lỗi khi cập nhật');

            alert('Cập nhật thông tin thành công!');
            await fetchAndRenderUsers();
        } catch (error) {
            console.error(error);
            alert('Đã có lỗi xảy ra khi cập nhật người dùng');
        }
    } else {
        try {
            const response = await fetch('http://localhost:3000/api/nguoi-dung/create', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Lỗi khi tạo người dùng');

            alert('Thêm người dùng thành công!');
            await fetchAndRenderUsers();
        } catch (error) {
            console.error(error);
            alert('Đã có lỗi xảy ra khi thêm người dùng');
        }
    }

    updateStats2();
    closeModal2();
}

window.onclick = function (event: MouseEvent) {
    const modal = document.getElementById('userModal') as HTMLElement;
    if (event.target === modal) {
        closeModal2();
    }
};