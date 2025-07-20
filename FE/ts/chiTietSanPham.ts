interface HinhAnhSPModel {
    id: number;
    san_pham_id: number;
    duong_dan_hinh_anh: string;
}

interface DanhGiaSPModel {
    id: number;
    san_pham_id: number;
    nguoi_dung_id: number;
    diem_danh_gia: number;
    noi_dung_danh_gia: string;
    ngay_tao: string;
    ho_ten_nguoi_dung?: string;
}

interface SanPham {
    id: string;
    ten_san_pham: string;
    ma_san_pham: string;
    gia_ban: number | string;
    mo_ta?: string | null;
    danh_muc?: string | null;
    thuong_hieu?: string | null;
    so_luong_ton_kho?: number;
    danh_sach_hinh_anh: HinhAnhSPModel[];
}

//Sản phẩm//
function getSanPhamIdFromUrl(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
    //
}

async function fetchSanPhamById(id: string): Promise<SanPham | null> {
    try {
        const res = await fetch(`http://localhost:3000/api/san-pham/${id}`);
        if (!res.ok) return null;
        const p = await res.json();
        return {
            id: String(p._id),
            ten_san_pham: p._ten_san_pham,
            ma_san_pham: p._ma_san_pham,
            gia_ban: p._gia_ban,
            mo_ta: p._mo_ta ?? '',
            danh_muc: p._danh_muc ?? '',
            thuong_hieu: p._thuong_hieu ?? '',
            danh_sach_hinh_anh: (p._danh_sach_hinh_anh || []).map((img: any) => ({
                id: img._id,
                san_pham_id: img._san_pham_id,
                duong_dan_hinh_anh: img._duong_dan_hinh_anh,
            }))
        };
    } catch {
        return null;
    }
}


//Review//
async function fetchDanhGiaBySanPhamId(id: string): Promise<DanhGiaSPModel[]> {
    try {
        const res = await fetch(`http://localhost:3000/api/san-pham/${id}/danh-gia`);
        if (!res.ok) return [];
        const data = await res.json();
        // Map lại field cho đúng interface
        return data.map((r: any) => ({
            id: r._id,
            san_pham_id: r._san_pham_id,
            nguoi_dung_id: r._nguoi_dung_id,
            diem_danh_gia: r._diem_danh_gia,
            noi_dung_danh_gia: r._noi_dung_danh_gia,
            ngay_tao: r._ngay_tao,
            ho_ten_nguoi_dung: r._ho_ten_nguoi_dung
        }));
    } catch {
        return [];
    }
}

function filterReviewByStar(reviews: DanhGiaSPModel[], star: string | number): DanhGiaSPModel[] {
    if (star === 'all') return reviews;
    if (star === 'user') {
        const userStr = localStorage.getItem('usercontext');
        if (!userStr) return [];
        const user = JSON.parse(userStr);
        return reviews.filter(r => r.nguoi_dung_id === user._id);
    }
    const numStar = Number(star);
    return reviews.filter(r => r.diem_danh_gia === numStar);
}

