# StockBox Backend API

Backend REST API for StockBox inventory management system.

## Features

- RESTful API architecture
- TypeScript for type safety
- Express.js framework
- SQL Server database integration
- Automatic database migrations
- Multi-tenancy support
- Request validation with Zod
- Comprehensive error handling
- CORS configuration
- Security middleware (Helmet)
- Request compression
- Logging with Morgan

## Prerequisites

- Node.js 18+ and npm
- SQL Server database
- Environment variables configured

## Installation

```bash
npm install
```

## Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required environment variables:
- `DB_SERVER` - Database server address
- `DB_PORT` - Database port (default: 1433)
- `DB_NAME` - Database name
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `PROJECT_ID` - Project identifier for schema isolation
- `PORT` - API server port (default: 3000)

## Development

```bash
npm run dev
```

Server will start at `http://localhost:3000`

## Build

```bash
npm run build
```

## Production

```bash
npm start
```

## Testing

```bash
npm test
```

## API Structure

```
/api/v1/
├── external/     # Public endpoints
└── internal/     # Authenticated endpoints
```

## Database Migrations

Migrations run automatically on server startup. To run manually:

```bash
ts-node src/migrations/run-migrations.ts
```

Migration files location: `backend/migrations/`

## Project Structure

```
backend/
├── migrations/           # SQL migration files
├── src/
│   ├── api/             # API controllers
│   ├── config/          # Configuration
│   ├── middleware/      # Express middleware
│   ├── migrations/      # Migration runner
│   ├── routes/          # Route definitions
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── server.ts        # Application entry point
├── package.json
├── tsconfig.json
└── .env
```

## Health Check

```
GET /health
```

Returns server health status.

## License

ISC