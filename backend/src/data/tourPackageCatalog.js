export const tourPackageCatalog = {
  "tour-vinh-hy-1-ngay": [
    {
      id: "tour-ghep-doan-tron-goi",
      label: "Tour ghép đoàn trọn gói",
      guestLabel: "Đi lẻ hoặc nhóm nhỏ",
      adultPrice: 750000,
      childPrice: 525000,
      infantPrice: 0,
      seniorPrice: 750000
    },
    {
      id: "tour-di-rieng-4-6-khach",
      label: "Tour đi riêng 4 - 6 khách",
      guestLabel: "Đoàn riêng 4 đến 6 khách",
      adultPrice: 1490000,
      childPrice: 1050000,
      infantPrice: 0,
      seniorPrice: 1490000
    },
    {
      id: "tour-di-rieng-7-9-khach",
      label: "Tour đi riêng 7 - 9 khách",
      guestLabel: "Đoàn riêng 7 đến 9 khách",
      adultPrice: 1290000,
      childPrice: 903000,
      infantPrice: 0,
      seniorPrice: 1290000
    },
    {
      id: "tour-di-rieng-10-14-khach",
      label: "Tour đi riêng 10 - 14 khách",
      guestLabel: "Đoàn riêng 10 đến 14 khách",
      adultPrice: 1100000,
      childPrice: 770000,
      infantPrice: 0,
      seniorPrice: 1100000
    },
    {
      id: "tour-di-rieng-tu-15-khach",
      label: "Tour đi riêng 15 khách trở lên",
      guestLabel: "Đoàn từ 15 khách trở lên",
      adultPrice: 1000000,
      childPrice: 700000,
      infantPrice: 0,
      seniorPrice: 1000000
    }
  ]
};

export const getTourPackageOption = (tourSlug, packageOptionId) => {
  const packageOptions = tourPackageCatalog[tourSlug] || [];
  return packageOptions.find((item) => item.id === packageOptionId) || null;
};
