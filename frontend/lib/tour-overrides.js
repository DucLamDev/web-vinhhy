import { hangRaiTourOverride } from "./tour-hang-rai-data.js";

const VINH_HY_ONE_DAY_SLUG = "tour-vinh-hy-1-ngay";

const vinhHyOneDayPackageOptions = [
  {
    id: "tour-ghep-doan-tron-goi",
    label: "Tour ghép đoàn trọn gói",
    shortLabel: "Ghép đoàn",
    guestLabel: "Đi lẻ hoặc nhóm nhỏ",
    minTravelers: 1,
    maxTravelers: 3,
    recommendedCount: 1,
    adultPrice: 750000,
    childPrice: 525000,
    infantPrice: 0,
    note: "Phù hợp cho khách đi lẻ hoặc gia đình nhỏ, trọn gói các dịch vụ cơ bản."
  },
  {
    id: "tour-di-rieng-4-6-khach",
    label: "Tour đi riêng 4 - 6 khách",
    shortLabel: "Đi riêng 4 - 6",
    guestLabel: "Đoàn riêng 4 đến 6 khách",
    minTravelers: 4,
    maxTravelers: 6,
    recommendedCount: 4,
    adultPrice: 1490000,
    childPrice: 1050000,
    infantPrice: 0,
    note: "Không gian riêng tư, phù hợp gia đình và nhóm bạn muốn chủ động thời gian."
  },
  {
    id: "tour-di-rieng-7-9-khach",
    label: "Tour đi riêng 7 - 9 khách",
    shortLabel: "Đi riêng 7 - 9",
    guestLabel: "Đoàn riêng 7 đến 9 khách",
    minTravelers: 7,
    maxTravelers: 9,
    recommendedCount: 7,
    adultPrice: 1290000,
    childPrice: 903000,
    infantPrice: 0,
    note: "Mức giá tối ưu cho nhóm đông vừa phải, vẫn giữ trải nghiệm đi riêng thoải mái."
  },
  {
    id: "tour-di-rieng-10-14-khach",
    label: "Tour đi riêng 10 - 14 khách",
    shortLabel: "Đi riêng 10 - 14",
    guestLabel: "Đoàn riêng 10 đến 14 khách",
    minTravelers: 10,
    maxTravelers: 14,
    recommendedCount: 10,
    adultPrice: 1100000,
    childPrice: 770000,
    infantPrice: 0,
    note: "Lý tưởng cho đoàn công ty hoặc đại gia đình cần lịch trình riêng nhưng vẫn tiết kiệm."
  },
  {
    id: "tour-di-rieng-tu-15-khach",
    label: "Tour đi riêng 15 khách trở lên",
    shortLabel: "Đi riêng 15+",
    guestLabel: "Đoàn từ 15 khách trở lên",
    minTravelers: 15,
    maxTravelers: null,
    recommendedCount: 15,
    adultPrice: 1000000,
    childPrice: 700000,
    infantPrice: 0,
    note: "Mức giá tốt nhất cho đoàn đông, thích hợp team building, trường học hoặc sự kiện riêng."
  }
];

const vinhHyOneDayGallery = [
  {
    url: "/tour-vinhhy-1ngay/tour-vinh-hy-letfly-_10_-1024x768.webp",
    alt: "Tàu đáy kính tham quan vịnh Vĩnh Hy"
  },
  {
    url: "/tour-vinhhy-1ngay/tour-vinh-hy-letfly-_3_.webp",
    alt: "Bãi biển Hòn Rùa Vĩnh Hy"
  },
  {
    url: "/tour-vinhhy-1ngay/hon-rua-ninh-thuan.webp",
    alt: "Khung cảnh Hòn Rùa Ninh Thuận nhìn từ trên cao"
  },
  {
    url: "/tour-vinhhy-1ngay/tour-vinh-hy-letfly-_8_.webp",
    alt: "Cảnh biển tại khu vực Mũi Cá Heo"
  },
  {
    url: "/tour-vinhhy-1ngay/tour-vinh-hy-letfly-_2_-768x1024.webp",
    alt: "Du khách bơi lội tại vùng nước xanh trong của Vĩnh Hy"
  },
  {
    url: "/tour-vinhhy-1ngay/tour-vinh-hy-letfly-_4_-1024x768.webp",
    alt: "Vách đá và bãi biển xanh của Vĩnh Hy"
  }
];

