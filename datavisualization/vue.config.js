module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
      ? '/data-visualization-internship/'
      : '/',
    devServer: {
      proxy: {
        '/visualization': {
          target: "http://localhost:8360",
          changeOrigin: true
        }
      }
    }
  }
  