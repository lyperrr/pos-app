import apiClient from '@/lib/axios'
import type { ApiResponse, Category, CreateCategoryDTO } from '@/types'

export const categoryService = {
  /**
   * Fetch listing of categories.
   */
  async getCategories(tenantId?: string): Promise<ApiResponse<Category[]>> {
    const response = await apiClient.get<ApiResponse<Category[]>>('/categories', {
      params: tenantId ? { tenant_id: tenantId } : undefined,
    })
    return response.data
  },

  /**
   * Create a new category.
   */
  async createCategory(data: CreateCategoryDTO): Promise<ApiResponse<Category>> {
    const response = await apiClient.post<ApiResponse<Category>>('/categories', data)
    return response.data
  },
}

export default categoryService
