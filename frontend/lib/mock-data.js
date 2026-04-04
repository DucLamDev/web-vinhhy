export const fallbackTours = [
  {
    title: "Tour Vĩnh Hy 1 ngày cao cấp",
    slug: "tour-vinh-hy-1-ngay",
    summary: "Trọn gói tham quan vịnh, tàu đáy kính, bữa trưa hải sản và những điểm ngắm biển đẹp nhất.",
    description:
      "Lịch trình 1 ngày phù hợp cho gia đình và nhóm bạn muốn tận hưởng cảnh biển trong xanh, di chuyển nhẹ nhàng và có nhiều thời gian chụp ảnh.",
    location: "Vĩnh Hy, Ninh Thuận",
    duration: "1 ngày",
    tourCode: "VHY01",
    transport: "Xe du lịch + tàu đáy kính",
    pickupPlace: "Phan Rang",
    standard: "Tiêu chuẩn",
    departureDates: ["2026-04-06", "2026-04-12", "2026-04-18", "2026-04-25"],
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=1200&q=80",
        alt: "Tàu đáy kính Vĩnh Hy"
      }
    ],
    itinerary: [
      {
        time: "07:30",
        title: "Đón khách và khởi hành",
        description: "Hướng dẫn viên đón khách tại điểm hẹn và bắt đầu hành trình dọc cung đường biển."
      }
    ],
    inclusions: ["Xe đưa đón", "Tàu đáy kính", "Bữa trưa", "Hướng dẫn viên"],
    exclusions: ["Chi phí cá nhân"],
    prices: {
      adult: 1290000,
      child: 890000,
      senior: 1090000
    },
    featured: true,
    seo: {
      metaTitle: "Tour Vĩnh Hy 1 ngày cao cấp",
      metaDescription: "Đặt tour Vĩnh Hy 1 ngày trọn gói với tàu đáy kính, bữa trưa hải sản và lịch trình đẹp."
    }
  },
  {
    title: "Tour Vĩnh Hy - Hang Rái - Ninh Chữ",
    slug: "tour-vinh-hy-hang-rai-ninh-chu",
    summary: "Hành trình 2 ngày 1 đêm kết hợp biển xanh, bình minh Hang Rái và nghỉ dưỡng tại Ninh Chữ.",
    description:
      "Combo phù hợp cho cặp đôi, gia đình và nhóm bạn muốn có chuyến đi cuối tuần nhẹ nhàng nhưng vẫn nhiều điểm dừng chân đẹp.",
    location: "Vĩnh Hy - Hang Rái - Ninh Chữ",
    duration: "2 ngày 1 đêm",
    tourCode: "VHY02",
    transport: "Xe du lịch",
    pickupPlace: "TP. Hồ Chí Minh / Phan Rang",
    standard: "Cao cấp",
    departureDates: ["2026-04-10", "2026-04-17", "2026-04-24", "2026-05-01"],
    heroImage: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [],
    itinerary: [],
    inclusions: ["Khách sạn", "Ăn sáng", "Xe đưa đón"],
    exclusions: ["Đồ uống ngoài chương trình"],
    prices: {
      adult: 2490000,
      child: 1690000,
      senior: 2190000
    },
    featured: true,
    seo: {
      metaTitle: "Tour Vĩnh Hy - Hang Rái - Ninh Chữ",
      metaDescription: "Lịch trình 2 ngày 1 đêm khám phá Vĩnh Hy, Hang Rái và biển Ninh Chữ với nhiều điểm check-in đẹp."
    }
  },
  {
    title: "Tour lặn ngắm san hô Vĩnh Hy",
    slug: "tour-lan-ngam-san-ho-vinh-hy",
    summary: "Trải nghiệm snorkeling cho du khách yêu biển, thích vận động và săn ảnh đẹp dưới nắng.",
    description:
      "Tour tập trung vào hoạt động ngoài trời, có hướng dẫn viên, thiết bị đầy đủ và các điểm dừng ngắm cảnh trên mặt nước.",
    location: "Vĩnh Hy, Ninh Thuận",
    duration: "1 ngày",
    tourCode: "VHY03",
    transport: "Cano cao tốc",
    pickupPlace: "Bến Vĩnh Hy",
    standard: "Trải nghiệm",
    departureDates: ["2026-04-08", "2026-04-15", "2026-04-22", "2026-04-29"],
    heroImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [],
    itinerary: [],
    inclusions: ["Thiết bị lặn", "Hướng dẫn viên", "Ăn nhẹ"],
    exclusions: ["Xe đưa đón ngoài trung tâm"],
    prices: {
      adult: 1590000,
      child: 1090000,
      senior: 1390000
    },
    featured: false,
    seo: {
      metaTitle: "Tour lặn ngắm san hô Vĩnh Hy",
      metaDescription: "Book snorkeling tour Vĩnh Hy với thiết bị đầy đủ, lịch trình đẹp và phù hợp cho nhóm bạn trẻ."
    }
  }
];

