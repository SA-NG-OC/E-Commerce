
interface SanPham4 {
    id: string;
    ten_san_pham: string;
}

interface DanhMuc2 {
    id: string;
    ten_danh_muc: string;
    icon: string;
    san_pham: SanPham4[];
}

interface ThuongHieu2 {
    id: string;
    ten_thuong_hieu: string;
    san_pham: SanPham4[];
}

let danhMucs2: DanhMuc2[] = [];

let thuongHieus2: ThuongHieu2[] = [];

function getAuthHeaders5() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

async function fetchData() {
    try {
        // Lấy danh mục
        const resDanhMuc = await fetch('/api/danh-muc', {
            headers: getAuthHeaders5()
        });
        const rawDanhMucs = await resDanhMuc.json();

        danhMucs2 = rawDanhMucs.map((dm: any): DanhMuc2 => ({
            id: dm._id,
            ten_danh_muc: dm._ten_danh_muc,
            icon: dm._icon,
            san_pham: dm._san_phams.map((sp: any): SanPham4 => ({
                id: sp._id,
                ten_san_pham: sp._ten_san_pham
            }))
        }));

        // Lấy thương hiệu
        const resThuongHieu = await fetch('/api/thuong-hieu', {
            headers: getAuthHeaders5()
        });
        const rawThuongHieus = await resThuongHieu.json();

        thuongHieus2 = rawThuongHieus.map((th: any): ThuongHieu2 => ({
            id: th._id,
            ten_thuong_hieu: th._ten_thuong_hieu,
            san_pham: th._san_phams.map((sp: any): SanPham4 => ({
                id: sp._id,
                ten_san_pham: sp._ten_san_pham
            }))
        }));

        // Sau khi load xong thì hiển thị
        displayCategories();
        displayBrands();
        updateStats3();
    } catch (err) {
        console.error('❌ Lỗi khi load dữ liệu từ server:', err);
    }
}

async function loadProductOptions() {
    try {
        const response = await fetch('/api/san-pham/id', {
            headers: getAuthHeaders5()
        });
        const data: { id: string, ten_san_pham: string }[] = await response.json();

        const select = document.getElementById('productName') as HTMLSelectElement;
        const searchInput = document.getElementById('searchProductInput') as HTMLInputElement;

        let originalData = data;

        const renderOptions = (filterText: string) => {
            select.innerHTML = '';
            const filtered = originalData.filter(sp =>
                `${sp.id} - ${sp.ten_san_pham}`.toLowerCase().includes(filterText.toLowerCase())
            );
            filtered.forEach(sp => {
                const option = document.createElement('option');
                option.value = sp.id;
                option.textContent = `${sp.id} - ${sp.ten_san_pham}`;
                select.appendChild(option);
            });
        };

        renderOptions(''); // render all initially

        searchInput.addEventListener('input', () => {
            renderOptions(searchInput.value);
        });

    } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
    }
}


