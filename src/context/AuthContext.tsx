import * as React from 'react'
import authService from '@/services/authService'
import type { LoginDTO, RegisterOwnerDTO, User } from '@/types'

export type DevRole = 'Owner' | 'Manager' | 'Cashier'

export const MOCK_USERS: Record<DevRole, User> = {
  Owner: {
    id: 'user-dev-owner',
    tenant_id: 'tenant-nira-001',
    outlet_id: 'outlet-nusa-dua-001',
    role_id: 'role-owner',
    full_name: 'Willy Permana (Owner)',
    email: 'owner@nirapos.id',
    is_active: true,
    tenant: {
      id: 'tenant-nira-001',
      business_name: 'NIRA Retail & Souvenir',
      business_type: 'Retail & Souvenir',
    },
    outlet: {
      id: 'outlet-nusa-dua-001',
      tenant_id: 'tenant-nira-001',
      name: 'Outlet Utama - Nusa Dua',
      is_active: true,
    },
    role: {
      id: 'role-owner',
      name: 'Owner',
      is_system_default: true,
      permissions: [], // Owner bypasses permission checks
    },
  },
  Manager: {
    id: 'user-dev-manager',
    tenant_id: 'tenant-nira-001',
    outlet_id: 'outlet-nusa-dua-001',
    role_id: 'role-manager',
    full_name: 'Siti Rahma (Manager)',
    email: 'manager@nirapos.id',
    is_active: true,
    tenant: {
      id: 'tenant-nira-001',
      business_name: 'NIRA Retail & Souvenir',
      business_type: 'Retail & Souvenir',
    },
    outlet: {
      id: 'outlet-nusa-dua-001',
      tenant_id: 'tenant-nira-001',
      name: 'Outlet Utama - Nusa Dua',
      is_active: true,
    },
    role: {
      id: 'role-manager',
      name: 'Manager',
      is_system_default: true,
      permissions: [
        { id: 'p1', code: 'product.view', module: 'products' },
        { id: 'p2', code: 'category.view', module: 'categories' },
        { id: 'p3', code: 'stock.view', module: 'stocks' },
        { id: 'p4', code: 'transaction.view', module: 'transactions' },
        { id: 'p5', code: 'report.view', module: 'reports' },
      ],
    },
  },
  Cashier: {
    id: 'user-dev-cashier',
    tenant_id: 'tenant-nira-001',
    outlet_id: 'outlet-nusa-dua-001',
    role_id: 'role-cashier',
    full_name: 'Budi Santoso (Cashier)',
    email: 'cashier@nirapos.id',
    is_active: true,
    tenant: {
      id: 'tenant-nira-001',
      business_name: 'NIRA Retail & Souvenir',
      business_type: 'Retail & Souvenir',
    },
    outlet: {
      id: 'outlet-nusa-dua-001',
      tenant_id: 'tenant-nira-001',
      name: 'Outlet Utama - Nusa Dua',
      is_active: true,
    },
    role: {
      id: 'role-cashier',
      name: 'Cashier',
      is_system_default: true,
      permissions: [
        { id: 'p6', code: 'pos.access', module: 'pos' },
        { id: 'p7', code: 'transaction.create', module: 'transactions' },
        { id: 'p8', code: 'transaction.view', module: 'transactions' },
      ],
    },
  },
}

