module.exports = {
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV !== "production") {
      config.devtool = "source-map";
    }
  },
  productionSourceMap: false,
};
