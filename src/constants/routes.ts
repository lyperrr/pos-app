export const ROUTES = {
  // Public / Auth routes
  LOGIN: '/login',
  REGISTER: '/register-owner',

  // Protected application routes
  DASHBOARD: '/dashboard',
  POS: '/pos',
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  STOCK: '/stock',
  TRANSACTIONS: '/transactions',
  REPORTS: '/reports',
  USERS: '/users',
  ROLES: '/roles',
  SETTINGS: '/settings',
  PROFILE: '/profile',

  // Error routes
  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND: '*',
} as const

export type RouteKey = keyof typeof ROUTES
