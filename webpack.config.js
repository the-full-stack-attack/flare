const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const webpack = require('webpack'); // added for configuring process.env variables on client side
const DIST_DIR = path.resolve(__dirname, 'dist');
const SRC_DIR = path.resolve(__dirname, 'src');
const CLIENT_DIR = path.resolve(__dirname, 'src', 'client');

module.exports = {
  mode: 'development',
  entry: path.resolve(CLIENT_DIR, 'index.tsx'),
  output: {
    path: DIST_DIR,
    publicPath: '/',
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(m?js)$/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        }
      },
      {
        test: /\.(gif|jpg|png|mp3|aac|ogg)$/,
        type: 'asset/resource',
      },
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-typescript',
                '@babel/preset-react',
              ]
            }
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            }
          },
          'postcss-loader'
        ],
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(CLIENT_DIR, 'index.html'),
      filename: 'index.html',
      inject: true
    }),
    new CleanWebpackPlugin(),
    new webpack.EnvironmentPlugin({
      REACT_APP_DEVELOPMENT_SOCKETS: "true" ,
    }), // this allows webpack to understand process env variables on front end
  ], 
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css'],
    alias: {
      '@': SRC_DIR,
    },
    modules: [
      'node_modules',
      SRC_DIR,
    ]
  }
};
