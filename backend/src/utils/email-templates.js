const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0
  }).format(value);

const formatDate = (value) =>
  new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

export const bookingConfirmationTemplate = ({ booking, tour }) => {
  const subject = `Xác nhận đặt tour ${tour.title}`;
  const passengerCount = booking.counts.adult + booking.counts.child + booking.counts.infant + booking.counts.senior;
  const packageLine = booking.packageSelection?.label ? `Gói dịch vụ: ${booking.packageSelection.label}` : null;
  const summaryLines = [
    `Tour: ${tour.title}`,
    ...(packageLine ? [packageLine] : []),
    `Ngày đi: ${formatDate(booking.travelDate)}`,
    `Số lượng khách: ${passengerCount}`,
    `Tổng giá trị: ${formatCurrency(booking.pricing.totalPrice)}`
  ];

  return {
    subject,
    text: `Cảm ơn bạn đã đặt tour.\n\n${summaryLines.join("\n")}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #0f172a;">
        <h2 style="margin-bottom: 12px;">Cảm ơn bạn đã đặt tour tại Tour Vĩnh Hy</h2>
        <p>Chúng tôi đã ghi nhận yêu cầu của bạn và sẽ liên hệ sớm để xác nhận chi tiết.</p>
        <div style="border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; background: #f8fafc;">
          <p><strong>Tour:</strong> ${tour.title}</p>
          ${packageLine ? `<p><strong>Gói dịch vụ:</strong> ${booking.packageSelection.label}</p>` : ""}
          <p><strong>Ngày đi:</strong> ${formatDate(booking.travelDate)}</p>
          <p><strong>Số người:</strong> ${passengerCount}</p>
          <p><strong>Tổng tiền:</strong> ${formatCurrency(booking.pricing.totalPrice)}</p>
        </div>
        <p style="margin-top: 16px;">Hotline hỗ trợ: 0900 000 000</p>
      </div>
    `
  };
};
