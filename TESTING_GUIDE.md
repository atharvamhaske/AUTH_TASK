# Testing Guide - Magic Link Authentication & Logging

## Important Note ⚠️
This guide focuses only on testing the magic link authentication and logging functionality. Other endpoints may have bugs and will be fixed in future updates.

## Prerequisites
- PostgreSQL database running
- `.env` file configured with:
  ```env
  DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
  AUTH_SECRET="your-secret-key"
  # Optional for Telegram notifications
  TELE_TOKEN="your-telegram-bot-token"
  CHAT_ID="your-telegram-chat-id"
  ```

## Test Flow

### 1. Start the Server
```bash
bun run dev:backend
```
Expected output:
- Server running message
- Port number confirmation
- Swagger docs URL

### 2. Test Magic Link Generation
1. Open Swagger UI:
   - Visit `http://localhost:3001/docs`
   - Expand the `/auth/magic-link` POST endpoint

2. Send Test Request:
   ```json
   {
     "email": "test@example.com"
   }
   ```
   Expected Response:
   ```json
   {
     "message": "Check your console for the magic link URL.",
     "note": "In development, the magic link is logged to console instead of sending email"
   }
   ```

3. Check Logs:
   - Console output should show magic link URL
   - `logs/magic-link.log` should contain:
     - Magic link request entry
     - Successful generation entry
   - `logs/auth.log` should show the request
   - If Telegram configured, check for notification

### 3. Verify Logging System

#### Check Console Logs
Look for:
- Request timestamps
- Magic link URLs
- Any error messages

#### Check Log Files
1. Magic Link Logs (`logs/magic-link.log`):
   ```
   [DD-MM-YY HH:mm:ss] INFO: Magic link requested for: test@example.com
   [DD-MM-YY HH:mm:ss] INFO: Magic link generation successful for: test@example.com
   ```

2. Auth Logs (`logs/auth.log`):
   ```
   [DD-MM-YY HH:mm:ss] INFO: Auth Request: POST /auth/magic-link
   ```

3. Error Logs (if any occur):
   ```
   [DD-MM-YY HH:mm:ss] ERROR: Magic link generation failed: [error message]
   ```

#### Test Error Logging
1. Try invalid email format:
   ```json
   {
     "email": "invalid-email"
   }
   ```
2. Check error appears in:
   - Console
   - `logs/errors.log`
   - Telegram notification (if configured)

### 4. Telegram Notifications (Optional)
If configured, you should receive:
- Magic link generation notifications
- Error notifications
- Each notification should include timestamp and relevant details

## Common Issues & Solutions

1. **No Log Files Created**
   - Check if `logs` directory exists
   - Ensure write permissions
   - Server needs to be restarted after creating `logs` directory

2. **Magic Link Not Showing in Console**
   - Check console scroll history
   - Verify request was successful (200 response)
   - Check `magic-link.log` file

3. **Telegram Notifications Not Working**
   - Verify `TELE_TOKEN` and `CHAT_ID` in `.env`
   - Check error logs for Telegram API errors
   - Ensure bot has proper permissions

## What Not to Test Yet

The following are known to need fixes and should be skipped in testing:
- Session management
- User database queries
- Traditional login endpoints
- Account management features

## Reporting Issues

When reporting issues, please include:
1. The exact request made
2. Relevant log entries
3. Console output
4. Steps to reproduce
5. Expected vs actual behavior

## Next Steps
- Magic link verification endpoint will be fixed
- Session management will be improved
- Database integration will be enhanced
- Additional authentication methods will be added
