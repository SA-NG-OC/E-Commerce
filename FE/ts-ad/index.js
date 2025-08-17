document.addEventListener("DOMContentLoaded", function () {
    var _a;
    var profileIcon = document.querySelector(".profile-icon");
    var profileMenu = document.getElementById("profileMenu");
    var logoutBtn = document.getElementById("logoutBtn");
    // Toggle hiển thị menu khi click vào icon
    if (profileIcon) {
        profileIcon.addEventListener("click", function () {
            if (profileMenu) {
                profileMenu.style.display =
                    profileMenu.style.display === "block" ? "none" : "block";
            }
        });
    }
    // Đăng xuất
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("token");
            localStorage.removeItem("usercontext");
            window.location.href = "/FE/HTML/DangNhap.html";
        });
    }
    // Ẩn menu khi click ra ngoài
    document.addEventListener("click", function (event) {
        if (profileIcon && profileMenu) {
            var target = event.target;
            if (!profileIcon.contains(target) && !profileMenu.contains(target)) {
                profileMenu.style.display = "none";
            }
        }
    });
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
    var defaultPage = ((_a = document.querySelector(".nav-item.active")) === null || _a === void 0 ? void 0 : _a.getAttribute("data-page")) || "DanhMuc.html";
    loadPage(defaultPage);
});
