const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

const options = {};

module.exports = {
  target: 'web',
  entry: {
    bundle: path.resolve(__dirname, 'src/index.ts'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true,
    assetModuleFilename: '[name].[contenthash][ext]',
    publicPath: '',
  },
  watchOptions: { poll: true },
  module: {
    rules: [
      {
        // Use these loaders for any matching scss file types
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        // Add backwards compatibility
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript'],
          },
        },
      },
      {
        // Add support for images
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        // Add support for favicon
        test: /\.ico$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]', // <-- retain original file name
            },
          },
        ],
      },
      {
        // Add support for manifest
        test: /\.webmanifest$/i,
        use: 'webpack-webmanifest-loader',
        type: 'asset/resource',
      },
      {
        // Add support for audio
        test: /\.(mp3)$/i,
        type: 'asset/resource',
      },
      {
        // Add inlining of SVG
        test: /\.svg$/i,
        type: 'asset/inline',
      },
    ],
  },
  resolve: {
    // Specify the order in which to resolve files by their extension
    extensions: ['*', '.js', '.ts'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'body',
      title: 'Selection Wheel - the funnest way to make decisions',
      filename: 'index.html',
      template: 'src/template.html',
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      title: 'Privacy Policy',
      filename: 'privacy-policy.html',
      template: 'src/privacy.html',
    }),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/.*/]),
    new WebpackManifestPlugin(options),
  ],
};
