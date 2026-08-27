import apiClient from '@/lib/axios'
import type { ApiResponse, LiveOrdersParams, Transaction } from '@/types'

export const orderLineService = {
  /**
   * Fetch live active order line cards.
   */
  async getLiveOrders(params?: LiveOrdersParams): Promise<ApiResponse<Transaction[]>> {
    const response = await apiClient.get<ApiResponse<Transaction[]>>('/orders/live', {
      params,
    })
    return response.data
  },
}

export default orderLineService
