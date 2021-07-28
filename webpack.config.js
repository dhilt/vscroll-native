const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    index: [
      './demo/index.ts'
    ]
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist-demo'),
    publicPath: '.',
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new HtmlWebpackPlugin({
      template: 'demo/index.html'
    }),
    new CopyPlugin({
      patterns: [
        { from: './demo/assets', to: './assets' },
        { from: './demo/samples/cdn/index.html', to: './samples/cdn/index.html' },
        { from: './demo/samples/cdn/cdn.js', to: './samples/cdn/cdn.js' },
      ],
    }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        default: false,
        vendors: false,
        node_modules: {
          name: 'vendors',
          chunks: 'all',
          test: /node_modules/,
          priority: 40
        },
      },
    },
    minimizer: [new TerserPlugin({
      extractComments: false,
    })],
  },
  devServer: {
    static: path.join(__dirname, 'dist-demo'),
    port: 5000,
    devMiddleware: {
      writeToDisk: true
    }
  }
};