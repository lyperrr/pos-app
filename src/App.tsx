import * as React from "react"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import { AuthProvider } from "@/context/AuthContext"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { AuthLayout } from "@/components/layout/AuthLayout"
import { AppLayout } from "@/components/layout/AppLayout"
import {
  DashboardSkeleton,
  PosSkeleton,
  TableSkeleton,
  PageSkeleton,
} from "@/components/loading"
import { ROUTES } from "@/constants/routes"

// Lazy loaded page components
const LoginPage = React.lazy(() => import("@/pages/auth/LoginPage"))
const RegisterPage = React.lazy(() => import("@/pages/auth/RegisterPage"))
const ForgotPasswordPage = React.lazy(() => import("@/pages/auth/ForgotPasswordPage"))
const ResetPasswordPage = React.lazy(() => import("@/pages/auth/ResetPasswordPage"))
const DashboardPage = React.lazy(() => import("@/pages/dashboard/DashboardPage"))
const PosPage = React.lazy(() => import("@/pages/pos/PosPage"))
const ProductListPage = React.lazy(() => import("@/pages/products/ProductListPage"))
const CategoryListPage = React.lazy(() => import("@/pages/categories/CategoryListPage"))
const StockManagementPage = React.lazy(() => import("@/pages/stock/StockManagementPage"))
const TransactionHistoryPage = React.lazy(() => import("@/pages/transactions/TransactionHistoryPage"))
const SalesReportPage = React.lazy(() => import("@/pages/reports/SalesReportPage"))
const UserManagementPage = React.lazy(() => import("@/pages/users/UserManagementPage"))
const RoleManagementPage = React.lazy(() => import("@/pages/roles/RoleManagementPage"))
const OutletManagementPage = React.lazy(() => import("@/pages/outlets/OutletManagementPage"))
const OutletSettingsPage = React.lazy(() => import("@/pages/settings/OutletSettingsPage"))
const ProfilePage = React.lazy(() => import("@/pages/settings/ProfilePage"))
const NotFoundPage = React.lazy(() => import("@/pages/errors/NotFoundPage"))
const UnauthorizedPage = React.lazy(() => import("@/pages/errors/UnauthorizedPage"))

const router = createBrowserRouter([
  // Public / Auth Layout Routes
  {
    element: <AuthLayout />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: (
          <React.Suspense fallback={<PageSkeleton />}>
            <LoginPage />
          </React.Suspense>
        ),
      },
      {
        path: ROUTES.REGISTER,
        element: (
          <React.Suspense fallback={<PageSkeleton />}>
            <RegisterPage />
          </React.Suspense>
        ),
      },
      {
        path: ROUTES.FORGOT_PASSWORD,
        element: (
          <React.Suspense fallback={<PageSkeleton />}>
            <ForgotPasswordPage />
          </React.Suspense>
        ),
      },
      {
        path: ROUTES.RESET_PASSWORD,
        element: (
          <React.Suspense fallback={<PageSkeleton />}>
            <ResetPasswordPage />
          </React.Suspense>
        ),
      },
    ],
  },

  // Protected Main App Layout Routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/",
            element: <Navigate to={ROUTES.DASHBOARD} replace />,
          },
          {
            path: ROUTES.DASHBOARD,
            element: (
              <React.Suspense fallback={<DashboardSkeleton />}>
                <DashboardPage />
              </React.Suspense>
            ),
          },
          {
            path: ROUTES.POS,
            element: (
              <React.Suspense fallback={<PosSkeleton />}>
                <PosPage />
              </React.Suspense>
            ),
          },
          {
            path: ROUTES.PRODUCTS,
            element: (
              <ProtectedRoute requiredPermission="product.view">
                <React.Suspense fallback={<TableSkeleton />}>
                  <ProductListPage />
                </React.Suspense>
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTES.CATEGORIES,
            element: (
              <ProtectedRoute requiredPermission="category.view">
                <React.Suspense fallback={<PageSkeleton />}>
                  <CategoryListPage />
                </React.Suspense>
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTES.STOCK,
            element: (
              <ProtectedRoute requiredPermission="stock.view">
                <React.Suspense fallback={<TableSkeleton />}>
                  <StockManagementPage />
                </React.Suspense>
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTES.TRANSACTIONS,
            element: (
              <ProtectedRoute requiredPermission="transaction.view">
                <React.Suspense fallback={<TableSkeleton />}>
                  <TransactionHistoryPage />
                </React.Suspense>
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTES.REPORTS,
            element: (
              <ProtectedRoute requiredPermission="report.view">
                <React.Suspense fallback={<DashboardSkeleton />}>
                  <SalesReportPage />
                </React.Suspense>
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTES.USERS,
            element: (
              <ProtectedRoute requiredPermission="user.manage">
                <React.Suspense fallback={<TableSkeleton />}>
                  <UserManagementPage />
                </React.Suspense>
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTES.ROLES,
            element: (
              <ProtectedRoute requiredPermission="role.manage">
                <React.Suspense fallback={<PageSkeleton />}>
                  <RoleManagementPage />
                </React.Suspense>
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTES.OUTLETS,
            element: (
              <ProtectedRoute requiredPermission="setting.manage">
                <React.Suspense fallback={<PageSkeleton />}>
                  <OutletManagementPage />
                </React.Suspense>
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTES.SETTINGS,
            element: (
              <ProtectedRoute requiredPermission="setting.manage">
                <React.Suspense fallback={<PageSkeleton />}>
                  <OutletSettingsPage />
                </React.Suspense>
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTES.PROFILE,
            element: (
              <React.Suspense fallback={<PageSkeleton />}>
                <ProfilePage />
              </React.Suspense>
            ),
          },
          {
            path: ROUTES.UNAUTHORIZED,
            element: (
              <React.Suspense fallback={<PageSkeleton />}>
                <UnauthorizedPage />
              </React.Suspense>
            ),
          },
          {
            path: ROUTES.NOT_FOUND,
            element: (
              <React.Suspense fallback={<PageSkeleton />}>
                <NotFoundPage />
              </React.Suspense>
            ),
          },
        ],
      },
    ],
  },
])

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
