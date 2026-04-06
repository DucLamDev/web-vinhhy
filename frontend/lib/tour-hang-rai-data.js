const nhaTrangPackageOptions = [
  {
    id: "tour-ghep-doan-tron-goi",
    label: "Tour ghép đoàn trọn gói",
    shortLabel: "Ghép đoàn",
    guestLabel: "Đi ghép từ 1 khách",
    minTravelers: 1,
    maxTravelers: 3,
    recommendedCount: 1,
    adultPrice: 650000,
    childPrice: 500000,
    infantPrice: 0,
    note: "Phù hợp khách lẻ hoặc nhóm nhỏ muốn đi trọn gói trong ngày từ Nha Trang."
  },
  {
    id: "tour-di-rieng-2-3-khach",
    label: "Tour đi riêng 2 - 3 khách",
    shortLabel: "Riêng 2 - 3",
    guestLabel: "Đoàn riêng 2 đến 3 khách",
    minTravelers: 2,
    maxTravelers: 3,
    recommendedCount: 2,
    adultPrice: 2100000,
    childPrice: 1070000,
    infantPrice: 0,
    note: "Không gian riêng tư, thích hợp cặp đôi hoặc gia đình nhỏ."
  },
  {
    id: "tour-di-rieng-4-6-khach",
    label: "Tour đi riêng 4 - 6 khách",
    shortLabel: "Riêng 4 - 6",
    guestLabel: "Đoàn riêng 4 đến 6 khách",
    minTravelers: 4,
    maxTravelers: 6,
    recommendedCount: 4,
    adultPrice: 1350000,
    childPrice: 675000,
    infantPrice: 0,
    note: "Phù hợp nhóm bạn hoặc gia đình lớn muốn chủ động thời gian."
  },
  {
    id: "tour-di-rieng-7-9-khach",
    label: "Tour đi riêng 7 - 9 khách",
    shortLabel: "Riêng 7 - 9",
    guestLabel: "Đoàn riêng 7 đến 9 khách",
    minTravelers: 7,
    maxTravelers: 9,
    recommendedCount: 7,
    adultPrice: 1070000,
    childPrice: 535000,
    infantPrice: 0,
    note: "Mức giá đẹp cho đoàn đông vừa phải, vẫn giữ lịch trình riêng."
  },
  {
    id: "tour-di-rieng-10-14-khach",
    label: "Tour đi riêng 10 - 14 khách",
    shortLabel: "Riêng 10 - 14",
    guestLabel: "Đoàn riêng 10 đến 14 khách",
    minTravelers: 10,
    maxTravelers: 14,
    recommendedCount: 10,
    adultPrice: 970000,
    childPrice: 485000,
    infantPrice: 0,
    note: "Phù hợp công ty, lớp học hoặc đoàn đại gia đình."
  },
  {
    id: "tour-di-rieng-15-khach-tro-len",
    label: "Tour đi riêng 15 khách trở lên",
    shortLabel: "Riêng 15+",
    guestLabel: "Đoàn từ 15 khách trở lên",
    minTravelers: 15,
    maxTravelers: null,
    recommendedCount: 15,
    adultPrice: 850000,
    childPrice: 425000,
    infantPrice: 0,
    note: "Mức giá tối ưu cho đoàn đông và cần xe riêng."
  }
];

const ninhThuanPackageOptions = [
  {
    id: "tour-ghep-doan-tron-goi",
    label: "Tour ghép đoàn trọn gói",
    shortLabel: "Ghép đoàn",
    guestLabel: "Đi ghép từ 1 khách",
    minTravelers: 1,
    maxTravelers: 3,
    recommendedCount: 1,
    adultPrice: 450000,
    childPrice: 315000,
    infantPrice: 0,
    note: "Giá áp dụng cho khách tự có mặt tại Ninh Thuận trước giờ khởi hành."
  }
];

