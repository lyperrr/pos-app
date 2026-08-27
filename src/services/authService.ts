import apiClient from '@/lib/axios'
import type { ApiResponse, AuthData, LoginDTO, RegisterOwnerDTO, User } from '@/types'

const TOKEN_KEY = 'auth_token'

export const authService = {
  /**
   * Register a new business tenant & owner account.
   */
  async registerOwner(data: RegisterOwnerDTO): Promise<ApiResponse<AuthData>> {
    const response = await apiClient.post<ApiResponse<AuthData>>('/auth/register-owner', data)
    if (response.data.success && response.data.data?.token) {
      this.setToken(response.data.data.token)
    }
    return response.data
  },

  /**
   * Authenticate owner or cashier with email and password.
   */
  async login(credentials: LoginDTO): Promise<ApiResponse<AuthData>> {
    const response = await apiClient.post<ApiResponse<AuthData>>('/auth/login', credentials)
    if (response.data.success && response.data.data?.token) {
      this.setToken(response.data.data.token)
    }
    return response.data
  },

  /**
   * Logout user and remove token.
   */
  async logout(): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.post<ApiResponse<null>>('/auth/logout')
      return response.data
    } finally {
      this.clearToken()
    }
  },

  /**
   * Get current authenticated user profile and permissions.
   */
  async getProfile(): Promise<ApiResponse<User>> {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me')
    return response.data
  },

  /**
   * LocalStorage Token Helper methods.
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
  },

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY)
  },
}

export default authService
