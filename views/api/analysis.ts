import { api } from "./axios";

export const upload_csv = (data: FormData) => {
  return api.post("/api/analysis/uploads", data);
};

export const get_list_csv = () => {
  return api.get("/api/analysis/uploads");
};

export const get_upload_csv = (uploadId: string) => {
  return api.get(`/api/analysis/uploads/${uploadId}`);
};