// Hàm tạo và hiển thị dialog quản lý comment
function showCommentDialog(reviewId: number, currentContent: string, currentRating: number) {
    // Tạo overlay
    const overlay = document.createElement('div');
    overlay.className = 'comment-dialog-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    // Tạo dialog
    const dialog = document.createElement('div');
    dialog.className = 'comment-dialog';
    dialog.style.cssText = `
        background: white;
        border-radius: 12px;
        padding: 24px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;

    dialog.innerHTML = `
        <h3 style="color: #E91E63; margin-bottom: 20px; font-size: 20px;">Quản lý đánh giá</h3>
        
        <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Số sao:</label>
            <div class="edit-star-rating" style="display: flex; gap: 4px;">
                ${[1, 2, 3, 4, 5].map(i => `<span class="edit-star" data-value="${i}" style="font-size: 24px; cursor: pointer; color: ${i <= currentRating ? '#E91E63' : '#F19EDC'};">${i <= currentRating ? '★' : '☆'}</span>`).join('')}
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Nội dung:</label>
            <textarea id="editReviewContent" style="width: 100%; height: 100px; padding: 10px; border: 1px solid #F19EDC; border-radius: 6px; resize: vertical;">${currentContent}</textarea>
        </div>
        
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button id="cancelBtn" style="padding: 10px 20px; border: 1px solid #ddd; background: white; border-radius: 6px; cursor: pointer;">Hủy</button>
            <button id="saveBtn" style="padding: 10px 20px; background: linear-gradient(45deg, #F19EDC, #E91E63); color: white; border: none; border-radius: 6px; cursor: pointer;">Lưu</button>
            <button id="deleteBtn" style="padding: 10px 20px; background: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer;">Xóa</button>
        </div>
        
        <div id="dialogMessage" style="margin-top: 12px; color: #e74c3c;"></div>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    let selectedRating = currentRating;

    // Xử lý chọn sao
    const editStars = dialog.querySelectorAll('.edit-star');
    editStars.forEach((star, idx) => {
        star.addEventListener('click', function () {
            selectedRating = idx + 1;
            editStars.forEach((s, i) => {
                const el = s as HTMLElement;
                if (i < selectedRating) {
                    el.style.color = '#E91E63';
                    el.innerHTML = '★';
                } else {
                    el.style.color = '#F19EDC';
                    el.innerHTML = '☆';
                }
            });
        });

        star.addEventListener('mouseover', function () {
            const hoverRating = idx + 1;
            editStars.forEach((s, i) => {
                const el = s as HTMLElement;
                if (i < hoverRating) {
                    el.style.color = '#E91E63';
                    el.innerHTML = '★';
                } else {
                    el.style.color = '#F19EDC';
                    el.innerHTML = '☆';
                }
            });
        });

        star.addEventListener('mouseout', function () {
            editStars.forEach((s, i) => {
                const el = s as HTMLElement;
                if (i < selectedRating) {
                    el.style.color = '#E91E63';
                    el.innerHTML = '★';
                } else {
                    el.style.color = '#F19EDC';
                    el.innerHTML = '☆';
                }
            });
        });
    });

    // Xử lý sự kiện nút
    const cancelBtn = dialog.querySelector('#cancelBtn');
    const saveBtn = dialog.querySelector('#saveBtn');
    const deleteBtn = dialog.querySelector('#deleteBtn');
    const messageEl = dialog.querySelector('#dialogMessage') as HTMLElement;

    // Đóng dialog
    const closeDialog = () => {
        document.body.removeChild(overlay);
    };

    cancelBtn?.addEventListener('click', closeDialog);
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
            closeDialog();
        }
    });

    // Lưu thay đổi
    saveBtn?.addEventListener('click', async function () {
        const newContent = (dialog.querySelector('#editReviewContent') as HTMLTextAreaElement).value.trim();
        if (!newContent) {
            messageEl.textContent = 'Vui lòng nhập nội dung đánh giá!';
            return;
        }

        try {
            const res = await fetch(`http://localhost:3000/api/danh-gia/${reviewId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    diem_danh_gia: selectedRating,
                    noi_dung_danh_gia: newContent
                })
            });

            if (res.ok) {
                alert('Cập nhật đánh giá thành công!');
                closeDialog();
                renderChiTietSanPham();
            } else {
                const err = await res.json();
                messageEl.textContent = err.message || 'Cập nhật đánh giá thất bại!';
            }
        } catch {
            messageEl.textContent = 'Lỗi kết nối máy chủ!';
        }
    });

    // Xóa đánh giá
    deleteBtn?.addEventListener('click', async function () {
        if (confirm('Bạn có chắc muốn xóa đánh giá này?')) {
            try {
                const res = await fetch(`http://localhost:3000/api/danh-gia/${reviewId}`, {
                    method: 'DELETE'
                });

                if (res.ok) {
                    alert('Xóa đánh giá thành công!');
                    closeDialog();
                    renderChiTietSanPham();
                } else {
                    messageEl.textContent = 'Xóa đánh giá thất bại!';
                }
            } catch {
                messageEl.textContent = 'Lỗi kết nối máy chủ!';
            }
        }
    });
}

