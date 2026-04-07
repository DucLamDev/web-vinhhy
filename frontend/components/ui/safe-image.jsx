"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

const DEFAULT_FALLBACK_SRC = "/logo.jpg";

export function SafeImage({ src, fallbackSrc = DEFAULT_FALLBACK_SRC, alt = "", ...props }) {
  const [hasError, setHasError] = useState(false);

  const resolvedSrc = useMemo(() => {
    if (hasError || !src || typeof src !== "string") {
      return fallbackSrc;
    }

    return src;
  }, [fallbackSrc, hasError, src]);

  const mergedStyle = {
    objectFit: props.fill ? "cover" : undefined,
    ...props.style
  };

  return <Image {...props} src={resolvedSrc} alt={alt} onError={() => setHasError(true)} style={mergedStyle} />;
}
