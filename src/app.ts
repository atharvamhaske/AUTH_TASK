import { Hono } from 'hono'
import  { createrSwagger }  from './docs/swagger'

const app = new Hono()

// Mount Swagger UI at /docs
app.route('/docs', createrSwagger())

// Global middleware
app.use('*', async (c, next) => {
    await next()
})