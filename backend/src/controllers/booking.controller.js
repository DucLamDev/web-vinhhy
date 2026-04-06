import Booking from "../models/Booking.js";
import Tour from "../models/Tour.js";
import { sendBookingConfirmationEmail, sendAdminBookingNotification } from "../services/email.service.js";
import { syncBookingToCrm } from "../services/crm.service.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";

const calculateTotalPrice = ({ adult, child, senior, infant, prices }) =>
  adult * prices.adult +
  child * prices.child +
  senior * prices.senior +
  infant * (prices.infant || 0);

export const createBooking = asyncHandler(async (req, res) => {
  const {
    tourSlug,
    name,
    email,
    phone,
    address,
    travelDate,
    notes = "",
    adult = 1,
    child = 0,
    infant = 0,
    senior = 0,
    packageOptionId = "",
    departureOptionId = ""
  } = req.body;

  if (!tourSlug || !name || !email || !phone || !travelDate) {
    throw new ApiError(400, "Missing required booking information");
  }

  const tour = await Tour.findOne({ slug: tourSlug, published: true });

  if (!tour) {
    throw new ApiError(404, "Selected tour does not exist");
  }

  const counts = {
    adult: Number(adult) || 0,
    child: Number(child) || 0,
    infant: Number(infant) || 0,
    senior: Number(senior) || 0
  };

  if (counts.adult + counts.child + counts.infant + counts.senior <= 0) {
    throw new ApiError(400, "At least one traveler is required");
  }

  const selectedDeparture = departureOptionId
    ? tour.departureOptions?.find((option) => option.id === departureOptionId)
    : null;

  if (departureOptionId && !selectedDeparture) {
    throw new ApiError(400, "Selected departure option is invalid");
  }

  const availablePackageOptions =
    selectedDeparture?.packageOptions?.length ? selectedDeparture.packageOptions : tour.packageOptions || [];

  const selectedPackage = packageOptionId
    ? availablePackageOptions.find((option) => option.id === packageOptionId)
    : null;

  if (packageOptionId && !selectedPackage) {
    throw new ApiError(400, "Selected package option is invalid");
  }

  const appliedPrices = selectedPackage
    ? {
        adult: selectedPackage.adultPrice,
        child: selectedPackage.childPrice,
        senior: selectedPackage.seniorPrice ?? selectedPackage.adultPrice,
        infant: selectedPackage.infantPrice ?? 0
      }
    : {
        adult: tour.prices.adult,
        child: tour.prices.child,
        senior: tour.prices.senior,
        infant: 0
      };

  const totalPrice = calculateTotalPrice({
    adult: counts.adult,
    child: counts.child,
    infant: counts.infant,
    senior: counts.senior,
    prices: appliedPrices
  });

  const booking = await Booking.create({
    user: req.user?._id,
    tour: tour._id,
    customer: {
      name,
      email,
      phone,
      address: address || ""
    },
    travelDate,
    notes: [selectedDeparture ? `Khởi hành: ${selectedDeparture.label}` : "", notes].filter(Boolean).join(" | "),
    counts,
    packageSelection: selectedPackage
      ? {
          optionId: selectedPackage.id,
          label: selectedPackage.label,
          guestLabel: selectedPackage.guestLabel
        }
      : undefined,
    pricing: {
      adultPrice: appliedPrices.adult,
      childPrice: appliedPrices.child,
      infantPrice: appliedPrices.infant,
      seniorPrice: appliedPrices.senior,
      totalPrice,
      deposit: 0
    }
  });

  const warnings = [];

  try {
    await sendBookingConfirmationEmail({
      to: email,
      booking,
      tour
    });
    booking.notifications.emailSent = true;
    booking.notifications.emailError = "";
  } catch (error) {
    booking.notifications.emailSent = false;
    booking.notifications.emailError = error.message;
    warnings.push("Unable to send confirmation email immediately.");
  }

  try {
    await sendAdminBookingNotification({ booking, tour });
  } catch (_error) {
    warnings.push("Unable to send admin notification email.");
  }

  try {
    const crmResult = await syncBookingToCrm({ booking, tour });
    booking.crmSync.status = crmResult.status;
    booking.crmSync.response = crmResult.response;
    booking.crmSync.error = crmResult.error;
  } catch (error) {
    booking.crmSync.status = "failed";
    booking.crmSync.error = error.message;
    warnings.push("CRM sync failed and can be retried later.");
  }

  await booking.save();

  res.status(201).json({
    message: "Booking created successfully",
    bookingId: booking._id,
    totalPrice,
    warnings
  });
});
