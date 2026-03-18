# OmniBiz - Complete Business Management Platform

[![Deploy to Netlify](https://img.shields.io/badge/Deploy-Netlify-00C7B7?style=flat-square&logo=netlify)](https://netlify.com)
[![Deploy to Render](https://img.shields.io/badge/Deploy-Render-46E3B7?style=flat-square&logo=render)](https://render.com)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-222222?style=flat-square&logo=github)](https://pages.github.com)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=flat-square)](LICENSE)

> Your all-in-one business management solution for inventory, e-commerce, payments, and analytics.

![OmniBiz Dashboard](docs/assets/dashboard-preview.png)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Development](#-development)
- [Deployment](#-deployment)
- [Security](#-security)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎯 Core Modules

| Module | Description |
|--------|-------------|
| **Dashboard** | Real-time analytics, KPIs, and business insights |
| **Inventory** | Stock management, tracking, and automated alerts |
| **Orders** | Order processing, fulfillment, and tracking |
| **Customers** | CRM, customer profiles, and purchase history |
| **Finance** | Invoicing, payments, and financial reports |
| **Team** | User management, roles, and permissions |
| **Services** | Service requests, appointments, and bookings |
| **Analytics** | Advanced reporting and data visualization |

### 🔐 User Roles & Permissions

- **Super Admin** - Full system access and configuration
- **Admin** - Manage users, orders, and settings
- **Manager** - Oversee operations and staff
- **Staff** - Daily operations and customer service
- **Client** - Customer portal and order management

### 🚀 Key Capabilities

- ✅ Real-time inventory tracking
- ✅ Multi-location support
- ✅ Payment gateway integration (M-Pesa, Stripe, PayPal)
- ✅ Email & SMS notifications
- ✅ PWA support for offline usage
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark/Light theme
- ✅ Export reports (PDF, Excel, CSV)
- ✅ API webhooks & integrations
- ✅ Activity logging & audit trails

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS 4** - Styling
- **Radix UI** - Accessible components
- **Framer Motion** - Animations
- **React Router 7** - Navigation
- **Socket.IO Client** - Real-time updates
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Workbox** - Service worker & PWA

### Backend
- **Node.js 22** - Runtime
- **Express 4** - Web framework
- **MongoDB** - Database
- **Mongoose 7** - ODM
- **Socket.IO** - WebSocket server
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Multer** - File uploads
- **Winston** - Logging

### DevOps
- **GitHub Actions** - CI/CD
- **Netlify** - Frontend hosting
- **Render** - Backend hosting
- **GitHub Pages** - Static deployment

---

## 🚀 Quick Start

### Prerequisites

- Node.js 22+
- MongoDB (local or Atlas)
- npm or pnpm

### 1-Minute Setup

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/omnibiz.git
cd omnibiz

# Install dependencies
npm install

# Setup environment files
cp server/.env.example server/.env
cp client/.env.example client/.env

# Start development servers
npm run dev
```

Visit:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000

---

## 📦 Installation

### Backend Setup

```bash
cd server
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Start server
npm run dev
```

### Frontend Setup

```bash
cd client
npm install

# Configure environment
cp .env.example client/.env
# Edit .env with your API URLs

# Start dev server
npm run dev
```

### Create Admin User

```bash
cd server
node scripts/createAdmin.js
# Follow prompts to create super admin
```

---

## ⚙️ Configuration

### Environment Variables

#### Backend (`.env`)

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/omnibiz
MONGO_URI=mongodb://localhost:27017/omnibiz

# Authentication
JWT_SECRET=your_super_secure_jwt_secret_key

# URLs
CLIENT_URL=http://localhost:5173
FRONTEND_URL=https://your-domain.com

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# M-Pesa (Optional)
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_SHORTCODE=shortcode
MPESA_PASSKEY=passkey
MPESA_ENVIRONMENT=sandbox

# Cloudinary (File Upload)
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# AI (Optional)
GEMINI_API_KEY=your_gemini_key
DEEPSEEK_API_KEY=your_deepseek_key
```

#### Frontend (`.env`)

```env
# API Configuration
VITE_API_URL=http://localhost:5000

# OAuth (Optional)
VITE_GOOGLE_CLIENT_ID=your_client_id
VITE_GITHUB_CLIENT_ID=your_client_id

# Feature Flags
VITE_ENABLE_PWA=true
VITE_ENABLE_WEBSOCKETS=true
```

---

## 💻 Development

### Available Scripts

#### Root Level
```bash
npm run dev          # Start both frontend & backend
npm run server       # Start backend only
npm run client       # Start frontend only
npm run build        # Build for production
npm run electron     # Run as desktop app
```

#### Backend (`/server`)
```bash
npm run dev          # Development with nodemon
npm start            # Production server
npm test             # Run tests
```

#### Frontend (`/client`)
```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint check
```

### Project Structure

```
omnibiz/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── lib/           # Utilities & helpers
│   │   └── assets/        # Static assets
│   └── public/
├── server/                 # Express backend
│   ├── controllers/       # Route controllers
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── middlewares/       # Auth & validation
│   ├── services/          # Business logic
│   └── config/            # Configuration
├── docs/                  # Documentation
├── .github/workflows/     # CI/CD pipelines
└── package.json
```

---

## 🌐 Deployment

### Frontend Options

#### Netlify (Recommended)

1. Connect GitHub repository at [netlify.com](https://netlify.com)
2. Build settings:
   - **Base directory:** (empty)
   - **Build command:** `cd client && npm install && npm run build`
   - **Publish directory:** `client/dist`
3. Set environment variables
4. Deploy

See [NETLIFY_DEPLOY.md](docs/NETLIFY_DEPLOY.md) for details.

#### GitHub Pages

```bash
# Update package.json homepage
"homepage": "https://YOURUSERNAME.github.io/omnibiz"

# Deploy
npm run deploy
```

See [GITHUB_PAGES.md](docs/GITHUB_PAGES.md) for details.

### Backend Options

#### Render

1. Create new Web Service
2. Connect repository
3. Build command: `cd server && npm install`
4. Start command: `node server.js`
5. Add environment variables

#### Alternative: Railway, Heroku, Vercel

---

## 🔒 Security

### Best Practices

- ✅ Environment variables never committed
- ✅ Passwords hashed with bcrypt
- ✅ JWT authentication with expiration
- ✅ CORS configured for allowed origins
- ✅ Rate limiting on API endpoints
- ✅ Input validation & sanitization
- ✅ HTTPS in production
- ✅ Security headers configured

### Sensitive Files

**Never commit these files:**
- `.env` - Contains actual credentials
- `*.log` - May contain sensitive data
- `node_modules/` - Dependencies

**Safe to commit:**
- `.env.example` - Template with placeholders
- `.gitignore` - Ignore patterns
- Documentation files

### Role-Based Access Control

```javascript
// Example permission check
const { requireAdmin } = require('../middlewares/roleMiddleware');

router.get('/admin/users', protect, requireAdmin, getUsers);
```

---

## 📚 API Documentation

### Authentication

```bash
# Register
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure123"
}

# Login
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "secure123"
}

# Get Profile
GET /api/auth/profile
Headers: Authorization: Bearer <token>
```

### Orders

```bash
# Create Order
POST /api/client/orders
Headers: Authorization: Bearer <token>
{
  "items": [...],
  "totalAmount": 1000
}

# Get My Orders
GET /api/client/orders
Headers: Authorization: Bearer <token>
```

### Admin

```bash
# Get All Orders
GET /api/admin/orders
Headers: Authorization: Bearer <token>

# Approve Order
PUT /api/admin/orders/:id/approve
Headers: Authorization: Bearer <token>
```

Full API documentation: [docs/API.md](docs/API.md)

---

## 🤝 Contributing

We welcome contributions! Here's how to help:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Ensure linting passes

---

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

- **Documentation:** [docs/](docs/)
- **Issues:** [GitHub Issues](https://github.com/YOUR_USERNAME/omnibiz/issues)
- **Email:** support@omnibiz.com

---

## 🙏 Acknowledgments

Built with amazing open-source tools:
- [React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)
- [Socket.IO](https://socket.io)
- [MongoDB](https://mongodb.com)

---

**Made with ❤️ by the OmniBiz Team**
