module.exports = {
    outputDir: 'out',
    publicPath: process.env.NODE_ENV === 'production'
      ? '/data-visualization-intership/'
      : '/',
    devServer: {
      proxy: {
        '/api': {
          target: "http://localhost:8360",
          changeOrigin: true,
          pathRewrite: {
            '^/api': 'visualization'
          }
        }
      }
    }
  }
  