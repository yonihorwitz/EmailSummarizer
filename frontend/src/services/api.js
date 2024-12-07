import axios from "axios";

const api = axios.create({
  baseURL: "/api"
});

export const login = async (username, password) => {
  try {
      const nylasUrl = await api.get("/nylas/auth");
      window.location.href = nylasUrl.data.authUrl;      
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getCurrentUser = async () => {
  const response = await api.get("/current_user");
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const validateAuth = async (code) => {
  try {
    const response = await api.post("/auth/validate", { code });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 

export const getEmails = async () => {
  const response = await api.get("/emails");
  return response.data;
};

export const syncEmails = async () => {
  const response = await api.post("/sync");
  return response.data;
}; 