const vinhHyOneDayItinerary = [
  {
    time: "Buổi sáng",
    title: "Đón khách & đến cảng Vĩnh Hy",
    description:
      "Xe đón tại khách sạn, di chuyển dọc cung đường biển đẹp nhất Việt Nam, check-in ngắm vịnh Cam Ranh từ trên cao. Đến cảng Vĩnh Hy, lên tàu đáy kính khám phá đại dương.",
    image: "/tour-vinhhy-1ngay/tour-vinh-hy-letfly-_10_-1024x768.webp",
    imageAlt: "Khách du lịch trên tàu đáy kính tại Vĩnh Hy"
  },
  {
    time: "Điểm dừng 1",
    title: "Check-in Mũi Cá Heo",
    description:
      "Ghé Mũi Cá Heo — ghềnh đá tự nhiên vươn ra biển rất đặc trưng. Điểm chụp ảnh ấn tượng giữa thiên nhiên kỳ vĩ của Vĩnh Hy.",
    image: "/tour-vinhhy-1ngay/tour-vinh-hy-letfly-_8_.webp",
    imageAlt: "Cảnh biển tại Mũi Cá Heo"
  },
  {
    time: "Điểm dừng 2",
    title: "Tắm biển & lặn ngắm san hô Hòn Rùa",
    description:
      "Hòn Rùa — bãi biển hoang sơ, nước trong xanh. Tắm biển, lặn ngắm san hô, thư giãn và check-in với nhiều góc ảnh đẹp.",
    image: "/tour-vinhhy-1ngay/tour-vinh-hy-letfly-_3_.webp",
    imageAlt: "Bãi biển Hòn Rùa Vĩnh Hy"
  },
  {
    time: "Buổi trưa",
    title: "Thưởng thức hải sản tại đảo & trở về điểm đón ban đầu",
    description:
      "Thưởng thức bữa trưa hải sản tươi ngon đậm vị biển cả. Sau bữa trưa, xe đưa đoàn trở về điểm đón ban đầu.",
    image: "/tour-vinhhy-1ngay/hon-rua-ninh-thuan.webp",
    imageAlt: "Khung cảnh biển xanh tại Vĩnh Hy"
  }
];

const VINH_HY_2N2D_SLUG = "tour-vinh-hy-ninh-chu-2-ngay-2-dem";
const CAU_MUC_DEM_SLUG = "tour-cau-muc-dem-vinh-vinh-hy";

const vinhHy2N2DPackageOptions = [
  {
    id: "khach-san-2-sao",
    label: "Khách sạn 2 sao",
    shortLabel: "KS 2 Sao",
    guestLabel: "Ngủ phòng 2k/phòng",
    minTravelers: 1,
    maxTravelers: 100,
    recommendedCount: 1,
    adultPrice: 1690000,
    childPrice: 1267500,
    infantPrice: 0,
    note: "Khách sạn 2 sao trung tâm, gần chợ, đầy đủ tiện nghi."
  }
];

const cauMucDemPackageOptions = [
  {
    id: "tour-ghep-doan",
    label: "Tour ghép đoàn trọn gói",
    shortLabel: "Ghép đoàn",
    guestLabel: "Đi lẻ hoặc nhóm nhỏ",
    minTravelers: 1,
    maxTravelers: 100,
    recommendedCount: 1,
    adultPrice: 350000,
    childPrice: 245000,
    infantPrice: 0,
    note: "Trải nghiệm câu mực nháy cùng ngư dân bản địa."
  }
];

