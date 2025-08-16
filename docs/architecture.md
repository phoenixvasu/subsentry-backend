# 🏗️ Backend Architecture Documentation

## Overview

This document provides a comprehensive overview of the SubSentry backend architecture, including database schema, module breakdown, technical patterns, and system design decisions.

## 🗄️ Database Architecture

### Database Schema Overview

The application uses PostgreSQL with a normalized relational database design optimized for subscription management and user data.

#### Core Tables

**1. Users Table**

```sql
users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)
```

**2. Categories Table**

```sql
categories (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, name)
)
```

**3. Subscriptions Table**

```sql
subscriptions (
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
)
```

### Database Relationships

- **One-to-Many**: User → Categories (one user can have multiple categories)
- **One-to-Many**: User → Subscriptions (one user can have multiple subscriptions)
- **Many-to-One**: Subscription → Category (each subscription belongs to one category)
- **Cascade Deletes**: When a user is deleted, all their categories and subscriptions are automatically removed

### Database Constraints

- **Referential Integrity**: Foreign key constraints ensure data consistency
- **Data Validation**: CHECK constraints for cost (≥ 0) and billing cycle (enum values)
- **Uniqueness**: Username must be unique, category names must be unique per user
- **Timestamps**: Automatic creation and update timestamps for audit trails

## 🏛️ Application Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   PostgreSQL    │
│   (React)       │◄──►│   (Node.js)     │◄──►│   Database      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Architecture Layers

**1. Presentation Layer (Routes)**

- RESTful API endpoints
- Request/response handling
- Route protection middleware

**2. Business Logic Layer (Controllers)**

- Request validation
- Business logic orchestration
- Response formatting

**3. Service Layer (Services)**

- Core business logic
- Data transformation
- Business rules implementation

**4. Data Access Layer (Repositories)**

- Database operations
- Query optimization
- Data persistence

**5. Infrastructure Layer**

- Database connections
- Authentication
- Error handling
- Logging

## 📁 Module Breakdown

### 1. Authentication Module (`/modules/auth/`)

**Components:**

- `auth.controller.js` - Request handling and response formatting
- `auth.service.js` - Business logic for authentication
- `auth.route.js` - API endpoint definitions
- `auth.schema.js` - Input validation schemas

**Responsibilities:**

- User registration and login
- JWT token generation and validation
- Password hashing and verification
- User session management

**Key Features:**

- bcrypt password hashing
- JWT token-based authentication
- Input validation with Zod schemas
- Secure password requirements

### 2. Categories Module (`/modules/categories/`)

**Components:**

- `cat.controller.js` - Category CRUD operations
- `cat.service.js` - Category business logic
- `cat.repo.js` - Database operations for categories
- `cat.route.js` - Category API endpoints
- `cat.schema.js` - Category validation schemas

**Responsibilities:**

- Create, read, update, delete categories
- User-specific category management
- Category validation and constraints
- Category-subscription relationships

**Key Features:**

- User-scoped categories
- Unique naming per user
- Cascade delete handling
- Input validation

### 3. Subscriptions Module (`/modules/subscriptions/`)

**Components:**

- `sub.controller.js` - Subscription CRUD operations
- `sub.service.js` - Subscription business logic
- `sub.repo.js` - Database operations for subscriptions
- `sub.route.js` - Subscription API endpoints
- `sub.schema.js` - Subscription validation schemas

**Responsibilities:**

- Subscription lifecycle management
- Cost calculations and billing cycles
- Category associations
- Annualized cost computation

**Key Features:**

- Multiple billing cycles (Monthly, Quarterly, Yearly)
- Automatic annualized cost calculation
- Category-based organization
- User-scoped data access

### 4. Metrics Module (`/modules/metrics/`)

**Components:**

- `metrics.controller.js` - Metrics calculation endpoints
- `metrics.repo.js` - Data aggregation queries
- `metrics.service.js` - Financial calculations

**Responsibilities:**

- Financial metrics calculation
- Spending analysis by category
- Monthly and annual cost summaries
- Subscription count analytics

**Key Features:**

- Real-time financial calculations
- Category-wise spending breakdown
- Cost trend analysis
- Performance-optimized queries

### 5. Renewals Module (`/modules/renewals/`)

