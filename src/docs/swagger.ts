import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'


export const createrSwagger = () => {
const app = new OpenAPIHono()

app.doc('/swagger.json', {
  openapi: '3.0.0',
  info: {
    title: 'Auth Service API',
    version: '1.0.0',
    description: 'Auth with magic link login'
  },
  
})

// Swagger ui handler
app.get('/', swaggerUI({ url: '/docs/swagger.json' }))

 return app
}