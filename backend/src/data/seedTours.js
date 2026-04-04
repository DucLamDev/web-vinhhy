export const seedTours = [
  {
    title: "Tour Vĩnh Hy 1 ngày cao cấp",
    slug: "tour-vinh-hy-1-ngay",
    summary: "Hành trình trong ngày khám phá vịnh biển trong xanh, đi tàu đáy kính và thưởng thức hải sản tươi.",
    description:
      "Tour phù hợp cho gia đình và nhóm bạn muốn di chuyển nhẹ nhàng từ Phan Rang hoặc Nha Trang. Lịch trình gồm lên tàu đáy kính ngắm san hô, tắm biển tại Bãi Cóc, check-in cung đường ven biển Vĩnh Hy và thưởng thức bữa trưa hải sản đặc sản.",
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
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        alt: "Toàn cảnh biển Vĩnh Hy"
      },
      {
        url: "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=1200&q=80",
        alt: "Tàu đáy kính tham quan Vĩnh Hy"
      },
      {
        url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
        alt: "Trải nghiệm biển tại Vĩnh Hy"
      }
    ],
    prices: {
      adult: 1290000,
      child: 890000,
      senior: 1090000
    },
    itinerary: [
      {
        time: "07:30",
        title: "Đón khách tại điểm hẹn",
        description: "Xe và hướng dẫn viên đón khách, giới thiệu lịch trình và những điểm nổi bật trong ngày."
      },
      {
        time: "10:00",
        title: "Lên tàu đáy kính ngắm san hô",
        description: "Tham quan vịnh, chiêm ngưỡng hệ sinh thái biển và chụp ảnh tại các góc nhìn đẹp nhất."
      },
      {
        time: "12:00",
        title: "Ăn trưa hải sản",
        description: "Thưởng thức thực đơn hải sản địa phương với các món tươi ngon đặc trưng của Ninh Thuận."
      },
      {
        time: "14:00",
        title: "Tự do tắm biển và check-in",
        description: "Trải nghiệm Bãi Cóc, thư giãn với làn nước trong xanh và lưu lại những bức ảnh đẹp."
      }
    ],
    inclusions: ["Xe đưa đón", "Tàu đáy kính", "Bữa trưa", "Bảo hiểm du lịch", "Hướng dẫn viên"],
    exclusions: ["Chi phí cá nhân", "VAT", "Chi phí ngoài chương trình"],
    featured: true,
    published: true,
    crmTourId: "TVH-01",
    seo: {
      metaTitle: "Tour Vĩnh Hy 1 ngày cao cấp | Đặt tour nhanh",
      metaDescription: "Đặt tour Vĩnh Hy 1 ngày với lịch trình ngắm san hô, tắm biển, ăn trưa hải sản và xe đưa đón trọn gói."
    }
  },
  {
    title: "Tour Vĩnh Hy - Hang Rái - Ninh Chữ",
    slug: "tour-vinh-hy-hang-rai-ninh-chu",
    summary: "Combo du lịch biển kết hợp 3 điểm đẹp nhất Ninh Thuận, lý tưởng cho cặp đôi và gia đình.",
    description:
      "Chuỗi trải nghiệm trọn vẹn trong 2 ngày 1 đêm, check-in Hang Rái lúc bình minh, khám phá Vĩnh Hy bằng tàu và nghỉ dưỡng tại bãi biển Ninh Chữ. Chương trình phù hợp cho khách lẻ, gia đình và nhóm nhỏ yêu thích biển xanh nắng vàng.",
    location: "Vĩnh Hy - Hang Rái - Ninh Chữ",
    duration: "2 ngày 1 đêm",
    tourCode: "VHY02",
    transport: "Xe du lịch",
    pickupPlace: "TP. Hồ Chí Minh / Phan Rang",
    standard: "Cao cấp",
    departureDates: ["2026-04-10", "2026-04-17", "2026-04-24", "2026-05-01"],
    heroImage: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
        alt: "Hang Rái nhìn từ xa"
      },
      {
        url: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1200&q=80",
        alt: "Không gian nghỉ dưỡng gần biển"
      }
    ],
    prices: {
      adult: 2490000,
      child: 1690000,
      senior: 2190000
    },
    itinerary: [
      {
        time: "Ngày 1",
        title: "Hang Rái - Vĩnh Hy",
        description: "Khám phá Hang Rái, đi tàu tham quan Vĩnh Hy, thưởng thức đặc sản địa phương và nghỉ đêm gần biển."
      },
      {
        time: "Ngày 2",
        title: "Ninh Chữ - đặc sản địa phương",
        description: "Tắm biển Ninh Chữ, thư giãn resort và mua quà đặc sản trước khi kết thúc hành trình."
      }
    ],
    inclusions: ["Khách sạn 3 sao", "Ăn sáng và ăn chính", "Tàu tham quan vịnh", "Xe đưa đón"],
    exclusions: ["Đồ uống ngoài chương trình", "Chi phí cá nhân"],
    featured: true,
    published: true,
    crmTourId: "TVH-02",
    seo: {
      metaTitle: "Tour Vĩnh Hy Hang Rái Ninh Chữ 2N1Đ",
      metaDescription: "Lịch trình 2 ngày 1 đêm khám phá Vĩnh Hy, Hang Rái và biển Ninh Chữ với giá tốt và nhiều điểm check-in."
    }
  },
  {
    title: "Tour lặn ngắm san hô Vĩnh Hy",
    slug: "tour-lan-ngam-san-ho-vinh-hy",
    summary: "Trải nghiệm snorkeling tại Vĩnh Hy cho du khách yêu hoạt động ngoài trời và biển đảo.",
    description:
      "Tour tập trung vào trải nghiệm lặn ngắm san hô cùng huấn luyện viên, phù hợp cho nhóm trẻ và gia đình thích khám phá biển. Chương trình bao gồm hướng dẫn an toàn, thiết bị lặn và bữa ăn nhẹ trên tàu.",
    location: "Vĩnh Hy, Ninh Thuận",
    duration: "1 ngày",
    tourCode: "VHY03",
    transport: "Cano cao tốc",
    pickupPlace: "Bến Vĩnh Hy",
    standard: "Trải nghiệm",
    departureDates: ["2026-04-08", "2026-04-15", "2026-04-22", "2026-04-29"],
    heroImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
        alt: "Lặn ngắm san hô tại Vĩnh Hy"
      },
      {
        url: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80",
        alt: "Cano tham quan biển"
      }
    ],
    prices: {
      adult: 1590000,
      child: 1090000,
      senior: 1390000
    },
    itinerary: [
      {
        time: "08:00",
        title: "Nhận thiết bị và hướng dẫn an toàn",
        description: "Hướng dẫn viên phổ biến quy trình lặn ngắm, chia nhóm và hỗ trợ kiểm tra thiết bị."
      },
      {
        time: "10:00",
        title: "Lặn ngắm san hô",
        description: "Trải nghiệm snorkeling tại khu nước trong xanh, quan sát hệ san hô và sinh vật biển."
      },
      {
        time: "13:00",
        title: "Ăn nhẹ và nghỉ ngơi",
        description: "Dùng bữa nhẹ, chụp ảnh trên tàu và thư giãn giữa khung cảnh biển trời Vĩnh Hy."
      }
    ],
    inclusions: ["Hướng dẫn viên", "Trang thiết bị lặn", "Cano", "Ăn nhẹ"],
    exclusions: ["Chụp ảnh flycam", "Xe đưa đón ngoài trung tâm"],
    featured: false,
    published: true,
    crmTourId: "TVH-03",
    seo: {
      metaTitle: "Tour lặn ngắm san hô Vĩnh Hy 1 ngày",
      metaDescription: "Book tour snorkeling Vĩnh Hy với thiết bị đầy đủ, hướng dẫn viên và lịch trình phù hợp cho nhóm bạn trẻ."
    }
  }
];
