// Xử lý chuyển trang khi click vào menu
document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    // Sử dụng event delegation để lắng nghe click trên nav-item
    navbar.addEventListener('click', function (e) {
        const target = (e.target as HTMLElement).closest('.nav-item');
        if (target && target instanceof HTMLElement) {
            e.preventDefault();
            // Xóa class active khỏi tất cả nav-item
            navbar.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            target.classList.add('active');
            const page = target.getAttribute('data-page');
            if (page) {
                window.location.href = '/FE/HTML/' + page;
            }
        }
    });
});
