document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    // Đặt active theo trang hiện tại
    const navItems = document.querySelectorAll('.nav-bar .nav-item');

    // Lấy tên file trang hiện tại từ URL (ví dụ: 'GioHang.html')
    const currentPage = window.location.pathname.split('/').pop();
    console.log('Current page:', currentPage);
    // Duyệt qua từng nav-item
    navItems.forEach((item) => {
        const page = item.getAttribute('data-page');

        // Nếu khớp với trang hiện tại thì thêm class active
        if (page === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Sử dụng event delegation để lắng nghe click trên nav-item
    navbar.addEventListener('click', function (e) {
        const target = (e.target as HTMLElement).closest('.nav-item');
        if (target && target instanceof HTMLElement) {
            e.preventDefault();
            // Chuyển trang, trạng thái active sẽ được đặt lại khi trang load
            const page = target.getAttribute('data-page');
            if (page) {
                window.location.href = '/FE/HTML/' + page;
            }
        }
    });
});