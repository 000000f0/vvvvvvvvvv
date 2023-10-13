const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api', // Define the path you want to proxy
    createProxyMiddleware({
      target: 'https://deva4.fly.dev', // Specify the target URL
      changeOrigin: true, // Add this to handle CORS
    })
  );
};
