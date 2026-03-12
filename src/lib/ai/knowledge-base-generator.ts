/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * AI Knowledge Base Generator - Tạo 1000+ câu trả lời chi tiết về sản phẩm
 * Copyright (c) 2026 LIKEFOOD Team
 */

import prisma from "@/lib/prisma";

interface ProductBenefit {
  productName: string;
  category: string;
  benefits: string[];
  usage: string[];
  storage: string[];
  nutrition: string;
  origin: string;
}

const PRODUCT_BENEFITS: Record<string, ProductBenefit> = {
  // TRÁI CÂY SẤY
  "xoài sấy": {
    productName: "Xoài sấy",
    category: "Trái cây sấy",
    benefits: [
      "Giàu vitamin A, C và chất chống oxy hóa, tốt cho mắt và da",
      "Chất xơ cao hỗ trợ tiêu hóa, giảm táo bón",
      "Hương vị ngọt tự nhiên, thơm ngon như tươi",
      "Tiện lợi mang theo, bảo quản lâu (6-12 tháng)",
      "Không chất bảo quản, 100% tự nhiên",
      "Giàu kali giúp cân bằng điện giải, tốt cho tim mạch",
      "Thay thế snack ngọt unhealthy, phù hợp người ăn kiêng",
      "Cung cấp năng lượng nhanh cho cơ thể",
    ],
    usage: [
      "Ăn trực tiếp như snack",
      "Pha trà hoặc làm nước uống",
      "Làm topping cho salad, yogurt",
      "Nấu chè, làm bánh",
      "Làm quà biếu, đặc biệt dịp Tết",
    ],
    storage: [
      "Nơi khô ráo, thoáng mát",
      "Tránh ánh nắng trực tiếp",
      "Có thể bảo quản trong tủ lạnh để giữ độ ngon",
      "Đậy kín sau khi mở",
    ],
    nutrition: "100g xoài sấy cung cấp khoảng 320 kcal, 3g chất xơ, 76g đường tự nhiên, vitamin A (20% DV), vitamin C (15% DV)",
    origin: "Nhập khẩu từ Việt Nam, vùng Đồng bằng sông Cửu Long",
  },
  "mít sấy": {
    productName: "Mít sấy",
    category: "Trái cây sấy",
    benefits: [
      "Giàu vitamin C, chất chống oxy hóa tăng sức đề kháng",
      "Chất xơ cao giúp hệ tiêu hóa khỏe mạnh",
      "Hương thơm đặc trưng, vị ngọt thanh",
      "Không cholesterol, tốt cho tim mạch",
      "Chứa kali giúp cân bằng huyết áp",
      "Ít calo hơn snack thông thường",
      "Tiện lợi, dễ mang đi làm, đi du lịch",
    ],
    usage: [
      "Ăn trực tiếp làm snack",
      "Làm topping cho bánh, kem, yogurt",
      "Pha trà mít sấy thơm ngon",
      "Làm nguyên liệu nấu chè",
      "Kết hợp với các loại hạt",
    ],
    storage: [
      "Bảo quản nơi khô ráo",
      "Tránh ẩm mốc",
      "Có thể đông lạnh để tăng thời gian bảo quản",
    ],
    nutrition: "100g mít sấy chứa khoảng 300 kcal, 2g protein, 3g chất xơ, vitamin A và C",
    origin: "Việt Nam, vùng miền Tây Nam Bộ",
  },
  "nho khô": {
    productName: "Nho khô",
    category: "Trái cây sấy",
    benefits: [
      "Giàu chất chống oxy hóa, chống lão hóa",
      "Chất sắt cao, tốt cho người thiếu máu",
      "Chất xơ giúp tiêu hóa tốt",
      "Chứa kali và magiê tốt cho tim mạch",
      "Cung cấp năng lượng tức thì",
      "Tốt cho xương nhờ canxi và vitamin K",
    ],
    usage: [
      "Ăn trực tiếp",
      "Làm topping oatmeal, yogurt",
      "Nấu bánh, làm bánh mì",
      "Pha rượu vang",
      "Kết hợp với các loại hạt",
    ],
    storage: [
      "Đựng trong hộp kín",
      "Nơi mát, tránh ánh sáng",
      "Có thể bảo quản 6-12 tháng",
    ],
    nutrition: "100g nho khô cung cấp 300 kcal, 3g protein, 3g chất xơ, 18% DV sắt",
    origin: "Nhập khẩu từ California, Mỹ hoặc Thổ Nhĩ Kỳ",
  },
  "vải sấy": {
    productName: "Vải sấy",
    category: "Trái cây sấy",
    benefits: [
      "Giàu vitamin C tăng sức đề kháng",
      "Chất chống oxy hóa polyphenol bảo vệ tế bào",
      "Hỗ trợ giấc ngủ nhờ axit amin",
      "Tốt cho da và tóc",
      "Giúp giảm căng thẳng, mệt mỏi",
    ],
    usage: [
      "Ăn trực tiếp",
      "Pha trà vải",
      "Làm topping desserts",
      "Nấu chè, làm bánh",
    ],
    storage: ["Nơi khô ráo", "Đậy kín", "Tránh ánh nắng"],
    nutrition: "100g vải sấy: 290 kcal, vitamin C 15% DV",
    origin: "Việt Nam, vùng Bắc Giang, Hải Dương",
  },
  "long nhãn": {
    productName: "Long nhãn",
    category: "Trái cây sấy",
    benefits: [
      "An thần, giúp ngủ ngon",
      "Bổ sung năng lượng, giảm mệt mỏi",
      "Tốt cho tim mạch",
      "Giàu vitamin A, B",
      "Hỗ trợ tiêu hóa",
    ],
    usage: [
      "Pha trà long nhãn",
      "Nấu chè long nhãn",
      "Ăn trực tiếp",
      "Làm topping cho các món ăn",
    ],
    storage: ["Nơi khô ráo", "Đậy kín", "Bảo quản được 6-12 tháng"],
    nutrition: "100g long nhãn: 280 kcal, giàu vitamin B, sắt",
    origin: "Việt Nam, vùng Bắc Giang, Nam Định",
  },

  // CÁ KHÔ
  "cá khô": {
    productName: "Cá khô",
    category: "Hải sản khô",
    benefits: [
      "Protein cao, tốt cho cơ bắp và sức khỏe",
      "Giàu omega-3, tốt cho não bộ và tim mạch",
      "Canxi cao từ xương, tốt cho xương răng",
      "Vitamin D giúp hấp thụ canxi tốt hơn",
      "Ít calories, phù hợp người ăn kiêng",
      "Tiện lợi, bảo quản lâu",
      "Hương vị đậm đà đặc trưng Việt Nam",
    ],
    usage: [
      "Nấu canh chua (đặc biệt canh cá)",
      "Xào rau muống, rau cần",
      "Nướng ăn với cơm",
      "Làm mồi nhậu",
      "Phi dầu với hành tím",
    ],
    storage: [
      "Nơi khô ráo, thoáng mát",
      "Có thể bảo quản trong tủ lạnh",
      "Tránh ánh nắng và ẩm",
    ],
    nutrition: "100g cá khô: 250 kcal, 40g protein, omega-3, canxi, vitamin D",
    origin: "Việt Nam, đánh bắt từ biển Việt Nam",
  },
  "cá lóc khô": {
    productName: "Cá lóc khô",
    category: "Hải sản khô",
    benefits: [
      "Protein tinh khiết, ít mỡ",
      "Giàu omega-3 tốt cho não",
      "Thịt dai ngon, đặc trưng",
      "Không cholesterol xấu",
      "Tốt cho người tập gym, vận động viên",
    ],
    usage: [
      "Nấu canh chua cá lóc (món đặc trưng miền Tây)",
      "Nướng than hoa",
      "Xào với rau",
      "Làm dry-aged fish",
    ],
    storage: ["Khô ráo", "Tránh ẩm", "Có thể đông lạnh"],
    nutrition: "100g cá lóc khô: 200 kcal, 45g protein",
    origin: "Việt Nam, nuôi hoặc đánh bắt tự nhiên",
  },
  "cá thu khô": {
    productName: "Cá thu khô",
    category: "Hải sản khô",
    benefits: [
      "Giàu DHA, omega-3 phát triển não bộ",
      "Vitamin B12 cao tốt cho hệ thần kinh",
      "Protein chất lượng cao",
      "Tốt cho mắt nhờ vitamin A",
    ],
    usage: [
      "Nấu canh",
      "Chiên giòn",
      "Nướng",
      "Làm gỏi",
    ],
    storage: ["Khô ráo", "Tránh ánh nắng"],
    nutrition: "100g cá thu khô: 220 kcal, 35g protein, omega-3",
    origin: "Việt Nam, đánh bắt từ biển Đông",
  },
  "cá ngừ khô": {
    productName: "Cá ngừ khô",
    category: "Hải sản khô",
    benefits: [
      "Protein siêu cao, ít carb",
      "Giàu selenium chống oxy hóa",
      "Tốt cho tim mạch",
      "Omega-3 dồi dào",
    ],
    usage: [
      "Xào với rau cần",
      "Nấu canh chua",
      "Làm khai vị",
      "Ăn với cơm nóng",
    ],
    storage: ["Nơi khô ráo"],
    nutrition: "100g cá ngừ khô: 250 kcal, 50g protein",
    origin: "Việt Nam, đánh bắt xa bờ",
  },

  // TÔM KHÔ
  "tôm khô": {
    productName: "Tôm khô",
    category: "Hải sản khô",
    benefits: [
      "Protein cao, dễ hấp thụ",
      "Canxi và khoáng chất từ vỏ",
      "Giàu kẽm tăng sức đề kháng",
      "Vitamin B12 tốt cho máu",
      "Hương vị thơm ngon đặc trưng",
    ],
    usage: [
      "Nấu canh tôm (canh bầu, canh bí)",
      "Xào mì, xào noodle",
      "Làm topping phở",
      "Làm nước dùng",
      "Chiên giòn ăn vặt",
    ],
    storage: ["Khô ráo", "Đậy kín", "Có thể bảo quản 6 tháng"],
    nutrition: "100g tôm khô: 300 kcal, 60g protein, canxi, kẽm",
    origin: "Việt Nam, vùng biển miền Trung và miền Tây",
  },
  "tôm sú khô": {
    productName: "Tôm sú khô",
    category: "Hải sản khô",
    benefits: [
      "Thịt tôm ngọt, giàu đạm",
      "Omega-3 tự nhiên",
      "Chất chống oxy hóa astaxanthin",
      "Tốt cho da và tóc",
    ],
    usage: [
      "Nấu canh",
      "Xào",
      "Pha nước chấm",
      "Làm gỏi",
    ],
    storage: ["Khô ráo, mát"],
    nutrition: "100g: 280 kcal, 55g protein",
    origin: "Việt Nam, nuôi tôm sú",
  },

  // MỰC KHÔ
  "mực khô": {
    productName: "Mực khô",
    category: "Hải sản khô",
    benefits: [
      "Protein cực cao, ít chất béo",
      "Vitamin B12 và khoáng chất",
      "Giàu selen chống ung thư",
      "Taurine tốt cho tim mạch",
      "Hương vị thơm đặc trưng biển Việt Nam",
    ],
    usage: [
      "Nướng than hoa (mực nướng)",
      "Chiên giòn",
      "Xào với hành lá",
      "Ăn vặt với bia",
      "Làm mồi nhậu",
    ],
    storage: [
      "Nơi khô ráo",
      "Có thể bảo quản trong tủ lạnh",
      "Tránh ẩm",
    ],
    nutrition: "100g mực khô: 290 kcal, 60g protein, vitamin B12, khoáng chất",
    origin: "Việt Nam, đánh bắt từ biển",
  },

  // GIA VỊ
  "nước mắm": {
    productName: "Nước mắm",
    category: "Gia vị",
    benefits: [
      "Nguồn protein tự nhiên từ cá",
      "Axit amin tăng hương vị món ăn",
      "Giàu iốt tốt cho tuyến giáp",
      "Không chất bảo quản (loại cao cấp)",
      "Đặc sản Việt Nam không thể thiếu",
    ],
    usage: [
      "Nước chấm phở, bún, cơm",
      "Kho thịt, rim",
      "Pha nước mắm chua ngọt",
      "Nấu canh, nêm nếm",
    ],
    storage: [
      "Nơi khô ráo, tránh ánh nắng",
      "Đậy nắp kín sau khi sử dụng",
      "Có thể bảo quản 1-2 năm",
    ],
    nutrition: "1 muỗng nước mắm: 5 kcal, 1g protein, natri",
    origin: "Việt Nam, Phú Quốc, Nha Trang, Phan Thiết",
  },
  "nước mắm nhuyễn": {
    productName: "Nước mắm nhuyễn",
    category: "Gia vị",
    benefits: [
      "Tiện lợi, không cần lọc",
      "Hương vị đậm đà",
      "Pha chế sẵn, không cần thêm gia vị",
      "Dễ sử dụng cho người bận rộn",
    ],
    usage: [
      "Chấm trực tiếp",
      "Pha nước chấm",
      "Nấu ăn",
    ],
    storage: ["Nơi mát", "Đậy kín"],
    nutrition: "1 muỗng: 8 kcal, 1g protein",
    origin: "Việt Nam",
  },
  "tương bần": {
    productName: "Tương bần",
    category: "Gia vị",
    benefits: [
      "Đậm đà hương vị truyền thống",
      "Protein thực vật từ đậu nành",
      "Chất chống oxy hóa từ lên men",
      "Tiện dùng, đậm vị",
    ],
    usage: [
      "Chấm đồ luộc, rau sống",
      "Pha nước chấm bún chả",
      "Kho thịt",
      "Làm sốt",
    ],
    storage: ["Tủ lạnh", "Đậy kín"],
    nutrition: "1 muỗng: 15 kcal, 1g protein",
    origin: "Việt Nam, vùng Bắc Bộ",
  },
  "hành tím khô": {
    productName: "Hành tím khô",
    category: "Gia vị",
    benefits: [
      "Hương thơm đặc trưng Việt Nam",
      "Kháng khuẩn tự nhiên",
      "Giàu vitamin C",
      "Tăng hương vị món ăn",
    ],
    usage: [
      "Phi nạc (chiên vàng)",
      "Nấu canh, xào",
      "Làm gia vị nêm nếm",
      "Pha nước dùng",
    ],
    storage: ["Nơi khô ráo"],
    nutrition: "Hành tím giàu vitamin C, chất chống oxy hóa",
    origin: "Việt Nam",
  },
  "tỏi khô": {
    productName: "Tỏi khô",
    category: "Gia vị",
    benefits: [
      "Kháng khuẩn, kháng virus",
      "Tăng sức đề kháng",
      "Tốt cho tim mạch",
      "Giảm cholesterol",
    ],
    usage: [
      "Phi dầu",
      "Xào nấu",
      "Ngâm giấm",
      "Làm gia vị",
    ],
    storage: ["Khô ráo", "Thoáng mát"],
    nutrition: "Tỏi giàu allicin, vitamin B6, manganese",
    origin: "Việt Nam, vùng Gia Lai, Đà Lạt",
  },
  "bột nghệ": {
    productName: "Bột nghệ",
    category: "Gia vị",
    benefits: [
      "Curcumin chống viêm, chống oxy hóa",
      "Tốt cho da",
      "Hỗ trợ tiêu hóa",
      "Tăng sức đề kháng",
      "Màu vàng đẹp cho món ăn",
    ],
    usage: [
      "Nấu cà ri",
      "Xào rau củ",
      "Pha nước uống",
      "Làm mặt nạ",
    ],
    storage: ["Nơi khô", "Tránh ánh sáng"],
    nutrition: "Giàu curcumin, vitamin B6, sắt",
    origin: "Việt Nam, Ấn Độ",
  },
  "ớt bột": {
    productName: "Ớt bột",
    category: "Gia vị",
    benefits: [
      "Tăng hương vị món ăn",
      "Chất capsaicin tăng trao đổi chất",
      "Vitamin C cao",
      "Giàu vitamin A",
    ],
    usage: [
      "Làm gia vị",
      "Pha nước chấm",
      "Nấu ăn",
    ],
    storage: ["Nơi khô", "Đậy kín"],
    nutrition: "Vitamin C, A, capsaicin",
    origin: "Việt Nam",
  },

  // TRÀ
  "trà sen": {
    productName: "Trà sen",
    category: "Trà",
    benefits: [
      "Hương thơm thanh tao đặc trưng hoa sen",
      "Thanh nhiệt, giải độc cơ thể",
      "An thần, giúp thư giãn",
      "Tốt cho giấc ngủ",
      "Giảm cholesterol",
      "Chống oxy hóa, làm chậm lão hóa",
      "Tốt cho da",
      "Không caffeine (nếu không pha với trà)",
    ],
    usage: [
      "Pha với nước 70-80°C",
      "Ngâm 3-5 phút",
      "Thưởng thức nóng hoặc nguội",
      "Có thể pha lại 2-3 lần",
    ],
    storage: [
      "Hộp kín, nơi mát",
      "Tránh ánh nắng",
      "Tránh tủ lạnh (dễ ẩm)",
      "Bảo quản 1-2 năm",
    ],
    nutrition: "Hoa sen chứa vitamin C, B, flavonoid, không caffeine",
    origin: "Việt Nam, vùng Đồng bằng Bắc Bộ (Hà Nội, Hưng Yên)",
  },
  "trà lài": {
    productName: "Trà lài",
    category: "Trà",
    benefits: [
      "Hương thơm hoa lài thanh khiết",
      "Thư giãn, giảm stress",
      "Không caffeine cao",
      "Tốt cho hệ tiêu hóa",
      "Giúp da đẹp",
      "Chống lão hóa",
    ],
    usage: [
      "Pha với nước 80°C",
      "Ngâm 3-5 phút",
      "Thưởng thức buổi sáng hoặc tối",
    ],
    storage: ["Hộp kín", "Nơi mát", "Tránh ẩm"],
    nutrition: "Flavonoid, vitamin C, chất chống oxy hóa",
    origin: "Việt Nam, vùng trà truyền thống",
  },
  "trà xanh": {
    productName: "Trà xanh",
    category: "Trà",
    benefits: [
      "Chất chống oxy hóa EGCG mạnh nhất",
      "Tăng cường trao đổi chất",
      "Tốt cho tim mạch",
      "Giúp tập trung, tỉnh táo",
      "Giảm cân hiệu quả",
      "Chống lão hóa",
      "Giảm cholesterol xấu",
    ],
    usage: [
      "Pha với nước 70-80°C",
      "Không dùng nước sôi 100°C (đắng)",
      "Ngâm 2-4 phút",
      "Có thể pha lại 2-3 lần",
    ],
    storage: ["Hộp kín", "Tối mát", "Bảo quản 1 năm"],
    nutrition: "100ml trà xanh: 1 kcal, EGCG, caffeine 20-45mg",
    origin: "Việt Nam, Đà Lạt, Lâm Đồng",
  },
  "trà oolong": {
    productName: "Trà Oolong",
    category: "Trà",
    benefits: [
      "Giảm cân, đốt cháy mỡ",
      "Tốt cho tim mạch",
      "Hỗ trợ tiêu hóa",
      "Tăng cường trí nhớ",
      "Làm đẹp da",
    ],
    usage: [
      "Pha với nước 85-90°C",
      "Ngâm 3-5 phút",
      "Thưởng thức nhiều lần",
    ],
    storage: ["Hộp kín", "Tránh ánh sáng"],
    nutrition: "Caffeine vừa, polyphenol, vitamin",
    origin: "Việt Nam, Đài Loan",
  },
  "trà gừng": {
    productName: "Trà gừng",
    category: "Trà",
    benefits: [
      "Giảm buồn nôn, chống say",
      "Tăng sức đề kháng",
      "Giữ ấm cơ thể",
      "Hỗ trợ tiêu hóa",
      "Giảm đau cơ",
      "Chống viêm tự nhiên",
    ],
    usage: [
      "Pha với nước nóng",
      "Thêm chanh, mật ong",
      "Uống buổi sáng",
    ],
    storage: ["Nơi khô ráo"],
    nutrition: "Gingerol, vitamin B6, magnesium",
    origin: "Việt Nam",
  },
  "trà atiso": {
    productName: "Trà atiso",
    category: "Trà",
    benefits: [
      "Thanh lọc gan, giải độc",
      "Hỗ trợ tiêu hóa",
      "Giảm cholesterol",
      "Tốt cho da",
      "Lợi tiểu",
    ],
    usage: [
      "Pha với nước sôi",
      "Ngâm 5-10 phút",
      "Uống nóng hoặc nguội",
    ],
    storage: ["Nơi khô"],
    nutrition: "Inulin, vitamin C, chất chống oxy hóa",
    origin: "Việt Nam, Đà Lạt",
  },

  // CÀ PHÊ
  "cà phê rang xay": {
    productName: "Cà phê rang xay",
    category: "Cà phê",
    benefits: [
      "Caffeine tăng năng lượng, tỉnh táo",
      "Chất chống oxy hóa",
      "Tăng cường trao đổi chất",
      "Tốt cho trí não",
      "Giảm nguy cơ tiểu đường type 2",
      "Hương vị đậm đà đặc trưng Việt Nam",
    ],
    usage: [
      "Pha phin truyền thống",
      "Pha máy espresso",
      "Pha French press",
      "Pha cold brew",
    ],
    storage: [
      "Hộp kín, tránh ánh sáng",
      "Dùng trong 2-4 tuần sau khi mở",
      "Không bảo quản tủ lạnh",
    ],
    nutrition: "1 tách cà phê đen: 2-5 kcal, caffeine 80-120mg",
    origin: "Việt Nam, Tây Nguyên (Đà Lạt, Kon Tum)",
  },
  "cà phê hòa tan": {
    productName: "Cà phê hòa tan",
    category: "Cà phê",
    benefits: [
      "Tiện lợi, pha nhanh",
      "Caffeine vừa đủ",
      "Có thể mang đi bất cứ đâu",
      "Đủ caffeine tỉnh táo",
    ],
    usage: [
      "Pha với nước nóng",
      "Thêm sữa, đường tùy thích",
      "Pha với đá",
    ],
    storage: ["Nơi khô", "Tránh ẩm"],
    nutrition: "1 gói: 50 kcal, caffeine 50-80mg",
    origin: "Việt Nam",
  },
  "cà phê phin": {
    productName: "Cà phê phin",
    category: "Cà phê",
    benefits: [
      "Hương vị truyền thống Việt Nam",
      "Pha chậm giữ độ đậm",
      "Không cần máy",
      "Caffeine vừa phải",
    ],
    usage: [
      "Cho cà phê vào phin",
      "Đổ nước sôi từ từ",
      "Chờ 5-10 phút",
      "Thêm đường, sữa",
    ],
    storage: ["Hộp kín"],
    nutrition: "1 tách: 100 kcal với sữa, caffeine 80-100mg",
    origin: "Việt Nam",
  },

  // BÁNH KẸO
  "bánh pía": {
    productName: "Bánh pía",
    category: "Bánh",
    benefits: [
      "Bánh truyền thống miền Tây",
      "Vỏ bánh mềm, nhân đậu xanh ngọt bùi",
      "Tiện lợi, ăn được ngay",
      "Có thể làm quà biếu",
    ],
    usage: [
      "Ăn trực tiếp",
      "Uống trà kèm",
      "Làm quà tặng",
    ],
    storage: ["Tủ lạnh", "Hạn sử dụng ngắn"],
    nutrition: "1 cái bánh: 200 kcal",
    origin: "Việt Nam, Sóc Trăng",
  },
  "bánh gai": {
    productName: "Bánh gai",
    category: "Bánh",
    benefits: [
      "Đặc sản Bắc Bộ",
      "Lá gai tự nhiên tạo màu",
      "Nhân đậu xanh bùi ngọt",
      "Không chất bảo quản",
    ],
    usage: [
      "Ăn trực tiếp",
      "Kèm trà",
    ],
    storage: ["Nơi mát", "Hạn ngắn"],
    nutrition: "180 kcal/cái",
    origin: "Việt Nam, Hà Nội, Ninh Bình",
  },
  "bánh đúc": {
    productName: "Bánh đúc",
    category: "Bánh",
    benefits: [
      "Ít calories, không béo",
      "Nguồn carbohydrate tốt",
      "Dễ tiêu hóa",
      "Món ăn truyền thống",
    ],
    usage: [
      "Ăn với nước chấm",
      "Kèm chả, nem",
    ],
    storage: ["Tươi", "Nơi mát"],
    nutrition: "100g: 150 kcal",
    origin: "Việt Nam",
  },
  "kẹo lạc": {
    productName: "Kẹo lạc",
    category: "Kẹo",
    benefits: [
      "Đậu phộng giàu protein",
      "Chất béo tốt (unsaturated)",
      "Vitamin E tự nhiên",
      "Tiện lợi, giá rẻ",
    ],
    usage: [
      "Ăn vặt",
      "Làm quà",
    ],
    storage: ["Nơi khô"],
    nutrition: "1 cái: 100 kcal, protein 3g",
    origin: "Việt Nam",
  },
  "kẹo gừng": {
    productName: "Kẹo gừng",
    category: "Kẹo",
    benefits: [
      "Gừng giảm buồn nôn",
      "Tăng sức đề kháng",
      "Hương vị ấm áp",
      "Tiện mang đi",
    ],
    usage: [
      "Ăn sau meals",
      "Khi cảm thấy buồn nôn",
    ],
    storage: ["Nơi khô"],
    nutrition: "50 kcal/cái, gừng",
    origin: "Việt Nam",
  },
  "mứt bí": {
    productName: "Mứt bí",
    category: "Mứt",
    benefits: [
      "Bí giàu vitamin A, C",
      "Chất xơ cao",
      "Tự nhiên, không chất bảo quản",
      "Vị ngọt thanh",
    ],
    usage: [
      "Ăn trực tiếp",
      "Kèm trà",
      "Làm bánh",
    ],
    storage: ["Tủ lạnh"],
    nutrition: "100g: 200 kcal",
    origin: "Việt Nam",
  },
  "mứt gừng": {
    productName: "Mứt gừng",
    category: "Mứt",
    benefits: [
      "Gừng chống viêm",
      "Giảm đau họng",
      "Tăng sức đề kháng",
      "Hương vị đặc biệt",
    ],
    usage: [
      "Ăn trực tiếp",
      "Pha trà gừng",
    ],
    storage: ["Tủ lạnh"],
    nutrition: "80 kcal/100g",
    origin: "Việt Nam",
  },

  // THỊT KHÔ
  "khô bò": {
    productName: "Khô bò",
    category: "Thịt khô",
    benefits: [
      "Protein cực cao (60-70%)",
      "Tiện mang đi, bảo quản lâu",
      "Thay thế snack unhealthy",
      "Tốt cho người tập gym",
      "Không cholesterol xấu",
    ],
    usage: [
      "Ăn vặt",
      "Kèm bia, rượu",
      "Làm topping cơm",
    ],
    storage: [
      "Nơi khô ráo",
      "Có thể bảo quản 3-6 tháng",
    ],
    nutrition: "100g: 300 kcal, 60g protein",
    origin: "Việt Nam, miền Tây",
  },
  "khô gà": {
    productName: "Khô gà",
    category: "Thịt khô",
    benefits: [
      "Protein cao, ít béo hơn khô bò",
      "Vị ngọt từ thịt gà",
      "Dễ nhai hơn",
      "Giàu vitamin B",
    ],
    usage: [
      "Snack",
      "Kèm cơm",
    ],
    storage: ["Khô ráo"],
    nutrition: "250 kcal, 45g protein/100g",
    origin: "Việt Nam",
  },

  // QUÀ BIẾU
  "combo quà Tết": {
    productName: "Combo quà Tết",
    category: "Quà biếu",
    benefits: [
      "Tiện lợi, đóng gói đẹp",
      "Đa dạng sản phẩm",
      "Phù hợp mọi đối tượng",
      "Giao hàng tận nơi",
      "Có thể tùy chỉnh",
    ],
    usage: [
      "Tặng gia đình, bạn bè",
      "Tặng đối tác, khách hàng",
      "Biếu ông bà, cha mẹ",
    ],
    storage: ["Theo từng sản phẩm"],
    nutrition: "Tùy sản phẩm trong combo",
    origin: "Việt Nam",
  },
  "set quà cao cấp": {
    productName: "Set quà cao cấp",
    category: "Quà biếu",
    benefits: [
      "Sang trọng, đẳng cấp",
      "Sản phẩm chất lượng cao",
      "Gói đẹp, có ribbon",
      "Phù hợc khách VIP",
    ],
    usage: [
      "Tặng đối tác lớn",
      "Biếu sếp, lãnh đạo",
      "Dịp lễ quan trọng",
    ],
    storage: ["Tùy sản phẩm"],
    nutrition: "Tùy sản phẩm",
    origin: "Việt Nam",
  },

  // ĐỒ ĂN VẶT
  "bánh tráng": {
    productName: "Bánh tráng",
    category: "Đồ ăn vặt",
    benefits: [
      "Ít calories",
      "Tiện lợi, mang đi",
      "Đa dạng cách ăn",
      "Không cholesterol",
    ],
    usage: [
      "Cuốn với nhân",
      "Nướng",
      "Chiên",
    ],
    storage: ["Nơi khô"],
    nutrition: "50 kcal/cái",
    origin: "Việt Nam, Bình Dương, Đồng Nai",
  },
  "nem chua": {
    productName: "Nem chua",
    category: "Đồ ăn vặt",
    benefits: [
      "Đặc sản Ninh Bình",
      "Vị chua thanh đặc trưng",
      "Protein từ thịt",
      "Có thể chiên hoặc ăn sống",
    ],
    usage: [
      "Chiên giòn",
      "Ăn với bánh tráng",
      "Kèm tỏi, ớt",
    ],
    storage: ["Tủ lạnh", "Hạn ngắn"],
    nutrition: "150 kcal/100g",
    origin: "Việt Nam, Ninh Bình",
  },
  "chả lụa": {
    productName: "Chả lụa",
    category: "Đồ ăn vặt",
    benefits: [
      "Protein từ thịt",
      "Tiện ăn, cắt được",
      "Đặc trưng Việt Nam",
    ],
    usage: [
      "Cắt lát ăn với bánh mì",
      "Làm bánh mì kẹp",
      "Kèm cơm",
    ],
    storage: ["Tủ lạnh"],
    nutrition: "200 kcal/100g",
    origin: "Việt Nam",
  },
  "ruốc thịt": {
    productName: "Ruốc thịt",
    category: "Đồ ăn vặt",
    benefits: [
      "Protein cao",
      "Vị ngọt tự nhiên",
      "Tiện bảo quản",
      "Đa dụng",
    ],
    usage: [
      "Ăn với cơm",
      "Làm topping",
      "Kèm bánh mì",
    ],
    storage: ["Nơi khô"],
    nutrition: "250 kcal/100g",
    origin: "Việt Nam",
  },

  // HẠT
  "hạt hướng dương": {
    productName: "Hạt hướng dương",
    category: "Hạt",
    benefits: [
      "Vitamin E cao",
      "Chất béo tốt",
      "Protein thực vật",
      "Magie tốt cho tim",
    ],
    usage: [
      "Ăn vặt",
      "Làm topping",
      "Trộn salad",
    ],
    storage: ["Nơi khô"],
    nutrition: "100g: 580 kcal, 20g protein, vitamin E",
    origin: "Nhập khẩu",
  },
  "hạt dưa": {
    productName: "Hạt dưa",
    category: "Hạt",
    benefits: [
      "Giàu protein",
      "Chất xơ",
      "Vitamin B",
      "Tiện ăn vặt",
    ],
    usage: ["Ăn vặt", "Kèm bia"],
    storage: ["Khô ráo"],
    nutrition: "100g: 500 kcal",
    origin: "Việt Nam",
  },
  "hạt sen": {
    productName: "Hạt sen",
    category: "Hạt",
    benefits: [
      "An thần, giúp ngủ ngon",
      "Bổ khí, bổ huyết",
      "Tốt cho tim mạch",
      "Giàu protein",
    ],
    usage: [
      "Nấu chè",
      "Pha trà",
      "Làm bánh",
    ],
    storage: ["Nơi khô"],
    nutrition: "100g: 350 kcal, 20g protein",
    origin: "Việt Nam",
  },
};

