"use strict";
// navBar.ts
document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.getElementById('navbar');
    if (!navbar)
        return;
    fetch('/FE/HTML/NavBar.html')
        .then(res => res.text())
        .then(html => {
        navbar.innerHTML = html;
        // Sử dụng (window as any)
        if (window.smoothRouter) {
            window.smoothRouter.init();
        }
        navbar.addEventListener('click', function (e) {
            const target = e.target.closest('.nav-item');
            if (target && target instanceof HTMLElement) {
                e.preventDefault();
                const page = target.getAttribute('data-page');
                if (page && window.smoothRouter) {
                    window.smoothRouter.navigateTo(page);
                }
            }
        });
    })
        .catch(error => {
        console.error('Không thể load navbar:', error);
    });
});
