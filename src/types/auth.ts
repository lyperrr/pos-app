export interface Tenant {
  id: string
  business_name: string
  business_type?: string
  subscription_status?: string
}

export interface Outlet {
  id: string
  tenant_id: string
  name: string
  address?: string | null
  phone?: string | null
  is_active: boolean
}

export interface Permission {
  id: string
  code: string
  module: string
  description?: string | null
}

export interface Role {
  id: string
  tenant_id?: string | null
  name: string
  is_system_default: boolean
  permissions?: Permission[]
}

export interface User {
  id: string
  tenant_id: string
  outlet_id: string
  role_id: string
  full_name: string
  email: string
  phone?: string | null
  is_active: boolean
  tenant?: Tenant
  outlet?: Outlet
  role?: Role
}

export interface RegisterOwnerDTO {
  business_name: string
  business_type?: string
  full_name: string
  email: string
  password: string
  phone?: string
  outlet_name?: string
  outlet_address?: string
}

export interface LoginDTO {
  email: string
  password: string
}

export interface AuthData {
  user: User
  token: string
}

export interface RolesResponseData {
  roles: Role[]
  available_permissions: Permission[]
}

export interface CreateRoleDTO {
  name: string
  permission_ids?: string[]
}

export interface UpdateRoleDTO {
  name?: string
  permission_ids?: string[]
}
