
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { UploadDetail } from "@/app/(workspace)/Dashboard/types";

type UploadDetailStore = {
  detail: UploadDetail | null;
  setDetail: (detail: UploadDetail | null) => void;
  clearDetail: () => void;
};

export const useUploadDetailStore = create<UploadDetailStore>()(
  persist(
    (set) => ({
      detail: null,

      setDetail: (detail) => set({ detail }),

      clearDetail: () => set({ detail: null }),
    }),
    {
      name: "upload-detail-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        detail: state.detail,
      }),
    },
  ),
);