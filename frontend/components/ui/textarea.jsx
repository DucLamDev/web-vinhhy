import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "flex min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-slate-400 focus:border-ocean",
        className
      )}
      {...props}
    />
  );
}
