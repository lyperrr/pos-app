export interface Product {
  id: string
  name: string
  category: string
  category_label: string
  price: number
  image: string
  is_special: boolean
  variant_id: string | null
  barcode?: string | null
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
  tenant_id: string
  outlet_id: string
  category_id?: string
  name: string
  image?: string
  barcode?: string
  base_price: number
  is_special?: boolean
}
