const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  swaggerDefinition: {
    info: {
      title: 'API de Mi Proyecto',
      version: '1.0.0',
      description: 'Documentación de la API de Mi Proyecto',
    },
    basePath: '/',
  },
  apis: ['./routes/products.js', './routes/carts.js'],
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi,
};
