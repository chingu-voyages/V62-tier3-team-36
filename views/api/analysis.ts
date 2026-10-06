import { analysisApi } from "./axios";

export const get_list_csv = () => {
  const token = localStorage.getItem("access_token");

  return analysisApi.get("/api/analysis/uploads", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};