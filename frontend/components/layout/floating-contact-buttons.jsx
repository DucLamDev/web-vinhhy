"use client";

import Image from "next/image";
import { PhoneCall, X } from "lucide-react";
import { useState } from "react";

const phoneContacts = [
  { label: "1900.63.63.32", href: "tel:1900636332" },
  { label: "09167.456.83 (Mr.Thuận)", href: "tel:0916745683" },
  { label: "09112.027.17 (Ms.Trân)", href: "tel:0911202717" }
];

export function FloatingContactButtons() {
  const [isPhonePanelOpen, setIsPhonePanelOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-3 z-40 flex flex-col items-end gap-3 lg:bottom-6 lg:right-6">
      {isPhonePanelOpen ? (
        <div className="w-[210px] rounded-[20px] border border-slate-200 bg-white p-4 shadow-[0_18px_45px_rgba(21,48,74,0.16)]">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Liên hệ nhanh</p>
            <button
              type="button"
              onClick={() => setIsPhonePanelOpen(false)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
              aria-label="Đóng bảng số điện thoại"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2.5">
            {phoneContacts.map((contact) => (
              <a
                key={contact.label}
                href={contact.href}
                className="flex items-center gap-3 rounded-2xl px-1 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-coral text-white">
                  <PhoneCall className="h-4.5 w-4.5" />
                </span>
                <span>{contact.label}</span>
              </a>
            ))}

            <a
              href="https://zalo.me/2885871419595957360"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-2xl px-1 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <Image src="/logo-contact/zalo.webp" alt="Zalo" width={40} height={40} className="h-10 w-10 shrink-0 object-contain" />
              <span>Tư vấn zalo</span>
            </a>
          </div>
        </div>
      ) : null}

      <a
        href="https://zalo.me/2885871419595957360"
        target="_blank"
        rel="noreferrer"
        aria-label="Liên hệ Zalo"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-[0_16px_35px_rgba(21,48,74,0.15)] ring-1 ring-slate-200"
      >
        <Image src="/logo-contact/zalo.webp" alt="Zalo" width={44} height={44} className="h-11 w-11 object-contain" />
      </a>
      <a
        href="https://m.me/"
        target="_blank"
        rel="noreferrer"
        aria-label="Liên hệ Messenger"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-[0_16px_35px_rgba(21,48,74,0.15)] ring-1 ring-slate-200"
      >
        <Image src="/logo-contact/messenger.webp" alt="Messenger" width={44} height={44} className="h-11 w-11 object-contain" />
      </a>
      <button
        type="button"
        onClick={() => setIsPhonePanelOpen((current) => !current)}
        aria-label="Mở số điện thoại tư vấn"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-coral text-white shadow-[0_16px_35px_rgba(255,122,26,0.28)]"
      >
        <PhoneCall className="h-6 w-6" />
      </button>
    </div>
  );
}
