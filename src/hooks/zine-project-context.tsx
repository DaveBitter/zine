"use client";

import { createContext, useCallback, useContext, useMemo, useReducer } from "react";
import { DEFAULT_PHOTO_TRANSFORM, PhotoTransform, clampTransform } from "@/lib/image-transform";
import { DEFAULT_LAYOUT_ID, PAGE_LAYOUTS, PageLayoutId } from "@/lib/page-layouts";
import { DEFAULT_PAPER_SIZE_ID } from "@/lib/zine-layouts/paper-sizes";
import { ZineFormat } from "@/lib/zine-layouts/types";
import { roundUpToMultipleOf4 } from "@/lib/zine-layouts/saddleStitch";
import type { ProjectPage, ProjectPhoto, ZineProject } from "@/lib/zine-project-types";

export type { ProjectPage, ProjectPhoto, ZineProject };

function buildPages(pageCount: number): ProjectPage[] {
  return Array.from({ length: pageCount }, (_, i) => ({
    logicalPage: i + 1,
    caption: "",
    layout: DEFAULT_LAYOUT_ID,
    photos: [undefined],
  }));
}

type Action =
  | { type: "CREATE_PROJECT"; format: ZineFormat; pageCount: number }
  | { type: "SET_PAGE_COUNT"; pageCount: number }
  | { type: "SET_LAYOUT"; logicalPage: number; layout: PageLayoutId }
  | { type: "SET_PHOTO"; logicalPage: number; slotIndex: number; photo: ProjectPhoto }
  | { type: "REMOVE_PHOTO"; logicalPage: number; slotIndex: number }
  | { type: "UPDATE_TRANSFORM"; logicalPage: number; slotIndex: number; transform: PhotoTransform }
  | { type: "SET_CAPTION"; logicalPage: number; caption: string }
  | { type: "RESET_PROJECT" };

function reducer(state: ZineProject | null, action: Action): ZineProject | null {
  switch (action.type) {
    case "CREATE_PROJECT": {
      const pageCount =
        action.format === "mini-zine-8" ? 8 : roundUpToMultipleOf4(action.pageCount) === action.pageCount ? action.pageCount : action.pageCount;
      return {
        format: action.format,
        paperId: DEFAULT_PAPER_SIZE_ID,
        pageCount,
        pages: buildPages(pageCount),
      };
    }
    case "RESET_PROJECT":
      return null;
    case "SET_PAGE_COUNT": {
      if (!state || state.format !== "saddle-stitch") return state;
      const pageCount = Math.max(4, action.pageCount);
      const existing = new Map(state.pages.map((p) => [p.logicalPage, p]));
      const pages = buildPages(pageCount).map((p) => existing.get(p.logicalPage) ?? p);
      return { ...state, pageCount, pages };
    }
    case "SET_LAYOUT": {
      if (!state) return state;
      const slotCount = PAGE_LAYOUTS[action.layout].slots.length;
      return {
        ...state,
        pages: state.pages.map((p) => {
          if (p.logicalPage !== action.logicalPage) return p;
          const photos = Array.from({ length: slotCount }, (_, i) => p.photos[i]);
          return { ...p, layout: action.layout, photos };
        }),
      };
    }
    case "SET_PHOTO": {
      if (!state) return state;
      return {
        ...state,
        pages: state.pages.map((p) => {
          if (p.logicalPage !== action.logicalPage) return p;
          const photos = [...p.photos];
          photos[action.slotIndex] = action.photo;
          return { ...p, photos };
        }),
      };
    }
    case "REMOVE_PHOTO": {
      if (!state) return state;
      return {
        ...state,
        pages: state.pages.map((p) => {
          if (p.logicalPage !== action.logicalPage) return p;
          const photos = [...p.photos];
          photos[action.slotIndex] = undefined;
          return { ...p, photos };
        }),
      };
    }
    case "UPDATE_TRANSFORM": {
      if (!state) return state;
      return {
        ...state,
        pages: state.pages.map((p) => {
          if (p.logicalPage !== action.logicalPage) return p;
          const existing = p.photos[action.slotIndex];
          if (!existing) return p;
          const photos = [...p.photos];
          photos[action.slotIndex] = { ...existing, transform: clampTransform(action.transform) };
          return { ...p, photos };
        }),
      };
    }
    case "SET_CAPTION": {
      if (!state) return state;
      return {
        ...state,
        pages: state.pages.map((p) =>
          p.logicalPage === action.logicalPage ? { ...p, caption: action.caption } : p,
        ),
      };
    }
    default:
      return state;
  }
}

