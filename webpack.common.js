
// webpack.common.js

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/scripts/index.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Clean the output directory before build

  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/public/'),
          to: path.resolve(__dirname, 'dist/'),
        },
<<<<<<< HEAD
        // Remove service-worker.js from here, it will be handled by WorkboxWebpackPlugin
        // {
        //   from: path.resolve(__dirname, 'src/service-worker.js'),
        //   to: path.resolve(__dirname, 'dist/'),
        // },
        {
          from: path.resolve(__dirname, 'src/manifest.json'),
          to: path.resolve(__dirname, 'dist/'),
        },
      ],
    }),
  ],
};
=======
      ],
    }),
  ],
};
>>>>>>> 668ba7c5796b75f172d68a25a0c8b7daf5dbb4d9
