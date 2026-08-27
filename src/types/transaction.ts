export type OrderType = 'dine_in' | 'wait_list' | 'take_away' | 'served'
export type PaymentMethod = 'cash' | 'card' | 'scan' | 'midtrans' | 'xendit'
export type PaymentStatus = 'paid' | 'pending' | 'failed'
export type TransactionStatus = 'completed' | 'voided' | 'pending'

export interface TransactionItem {
  id: string
  product_variant_id: string
  name: string
  quantity: number
  unit_price: number
  subtotal: number
}

export interface Transaction {
  id: string
  order_number: string
  table_number: string | null
  people_count: number
  order_type: OrderType
  subtotal: number
  tax_amount: number
  donation_amount: number
  discount_amount: number
  total_amount: number
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  status: TransactionStatus
  created_at?: string
  items: TransactionItem[]
}

export interface CreateTransactionItemDTO {
  product_variant_id: string
  quantity: number
  unit_price: number
}

export interface CreateTransactionDTO {
  outlet_id: string
  cashier_id: string
  member_id?: string
  order_number?: string
  table_number?: string
  people_count?: number
  order_type?: OrderType
  tax_amount?: number
  donation_amount?: number
  discount_amount?: number
  payment_method: PaymentMethod
  payment_status?: PaymentStatus
  items: CreateTransactionItemDTO[]
}

export interface VoidTransactionDTO {
  voided_by: string
  reason: string
}
