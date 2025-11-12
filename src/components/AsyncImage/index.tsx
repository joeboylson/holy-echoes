import { useEffect, useState } from "react";
import LoadingIcon from "../LoadingIcon";

type _props = {
  src: string;
  alt: string;
  style?: React.CSSProperties;
  className?: string;
};

export default function AsyncImage({ src, alt, style, className }: _props) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const img = new Image();
    img.src = src;

    img.onload = () => {
      if (isMounted) setLoadedSrc(src);
    };

    img.onerror = () => {
      if (isMounted) setLoadedSrc(null); // Could also set a fallback src
    };

    return () => {
      isMounted = false;
    };
  }, [src]);

  return (
    <>
      {!loadedSrc ? (
        <div className="grid place-items-center">
          <LoadingIcon />
        </div>
      ) : (
        <img
          src={loadedSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          style={style}
          className={className}
        />
      )}
    </>
  );
}
