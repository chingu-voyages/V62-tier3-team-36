import { authApi } from "./axios";

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

export const register = ({ full_name, organisation_name, email, password }: Register) =>
  authApi.post("/api/signup", { full_name, organisation_name, email, password });

export const login = ({ email, password }: Login) =>
  authApi.post("/api/login", { email, password });

export const forgot_password = ({ email }: ForgotPassword) =>
  authApi.post("/api/forgot_password", { email });

export const reset_password = ({ token, password }: ResetPassword) =>
  authApi.post("/api/reset_password", { token, password });
