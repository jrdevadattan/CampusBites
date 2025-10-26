import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import SearchPage from '../pages/SearchPage'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ForgotPassword from '../pages/ForgotPassword'
import OtpVerification from '../pages/OtpVerification'
import ResetPassword from '../pages/ResetPassword'
import UserMenuMobile from '../pages/UserMenuMobile'
import Dashboard from '../layouts/Dashboard'
import Profile from '../pages/Profile'
import Address from '../pages/Address'
import CategoryPage from '../pages/CategoryPage'
import SubCategoryPage from '../pages/SubCategoryPage'
import UploadProduct from '../pages/UploadProduct'
import ProductAdmin from '../pages/ProductAdmin'
import AdminOrders from '../pages/AdminOrders'
import ProductDisplayPage from '../pages/ProductDisplayPage'
import ProductListPage from '../pages/ProductListPage'
import CartMobile from '../pages/CartMobile'
import CheckoutPage from '../pages/CheckoutPage'
import Success from '../pages/Success'
import Cancel from '../pages/Cancel'
import MyOrders from '../pages/MyOrders'

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '',
                element: <Home />
            },
            {
                path: 'search',
                element: <SearchPage />
            },
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'register',
                element: <Register />
            },
            {
                path: 'forgot-password',
                element: <ForgotPassword />
            },
            {
                path: 'verification-otp',
                element: <OtpVerification />
            },
            {
                path: 'verify-email',
                element: <OtpVerification />
            },
            {
                path: 'reset-password',
                element: <ResetPassword />
            },
            {
                path: 'user',
                element: <UserMenuMobile />
            },
            {
                path: 'dashboard',
                element: <Dashboard />,
                children: [
                    {
                        path: 'profile',
                        element: <Profile />
                    },
                    {
                        path: 'myorders',
                        element: <MyOrders />
                    },
                    {
                        path: 'address',
                        element: <Address />
                    },
                    {
                        path: 'category',
                        element: <CategoryPage />
                    },
                    {
                        path: 'subcategory',
                        element: <SubCategoryPage />
                    },
                    {
                        path: 'upload-product',
                        element: <UploadProduct />
                    },
                    {
                        path: 'product',
                        element: <ProductAdmin />
                    },
                    {
                        path: 'orders',
                        element: <AdminOrders />
                    },
                ]
            },
            {
                path: 'c/:category',
                element: <CategoryPage />
            },
            {
                path: 'c/:category/:subCategory',
                element: <SubCategoryPage />
            },
            {
                path: 'product/:product',
                element: <ProductDisplayPage />
            },
            {
                path: 'product',
                element: <ProductListPage />
            },
            {
                path: 'cart',
                element: <CartMobile />
            },
            {
                path: 'checkout',
                element: <CheckoutPage />
            },
            {
                path: 'success',
                element: <Success />
            },
            {
                path: 'cancel',
                element: <Cancel />
            }
        ]
    }
])

export default router