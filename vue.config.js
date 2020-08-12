module.exports = {
  publicPath: "./",
  lintOnSave: false,
  productionSourceMap: false,
  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/styles/_var.scss";'
      }
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://172.16.6.84:1317',
        pathRewrite: {
          ['^/api']: ''
        }
      }
    },
    port: 8082 // 端口
  }
};