// Hàm render chi tiết sản phẩm và đánh giá (bạn tự gắn vào DOM theo id hoặc class tuỳ HTML)
async function renderChiTietSanPham() {
    const id = getSanPhamIdFromUrl();
    if (!id) return;
    const sanPham = await fetchSanPhamById(id);
    const danhGias = await fetchDanhGiaBySanPhamId(id);
    if (!sanPham) return;

    // Render ảnh chính và thumbnails
    const mainImage = document.getElementById('mainImage') as HTMLImageElement;
    const imageThumbnails = document.getElementById('imageThumbnails');
    if (mainImage && sanPham.danh_sach_hinh_anh.length > 0) {
        mainImage.src = sanPham.danh_sach_hinh_anh[0].duong_dan_hinh_anh;
        mainImage.alt = sanPham.ten_san_pham;
    }
    if (imageThumbnails) {
        imageThumbnails.innerHTML = sanPham.danh_sach_hinh_anh.map((img, idx) =>
            `<img src="${img.duong_dan_hinh_anh}" alt="Hình ${idx + 1}" class="thumbnail${idx === 0 ? ' active' : ''}" onclick="document.getElementById('mainImage').src='${img.duong_dan_hinh_anh}'; Array.from(document.querySelectorAll('.thumbnail')).forEach(t=>t.classList.remove('active')); this.classList.add('active');">
            `
        ).join('');
    }

    // Render thông tin sản phẩm
    const titleEl = document.querySelector('.product-title');
    if (titleEl) titleEl.textContent = sanPham.ten_san_pham;
    const codeEl = document.querySelector('.product-code');
    if (codeEl) codeEl.textContent = sanPham.ma_san_pham ? `Mã sản phẩm: ${sanPham.ma_san_pham}` : '';
    const brandEl = document.querySelector('.brand-tag');
    if (brandEl) brandEl.textContent = sanPham.thuong_hieu || '';
    const priceEl = document.querySelector('.original-price');
    if (priceEl) priceEl.textContent = sanPham.gia_ban ? `${Number(sanPham.gia_ban).toLocaleString()}₫` : '';
    const stockEl = document.querySelector('.stock-status');
    if (stockEl) stockEl.textContent = sanPham.so_luong_ton_kho !== undefined ? `Còn hàng: ${sanPham.so_luong_ton_kho} sản phẩm có sẵn` : '';
    const moTaEl = document.getElementById('moTaSanPham');
    if (moTaEl) moTaEl.textContent = sanPham.mo_ta || '';

    // Render review
    const reviewList = document.getElementById('reviewList');
    const filterStarEl = document.getElementById('filterStar') as HTMLSelectElement;
    let filteredReviews = danhGias;
    if (filterStarEl) {
        const selectedStar = filterStarEl.value;
        filteredReviews = filterReviewByStar(danhGias, selectedStar);
        filterStarEl.onchange = function () {
            const selected = filterStarEl.value;
            const filtered = filterReviewByStar(danhGias, selected);
            if (reviewList) {
                if (filtered.length === 0) {
                    reviewList.innerHTML = '<div class="placeholder-text">Không có đánh giá nào phù hợp.</div>';
                } else {
                    const userStr = localStorage.getItem('usercontext');
                    let userId = null;
                    if (userStr) {
                        try {
                            const user = JSON.parse(userStr);
                            userId = user._id;
                        } catch { }
                    }
                    reviewList.innerHTML = filtered.map(r => {
                        const isOwner = userId && r.nguoi_dung_id === userId;
                        return `
                        <div class="review-item ${isOwner ? 'user-review clickable' : ''}" data-review-id="${r.id}" data-review-content="${r.noi_dung_danh_gia}" data-review-rating="${r.diem_danh_gia}" ${isOwner ? 'title="Click để chỉnh sửa đánh giá"' : ''}>
                            <div class="review-header">
                                <div class="reviewer-avatar">${r.ho_ten_nguoi_dung ? r.ho_ten_nguoi_dung.charAt(0).toUpperCase() : '?'}</div>
                                <div class="reviewer-info">
                                    <div class="reviewer-name">${r.ho_ten_nguoi_dung || 'Ẩn danh'}</div>
                                    <div class="review-date">${new Date(r.ngay_tao).toLocaleDateString('vi-VN')}</div>
                                </div>
                                <div class="review-rating">${'★'.repeat(r.diem_danh_gia)}${'☆'.repeat(5 - r.diem_danh_gia)}</div>
                            </div>
                            <div class="review-content">${r.noi_dung_danh_gia}</div>
                        </div>
                        `;
                    }).join('');
                }
                // Gắn lại sự kiện click cho các review sau khi filter
                attachReviewClickEvents();
            }
        };
    }

    if (reviewList) {
        if (filteredReviews.length === 0) {
            reviewList.innerHTML = '<div class="placeholder-text">Chưa có đánh giá nào cho sản phẩm này.</div>';
        } else {
            const userStr = localStorage.getItem('usercontext');
            let userId = null;
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    userId = user._id;
                } catch { }
            }
            reviewList.innerHTML = filteredReviews.map(r => {
                const isOwner = userId && r.nguoi_dung_id === userId;
                return `
                <div class="review-item ${isOwner ? 'user-review clickable' : ''}" data-review-id="${r.id}" data-review-content="${r.noi_dung_danh_gia}" data-review-rating="${r.diem_danh_gia}" ${isOwner ? 'title="Click để chỉnh sửa đánh giá"' : ''}>
                    <div class="review-header">
                        <div class="reviewer-avatar">${r.ho_ten_nguoi_dung ? r.ho_ten_nguoi_dung.charAt(0).toUpperCase() : '?'}</div>
                        <div class="reviewer-info">
                            <div class="reviewer-name">${r.ho_ten_nguoi_dung || 'Ẩn danh'}</div>
                            <div class="review-date">${new Date(r.ngay_tao).toLocaleDateString('vi-VN')}</div>
                        </div>
                        <div class="review-rating">${'★'.repeat(r.diem_danh_gia)}${'☆'.repeat(5 - r.diem_danh_gia)}</div>
                    </div>
                    <div class="review-content">${r.noi_dung_danh_gia}</div>
                </div>
                `;
            }).join('');

            // Gắn sự kiện click cho các review của user
            attachReviewClickEvents();
        }
    }
}

