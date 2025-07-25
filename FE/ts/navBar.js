// navBar.ts
document.addEventListener('DOMContentLoaded', function () {
    var navbar = document.getElementById('navbar');
    if (!navbar)
        return;
    fetch('/FE/HTML/NavBar.html')
        .then(function (res) { return res.text(); })
        .then(function (html) {
        navbar.innerHTML = html;
        // Sử dụng (window as any)
        if (window.smoothRouter) {
            window.smoothRouter.init();
        }
        navbar.addEventListener('click', function (e) {
            var target = e.target.closest('.nav-item');
            if (target && target instanceof HTMLElement) {
                e.preventDefault();
                var page = target.getAttribute('data-page');
                if (page && window.smoothRouter) {
                    window.smoothRouter.navigateTo(page);
                }
            }
        });
    })
        .catch(function (error) {
        console.error('Không thể load navbar:', error);
    });
});
