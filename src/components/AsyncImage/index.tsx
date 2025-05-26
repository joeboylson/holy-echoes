import { useEffect, useState } from "react";
import LoadingIcon from "../LoadingIcon";
import styled from "styled-components";

const LoadingIconWrapper = styled.div`
  display: grid;
  place-items: center;
`;

type _props = {
  src: string;
  alt: string;
};

export default function AsyncImage({ src, alt }: _props) {
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
        <LoadingIconWrapper>
          <LoadingIcon />
        </LoadingIconWrapper>
      ) : (
        <img src={loadedSrc} alt={alt} loading="lazy" decoding="async" />
      )}
    </>
  );
}
