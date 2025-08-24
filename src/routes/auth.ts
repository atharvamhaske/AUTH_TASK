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
        
        // Let Better-Auth handle the magic link flow
        const result = await auth.api.signInMagicLink({ 
            body: { email },
            headers: c.req.header(),
            method: "POST"
        });
        
        logger.info(`Magic link generation successful for: ${email}`, { file: 'magic-link.log' });
        return c.json({ 
            message: "Check your console for the magic link URL.",
            note: "In development, the magic link is logged to console instead of sending email"
        });

    } catch (error: any) { 
        const errorMsg = `Magic link generation failed: ${error.message}`;
        logger.error(errorMsg, { file: 'errors.log' });
        await loggerErr(errorMsg);
        return c.json({ error: "Failed to send magic link" }, 500);
    }
});


authRoute.get("/verify", async (c) => {
    try {
        const token = c.req.query('token');
        
        if (!token) {
            throw new Error('No token provided');
        }

        logger.info(`Verifying magic link token`, { file: 'magic-link.log' });

        // Let Better-Auth handle the verification
        const result = await auth.api.verifyMagicLink({
            token,
            headers: c.req.header()
        });

        logger.info(`Magic link verification successful`, { file: 'magic-link.log' });

        // Better-Auth has handled the session creation
        return c.json({
            message: "Magic link verification successful",
            session: result.session
        });

    } catch (error: any) {
        const errorMsg = `Magic link verification failed: ${error.message}`;
        logger.error(errorMsg, { file: 'errors.log' });
        await loggerErr(errorMsg);
        
        return c.json({ 
            error: "Invalid or expired magic link"
        }, 401);
    }
});

// Get current session
authRoute.get("/session", async (c) => {
    try {
        const session = await auth.api.getSession(c);
        if (!session) {
            return c.json({ authenticated: false });
        }
        return c.json({ 
            authenticated: true,
            session 
        });
    } catch (error: any) {
        logger.error(`Session check failed: ${error.message}`);
        return c.json({ error: "Failed to check session" }, 500);
    }
});

export default authRoute;