export const fallbackPosts = [
  {
    id: 1,
    slug: "kinh-nghiem-du-lich-vinh-hy",
    title: "Kinh nghiệm du lịch Vĩnh Hy tự túc cho người mới",
    excerpt: "Tổng hợp lịch trình, thời điểm đẹp, chi phí và mẹo săn ảnh khi đi Vĩnh Hy lần đầu.",
    content:
      "<p>Vĩnh Hy là một trong những vịnh biển đẹp nhất Việt Nam với nước trong, bãi đá lạ mắt và nhiều hoạt động ngoài trời. Nếu đây là lần đầu bạn đến Ninh Thuận, hãy ưu tiên lịch trình nhẹ để có nhiều thời gian tận hưởng cảnh biển và chụp ảnh.</p>",
    date: "2026-03-20T00:00:00.000Z",
    featuredImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 2,
    slug: "an-gi-o-vinh-hy",
    title: "Ăn gì ở Vĩnh Hy? 8 món hải sản nên thử",
    excerpt: "Gợi ý những món ngon đậm vị biển, hợp cho gia đình, cặp đôi và nhóm bạn.",
    content:
      "<p>Hải sản tươi, cừu nướng và đặc sản Ninh Thuận là lý do nhiều du khách quay lại Vĩnh Hy. Hãy dành ít nhất một bữa trưa hải sản ngay sát biển để cảm nhận trọn vẹn không khí nơi đây.</p>",
    date: "2026-03-18T00:00:00.000Z",
    featuredImage: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 3,
    slug: "lich-trinh-2-ngay-1-dem-vinh-hy",
    title: "Gợi ý lịch trình 2 ngày 1 đêm Vĩnh Hy - Hang Rái",
    excerpt: "Kế hoạch cụ thể cho chuyến đi cuối tuần ngắn ngày, tối ưu di chuyển và thời gian ngắm cảnh.",
    content:
      "<p>Nếu bạn chỉ có 2 ngày 1 đêm, hành trình Vĩnh Hy - Hang Rái - Ninh Chữ là lựa chọn cân bằng giữa nghỉ dưỡng và trải nghiệm. Buổi sáng nên dành cho Hang Rái, buổi chiều thảnh thơi ở vịnh và tối nghỉ gần biển.</p>",
    date: "2026-03-15T00:00:00.000Z",
    featuredImage: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80"
  }
];

export const testimonials = [
  {
    name: "Lan Anh",
    role: "Khách gia đình",
    quote: "Lịch trình vừa phải, chụp được rất nhiều ảnh đẹp và các bạn hỗ trợ booking rất nhanh.",
    avatar: "LA"
  },
  {
    name: "Minh Trí",
    role: "Nhóm bạn",
    quote: "Giao diện dễ dùng trên điện thoại, xem tour rõ ràng và đặt chỗ chỉ mất vài phút.",
    avatar: "MT"
  },
  {
    name: "Bảo Châu",
    role: "Cặp đôi",
    quote: "Banner đẹp, ảnh nhiều và phần chi tiết tour trình bày rất dễ theo dõi trước khi đặt.",
    avatar: "BC"
  }
];

export const advantages = [
  {
    title: "Lịch trình vừa đủ",
    description: "Ưu tiên những điểm đẹp nhất của Vĩnh Hy để chuyến đi thoải mái và không quá dồn dập."
  },
  {
    title: "Giá rõ ràng",
    description: "Giá người lớn, trẻ em và người cao tuổi được hiển thị minh bạch ngay trên từng tour."
  },
  {
    title: "Hỗ trợ nhanh",
    description: "Dễ đặt tour trên điện thoại, có email xác nhận và đội ngũ phản hồi sớm khi cần tư vấn."
  }
];

export const heroSlides = [
  {
    eyebrow: "Vịnh biển đẹp bậc nhất Ninh Thuận",
    title: "Đặt tour Vĩnh Hy — hành trình trong trẻo.",
    description:
      "Tàu đáy kính, bãi đá ven biển và bữa trưa hải sản sát mép nước — gọn gàng trong một chuyến đi.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
    stat: "Biển xanh quanh năm",
    imagePosition: "center center"
  },
  {
    eyebrow: "Cung đường đẹp của Ninh Thuận",
    title: "Vĩnh Hy · Hang Rái · Ninh Chữ.",
    description:
      "Lịch trình nhẹ nhàng cho gia đình, cặp đôi và nhóm bạn — vừa nghỉ dưỡng vừa check-in.",
    image: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&w=1600&q=80",
    stat: "Lịch khởi hành mỗi tuần",
    imagePosition: "center 48%"
  },
  {
    eyebrow: "Làn nước trong veo",
    title: "Lặn ngắm san hô tại Vĩnh Hy.",
    description:
      "Dành cho ai yêu biển xanh, thích vận động nhẹ và muốn nhiều khung hình đẹp.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80",
    stat: "Nhiều tour 1 ngày và 2N1Đ",
    imagePosition: "center 48%"
  }
];

export const visualSections = [
  {
    title: "Bình minh ở Hang Rái",
    description: "Khoảnh khắc mặt trời lên trên bãi đá là điểm nhấn được nhiều du khách mong chờ nhất.",
    image: "https://images.unsplash.com/photo-1468413253725-0d5181091126?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Bữa trưa hải sản sát biển",
    description: "Hải sản tươi và không khí làng chài tạo nên cảm giác rất riêng cho chuyến đi Vĩnh Hy.",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Những bãi đá và làn nước xanh",
    description: "Càng đi sâu vào cung đường ven biển, cảnh sắc càng mở ra theo cách rất điện ảnh.",
    image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1200&q=80"
  }
];

export const journeyMoments = [
  {
    title: "Cảnh sắc dễ chạm tới",
    description: "Chỉ cần một chuyến đi ngắn là bạn đã có thể chạm vào vẻ đẹp hoang sơ của vịnh biển.",
    image: "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Điểm dừng chân thư thái",
    description: "Những khoảng nghỉ ven biển được bố trí để chuyến đi nhẹ nhàng hơn, đặc biệt với gia đình có trẻ nhỏ.",
    image: "https://images.unsplash.com/photo-1520454974749-611b7248ffdb?auto=format&fit=crop&w=1200&q=80"
  }
];
