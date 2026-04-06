// API client for Tour Vinh Hy backend

const getApiBaseUrl = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const normalizeBlog = (blog = {}) => ({
  ...blog,
  date: blog.date || blog.createdAt || null
});

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
  const response = await fetch(`${getApiBaseUrl()}/tours`, {
    next: { revalidate: 3600, tags: ["tours"] }
  });
  if (!response.ok) return [];
  return response.json();
};

export const getTourBySlug = async (slug) => {
  const response = await fetch(`${getApiBaseUrl()}/tours/${slug}`, {
    next: { revalidate: 3600, tags: [`tour-${slug}`] }
  });
  if (!response.ok) return null;
  return response.json();
};

export const getBlogs = async () => {
  const response = await fetch(`${getApiBaseUrl()}/blogs`, {
    next: { revalidate: 3600, tags: ["blogs"] }
  });
  if (!response.ok) return [];
  const blogs = await response.json();
  return blogs.map(normalizeBlog);
};

export const getBlogBySlug = async (slug) => {
  const response = await fetch(`${getApiBaseUrl()}/blogs/${slug}`, {
    next: { revalidate: 3600, tags: [`blog-${slug}`] }
  });

  if (!response.ok) return null;

  const blog = await response.json();
  return normalizeBlog(blog);
};
