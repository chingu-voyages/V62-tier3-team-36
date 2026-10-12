import { create } from "zustand";

type UploadedFile = {
  upload_id: string;
  file_name: string;
  status: string;
  uploaded_at: string;
  valid_rows: number;
};

interface CSVProps {
  csvfile: File | null;
  uploadedFiles: UploadedFile[];
  setFile: (file: File | null) => void;
  setUploadedFiles: (files: UploadedFile[]) => void;
}

const csvStore = create<CSVProps>((set) => ({
  csvfile: null,
  uploadedFiles: [],
  setFile: (file) => set({ csvfile: file }),
  setUploadedFiles: (files) => set({ uploadedFiles: files }),
}));

export default csvStore;
