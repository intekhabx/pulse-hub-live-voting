import axios from "axios";
import tokenStore from "./tokenStoreService";


const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
})


// request interceptor (middleware) -- add authHeader in request
api.interceptors.request.use((config)=>{
  const token = tokenStore.getAccessToken();
  if(token){
    config.headers = config.headers ?? {} as any;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
})


// ⭐ ADD THIS
// Ek time par sirf ek refresh request chalegi
let refreshPromise: Promise<string> | null = null;


// response interceptor (middleware)
api.interceptors.response.use(

  // Success callback
  (response) => {
    return response;
  },

  // Error callback
  async (error) => {

    // check user is stored in localstorage or not
    const user = tokenStore.getUser();
    if (!user) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    const url = originalRequest.url || '';

    const isAuthRoute = url.includes('/auth/login') || 
                        url.includes('/auth/register') ||
                        url.includes('/auth/refresh-token');

    // Only retry on 401, not on other errors
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;
      console.log('🔄 Token expired, attempting refresh...');

      try {

        // ⭐ ADD THIS LOGIC
        // Agar already refresh ho raha hai,
        // to same refresh request ka wait karo.
        if (!refreshPromise) {

          refreshPromise = api.post('/api/auth/refresh-token', {}, {
              withCredentials: true
            })
            .then((refreshResponse) => {

              console.log('📩 Refresh response:', refreshResponse.data);

              const newToken = refreshResponse.data?.data?.accessToken;

              if (!newToken) {
                throw new Error('No token in refresh response');
              }

              console.log('✅ New token received');

              tokenStore.set(newToken);

              return newToken;
            })
            .finally(() => {
              // Refresh complete hone ke baad
              // promise ko reset kar do.
              refreshPromise = null;
            });
        }

        // Existing refresh ka result wait karo
        const newToken = await refreshPromise;

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        originalRequest.withCredentials = true;

        console.log('🔁 Retrying original request...');

        return api(originalRequest);

      } catch (err: any) {

        console.error('❌ Token refresh failed:', err?.message);
        tokenStore.clear();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
)
