import { format, transports, createLogger } from "winston"
import winston from "winston"

// Create logs directory if it doesn't exist
import { mkdirSync } from 'fs';
try {
    mkdirSync('logs');
} catch (error) {
    // Directory already exists, ignore error
}

export const logger = winston.createLogger({
    level: "info",
    format: format.combine(
        format.timestamp({ format: "DD-MM-YY HH:mm:ss" }),
        format.errors({ stack: true }),
        format.printf(({
            level,
            message,
            timestamp,
            stack
        }) => {
            if (stack) {
                return `[${timestamp}] ${level.toUpperCase()}: ${message}\n${stack}`;
            }
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        
        new winston.transports.Console(),
        
        // Magic link specific logs
        new winston.transports.File({ 
            filename: "logs/magic-link.log",
            level: "info",
            format: format.combine(
                format.timestamp(),
                format.json()
            )
        }),

        // Error logs
        new winston.transports.File({ 
            filename: "logs/errors.log", 
            level: "error",
            format: format.combine(
                format.timestamp(),
                format.json()
            )
        }),

        // Auth related logs
        new winston.transports.File({ 
            filename: "logs/auth.log",
            format: format.combine(
                format.timestamp(),
                format.json()
            )
        })
    ]
});


const originalConsoleLog = console.log;
console.log = function(...args) {
    const message = args.join(' ');
    if (message.includes('magic link for')) {
        // Log magic links to specific file and telegram
        logger.info(message, { file: 'magic-link.log' });
        teleLog(`New magic link generated: ${message}`);
    }
    // Keep original console output
    originalConsoleLog.apply(console, args);
};

// Telegram logger
export async function teleLog(message: string) {
    const teleToken = process.env.TELE_TOKEN
    const chatId = process.env.CHAT_ID
    if (!teleToken || !chatId) {
        logger.warn("Telegram bot logger is not configured, skipping telegram log.");
        return;
    }

    const url = `https://api.telegram.org/bot${teleToken}/sendMessage`

    try {
        await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: `Log: ${message}`,
                parse_mode: "Markdown"
            }),
        });
    } catch (error) {
        logger.error("Failed to send logs to Telegram bot:", error)
    }
}

export async function loggerErr(message: string) {
    logger.error(message);
    await teleLog(message);
}