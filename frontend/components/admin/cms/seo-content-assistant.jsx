"use client";

import { useState } from "react";
import { WandSparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buildSeoDraft } from "@/lib/seo-assistant";

export function SeoContentAssistant({ post, onApplyMeta, onApplyOutline }) {
  const [inputs, setInputs] = useState({
    primaryKeyword: post.title || "",
    secondaryKeyword: "",
    location: "Vinh Hy",
    audience: "du khach tu tuc",
    tone: "thuc te"
  });

  const draft = buildSeoDraft({
    title: post.title,
    ...inputs
  });

  return (
    <div className="space-y-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <WandSparkles className="h-4 w-4 text-ocean" />
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">SEO Content Assistant</h3>
      </div>

      <input
        className="admin-input"
        placeholder="Primary keyword"
        value={inputs.primaryKeyword}
        onChange={(event) => setInputs({ ...inputs, primaryKeyword: event.target.value })}
      />
      <input
        className="admin-input"
        placeholder="Secondary keyword"
        value={inputs.secondaryKeyword}
        onChange={(event) => setInputs({ ...inputs, secondaryKeyword: event.target.value })}
      />
      <div className="grid gap-3 md:grid-cols-2">
        <input
          className="admin-input"
          placeholder="Location"
          value={inputs.location}
          onChange={(event) => setInputs({ ...inputs, location: event.target.value })}
        />
        <input
          className="admin-input"
          placeholder="Audience"
          value={inputs.audience}
          onChange={(event) => setInputs({ ...inputs, audience: event.target.value })}
        />
      </div>
      <input
        className="admin-input"
        placeholder="Tone of voice"
        value={inputs.tone}
        onChange={(event) => setInputs({ ...inputs, tone: event.target.value })}
      />

      <div className="rounded-[22px] bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-semibold text-ink">Preview de xuat</p>
        <p className="mt-2"><strong>Meta title:</strong> {draft.metaTitle}</p>
        <p className="mt-1"><strong>Meta description:</strong> {draft.metaDescription}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="secondary"
          onClick={() =>
            onApplyMeta({
              metaTitle: draft.metaTitle,
              metaDescription: draft.metaDescription,
              excerpt: post.excerpt || draft.excerpt,
              jsonLd: post.seo?.jsonLd || draft.faqJsonLd,
              introHtml: draft.introHtml
            })
          }
        >
          Ap dung meta SEO
        </Button>
        <Button
          onClick={() =>
            onApplyOutline({
              sections: draft.outlineSections,
              introHtml: draft.introHtml
            })
          }
        >
          Tao outline SEO
        </Button>
      </div>
    </div>
  );
}
