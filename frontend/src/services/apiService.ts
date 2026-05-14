import axios from "axios";
import tokenStore from "./tokenStoreService";


const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
})


// request interceptor (middleware) -- add authHeader in request
api.interceptors.request.use((config)=>{
  const token = tokenStore.getAccessToken();
  if(token){
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
})


// response interceptor (middleware)
api.interceptors.response.use(

  // Success callback
  (response) => {
    return response;
  },

  // Error callback
  async (error) => {
    const originalRequest = error.config;

    // ✅ ye add karo
    const isAuthRoute = originalRequest.url?.includes('/auth/login') || 
                        originalRequest.url?.includes('/auth/register')

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {  // ✅ !isAuthRoute add kiya
      originalRequest._retry = true;

      try {
        const response = await axios.post(`${BASE_URL}/api/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data;
        tokenStore.set(accessToken);
        return api(originalRequest);
      } 
      catch (err) {
        tokenStore.clear();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
)