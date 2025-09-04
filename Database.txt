-- ========================
-- BẢNG NGƯỜI DÙNG & VAI TRÒ
-- ========================

CREATE TABLE vai_tro (
    id VARCHAR(10) PRIMARY KEY,
    ten_vai_tro VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE nguoi_dung (
    id VARCHAR(10) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    mat_khau_hash VARCHAR(255) NOT NULL,
    ho VARCHAR(100),
    ten VARCHAR(100),
    so_dien_thoai VARCHAR(20),
    dia_chi TEXT,
    ngay_sinh DATE,
    role_id VARCHAR(10),
    reset_token TEXT,
    reset_token_expiry TIMESTAMP

);

-- ========================
-- DANH MỤC, THƯƠNG HIỆU, SẢN PHẨM
-- ========================

CREATE TABLE danh_muc (
    id VARCHAR(10) PRIMARY KEY,
    icon VARCHAR(10),
    ten_danh_muc VARCHAR(100) NOT NULL
);

CREATE TABLE thuong_hieu (
    id VARCHAR(10) PRIMARY KEY,
    ten_thuong_hieu VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE khuyen_mai (
    id VARCHAR(10) PRIMARY KEY,
    ten_khuyen_mai VARCHAR(255) NOT NULL,
    mo_ta TEXT,
    phan_tram_giam INTEGER CHECK (phan_tram_giam BETWEEN 1 AND 100),
    ngay_bat_dau DATE,
    ngay_ket_thuc DATE
);

CREATE TABLE san_pham (
    id VARCHAR(10) PRIMARY KEY,
    ten_san_pham VARCHAR(255) NOT NULL,
    ma_san_pham VARCHAR(100) UNIQUE NOT NULL,
    mo_ta TEXT,
    gia_ban DECIMAL(10,2) NOT NULL CHECK (gia_ban >= 0),
    danh_muc_id VARCHAR(10),
    da_xoa BOOLEAN DEFAULT FALSE,
    thuong_hieu_id VARCHAR(10)
);

CREATE TABLE mau_sac (
    id VARCHAR(10) PRIMARY KEY,
    ten_mau VARCHAR(50) NOT NULL,
    ma_mau VARCHAR(7) -- Thay đổi từ HEXCOLOR thành VARCHAR(7) để lưu mã màu hex
);

CREATE TABLE kich_co (
    id VARCHAR(10) PRIMARY KEY,
    so_kich_co VARCHAR(10) NOT NULL -- VD: '38', '42', 'L', 'XL'
);

CREATE TABLE bien_the_san_pham (
    id VARCHAR(20) PRIMARY KEY,
    san_pham_id VARCHAR(10) NOT NULL,
    mau_sac_id VARCHAR(10) NOT NULL,
    kich_co_id VARCHAR(10) NOT NULL,
    so_luong_ton_kho INTEGER NOT NULL CHECK (so_luong_ton_kho >= 0),
    da_xoa BOOLEAN DEFAULT FALSE,
    UNIQUE(san_pham_id, mau_sac_id, kich_co_id)
);

-- ========================
-- HÌNH ẢNH SẢN PHẨM
-- ========================

CREATE TABLE hinh_anh_san_pham (
    id VARCHAR(10) PRIMARY KEY,
    san_pham_id VARCHAR(10) NOT NULL,
    mau_sac_id VARCHAR(10) NOT NULL,
    duong_dan_hinh_anh VARCHAR(500) NOT NULL
);

-- ========================
-- GIỎ HÀNG VÀ SẢN PHẨM TRONG GIỎ
-- ========================

CREATE TABLE gio_hang (
    id VARCHAR(10) PRIMARY KEY,
    nguoi_dung_id VARCHAR(10) NOT NULL
);

CREATE TABLE san_pham_gio_hang (
    id VARCHAR(10) PRIMARY KEY,
    gio_hang_id VARCHAR(10) NOT NULL,
    bien_the_id VARCHAR(20) NOT NULL, -- tham chiếu tới bien_the_san_pham
    so_luong INTEGER CHECK (so_luong > 0)
);

-- ========================
-- ĐƠN HÀNG VÀ CHI TIẾT ĐƠN HÀNG
-- ========================

CREATE TABLE don_hang (
    id VARCHAR(10) PRIMARY KEY,
    nguoi_dung_id VARCHAR(10) NOT NULL,
    tong_thanh_toan DECIMAL(10,2) CHECK (tong_thanh_toan >= 0),
    trang_thai VARCHAR(20) DEFAULT 'cho_xac_nhan'
    CHECK (trang_thai IN ('cho_xac_nhan', 'da_xac_nhan', 'dang_giao', 'da_giao', 'da_huy')),
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chi_tiet_don_hang (
    id VARCHAR(10) PRIMARY KEY,
    don_hang_id VARCHAR(10) NOT NULL,
    bien_the_id VARCHAR(20) NOT NULL,
    so_luong INTEGER NOT NULL CHECK (so_luong > 0),
    gia_ban DECIMAL(10,2) NOT NULL       -- Giá tại thời điểm đặt hàng
);
-- ========================
-- ĐÁNH GIÁ SẢN PHẨM & HÌNH ẢNH
-- ========================

CREATE TABLE danh_gia_san_pham (
    id VARCHAR(10) PRIMARY KEY,
    san_pham_id VARCHAR(10) NOT NULL,
    nguoi_dung_id VARCHAR(10) NOT NULL,
    diem_danh_gia INTEGER CHECK (diem_danh_gia BETWEEN 1 AND 5),
    noi_dung_danh_gia TEXT,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- THÔNG BÁO NGƯỜI DÙNG
-- ========================

CREATE TABLE thong_bao (
    id VARCHAR(10) PRIMARY KEY,
    nguoi_dung_id VARCHAR(10) NOT NULL,
    tieu_de VARCHAR(255) NOT NULL,
    noi_dung TEXT NOT NULL,
    da_doc BOOLEAN DEFAULT FALSE,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE giao_dich_thanh_toan (
    id VARCHAR(10) PRIMARY KEY,
    don_hang_id VARCHAR(10) NOT NULL,
    phuong_thuc_thanh_toan VARCHAR(100) NOT NULL,
    so_tien DECIMAL(10,2) NOT NULL,
    trang_thai VARCHAR(20) DEFAULT 'cho_thanh_toan'
    CHECK (trang_thai IN ('cho_thanh_toan', 'da_thanh_toan', 'that_bai', 'hoan_tien')),
    ma_giao_dich VARCHAR(100), -- Mã giao dịch ngân hàng (nếu có)
    ngay_thanh_toan TIMESTAMP,
    ghi_chu TEXT
);

CREATE TABLE dia_chi_giao_hang (
    id VARCHAR(10) PRIMARY KEY,
    don_hang_id VARCHAR(10) NOT NULL,
    ho_ten_nguoi_nhan VARCHAR(200) NOT NULL,
    so_dien_thoai VARCHAR(20) NOT NULL,
    dia_chi_chi_tiet TEXT NOT NULL,
    phuong_xa VARCHAR(100),
    tinh_thanh VARCHAR(100),
    ghi_chu TEXT
);
-- ========================
-- KHÓA NGOẠI
-- ========================

-- ========================
-- KHÓA NGOẠI
-- ========================

-- BẢNG NGƯỜI DÙNG & VAI TRÒ
ALTER TABLE nguoi_dung
ADD CONSTRAINT fk_nguoi_dung_vai_tro
FOREIGN KEY (role_id) REFERENCES vai_tro(id);

-- DANH MỤC, THƯƠNG HIỆU, KHUYẾN MÃI
ALTER TABLE san_pham
ADD CONSTRAINT fk_san_pham_danh_muc
FOREIGN KEY (danh_muc_id) REFERENCES danh_muc(id);

ALTER TABLE san_pham
ADD CONSTRAINT fk_san_pham_thuong_hieu
FOREIGN KEY (thuong_hieu_id) REFERENCES thuong_hieu(id);

-- BIẾN THỂ SẢN PHẨM
ALTER TABLE bien_the_san_pham
ADD CONSTRAINT fk_bien_the_san_pham_san_pham
FOREIGN KEY (san_pham_id) REFERENCES san_pham(id);

ALTER TABLE bien_the_san_pham
ADD CONSTRAINT fk_bien_the_san_pham_mau_sac
FOREIGN KEY (mau_sac_id) REFERENCES mau_sac(id);

ALTER TABLE bien_the_san_pham
ADD CONSTRAINT fk_bien_the_san_pham_kich_co
FOREIGN KEY (kich_co_id) REFERENCES kich_co(id);

-- HÌNH ẢNH SẢN PHẨM
ALTER TABLE hinh_anh_san_pham
ADD CONSTRAINT fk_hasp_san_pham
FOREIGN KEY (san_pham_id) REFERENCES san_pham(id);

ALTER TABLE hinh_anh_san_pham
ADD CONSTRAINT fk_hasp_mau_sac
FOREIGN KEY (mau_sac_id) REFERENCES mau_sac(id);

-- GIỎ HÀNG & SẢN PHẨM TRONG GIỎ
ALTER TABLE gio_hang
ADD CONSTRAINT fk_gh_nguoi_dung
FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id)
ON DELETE CASCADE;

ALTER TABLE san_pham_gio_hang
ADD CONSTRAINT fk_spgh_gio_hang
FOREIGN KEY (gio_hang_id) REFERENCES gio_hang(id)
ON DELETE CASCADE;

ALTER TABLE san_pham_gio_hang
ADD CONSTRAINT fk_spgh_bien_the
FOREIGN KEY (bien_the_id) REFERENCES bien_the_san_pham(id);

-- ĐƠN HÀNG & CHI TIẾT ĐƠN HÀNG
ALTER TABLE don_hang
ADD CONSTRAINT fk_dh_nguoi_dung
FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id)
ON DELETE CASCADE;

ALTER TABLE chi_tiet_don_hang
ADD CONSTRAINT fk_ctdh_don_hang
FOREIGN KEY (don_hang_id) REFERENCES don_hang(id)
ON DELETE CASCADE;

ALTER TABLE chi_tiet_don_hang
ADD CONSTRAINT fk_ctdh_bien_the
FOREIGN KEY (bien_the_id) REFERENCES bien_the_san_pham(id);

-- GIAO DỊCH THANH TOÁN
ALTER TABLE giao_dich_thanh_toan
ADD CONSTRAINT fk_gdtt_don_hang
FOREIGN KEY (don_hang_id) REFERENCES don_hang(id)
ON DELETE CASCADE;

-- ĐỊA CHỈ GIAO HÀNG
ALTER TABLE dia_chi_giao_hang
ADD CONSTRAINT fk_dcgh_don_hang
FOREIGN KEY (don_hang_id) REFERENCES don_hang(id)
ON DELETE CASCADE;

-- ĐÁNH GIÁ SẢN PHẨM & HÌNH ẢNH
ALTER TABLE danh_gia_san_pham
ADD CONSTRAINT fk_dgsp_san_pham
FOREIGN KEY (san_pham_id) REFERENCES san_pham(id);

ALTER TABLE danh_gia_san_pham
ADD CONSTRAINT fk_dgsp_nguoi_dung
FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id)
ON DELETE CASCADE;

-- THÔNG BÁO NGƯỜI DÙNG
ALTER TABLE thong_bao
ADD CONSTRAINT fk_tb_nguoi_dung
FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id)
ON DELETE CASCADE;

-- ========================
-- DỮ LIỆU MẪU CHO WEBSITE BÁN GIÀY
-- ========================

-- Vai trò người dùng
INSERT INTO vai_tro (id, ten_vai_tro) VALUES 
('ADMIN', 'Quản trị viên'),
('USER', 'Khách hàng'),
('STAFF', 'Nhân viên');

-- Người dùng mẫu
INSERT INTO nguoi_dung (id, email, mat_khau_hash, ho, ten, so_dien_thoai, dia_chi, ngay_sinh, role_id) VALUES 
('ND001', 'admin@shoeshop.com', '$2b$10$03/FAaB1jI0L8KezKu8RO..zW0nVroDvydeW.zd2FdaXlTyaQiwA2', 'Nguyễn', 'Quản Trị', '0901234567', '123 Đường ABC, Quận 1, TP.HCM', '1985-01-15', 'ADMIN'),
('ND002', 'nguyen.van.a@email.com', '$2b$10$03/FAaB1jI0L8KezKu8RO..zW0nVroDvydeW.zd2FdaXlTyaQiwA2', 'Nguyễn', 'Văn A', '0912345678', '456 Đường DEF, Quận 3, TP.HCM', '1990-05-20', 'USER'),
('ND003', 'tran.thi.b@email.com', '$2b$10$03/FAaB1jI0L8KezKu8RO..zW0nVroDvydeW.zd2FdaXlTyaQiwA2', 'Trần', 'Thị B', '0923456789', '789 Đường GHI, Quận 7, TP.HCM', '1995-08-10', 'USER'),
('ND004', 'staff1@shoeshop.com', '$2b$10$03/FAaB1jI0L8KezKu8RO..zW0nVroDvydeW.zd2FdaXlTyaQiwA2', 'Lê', 'Văn C', '0934567890', '321 Đường JKL, Quận 5, TP.HCM', '1992-12-03', 'STAFF');

-- Danh mục giày
INSERT INTO danh_muc (id, ten_danh_muc, icon) VALUES 
('DM001', 'Giày thể thao', '🏃'),
('DM002', 'Giày thời trang', '👠'),
('DM003', 'Giày công sở', '💼'),
('DM004', 'Giày running', '🏃‍♂️'),
('DM005', 'Giày basketball', '🏀'),
('DM006', 'Giày sneaker', '👟'),
('DM007', 'Giày boot', '🥾'),
('DM008', 'Giày cao gót', '👠'),
('DM009', 'Giày oxford', '🥿'),
('DM010', 'Giày loafer', '👞');

-- Thương hiệu giày
INSERT INTO thuong_hieu (id, ten_thuong_hieu) VALUES 
('TH001', 'Nike'),
('TH002', 'Adidas'),
('TH003', 'Converse'),
('TH004', 'Vans'),
('TH005', 'New Balance'),
('TH006', 'Puma'),
('TH007', 'Gucci'),
('TH008', 'Louis Vuitton'),
('TH009', 'Bitis'),
('TH010', 'Ananas');

-- Khuyến mãi
INSERT INTO khuyen_mai (id, ten_khuyen_mai, mo_ta, phan_tram_giam, ngay_bat_dau, ngay_ket_thuc) VALUES 
('KM001', 'Giảm giá mùa hè', 'Khuyến mãi mùa hè cho tất cả sản phẩm', 15, '2024-06-01', '2024-08-31'),
('KM002', 'Flash Sale cuối tuần', 'Giảm giá sốc cuối tuần', 25, '2024-07-20', '2024-07-21'),
('KM003', 'Sinh nhật thương hiệu', 'Khuyến mãi kỷ niệm sinh nhật', 20, '2024-09-01', '2024-09-30');

-- Màu sắc
INSERT INTO mau_sac (id, ten_mau, ma_mau) VALUES 
('MS001', 'Đen', '#000000'),
('MS002', 'Trắng', '#FFFFFF'),
('MS003', 'Đỏ', '#FF0000'),
('MS004', 'Xanh navy', '#000080'),
('MS005', 'Nâu', '#8B4513'),
('MS006', 'Xanh lá', '#008000'),
('MS007', 'Xám', '#808080'),
('MS008', 'Hồng', '#FFC0CB'),
('MS009', 'Vàng', '#FFFF00'),
('MS010', 'Cam', '#FFA500');

-- Kích cỡ
INSERT INTO kich_co (id, so_kich_co) VALUES 
('KC001', '35'),
('KC002', '36'),
('KC003', '37'),
('KC004', '38'),
('KC005', '39'),
('KC006', '40'),
('KC007', '41'),
('KC008', '42'),
('KC009', '43'),
('KC010', '44'),
('KC011', '45');

-- Sản phẩm giày
INSERT INTO san_pham (id, ten_san_pham, ma_san_pham, mo_ta, gia_ban, danh_muc_id, thuong_hieu_id) VALUES 
('SP001', 'Nike Air Max 270', 'NIKE-AM270-001', 'Giày thể thao Nike Air Max 270 với đệm khí tối đa', 2890000, 'DM006', 'TH001'),
('SP002', 'Adidas Ultraboost 22', 'ADS-UB22-001', 'Giày chạy bộ Adidas với công nghệ Boost', 4290000, 'DM004', 'TH002'),
('SP003', 'Converse Chuck Taylor All Star', 'CNV-CT-001', 'Giày sneaker cổ điển Converse Chuck Taylor', 1590000, 'DM006', 'TH003'),
('SP004', 'Vans Old Skool', 'VANS-OS-001', 'Giày skateboard cổ điển Vans Old Skool', 1890000, 'DM006', 'TH004'),
('SP005', 'New Balance 574', 'NB-574-001', 'Giày thể thao retro New Balance 574', 2290000, 'DM006', 'TH005'),
('SP006', 'Nike Air Jordan 1', 'NIKE-AJ1-001', 'Giày basketball huyền thoại Air Jordan 1', 3890000, 'DM005', 'TH001'),
('SP007', 'Puma RS-X', 'PUMA-RSX-001', 'Giày thể thao Puma RS-X phong cách chunky', 2590000, 'DM006', 'TH006'),
('SP008', 'Gucci Ace Sneaker', 'GC-ACE-001', 'Giày sneaker cao cấp Gucci Ace', 15900000, 'DM002', 'TH007'),
('SP009', 'Bitis Hunter', 'BT-HT-001', 'Giày thể thao Việt Nam Bitis Hunter', 690000, 'DM006', 'TH009'),
('SP010', 'Ananas Vintas', 'ANN-VT-001', 'Giày sneaker Việt Nam Ananas Vintas', 590000, 'DM006', 'TH010');

-- Biến thể sản phẩm (kết hợp sản phẩm, màu sắc, kích cỡ)
INSERT INTO bien_the_san_pham (id, san_pham_id, mau_sac_id, kich_co_id, so_luong_ton_kho) VALUES 
-- Nike Air Max 270
('BT001', 'SP001', 'MS001', 'KC006', 25), -- Đen, size 40
('BT002', 'SP001', 'MS001', 'KC007', 30), -- Đen, size 41
('BT003', 'SP001', 'MS002', 'KC006', 20), -- Trắng, size 40
('BT004', 'SP001', 'MS002', 'KC007', 15), -- Trắng, size 41

-- Adidas Ultraboost 22
('BT005', 'SP002', 'MS001', 'KC007', 18), -- Đen, size 41
('BT006', 'SP002', 'MS001', 'KC008', 22), -- Đen, size 42
('BT007', 'SP002', 'MS004', 'KC007', 16), -- Navy, size 41
('BT008', 'SP002', 'MS004', 'KC008', 20), -- Navy, size 42

-- Converse Chuck Taylor
('BT009', 'SP003', 'MS001', 'KC004', 35), -- Đen, size 38
('BT010', 'SP003', 'MS001', 'KC005', 40), -- Đen, size 39
('BT011', 'SP003', 'MS002', 'KC004', 32), -- Trắng, size 38
('BT012', 'SP003', 'MS003', 'KC005', 28), -- Đỏ, size 39

-- Vans Old Skool
('BT013', 'SP004', 'MS001', 'KC006', 24), -- Đen, size 40
('BT014', 'SP004', 'MS001', 'KC007', 26), -- Đen, size 41
('BT015', 'SP004', 'MS002', 'KC006', 22), -- Trắng, size 40
('BT016', 'SP004', 'MS004', 'KC007', 18), -- Navy, size 41

-- New Balance 574
('BT017', 'SP005', 'MS007', 'KC007', 20), -- Xám, size 41
('BT018', 'SP005', 'MS007', 'KC008', 25), -- Xám, size 42
('BT019', 'SP005', 'MS004', 'KC007', 15), -- Navy, size 41
('BT020', 'SP005', 'MS005', 'KC008', 18); -- Nâu, size 42

-- Hình ảnh sản phẩm
INSERT INTO hinh_anh_san_pham (id, san_pham_id, mau_sac_id, duong_dan_hinh_anh) VALUES 
('HA001', 'SP001', 'MS001', 'https://sneakerdaily.vn/wp-content/uploads/2022/06/Giay-Nike-Air-Max-270-Black-White-AH8050-002-8.jpg'),
('HA002', 'SP001', 'MS001', 'https://sneakerdaily.vn/wp-content/uploads/2022/06/Giay-Nike-Air-Max-270-Black-White-AH8050-002-8.jpg'),
('HA003', 'SP001', 'MS002', 'https://sneakerdaily.vn/wp-content/uploads/2022/09/Giay-Nike-Air-Max-270-Golf-White-Black-CK6483-102.jpg'),
('HA004', 'SP001', 'MS002', 'https://sneakerdaily.vn/wp-content/uploads/2022/09/Giay-Nike-Air-Max-270-Golf-White-Black-CK6483-102.jpg'),
('HA005', 'SP002', 'MS001', 'https://sneakerdaily.vn/wp-content/uploads/2021/07/Giay-Nike-Air-Max-270-React-Black-Orange-DA4305-001.jpg'),
('HA006', 'SP002', 'MS004', 'https://sneakerdaily.vn/wp-content/uploads/2021/07/Giay-Nike-Air-Max-270-React-GS-Iron-Grey-Lime-Crimson-BQ0103-015.jpg'),
('HA007', 'SP003', 'MS001', 'https://sneakerdaily.vn/wp-content/uploads/2021/07/Giay-Nike-Air-Max-270-React-SE-GS-Grind-Black-CN8282-001.jpg'),
('HA008', 'SP003', 'MS002', 'https://sneakerdaily.vn/wp-content/uploads/2021/08/Giay-nam-Nike-Air-Max-270-React-ENG-Neon-95-CW2623-001.jpg'),
('HA009', 'SP003', 'MS003', 'https://sneakerdaily.vn/wp-content/uploads/2022/06/Giay-nu-Nike-Air-Max-270-React-GG-Bleached-Coral-CQ5420-611-10.jpg'),
('HA010', 'SP004', 'MS001', 'https://sneakerdaily.vn/wp-content/uploads/2023/10/Giay-Nike-Air-Max-270-Go-FN9926-181.jpg');

-- Giỏ hàng
INSERT INTO gio_hang (id, nguoi_dung_id) VALUES 
('GH001', 'ND002'),
('GH002', 'ND003');

-- Sản phẩm trong giỏ hàng
INSERT INTO san_pham_gio_hang (id, gio_hang_id, bien_the_id, so_luong) VALUES 
('SPGH001', 'GH001', 'BT001', 1), -- User ND002: Nike Air Max đen size 40
('SPGH002', 'GH001', 'BT009', 2), -- User ND002: Converse đen size 38
('SPGH003', 'GH002', 'BT013', 1); -- User ND003: Vans đen size 40

-- Đơn hàng
INSERT INTO don_hang (id, nguoi_dung_id, tong_thanh_toan, trang_thai, ngay_tao) VALUES 
('DH001', 'ND002', 4480000, 'da_giao', '2024-06-15 10:30:00'),
('DH002', 'ND003', 1890000, 'dang_giao', '2024-07-10 14:20:00'),
('DH003', 'ND002', 2590000, 'cho_xac_nhan', '2024-07-20 09:15:00');

INSERT INTO don_hang (id, nguoi_dung_id, tong_thanh_toan, trang_thai, ngay_tao) VALUES 
('DH004', 'ND002', 1200000, 'cho_xac_nhan', '2024-07-21 08:00:00'),
('DH005', 'ND002', 1750000, 'da_xac_nhan', '2024-07-22 10:45:00'),
('DH006', 'ND002', 1990000, 'dang_giao', '2024-07-23 12:30:00'),
('DH007', 'ND002', 2890000, 'da_giao', '2024-07-24 14:00:00'),
('DH008', 'ND002', 890000,  'da_huy', '2024-07-25 15:30:00');


-- Chi tiết đơn hàng
INSERT INTO chi_tiet_don_hang (id, don_hang_id, bien_the_id, so_luong, gia_ban) VALUES 
('CTDH001', 'DH001', 'BT001', 1, 2890000),
('CTDH002', 'DH001', 'BT003', 3, 1590000),
('CTDH003', 'DH002', 'BT004', 2, 1890000),
('CTDH004', 'DH003', 'BT007', 4, 2590000);
INSERT INTO chi_tiet_don_hang (id, don_hang_id, bien_the_id, so_luong, gia_ban) VALUES 
('CTDH005', 'DH004', 'BT001', 1, 1200000),
('CTDH006', 'DH005', 'BT002', 1, 850000),
('CTDH007', 'DH005', 'BT004', 1, 900000),
('CTDH008', 'DH006', 'BT003', 1, 990000),
('CTDH009', 'DH006', 'BT001', 1, 1000000),
('CTDH010', 'DH007', 'BT004', 2, 1445000),
('CTDH011', 'DH008', 'BT002', 1, 890000);

-- Đánh giá sản phẩm
INSERT INTO danh_gia_san_pham (id, san_pham_id, nguoi_dung_id, diem_danh_gia, noi_dung_danh_gia, ngay_tao) VALUES 
('DG001', 'SP001', 'ND002', 5, 'Giày rất đẹp và thoải mái, đệm khí êm ái khi đi bộ lâu', '2024-06-20 15:30:00'),
('DG002', 'SP003', 'ND002', 4, 'Giày cổ điển, phù hợp với nhiều trang phục. Chất lượng tốt', '2024-06-21 10:15:00'),
('DG003', 'SP004', 'ND003', 5, 'Giày Vans chất lượng tuyệt vời, thiết kế thời trang', '2024-07-15 16:45:00'),
('DG004', 'SP009', 'ND003', 5, 'Ủng hộ hàng Việt Nam, giày đẹp và giá cả hợp lý', '2024-07-18 11:20:00');

-- Thông báo
INSERT INTO thong_bao (id, nguoi_dung_id, tieu_de, noi_dung, da_doc, ngay_tao) VALUES 
('TB001', 'ND002', 'Đơn hàng đã được giao thành công', 'Đơn hàng DH001 của bạn đã được giao thành công. Cảm ơn bạn đã mua sắm tại cửa hàng!', TRUE, '2024-06-18 09:00:00'),
('TB002', 'ND002', 'Khuyến mãi mùa hè', 'Giảm giá 15% cho tất cả sản phẩm trong tháng 7. Nhanh tay mua sắm ngay!', FALSE, '2024-07-01 08:00:00'),
('TB003', 'ND003', 'Đơn hàng đang được giao', 'Đơn hàng DH002 của bạn đang trên đường giao. Vui lòng chú ý điện thoại.', TRUE, '2024-07-10 16:30:00'),
('TB004', 'ND003', 'Sản phẩm yêu thích có khuyến mãi', 'Sản phẩm New Balance 574 trong danh sách yêu thích của bạn đang có khuyến mãi 15%!', FALSE, '2024-07-15 10:00:00');
-- ========================
-- DỮ LIỆU MẪU CHO GIAO DỊCH THANH TOÁN
-- ========================

INSERT INTO giao_dich_thanh_toan (id, don_hang_id, phuong_thuc_thanh_toan, so_tien, trang_thai, ma_giao_dich, ngay_thanh_toan, ghi_chu) VALUES 
('TT001', 'DH001', 'Chuyển khoản ngân hàng', 4480000, 'da_thanh_toan', 'VCB2024061512345', '2024-06-15 10:45:00', 'Thanh toán thành công qua VCB'),
('TT002', 'DH002', 'COD - Thanh toán khi nhận hàng', 1890000, 'da_thanh_toan', NULL, '2024-07-10 14:30:00', 'Thanh toán COD khi giao hàng'),
('TT003', 'DH003', 'Ví điện tử MoMo', 2590000, 'cho_thanh_toan', NULL, NULL, 'Đang chờ thanh toán'),
('TT004', 'DH004', 'Thẻ tín dụng Visa', 1200000, 'cho_thanh_toan', NULL, NULL, 'Đang xử lý thanh toán'),
('TT005', 'DH005', 'Chuyển khoản ngân hàng', 1750000, 'da_thanh_toan', 'TCB2024072210987', '2024-07-22 11:00:00', 'Thanh toán qua Techcombank'),
('TT006', 'DH006', 'Ví điện tử ZaloPay', 1990000, 'da_thanh_toan', 'ZP2024072313456', '2024-07-23 12:45:00', 'Thanh toán thành công qua ZaloPay'),
('TT007', 'DH007', 'COD - Thanh toán khi nhận hàng', 2890000, 'da_thanh_toan', NULL, '2024-07-24 14:15:00', 'Thanh toán COD hoàn tất'),
('TT008', 'DH008', 'Chuyển khoản ngân hàng', 890000, 'hoan_tien', 'VTB2024072515678', '2024-07-25 16:00:00', 'Đã hoàn tiền do hủy đơn hàng');

-- ========================
-- DỮ LIỆU MẪU CHO ĐỊA CHỈ GIAO HÀNG
-- ========================

INSERT INTO dia_chi_giao_hang (id, don_hang_id, ho_ten_nguoi_nhan, so_dien_thoai, dia_chi_chi_tiet, phuong_xa, tinh_thanh, ghi_chu) VALUES 
('DC001', 'DH001', 'Nguyễn Văn A', '0912345678', '456 Đường DEF, Tòa nhà ABC, Tầng 5', 'Phường Võ Thị Sáu', 'Quận 3, TP.Hồ Chí Minh', 'Gọi trước 30 phút, giao giờ hành chính'),
('DC002', 'DH002', 'Trần Thị B', '0923456789', '789 Đường GHI, Chung cư XYZ, Căn hộ 12A', 'Phường Tân Thuận Đông', 'Quận 7, TP.Hồ Chí Minh', 'Có thang máy, giao tận cửa'),
('DC003', 'DH003', 'Nguyễn Văn A', '0912345678', '456 Đường DEF, Tòa nhà ABC, Tầng 5', 'Phường Võ Thị Sáu', 'Quận 3, TP.Hồ Chí Minh', 'Địa chỉ nhà riêng'),
('DC004', 'DH004', 'Nguyễn Văn A', '0912345678', '123 Đường MNO, Văn phòng PQR', 'Phường Bến Nghé', 'Quận 1, TP.Hồ Chí Minh', 'Giao tại văn phòng, giờ hành chính 8h-17h'),
('DC005', 'DH005', 'Lê Thị C', '0934567890', '456 Đường DEF, Tòa nhà ABC, Tầng 5', 'Phường Võ Thị Sáu', 'Quận 3, TP.Hồ Chí Minh', 'Người nhận khác, đã thông báo trước'),
('DC006', 'DH006', 'Nguyễn Văn A', '0912345678', '456 Đường DEF, Tòa nhà ABC, Tầng 5', 'Phường Võ Thị Sáu', 'Quận 3, TP.Hồ Chí Minh', 'Giao nhanh trong ngày'),
('DC007', 'DH007', 'Nguyễn Văn A', '0912345678', '789 Đường STU, Nhà riêng', 'Phường 14', 'Quận 10, TP.Hồ Chí Minh', 'Địa chỉ nhà bố mẹ, có người nhận'),
('DC008', 'DH008', 'Nguyễn Văn A', '0912345678', '456 Đường DEF, Tòa nhà ABC, Tầng 5', 'Phường Võ Thị Sáu', 'Quận 3, TP.Hồ Chí Minh', 'Đơn hàng đã hủy');