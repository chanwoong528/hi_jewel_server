const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    info: {
      title: 'GPT-ilbo swagger-api-doc',
      version: '1.0.0',
      description: 'GPT-ilbo swagger-api-doc',
    },
    servers: [
      {
        url: "http://localhost:5002",
      },
    ],
  },
  apis: ['src/Controller/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs
};