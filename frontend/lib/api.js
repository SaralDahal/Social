// API base URL - point this to your Express backend
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function apiFetch(endpoint, options = {}) {
  const headers = { ...options.headers };

  // Only set Content-Type for non-FormData requests
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: "include", // Include cookies automatically
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Something went wrong");
  }

  return res.json();
}

// Auth helpers
export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("awaaz_token");
}

export function setToken(token) {
  localStorage.setItem("awaaz_token", token);
}

export function removeToken() {
  localStorage.removeItem("awaaz_token");
}

export function getAuthHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function apiFetchAuth(endpoint, options) {
  return apiFetch(endpoint, {
    ...options,
    headers: {
      ...getAuthHeader(),
      ...options?.headers,
    },
  });
}

// ---- API Endpoint Helpers ----
// Maps to your Express routes:
//   app.use('/api/auth', authRoutes)
//   app.use('/api/posts', postRoutes)
//   app.use('/api/complaints', complaintRoutes)
//   app.use('/api/comments', commentRoutes)
//   app.use('/api/users', userRoutes)

export const authApi = {
  login: (data) => {
    console.log("Attempting login with data:", data);
    return apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },
  signup: (data) =>
    apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  me: () => apiFetchAuth("/auth/me"),
};

export const postsApi = {
  getAll: (category) =>
    apiFetch(`/posts${category ? `?category=${category}` : ""}`),
  getById: (id) => apiFetch(`/posts/${id}`),
  create: (data) =>
    apiFetchAuth("/posts", {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),
  like: (id) => apiFetchAuth(`/posts/${id}/like`, { method: "POST" }),
  dislike: (id) => apiFetchAuth(`/posts/${id}/dislike`, { method: "POST" }),
  share: (id) => apiFetchAuth(`/posts/${id}/share`, { method: "POST" }),
};

export const complaintsApi = {
  getAll: (status) =>
    apiFetch(`/complaints${status ? `?status=${status}` : ""}`),
  create: (data) =>
    apiFetchAuth("/complaints", {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),
  upvote: (id) =>
    apiFetchAuth(`/complaints/${id}/upvote`, { method: "POST" }),
};

export const commentsApi = {
  getByPost: (postId) => apiFetch(`/comments?postId=${postId}`),
  create: (data) =>
    apiFetchAuth("/comments", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  like: (id) => apiFetchAuth(`/comments/${id}/like`, { method: "POST" }),
};

export const usersApi = {
  getProfile: (id) => apiFetch(`/users/${id}`),
  update: (id, data) =>
    apiFetchAuth(`/users/${id}`, {
      method: "PUT",
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),
  follow: (id) => apiFetchAuth(`/users/${id}/follow`, { method: "POST" }),
};
