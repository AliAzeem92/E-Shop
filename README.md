# Full-Stack E-Commerce Platform

A modern e-commerce platform built with Next.js 15, TypeScript, Tailwind CSS, MongoDB (Prisma), and NextAuth.js.

## Features

### 🏠 Homepage
- Modern hero section with featured products
- Categories section (Clothing, Electronics, Books, etc.)
- Responsive design using Tailwind CSS

### 🛍️ Products
- Product listing with search and filter functionality
- Product detail pages with reviews and ratings
- Add to cart and wishlist functionality
- Stock management

### 🛒 Cart & Checkout
- Shopping cart with quantity management
- Checkout flow with shipping address
- Stripe payment integration (test mode)
- Cash on Delivery (COD) option

### 🔐 Authentication & Roles
- User signup/login with NextAuth.js
- Role-based access control (Customer/Admin)
- Protected routes and API endpoints

### 👤 User Features
- User profile management
- Order history
- Wishlist functionality
- Product reviews and ratings

### 🔧 Admin Dashboard
- Product CRUD operations
- Order management with status updates
- Sales overview and analytics
- User management

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **UI Components**: Lucide React icons
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB database (local or MongoDB Atlas)
- Stripe account for payments

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd ecommerce-platform
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env
\`\`\`

Fill in your environment variables:
- `DATABASE_URL`: MongoDB connection string
- `NEXTAUTH_SECRET`: Random secret for NextAuth
- `NEXTAUTH_URL`: Your app URL (http://localhost:3000 for development)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `STRIPE_SECRET_KEY`: Stripe secret key

4. Set up the database:
\`\`\`bash
npx prisma generate
npx prisma db push
\`\`\`

5. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following main models:
- **User**: Customer and admin accounts
- **Product**: Product catalog with categories
- **Order**: Customer orders with items
- **CartItem**: Shopping cart functionality
- **Review**: Product reviews and ratings
- **Wishlist**: Saved products for later

## API Routes

- `/api/auth/*` - Authentication endpoints
- `/api/products` - Product CRUD operations
- `/api/cart` - Shopping cart management
- `/api/orders` - Order processing
- `/api/reviews` - Product reviews
- `/api/wishlist` - Wishlist management
- `/api/stripe/checkout` - Stripe payment processing

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production
- Set `NEXTAUTH_URL` to your production domain
- Use MongoDB Atlas for production database
- Configure Stripe with production keys

## Features Overview

### Customer Features
- Browse products with search and filters
- View detailed product information
- Add products to cart and wishlist
- Secure checkout with Stripe or COD
- Track order status
- Leave product reviews
- Manage profile and order history

### Admin Features
- Dashboard with sales analytics
- Add, edit, and delete products
- Manage product categories
- Process and update orders
- View customer information
- Inventory management

## Security Features
- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control
- Protected API routes
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.