**Components:**

- `renewals.controller.js` - Renewal tracking endpoints
- `renewals.service.js` - Renewal date calculations
- `renewals.route.js` - Renewal API endpoints

**Responsibilities:**

- Upcoming renewal identification
- Renewal date calculations
- Billing cycle analysis
- Renewal notifications

**Key Features:**

- Configurable renewal windows
- Billing cycle awareness
- Date-based filtering
- Performance optimization

## 🔧 Technical Architecture

### 1. Middleware Architecture

**Authentication Middleware (`/middleware/auth.js`)**

- JWT token validation
- User context injection
- Route protection
- Error handling for auth failures

**Error Handling Middleware (`/middleware/error.js`)**

- Centralized error processing
- Consistent error responses
- Development vs production error details
- Error logging and monitoring

**Validation Middleware (`/middleware/validate.js`)**

- Request schema validation
- Input sanitization
- Error formatting
- Zod schema integration

### 2. Database Architecture

**Connection Pooling (`/config/db.js`)**

- PostgreSQL connection management
- Connection pooling for performance
- SSL configuration support
- Error handling and reconnection

**Repository Pattern**

- Clean separation of data access logic
- Reusable database operations
- Query optimization
- Transaction support

### 3. Security Architecture

**Authentication Security**

- JWT token-based authentication
- Secure password hashing with bcrypt
- Token expiration and refresh
- Route-level access control

**Data Security**

- SQL injection prevention
- Input validation and sanitization
- User data isolation
- Secure error handling

**API Security**

- CORS configuration
- Rate limiting ready
- Request size limits
- Security headers with Helmet

### 4. Performance Architecture

**Database Optimization**

- Connection pooling
- Query optimization
- Proper indexing
- Efficient JOIN operations

**API Performance**

- Async/await patterns
- Non-blocking I/O
- Response caching ready
- Pagination support

## 🔄 Data Flow Architecture

### 1. Request Flow

```
Client Request → Route → Middleware → Controller → Service → Repository → Database
```

**Detailed Flow:**

1. **Route**: Defines API endpoint and HTTP method
2. **Middleware**: Authentication, validation, CORS
3. **Controller**: Request parsing and response formatting
4. **Service**: Business logic and data transformation
5. **Repository**: Database operations and query execution
6. **Database**: Data storage and retrieval

### 2. Response Flow

```
Database → Repository → Service → Controller → Middleware → Client Response
```

**Response Processing:**

1. **Repository**: Raw data retrieval
2. **Service**: Data transformation and business logic
3. **Controller**: Response formatting and status codes
4. **Middleware**: Error handling and logging
5. **Client**: Formatted JSON response

## 🚀 Scalability Considerations

### 1. Horizontal Scaling

- Stateless API design
- Database connection pooling
- Load balancer ready
- Microservices architecture ready

### 2. Performance Optimization

- Efficient database queries
- Connection pooling
- Response caching ready
- Pagination for large datasets

### 3. Monitoring & Observability

- Comprehensive error logging
- Request/response logging
- Performance metrics ready
- Health check endpoints

## 🔧 Configuration Management

### Environment Variables

- Database connection strings
- JWT secrets and expiration
- CORS origins configuration
- Environment-specific settings

### Configuration Files

- Database migration scripts
- Seed data scripts
- Environment templates
- Deployment configurations

## 📊 API Design Patterns

### 1. RESTful Design

- Resource-based URLs
- Standard HTTP methods
- Consistent response formats
- Proper status codes

### 2. Response Standardization

- Consistent JSON structure
- Error handling patterns
- Pagination support
- Metadata inclusion

### 3. Error Handling

- Custom error classes
- HTTP status code mapping
- Error message formatting
- Development vs production details

## 🔮 Future Architecture Considerations

### 1. Microservices Ready

- Modular code structure
- Clear service boundaries
- Independent deployment ready
- API gateway integration ready

### 2. Event-Driven Architecture

- Event sourcing ready
- Message queue integration
- Asynchronous processing
- Real-time updates

### 3. Advanced Caching

- Redis integration ready
- Response caching
- Query result caching
- Session management

---

_This architecture documentation provides a comprehensive overview of the SubSentry backend system design and implementation._
