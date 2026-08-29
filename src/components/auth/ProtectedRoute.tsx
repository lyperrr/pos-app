import * as React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { AppLayoutSkeleton } from '@/components/loading'
import { ROUTES } from '@/constants/routes'

interface ProtectedRouteProps {
  children?: React.ReactNode
  requiredPermission?: string
}

export function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasPermission } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <AppLayoutSkeleton />
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />
  }

  return children ? <>{children}</> : <Outlet />
}
