"use client";

import { useEffect, useRef, useState } from "react";
import { computeCoverDraw, PhotoTransform } from "@/lib/image-transform";

interface CroppedPhotoProps {
  src: string;
  naturalWidth: number;
  naturalHeight: number;
  transform: PhotoTransform;
  className?: string;
}

/**
 * Renders a photo cropped to fill its container using the same cover math
 * as the print export, so what you see here is what gets printed.
 */
export function CroppedPhoto({ src, naturalWidth, naturalHeight, transform, className }: CroppedPhotoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setBox({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const rect =
    box.width > 0 && box.height > 0
      ? computeCoverDraw(naturalWidth, naturalHeight, box.width, box.height, transform)
      : null;

  return (
    <div ref={containerRef} className={className} style={{ position: "relative", overflow: "hidden" }}>
      {rect && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          draggable={false}
          style={{
            position: "absolute",
            left: rect.dx,
            top: rect.dy,
            width: rect.drawWidth,
            height: rect.drawHeight,
            maxWidth: "none",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}