// Generate 1000+ detailed Q&A from product benefits
function generateProductQA(): Array<{
  category: string;
  question: string;
  answer: string;
  keywords: string[];
  language: string;
  priority: number;
}> {
  const qaList: Array<{
    category: string;
    question: string;
    answer: string;
    keywords: string[];
    language: string;
    priority: number;
  }> = [];

  const benefitTemplates = {
    vi: {
      benefit: [
        "Lợi ích sức khỏe của {product} là gì?",
        "{product} có tốt cho sức khỏe không?",
        "Tại sao nên ăn {product}?",
        "{product} mang lại những gì cho cơ thể?",
        "Ăn {product} có lợi ích gì?",
        "{product} có tác dụng gì cho sức khỏe?",
        "Những ai nên ăn {product}?",
        "{product} tốt cho đối tượng nào?",
      ],
      usage: [
        "Cách sử dụng {product}?",
        "{product} dùng như thế nào?",
        "Cách dùng {product} đúng cách?",
        "Sử dụng {product} như thế nào?",
        "{product} có thể chế biến được không?",
        "Món ngon từ {product}?",
        "Công thức với {product}?",
      ],
      storage: [
        "Cách bảo quản {product}?",
        "{product} để được bao lâu?",
        "Bảo quản {product} như thế nào?",
        "Cất giữ {product} ở đâu?",
        "{product} có cần tủ lạnh không?",
      ],
      nutrition: [
        "Giá trị dinh dưỡng của {product}?",
        "{product} chứa những gì?",
        "Thành phần dinh dưỡng của {product}?",
        "{product} có bao nhiêu calorie?",
        "Ăn {product} có mập không?",
      ],
      origin: [
        "{product} từ đâu?",
        "Nguồn gốc {product}?",
        "{product} nhập khẩu từ đâu?",
        "Xuất xứ của {product}?",
      ],
      taste: [
        "Vị của {product} như thế nào?",
        "{product} có ngon không?",
        "Hương vị {product}?",
        "Sản phẩm {product} có đặc điểm gì?",
      ],
      compare: [
        "{product} khác gì với sản phẩm tương tự?",
        "Nên chọn {product} hay sản phẩm khác?",
        "Tại sao chọn {product} của LIKEFOOD?",
        "{product} của LIKEFOOD có gì đặc biệt?",
      ],
    },
    en: {
      benefit: [
        "What are the health benefits of {product}?",
        "Is {product} good for health?",
        "Why should I eat {product}?",
        "What are the benefits of {product}?",
        "Who should eat {product}?",
      ],
      usage: [
        "How to use {product}?",
        "How do I consume {product}?",
        "What can I make with {product}?",
        "Recipes with {product}?",
      ],
      storage: [
        "How to store {product}?",
        "How long does {product} last?",
        "Does {product} need refrigeration?",
      ],
      nutrition: [
        "Nutritional value of {product}?",
        "What's in {product}?",
        "Calories in {product}?",
      ],
      origin: [
        "Where is {product} from?",
        "Origin of {product}?",
      ],
      taste: [
        "How does {product} taste?",
        "Is {product} delicious?",
      ],
    },
  };

  // Generate Q&A for each product
  for (const [key, benefit] of Object.entries(PRODUCT_BENEFITS)) {
    const productName = benefit.productName;
    const normalizedKey = key.toLowerCase();

    // Generate Vietnamese Q&A
    for (const benefitQ of benefitTemplates.vi.benefit) {
      const question = benefitQ.replace("{product}", productName);
      const answer = `Về lợi ích sức khỏe của ${productName}: ${benefit.benefits.join(". ")}. Đây là sản phẩm chất lượng từ ${benefit.origin}, được nhiều khách hàng ưa chuộng tại LIKEFOOD.`;

      qaList.push({
        category: "product",
        question,
        answer,
        keywords: [normalizedKey, productName.toLowerCase(), ...benefit.category.toLowerCase().split(" ")],
        language: "vi",
        priority: 9,
      });
    }

    // Usage Q&A
    for (const usageQ of benefitTemplates.vi.usage) {
      const question = usageQ.replace("{product}", productName);
      const answer = `${productName} có nhiều cách sử dụng: ${benefit.usage.join(". ")}. Đây là những cách phổ biến và dễ làm nhất.`;

      qaList.push({
        category: "usage",
        question,
        answer,
        keywords: [normalizedKey, "cách dùng", "sử dụng", "chế biến", "nấu"],
        language: "vi",
        priority: 8,
      });
    }

    // Storage Q&A
    for (const storageQ of benefitTemplates.vi.storage) {
      const question = storageQ.replace("{product}", productName);
      const answer = `Cách bảo quản ${productName}: ${benefit.storage.join(". ")}. Những lưu ý này giúp giữ sản phẩm tươi ngon lâu nhất.`;

      qaList.push({
        category: "storage",
        question,
        answer,
        keywords: [normalizedKey, "bảo quản", "cất giữ", "hạn sử dụng"],
        language: "vi",
        priority: 8,
      });
    }

    // Nutrition Q&A
    for (const nutQ of benefitTemplates.vi.nutrition) {
      const question = nutQ.replace("{product}", productName);
      const answer = `Thông tin dinh dưỡng của ${productName}: ${benefit.nutrition}. Bạn có thể yên tâm sử dụng sản phẩm này như một phần của chế độ ăn uống lành mạnh.`;

      qaList.push({
        category: "nutrition",
        question,
        answer,
        keywords: [normalizedKey, "dinh dưỡng", "calorie", "vitamin", "chất"],
        language: "vi",
        priority: 8,
      });
    }

    // Origin Q&A
    for (const originQ of benefitTemplates.vi.origin) {
      const question = originQ.replace("{product}", productName);
      const answer: string = `Nguồn gốc ${productName}: ${benefit.origin}. LIKEFOOD nhập khẩu trực tiếp đảm bảo chất lượng và nguồn gốc rõ ràng.`;

      qaList.push({
        category: "origin",
        question,
        answer,
        keywords: [normalizedKey, "nguồn gốc", "xuất xứ", "nhập khẩu"],
        language: "vi",
        priority: 7,
      });
    }

    // Taste Q&A
    for (const tasteQ of benefitTemplates.vi.taste) {
      const question = tasteQ.replace("{product}", productName);
      const answer: string = `${productName} có hương vị đặc trưng ${benefit.category}. Đây là sản phẩm được đánh giá cao về chất lượng tại LIKEFOOD.`;

      qaList.push({
        category: "product",
        question,
        answer,
        keywords: [normalizedKey, "vị", "ngon", "hương", "chất lượng"],
        language: "vi",
        priority: 7,
      });
    }

    // Generate English Q&A
    for (const benefitQ of benefitTemplates.en.benefit) {
      const question = benefitQ.replace("{product}", productName);
      const answer = `Health benefits of ${productName}: ${benefit.benefits.join(". ")}. This is a quality product from ${benefit.origin}, highly recommended at LIKEFOOD.`;

      qaList.push({
        category: "product",
        question,
        answer,
        keywords: [normalizedKey, productName.toLowerCase(), "health", "benefits"],
        language: "en",
        priority: 9,
      });
    }

    for (const usageQ of benefitTemplates.en.usage) {
      const question = usageQ.replace("{product}", productName);
      const answer = `${productName} can be used in many ways: ${benefit.usage.join(". ")}. These are the most popular and easy methods.`;

      qaList.push({
        category: "usage",
        question,
        answer,
        keywords: [normalizedKey, "use", "consume", "recipe", "cook"],
        language: "en",
        priority: 8,
      });
    }

    for (const storageQ of benefitTemplates.en.storage) {
      const question = storageQ.replace("{product}", productName);
      const answer: string = `Storage: ${benefit.storage.join(". ")}. Follow these tips to keep the product fresh longest.`;

      qaList.push({
        category: "storage",
        question,
        answer,
        keywords: [normalizedKey, "store", "storage", "refrigerate"],
        language: "en",
        priority: 8,
      });
    }

    for (const nutQ of benefitTemplates.en.nutrition) {
      const question = nutQ.replace("{product}", productName);
      const answer: string = `Nutrition: ${benefit.nutrition}. You can confidently include this product in a healthy diet.`;

      qaList.push({
        category: "nutrition",
        question,
        answer,
        keywords: [normalizedKey, "nutrition", "calories", "vitamin"],
        language: "en",
        priority: 8,
      });
    }
  }

  // Add category-based questions
  const categories = [
    { name: "Trái cây sấy", keywords: ["xoài sấy", "mít sấy", "nho khô", "vải sấy", "long nhãn", "dried fruit"] },
    { name: "Hải sản khô", keywords: ["cá khô", "tôm khô", "mực khô", "dried seafood", "dried fish"] },
    { name: "Gia vị", keywords: ["nước mắm", "tương", "hành tím", "tỏi", "gia vị", "spice"] },
    { name: "Trà", keywords: ["trà sen", "trà lài", "trà xanh", "trà oolong", "trà gừng", "tea"] },
    { name: "Cà phê", keywords: ["cà phê rang xay", "cà phê hòa tan", "cà phê phin", "coffee"] },
    { name: "Bánh kẹo", keywords: ["bánh pía", "bánh gai", "kẹo lạc", "kẹo gừng", "cake", "candy"] },
    { name: "Thịt khô", keywords: ["khô bò", "khô gà", "jerky", "dried meat"] },
    { name: "Đồ ăn vặt", keywords: ["bánh tráng", "nem chua", "chả lụa", "snack"] },
    { name: "Quà biếu", keywords: ["quà Tết", "set quà", "gift", "quà biếu"] },
  ];

  for (const cat of categories) {
    // Vietnamese
    qaList.push({
      category: "product",
      question: `Có những sản phẩm ${cat.name} nào?`,
      answer: `LIKEFOOD có đa dạng sản phẩm ${cat.name} với nhiều mức giá và chất lượng. Bạn có thể xem chi tiết trên website hoặc hỏi mình cụ thể hơn về sản phẩm nào đó.`,
      keywords: [cat.name.toLowerCase(), ...cat.keywords, "sản phẩm", "mua"],
      language: "vi",
      priority: 9,
    });

    qaList.push({
      category: "product",
      question: `Sản phẩm ${cat.name} nào ngon nhất?`,
      answer: `Tùy vào khẩu vị cá nhân, nhưng các sản phẩm ${cat.name} tại LIKEFOOD đều được chọn lọc kỹ. Mình có thể gợi ý cụ thể hơn nếu bạn cho mình biết ngân sách và sở thích.`,
      keywords: [cat.name.toLowerCase(), "ngon", "tốt nhất", "recommend"],
      language: "vi",
      priority: 8,
    });

    // English
    qaList.push({
      category: "product",
      question: `What ${cat.name} products do you have?`,
      answer: `LIKEFOOD offers a variety of ${cat.name} products at different prices and quality levels. Check our website or ask me for specific recommendations.`,
      keywords: [cat.name.toLowerCase(), ...cat.keywords, "product"],
      language: "en",
      priority: 9,
    });
  }

  // Add cross-product comparison questions
  qaList.push({
    category: "product",
    question: "Nên chọn trái cây sấy hay hải sản khô?",
    answer: "Tùy vào nhu cầu: Trái cây sấy ngọt tự nhiên, giàu vitamin, phù hợp ăn vặt healthy. Hải sản khô giàu protein, tốt cho cơ bắp, phù hợp người tập gym. LIKEFOOD có cả hai loại với chất lượng cao.",
    keywords: ["so sánh", "trái cây sấy", "hải sản khô", "nên chọn"],
    language: "vi",
    priority: 8,
  });

  qaList.push({
    category: "product",
    question: "Trà hay cà phê tốt hơn cho sức khỏe?",
    answer: "Cả hai đều có lợi: Trà giàu chất chống oxy hóa, ít caffeine hơn, tốt cho tim và da. Cà phê tăng năng lượng, tỉnh táo, tốt cho não. Nên dùng vừa phải mỗi ngày.",
    keywords: ["trà", "cà phê", "so sánh", "tốt cho sức khỏe"],
    language: "vi",
    priority: 8,
  });

  qaList.push({
    category: "product",
    question: "Which is better, tea or coffee?",
    answer: "Both have benefits: Tea is rich in antioxidants, lower caffeine, good for heart and skin. Coffee boosts energy and alertness. Consume in moderation.",
    keywords: ["tea", "coffee", "comparison", "health"],
    language: "en",
    priority: 8,
  });

  // Add lifestyle/diet questions
  const dietQuestions = [
    { q: "Có sản phẩm nào cho người ăn chay không?", a: "Có nhiều sản phẩm phù hợp người ăn chay: trà, cà phê, gia vị, bánh, mứt, hoa quả sấy, hạt. Tìm 'vegetarian' hoặc 'vegan' trên website.", kw: ["chay", "vegetarian", "vegan", "ăn chay"] },
    { q: "Có sản phẩm gluten-free không?", a: "Một số sản phẩm không chứa gluten: trà, cà phê, hạt, hoa quả sấy. Tìm 'gluten-free' trên trang sản phẩm.", kw: ["gluten", "gluten-free", "không gluten"] },
    { q: "Có sản phẩm organic không?", a: "Một số sản phẩm có chứng nhận organic. Tìm kiếm 'organic' trên website để xem các sản phẩm hữu cơ.", kw: ["organic", "hữu cơ", "tự nhiên"] },
    { q: "Sản phẩm nào tốt cho người giảm cân?", a: "Trà xanh, trà atiso, cá khô, tôm khô, hoa quả sấy (không đường) là những lựa chọn tốt cho người ăn kiêng. Ít calories, nhiều dinh dưỡng.", kw: ["giảm cân", "ăn kiêng", "diet", "healthy"] },
    { q: "Snack nào tốt cho người tập gym?", a: "Khô bò, khô gà, tôm khô, hạt là những snack giàu protein, tốt cho người tập gym và vận động viên.", kw: ["gym", "tập thể hình", "protein", "thể thao"] },
    { q: "What vegetarian products do you have?", a: "We have many vegetarian options: tea, coffee, spices, candies, dried fruits, and nuts. Search 'vegetarian' on our website.", kw: ["vegetarian", "vegan"] },
    { q: "What products are good for weight loss?", a: "Green tea, artichoke tea, dried seafood, dried fruits (no sugar) are great for dieters. Low in calories, high in nutrition.", kw: ["weight loss", "diet", "healthy"] },
  ];

  for (const d of dietQuestions) {
    qaList.push({
      category: "nutrition",
      question: d.q,
      answer: d.a,
      keywords: d.kw,
      language: d.q.includes("?") && !d.q.includes("Are") && !d.q.includes("What") ? "vi" : "en",
      priority: 9,
    });
  }

  // Add gifting questions
  const giftQuestions = [
    { q: "Quà biếu Tết nên chọn gì?", a: "Combo quà Tết LIKEFOOD có nhiều lựa chọn: set trà + bánh, hải sản + gia vị, hộp cao cấp. Giá từ $29-$199, phù hợp mọi ngân sách.", kw: ["quà Tết", "tet", "biếu", "gift"] },
    { q: "Quà biếu sếp nên chọn gì?", a: "Nên chọn set quà cao cấp với sản phẩm chất lượng, gói đẹp sang trọng. LIKEFOOD có các hộp quà VIP phù hợp.", kw: ["sếp", "đối tác", "VIP", "cao cấp"] },
    { q: "Quà cho người Mỹ nên chọn gì?", a: "Đặc sản Việt Nam độc đáo như trà sen, cà phê phin, nước mắm cao cấp, khô bò là những món người Mỹ rất thích.", kw: ["người Mỹ", "quà biếu", "đặc sản"] },
    { q: "What gift for Vietnamese people?", a: "Specialty items like lotus tea, Vietnamese coffee, premium fish sauce, and dried beef are great gifts that Vietnamese people love.", kw: ["gift", "vietnamese", "specialty"] },
  ];

  for (const g of giftQuestions) {
    qaList.push({
      category: "gift",
      question: g.q,
      answer: g.a,
      keywords: g.kw,
      language: g.q.includes("What") ? "en" : "vi",
      priority: 9,
    });
  }

  // Add specific use case questions
  const useCaseQuestions = [
    { q: "Món gì nấu canh chua ngon?", a: "Cá lóc khô, cá thu khô, tôm khô là những nguyên liệu không thể thiếu cho món canh chua. Thêm me, cà chua, rau muống - cả nhà đều thích!", kw: ["canh chua", "nấu", "cá khô", "tôm khô"] },
    { q: "Làm sao pha trà sen ngon?", a: "Pha trà sen với nước 70°C (không sôi), ngâm 3-5 phút. Không nên dùng nước quá nóng sẽ làm mất hương sen. Có thể pha lại 2-3 lần.", kw: ["pha trà", "trà sen", "cách pha"] },
    { q: "Cách pha cà phê phin đúng cách?", a: "Cho 20-30g cà phê vào phin, đổ 100ml nước sôi từ từ. Chờ 5-10 phút để cà phê nhỏ hết. Thêm đường, sữa tùy khẩu.", kw: ["cà phê phin", "pha cà phê", "phin"] },
    { q: "ăn gì để tăng sức đề kháng?", a: "Trà gừng, trà atiso, nho khô, mít sấy là những sản phẩm giàu vitamin C và chất chống oxy hóa, tốt cho sức khỏe.", kw: ["sức đề kháng", "vitamin", "immune"] },
    { q: "What to cook with dried fish?", a: "Dried fish is perfect for sour soup (canh chua), stir-fried vegetables, or grilled. Add to soups for rich flavor.", kw: ["dried fish", "cook", "recipe"] },
  ];

  for (const u of useCaseQuestions) {
    qaList.push({
      category: "usage",
      question: u.q,
      answer: u.a,
      keywords: u.kw,
      language: u.q.includes("What") ? "en" : "vi",
      priority: 8,
    });
  }

  return qaList;
}

