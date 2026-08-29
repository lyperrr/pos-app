import apiClient from '@/lib/axios'
import type { ApiResponse, CreateOutletDTO, Outlet, UpdateOutletDTO } from '@/types'

export const outletService = {
  /**
   * Fetch all outlets for current tenant with optional search.
   */
  async getOutlets(search?: string): Promise<ApiResponse<Outlet[]>> {
    const response = await apiClient.get<ApiResponse<Outlet[]>>('/outlets', {
      params: { search },
    })
    return response.data
  },

  /**
   * Fetch details of a single outlet.
   */
  async getOutlet(id: string): Promise<ApiResponse<Outlet>> {
    const response = await apiClient.get<ApiResponse<Outlet>>(`/outlets/${id}`)
    return response.data
  },

  /**
   * Create a new branch outlet (Owner Only).
   */
  async createOutlet(data: CreateOutletDTO): Promise<ApiResponse<Outlet>> {
    const response = await apiClient.post<ApiResponse<Outlet>>('/outlets', data)
    return response.data
  },

  /**
   * Update an existing outlet (Owner Only).
   */
  async updateOutlet(id: string, data: UpdateOutletDTO): Promise<ApiResponse<Outlet>> {
    const response = await apiClient.put<ApiResponse<Outlet>>(`/outlets/${id}`, data)
    return response.data
  },

  /**
   * Soft delete an outlet (Owner Only).
   */
  async deleteOutlet(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(`/outlets/${id}`)
    return response.data
  },

  /**
   * Restore a soft deleted outlet (Owner Only).
   */
  async restoreOutlet(id: string): Promise<ApiResponse<Outlet>> {
    const response = await apiClient.post<ApiResponse<Outlet>>(`/outlets/${id}/restore`)
    return response.data
  },
}

export default outletService
