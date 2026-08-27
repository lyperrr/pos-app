import apiClient from '@/lib/axios'
import type { ApiResponse, CreateTransactionDTO, Transaction, VoidTransactionDTO } from '@/types'

export const transactionService = {
  /**
   * Fetch transaction history with pagination.
   */
  async getTransactions(outletId?: string, page: number = 1): Promise<ApiResponse<Transaction[]>> {
    const response = await apiClient.get<ApiResponse<Transaction[]>>('/transactions', {
      params: {
        ...(outletId ? { outlet_id: outletId } : {}),
        page,
      },
    })
    return response.data
  },

  /**
   * Create a new transaction (Checkout / Place Order).
   */
  async createTransaction(data: CreateTransactionDTO): Promise<ApiResponse<Transaction>> {
    const response = await apiClient.post<ApiResponse<Transaction>>('/transactions', data)
    return response.data
  },

  /**
   * Void / Cancel an existing transaction.
   */
  async voidTransaction(id: string, data: VoidTransactionDTO): Promise<ApiResponse<Transaction>> {
    const response = await apiClient.post<ApiResponse<Transaction>>(`/transactions/${id}/void`, data)
    return response.data
  },
}

export default transactionService
