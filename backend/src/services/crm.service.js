const formatDate = (value) =>
  new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

export const syncBookingToCrm = async ({ booking, tour }) => {
  if (!process.env.CRM_API_URL) {
    return {
      status: "skipped",
      response: "",
      error: "CRM_API_URL is not configured"
    };
  }

  const payload = {
    name: booking.customer.name,
    phone: booking.customer.phone,
    email: booking.customer.email,
    address: booking.customer.address,
    tourid: tour.crmTourId || tour.slug,
    ngaydi: formatDate(booking.travelDate),
    price: String(booking.pricing.adultPrice),
    pricechild: String(booking.pricing.childPrice),
    price_senior: String(booking.pricing.seniorPrice),
    adult: String(booking.counts.adult),
    child: String(booking.counts.child),
    child1: String(booking.counts.infant),
    senior: String(booking.counts.senior),
    nguon: "148",
    tiencoc: String(booking.pricing.deposit),
    phuthu: "0",
    thuho: "0",
    ghichu: booking.notes,
    note: booking.notes,
    danhsach: "",
    noibo: "website",
    nguoithem: "0",
    implementing_id: "1"
  };

  const headers = {
    "Content-Type": "application/json"
  };

  if (process.env.CRM_API_TOKEN) {
    headers.Authorization = `Bearer ${process.env.CRM_API_TOKEN}`;
  }

  const response = await fetch(process.env.CRM_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });

  const body = await response.text();

  if (!response.ok) {
    throw new Error(`CRM request failed with ${response.status}: ${body}`);
  }

  return {
    status: "success",
    response: body,
    error: ""
  };
};
