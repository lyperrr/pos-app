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

// Request Interceptor: Attach Sanctum Bearer Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
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

// Response Interceptor: Format All Error Messages to User-Friendly Bahasa Indonesia
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status
    const serverMessage = error.response?.data?.message
    const errors = error.response?.data?.errors

    let userFriendlyMessage = 'Terjadi kesalahan sistem. Silakan coba beberapa saat lagi.'

    if (errors && typeof errors === 'object') {
      // Extract first validation error message from backend Laravel response
      const firstField = Object.keys(errors)[0]
      if (firstField && Array.isArray(errors[firstField]) && errors[firstField][0]) {
        userFriendlyMessage = errors[firstField][0]
      } else if (serverMessage) {
        userFriendlyMessage = serverMessage
      }
    } else if (serverMessage) {
      userFriendlyMessage = serverMessage
    } else if (status === 404) {
      userFriendlyMessage = 'Layanan API backend tidak ditemukan. Pastikan server backend berjalan pada port 8000.'
    } else if (status === 401) {
      userFriendlyMessage = 'Sesi login Anda telah berakhir. Silakan masuk kembali.'
    } else if (status === 403) {
      userFriendlyMessage = 'Anda tidak memiliki hak akses untuk melakukan tindakan ini.'
    } else if (status === 422) {
      userFriendlyMessage = 'Data yang Anda masukkan tidak valid. Silakan periksa kembali.'
    } else if (status === 500) {
      userFriendlyMessage = 'Terjadi kendala pada server backend. Silakan coba beberapa saat lagi.'
    } else if (error.code === 'ERR_NETWORK') {
      userFriendlyMessage = 'Tidak dapat terhubung ke server backend API. Pastikan server Laravel aktif.'
    }

    const formattedError: ApiErrorResponse = {
      message: userFriendlyMessage,
      errors: errors,
      status: status || 500,
    }

    return Promise.reject(formattedError)
  }
)

export default apiClient
