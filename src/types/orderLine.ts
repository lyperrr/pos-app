import type { OrderType } from './transaction'

export interface LiveOrdersParams {
  outlet_id?: string
  order_type?: OrderType | 'all'
}
