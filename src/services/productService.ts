import apiClient from '@/lib/axios'
import type { ApiResponse, CreateProductDTO, Product, ProductFilterParams } from '@/types'

export const productService = {
  /**
   * Fetch listing of products with filter, search, and pagination.
   */
  async getProducts(params?: ProductFilterParams): Promise<ApiResponse<Product[]>> {
    const response = await apiClient.get<ApiResponse<Product[]>>('/products', {
      params,
    })
    return response.data
  },

  /**
   * Fetch a single product by ID.
   */
  async getProductById(id: string): Promise<ApiResponse<Product>> {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`)
    return response.data
  },

  /**
   * Create a new product.
   */
  async createProduct(data: CreateProductDTO): Promise<ApiResponse<Product>> {
    const response = await apiClient.post<ApiResponse<Product>>('/products', data)
    return response.data
  },

  /**
   * Soft delete a product.
   */
  async deleteProduct(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(`/products/${id}`)
    return response.data
  },

  /**
   * Restore a soft-deleted product.
   */
  async restoreProduct(id: string): Promise<ApiResponse<Product>> {
    const response = await apiClient.post<ApiResponse<Product>>(`/products/${id}/restore`)
    return response.data
  },
}

export default productService
