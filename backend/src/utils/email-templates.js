const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0
  }).format(value);

const formatDate = (value) =>
  new Date(value).toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

const brandColor = "#0f8ea4";
const coralColor = "#ff7a1a";
const inkColor = "#15304a";

const emailWrapper = (content) => `
<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f0f7fa;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f7fa;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(15,48,74,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,${brandColor} 0%,#0ba5be 100%);padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.02em;">🏖️ Tour Vĩnh Hy</h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px;letter-spacing:0.05em;">BIỂN XANH • CUNG ĐƯỜNG ĐẸP</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:36px 40px 28px;">
            ${content}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:0 40px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e8eef3;padding-top:20px;">
              <tr>
                <td style="color:#94a3b8;font-size:12px;line-height:1.6;">
                  <p style="margin:0;"><strong style="color:${inkColor};">Tour Vĩnh Hy - Let's Fly Travel</strong></p>
                  <p style="margin:4px 0 0;">📞 Hotline: <a href="tel:09167456833" style="color:${brandColor};text-decoration:none;font-weight:600;">0916.745.6833 (Mr. Thuận)</a></p>
                  <p style="margin:4px 0 0;">📧 Email: <a href="mailto:pkdletsflytravel@gmail.com" style="color:${brandColor};text-decoration:none;">pkdletsflytravel@gmail.com</a></p>
                  <p style="margin:12px 0 0;font-size:11px;color:#cbd5e1;">Email được gửi tự động từ hệ thống Tour Vĩnh Hy. Vui lòng không trả lời email này.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

export const bookingConfirmationTemplate = ({ booking, tour }) => {
  const subject = `✅ Xác nhận đặt tour: ${tour.title}`;
  const passengerCount = booking.counts.adult + booking.counts.child + (booking.counts.infant || 0) + (booking.counts.senior || 0);
  const packageLabel = booking.packageSelection?.label || "Mặc định";

  const detailRows = [
    { label: "Tour", value: tour.title, bold: true },
    { label: "Gói dịch vụ", value: packageLabel },
    { label: "Ngày khởi hành", value: formatDate(booking.travelDate) },
    { label: "Người lớn", value: `${booking.counts.adult} × ${formatCurrency(booking.pricing.adultPrice)}` },
    ...(booking.counts.child > 0 ? [{ label: "Trẻ em", value: `${booking.counts.child} × ${formatCurrency(booking.pricing.childPrice)}` }] : []),
    ...(booking.counts.infant > 0 ? [{ label: "Em bé", value: `${booking.counts.infant} × Miễn phí` }] : []),
    { label: "Tổng số khách", value: `${passengerCount} người` },
  ];

  const detailRowsHtml = detailRows.map(row => `
    <tr>
      <td style="padding:10px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #f1f5f9;width:140px;">${row.label}</td>
      <td style="padding:10px 16px;font-size:13px;color:${inkColor};border-bottom:1px solid #f1f5f9;font-weight:${row.bold ? '700' : '500'};">${row.value}</td>
    </tr>
  `).join("");

  const content = `
    <!-- Success badge -->
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;background:#ecfdf5;border:1px solid #bbf7d0;border-radius:50px;padding:8px 20px;">
        <span style="color:#16a34a;font-size:14px;font-weight:600;">✓ Đặt tour thành công!</span>
      </div>
    </div>

    <h2 style="margin:0 0 8px;color:${inkColor};font-size:20px;font-weight:700;">Xin chào ${booking.customer.name},</h2>
    <p style="margin:0 0 24px;color:#64748b;font-size:14px;line-height:1.7;">
      Cảm ơn bạn đã đặt tour tại <strong style="color:${brandColor};">Tour Vĩnh Hy</strong>. Chúng tôi đã ghi nhận đơn đặt tour và sẽ liên hệ xác nhận chi tiết trong thời gian sớm nhất.
    </p>

    <!-- Booking details card -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;margin-bottom:20px;">
      <tr>
        <td style="padding:16px 16px 8px;font-size:12px;font-weight:700;color:${brandColor};text-transform:uppercase;letter-spacing:0.08em;">
          Chi tiết đặt tour
        </td>
      </tr>
      <tr>
        <td style="padding:0 0 8px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${detailRowsHtml}
          </table>
        </td>
      </tr>
    </table>

    <!-- Total price highlight -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,${coralColor} 0%,#ff9f4a 100%);border-radius:14px;margin-bottom:24px;">
      <tr>
        <td style="padding:18px 24px;">
          <table width="100%">
            <tr>
              <td style="color:rgba(255,255,255,0.9);font-size:14px;font-weight:500;">Tổng thanh toán</td>
              <td style="text-align:right;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.02em;">${formatCurrency(booking.pricing.totalPrice)}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Info box -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border-radius:12px;border:1px solid #bfdbfe;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0;font-size:13px;color:#1e40af;line-height:1.6;">
            💡 <strong>Lưu ý:</strong> Nhân viên tư vấn sẽ liên hệ với bạn qua số điện thoại <strong>${booking.customer.phone}</strong> để xác nhận và hướng dẫn thanh toán. Vui lòng giữ điện thoại để được hỗ trợ nhanh nhất.
          </p>
        </td>
      </tr>
    </table>
  `;

  const text = `Xin chào ${booking.customer.name},\n\nCảm ơn bạn đã đặt tour tại Tour Vĩnh Hy.\n\nTour: ${tour.title}\nGói: ${packageLabel}\nNgày đi: ${formatDate(booking.travelDate)}\nSố khách: ${passengerCount}\nTổng tiền: ${formatCurrency(booking.pricing.totalPrice)}\n\nChúng tôi sẽ liên hệ sớm để xác nhận.\nHotline: 0916.745.6833 (Mr. Thuận)`;

  return {
    subject,
    text,
    html: emailWrapper(content)
  };
};

export const adminBookingNotificationTemplate = ({ booking, tour }) => {
  const subject = `🔔 Booking mới: ${tour.title} - ${booking.customer.name}`;
  const passengerCount = booking.counts.adult + booking.counts.child + (booking.counts.infant || 0) + (booking.counts.senior || 0);
  const packageLabel = booking.packageSelection?.label || "Mặc định";

  const content = `
    <!-- Alert badge -->
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;background:#fef3c7;border:1px solid #fde68a;border-radius:50px;padding:8px 20px;">
        <span style="color:#b45309;font-size:14px;font-weight:600;">🔔 Có booking mới cần xác nhận!</span>
      </div>
    </div>

    <h2 style="margin:0 0 16px;color:${inkColor};font-size:18px;font-weight:700;">Thông tin khách hàng</h2>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;margin-bottom:20px;">
      <tr>
        <td style="padding:12px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #f1f5f9;width:140px;">Họ tên</td>
        <td style="padding:12px 16px;font-size:14px;color:${inkColor};border-bottom:1px solid #f1f5f9;font-weight:700;">${booking.customer.name}</td>
      </tr>
      <tr>
        <td style="padding:12px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #f1f5f9;">Điện thoại</td>
        <td style="padding:12px 16px;font-size:14px;color:${inkColor};border-bottom:1px solid #f1f5f9;"><a href="tel:${booking.customer.phone}" style="color:${brandColor};font-weight:600;">${booking.customer.phone}</a></td>
      </tr>
      <tr>
        <td style="padding:12px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #f1f5f9;">Email</td>
        <td style="padding:12px 16px;font-size:14px;color:${inkColor};border-bottom:1px solid #f1f5f9;">${booking.customer.email}</td>
      </tr>
      <tr>
        <td style="padding:12px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #f1f5f9;">Địa chỉ</td>
        <td style="padding:12px 16px;font-size:14px;color:${inkColor};border-bottom:1px solid #f1f5f9;">${booking.customer.address || "Chưa cung cấp"}</td>
      </tr>
      ${booking.notes ? `<tr>
        <td style="padding:12px 16px;font-size:13px;color:#64748b;">Ghi chú</td>
        <td style="padding:12px 16px;font-size:14px;color:${inkColor};font-style:italic;">${booking.notes}</td>
      </tr>` : ""}
    </table>

    <h2 style="margin:0 0 16px;color:${inkColor};font-size:18px;font-weight:700;">Chi tiết tour</h2>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;margin-bottom:20px;">
      <tr>
        <td style="padding:12px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #f1f5f9;width:140px;">Tour</td>
        <td style="padding:12px 16px;font-size:14px;color:${inkColor};border-bottom:1px solid #f1f5f9;font-weight:700;">${tour.title}</td>
      </tr>
      <tr>
        <td style="padding:12px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #f1f5f9;">Gói dịch vụ</td>
        <td style="padding:12px 16px;font-size:14px;color:${inkColor};border-bottom:1px solid #f1f5f9;">${packageLabel}</td>
      </tr>
      <tr>
        <td style="padding:12px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #f1f5f9;">Ngày khởi hành</td>
        <td style="padding:12px 16px;font-size:14px;color:${brandColor};border-bottom:1px solid #f1f5f9;font-weight:600;">${formatDate(booking.travelDate)}</td>
      </tr>
      <tr>
        <td style="padding:12px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #f1f5f9;">Số khách</td>
        <td style="padding:12px 16px;font-size:14px;color:${inkColor};border-bottom:1px solid #f1f5f9;">${passengerCount} người (NL: ${booking.counts.adult}, TE: ${booking.counts.child}, EB: ${booking.counts.infant || 0})</td>
      </tr>
    </table>

    <!-- Total price highlight -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,${brandColor} 0%,#0ba5be 100%);border-radius:14px;margin-bottom:20px;">
      <tr>
        <td style="padding:18px 24px;">
          <table width="100%">
            <tr>
              <td style="color:rgba(255,255,255,0.9);font-size:14px;font-weight:500;">Tổng giá trị đơn</td>
              <td style="text-align:right;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.02em;">${formatCurrency(booking.pricing.totalPrice)}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <p style="margin:0;font-size:13px;color:#64748b;text-align:center;">
      Truy cập <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/admin/bookings" style="color:${brandColor};font-weight:600;">Admin Dashboard</a> để xác nhận booking này.
    </p>
  `;

  const text = `BOOKING MỚI\n\nKhách: ${booking.customer.name}\nSĐT: ${booking.customer.phone}\nEmail: ${booking.customer.email}\nTour: ${tour.title}\nGói: ${packageLabel}\nNgày đi: ${formatDate(booking.travelDate)}\nSố khách: ${passengerCount}\nTổng: ${formatCurrency(booking.pricing.totalPrice)}\nGhi chú: ${booking.notes || "Không"}`;

  return {
    subject,
    text,
    html: emailWrapper(content)
  };
};

export const emailVerificationTemplate = ({ name, verificationUrl }) => {
  const subject = "Xác thực email tài khoản Tour Vĩnh Hy";

  const content = `
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;background:#eff6ff;border:1px solid #bfdbfe;border-radius:50px;padding:8px 20px;">
        <span style="color:#1d4ed8;font-size:14px;font-weight:600;">Xác thực email để hoàn tất đăng ký</span>
      </div>
    </div>

    <h2 style="margin:0 0 8px;color:${inkColor};font-size:20px;font-weight:700;">Xin chào ${name || "bạn"},</h2>
    <p style="margin:0 0 20px;color:#64748b;font-size:14px;line-height:1.7;">
      Cảm ơn bạn đã tạo tài khoản tại <strong style="color:${brandColor};">Tour Vĩnh Hy</strong>.
      Để kích hoạt tài khoản và bắt đầu đăng nhập, vui lòng bấm vào nút bên dưới để xác thực email.
    </p>

    <div style="text-align:center;margin:28px 0;">
      <a href="${verificationUrl}" style="display:inline-block;background:${coralColor};color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:999px;font-size:14px;font-weight:700;">
        Xác thực email
      </a>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 8px;font-size:13px;color:${inkColor};font-weight:600;">Nếu nút không hoạt động, hãy mở liên kết này:</p>
          <p style="margin:0;font-size:12px;line-height:1.7;word-break:break-all;">
            <a href="${verificationUrl}" style="color:${brandColor};text-decoration:none;">${verificationUrl}</a>
          </p>
        </td>
      </tr>
    </table>

    <p style="margin:20px 0 0;color:#94a3b8;font-size:12px;line-height:1.6;">
      Liên kết xác thực có hiệu lực trong 24 giờ. Nếu bạn không thực hiện đăng ký, có thể bỏ qua email này.
    </p>
  `;

  const text = `Xin chào ${name || "bạn"},\n\nVui lòng xác thực email để hoàn tất đăng ký tài khoản Tour Vĩnh Hy:\n${verificationUrl}\n\nLiên kết có hiệu lực trong 24 giờ.`;

  return {
    subject,
    text,
    html: emailWrapper(content)
  };
};
