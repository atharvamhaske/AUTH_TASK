# Magic Link Authentication Service

A modern authentication service built with Hono, Better-Auth, and PostgreSQL, featuring magic link authentication and comprehensive logging.

## Tech Stack

- **Runtime**: Bun v1.2.18
- **Framework**: Hono v4.9.4
- **Authentication**: Better-Auth v1.3.7
- **Database**: PostgreSQL with Prisma v6.14.0
- **Logging**: Winston v3.17.0
- **API Documentation**: Swagger UI (@hono/swagger-ui v0.5.2)
- **Type Safety**: TypeScript v5.9.2

## Project Structure

```
project/
├── docs/
│   └── auth-flow-diagram.md  # Authentication flow diagram
├── prisma/
│   └── schema.prisma         # Database schema
├── src/
│   ├── config/
│   │   └── logger.ts         # Winston logger configuration
│   ├── docs/
│   │   └── swagger.ts        # API documentation
│   ├── lib/
│   │   └── betterAuth.ts     # Auth configuration
│   ├── routes/
│   │   └── auth.ts           # Authentication routes
│   └── index.ts              # Main application entry
├── logs/                     # Application logs
│   ├── app.log              # Combined logs
│   ├── auth.log             # Authentication logs
│   └── magic-link.log       # Magic link specific logs
└── package.json
```

## Database Schema

```prisma
model User {
  id        String     @id @default(cuid())
  email     String     @unique
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  sessions  Sessions[]
}

model Sessions {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  expiresAt DateTime
}
```

## Setup and Installation

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   bun install
   ```

2. **Environment Setup**
   Create a .env file:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   AUTH_SECRET="your-secret-key"
   TELE_TOKEN="your-telegram-bot-token"  # Optional
   CHAT_ID="your-telegram-chat-id"       # Optional
   ```

3. **Database Setup**
   ```bash
   bunx prisma generate
   bunx prisma migrate dev
   ```

4. **Start the Server**
   ```bash
   bun run dev:backend
   ```

## API Documentation

Access Swagger UI at `http://localhost:3001/docs`

### Available Endpoints

- **POST /auth/magic-link**
  - Request magic link authentication
  - Body: `{ "email": "user@example.com" }`

- **GET /auth/verify**
  - Verify magic link and complete authentication
  - Query params: `token`

- **GET /auth/session**
  - Check current session status

## Authentication Flow

### Flow Diagram

![Authentication Flow Diagram](docs/auth-flow-diagram.md)

> **Note**: This is a Mermaid diagram. To view it:
> 1. Install a Mermaid viewer extension in your browser, or
> 2. View it on GitHub (which renders Mermaid diagrams automatically), or
> 3. Copy the content from `docs/auth-flow-diagram.md` to [Mermaid Live Editor](https://mermaid.live)

### Testing the Flow

1. **Request Magic Link**
   - Go to `http://localhost:3001/docs`
   - Find the `/auth/magic-link` endpoint
   - Click "Try it out"
   - Enter test email: `test@example.com`
   - Execute request
   - Check console for magic link URL

2. **Verify Magic Link**
   - Copy magic link URL from console
   - Visit the URL in browser
   - Should see verification success

3. **Check Session**
   - Use `/auth/session` endpoint
   - Should show authenticated status

### Logging

All authentication flows are logged in:
- Console output
- `logs/auth.log` - All auth requests
- `logs/magic-link.log` - Magic link specific logs
- Telegram notifications (if configured)

## Development Notes

- In development, magic links are logged to console instead of being sent via email
- Database operations are handled automatically by Better-Auth
- Winston logger captures all authentication events
- Optional Telegram integration for important notifications