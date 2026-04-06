"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, CheckCircle2, ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getToken } from "@/lib/auth";
import { cn, formatCurrency } from "@/lib/utils";

const defaultTravelerTypes = [
  { key: "adult", label: "Người lớn", hint: "" },
  { key: "child", label: "Trẻ em", hint: "" },
  { key: "infant", label: "Em bé", hint: "" },
  { key: "senior", label: "Người cao tuổi", hint: "" }
];

const getDepartureOptions = (tour) => {
  if (tour.departureOptions?.length) {
    return tour.departureOptions;
  }

  return [
    {
      id: "default",
      label: tour.pickupPlace || "Khởi hành mặc định",
      description: "",
      packageOptions: tour.packageOptions || []
    }
  ];
};

const buildInitialState = (tour) => {
  const departureOptions = getDepartureOptions(tour);
  const firstDeparture = departureOptions[0] || null;
  const firstPackage = firstDeparture?.packageOptions?.[0] || tour.packageOptions?.[0] || null;

  return {
    name: "",
    email: "",
    phone: "",
    address: "",
    travelDate: "",
    adult: firstPackage?.recommendedCount || 1,
    child: 0,
    infant: 0,
    senior: 0,
    notes: "",
    departureOptionId: firstDeparture?.id || "",
    packageOptionId: firstPackage?.id || ""
  };
};

const resolveUnitPrices = ({ tour, selectedPackage }) => ({
  adult: selectedPackage?.adultPrice ?? tour.prices?.adult ?? 0,
  child: selectedPackage?.childPrice ?? tour.prices?.child ?? 0,
  infant: selectedPackage?.infantPrice ?? 0,
  senior: selectedPackage?.seniorPrice ?? tour.prices?.senior ?? 0
});

const parseApiResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return { message: text };
};