// Hàm gắn sự kiện click cho các review của user
function attachReviewClickEvents() {
    const userReviews = document.querySelectorAll('.review-item.user-review.clickable');
    userReviews.forEach(reviewEl => {
        reviewEl.addEventListener('click', function () {
            const reviewId = Number((reviewEl as HTMLElement).getAttribute('data-review-id'));
            const reviewContent = (reviewEl as HTMLElement).getAttribute('data-review-content') || '';
            const reviewRating = Number((reviewEl as HTMLElement).getAttribute('data-review-rating')) || 1;

            showCommentDialog(reviewId, reviewContent, reviewRating);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderChiTietSanPham();

    // Star rating interaction
    const stars = document.querySelectorAll('#starRating .star');
    let selectedRating = 0;
    stars.forEach((star, idx) => {
        star.addEventListener('mouseover', function () {
            highlightStars(idx + 1);
        });
        star.addEventListener('mouseout', function () {
            highlightStars(selectedRating);
        });
        star.addEventListener('click', function () {
            selectedRating = idx + 1;
            highlightStars(selectedRating);
        });
    });
    function highlightStars(rating: number) {
        stars.forEach((star, i) => {
            if (i < rating) {
                star.classList.add('selected');
                star.innerHTML = '★'; // filled star
            } else {
                star.classList.remove('selected');
                star.innerHTML = '☆'; // empty star
            }
        });
    }
    // Prevent submit if chưa chọn số sao
    const reviewForm = document.getElementById('userReviewForm') as HTMLFormElement;
    if (reviewForm) {
        reviewForm.addEventListener('submit', async function (e) {
            if (selectedRating === 0) {
                e.preventDefault();
                document.getElementById('reviewFormMessage')!.textContent = 'Vui lòng chọn số sao trước khi gửi đánh giá!';
                return;
            }
            document.getElementById('reviewFormMessage')!.textContent = '';
            e.preventDefault();
            // Lấy user từ localStorage
            const userStr = localStorage.getItem('usercontext');
            if (!userStr) {
                document.getElementById('reviewFormMessage')!.textContent = 'Bạn cần đăng nhập để gửi đánh giá!';
                return;
            }
            const user = JSON.parse(userStr);
            console.log('User:', user);
            console.log('nguoi_dung_id:', user._id);
            const sanPhamId = getSanPhamIdFromUrl();
            const reviewContent = (document.getElementById('reviewContent') as HTMLTextAreaElement).value;
            // Gọi API tạo mới đánh giá
            try {
                const res = await fetch(`http://localhost:3000/api/san-pham/${sanPhamId}/danh-gia`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        san_pham_id: Number(sanPhamId),
                        nguoi_dung_id: user._id,
                        diem_danh_gia: selectedRating,
                        noi_dung_danh_gia: reviewContent
                    })
                });
                if (res.ok) {
                    document.getElementById('reviewFormMessage')!.textContent = 'Gửi đánh giá thành công!';
                    reviewForm.reset();
                    highlightStars(0);
                    selectedRating = 0;
                    // Reload lại danh sách đánh giá
                    renderChiTietSanPham();
                } else {
                    const err = await res.json();
                    document.getElementById('reviewFormMessage')!.textContent = err.message || 'Gửi đánh giá thất bại!';
                }
            } catch {
                document.getElementById('reviewFormMessage')!.textContent = 'Lỗi kết nối máy chủ!';
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', renderChiTietSanPham);

// Tải NavBar vào #navbar
// Tải NavBar vào #navbar
fetch('/FE/HTML/NavBar.html')
    .then(res => res.text())
    .then(html => {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            navbar.innerHTML = html;
        }
    });