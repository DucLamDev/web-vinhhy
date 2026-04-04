"use client";

const TOKEN_KEY = "tour-vinh-hy-token";
const AUTH_EVENT = "tour-auth-updated";

export const saveToken = (token) => {
  if (typeof window !== "undefined" && token) {
    window.localStorage.setItem(TOKEN_KEY, token);
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
};

export const getToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(TOKEN_KEY);
};

export const clearToken = () => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
};

export const authEventName = AUTH_EVENT;