interface ZineProjectContextValue {
  project: ZineProject | null;
  createProject: (format: ZineFormat, pageCount: number) => void;
  resetProject: () => void;
  setPageCount: (pageCount: number) => void;
  setPageLayout: (logicalPage: number, layout: PageLayoutId) => void;
  setSlotPhoto: (logicalPage: number, slotIndex: number, file: File) => Promise<void>;
  removeSlotPhoto: (logicalPage: number, slotIndex: number) => void;
  updateTransform: (logicalPage: number, slotIndex: number, transform: PhotoTransform) => void;
  setCaption: (logicalPage: number, caption: string) => void;
}

const ZineProjectContext = createContext<ZineProjectContextValue | null>(null);

export function ZineProjectProvider({ children }: { children: React.ReactNode }) {
  const [project, dispatch] = useReducer(reducer, null);

  const createProject = useCallback((format: ZineFormat, pageCount: number) => {
    dispatch({ type: "CREATE_PROJECT", format, pageCount });
  }, []);

  const resetProject = useCallback(() => dispatch({ type: "RESET_PROJECT" }), []);

  const setPageCount = useCallback((pageCount: number) => {
    dispatch({ type: "SET_PAGE_COUNT", pageCount });
  }, []);

  const setPageLayout = useCallback((logicalPage: number, layout: PageLayoutId) => {
    dispatch({ type: "SET_LAYOUT", logicalPage, layout });
  }, []);

  const setSlotPhoto = useCallback(async (logicalPage: number, slotIndex: number, file: File) => {
    const objectUrl = URL.createObjectURL(file);
    const { naturalWidth, naturalHeight } = await new Promise<{
      naturalWidth: number;
      naturalHeight: number;
    }>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight });
      img.onerror = () => reject(new Error("Could not read that image file."));
      img.src = objectUrl;
    });
    const photo: ProjectPhoto = {
      id: crypto.randomUUID(),
      objectUrl,
      naturalWidth,
      naturalHeight,
      transform: DEFAULT_PHOTO_TRANSFORM,
    };
    dispatch({ type: "SET_PHOTO", logicalPage, slotIndex, photo });
  }, []);

  const removeSlotPhoto = useCallback((logicalPage: number, slotIndex: number) => {
    dispatch({ type: "REMOVE_PHOTO", logicalPage, slotIndex });
  }, []);

  const updateTransform = useCallback((logicalPage: number, slotIndex: number, transform: PhotoTransform) => {
    dispatch({ type: "UPDATE_TRANSFORM", logicalPage, slotIndex, transform });
  }, []);

  const setCaption = useCallback((logicalPage: number, caption: string) => {
    dispatch({ type: "SET_CAPTION", logicalPage, caption });
  }, []);

  const value = useMemo(
    () => ({
      project,
      createProject,
      resetProject,
      setPageCount,
      setPageLayout,
      setSlotPhoto,
      removeSlotPhoto,
      updateTransform,
      setCaption,
    }),
    [project, createProject, resetProject, setPageCount, setPageLayout, setSlotPhoto, removeSlotPhoto, updateTransform, setCaption],
  );

  return <ZineProjectContext.Provider value={value}>{children}</ZineProjectContext.Provider>;
}

export function useZineProject(): ZineProjectContextValue {
  const ctx = useContext(ZineProjectContext);
  if (!ctx) throw new Error("useZineProject must be used within a ZineProjectProvider");
  return ctx;
}
