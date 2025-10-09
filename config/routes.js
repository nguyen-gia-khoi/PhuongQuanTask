// const userRoutes = require('./routes/user.Routes');
// module.exports.routes = {
//   ...userRoutes,

//   // Swagger routes - thêm thủ công
//   'GET /swagger.json': { action: 'swagger/index' },
//   'GET /docs': { action: 'swagger/index' },
// };


const userRoutes = require('./routes/user.Routes');
const path = require('path');
const getSwaggerHtml = require('../api/utils/swaggerHtml');

module.exports.routes = {
  ...userRoutes,

  // Swagger JSON served directly from generated file
  'GET /swagger.json': function(req, res) {
    const swaggerPath = path.join(__dirname, '..', 'swagger', 'swagger.json');
    return res.sendFile(swaggerPath);
  },

  // Swagger UI using CDN assets to avoid local static file issues
  'GET /docs': function(req, res) {
    const html = getSwaggerHtml();
    res.set('Content-Type', 'text/html');
    return res.send(html);
  },
};