export const baseURL = import.meta.env.VITE_API_URL

const SummaryApi = {
    // ADDED: Regular authentication endpoints
    register: {
        url: "/api/auth/register",
        method: "post"
    },
    login: {
        url: "/api/auth/login",
        method: "post"
    },
    logout: {
        url: "/api/auth/logout",
        method: "get"
    },
    // ADDED: Password reset endpoints
    forgot_password: {
        url: "/api/auth/forgot-password",
        method: "put"
    },
    forgot_password_otp_verification: {
        url: "/api/auth/verify-forgot-password-otp",
        method: "put"
    },
    resetPassword: {
        url: "/api/auth/reset-password",
        method: "put"
    },
    // ADDED: Email verification endpoints
    verifyEmail: {
        url: "/api/auth/verify-email",
        method: "post"
    },
    resendVerifyEmail: {
        url: "/api/auth/resend-verify-email",
        method: "post"
    },
    // ADDED: Token and user endpoints
    refreshToken: {
        url: "/api/auth/refresh-token",
        method: "post"
    },
    userDetails: {
        url: "/api/auth/user-details",
        method: "get"
    },
    // Existing Google authentication
    googleRegister: {
        url: "/api/auth/google-register",
        method: "post"
    },
    googleLogin: {
        url: "/api/auth/google-login",
        method: "post"
    },
    // Existing product and other endpoints
    uploadImage: {
        url: "/api/file/upload",
        method: "post"
    },
    addCategory: {
        url: "/api/category/add-category",
        method: "post"
    },
    getCategory: {
        url: "/api/category/get",
        method: "get"
    },
    updateCategory: {
        url: "/api/category/update",
        method: "put"
    },
    deleteCategory: {
        url: "/api/category/delete",
        method: "delete"
    },
    createSubCategory: {
        url: "/api/subcategory/create",
        method: "post"
    },
    getSubCategory: {
        url: "/api/subcategory/get",
        method: "post"
    },
    updateSubCategory: {
        url: "/api/subcategory/update",
        method: "put"
    },
    deleteSubCategory: {
        url: "/api/subcategory/delete",
        method: "delete"
    },
    createProduct: {
        url: "/api/product/create",
        method: "post"
    },
    getProduct: {
        url: "/api/product/get",
        method: "post"
    },
    getProductByCategory: {
        url: "/api/product/get-product-by-category",
        method: "post"
    },
    getProductByCategoryAndSubCategory: {
        url: "/api/product/get-pruduct-by-category-and-subcategory",
        method: "post"
    },
    getProductDetails: {
        url: "/api/product/get-product-details",
        method: "post"
    },
    updateProductDetails: {
        url: "/api/product/update-product-details",
        method: "put"
    },
    deleteProduct: {
        url: "/api/product/delete-product",
        method: "delete"
    },
    searchProduct: {
        url: "/api/product/search-product",
        method: "post"
    },
    addTocart: {
        url: "/api/cart/create",
        method: "post"
    },
    getCartItem: {
        url: "/api/cart/get",
        method: "get"
    },
    updateCartItemQty: {
        url: "/api/cart/update-qty",
        method: "put"
    },
    deleteCartItem: {
        url: "/api/cart/delete-cart-item",
        method: "delete"
    },
    createAddress: {
        url: "/api/address/create",
        method: "post"
    },
    getAddress: {
        url: "/api/address/get",
        method: "get"
    },
    updateAddress: {
        url: "/api/address/update",
        method: "put"
    },
    disableAddress: {
        url: "/api/address/disable",
        method: "delete"
    },
    CashOnDeliveryOrder: {
        url: "/api/order/cash-on-delivery",
        method: "post"
    },
    payment_url: {
        url: "/api/order/checkout",
        method: "post"
    },
    getOrderItems: {
        url: "/api/order/order-list",
        method: "get"
    }
}

export default SummaryApi