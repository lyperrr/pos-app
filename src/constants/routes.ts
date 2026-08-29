export const ROUTES = {
  // Public / Auth routes
  LOGIN: '/login',
  REGISTER: '/register-owner',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

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
  OUTLETS: '/outlets',
  SETTINGS: '/settings',
  PROFILE: '/profile',

  // Error routes
  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND: '*',
} as const

export type RouteKey = keyof typeof ROUTES
