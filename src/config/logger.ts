import { format, transports, createLogger } from "winston"
import winston from "winston"

export const logger = winston.createLogger({
    level: "info",
    format: format.combine(
        format.timestamp({ format: "DD-MM-YY HH:mm:ss" }),
        format.errors({ stack: true }),
        format.
            printf(({
                level,
                message,
                timestamp
            }) => {
                return `[${timestamp}] ${level.toUpperCase()}: ${message}`
            })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "logs/errors.log", level: "error" }),
        new winston.transports.File({ filename: "logs/combined.log" }),
    ]
});

// tele logger just to try how it works

export async function teleLog( message: string ) {
    const teleToken = process.env.TELE_TOKEN
    const chatId = process.env.CHAT_ID
    if(!teleToken || !chatId) {
        logger.warn("telegram bot logger is not configured now skipping telegram log.");
        return;
    }

    const url = `https://api.telegram.org/bot${teleToken}/sendMessage`

    try {
        await fetch (url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id : chatId,
                text: `Log: ${message}`,
                parse_mode: "Markdown"
            }),
        });
    } catch (error) {
        logger.error("Failed to sen logs to Telegram bot:", error)
    }
}

export async function loggerErr(message : string) {
    logger.error(message);
    await teleLog(message)
}

// this will act as logger main file we will call this functions whernevr we see try catch and error like things and it will log the error