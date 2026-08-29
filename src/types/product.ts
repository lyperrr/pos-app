export interface Product {
  id: string
  name: string
  category: string
  category_label: string
  price: number
  cost_price?: number
  image?: string
  is_special?: boolean
  variant_id?: string | null
  barcode?: string | null
  sku?: string | null
  stock?: number
  min_stock?: number
  unit?: string
  is_active?: boolean
}

export interface ProductFilterParams {
  tenant_id?: string
  outlet_id?: string
  category_id?: string
  search?: string
  per_page?: number
  page?: number
}

export interface CreateProductDTO {
  tenant_id?: string
  outlet_id?: string
  category_id?: string
  name: string
  image?: string
  barcode?: string
  sku?: string
  price: number
  base_price?: number
  cost_price?: number
  stock?: number
  min_stock?: number
  is_special?: boolean
}

export interface CartItem {
  product_id: string
  variant_id?: string | null
  product_name: string
  unit_price: number
  quantity: number
}
