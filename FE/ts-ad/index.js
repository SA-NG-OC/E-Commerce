"use strict";
document.addEventListener("DOMContentLoaded", () => {
    var _a;
    const navItems = document.querySelectorAll(".nav-item");
    const content = document.getElementById("main-content");
    function loadPage(page) {
        fetch(`/FE/HTML/${page}`)
            .then((res) => {
            if (!res.ok)
                throw new Error("Lỗi tải trang");
            return res.text();
        })
            .then((html) => {
            if (content)
                content.innerHTML = html;
        })
            .catch(() => {
            if (content)
                content.innerHTML = "<p>Lỗi tải nội dung.</p>";
        });
    }
    navItems.forEach((item) => {
        item.addEventListener("click", function (e) {
            e.preventDefault();
            navItems.forEach((nav) => nav.classList.remove("active"));
            item.classList.add("active");
            const page = item.getAttribute("data-page");
            if (page)
                loadPage(page);
        });
    });
    // Mặc định trang đầu
    const defaultPage = ((_a = document.querySelector(".nav-item.active")) === null || _a === void 0 ? void 0 : _a.getAttribute("data-page")) || "DanhMuc.html";
    loadPage(defaultPage);
});
