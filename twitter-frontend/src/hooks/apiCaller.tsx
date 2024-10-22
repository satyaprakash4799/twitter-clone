import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const apiClient: AxiosInstance = axios.create({
  baseURL: "http://localhost:4000", // Set the base URL for your API
  timeout: 10000, // Set a timeout limit
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach tokens, modify headers, or log requests before sending
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Modify or log response before passing it to the caller
    return response;
  },
  (error) => {
    // Handle errors globally, show messages, or log them
    if (error.response) {
      // Server response with a status code outside of 2xx
      console.error("Error response:", error.response);
    } else if (error.request) {
      // Request was made but no response
      console.error("No response:", error.request);
    } else {
      // Other errors (setup, config, etc.)
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