const MOCK_ROLE_STORAGE_KEY = 'dev_mock_role'

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  isMockMode: boolean
  isApiConnected: boolean
  login: (credentials: LoginDTO) => Promise<void>
  registerOwner: (data: RegisterOwnerDTO) => Promise<void>
  loginAsMockRole: (role: DevRole) => void
  logout: () => Promise<void>
  hasPermission: (permissionCode: string) => boolean
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [token, setToken] = React.useState<string | null>(() => authService.getToken())
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [isMockMode, setIsMockMode] = React.useState<boolean>(false)
  const [isApiConnected, setIsApiConnected] = React.useState<boolean>(false)

  // Initialize session on mount (Backend token check or Developer mock role fallback)
  React.useEffect(() => {
    async function initAuth() {
      // Check if developer mock role explicitly active in localStorage
      const storedMockRole = localStorage.getItem(MOCK_ROLE_STORAGE_KEY) as DevRole | null
      if (storedMockRole && MOCK_USERS[storedMockRole]) {
        setUser(MOCK_USERS[storedMockRole])
        setToken(`mock-dev-token-${storedMockRole.toLowerCase()}`)
        setIsMockMode(true)
        setIsApiConnected(false)
        setIsLoading(false)
        return
      }

      const existingToken = authService.getToken()
      if (!existingToken) {
        // Default dev initial session: Owner (so dev can immediately view dashboard)
        loginAsMockRoleInternal('Owner')
        setIsLoading(false)
        return
      }

      try {
        const response = await authService.getProfile()
        if (response.success && response.data) {
          setUser(response.data)
          setIsMockMode(false)
          setIsApiConnected(true)
        } else {
          loginAsMockRoleInternal('Owner')
        }
      } catch (error) {
        console.warn('Backend API server unavailable. Falling back to Developer Mock session:', error)
        loginAsMockRoleInternal('Owner')
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const loginAsMockRoleInternal = (role: DevRole) => {
    const mockUser = MOCK_USERS[role]
    const mockToken = `mock-dev-token-${role.toLowerCase()}`
    localStorage.setItem(MOCK_ROLE_STORAGE_KEY, role)
    authService.setToken(mockToken)
    setToken(mockToken)
    setUser(mockUser)
    setIsMockMode(true)
    setIsApiConnected(false)
  }

  const loginAsMockRole = (role: DevRole) => {
    setIsLoading(true)
    loginAsMockRoleInternal(role)
    setIsLoading(false)
  }

  const login = async (credentials: LoginDTO) => {
    setIsLoading(true)
    try {
      const response = await authService.login(credentials)
      if (response.success && response.data) {
        localStorage.removeItem(MOCK_ROLE_STORAGE_KEY)
        setToken(response.data.token)
        setUser(response.data.user)
        setIsMockMode(false)
        setIsApiConnected(true)
      } else {
        throw new Error(response.message || 'Login gagal')
      }
    } catch (err: any) {
      console.warn('Backend API login error. Using Developer Mock session for email:', credentials.email, err)
      // Infer role from email or fallback to Owner
      let roleToUse: DevRole = 'Owner'
      if (credentials.email.includes('manager')) roleToUse = 'Manager'
      if (credentials.email.includes('cashier')) roleToUse = 'Cashier'
      loginAsMockRoleInternal(roleToUse)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const registerOwner = async (data: RegisterOwnerDTO) => {
    setIsLoading(true)
    try {
      const response = await authService.registerOwner(data)
      if (response.success && response.data) {
        localStorage.removeItem(MOCK_ROLE_STORAGE_KEY)
        setToken(response.data.token)
        setUser(response.data.user)
        setIsMockMode(false)
        setIsApiConnected(true)
      } else {
        throw new Error(response.message || 'Registrasi gagal')
      }
    } catch (err: any) {
      console.warn('Backend API registration error. Falling back to dev owner session:', err)
      loginAsMockRoleInternal('Owner')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      if (!isMockMode) {
        await authService.logout()
      }
    } catch (e) {
      console.warn('Logout error ignored:', e)
    } finally {
      localStorage.removeItem(MOCK_ROLE_STORAGE_KEY)
      authService.clearToken()
      setToken(null)
      setUser(null)
      setIsMockMode(false)
      setIsApiConnected(false)
      setIsLoading(false)
    }
  }

  const hasPermission = React.useCallback(
    (permissionCode: string): boolean => {
      if (!user) return false
      // Owner or full admin role bypass
      if (user.role?.name?.toLowerCase() === 'owner') return true
      if (!user.role?.permissions) return false
      return user.role.permissions.some((p) => p.code === permissionCode)
    },
    [user]
  )

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    isMockMode,
    isApiConnected,
    login,
    registerOwner,
    loginAsMockRole,
    logout,
    hasPermission,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
