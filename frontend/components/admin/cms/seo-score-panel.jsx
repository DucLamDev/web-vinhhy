"use client";

import { useMemo, useState } from "react";
import { SearchCheck } from "lucide-react";

import { getSeoScore } from "@/lib/seo-score";
import { cn } from "@/lib/utils";

const scoreTone = (score) => {
  if (score >= 80) return "bg-emerald-500 text-white";
  if (score >= 60) return "bg-amber-400 text-ink";
  return "bg-rose-500 text-white";
};

export function SeoScorePanel({ post }) {
  const [manualKeyword, setManualKeyword] = useState("");
  const scoreResult = useMemo(() => getSeoScore(post, manualKeyword), [manualKeyword, post]);

  return (
    <div className="space-y-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <SearchCheck className="h-4 w-4 text-ocean" />
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">SEO Score</h3>
      </div>

      <div className="flex items-center gap-4 rounded-[22px] bg-slate-50 p-4">
        <div className={cn("flex h-20 w-20 items-center justify-center rounded-full text-2xl font-semibold", scoreTone(scoreResult.score))}>
          {scoreResult.score}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-ink">Danh gia noi dung theo kieu WordPress SEO</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">{scoreResult.summary}</p>
        </div>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-ink">Focus keyword</span>
        <input
          className="admin-input"
          value={manualKeyword}
          onChange={(event) => setManualKeyword(event.target.value)}
          placeholder={post.title || "Nhap tu khoa chinh de cham diem SEO"}
        />
        <p className="text-xs leading-6 text-slate-500">
          Neu de trong, he thong se tam lay theo title/meta title hien tai.
        </p>
      </label>

      <div className="space-y-3">
        {scoreResult.checks.map((item) => (
          <div key={item.label} className="rounded-[18px] border border-slate-100 bg-slate-50 px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-ink">{item.label}</p>
                <p className="mt-1 text-xs leading-6 text-slate-500">{item.detail}</p>
              </div>
              <span
                className={cn(
                  "inline-flex min-w-16 justify-center rounded-full px-3 py-1 text-xs font-semibold",
                  item.passed ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
                )}
              >
                {item.passed ? `+${item.points}` : "Can sua"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
