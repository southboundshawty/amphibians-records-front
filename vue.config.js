module.exports = {
  css: {
    loaderOptions: {
      sass: {
        additionalData: '@import "@/assets/style/_variables.scss";',
      },
    },
  },
  // devServer: {
  //   port: 7890,
  //   // client: {
  //   overlay: {
  //     warnings: false,
  //     errors: false,
  //   },
  //   // },
  // },
  // pages: {
  //   index: {
  //     entry: 'src/main.js',
  //   },
  // },
  // productionSourceMap: false,
  // transpileDependencies: [
  //   'vuetify',
  // ],
  // pluginOptions: {
  //   svgSprite: {
  //     dir: 'src/assets/icons',
  //     test: /\.(svg)(\?.*)?$/,
  //     loaderOptions: {
  //       extract: true,
  //       spriteFilename: 'img/icons.[hash:8].svg',
  //     },
  //     pluginOptions: {
  //       plainSprite: true,
  //     },
  //   },
  // },
  // chainWebpack: (config) => {
  //   config.module
  //     .rule('svg-sprite')
  //     .use('svgo-loader')
  //     .loader('svgo-loader');
  // },
};
