import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import RootLayout from './pages/RootLayout'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Auth from './pages/Auth'
import Admin from './pages/Admin'
import About from './pages/About'
import Contact from './pages/Contact'
import Wishlist from './pages/Wishlist'
import NotFound from './pages/NotFound'
import AdminOrders from './pages/admin/Orders'
import AdminProducts from './pages/admin/Products'
import AdminCategories from './pages/admin/Categories'
import AdminUsers from './pages/admin/Users'
import { StoreProvider } from './lib/store'
import AdminGuard from './pages/admin/AdminGuard'
import { ToastProvider } from './lib/toast'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'products', element: <Products /> },
      { path: 'products/:id', element: <ProductDetail /> },
      { path: 'cart', element: <Cart /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'wishlist', element: <Wishlist /> },
      { path: 'auth', element: <Auth /> },
      {
        path: 'admin',
        element: <AdminGuard><Admin /></AdminGuard>,
        children: [
          { index: true, element: <AdminOrders /> },
          { path: 'orders', element: <AdminOrders /> },
          { path: 'products', element: <AdminProducts /> },
          { path: 'categories', element: <AdminCategories /> },
          { path: 'users', element: <AdminUsers /> },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])

const clerkKey = (import.meta as any).env?.VITE_CLERK_PUBLISHABLE_KEY

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkKey}>
      <ToastProvider>
        <StoreProvider>
          <RouterProvider router={router} />
        </StoreProvider>
      </ToastProvider>
    </ClerkProvider>
  </React.StrictMode>,
)
