document.addEventListener("DOMContentLoaded", function () {
    var _a;
    var navItems = document.querySelectorAll(".nav-item");
    var content = document.getElementById("main-content");
    function loadPage(page) {
        fetch("/FE/HTML/".concat(page))
            .then(function (res) {
                if (!res.ok)
                    throw new Error("Lỗi tải trang");
                return res.text();
            })
            .then(function (html) {
                if (content)
                    content.innerHTML = html;
            })
            .catch(function () {
                if (content)
                    content.innerHTML = "<p>Lỗi tải nội dung.</p>";
            });
    }
    navItems.forEach(function (item) {
        item.addEventListener("click", function (e) {
            e.preventDefault();
            navItems.forEach(function (nav) { return nav.classList.remove("active"); });
            item.classList.add("active");
            var page = item.getAttribute("data-page");
            if (page)
                loadPage(page);
        });
    });
    // Mặc định trang đầu
    var defaultPage = ((_a = document.querySelector(".nav-item.active")) === null || _a === void 0 ? void 0 : _a.getAttribute("data-page")) || "TrangChu.html";
    loadPage(defaultPage);
});