async function seedEnhancedKnowledgeBase() {
  console.log("🚀 Bắt đầu tạo Knowledge Base nâng cấp...");

  const qaList = generateProductQA();
  console.log(`📝 Đã tạo ${qaList.length} câu hỏi-câu trả lời`);

  // Seed vào database
  let successCount = 0;
  let errorCount = 0;

  for (const qa of qaList) {
    try {
      await prisma.aiKnowledge.create({
        data: {
          id: crypto.randomUUID(),
          category: qa.category,
          question: qa.question,
          answer: qa.answer,
          keywords: qa.keywords.join(","),
          language: qa.language,
          priority: qa.priority,
          isActive: true,
          updatedAt: new Date(),
        },
      });
      successCount++;

      if (successCount % 100 === 0) {
        console.log(`✅ Đã seed ${successCount}/${qaList.length} items...`);
      }
    } catch (error) {
      errorCount++;
      if (errorCount <= 5) {
        console.error(`❌ Lỗi seed: ${qa.question.substring(0, 50)}...`, error);
      }
    }
  }

  console.log(`\n🎉 Hoàn thành!`);
  console.log(`✅ Thành công: ${successCount} items`);
  console.log(`❌ Lỗi: ${errorCount} items`);
  console.log(`📊 Tổng cộng: ${successCount} items trong Knowledge Base`);

  // Hiển thị thống kê
  const totalCount = await prisma.aiKnowledge.count();
  console.log(`\n📈 Tổng số records trong database: ${totalCount}`);
}

// Export for use
export { generateProductQA, seedEnhancedKnowledgeBase };

// Run if called directly
seedEnhancedKnowledgeBase()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
