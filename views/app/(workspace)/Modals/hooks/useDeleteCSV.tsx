"use client";

import { useState } from "react";

import { useAuthStore } from "@/store/authStore";

export const useDeleteCSV = () => {
  const user = useAuthStore((state) => state.user);
  const [error, setError] = useState(false);

  const handleDelete = () => {
    const isAdmin = user?.role.toLowerCase() === "admin";

    if (!isAdmin) {
      setError(true);
      return;
    }

    setError(false);
  };

  return { error, handleDelete };
};
