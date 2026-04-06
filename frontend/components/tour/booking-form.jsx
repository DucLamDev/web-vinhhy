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

const buildInitialState = (tour) => {
  const firstPackage = tour.packageOptions?.[0];

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
    packageOptionId: firstPackage?.id || ""
  };
};

const resolveUnitPrices = ({ tour, selectedPackage }) => ({
  adult: selectedPackage?.adultPrice ?? tour.prices?.adult ?? 0,
  child: selectedPackage?.childPrice ?? tour.prices?.child ?? 0,
  infant: selectedPackage?.infantPrice ?? 0,
  senior: selectedPackage?.seniorPrice ?? tour.prices?.senior ?? 0
});

export function BookingForm({ tour, onSummaryChange }) {
  const travelerTypes = tour.travelerTypes?.length ? tour.travelerTypes : defaultTravelerTypes;
  const packageOptions = tour.packageOptions || [];
  const travelerOptions = travelerTypes.filter((type) => ["adult", "child", "infant"].includes(type.key));

  const [formState, setFormState] = useState(() => buildInitialState(tour));
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pricePulse, setPricePulse] = useState(false);

  useEffect(() => {
    setFormState(buildInitialState(tour));
    setStatus({ type: "", message: "" });
    setStep(1);
    setShowSuccess(false);
  }, [tour]);

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
      packageLabel: selectedPackage?.label || ""
    });
  }, [onSummaryChange, selectedPackage?.label, totalPrice, totalTravelers]);

  useEffect(() => {
    setPricePulse(true);
    const timeout = window.setTimeout(() => setPricePulse(false), 240);
    return () => window.clearTimeout(timeout);
  }, [totalPrice]);

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

    const packageNote = selectedPackage ? `Gói đã chọn: ${selectedPackage.label}` : "";
    const payloadNotes = [packageNote, formState.notes].filter(Boolean).join(" | ");

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
          packageOptionId: selectedPackage?.id || "",
          notes: payloadNotes
        })
      });

      const result = await response.json();

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
      <div className="rounded-[28px] border border-emerald-100 bg-white p-5 shadow-soft sm:p-6">
        <div className="rounded-[24px] bg-emerald-50 p-6 text-center">
          <div className="success-check mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check className="h-9 w-9" />
          </div>
          <h3 className="mt-5 text-2xl font-semibold text-ink">Đặt tour thành công</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">{status.message}</p>
          <Button
            className="mt-6"
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
    <form onSubmit={handleSubmit} className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-soft sm:p-5 lg:p-5 xl:p-6">
      <div className="mb-4 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-slate-50 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Booking</p>
          <h2 className="mt-2 text-[1.85rem] font-semibold leading-none text-ink lg:text-[2rem]">Đặt tour</h2>
          <p className="mt-1 text-sm text-slate-600">
            Gói chọn: <span className="font-semibold text-ink">{selectedPackage?.label || "Chọn gói"}</span>
          </p>
        </div>

        <div className="rounded-[24px] bg-white px-4 py-3 text-right shadow-sm">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Tổng tạm tính</p>
          <p className="mt-2 text-2xl font-semibold text-coral">{formatCurrency(totalPrice)}</p>
          <p className="mt-1 text-sm text-slate-500">{totalTravelers} khách</p>
        </div>
      </div>

      <StepIndicator step={step} />

      <div className="mt-4 rounded-[26px] bg-[#f6f4ef] p-4 lg:p-4 xl:p-5">
        {step === 1 ? (
          <>
            <div className="space-y-4 xl:grid xl:grid-cols-[1.08fr_0.92fr] xl:gap-4 xl:space-y-0">
              <div>
                <p className="text-sm font-semibold text-ink">1. Chọn gói dịch vụ</p>
                <div className="mt-3 grid gap-2.5 min-[380px]:grid-cols-2">
                  {packageOptions.map((option, index) => {
                    const isActive = selectedPackage?.id === option.id;
                    const lastWide = packageOptions.length % 2 === 1 && index === packageOptions.length - 1 ? "min-[380px]:col-span-2" : "";

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handlePackageChange(option.id)}
                        className={cn(
                          "rounded-[20px] border bg-white px-3 py-3 text-left text-[14px] font-semibold leading-5 tracking-[-0.01em] transition min-[380px]:min-h-[68px] lg:text-[15px] xl:px-4 xl:py-3 xl:text-[14px]",
                          lastWide,
                          isActive
                            ? "price-card-active border-coral bg-[#fffaf5] text-coral"
                            : "border-slate-200 text-ink hover:border-coral/40 hover:bg-[#fffdfa]"
                        )}
                      >
                        <div>{option.label}</div>
                        <p className="mt-2 text-sm font-medium text-slate-500">
                          {option.adultPrice ? `${formatCurrency(option.adultPrice)} / khách` : "Liên hệ"}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-ink">2. Chọn số lượng khách</p>
                <div className="mt-3 space-y-2.5">
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
            <div className="mt-6 flex justify-end">
              <Button type="button" size="lg" className="min-w-[124px]" onClick={handleNextStep}>
                Tiếp tục
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
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
              <Input name="address" value={formState.address} onChange={handleChange} placeholder="Khách sạn hoặc điểm hẹn mong muốn" />
            </Field>

            <Field label="Ghi chú thêm">
              <Textarea
                name="notes"
                value={formState.notes}
                onChange={handleChange}
                placeholder="Ví dụ: cần đón tại khách sạn, có trẻ nhỏ, cần xuất hóa đơn..."
              />
            </Field>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Button type="button" variant="secondary" onClick={() => setStep(1)}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Quay lại
              </Button>
              <Button type="submit" size="lg" className="min-w-[124px]" disabled={isSubmitting}>
                {isSubmitting ? "Đang gửi..." : "Đặt Tour"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {status.message && status.type === "error" ? (
        <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{status.message}</div>
      ) : null}
    </form>
  );
}

function StepIndicator({ step }) {
  return (
    <div className="flex items-center gap-3">
      <span className={cn("step-dot", step > 1 ? "completed" : step === 1 ? "current" : "upcoming")}>{step > 1 ? <CheckCircle2 className="h-4 w-4" /> : "1"}</span>
      <span className={cn("step-connector", step > 1 && "completed")} />
      <span className={cn("step-dot", step === 2 ? "current" : "upcoming")}>2</span>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}

function TravelerCounterCard({ label, hint, value, price, onDecrement, onIncrement }) {
  const priceText = price === 0 ? "Miễn phí" : `${formatCurrency(price)} / khách`;

  return (
    <div className="rounded-2xl bg-white px-3 py-3">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-base font-semibold text-ink">{label}</p>
            {hint ? <span className="text-sm text-slate-500">{hint}</span> : null}
          </div>
          <p className={cn("mt-1.5 text-sm font-semibold", price === 0 ? "text-emerald-600" : "text-coral")}>{priceText}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2 rounded-full bg-slate-50 p-1.5">
          <CounterButton type="button" onClick={onDecrement} ariaLabel={`Giảm số lượng ${label}`}>
            <Minus className="h-4 w-4" />
          </CounterButton>
          <span key={value} className="counter-value bump min-w-[1.4rem] text-center text-base font-semibold text-ink">
            {value}
          </span>
          <CounterButton type="button" onClick={onIncrement} ariaLabel={`Tăng số lượng ${label}`}>
            <Plus className="h-4 w-4" />
          </CounterButton>
        </div>
      </div>
    </div>
  );
}

function CounterButton({ children, ariaLabel, ...props }) {
  return (
    <button
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink shadow-[0_6px_14px_rgba(21,48,74,0.08)] transition hover:bg-sky hover:text-ocean"
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  );
}