export function BookingForm({ tour, onSummaryChange }) {
  const travelerTypes = tour.travelerTypes?.length ? tour.travelerTypes : defaultTravelerTypes;
  const travelerOptions = travelerTypes.filter((type) => ["adult", "child", "infant"].includes(type.key));
  const departureOptions = useMemo(() => getDepartureOptions(tour), [tour]);

  const [formState, setFormState] = useState(() => buildInitialState(tour));
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setFormState(buildInitialState(tour));
    setStatus({ type: "", message: "" });
    setStep(1);
    setShowSuccess(false);
  }, [tour]);

  const selectedDeparture = useMemo(
    () => departureOptions.find((option) => option.id === formState.departureOptionId) || departureOptions[0] || null,
    [departureOptions, formState.departureOptionId]
  );

  const packageOptions = selectedDeparture?.packageOptions || tour.packageOptions || [];

  const selectedPackage = useMemo(
    () => packageOptions.find((item) => item.id === formState.packageOptionId) || packageOptions[0] || null,
    [formState.packageOptionId, packageOptions]
  );

  const unitPrices = useMemo(() => resolveUnitPrices({ tour, selectedPackage }), [selectedPackage, tour]);

  const totalTravelers = useMemo(
    () =>
      Number(formState.adult || 0) +
      Number(formState.child || 0) +
      Number(formState.infant || 0) +
      Number(formState.senior || 0),
    [formState.adult, formState.child, formState.infant, formState.senior]
  );

  const totalPrice = useMemo(
    () =>
      Number(formState.adult || 0) * unitPrices.adult +
      Number(formState.child || 0) * unitPrices.child +
      Number(formState.infant || 0) * unitPrices.infant +
      Number(formState.senior || 0) * unitPrices.senior,
    [formState.adult, formState.child, formState.infant, formState.senior, unitPrices]
  );

  useEffect(() => {
    onSummaryChange?.({
      total: totalPrice,
      travelerCount: totalTravelers,
      packageLabel: [
        selectedDeparture?.label || "",
        selectedPackage?.label || ""
      ]
        .filter(Boolean)
        .join(" • ")
    });
  }, [onSummaryChange, selectedDeparture?.label, selectedPackage?.label, totalPrice, totalTravelers]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleCountChange = (field, delta) => {
    setFormState((current) => ({
      ...current,
      [field]: Math.max(0, Number(current[field] || 0) + delta)
    }));
  };

  const handleDepartureChange = (departureOptionId) => {
    const nextDeparture = departureOptions.find((item) => item.id === departureOptionId) || departureOptions[0] || null;
    const nextPackage = nextDeparture?.packageOptions?.[0] || null;

    setFormState((current) => ({
      ...current,
      departureOptionId,
      packageOptionId: nextPackage?.id || "",
      adult: nextPackage?.recommendedCount || 1,
      child: 0,
      infant: 0,
      senior: 0
    }));
  };

  const handlePackageChange = (packageOptionId) => {
    const nextPackage = packageOptions.find((item) => item.id === packageOptionId);

    setFormState((current) => ({
      ...current,
      packageOptionId,
      adult: nextPackage?.recommendedCount || current.adult || 1,
      child: 0,
      infant: 0,
      senior: 0
    }));
  };

  const validateStepOne = () => {
    if (!selectedPackage) {
      setStatus({ type: "error", message: "Vui lòng chọn gói dịch vụ phù hợp." });
      return false;
    }

    if (totalTravelers <= 0) {
      setStatus({ type: "error", message: "Vui lòng chọn ít nhất 1 khách cho booking này." });
      return false;
    }

    setStatus({ type: "", message: "" });
    return true;
  };

  const handleNextStep = () => {
    if (!validateStepOne()) {
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    const noteParts = [
      selectedDeparture ? `Khởi hành: ${selectedDeparture.label}` : "",
      selectedPackage ? `Gói đã chọn: ${selectedPackage.label}` : "",
      formState.notes
    ].filter(Boolean);

    try {
      const token = getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          tourSlug: tour.slug,
          name: formState.name,
          email: formState.email,
          phone: formState.phone,
          address: formState.address,
          travelDate: formState.travelDate,
          adult: Number(formState.adult || 0),
          child: Number(formState.child || 0),
          infant: Number(formState.infant || 0),
          senior: Number(formState.senior || 0),
          departureOptionId: selectedDeparture?.id || "",
          packageOptionId: selectedPackage?.id || "",
          notes: noteParts.join(" | ")
        })
      });

      const result = await parseApiResponse(response);

      if (!response.ok) {
        throw new Error(result.message || "Không thể gửi yêu cầu đặt tour");
      }

      setShowSuccess(true);
      setStatus({
        type: "success",
        message: result.warnings?.length
          ? `Đặt tour thành công. ${result.warnings.join(" ")}`
          : "Booking đã được ghi nhận. Đội ngũ sẽ liên hệ xác nhận sớm nhất."
      });
      setFormState(buildInitialState(tour));
      setStep(1);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm sm:p-5">
        <div className="rounded-xl bg-emerald-50 p-5 text-center">
          <div className="success-check mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-ink">Đặt tour thành công</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{status.message}</p>
          <Button
            className="mt-4"
            onClick={() => {
              setShowSuccess(false);
              setStatus({ type: "", message: "" });
            }}
          >
            Tạo booking mới
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Booking</p>
          <h2 className="mt-1 text-xl font-semibold leading-none text-ink">Đặt tour</h2>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Tổng</p>
          <p className="mt-1 text-xl font-semibold text-coral">{formatCurrency(totalPrice)}</p>
          <p className="text-xs text-slate-500">{totalTravelers} khách</p>
        </div>
      </div>

      <StepIndicator step={step} />

      <div className="mt-3 rounded-xl bg-[#f6f4ef] p-3 sm:p-4">
        {step === 1 ? (
          <>
            <div className="space-y-4">
              {departureOptions.length > 1 ? (
                <div>
                  <p className="mb-2 text-[13px] font-semibold text-ink">1. Chọn điểm khởi hành</p>
                  <div className="grid gap-2">
                    {departureOptions.map((option) => {
                      const isActive = selectedDeparture?.id === option.id;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => handleDepartureChange(option.id)}
                          className={cn(
                            "w-full rounded-xl border px-3.5 py-3 text-left transition",
                            isActive
                              ? "border-ocean bg-[#f3fbfd] ring-1 ring-ocean/20"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={cn(
                                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition",
                                isActive ? "border-ocean bg-ocean" : "border-slate-300 bg-white"
                              )}
                            >
                              {isActive ? <Check className="h-3 w-3 text-white" /> : null}
                            </div>
                            <div>
                              <p className={cn("text-[13px] font-semibold", isActive ? "text-ocean" : "text-ink")}>
                                {option.label}
                              </p>
                              {option.description ? (
                                <p className="mt-1 text-xs leading-5 text-slate-500">{option.description}</p>
                              ) : null}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <div>
                <p className="mb-2 text-[13px] font-semibold text-ink">
                  {departureOptions.length > 1 ? "2. Chọn gói dịch vụ" : "1. Chọn gói dịch vụ"}
                </p>
                <div className="space-y-1.5">
                  {packageOptions.map((option) => {
                    const isActive = selectedPackage?.id === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handlePackageChange(option.id)}
                        className={cn(
                          "package-radio-item w-full rounded-xl border px-3.5 py-2.5 text-left transition",
                          isActive
                            ? "border-coral bg-[#fffaf5] ring-1 ring-coral/30"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition",
                              isActive ? "border-coral bg-coral" : "border-slate-300 bg-white"
                            )}
                          >
                            {isActive ? <Check className="h-3 w-3 text-white" /> : null}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline justify-between gap-2">
                              <span className={cn("text-[13px] font-semibold leading-tight", isActive ? "text-coral" : "text-ink")}>
                                {option.label}
                              </span>
                              <span className="shrink-0 text-[13px] font-semibold text-slate-500">
                                {formatCurrency(option.adultPrice || 0)}
                              </span>
                            </div>
                            {option.note ? <p className="mt-1 text-xs leading-5 text-slate-500">{option.note}</p> : null}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-2 text-[13px] font-semibold text-ink">
                  {departureOptions.length > 1 ? "3. Số lượng khách" : "2. Số lượng khách"}
                </p>
                <div className="space-y-1.5">
                  {travelerOptions.map((type) => (
                    <TravelerCounterCard
                      key={type.key}
                      label={type.label}
                      hint={type.hint}
                      value={Number(formState[type.key] || 0)}
                      price={unitPrices[type.key] ?? 0}
                      onDecrement={() => handleCountChange(type.key, -1)}
                      onIncrement={() => handleCountChange(type.key, 1)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button type="button" size="lg" className="min-w-[110px]" onClick={handleNextStep}>
                Tiếp tục
                <ChevronRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Họ và tên">
                <Input name="name" value={formState.name} onChange={handleChange} required />
              </Field>
              <Field label="Số điện thoại">
                <Input name="phone" value={formState.phone} onChange={handleChange} required />
              </Field>
              <Field label="Email">
                <Input type="email" name="email" value={formState.email} onChange={handleChange} required />
              </Field>
              <Field label="Ngày đi">
                <Input type="date" name="travelDate" value={formState.travelDate} onChange={handleChange} required />
              </Field>
            </div>

            <Field label="Địa chỉ">
              <Input name="address" value={formState.address} onChange={handleChange} placeholder="Khách sạn hoặc điểm hẹn" />
            </Field>

            <Field label="Ghi chú">
              <Textarea
                name="notes"
                value={formState.notes}
                onChange={handleChange}
                placeholder="Ví dụ: cần đón tại khách sạn, có trẻ nhỏ..."
                rows={2}
              />
            </Field>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-between">
              <Button type="button" variant="secondary" size="sm" onClick={() => setStep(1)}>
                <ChevronLeft className="mr-1.5 h-4 w-4" />
                Quay lại
              </Button>
              <Button type="submit" size="lg" className="min-w-[110px]" disabled={isSubmitting}>
                {isSubmitting ? "Đang gửi..." : "Đặt Tour"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {status.message && status.type === "error" ? (
        <div className="mt-3 rounded-xl bg-red-50 px-3 py-2.5 text-[13px] text-red-700">{status.message}</div>
      ) : null}
    </form>
  );
}

function StepIndicator({ step }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("step-dot", step > 1 ? "completed" : step === 1 ? "current" : "upcoming")}>
        {step > 1 ? <CheckCircle2 className="h-3.5 w-3.5" /> : "1"}
      </span>
      <span className={cn("step-connector", step > 1 && "completed")} />
      <span className={cn("step-dot", step === 2 ? "current" : "upcoming")}>2</span>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[13px] font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}

function TravelerCounterCard({ label, hint, value, price, onDecrement, onIncrement }) {
  const priceText = price === 0 ? "Miễn phí" : formatCurrency(price);

  return (
    <div className="rounded-xl bg-white px-3 py-2.5">
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1.5">
            <p className="text-[13px] font-semibold text-ink">{label}</p>
            {hint ? <span className="text-[11px] text-slate-400">{hint}</span> : null}
          </div>
          <p className={cn("text-[12px] font-semibold", price === 0 ? "text-emerald-600" : "text-coral")}>{priceText}</p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-slate-50 p-1">
          <CounterButton type="button" onClick={onDecrement} ariaLabel={`Giảm ${label}`}>
            <Minus className="h-3.5 w-3.5" />
          </CounterButton>
          <span key={value} className="counter-value bump min-w-[1.2rem] text-center text-sm font-semibold text-ink">
            {value}
          </span>
          <CounterButton type="button" onClick={onIncrement} ariaLabel={`Tăng ${label}`}>
            <Plus className="h-3.5 w-3.5" />
          </CounterButton>
        </div>
      </div>
    </div>
  );
}

function CounterButton({ children, ariaLabel, ...props }) {
  return (
    <button
      className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-ink shadow-sm transition hover:bg-sky hover:text-ocean"
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  );
}