function showTab2(tabName: string) {
    document.querySelectorAll<HTMLElement>('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll<HTMLElement>('.tab-button').forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabName)?.classList.add('active');
    (event?.target as HTMLElement)?.classList.add('active');
}

function updateStats3() {
    const totalProducts = danhMucs2.reduce((sum, dm) => sum + dm.san_pham.length, 0);
    (document.getElementById('totalCategories') as HTMLElement).textContent = danhMucs2.length.toString();
    (document.getElementById('totalBrands') as HTMLElement).textContent = thuongHieus2.length.toString();
    (document.getElementById('totalProducts') as HTMLElement).textContent = totalProducts.toString();
}

function displayCategories() {
    const categoryList = document.getElementById('categoryList')!;
    categoryList.innerHTML = '';

    danhMucs2.forEach(dm => {
        const div = document.createElement('div');
        div.className = 'item-card';
        div.innerHTML = `
            <div class="item-header">
                <div>
                    <div class="item-title">
                        <span class="item-icon">${dm.icon}</span>
                        ${dm.ten_danh_muc}
                    </div>
                    <small style="color: #666;">${dm.san_pham.length} sản phẩm</small>
                </div>
            </div>
            <div class="product-list">
                ${dm.san_pham.map(sp => `<div class="product-item">${sp.ten_san_pham}</div>`).join('')}
            </div>
            <div class="item-actions">
                <button class="btn" onclick="showAddProductModal('${dm.id}', 'category')">Thêm sản phẩm</button>
                <button class="btn btn-danger" onclick="deleteCategory('${dm.id}')">Xóa</button>
            </div>
        `;
        categoryList.appendChild(div);
    });

    updateCategorySelect();
}

function displayBrands() {
    const brandList = document.getElementById('brandList')!;
    brandList.innerHTML = '';

    thuongHieus2.forEach(th => {
        const div = document.createElement('div');
        div.className = 'item-card';
        div.innerHTML = `
            <div class="item-header">
                <div>
                    <div class="item-title">🏷️ ${th.ten_thuong_hieu}</div>
                    <small style="color: #666;">${th.san_pham.length} sản phẩm</small>
                </div>
            </div>
            <div class="product-list">
                ${th.san_pham.map(sp => `<div class="product-item">${sp.ten_san_pham}</div>`).join('')}
            </div>
            <div class="item-actions">
                <button class="btn" onclick="showAddProductModal('${th.id}', 'brand')">Thêm sản phẩm</button>
                <button class="btn btn-danger" onclick="deleteBrand('${th.id}')">Xóa</button>
            </div>
        `;
        brandList.appendChild(div);
    });

    updateBrandSelect();
}

function updateCategorySelect() {
    const select = document.getElementById('updateCategorySelect') as HTMLSelectElement;
    select.innerHTML = '<option value="">-- Chọn danh mục --</option>';
    danhMucs2.forEach(dm => {
        const option = document.createElement('option');
        option.value = dm.id;
        option.textContent = `${dm.icon} ${dm.ten_danh_muc}`;
        select.appendChild(option);
    });
}

function updateBrandSelect() {
    const select = document.getElementById('updateBrandSelect') as HTMLSelectElement;
    select.innerHTML = '<option value="">-- Chọn thương hiệu --</option>';
    thuongHieus2.forEach(th => {
        const option = document.createElement('option');
        option.value = th.id;
        option.textContent = th.ten_thuong_hieu;
        select.appendChild(option);
    });
}

(window as any).showAddProductModal = async function (parentId: string, parentType: string) {
    (document.getElementById('productParentId') as HTMLInputElement).value = parentId;
    (document.getElementById('productParentType') as HTMLInputElement).value = parentType;

    await loadProductOptions(); // ← gọi tại đây để mỗi lần mở modal đều có danh sách mới

    (document.getElementById('productModal') as HTMLElement).style.display = 'block';
};


(window as any).deleteCategory = async function (id: string) {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
        try {
            const response = await fetch(`/api/danh-muc/${id}`, {
                headers: getAuthHeaders5(),
                method: 'DELETE',
            });

            const result = await response.json();

            if (response.ok) {
                // Xóa khỏi danh sách tạm thời trên frontend
                danhMucs2 = danhMucs2.filter(dm => dm.id !== id);
                await fetchData();
                alert('✅ ' + result.message);
            } else {
                alert('❌ ' + result.message); // lỗi như khóa ngoại sẽ vào đây
            }
        } catch (error) {
            alert('❌ Lỗi khi kết nối tới server');
            console.error(error);
        }
    }
};


(window as any).deleteBrand = async function (id: string) {
    if (confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) {
        try {
            const response = await fetch(`/api/thuong-hieu/${id}`, {
                headers: getAuthHeaders5(),
                method: 'DELETE',
            });

            const result = await response.json();

            if (response.ok) {
                // Cập nhật giao diện sau khi xóa
                thuongHieus2 = thuongHieus2.filter(th => th.id !== id);
                await fetchData();
                alert('✅ ' + result.message);
            } else {
                alert('❌ ' + result.message); // lỗi do bị dùng bởi sản phẩm
            }
        } catch (error) {
            alert('❌ Lỗi khi kết nối tới server');
            console.error(error);
        }
    }
};


