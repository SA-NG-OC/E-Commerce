// Xử lý chuyển trang khi click vào menu
document.addEventListener('DOMContentLoaded', function () {
    var navbar = document.getElementById('navbar');
    if (!navbar)
        return;
    // Sử dụng event delegation để lắng nghe click trên nav-item
    navbar.addEventListener('click', function (e) {
        var target = e.target.closest('.nav-item');
        if (target && target instanceof HTMLElement) {
            e.preventDefault();
            // Xóa class active khỏi tất cả nav-item
            navbar.querySelectorAll('.nav-item').forEach(function (item) { return item.classList.remove('active'); });
            target.classList.add('active');
            var page = target.getAttribute('data-page');
            if (page) {
                window.location.href = '/FE/HTML/' + page;
            }
        }
    });
});
