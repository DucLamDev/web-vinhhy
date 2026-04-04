import { fallbackTours } from "./mock-data";
import { applyTourOverride, applyTourOverrides, getTourOverrideBySlug } from "./tour-overrides";

const getApiBaseUrl = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getAuthHeaders = (token) =>
  token
    ? {
        Authorization: `Bearer ${token}`
      }
    : {};

export const apiRequest = async (path, options = {}) => {
  const url = `${getApiBaseUrl()}${path}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || "Request failed");
  }

  return response.json();
};

export const getTours = async () => {
  try {
    const tours = await fetch(`${getApiBaseUrl()}/tours`, {
      next: { revalidate: 3600, tags: ["tours"] }
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Unable to fetch tours");
      }
      return response.json();
    });

    return applyTourOverrides(tours);
  } catch (_error) {
    return applyTourOverrides(fallbackTours);
  }
};

export const getTourBySlug = async (slug) => {
  try {
    const tour = await fetch(`${getApiBaseUrl()}/tours/${slug}`, {
      next: { revalidate: 3600, tags: [`tour-${slug}`] }
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Unable to fetch tour");
      }
      return response.json();
    });

    return applyTourOverride(tour);
  } catch (_error) {
    return applyTourOverride(fallbackTours.find((tour) => tour.slug === slug)) || getTourOverrideBySlug(slug);
  }
};
