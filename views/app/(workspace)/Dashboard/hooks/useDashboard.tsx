"use client";

import { useEffect, useState } from "react";
import csvStore from "@/store/csvStore";
import { get_list_csv } from "@/api/analysis";

export const useDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const uploadedFiles = csvStore((state) => state.uploadedFiles);
  const setUploadedFiles = csvStore((state) => state.setUploadedFiles);

  useEffect(() => {
    if (uploadedFiles.length > 0) {
      setIsLoading(false);
    }

    const loadFiles = async () => {
      try {
        const response = await get_list_csv();
        const files = response.data?.uploads ?? [];

        setUploadedFiles(files);
        setIsModalOpen(files.length === 0);
      } catch (error) {
        console.error("Failed to load uploaded files:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFiles();
  }, [setUploadedFiles, uploadedFiles.length]);
  return { isLoading, isModalOpen, uploadedFiles, setIsModalOpen };
};
