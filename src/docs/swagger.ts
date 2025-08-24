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
    '/auth/magic-link': {
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
                    format: 'email',
                    example: 'test@example.com'
                  }
                },
                required: ['email']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Magic link sent successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Magic link sent successfully'
                    },
                    note: {
                      type: 'string',
                      example: 'Check console for magic link in development'
                    }
                  }
                }
              }
            }
          },
          '500': {
            description: 'Server error'
          }
        }
      }
    },
    '/auth/login': {
      post: {
        summary: 'Traditional login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'test@example.com'
                  },
                  password: {
                    type: 'string',
                    format: 'password',
                    example: 'yourpassword123'
                  }
                },
                required: ['email', 'password']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Login successful'
          },
          '401': {
            description: 'Invalid credentials'
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