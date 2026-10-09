"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

import csvStore from "@/store/csvStore";
import { upload_csv } from "@/api/analysis";

const MAX_FILE_SIZE = 25 * 1024 * 1024;

const ACCEPTED_FILE_TYPES = ["text/csv", "application/vnd.ms-excel"];

export const useUploadCSV = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const CsvStore = csvStore();
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChooseFile = async () => {
    if (!csvFile) {
      fileInputRef.current?.click();
      return;
    }

    const csvFileSchema = z
      .custom<File>((val) => val instanceof File, {
        message: "A CSV file is required.",
      })
      .refine(
        (file) => file.size <= MAX_FILE_SIZE,
        "File size must be less than 25MB.",
      )
      .refine(
        (file) =>
          ACCEPTED_FILE_TYPES.includes(file.type) || file.name.endsWith(".csv"),
        "Only .csv files are accepted.",
      );

    const result = csvFileSchema.safeParse(csvFile);

    if (!result.success) {
      setError(result.error.issues[0].message);
      setIsModalOpen(true);
      return;
    }

    try {
      setIsUploading(true);
      setError("");

      const formData = new FormData();

      formData.append("file", csvFile);

      const response = await upload_csv(formData);

      console.log("CSV uploaded:", response.data);

      CsvStore.setFile(csvFile);

      router.push("/ValidationCSV");
    } catch (error) {
      console.error("CSV upload failed:", error);

      setError("Failed to upload CSV file. Please try again.");
      setIsModalOpen(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size / (1024 * 1024) >= 1) {
      const filesize = (file.size / (1024 * 1024)).toFixed(2);
      setFileSize(`Size : ${filesize} MB`);
    } else {
      const filesize = (file.size / 1024).toFixed(2);
      setFileSize(`Size : ${filesize} KB`);
    }

    setCsvFile(file);
    setFileName(`file name : ${file.name}`);

    setError("");
    setIsModalOpen(false);
  };

  return {
    fileInputRef,
    handleChooseFile,
    handleFileChange,
    csvFile,
    setCsvFile,
    error,
    fileName,
    setFileName,
    fileSize,
    setFileSize,
    isModalOpen,
    setIsModalOpen,
    isUploading,
  };
};
