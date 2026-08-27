export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page?: number
  total: number
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
  meta?: PaginationMeta
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  meta: PaginationMeta
}

export interface ApiErrorResponse {
  message: string
  errors?: Record<string, string[]>
  status?: number
}
