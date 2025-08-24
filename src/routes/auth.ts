import { Hono } from "hono";
import { auth } from "@/lib/betterAuth";
import { logger, loggerErr } from "@/config/logger";

const authRoute = new Hono();

authRoute.use("*", async (c, next) => {
    logger.info(`incoming  ${c.req.method} ${c.req.path}`);
    await next()
});

authRoute.post("/login", async (c) => {
    try {
        const { email }: { email: string } = await c.req.json();
        const result = await auth.api.signInMagicLink({ 
            body: { email },
            headers: c.req.header(),
            method: "POST"
        });
        
        logger.info(`Magic link sent to ${email}`);
        return c.json({ message: "Magic link sent successfully" });

    } catch (error) { 
        logger.error(`Unexpected login error: ${error.message}`);
        return c.json({ error: "Failed to send magic link" }, 500);
    }
});

export default authRoute;