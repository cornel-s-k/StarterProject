// webpack.dev.js
const path = require('path');
const common = require('./webpack.common.js');
const { merge } = require('webpack-merge');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  output: {
    publicPath: '/StarterProject/', 
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!workbox-)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new WorkboxWebpackPlugin.InjectManifest({
      swSrc: './src/service-worker.js',
      swDest: 'sw.js',
    }),
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
      publicPath: '/StarterProject/',
    },
    historyApiFallback: {
      index: '/StarterProject/index.html',
      rewrites: [
        { from: /^\/StarterProject\/.*$/, to: '/StarterProject/index.html' },
      ],
    },
    port: 9000,
    client: {
      overlay: {
        errors: true,
        warnings: true,
      },
    },
  },
    stats: {
    warningsFilter: /InjectManifest has been called multiple times/,
    },
});