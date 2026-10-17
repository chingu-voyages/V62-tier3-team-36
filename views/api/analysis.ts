import { api } from "./axios";
import type { UploadDetail } from "@/app/(workspace)/Dashboard/types";

export type AIInsight = {
  type: string;
  title: string;
  description: string;
  recommendation: string;
};

export const upload_csv = (data: FormData) => {
  return api.post("/api/analysis/uploads", data);
};

export const get_list_csv = () => {
  return api.get("/api/analysis/uploads");
};

export const get_upload_csv = (uploadId: string) => {
  return api.get<UploadDetail>(`/api/analysis/uploads/${uploadId}`);
};

export const get_upload_insights = (uploadId: string) => {
  return api.get<AIInsight[]>(`/api/analysis/uploads/${uploadId}/insights`);
};

export const generate_upload_insights = (uploadId: string) => {
  return api.post<AIInsight[]>(`/api/analysis/uploads/${uploadId}/insights`);
};

export const regenerate_upload_insights = (uploadId: string) => {
  return api.post<AIInsight[]>(
    `/api/analysis/uploads/${uploadId}/insights/regenerate`,
  );
};
