export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
  item_count?: number
}

export interface CreateCategoryDTO {
  tenant_id: string
  name: string
  slug?: string
  icon?: string
}
