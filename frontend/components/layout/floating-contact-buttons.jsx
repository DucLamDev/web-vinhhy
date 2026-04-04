import Image from "next/image";
import { PhoneCall } from "lucide-react";

export function FloatingContactButtons() {
  return (
    <div className="fixed bottom-24 right-3 z-40 flex flex-col gap-3 lg:bottom-6 lg:right-6">
      <a
        href="https://zalo.me/"
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
      <a
        href="tel:0900000000"
        aria-label="Gọi điện tư vấn"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-coral text-white shadow-[0_16px_35px_rgba(255,122,26,0.28)]"
      >
        <PhoneCall className="h-6 w-6" />
      </a>
    </div>
  );
}
