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
  },
  {
    url: "/tour-vinhhy-1ngay/tour-vinh-hy-letfly-_7_-740x490.webp",
    alt: "Du khách check-in trên tàu tham quan Vĩnh Hy"
  },
  {
    url: "/tour-vinhhy-1ngay/tour-vinh-hy-letfly-_9_-740x490.webp",
    alt: "Khách tham quan trên tàu đáy kính tại Vĩnh Hy"
  }
];

const vinhHyOneDayItinerary = [
  {
    time: "Buổi sáng",
    title: "Đón khách, nghe thuyết minh và đến cảng Vĩnh Hy",
    description:
      "Xe và hướng dẫn viên đón quý khách tại khách sạn. Trên đường đi, quý khách được nghe giới thiệu về các địa danh nổi tiếng, trải nghiệm một trong những cung đường biển đẹp nhất Việt Nam và check-in ngắm toàn cảnh vịnh Cam Ranh từ trên cao. Đến cảng Vĩnh Hy, đoàn lên tàu đáy kính để bắt đầu hành trình khám phá đại dương.",
    image: "/tour-vinhhy-1ngay/tour-vinh-hy-letfly-_9_-740x490.webp",
    imageAlt: "Khách du lịch trên tàu đáy kính tại Vĩnh Hy"
  },
  {
    time: "Điểm dừng 1",
    title: "Check-in Mũi Cá Heo",
    description:
      "Quý khách ghé Mũi Cá Heo, ghềnh đá tự nhiên có hình dáng vươn ra biển rất đặc trưng. Đây là điểm chụp ảnh ấn tượng giữa thiên nhiên kỳ vĩ và là một trong những khung hình được nhiều du khách yêu thích khi đến Vĩnh Hy.",
    image: "/tour-vinhhy-1ngay/tour-vinh-hy-letfly-_8_.webp",
    imageAlt: "Cảnh biển tại Mũi Cá Heo"
  },
  {
    time: "Điểm dừng 2",
    title: "Tắm biển, lặn ngắm san hô tại Hòn Rùa",
    description:
      "Quý khách tiếp tục di chuyển đến Hòn Rùa, điểm đến nổi bật nhất Vĩnh Hy với bãi biển hoang sơ và làn nước trong xanh. Tại đây, du khách có thể tắm biển, lặn ngắm san hô, thư giãn trên bãi biển và check-in với nhiều góc ảnh đẹp.",
    image: "/tour-vinhhy-1ngay/tour-vinh-hy-letfly-_3_.webp",
    imageAlt: "Bãi biển Hòn Rùa Vĩnh Hy"
  },
  {
    time: "Buổi trưa",
    title: "Thưởng thức hải sản và trở về điểm đón ban đầu",
    description:
      "Quý khách dùng bữa trưa với các món hải sản tươi ngon mang đậm hương vị biển cả và nghỉ ngơi tại chỗ. Sau bữa trưa, xe đưa đoàn trở về điểm đón ban đầu, khép lại hành trình khám phá Vịnh Vĩnh Hy đầy ấn tượng.",
    image: "/tour-vinhhy-1ngay/hon-rua-ninh-thuan.webp",
    imageAlt: "Khung cảnh biển xanh tại Vĩnh Hy"
  }
];

export const tourOverrides = {
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
