document.addEventListener('DOMContentLoaded', function () {
    var navbar = document.getElementById('navbar');
    if (!navbar)
        return;
    // Đặt active theo trang hiện tại
    var navItems = document.querySelectorAll('.nav-bar .nav-item');
    // Lấy tên file trang hiện tại từ URL (ví dụ: 'GioHang.html')
    var currentPage = window.location.pathname.split('/').pop();
    console.log('Current page:', currentPage);
    // Duyệt qua từng nav-item
    navItems.forEach(function (item) {
        var page = item.getAttribute('data-page');
        // Nếu khớp với trang hiện tại thì thêm class active
        if (page === currentPage) {
            item.classList.add('active');
        }
        else {
            item.classList.remove('active');
        }
    });
    // Sử dụng event delegation để lắng nghe click trên nav-item
    navbar.addEventListener('click', function (e) {
        var target = e.target.closest('.nav-item');
        if (target && target instanceof HTMLElement) {
            e.preventDefault();
            // Chuyển trang, trạng thái active sẽ được đặt lại khi trang load
            var page = target.getAttribute('data-page');
            if (page) {
                window.location.href = '/FE/HTML/' + page;
            }
        }
    });
});
