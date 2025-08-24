import { Hono } from 'hono'
import { swaggerUI } from '@hono/swagger-ui'

// OpenAPI documentation
const openApiDoc = {
  openapi: '3.0.0',
  info: {
    title: 'Auth Service API',
    version: '1.0.0',
    description: 'Auth with magic link login'
  },
  paths: {
    '/login': {
      post: {
        summary: 'Magic link authentication',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                    format: 'email'
                  }
                },
                required: ['email']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Magic link sent successfully'
          },
          '500': {
            description: 'Server error'
          }
        }
      }
    }
  }
}

export const createrSwagger = () => {
  const app = new Hono()

  // Serve OpenAPI document
  app.get('/swagger.json', (c) => c.json(openApiDoc))

  // Serve Swagger UI
  app.get('/', swaggerUI({ url: '/docs/swagger.json' }))

  return app
}