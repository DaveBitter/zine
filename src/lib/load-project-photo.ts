import { DEFAULT_PHOTO_TRANSFORM } from "@/lib/image-transform";
import type { ProjectPhoto } from "@/lib/zine-project-types";

/** Reads a File into a ProjectPhoto (object URL + natural size + default transform), ready to drop into a slot. */
export function loadProjectPhoto(file: File): Promise<ProjectPhoto> {
  const objectUrl = URL.createObjectURL(file);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () =>
      resolve({
        id: crypto.randomUUID(),
        objectUrl,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        transform: DEFAULT_PHOTO_TRANSFORM,
      });
    img.onerror = () => reject(new Error("Could not read that image file."));
    img.src = objectUrl;
  });
}
