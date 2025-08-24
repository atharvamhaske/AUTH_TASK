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
                      example: 'Check your console for the magic link URL'
                    },
                    note: {
                      type: 'string'
                    },
                    userId: {
                      type: 'string',
                      example: 'clh2x3e0g0000qw3v9s9h1j2q'
                    },
                    sessionId: {
                      type: 'string',
                      example: '123e4567-e89b-12d3-a456-426614174000'
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
    '/auth/users': {
      get: {
        summary: 'Get all users (for testing)',
        responses: {
          '200': {
            description: 'List of users with their sessions',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    users: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'string'
                          },
                          email: {
                            type: 'string'
                          },
                          createdAt: {
                            type: 'string',
                            format: 'date-time'
                          },
                          updatedAt: {
                            type: 'string',
                            format: 'date-time'
                          },
                          sessions: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                id: {
                                  type: 'string'
                                },
                                createdAt: {
                                  type: 'string',
                                  format: 'date-time'
                                },
                                expiresAt: {
                                  type: 'string',
                                  format: 'date-time'
                                }
                              }
                            }
                          }
                        }
                      }
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