export const tourOverrides = {
  [hangRaiTourOverride.slug]: hangRaiTourOverride,
  [VINH_HY_ONE_DAY_SLUG]: {
    title: "Tour Vĩnh Hy 1 ngày",
    slug: VINH_HY_ONE_DAY_SLUG,
    summary:
      "Khám phá trọn vẹn Vĩnh Hy trong 1 ngày với tàu đáy kính, check-in Mũi Cá Heo, tắm biển - lặn ngắm san hô ở Hòn Rùa và bữa trưa hải sản chất lượng.",
    description:
      "Chương trình được thiết kế linh hoạt cho khách đi lẻ, gia đình, nhóm bạn hoặc đoàn riêng. Bạn có thể chọn tour ghép trọn gói hoặc các gói đi riêng theo quy mô đoàn để tối ưu trải nghiệm, thời gian và ngân sách. Toàn bộ hành trình tập trung vào những điểm nổi bật nhất của Vĩnh Hy, kết hợp giữa tham quan cảnh đẹp, hoạt động biển và bữa trưa hải sản tươi ngon.",
    location: "Vĩnh Hy, Ninh Thuận",
    duration: "1 ngày",
    transport: "Xe du lịch + tàu đáy kính",
    pickupPlace: "Khách sạn / điểm hẹn tại Phan Rang",
    standard: "Tour linh hoạt theo nhóm",
    heroImage: "/tour-vinhhy-1ngay/tour-vinh-hy-letfly-_10_-1024x768.webp",
    galleryImages: vinhHyOneDayGallery,
    itinerary: vinhHyOneDayItinerary,
    trustBadges: ["Hoàn hủy miễn phí trong 24h", "Xác nhận tức thời"],
    heroStats: [
      { value: "5", label: "gói giá linh hoạt" },
      { value: "4", label: "chặng trải nghiệm nổi bật" },
      { value: "8", label: "món trong thực đơn" }
    ],
    featureHighlights: [
      {
        title: "Linh hoạt theo số lượng khách",
        description: "Có đủ gói ghép đoàn và đi riêng để tối ưu giá cho từng quy mô đoàn."
      },
      {
        title: "Lịch trình đẹp, không dồn dập",
        description: "Tập trung vào cung đường biển, Mũi Cá Heo, Hòn Rùa và khoảng nghỉ hợp lý."
      },
      {
        title: "Dịch vụ trọn gói rõ ràng",
        description: "Giá minh bạch theo từng option, thực đơn và các hạng mục bao gồm được trình bày rõ."
      }
    ],
    tripFacts: [
      "Khởi hành trong ngày, phù hợp gia đình và nhóm bạn",
      "Bao gồm tàu đáy kính, xe đưa đón, ăn trưa và bảo hiểm",
      "Em bé dưới 1m miễn phí",
      "Có thể chọn đoàn ghép hoặc đi riêng theo số lượng khách"
    ],
    travelerTypes: [
      { key: "adult", label: "Người lớn", hint: "(> 1m3)" },
      { key: "child", label: "Trẻ em", hint: "(1m - 1m3)" },
      { key: "infant", label: "Em bé", hint: "(< 1m)" }
    ],
    packageOptions: vinhHyOneDayPackageOptions,
    menu: [
      "Mực xào chua ngọt",
      "Cá chim chiên xoài bằm",
      "Tôm ram mặn",
      "Canh chua cá biển",
      "Trứng chiên",
      "Rau muống xào tỏi",
      "Cơm trắng + trà đá",
      "Tráng miệng"
    ],
    inclusions: [
      "Hướng dẫn viên chuyên nghiệp cho gói đi riêng",
      "Xe du lịch đưa đón cho gói đi riêng",
      "Tàu đáy kính tham quan theo chương trình",
      "Ăn trưa chất lượng",
      "Vé tham quan",
      "Nước uống",
      "Bảo hiểm"
    ],
    exclusions: [
      "Chi phí ngoài chương trình",
      "Phụ thu lễ, Tết",
      "Các trò chơi dưới nước như Jet-ski, dù lượn",
      "Phòng tắm",
      "Phí thuê đồ tắm"
    ],
    prices: {
      adult: 750000,
      child: 525000,
      senior: 750000
    },
    featured: true,
    seo: {
      metaTitle: "Tour Vĩnh Hy 1 ngày | Bảng giá theo từng option và lịch trình chi tiết",
      metaDescription:
        "Xem bảng giá chuẩn cho tour Vĩnh Hy 1 ngày theo từng option ghép đoàn hoặc đi riêng, kèm lịch trình chi tiết, dịch vụ bao gồm và hình ảnh thực tế."
    }
  },
  [VINH_HY_2N2D_SLUG]: {
    title: "Tour Vĩnh Hy – Ninh Chữ 2 Ngày 2 Đêm",
    slug: VINH_HY_2N2D_SLUG,
    summary: "Hành trình trọn vẹn khám phá Vĩnh Hy, Hang Rái, Vườn Nho và bãi biển Ninh Chữ thơ mộng.",
    description: "Khám phá Vịnh Vĩnh Hy tuyệt đẹp, check-in Hang Rái, tham quan Vườn nho Ninh Thuận và nghỉ dưỡng tại biển Ninh Chữ trong lịch trình 2 ngày 2 đêm thư giãn tuyệt đối.",
    location: "Vĩnh Hy - Hang Rái - Ninh Chữ",
    duration: "2 ngày 2 đêm",
    transport: "Xe du lịch ghép khách",
    pickupPlace: "Ninh Thuận / Nha Trang",
    standard: "Cao cấp",
    heroImage: "/tour-vinh-hy-ninh-chu-2-ngay-2-dem/vinh-hy-ninh-thuan-2.webp",
    galleryImages: [
      { url: "/tour-vinh-hy-ninh-chu-2-ngay-2-dem/vinh-hy-ninh-thuan-3.webp", alt: "Cảnh quan Vịnh Vĩnh Hy tuyệt đẹp" },
      { url: "/tour-vinh-hy-ninh-chu-2-ngay-2-dem/hang-rai-ninh-thuan-2.webp", alt: "Bãi đá san hô cổ Hang Rái" },
      { url: "/tour-vinh-hy-ninh-chu-2-ngay-2-dem/ninh-chu-ninh-thuan.webp", alt: "Biển Ninh Chữ xanh mát" },
      { url: "/tour-vinh-hy-ninh-chu-2-ngay-2-dem/vuon-nho-ninh-thuan-2-1.webp", alt: "Check in Vườn Nho Ninh Thuận" },
      { url: "/tour-vinh-hy-ninh-chu-2-ngay-2-dem/trung-son-co-tu-ninh-thuan-2-scaled.webp", alt: "Trùng Sơn Cổ Tự" }
    ],
    itinerary: [
      {
        time: "Đêm 1",
        title: "Đón khách",
        description: "20h00: Đón khách tại điểm đã hẹn",
        image: "/tour-vinh-hy-ninh-chu-2-ngay-2-dem/vinh-hy-ninh-thuan-3.webp"
      },
      {
        time: "Ngày 1 - Sáng",
        title: "Đến Vĩnh Hy & Vui chơi biển",
        description: "06h00: Đoàn đến Vĩnh Hy để ăn sáng và vệ sinh cá nhân. 07h00: Tham quan Vịnh Vĩnh Hy, ngắm san hô trên thuyền đáy kính - Tắm biển bãi Cóc, chơi phao chuối - moto - Ăn hải sản. 11h00: Về lại đất liền - Ăn trưa - Nhận phòng và nghỉ ngơi.",
        image: "/tour-vinh-hy-ninh-chu-2-ngay-2-dem/vinh-hy-ninh-thuan-2.webp"
      },
      {
        time: "Ngày 1 - Chiều",
        title: "Hang Rái & Vườn Nho",
        description: "13h00: Tham quan Hang Rái, check-in Bãi đá san hô cổ. 14h30: Thưởng thức nho, rượu nho... tại Vườn nho Ninh Thuận. 16h00: Về khách sạn nghỉ ngơi, tắm biển. 19h00: Ăn tối. Tối đi dạo hoặc thưởng thức đặc sản Phan Rang.",
        image: "/tour-vinh-hy-ninh-chu-2-ngay-2-dem/hang-rai-ninh-thuan-2.webp"
      },
      {
        time: "Ngày 2",
        title: "Trùng Sơn Cổ Tự & Trở về",
        description: "07h00: Ăn sáng và làm thủ tục trả phòng. 08h00: Ghé thăm chùa Trùng Sơn Cổ Tự tại hòn núi Đá Chồng. 10h30: Lên xe về lại TP.HCM.",
        image: "/tour-vinh-hy-ninh-chu-2-ngay-2-dem/trung-son-co-tu-ninh-thuan-2-scaled.webp"
      }
    ],
    trustBadges: ["Hoàn hủy miễn phí trong 24h", "Xác nhận tức thời", "Hỗ trợ 24/7"],
    heroStats: [
      { value: "5+", label: "điểm đến hot" },
      { value: "3", label: "bữa ăn chính chất lượng" },
      { value: "2N2Đ", label: "thời gian lý tưởng" }
    ],
    featureHighlights: [
      {
        title: "Làm chủ lịch trình",
        description: "Tuyệt đối không chạy show, dành thời gian vừa đủ ở các điểm để bạn tự do sáng tạo những bức ảnh riêng."
      },
      {
        title: "Dịch vụ chuẩn 2-4 Sao",
        description: "Nghỉ ngơi tại khách sạn trung tâm gần biển, phòng ốc và dịch vụ được kiểm duyệt kỹ càng."
      }
    ],
    tripFacts: [
      "Miễn phí cho trẻ em dưới 2 tuổi",
      "Khách sạn sát biển Ninh Chữ và khu trung tâm",
      "Đầy đủ bảo hiểm du lịch theo quy định"
    ],
    travelerTypes: [
      { key: "adult", label: "Người lớn", hint: "(> 11 tuổi)" },
      { key: "child", label: "Trẻ em", hint: "(2 - 11 tuổi)" },
      { key: "infant", label: "Em bé", hint: "(< 2 tuổi)" }
    ],
    packageOptions: vinhHy2N2DPackageOptions,
    menu: [],
    inclusions: [
      "Xe đưa đón tại sân bay, nhà ga, bến xe tham quan theo chương trình",
      "Khách sạn 02 sao: Ngay trung tâm gần biển, gần chợ (ngủ ghép nếu có khách lẻ)",
      "Bữa ăn: 02 Bữa điểm tâm sáng theo tiêu chuẩn khách sạn",
      "Bữa ăn: 03 Bữa ăn chính thực đơn",
      "Vé tham quan: Tại các điểm theo chương trình",
      "HDV Tiếng Việt suốt tuyến phục vụ nhiệt tình chu đáo",
      "Nước suối",
      "Bảo hiểm: Theo quy định của BH"
    ],
    exclusions: [
      "Vé máy bay - Vé tàu lửa",
      "Thuế VAT",
      "Tiền Tip cho HDV và tài xế địa phương",
      "Các trò chơi NGOÀI chương trình, các điểm tham quan NGOÀI chương trình.",
      "Chi phí cá nhân, điện thoại, giặt ủi, nước uống tại khách sạn..."
    ],
    prices: { adult: 1690000, child: 1267500, senior: 1690000 },
    seo: {
      metaTitle: "Tour Vĩnh Hy Ninh Chữ 2 Ngày 2 Đêm",
      metaDescription: "Khám phá Vĩnh Hy và Hang Rái 2 ngày 2 đêm trọn gói, lịch trình linh hoạt, khách sạn trung tâm cao cấp."
    }
  },
  [CAU_MUC_DEM_SLUG]: {
    title: "Tour câu mực đêm Vĩnh Hy",
    slug: CAU_MUC_DEM_SLUG,
    summary: "Trải nghiệm làm ngư dân câu mực thực thụ trên biển Vĩnh Hy về đêm và thưởng thức những chiến lợi phẩm tươi rói ngay trên tàu.",
    description: "Tọa lạc tại huyện Ninh Hải, tỉnh Ninh Thuận. Vĩnh Hy được ví như “viên ngọc ẩn” giữa miền Trung đầy nắng và gió. Không xô bồ, không ồn ào... Trải nghiệm chuyến tàu chở hoàng hôn làm điểm khởi đầu cho đêm biển kỳ diệu, tự tay câu những chú mực nháy bơi lội ngay dưới mạn thuyền.",
    location: "Vĩnh Hy, Ninh Thuận",
    duration: "Chiều - Tối",
    transport: "Tàu du lịch",
    pickupPlace: "Bến Vịnh Vĩnh Hy",
    standard: "Trải nghiệm đặc biệt",
    heroImage: "/tour-cau-muc-dem-vinh-vinh-hy/tour-cau-muc-dem-vinh-vinh-hy-4.webp",
    galleryImages: [
      { url: "/tour-cau-muc-dem-vinh-vinh-hy/tour-cau-muc-dem-vinh-vinh-hy.webp", alt: "Trải nghiệm câu mực bằng tàu" },
      { url: "/tour-cau-muc-dem-vinh-vinh-hy/tour-cau-muc-dem-vinh-vinh-hy-3-e1743394138536.webp", alt: "Du khách tự tay câu mực" },
      { url: "/tour-cau-muc-dem-vinh-vinh-hy/tour-cau-muc-dem-vinh-vinh-hy-5.webp", alt: "Tận hưởng không khí êm đềm" },
      { url: "/tour-cau-muc-dem-vinh-vinh-hy/tour-cau-muc-dem-vinh-vinh-hy-11.webp", alt: "Tàu câu mực đêm" },
      { url: "/tour-cau-muc-dem-vinh-vinh-hy/tour-cau-muc-dem-vinh-vinh-hy-11.webp", alt: "Tàu câu mực đêm" },
      { url: "/tour-cau-muc-dem-vinh-vinh-hy/tour-cau-muc-dem-vinh-vinh-hy-11.webp", alt: "Tàu câu mực đêm" }
    ],
    itinerary: [],
    trustBadges: ["Xác nhận tức thời", "Hỗ trợ 24/7"],
    heroStats: [
      { value: "100%", label: "cảm giác phấn khích" },
      { value: "4", label: "giờ lênh đênh mặt biển" }
    ],
    featureHighlights: [
      { title: "Trải nghiệm câu mực đích thực", description: "Cùng ngư dân chuyên nghiệp thả câu và học các kỹ thuật truyền thống." },
      { title: "BBQ Hải Sản Biển", description: "Ăn ngay những chiến lợi phẩm tươi nháy mà bạn tự tay bắt được." }
    ],
    tripFacts: [
      "Khởi hành vào buổi chiều tà để kịp đón hoàng hôn",
      "Trẻ em dưới 1 mét được miễn phí",
      "Dễ say sóng nên chuẩn bị thuốc chống say"
    ],
    travelerTypes: [
      { key: "adult", label: "Người lớn", hint: "(> 1m3)" },
      { key: "child", label: "Trẻ em", hint: "(1m - 1m3)" },
      { key: "infant", label: "Em bé", hint: "(< 1m)" }
    ],
    packageOptions: cauMucDemPackageOptions,
    menu: [
      "Có thể thay đổi theo mùa",
      "Đảm bảo vệ sinh an toàn thực phẩm",
      "Thực đơn đa dạng với mực câu tươi sống",
      "Chế biến đậm đà, lành hắp dẫn"
    ],
    inclusions: [
      "Hướng dẫn viên chuyên nghiệp",
      "Tàu du lịch",
      "Trang thiết bị (Áo phao, cần câu mực...)",
      "Nước uống",
      "Bảo hiểm"
    ],
    exclusions: [
      "Phương tiện di chuyển đến Vĩnh Hy",
      "Giá tour lễ, tết",
      "Tiệc BBQ tối theo yêu cầu: 200.000/người",
      "Trò chơi ngoài chương trình",
      "Chi phí cá nhân, điện thoại, nước uống tại khách sạn...",
      "Thuế VAT"
    ],
    prices: { adult: 350000, child: 245000, senior: 350000 },
    seo: {
      metaTitle: "Tour Câu Mực Đêm Vĩnh Hy",
      metaDescription: "Trải nghiệm tour câu mực đêm tại Vĩnh Hy, giá chỉ từ 350k/khách. Thỏa thích thư giãn và tự tay bắt mực tươi ngay trên biển."
    }
  }
};

const mergeTour = (tour, override) => ({
  ...tour,
  ...override,
  prices: {
    ...(tour?.prices || {}),
    ...(override?.prices || {})
  },
  seo: {
    ...(tour?.seo || {}),
    ...(override?.seo || {})
  }
});

export const applyTourOverride = (tour) => {
  if (!tour) {
    return null;
  }

  const override = tourOverrides[tour.slug];
  return override ? mergeTour(tour, override) : tour;
};

export const applyTourOverrides = (tours = []) => {
  const seen = new Set();
  const nextTours = tours.map((tour) => {
    seen.add(tour.slug);
    return applyTourOverride(tour);
  });

  Object.entries(tourOverrides).forEach(([slug, override]) => {
    if (!seen.has(slug)) {
      nextTours.unshift(override);
    }
  });

  return nextTours;
};

export const getTourOverrideBySlug = (slug) => tourOverrides[slug] || null;
