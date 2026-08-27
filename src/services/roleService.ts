import apiClient from '@/lib/axios'
import type { ApiResponse, CreateRoleDTO, Role, RolesResponseData, UpdateRoleDTO } from '@/types'

export const roleService = {
  /**
   * Fetch all roles and available permissions for the current tenant.
   */
  async getRoles(): Promise<ApiResponse<RolesResponseData>> {
    const response = await apiClient.get<ApiResponse<RolesResponseData>>('/roles')
    return response.data
  },

  /**
   * Create a new custom role with permissions.
   */
  async createRole(data: CreateRoleDTO): Promise<ApiResponse<Role>> {
    const response = await apiClient.post<ApiResponse<Role>>('/roles', data)
    return response.data
  },

  /**
   * Update an existing role and its permissions.
   */
  async updateRole(id: string, data: UpdateRoleDTO): Promise<ApiResponse<Role>> {
    const response = await apiClient.put<ApiResponse<Role>>(`/roles/${id}`, data)
    return response.data
  },

  /**
   * Delete a custom role (soft delete).
   */
  async deleteRole(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(`/roles/${id}`)
    return response.data
  },

  /**
   * Restore a soft-deleted custom role.
   */
  async restoreRole(id: string): Promise<ApiResponse<Role>> {
    const response = await apiClient.post<ApiResponse<Role>>(`/roles/${id}/restore`)
    return response.data
  },
}

export default roleService
