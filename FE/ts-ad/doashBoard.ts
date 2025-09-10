declare var Chart: any;
declare var XLSX: any;

interface CategoryChartData {
    ten_danh_muc: string;
    so_luong_san_pham: number;
}

interface GiaoDich {
    _id: string;
    _don_hang_id: string;
    _phuong_thuc_thanh_toan: string;
    _so_tien: string;
    _trang_thai: string;
    _ma_giao_dich: string;
    _ngay_thanh_toan: string;
    _ghi_chu: string;
}

function getAuthHeaders3() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

function groupRevenueGiaoDich(
    giaoDichs: GiaoDich[],
    type: 'day' | 'month',
    filterDate?: string
) {
    const result: { [key: string]: number } = {};

    giaoDichs.forEach(gd => {
        // ✅ Chỉ tính giao dịch đã thanh toán
        if (gd._trang_thai !== 'da_thanh_toan') return;

        const date = new Date(gd._ngay_thanh_toan);

        // Nếu có filterDate thì bỏ qua những ngày khác
        if (filterDate && date.toISOString().split('T')[0] !== filterDate) {
            return;
        }

        let key: string;
        if (type === 'day') {
            key = date.toISOString().split('T')[0]; // YYYY-MM-DD
        } else {
            key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
        }

        result[key] = (result[key] || 0) + parseFloat(gd._so_tien);
    });

    let labels = Object.keys(result).sort();
    let data = labels.map(label => result[label]);

    // ✅ Giới hạn hiển thị gần nhất (7 ngày hoặc 12 tháng)
    if (type === 'day') {
        if (!filterDate) {
            const startIndex = Math.max(0, labels.length - 7);
            labels = labels.slice(startIndex);
            data = data.slice(startIndex);
        }
    } else if (type === 'month') {
        const startIndex = Math.max(0, labels.length - 12);
        labels = labels.slice(startIndex);
        data = data.slice(startIndex);
    }

    return { labels, data };
}

let revenueChart: any = null;

async function initRevenueChart(): Promise<void> {
    const ctx = (document.getElementById('revenueChart') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx) return;

    const typeSelect = document.getElementById('typeSelect') as HTMLSelectElement;
    const dateFilter = document.getElementById('dateFilter') as HTMLInputElement;

    const res = await fetch('/api/giao-dich', {
        headers: getAuthHeaders3()
    });
    if (!res.ok) throw new Error(`Lỗi tải giao dịch: ${res.status}`);
    const giaoDichs: GiaoDich[] = await res.json();

    const { labels, data } = groupRevenueGiaoDich(
        giaoDichs,
        typeSelect.value as 'day' | 'month',
        dateFilter.value || undefined
    );

    // Nếu không có dữ liệu thì báo "Không có doanh thu"
    if (labels.length === 0 || data.length === 0) {
        if (revenueChart) {
            revenueChart.destroy();
            revenueChart = null;
        }
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = '16px Arial';
        ctx.fillStyle = '#999';
        ctx.textAlign = 'center';
        ctx.fillText('Ngày hôm đó không có doanh thu', ctx.canvas.width / 2, ctx.canvas.height / 2);
        return;
    }

    // Nếu trước đó đã có chart thì xóa
    if (revenueChart) {
        revenueChart.destroy();
    }

    // Vẽ chart mới
    revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Doanh thu',
                data,
                borderColor: '#F19EDC',
                backgroundColor: 'rgba(241, 158, 220, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#F19EDC',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { callback: (value: any) => `${(Number(value) / 1000000)}M₫` },
                    grid: { color: '#f3f4f6' }
                },
                x: { grid: { color: '#f3f4f6' } }
            }
        }
    });
}

async function initStats(): Promise<void> {
    try {
        // 1️⃣ Lấy số đơn hàng
        const donHangRes = await fetch('/api/don-hang/count',
            {
                headers: getAuthHeaders3()
            }
        );
        const donHangData = await donHangRes.json();
        document.querySelectorAll('.stat-card .value')[0].textContent = donHangData.total ?? '0';

        // 2️⃣ Lấy số khách hàng (giả sử có endpoint /api/nguoi-dung/count)
        const token = localStorage.getItem('token');

        const khachHangRes = await fetch('/api/nguoi-dung/count', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`   // 👈 bắt buộc để qua authMiddleware
            }
        });

        const khachHangData = await khachHangRes.json();
        document.querySelectorAll('.stat-card .value')[1].textContent = khachHangData.total ?? '0';

        // 3️⃣ Lấy số sản phẩm
        const sanPhamRes = await fetch('/api/san-pham/count', {
            headers: getAuthHeaders3()
        });
        const sanPhamData = await sanPhamRes.json();
        document.querySelectorAll('.stat-card .value')[2].textContent = sanPhamData.total ?? '0';

    } catch (error) {
        console.error('Không thể tải thống kê:', error);
    }
}


function generateRandomColors(count: number): string[] {
    const colors: string[] = [];
    const step = 360 / count;
    for (let i = 0; i < count; i++) {
        const hue = Math.floor(i * step);
        colors.push(`hsl(${hue}, 70%, 50%)`);
    }
    return colors;
}


async function initCategoryChart(): Promise<void> {
    const ctx = (document.getElementById('categoryChart') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx) return;

    try {
        const res = await fetch('/api/danh-muc', {
            headers: getAuthHeaders3()
        });
        if (!res.ok) throw new Error('Lỗi tải danh mục');
        const danhMucs: any[] = await res.json();

        const labels: string[] = danhMucs.map(dm => dm._ten_danh_muc);
        const data: number[] = danhMucs.map(dm => dm._san_phams?.length || 0);

        const backgroundColors = generateRandomColors(labels.length);

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: backgroundColors,
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: { size: 12 }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Không thể tải biểu đồ danh mục:', error);
    }
}

function exportReport(): void {
    if (!revenueChart || !revenueChart.data || !revenueChart.data.labels) {
        alert('Không có dữ liệu để xuất!');
        return;
    }

    // Chuẩn bị dữ liệu dạng mảng 2D cho Excel
    const header = ['Thời gian', 'Doanh thu (VND)'];
    const rows = revenueChart.data.labels.map((label: string, index: number) => {
        return [label, revenueChart.data.datasets[0].data[index]];
    });

    const wsData = [header, ...rows];

    // Tạo worksheet và workbook
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DoanhThu');

    // Xuất file
    XLSX.writeFile(wb, `BaoCaoDoanhThu_${new Date().toISOString().split('T')[0]}.xlsx`);
}


document.addEventListener('DOMContentLoaded', async () => {
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
    initStats();
    initRevenueChart();
    initCategoryChart();

    document.getElementById('typeSelect')?.addEventListener('change', initRevenueChart);
    document.getElementById('dateFilter')?.addEventListener('change', initRevenueChart);
    document.getElementById('exportBtn')?.addEventListener('click', exportReport);

    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            (card as HTMLElement).style.transform = 'translateY(-2px)';
        });
        card.addEventListener('mouseleave', () => {
            (card as HTMLElement).style.transform = 'translateY(0)';
        });
    });
});

