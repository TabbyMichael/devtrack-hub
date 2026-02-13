# DevTrack Hub - Enterprise Productivity Tracker

[![CI/CD](https://github.com/yourusername/devtrack-hub/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/devtrack-hub/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

DevTrack Hub is an enterprise-grade productivity tracking application designed for developers to monitor and analyze their work sessions across various projects. Built with modern technologies and security best practices, it provides comprehensive time tracking, analytics, and team collaboration features.

## 🚀 Key Features

### Core Functionality
- **User Authentication**: Secure JWT-based authentication with refresh token rotation
- **OAuth Integration**: GitHub and Google OAuth support
- **Password Reset**: Secure password recovery system
- **Project Management**: Create, organize, and manage multiple projects
- **Session Tracking**: Real-time session tracking with pause/resume functionality
- **Analytics Dashboard**: Comprehensive productivity insights and reporting
- **Data Export**: Export session data to CSV and JSON formats
- **Real-time Updates**: WebSocket integration for live session status

### Enterprise Features
- **Team Collaboration**: Multi-user workspace management
- **Role-Based Access Control**: Granular permissions system
- **Audit Logging**: Comprehensive activity tracking
- **Data Retention**: Configurable data retention policies
- **API Rate Limiting**: Multi-tier rate limiting for security
- **Backup & Recovery**: Automated backup strategies

## 🏗️ Architecture

### Technology Stack

**Backend (NestJS)**
- **Framework**: NestJS 11.x with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with refresh tokens, Passport.js
- **Caching**: Redis with cache manager
- **Background Jobs**: BullMQ for task processing
- **Logging**: Winston with daily rotation
- **Monitoring**: Prometheus metrics, Sentry error tracking
- **Documentation**: Swagger/OpenAPI 3.0
- **Security**: Helmet, rate limiting, input validation

**Frontend (React)**
- **Framework**: React 18 with TypeScript
- **UI Library**: Shadcn UI components
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **API Client**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Testing**: Vitest with React Testing Library
- **Build Tool**: Vite

**Infrastructure**
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana (planned)
- **Deployment**: Production-ready configurations

## 📦 Getting Started

### Prerequisites
- Node.js 18.x or higher
- Docker & Docker Compose
- PostgreSQL (if running without Docker)
- Redis (if running without Docker)

### Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/yourusername/devtrack-hub.git
cd devtrack-hub

# Start all services
docker-compose up -d

# Run database migrations
docker-compose exec backend npx prisma migrate deploy

# Generate Prisma client
docker-compose exec backend npx prisma generate

# Access the application
# Frontend: http://localhost
# Backend API: http://localhost:3000
# API Documentation: http://localhost:3000/api/docs
```

### Development Setup

```bash
# Backend setup
cd BackEnd
npm install
cp .env.example .env  # Configure your environment variables
npx prisma migrate dev
npx prisma generate
npm run start:dev

# Frontend setup (in another terminal)
cd FrontEnd
npm install
npm run dev
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/devtrack"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-min-32-chars"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# OAuth (Optional)
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Email Service (for password reset)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"

# Redis
REDIS_HOST="localhost"
REDIS_PORT="6379"

# CORS
CORS_ORIGINS="http://localhost:3000,http://localhost:5173"
```

### Production Deployment

1. **Configure Production Environment**
   ```bash
   # Update environment variables for production
   # Use strong secrets and proper database connections
   ```

2. **Build and Deploy**
   ```bash
   # Build Docker images
   docker-compose build
   
   # Deploy to production server
   docker-compose up -d
   ```

3. **Run Migrations**
   ```bash
   docker-compose exec backend npx prisma migrate deploy
   ```

## 🛡️ Security Features

### Authentication & Authorization
- **JWT Token Management**: Secure token generation and validation
- **Refresh Token Rotation**: Automatic token refresh with security
- **Rate Limiting**: Multi-tier rate limiting to prevent abuse
- **OAuth Integration**: Secure third-party authentication
- **Password Security**: Bcrypt hashing with 12 rounds

### Data Protection
- **Input Validation**: Comprehensive validation and sanitization
- **CORS Configuration**: Secure cross-origin resource sharing
- **Security Headers**: Helmet implementation for HTTP security headers
- **Token Revocation**: Secure token invalidation
- **Audit Logging**: Comprehensive activity tracking

## 📊 API Documentation

The complete API documentation is available through Swagger UI:
- **Local**: `http://localhost:3000/api/docs`
- **Production**: `https://your-domain.com/api/docs`

### Key API Endpoints

**Authentication**
```
POST /v1/auth/register
POST /v1/auth/login
POST /v1/auth/refresh
POST /v1/auth/forgot-password
POST /v1/auth/reset-password
```

**Projects**
```
GET /v1/projects
POST /v1/projects
PATCH /v1/projects/:id
DELETE /v1/projects/:id
```

**Sessions**
```
POST /v1/sessions/start
POST /v1/sessions/:id/stop
PATCH /v1/sessions/:id/pause
PATCH /v1/sessions/:id/resume
GET /v1/sessions
GET /v1/sessions/active
```

**Analytics**
```
GET /v1/analytics/daily
GET /v1/analytics/streak
GET /v1/analytics/projects
```

## 🧪 Testing

### Backend Tests
```bash
cd BackEnd
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:cov      # Test coverage
```

### Frontend Tests
```bash
cd FrontEnd
npm run test          # Unit tests
npm run test:watch    # Watch mode
npm run lint          # Code linting
```

## 📈 Monitoring & Observability

### Built-in Monitoring
- **Health Checks**: `/v1/health` endpoint
- **Metrics**: Prometheus metrics endpoint
- **Logging**: Structured logging with Winston
- **Error Tracking**: Sentry integration

### Performance Monitoring
- **Response Time Tracking**: Built-in performance metrics
- **Database Query Optimization**: Prisma query logging
- **Caching Strategy**: Redis-based caching
- **Load Testing**: Ready for performance testing

## 🚀 Scaling & Performance

### Horizontal Scaling
- **Load Balancing**: Ready for reverse proxy setup
- **Database Connection Pooling**: Configured for high concurrency
- **Caching Layer**: Redis for frequently accessed data
- **Background Processing**: BullMQ for async tasks

### Performance Optimizations
- **Database Indexing**: Optimized Prisma schema
- **API Response Caching**: Built-in caching strategies
- **Static Asset Optimization**: Frontend asset bundling
- **Database Query Optimization**: Efficient Prisma queries

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run all tests
6. Submit a pull request

### Code Standards
- **Backend**: TypeScript with strict typing
- **Frontend**: TypeScript with React best practices
- **Testing**: 80%+ test coverage required
- **Documentation**: All new features must be documented
- **Security**: Follow security best practices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [NestJS](https://nestjs.com/) and [React](https://reactjs.org/)
- UI components powered by [Shadcn UI](https://ui.shadcn.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Database ORM by [Prisma](https://www.prisma.io/)
- Icons from [Lucide React](https://lucide.dev/)

## 📞 Support

For support, please open an issue on GitHub or contact our team at support@devtrackhub.com.

---

*DevTrack Hub - Track your productivity, boost your performance*