import Link from "next/link";

export function BlogBreadcrumbs({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.href || item.name}-${index}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link href={item.href} className="transition hover:text-ocean">
                  {item.name}
                </Link>
              ) : (
                <span className={isLast ? "font-semibold text-ink" : ""}>{item.name}</span>
              )}
              {!isLast ? <span aria-hidden="true">/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
