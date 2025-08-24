import { Hono } from "hono";
import { auth } from "@/lib/betterAuth";
import { logger, loggerErr } from "@/config/logger";

const authRoute = new Hono();


authRoute.use("*", async (c, next) => {
    logger.info(`Auth Request: ${c.req.method} ${c.req.path}`, { file: 'auth.log' });
    await next()
});


authRoute.post("/magic-link", async (c) => {
    try {
        const { email }: { email: string } = await c.req.json();
        logger.info(`Magic link requested for: ${email}`, { file: 'magic-link.log' });
        
        const result = await auth.api.signInMagicLink({ 
            body: { email },
            headers: c.req.header(),
            method: "POST"
        });
        
        logger.info(`Magic link generation successful for: ${email}`, { file: 'magic-link.log' });
        return c.json({ 
            message: " Check your console for the magic link URL.",
            note: "In development, the magic link is logged to console instead of sending email"
        });

    } catch (error: any) { 
        const errorMsg = `Magic link generation failed : ${error.message}`;
        logger.error(errorMsg, { file: 'errors.log' });
        await loggerErr(errorMsg);
        return c.json({ error: "Failed to send magic link" }, 500);
    }
});

// Traditional Login Route
authRoute.post("/login", async (c) => {
    try {
        const { email, password }: { email: string, password: string } = await c.req.json();
        logger.info(`Login attempt for: ${email}`, { file: 'auth.log' });

        // Here you would normally validate against your database
        logger.info(`Login credentials received for: ${email}`, { file: 'auth.log' });
        
        return c.json({ 
            message: "Login endpoint working. Implement actual authentication logic.",
            note: "This is just a demo endpoint. Add your actual auth logic here."
        });

    } catch (error: any) {
        const errorMsg = `Login failed: ${error.message}`;
        logger.error(errorMsg, { file: 'errors.log' });
        await loggerErr(errorMsg);
        return c.json({ error: "Invalid credentials" }, 401);
    }
});

export default authRoute;