import axios from "axios";

interface Register {
  full_name: string;
  organisation_name: string;
  password: string;
  email: string;
}

interface Login {
  email: string;
  password: string;
}

interface ResetPassword {
  token: string;
  password: string;
}

interface ForgotPassword {
  email: string;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const register = ({ full_name, organisation_name, email, password }: Register) =>
  api.post("/api/signup", { full_name, organisation_name, email, password });

export const login = ({ email, password }: Login) =>
  api.post("/api/login", { email, password });

export const forgot_password = ({ email }: ForgotPassword) =>
  api.post("/api/forgot_password", { email });

export const reset_password = ({ token, password }: ResetPassword) =>
  api.post("/api/reset_password", { token, password });
