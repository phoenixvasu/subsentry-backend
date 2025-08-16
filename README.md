# 🚀 SubSentry Backend

A robust, scalable Node.js backend API for the SubSentry subscription management application. Built with Express.js, PostgreSQL, and modern JavaScript practices.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Environment Variables](#-environment-variables)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- 🔐 **JWT Authentication** - Secure user authentication and authorization
- 🗄️ **PostgreSQL Database** - Robust data storage with proper relationships
- 📊 **Subscription Management** - CRUD operations for subscription services
- 🏷️ **Category Management** - Organize subscriptions by categories
- 📈 **Metrics & Analytics** - Financial insights and spending analysis
- ⏰ **Renewal Tracking** - Upcoming renewal notifications
- 🔒 **Security Features** - CORS, Helmet, input validation
- 📝 **API Documentation** - Comprehensive endpoint documentation
- 🚀 **Production Ready** - Optimized for deployment on Render

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod schema validation
- **Security**: bcrypt, helmet, CORS
- **Logging**: Morgan
- **Environment**: dotenv
- **Database Driver**: pg (node-postgres)

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** 18.0.0 or higher
- **PostgreSQL** 12.0 or higher
- **npm** or **yarn** package manager
- **Git** for version control

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd subsentry-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

```bash
# Copy the example environment file
cp env.example .env

# Edit .env with your configuration
nano .env
```

### 4. Set Up Database

```bash
# Create PostgreSQL database
createdb subsentry

# Run database migrations
npm run db:migrate

# Seed with sample data (optional)
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Your API will be running at `http://localhost:4000`

## 📁 Project Structure

```
subsentry-backend/
├── src/                          # Source code
│   ├── app.js                   # Express app configuration
│   ├── server.js                # Server entry point
│   ├── routes.js                # Main router configuration
│   ├── config/                  # Configuration files
│   │   └── db.js               # Database connection
│   ├── middleware/              # Express middleware
│   │   ├── auth.js             # Authentication middleware
│   │   ├── error.js            # Error handling middleware
│   │   └── validate.js         # Validation middleware
│   ├── modules/                 # Feature modules
│   │   ├── auth/               # Authentication module
│   │   ├── categories/         # Categories management
│   │   ├── subscriptions/      # Subscriptions management
│   │   ├── metrics/            # Analytics and metrics
│   │   └── renewals/           # Renewal tracking
│   └── utils/                  # Utility functions
├── scripts/                     # Database scripts
│   ├── dbMigrate.js            # Database migrations
│   ├── resetDb.js              # Database reset utility
│   └── seedRealData.js         # Sample data seeding
├── sql/                        # SQL schema files
│   ├── 001_init.sql           # Initial database schema
│   └── 002_categories.sql     # Categories table schema
├── package.json                # Dependencies and scripts
├── .env                        # Environment variables
└── README.md                   # This file
```

## 📚 API Documentation

### Base URL

```
http://localhost:4000/api
```

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### 🔐 Authentication

- `POST /auth/register` - User registration
- `POST /auth/login` - User login

#### 📱 Subscriptions

- `GET /subscriptions` - List user subscriptions
- `POST /subscriptions` - Create new subscription
- `PUT /subscriptions/:id` - Update subscription
- `DELETE /subscriptions/:id` - Delete subscription

#### 🏷️ Categories

- `GET /categories` - List user categories
- `POST /categories` - Create new category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

#### 📊 Metrics

- `GET /metrics` - Get user financial metrics

#### ⏰ Renewals

- `GET /renewals` - Get upcoming renewals

#### 🏥 Health Check

- `GET /` - API status
- `GET /health` - Detailed health information

### Request/Response Examples

#### Create Subscription

```bash
POST /api/subscriptions
Authorization: Bearer <token>
Content-Type: application/json

{
  "service_name": "Netflix Premium",
  "cost": 799.00,
  "billing_cycle": "Monthly",
  "category": 1,
  "auto_renews": true,
  "start_date": "2025-01-15"
}
```

#### Response

```json
{
  "message": "Subscription created successfully",
  "data": {
    "id": 1,
    "service_name": "Netflix Premium",
    "cost": "799.00",
    "billing_cycle": "Monthly",
    "category": 1,
    "auto_renews": true,
    "start_date": "2025-01-15",
    "annualized_cost": "9588.00"
  }
}
```

## 🗄️ Database Schema

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Categories Table

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, name)
);
```

### Subscriptions Table

```sql
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  category INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  cost NUMERIC(10,2) NOT NULL CHECK (cost >= 0),
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('Monthly','Quarterly','Yearly')),
  auto_renews BOOLEAN NOT NULL DEFAULT TRUE,
  start_date DATE NOT NULL,
  annualized_cost NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/subsentry
