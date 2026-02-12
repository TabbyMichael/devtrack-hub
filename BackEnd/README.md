# DevTrack Hub Backend

Enterprise-grade backend for project and session tracking with analytics.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Configure environment (see .env file)
cp .env .env.local  # then edit .env.local

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Start development server
npm run start:dev
```

**API Documentation**: http://localhost:3000/api/docs

## 📦 Tech Stack

- **Framework**: NestJS 10
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT + bcrypt
- **Validation**: class-validator
- **Security**: Helmet, CORS, Rate-Limiting
- **Documentation**: Swagger/OpenAPI

## 🔐 Environment Variables

Required variables in `.env`:

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="min-32-characters"
JWT_REFRESH_SECRET="min-32-characters"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
CORS_ORIGINS="http://localhost:3000"
PORT="3000"
```

## 📡 API Endpoints

### Auth
- `POST /v1/auth/register` - Register
- `POST /v1/auth/login` - Login
- `POST /v1/auth/refresh` - Refresh token
- `GET /v1/auth/me` - Profile
- `GET /v1/auth/github` - GitHub OAuth
- `GET /v1/auth/google` - Google OAuth

### Projects
- `GET /v1/projects` - List (paginated)
- `POST /v1/projects` - Create
- `PATCH /v1/projects/:id` - Update
- `DELETE /v1/projects/:id` - Soft delete

### Sessions
- `POST /v1/sessions/start` - Start tracking
- `POST /v1/sessions/:id/stop` - Stop tracking
- `GET /v1/sessions/active` - Active session
- `GET /v1/sessions` - List (with filters)

### Analytics
- `GET /v1/analytics/daily` - Daily totals
- `GET /v1/analytics/streak` - Streak data
- `GET /v1/analytics/projects` - Project aggregates

### Export
- `GET /v1/export/sessions/csv` - Export as CSV
- `GET /v1/export/sessions/json` - Export as JSON

### WebSocket
- Namespace: `/sessions`
- Events: `session:started`, `session:stopped`, `timer:update`

## 🛡️ Security Features

- ✅ Password hashing (bcrypt, 12 rounds)
- ✅ JWT with refresh token rotation
- ✅ Token revocation list
- ✅ Rate limiting (multi-tier)
- ✅ Input validation & sanitization
- ✅ CORS configuration
- ✅ Security headers (Helmet)
- ✅ Ownership checks on all resources

## 📊 Data Validation

- Email: max 255 chars
- Password: 8-100 chars
- Project name: 1-100 chars
- Session duration: 1-1440 minutes
- Notes: max 2000 chars

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 Scripts

```bash
npm run start          # Production
npm run start:dev      # Development with watch
npm run build          # Build for production
npm run test           # Run tests
```

## 🏗️ Project Structure

```
src/
├── modules/
│   ├── auth/          # Authentication
│   ├── projects/      # Project management
│   ├── sessions/      # Session tracking
│   ├── analytics/     # Analytics & insights
│   └── health/        # Health checks
├── prisma/            # Database service
├── config/            # Configuration
├── common/            # Shared utilities
└── main.ts            # Entry point
```

## 📚 Documentation

- [Implementation Plan](file:///C:/Users/Administrator/.gemini/antigravity/brain/1743373d-63d6-481b-8423-a3112ff4fa68/implementation_plan.md)
- [Walkthrough](file:///C:/Users/Administrator/.gemini/antigravity/brain/1743373d-63d6-481b-8423-a3112ff4fa68/walkthrough.md)
- API Docs: `/api/docs` (Swagger)

## ⚠️ Production Checklist

- [ ] Change JWT secrets
- [ ] Configure production database
- [ ] Set CORS_ORIGINS to your domain
- [ ] Enable SSL/TLS
- [ ] Set up monitoring (Sentry recommended)
- [ ] Configure backup strategy
- [ ] Run `npm run build`
