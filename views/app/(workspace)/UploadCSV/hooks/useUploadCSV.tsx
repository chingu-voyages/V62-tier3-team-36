"use client";

import { useRef } from "react";

export const useUploadCSV = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const MAX_FILE_SIZE = 25 * 1024 * 1024;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert("Maximum file size is 25 MB");
      return;
    }

    console.log(file);
  };
  return {
    fileInputRef,
    handleChooseFile,
    handleFileChange,
  };
};