DB_SSL=false

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=4000
NODE_ENV=development

# CORS Configuration
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
FRONTEND_URL=http://localhost:5173
```

## 🚀 Development

### Available Scripts

```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run db:migrate   # Run database migrations
npm run db:reset     # Reset database (drop all tables)
npm run db:seed      # Seed database with sample data
```

### Development Workflow

1. **Create Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**

   - Follow the existing code structure
   - Add proper error handling
   - Include input validation
   - Write clear comments

3. **Test Your Changes**

   ```bash
   # Test database operations
   npm run db:test

   # Test API endpoints
   curl http://localhost:4000/api/health
   ```

4. **Commit and Push**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

### Code Style Guidelines

- Use ES6+ features
- Follow consistent naming conventions
- Add JSDoc comments for functions
- Handle errors gracefully
- Validate all inputs
- Use async/await for database operations

## 🧪 Testing

### Manual Testing

```bash
# Test health endpoint
curl http://localhost:4000/api/health

# Test authentication
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'

# Test protected endpoint
curl http://localhost:4000/api/subscriptions \
  -H "Authorization: Bearer <your-token>"
```

### Database Testing

```bash
# Test database connection
npm run db:test

# Reset and seed database
npm run db:reset
npm run db:seed
```

## 🚀 Deployment

### Render Deployment

1. **Connect Repository**

   - Link your GitHub repository
   - Select the `subsentry-backend` folder

2. **Configure Service**

   - Environment: Node
   - Build Command: `npm install && npm run db:migrate`
   - Start Command: `npm start`

3. **Set Environment Variables**

   ```bash
   DATABASE_URL=postgresql://...
   DB_SSL=true
   JWT_SECRET=your-production-secret
   NODE_ENV=production
   CORS_ORIGINS=https://your-frontend.vercel.app
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)

### Environment Variables for Production

```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database
DB_SSL=true

# Security
JWT_SECRET=your-super-secret-jwt-key-64-characters-long
JWT_EXPIRES_IN=24h

# Configuration
NODE_ENV=production
CORS_ORIGINS=https://your-frontend-domain.com
FRONTEND_URL=https://your-frontend-domain.com
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for password security
- **Input Validation** - Zod schema validation
- **CORS Protection** - Configurable cross-origin requests
- **Security Headers** - Helmet.js for security headers
- **SQL Injection Protection** - Parameterized queries
- **Rate Limiting** - Built-in Express.js protection

## 📊 Performance

- **Connection Pooling** - Efficient database connections
- **Indexed Queries** - Optimized database performance
- **Caching Ready** - Structure supports Redis integration
- **Async Operations** - Non-blocking I/O operations

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Failed

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Verify connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL
```

#### Port Already in Use

```bash
# Find process using port 4000
lsof -i :4000

# Kill process
kill -9 <PID>
```

#### JWT Token Issues

```bash
# Verify JWT_SECRET is set
echo $JWT_SECRET

# Check token expiration
jwt decode <your-token>
```

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm run dev

# Check environment variables
node -e "console.log(process.env)"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Contribution Guidelines

- Follow existing code style
- Add proper documentation
- Include error handling
- Test your changes
- Update this README if needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter issues:

1. **Check the logs** - Look for error messages
2. **Verify configuration** - Check environment variables
3. **Test endpoints** - Use curl or Postman
4. **Check database** - Verify PostgreSQL connection
5. **Review documentation** - Check this README

### Getting Help

- Create an issue on GitHub
- Check existing issues for solutions
- Review the deployment guide
- Test with the provided examples

## 🎯 Roadmap

- [ ] Add Redis caching
- [ ] Implement rate limiting
- [ ] Add API versioning
- [ ] Include GraphQL support
- [ ] Add WebSocket support
- [ ] Implement file uploads
- [ ] Add comprehensive testing
- [ ] Include API documentation (Swagger)

---

**Happy Coding! 🚀**

For deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
