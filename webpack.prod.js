const { merge } = require('webpack-merge');
const { InjectManifest } = require('workbox-webpack-plugin');
const common = require('./webpack.common');

common.plugins.push(new InjectManifest({
  swSrc: './src/serviceWorker.js',
  swDest: 'service-worker.js',
  maximumFileSizeToCacheInBytes: 50000000,
}));

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
});
