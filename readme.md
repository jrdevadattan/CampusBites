# CampusBites

CampusBites is a full-stack food ordering platform designed for campus communities. Students can browse products, add items to their cart, place orders, and track deliveries. Admins can manage products, categories, and orders efficiently.

## Features

### User Features
- Browse products by category and subcategory
- Search for products
- Add items to cart with quantity selection
- Manage delivery addresses (hostel and room details)
- Place orders with Cash on Delivery payment
- View order history with delivery status
- Dark mode support
- Mobile-responsive design

### Admin Features
- Manage products (create, edit, delete)
- Manage categories and subcategories
- View all orders with customer details
- Mark orders as delivered
- Admin dashboard with product overview

## Tech Stack

### Frontend
- React 18
- React Router for navigation
- Redux Toolkit for state management
- Tailwind CSS for styling
- Vite for build tooling
- Axios for API calls
- React Icons
- React Toastify for notifications

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication (access & refresh tokens)
- Cloudinary for image uploads
- Resend for email notifications
- Bcrypt for password hashing
- CORS enabled

## Project Structure

```
CampusBites/
├── client/               # React frontend
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── assets/      # Images and icons
│   │   ├── common/      # API endpoints config
│   │   ├── components/  # Reusable components
│   │   ├── hooks/       # Custom hooks
│   │   ├── layouts/     # Layout components
│   │   ├── pages/       # Page components
│   │   ├── provider/    # Context providers
│   │   ├── route/       # Route definitions
│   │   ├── store/       # Redux store
│   │   └── utils/       # Utility functions
│   └── package.json
├── server/              # Express backend
│   ├── api/            # API entry point
│   ├── config/         # Database and service configs
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Auth and admin middleware
│   ├── models/         # MongoDB schemas
│   ├── route/          # API routes
│   ├── utils/          # Helper functions
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Resend account (for emails)

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173
CLODINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLODINARY_API_KEY=your_cloudinary_api_key
CLODINARY_API_SECRET_KEY=your_cloudinary_secret
RESEND_API=your_resend_api_key
SECRET_KEY_ACCESS_TOKEN=your_access_token_secret
SECRET_KEY_REFRESH_TOKEN=your_refresh_token_secret
PORT=8080
ADMIN_EMAIL=your_admin_email
```

4. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:8080`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory:
```env
VITE_API_URL=http://localhost:8080
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### Build for Production

#### Client
```bash
cd client
npm run build
```

#### Server
Ensure all environment variables are set for production and deploy to your preferred platform.

## API Endpoints

### User Routes
- `POST /api/user/register` - Register new user
- `POST /api/user/login` - User login
- `GET /api/user/user-details` - Get user details
- `PUT /api/user/update-user` - Update user details
- `PUT /api/user/upload-avatar` - Upload avatar
- `PUT /api/user/forgot-password` - Forgot password
- `PUT /api/user/verify-forgot-password-otp` - Verify OTP
- `PUT /api/user/reset-password` - Reset password
- `GET /api/user/logout` - Logout
- `POST /api/user/refresh-token` - Refresh access token

### Product Routes
- `POST /api/product/create` - Create product (Admin)
- `POST /api/product/get` - Get products
- `POST /api/product/get-product-details` - Get product details
- `PUT /api/product/update-product-details` - Update product (Admin)
- `DELETE /api/product/delete-product` - Delete product (Admin)
- `POST /api/product/search-product` - Search products

### Category Routes
- `POST /api/category/add-category` - Add category (Admin)
- `GET /api/category/get` - Get categories
- `PUT /api/category/update` - Update category (Admin)
- `DELETE /api/category/delete` - Delete category (Admin)

### Cart Routes
- `POST /api/cart/create` - Add to cart
- `GET /api/cart/get` - Get cart items
- `PUT /api/cart/update-qty` - Update cart quantity
- `DELETE /api/cart/delete-cart-item` - Remove from cart

### Order Routes
- `POST /api/order/cash-on-delivery` - Place COD order
- `GET /api/order/order-list` - Get user orders
- `GET /api/order/admin/all` - Get all orders (Admin)
- `PUT /api/order/admin/update-delivered` - Update delivery status (Admin)

### Address Routes
- `POST /api/address/create` - Create address
- `GET /api/address/get` - Get addresses
- `PUT /api/address/update` - Update address
- `DELETE /api/address/disable` - Disable address

## Environment Variables

### Client (.env)
- `VITE_API_URL` - Backend API URL

### Server (.env)
- `MONGODB_URI` - MongoDB connection string
- `FRONTEND_URL` - Frontend URL for CORS
- `CLODINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLODINARY_API_KEY` - Cloudinary API key
- `CLODINARY_API_SECRET_KEY` - Cloudinary secret key
- `RESEND_API` - Resend API key
- `SECRET_KEY_ACCESS_TOKEN` - JWT access token secret
- `SECRET_KEY_REFRESH_TOKEN` - JWT refresh token secret
- `PORT` - Server port (default: 8080)
- `ADMIN_EMAIL` - Admin email for notifications

## Deployment

### Frontend (Vercel/Netlify)
1. Build the client: `npm run build`
2. Deploy the `dist` folder
3. Set `VITE_API_URL` environment variable to your backend URL

### Backend (Render/Railway/Fly.io)
1. Push code to GitHub
2. Connect repository to your hosting platform
3. Set all required environment variables
4. Deploy

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is open source and available under the MIT License.

## Contact

For questions or support, please contact the development team.

## Acknowledgments

Special thanks to [Amit Prajapati](https://github.com/IsAmitprajapati) for the original [BlinkIt Clone project](https://github.com/IsAmitprajapati/BlinkIt-Clone-Full-Stack-Ecommerce) which served as inspiration and foundation for CampusBites.
