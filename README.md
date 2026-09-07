#  Online Store API

A robust and scalable RESTful API for an online store built with Node.js, Express, TypeScript, and PostgreSQL. Features user authentication, product management, and order processing with comprehensive test coverage.

##  Features

- **User Authentication** - JWT-based registration and login
- **Product Management** - Full CRUD operations for products
- **Order Processing** - Create and manage customer orders
- **Security** - Password hashing with bcrypt, environment variable protection
- **Type Safety** - Built with TypeScript for better development experience
- **Testing** - Comprehensive test suite with 72% coverage
- **Database** - PostgreSQL with migrations and Docker support

##  Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with db-migrate
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt for password hashing
- **Testing**: Jest, Supertest
- **Containerization**: Docker & Docker Compose
- **Environment Management**: dotenv

##  Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (or use Docker)
- npm or yarn

##  Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd online-store-api
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=store_dev
DB_USER=postgres
DB_PASSWORD=password

# JWT
BCRYPT_PASSWORD=your-secret-pepper
SALT_ROUNDS=10
JWT_SECRET=your-jwt-secret-key

# Server
PORT=3000
NODE_ENV=development
```

### 3. Database Setup

**Option A: Using Docker (Recommended)**

```bash
docker-compose up -d
```

**Option B: Local PostgreSQL**

```bash
# Create database manually
createdb store_dev
```

### 4. Run Migrations

```bash
npx db-migrate up
```

### 5. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production build and start
npm run build
npm start
```

The API will be running at `http://localhost:3000`

##  Testing

The project includes a comprehensive test suite:

```bash
# Run all tests with coverage
npm run test:all

# Run specific test suites
npm run test:models        # Model tests
npm run test:api           # API endpoint tests  
npm run test:integration   # Integration tests

# Run tests in watch mode
npm run test:watch

# Current coverage: 72% (57/57 tests passing)
```


##  API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (protected)
- `PUT /api/products/:id` - Update product (protected)
- `DELETE /api/products/:id` - Delete product (protected)

### Orders
- `GET /api/orders` - Get all orders (protected)
- `GET /api/orders/:id` - Get order by ID (protected)
- `POST /api/orders` - Create new order (protected)
- `PUT /api/orders/:id` - Update order status (protected)

### Users
- `GET /api/users` - Get all users (protected)
- `GET /api/users/:id` - Get user by ID (protected)

##  Available Scripts

```bash
npm run dev          # Start development server with ts-node
npm run build        # Build TypeScript to JavaScript
npm start           # Start production server
npm test            # Run all tests
npm run test:all    # Run tests with coverage
npm run test:watch  # Run tests in watch mode
```

##  Database Schema

The database includes the following tables:

- **users** - User accounts and authentication
- **products** - Product catalog
- **orders** - Customer orders
- **order_products** - Order items (many-to-many relationship)

##  Docker Support

The project includes Docker configuration for easy database setup:

```bash
# Start PostgreSQL database
docker-compose up -d

# Stop database
docker-compose down
```

##  Project Structure

```text
online-store-api/
├── src/
│   ├── models/         # Data models and business logic
│   ├── handlers/       # Route handlers
│   ├── tests/          # Test suites
│   └── server.ts       # Application entry point
├── migrations/         # Database migration files
├── dist/              # Compiled JavaScript (generated)
├── coverage/          # Test coverage reports (generated)
└── package.json
```

##  Security Features

- Password hashing with bcrypt
- JWT token authentication
- Environment variable protection
- Input validation
- SQL injection prevention

##  Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables for Production

Set the following in your production environment:

- `NODE_ENV=production`
- `JWT_SECRET` (strong secret key)
- Database connection strings
- `BCRYPT_PASSWORD` (pepper for additional security)

##  Testing Your API

### Manual Testing

```powershell
# Test products endpoint
Invoke-RestMethod -Uri "http://localhost:3000/api/products"

# Test user registration
$body = @{username="testuser"; first_name="Test"; last_name="User"; password="test123"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/users/register" -Method Post -Body $body -ContentType "application/json"

# Test user login
$loginBody = @{username="testuser"; password="test123"} | ConvertTo-Json
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/users/login" -Method Post -Body $loginBody -ContentType "application/json"
```

### Automated Testing

```bash
# Run complete test suite
npm run test:all

# Expected output: 57/57 tests passing with 72% coverage
```

##  API Response Examples

### User Registration

```json
{
  "user": {
    "id": 1,
    "username": "testuser",
    "first_name": "Test",
    "last_name": "User",
    "created_at": "2025-10-27T10:30:40.412Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Products List

```json
[
  {
    "id": 1,
    "name": "Test Product",
    "price": "19.99",
    "category": "Electronics",
    "description": "A test product",
    "created_at": "2025-10-26T15:19:28.996Z"
  }
]
```

##  Troubleshooting

### Common Issues

**Port 3000 already in use:**

```bash
# Windows
taskkill /f /im node.exe

# Mac/Linux
pkill -f node
```

**Database connection errors:**

- Verify PostgreSQL is running
- Check `.env` file configuration
- Ensure database exists

**Migration errors:**

```bash
# Reset and rerun migrations
npx db-migrate reset
npx db-migrate up
```

**Test watch mode requires git:**

```bash
git init
git add .
git commit -m "Initial commit"
```

##  Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request


