process.chdir(__dirname);

var sails;
var rc;
try {
  sails = require('sails');
  rc = require('sails/accessible/rc');
} catch (err) {
  console.error('Encountered an error when attempting to require(\'sails\'):');
  console.error(err.stack);
  return;
}

// ✅ Lift the Sails app
sails.lift(rc('sails'), function (err) {
  if (err) {
    
    console.error('Error lifting Sails app:', err);
    return;
  }

  // ✅ Lấy Express instance từ hook HTTP của Sails

  const expressApp = sails.hooks.http.app;

  // Mount Swagger UI
  const path = require('path');
  const swaggerUi = require('swagger-ui-express');
  const swaggerDocument = require(path.join(sails.config.appPath, 'swagger', 'swagger.json'));

  expressApp.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Optional: JSON endpoint (nếu chưa có)
  expressApp.get('/swagger.json', (req, res) => {
    res.sendFile(path.join(sails.config.appPath, 'swagger', 'swagger.json'));
  });
  // ✅ Tạo endpoint test
  expressApp.get('/test', (req, res) => {
    res.json({
      message: '✅ Test endpoint hoạt động!',
      time: new Date(),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  console.log('🚀 Sails app đã khởi động!');
  console.log('👉 Test endpoint: http://localhost:1337/test');
});




