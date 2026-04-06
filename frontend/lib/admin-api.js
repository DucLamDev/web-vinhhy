"use client";

import { getToken } from "./auth";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getAdminHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const adminRequest = async (path, options = {}) => {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      ...getAdminHeaders(),
      ...(options.headers || {})
    }
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.message || "Admin request failed");
  }

  return body;
};
