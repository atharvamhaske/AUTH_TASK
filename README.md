# Magic Link Authentication Service

A modern authentication service built with Hono, Better-Auth, and PostgreSQL, featuring magic link authentication and comprehensive logging with Telegram bot integration.

## Key Features Showcase

### 1. Magic Link Authentication via POST method
<img src="docs/images/postReq.png" alt="Swagger UI Screenshot" width="800"/>

*Interactive API documentation with Swagger UI showing magic link endpoint*

### 2. Real-time Telegram Bot Logging
<img src="docs/images/TeleBot.png" alt="Telegram Bot Logs" width="800"/>

*Live authentication monitoring and error tracking through Telegram*

Example log:
```log
[25-08-24 00:18] Log: New magic link generated: magic link for test@example.com: 
http://localhost:3001/api/auth/magic-link/verify?token=rjvYJzurPuthhqUdzjdkTGawrFrENSMX&callbackURL=%2F
```

### 3. Checking User using Get method
<img src="docs/images/getReq.png" alt="User Management Interface" width="800"/>

*Complete user session tracking and management*

## Project Overview

This service implements a modern authentication system using magic links with comprehensive logging and monitoring capabilities. Perfect for applications requiring secure, passwordless authentication with full audit trails.

### Authentication Features
- Passwordless authentication via magic links
- Secure session management
- User activity tracking
- Real-time authentication monitoring

### Logging System
1. **Winston Logger Integration**
   - Structured logging with timestamps
   - Multiple severity levels (INFO, ERROR, WARN)
   - File-based persistence
   - Custom formatting

2. **Telegram Bot Integration**
   ```typescript
   // Example of Telegram logging setup
   export async function teleLog(message: string) {
       const url = `https://api.telegram.org/bot${teleToken}/sendMessage`
       await fetch(url, {
           method: "POST",
           body: JSON.stringify({
               chat_id: chatId,
               text: `Log: ${message}`,
               parse_mode: "Markdown"
           })
       });
   }
   ```
   - Real-time notifications
   - Authentication event tracking
   - Error alerting
   - Security monitoring

3. **Log Categories**
   - `auth.log`: Authentication attempts
   - `magic-link.log`: Magic link generation and usage
   - `error.log`: System errors and failures

## Tech Stack

- **Runtime**: Bun v1.2.18
- **Framework**: Hono v4.9.4
- **Authentication**: Better-Auth v1.3.7
- **Database**: PostgreSQL with Prisma v6.14.0
- **Logging**: 
  - Winston v3.17.0 for structured logging
  - Custom Telegram Bot integration
- **API Documentation**: Swagger UI (@hono/swagger-ui v0.5.2)
- **Type Safety**: TypeScript v5.9.2

## Project Structure

```
project/
├── docs/                      # Project documentation
│   ├── images/               # Documentation screenshots
│   │   ├── getReq.png    # GET method
│   │   ├── postReq.png  # POST method
│   │   └── TeleBot.png  #  Telegram bot logging
│   └── auth-flow-diagram.md  # Authentication flow diagram
├── prisma/
│   └── schema.prisma         # Database schema
├── src/
│   ├── config/
│   │   └── logger.ts         # Winston & Telegram logger setup
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
├── TESTING_GUIDE.md         # Detailed testing instructions
└── package.json
```

## Getting Started

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   bun install
   ```

2. **Environment Setup**
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   AUTH_SECRET="your-secret-key"
   TELE_TOKEN="your-telegram-bot-token"
   CHAT_ID="your-telegram-chat-id"
   ```

3. **Database Setup**
   ```bash
   bunx prisma generate
   bunx prisma migrate dev
   ```

4. **Start Server**
   ```bash
   bun run dev:backend
   ```

5. **Access Points**
   - Swagger UI: `http://localhost:3001/docs`
   - Magic Link Endpoint: `POST /auth/magic-link`
   - Session Check: `GET /auth/session`

## Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant API as API Server
    participant BA as Better Auth
    participant DB as Database
    participant L as Logger
    participant T as Telegram

    U->>API: POST /auth/magic-link
    API->>L: Log request
    API->>BA: Request magic link
    BA->>DB: Create/Update user
    BA-->>API: Return magic link
    API->>L: Log success
    API->>T: Send notification
    API-->>U: Return success message
```

## Monitoring and Logging

### Winston Logger
- Structured logging with timestamps
- Multiple transport layers
- Error tracking
- Performance monitoring

### Telegram Bot Integration
- Real-time notifications
- Authentication monitoring
- Error alerts
- Security event tracking

Example log from Telegram:
```
[24-08-25 21:13:11] INFO: Magic link requested for: test@example.com
[24-08-25 21:13:11] INFO: Magic link generation successful
```

## Development Notes

- Magic links are logged to console in development
- Telegram notifications provide real-time monitoring
- Winston logger handles all system events
- Complete audit trail of authentication flows