document.addEventListener('DOMContentLoaded', async () => {
    // Kiểm tra đăng nhập
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
        window.location.href = '/HTML/DangNhap.html';
        return;
    }

    try {
        const res = await fetch("/api/nguoi-dung/me", {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
            window.location.href = '/HTML/DangNhap.html';
            return;
        }
    } catch (error) {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
        window.location.href = '/HTML/DangNhap.html';
        return;
    }
    fetchData(); // Load từ API thay vì dữ liệu mẫu

    // Add form listeners
    document.getElementById('addCategoryForm')!.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name = (document.getElementById('categoryName') as HTMLInputElement).value.trim();
        const icon = (document.getElementById('categoryIcon') as HTMLInputElement).value.trim() || '📁';

        if (!name) {
            alert('Vui lòng nhập tên danh mục');
            return;
        }

        try {
            const res = await fetch('/api/danh-muc', {
                method: 'POST',
                headers: getAuthHeaders5(),
                body: JSON.stringify({ icon, ten_danh_muc: name })
            });

            const data = await res.json();

            if (res.ok) {
                alert('✅ Thêm danh mục thành công!');
                (this as HTMLFormElement).reset();

                // Cập nhật danhMucs2 local
                await fetchData(); // ← Lấy lại dữ liệu mới từ DB
                displayCategories();   // ← Hiển thị lại bảng danh mục
                updateCategorySelect(); // ← Làm mới dropdown

                updateStats3();
            } else {
                alert(`❌ Lỗi: ${data.message}`);
            }
        } catch (err) {
            console.error(err);
            alert('❌ Không thể kết nối tới máy chủ');
        }
    });

    document.getElementById('updateCategoryForm')!.addEventListener('submit', async function (e) {
        e.preventDefault();

        const id = (document.getElementById('updateCategorySelect') as HTMLSelectElement).value;
        const name = (document.getElementById('updateCategoryName') as HTMLInputElement).value.trim();
        const icon = (document.getElementById('updateCategoryIcon') as HTMLInputElement).value.trim();

        if (!id || !name) {
            alert('❌ Vui lòng chọn danh mục và nhập tên danh mục.');
            return;
        }

        try {
            const res = await fetch(`/api/danh-muc/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders5(),
                body: JSON.stringify({ ten_danh_muc: name, icon }),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || 'Cập nhật thất bại');
            }

            alert('✅ Cập nhật danh mục thành công!');

            // Cập nhật danhMucs2 local
            await fetchData(); // ← Lấy lại dữ liệu mới từ DB
            displayCategories();   // ← Hiển thị lại bảng danh mục
            updateCategorySelect(); // ← Làm mới dropdown

            (this as HTMLFormElement).reset(); // Reset form
        } catch (err) {
            console.error('Lỗi cập nhật danh mục:', err);
            alert('❌ Có lỗi xảy ra khi cập nhật danh mục.');
        }
    });


    document.getElementById('addBrandForm')!.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name = (document.getElementById('brandName') as HTMLInputElement).value.trim();

        if (!name) {
            alert('Vui lòng nhập tên thương hiệu');
            return;
        }

        try {
            const res = await fetch('/api/thuong-hieu', {
                method: 'POST',
                headers: getAuthHeaders5(),
                body: JSON.stringify({ ten_thuong_hieu: name })
            });

            const data = await res.json();

            if (res.ok) {
                alert('✅ Thêm thương hiệu thành công!');
                (this as HTMLFormElement).reset();

                // Cập nhật danhMucs2 local
                await fetchData(); // ← Lấy lại dữ liệu mới từ DB
                displayCategories();   // ← Hiển thị lại bảng danh mục
                updateCategorySelect(); // ← Làm mới dropdown

                updateStats3();
            } else {
                alert(`❌ Lỗi: ${data.message}`);
            }
        } catch (err) {
            console.error(err);
            alert('❌ Không thể kết nối tới máy chủ');
        }
    });

    document.getElementById('updateBrandForm')!.addEventListener('submit', async function (e) {
        e.preventDefault();

        const id = (document.getElementById('updateBrandSelect') as HTMLSelectElement).value;
        const name = (document.getElementById('updateBrandName') as HTMLInputElement).value.trim();

        if (!id || !name) {
            alert('Vui lòng chọn thương hiệu và nhập tên mới.');
            return;
        }

        try {
            const res = await fetch(`/api/thuong-hieu/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders5(),
                body: JSON.stringify({ ten_thuong_hieu: name })
            });

            const data = await res.json();

            if (res.ok) {
                // ✅ Cập nhật thành công trên server, cập nhật local
                const th = thuongHieus2.find(th => th.id === id);
                if (th) {
                    th.ten_thuong_hieu = name;
                    displayBrands();
                }

                (this as HTMLFormElement).reset();
                alert('✅ Cập nhật thương hiệu thành công!');
            } else {
                alert(`❌ Lỗi: ${data.message}`);
            }
        } catch (err) {
            console.error(err);
            alert('❌ Lỗi khi kết nối đến máy chủ.');
        }
    });

    document.getElementById('addProductForm')!.addEventListener('submit', async function (e) {
        e.preventDefault();

        const select = document.getElementById('productName') as HTMLSelectElement;
        const selectedOption = select.options[select.selectedIndex];
        const id = selectedOption.value;
        const ten_san_pham = selectedOption.textContent!.split(' - ').slice(1).join(' - ');

        const parentId = (document.getElementById('productParentId') as HTMLInputElement).value;
        const parentType = (document.getElementById('productParentType') as HTMLInputElement).value;
        const product = { id, ten_san_pham };

        try {
            if (parentType === 'category') {
                const res = await fetch('/api/san-pham/update-danh-muc', {
                    method: 'PUT',
                    headers: getAuthHeaders5(),
                    body: JSON.stringify({ sanPhamId: id, danhMucId: parentId })
                });

                if (!res.ok) throw new Error('Cập nhật danh mục thất bại');

                await fetchData();
            } else {
                const res = await fetch('/api/san-pham/update-thuong-hieu', {
                    method: 'PUT',
                    headers: getAuthHeaders5(),
                    body: JSON.stringify({ sanPhamId: id, thuongHieuId: parentId })
                });

                if (!res.ok) throw new Error('Cập nhật thương hiệu thất bại');

                await fetchData();
            }

            updateStats3();
            (document.getElementById('productModal') as HTMLElement).style.display = 'none';
            (this as HTMLFormElement).reset();
            alert('✅ Thêm sản phẩm thành công!');
        } catch (error) {
            const err = error as Error;
            alert('❌ ' + err.message);
        }
    });



    document.getElementById('updateCategorySelect')!.addEventListener('change', function () {
        const id = (this as HTMLSelectElement).value;
        const dm = danhMucs2.find(dm => dm.id === id);
        if (dm) {
            (document.getElementById('updateCategoryName') as HTMLInputElement).value = dm.ten_danh_muc;
            (document.getElementById('updateCategoryIcon') as HTMLInputElement).value = dm.icon;
        }
    });

    document.getElementById('updateBrandSelect')!.addEventListener('change', function () {
        const id = (this as HTMLSelectElement).value;
        const th = thuongHieus2.find(th => th.id === id);
        if (th) {
            (document.getElementById('updateBrandName') as HTMLInputElement).value = th.ten_thuong_hieu;
        }
    });

    document.querySelector('.close')!.addEventListener('click', () => {
        (document.getElementById('productModal') as HTMLElement).style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        const modal = document.getElementById('productModal');
        if (modal && event.target === modal) {
            modal.style.display = 'none';
        }

    });
});
