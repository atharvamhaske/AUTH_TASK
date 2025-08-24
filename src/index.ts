import { Hono } from "hono"
import { createrSwagger } from "./docs/swagger";
import authRoute from "./routes/auth";

const app = new Hono();

// Mount Swagger UI
app.route('/docs', createrSwagger());

// Mount auth routes
app.route('/auth', authRoute);

const port = process.env.PORT || 3001;

console.log(`Server is running on port ${port}`);
console.log(`Swagger docs at http://localhost:${port}/docs`);
console.log(`\nIMPORTANT: In development mode, magic links are logged to console instead of sending emails.`);
console.log(`Watch the console output when you request a magic link to see the URL.`);

export default {
    port,
    fetch: app.fetch
};