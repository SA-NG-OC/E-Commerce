document.addEventListener("DOMContentLoaded", () => {

    const profileIcon = document.querySelector(".profile-icon") as HTMLElement | null;
    const profileMenu = document.getElementById("profileMenu") as HTMLElement | null;
    const logoutBtn = document.getElementById("logoutBtn") as HTMLButtonElement | null;

    // Toggle hiển thị menu khi click vào icon
    if (profileIcon) {
        profileIcon.addEventListener("click", () => {
            if (profileMenu) {
                profileMenu.style.display =
                    profileMenu.style.display === "block" ? "none" : "block";
            }
        });
    }

    // Đăng xuất
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("usercontext");
            window.location.href = "/FE/HTML/DangNhap.html";
        });
    }

    // Ẩn menu khi click ra ngoài
    document.addEventListener("click", (event: MouseEvent) => {
        if (profileIcon && profileMenu) {
            const target = event.target as Node;
            if (!profileIcon.contains(target) && !profileMenu.contains(target)) {
                profileMenu.style.display = "none";
            }
        }
    });

    const navItems = document.querySelectorAll(".nav-item");
    const content = document.getElementById("main-content");

    function loadPage(page: string): void {
        fetch(`/FE/HTML/${page}`)
            .then((res) => {
                if (!res.ok) throw new Error("Lỗi tải trang");
                return res.text();
            })
            .then((html) => {
                if (content) content.innerHTML = html;
            })
            .catch(() => {
                if (content) content.innerHTML = "<p>Lỗi tải nội dung.</p>";
            });
    }

    navItems.forEach((item) => {
        item.addEventListener("click", function (e) {
            e.preventDefault();

            navItems.forEach((nav) => nav.classList.remove("active"));
            item.classList.add("active");

            const page = item.getAttribute("data-page");
            if (page) loadPage(page);
        });
    });

    // Mặc định trang đầu
    const defaultPage = document.querySelector(".nav-item.active")?.getAttribute("data-page") || "DanhMuc.html";
    loadPage(defaultPage);
});
