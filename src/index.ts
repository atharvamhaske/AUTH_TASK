import { Hono } from "hono"
import { logger, loggerErr } from "./config/logger"
import { swaggerUI } from "@hono/swagger-ui";
import { createrSwagger } from "./docs/swagger";

const app = new Hono();

//swagger foc route down there

app.get(
    "/docs",
    swaggerUI({
        url: "/swagger.json"
    })
)

app.get("/swagger.json", (c) => c.json(createrSwagger))

app.get("/", async (c) => {
    logger.info("hitted endpoint")
    await loggerErr('this is log to tg bot')
    return c.text('hello from logger ')
});

app.get("/login", async (c) => {
    try {
        logger.info("login attempted");
        await loggerErr("user tried logging in")

        // on success
        return c.json({
            message: "login successful"
        })
    } catch (error) {
        logger.error("login failed", error as Error);
                await loggerErr(`login failed: ${(error as Error).message}`);
         return c.json({
             error: "login failed"
         }, 500);
     }
})

const port = process.env.PORT || 3001;

console.log(`server is running on port ${port}`);
console.log(`swagger docs at http://localhost:${port}/docs`);
export default {
    port,
    fetch: app.fetch
};