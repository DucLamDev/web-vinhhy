import { cn } from "@/lib/utils";

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-ink outline-none ring-0 placeholder:text-slate-400 focus:border-ocean",
        className
      )}
      {...props}
    />
  );
}
