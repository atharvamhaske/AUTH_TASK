import { Hono } from "hono"
import { logger, loggerErr } from "./config/logger"

const app = new Hono();

app.get("/", async (c) => {
    logger.info("hitted endpoint")
    await loggerErr('this is log to tg bot')
    return c.text('hello from logger ')
})

export default app;