export const hangRaiTourOverride = {
  title: "Tour Hang Rái - Vĩnh Hy - Vườn Nho - Đồng Cừu",
  slug: "tour-hang-rai-vinh-hy-vuon-nho-dong-cuu",
  summary:
    "Tour 1 ngày khám phá trọn bộ các điểm check-in nổi bật của Ninh Thuận: Đồng Cừu, Hang Rái, Vĩnh Hy và vườn nho, có nhiều option giá theo quy mô đoàn và điểm khởi hành.",
  description:
    "Hành trình 1 ngày dành cho khách mê cảnh đẹp, thích chụp ảnh và muốn gom các điểm nổi bật nhất của Ninh Thuận trong cùng một tour. Từ đồng cừu thơ mộng, biển xanh Vĩnh Hy, bãi đá Hang Rái đến vườn nho bản địa, lịch trình được thiết kế cân bằng giữa tham quan, nghỉ ngơi và ăn trưa.",
  location: "Đồng Cừu - Hang Rái - Vĩnh Hy - Vườn Nho",
  duration: "1 ngày",
  transport: "Xe du lịch",
  pickupPlace: "Nha Trang hoặc Ninh Thuận",
  standard: "Khởi hành hằng ngày",
  heroImage: "/tour-dong-cuu-vinh-hy-vuon-nho/tour-dong-cuu-vinh-hy-1536x1536.webp",
  galleryImages: [
    {
      url: "/tour-dong-cuu-vinh-hy-vuon-nho/dong-cuu-suoi-tien.webp",
      alt: "Check-in đồng cừu giữa khung cảnh thoáng rộng"
    },
    {
      url: "/tour-dong-cuu-vinh-hy-vuon-nho/vinh-vinh-hy.webp",
      alt: "Biển xanh Vĩnh Hy nhìn từ cung đường ven biển"
    },
    {
      url: "/tour-dong-cuu-vinh-hy-vuon-nho/hang-rai-dong-cuu-vinh-hy-vuon-nho-5.jpg",
      alt: "Bãi đá Hang Rái với sóng biển và nền trời trong"
    },
    {
      url: "/tour-vinh-hy-ninh-chu-2-ngay-2-dem/vuon-nho-ninh-thuan-2-1.webp",
      alt: "Vườn nho Ninh Thuận sai quả"
    },
    {
      url: "/tour-dong-cuu-vinh-hy-vuon-nho/ban-an-vinh-hy-2048x1536.webp",
      alt: "Bữa trưa hải sản trong chương trình"
    },
    {
      url: "/tour-dong-cuu-vinh-hy-vuon-nho/hang-rai-vinh-hy-dong-cuu-vuon-nho11-1024x1024.webp",
      alt: "Khoảnh khắc sống ảo tại Hang Rái"
    }
  ],
  itinerary: [
    {
      time: "09h00",
      title: "Đón khách tại khách sạn",
      description: "Hướng dẫn viên đón khách tại khách sạn, bắt đầu hành trình khám phá cung biển đẹp của Ninh Thuận.",
      image: "/tour-dong-cuu-vinh-hy-vuon-nho/tour-dong-cuu-vinh-hy-1536x1536.webp",
      imageAlt: "Xe và hướng dẫn viên đón khách khởi hành tour"
    },
    {
      time: "09h15",
      title: "Tham quan Đồng Cừu",
      description:
        "Tham quan Đồng Cừu, tự do check-in với rất nhiều góc chụp hình đẹp giữa đồng cỏ, xe vintage và đàn cừu.",
      image: "/tour-dong-cuu-vinh-hy-vuon-nho/dong-cuu-suoi-tien.webp",
      imageAlt: "Khách check-in tại Đồng Cừu"
    },
    {
      time: "11h30",
      title: "Đến Vĩnh Hy",
      description:
        "Đến Vĩnh Hy, thỏa thích tạo dáng trên một trong những cung đường đèo ven biển đẹp nhất. Sau đó ăn trưa tại nhà hàng với không gian thoáng đãng, thưởng thức các món hải sản tươi ngon đậm chất miền biển.",
      image: "/tour-dong-cuu-vinh-hy-vuon-nho/vinh-vinh-hy.webp",
      imageAlt: "Vịnh Vĩnh Hy trong xanh"
    },
    {
      time: "13h30",
      title: "Tham quan Hang Rái",
      description:
        "Tham quan Hang Rái, khám phá vẻ đẹp kỳ thú của bãi san hô cổ hàng nghìn năm tuổi, được ví như “Sao Hỏa trên biển”, và tự do thực hiện những bộ ảnh nổi bật nhất trong ngày.",
      image: "/tour-dong-cuu-vinh-hy-vuon-nho/hang-rai-dong-cuu-vinh-hy-vuon-nho-5.jpg",
      imageAlt: "Check-in Hang Rái"
    },
    {
      time: "15h00",
      title: "Tham quan Vườn Nho Ninh Thuận",
      description:
        "Quý khách tham quan vườn nho, tìm hiểu quy trình trồng nho, tự hái những chùm nho chín mọng tại vườn và mua thêm đặc sản địa phương nếu muốn.",
      image: "/tour-vinh-hy-ninh-chu-2-ngay-2-dem/vuon-nho-ninh-thuan-2-1.webp",
      imageAlt: "Tham quan vườn nho Ninh Thuận"
    },
    {
      time: "16h00",
      title: "Kết thúc tour",
      description: "Di chuyển về điểm đón ban đầu, kết thúc chương trình tour.",
      image: "/tour-dong-cuu-vinh-hy-vuon-nho/binh-hung-dong-cuu-vuon-nho-1-1536x993.webp",
      imageAlt: "Kết thúc tour và quay về điểm đón"
    }
  ],
  trustBadges: ["Xác nhận nhanh", "Lịch trình dễ đi", "Phù hợp khách thích check-in"],
  heroStats: [
    { value: "4", label: "điểm check-in nổi bật" },
    { value: "6", label: "gói giá theo đoàn" },
    { value: "1 ngày", label: "không cần lưu trú" }
  ],
  featureHighlights: [
    {
      title: "Điểm đẹp gom trong một ngày",
      description: "Lịch trình tập trung vào những điểm lên hình đẹp và dễ đi nhất của Ninh Thuận."
    },
    {
      title: "Giá linh hoạt theo đoàn",
      description: "Có đủ gói ghép đoàn và đi riêng để phù hợp ngân sách và quy mô khách."
    },
    {
      title: "Có lựa chọn theo nơi khởi hành",
      description: "Khách đi từ Nha Trang và khách đã có mặt tại Ninh Thuận được tách giá rõ ràng."
    }
  ],
  tripFacts: [
    "Phù hợp khách mê chụp ảnh, gia đình và nhóm bạn đi cuối tuần",
    "Bao gồm ăn trưa theo chương trình và các điểm check-in nổi bật",
    "Em bé dưới 1m miễn phí",
    "Có giá riêng cho khách khởi hành từ Nha Trang và Ninh Thuận"
  ],
  travelerTypes: [
    { key: "adult", label: "Người lớn", hint: "(> 1m3)" },
    { key: "child", label: "Trẻ em", hint: "(1m - 1m3)" },
    { key: "infant", label: "Em bé", hint: "(< 1m)" }
  ],
  departureOptions: [
    {
      id: "nha-trang",
      label: "Khởi hành từ Nha Trang",
      description: "Giá đã gồm xe đón khách từ Nha Trang theo ảnh bạn gửi.",
      packageOptions: nhaTrangPackageOptions
    },
    {
      id: "ninh-thuan",
      label: "Khởi hành từ Ninh Thuận",
      description: "Hiện đã cập nhật giá ghép đoàn cho khách có mặt tại Ninh Thuận.",
      packageOptions: ninhThuanPackageOptions
    }
  ],
  packageOptions: nhaTrangPackageOptions,
  menu: [
    "Mực xào chua ngọt",
    "Cá chim chiên sốt mắm xoài",
    "Tôm ram mặn",
    "Canh chua cá biển",
    "Trứng chiên",
    "Rau muống xào tỏi",
    "Cơm trắng + trà đá",
    "Tráng miệng"
  ],
  inclusions: [
    "Hướng dẫn viên chuyên nghiệp",
    "Xe du lịch đưa đón theo điểm khởi hành đã chọn",
    "Ăn trưa tại nhà hàng theo chương trình",
    "Vé tham quan tại các điểm trong lịch trình",
    "Nước uống",
    "Bảo hiểm du lịch"
  ],
  exclusions: [
    "Chi phí cá nhân ngoài chương trình",
    "Giá tour lễ, Tết hoặc dịp cao điểm",
    "Thuế VAT",
    "Các trò chơi tự túc ngoài lịch trình"
  ],
  prices: {
    adult: 450000,
    child: 315000,
    senior: 450000
  },
  featured: true,
  seo: {
    metaTitle: "Tour Hang Rái - Vĩnh Hy - Vườn Nho - Đồng Cừu | Bảng giá theo đoàn",
    metaDescription:
      "Xem bảng giá tour Hang Rái - Vĩnh Hy - Vườn Nho - Đồng Cừu theo điểm khởi hành Nha Trang hoặc Ninh Thuận, kèm lịch trình và dịch vụ chi tiết."
  }
};
