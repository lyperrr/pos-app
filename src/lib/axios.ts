import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { ApiErrorResponse } from '@/types'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Example: Add Auth token if available
    const token = localStorage.getItem('auth_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Return standard response data directly or whole response
    return response
  },
  (error: AxiosError<ApiErrorResponse>) => {
    // Standardize error payload extraction for easier FE error handling
    const formattedError: ApiErrorResponse = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred.',
      errors: error.response?.data?.errors,
      status: error.response?.status || 500,
    }

    return Promise.reject(formattedError)
  }
)

export default apiClient
