"use client";

export interface AuthUser {
  id: string;
  full_name: string;
  organisation_name: string;
  email: string;
  role: string;
}

export interface AuthSession {
  token: string;
  refreshToken?: string;
  user: AuthUser;
}

const getStorage = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
};

export const setAuthSession = ({ token, refreshToken, user }: AuthSession) => {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.setItem("access_token", token);

  if (refreshToken) {
    storage.setItem("refresh_token", refreshToken);
  }

  storage.setItem("user_data", JSON.stringify(user));
};

export const getUserData = (): AuthUser | null => {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  const rawUser = storage.getItem("user_data");
  
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    return null;
  }   
};

export const clearAuthSession = () => {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.removeItem("access_token");
  storage.removeItem("refresh_token");
  storage.removeItem("user_data");
};