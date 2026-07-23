"use client";

import { useCallback, useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { useZineProject } from "@/hooks/zine-project-context";
import { computeMaxOffsets } from "@/lib/image-transform";
import type { LayoutSlot } from "@/lib/page-layouts";
import type { ProjectPhoto } from "@/lib/zine-project-types";
import { CroppedPhoto } from "./cropped-photo";

interface PhotoSlotProps {
  logicalPage: number;
  slotIndex: number;
  slot: LayoutSlot;
  photo: ProjectPhoto | undefined;
  isActive: boolean;
  onActivate: () => void;
}

export function PhotoSlot({ logicalPage, slotIndex, slot, photo, isActive, onActivate }: PhotoSlotProps) {
  const { setSlotPhoto, updateTransform } = useZineProject();
  const containerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{
    startX: number;
    startY: number;
    startOffsetX: number;
    startOffsetY: number;
    maxOffsetX: number;
    maxOffsetY: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;
      setBusy(true);
      try {
        await setSlotPhoto(logicalPage, slotIndex, file);
      } finally {
        setBusy(false);
      }
    },
    [logicalPage, slotIndex, setSlotPhoto],
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    onActivate();
    if (!photo || !containerRef.current) return;
    const box = containerRef.current.getBoundingClientRect();
    const { maxOffsetX, maxOffsetY } = computeMaxOffsets(
      photo.naturalWidth,
      photo.naturalHeight,
      box.width,
      box.height,
      photo.transform.scale,
    );
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      startOffsetX: photo.transform.offsetX,
      startOffsetY: photo.transform.offsetY,
      maxOffsetX,
      maxOffsetY,
    };
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current || !photo) return;
    const { startX, startY, startOffsetX, startOffsetY, maxOffsetX, maxOffsetY } = dragState.current;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    const offsetX = maxOffsetX > 0 ? startOffsetX + deltaX / maxOffsetX : startOffsetX;
    const offsetY = maxOffsetY > 0 ? startOffsetY + deltaY / maxOffsetY : startOffsetY;
    updateTransform(logicalPage, slotIndex, { ...photo.transform, offsetX, offsetY });
  };

  const endDrag = () => {
    dragState.current = null;
    setIsDragging(false);
  };

  return (
    <div
      style={{
        position: "absolute",
        left: `${slot.x * 100}%`,
        top: `${slot.y * 100}%`,
        width: `${slot.width * 100}%`,
        height: `${slot.height * 100}%`,
      }}
      className={`overflow-hidden ${isActive ? "outline outline-2 outline-[var(--color-accent)] -outline-offset-2" : "outline outline-1 outline-[var(--color-border)] -outline-offset-1"}`}
    >
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onActivate();
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        className="relative h-full w-full bg-[var(--color-surface-muted)]"
        style={{ cursor: photo ? (isDragging ? "grabbing" : "grab") : "default" }}
      >
        {photo ? (
          <CroppedPhoto
            src={photo.objectUrl}
            naturalWidth={photo.naturalWidth}
            naturalHeight={photo.naturalHeight}
            transform={photo.transform}
            className="h-full w-full"
          />
        ) : (
          <label
            className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1 text-center text-[10px] text-[var(--color-text-muted)]"
            onClick={onActivate}
          >
            {busy ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
            <span>{busy ? "Loading…" : "Add photo"}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
                e.target.value = "";
              }}
            />
          </label>
        )}
      </div>
    </div>
  );
}
