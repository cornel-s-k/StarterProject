<<<<<<< HEAD
// webpack.prod.js
=======
>>>>>>> 668ba7c5796b75f172d68a25a0c8b7daf5dbb4d9
const common = require('./webpack.common.js');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
<<<<<<< HEAD
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
=======
>>>>>>> 668ba7c5796b75f172d68a25a0c8b7daf5dbb4d9

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.js$/,
<<<<<<< HEAD
        exclude: /node_modules\/(?!workbox-)/, // Exclude most node_modules, but allow workbox to be processed if needed
=======
        exclude: /node_modules/,
>>>>>>> 668ba7c5796b75f172d68a25a0c8b7daf5dbb4d9
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
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
<<<<<<< HEAD
    new WorkboxWebpackPlugin.InjectManifest({
      swSrc: './src/service-worker.js', // Path to your *source* service worker file
      swDest: 'service-worker.js', // Output name in the dist folder
    }),
  ],
});
=======
  ],
});
>>>>>>> 668ba7c5796b75f172d68a25a0c8b7daf5dbb4d9
