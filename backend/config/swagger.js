const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Portfolio API",
      version: "1.0.0",
      description: "REST API for Zia Bin Tahir's Developer Portfolio",
      contact: { name: "Zia Bin Tahir", email: "ziabintahir@gmail.com" },
    },
    servers: [
      { url: "http://localhost:5000/api/v1", description: "Local" },
      { url: "https://portfolio-api.render.com/api/v1", description: "Production" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js", "./controllers/*.js"],
};

module.exports = swaggerJsdoc(options);
