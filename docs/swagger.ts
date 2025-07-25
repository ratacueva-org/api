
import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Rata Cueva API",
    version: "1.0.0",
    description: "RESTful API for Rata Cueva, a gaming hardware and computer components e-commerce platform. This API provides comprehensive endpoints for user management, product catalog, shopping cart, orders, reviews, PC building recommendations, favorites, and shipping services.",
    contact: {
      name: "Eduardo Moreno",
      email: "support@ratacueva.com"
    },
    license: {
      name: "ISC",
      url: "https://opensource.org/licenses/ISC"
    }
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
    {
      url: "http://ratacueva-api.onrender.com",
      description: "Production server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter JWT token obtained from login endpoint"
      }
    },
    responses: {
      UnauthorizedError: {
        description: "Authentication token is missing or invalid",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: {
                  type: "string",
                  example: "Unauthorized"
                },
                message: {
                  type: "string",
                  example: "Invalid or missing authentication token"
                }
              }
            }
          }
        }
      },
      ForbiddenError: {
        description: "Access denied - insufficient permissions",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: {
                  type: "string",
                  example: "Forbidden"
                },
                message: {
                  type: "string",
                  example: "Insufficient permissions to access this resource"
                }
              }
            }
          }
        }
      },
      ValidationError: {
        description: "Request validation failed",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: {
                  type: "string",
                  example: "Validation Error"
                },
                message: {
                  type: "string",
                  example: "Request data validation failed"
                },
                details: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      field: {
                        type: "string"
                      },
                      message: {
                        type: "string"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      NotFoundError: {
        description: "Resource not found",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: {
                  type: "string",
                  example: "Not Found"
                },
                message: {
                  type: "string",
                  example: "The requested resource was not found"
                }
              }
            }
          }
        }
      }
    }
  },
  tags: [
    {
      name: "Auth",
      description: "Authentication and authorization endpoints"
    },
    {
      name: "Users",
      description: "User profile management, addresses, and payment methods"
    },
    {
      name: "Products",
      description: "Product catalog management and browsing"
    },
    {
      name: "Reviews",
      description: "Product reviews and ratings"
    },
    {
      name: "Cart",
      description: "Shopping cart management"
    },
    {
      name: "Orders",
      description: "Order processing and management"
    },
    {
      name: "PC Build",
      description: "PC building recommendations and compatibility"
    },
    {
      name: "Favorites",
      description: "User favorite products management"
    },
    {
      name: "Shipping",
      description: "Shipping options and calculations"
    }
  ]
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ["./modules/**/*.routes.ts", "./modules/**/*.schema.ts"],
};

export default swaggerJSDoc(swaggerOptions);
