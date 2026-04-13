import { cn } from "@/lib/utils";

const widthClasses = {
  full: "max-w-none",
  wide: "mx-auto max-w-5xl",
  narrow: "mx-auto max-w-3xl"
};

const ratioClasses = {
  original: "",
  landscape: "aspect-[16/9]",
  square: "aspect-square",
  portrait: "aspect-[4/5]"
};

const SectionHeading = ({ level = "h2", html = "" }) => {
  const Tag = level;
  const className =
    level === "h1"
      ? "text-4xl sm:text-5xl"
      : level === "h2"
        ? "text-3xl sm:text-4xl"
        : "text-2xl sm:text-3xl";

  return (
    <Tag
      className={cn("text-balance font-semibold tracking-tight text-ink", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export function BlogRenderer({ post, className = "" }) {
  const sections = Array.isArray(post?.contentSections) ? post.contentSections : [];
  const contentHtml = post?.contentHtml || post?.content || "";

  if (contentHtml) {
    return (
      <div className={cn("prose-blog mx-auto max-w-3xl", className)}>
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </div>
    );
  }

  return (
    <div className={cn("space-y-10", className)}>
      {sections.map((section) => {
        if (section.type === "heading") {
          return (
            <div key={section.id} className="mx-auto max-w-3xl">
              <SectionHeading level={section.headingLevel} html={section.body} />
            </div>
          );
        }

        if (section.type === "image") {
          const widthClass = widthClasses[section.imageDisplay?.width || "wide"] || widthClasses.wide;
          const ratioClass = ratioClasses[section.imageDisplay?.ratio || "landscape"] || ratioClasses.landscape;

          return (
            <figure key={section.id} className={cn("space-y-4", widthClass)}>
              {section.image?.url ? (
                <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(21,48,74,0.10)]">
                  <div className={ratioClass}>
                    <img
                      src={section.image.url}
                      alt={section.image.alt || post?.title || "Blog image"}
                      className={cn(
                        "w-full",
                        ratioClass ? "h-full object-cover" : "h-auto object-contain"
                      )}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex h-72 items-center justify-center rounded-[30px] bg-slate-100 text-sm text-slate-500">
                  Chua chon anh cho section nay.
                </div>
              )}
              {section.caption ? (
                <figcaption className="mx-auto max-w-3xl text-center text-sm leading-7 text-slate-500">
                  {section.caption}
                </figcaption>
              ) : null}
            </figure>
          );
        }

        return (
          <div key={section.id} className="mx-auto max-w-3xl">
            <div
              className="prose-blog prose-strong:text-ink rounded-[20px] bg-white/70 px-0 py-0 text-[1.02rem]"
              dangerouslySetInnerHTML={{ __html: section.body || "" }}
            />
          </div>
        );
      })}
    </div>
  );
}
