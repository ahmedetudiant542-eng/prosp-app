import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_htoken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const refresh = localStorage.getItem("refresh_token");
      if (refresh) {
        try {
          const { data } = await axios.post("/api/v1/auth/refresh", { refreshToken: refresh });
          localStorage.setItem("access_token", data.data.accessToken);
          error.config.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return api(error.config);
        } catch {
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export const authApi = {
  login: (data: any) => api.post("/auth/login", data),
  register: (data: any) => api.post("/auth/register", data),
  refresh: (token: string) => api.post("/auth/refresh", { refreshToken: token }),
  me: () => api.get("/users/me"),
};

export const prospectsApi = {
  list: (params?: any) => api.get("/prospects", { params }),
  get: (id: string) => api.get(`/prospects/${id}`),
  create: (data: any) => api.post("/prospects", data),
  update: (id: string, data: any) => api.patch(`/prospects/${id}`, data),
  delete: (id: string) => api.delete(`/prospects/${id}`),
  bulkCreate: (prospects: any[]) => api.post("/prospects/bulk", { prospects }),
};

export const campaignsApi = {
  list: () => api.get("/campaigns"),
  get: (id: string) => api.get(`/campaigns/${id}`),
  create: (data: any) => api.post("/campaigns", data),
  update: (id: string, data: any) => api.patch(`/campaigns/${id}`, data),
  delete: (id: string) => api.delete(`/campaigns/${id}`),
  launch: (id: string) => api.post(`/campaigns/${id}/launch`),
  pause: (id: string) => api.post(`/campaigns/${id}/pause`),
};

export const analyticsApi = {
  dashboard: () => api.get("/analytics/dashboard"),
  trends: (days?: number) => api.get("/analytics/trends", { params: { days } }),
};

export const aiApi = {
  generateMessage: (data: any) => api.post("/ai/generate-message", data),
  enrich: (prospect: any) => api.post("/ai/enrich", { prospect }),
};
