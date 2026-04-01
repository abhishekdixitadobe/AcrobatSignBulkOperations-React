const path = require("path");
const fs = require('fs');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const webpack = require('webpack');

module.exports = {
  mode: "development",
  entry: ['./src/index.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'static'),
  },
  resolve: {
    modules: ["src", "node_modules"],
    alias: {
      components: path.resolve(__dirname, "src/components"),
      providers: path.resolve(__dirname, "src/providers"),
      views: path.resolve(__dirname, "src/views"),
      services: path.resolve(__dirname, "src/services"),
      utils: path.resolve(__dirname, "src/utils"),
    },
    extensions: [".tsx", ".ts", ".js", ".jsx", ".svg", ".css", ".json", ".psd"],
    fallback: {
      "fs": false,
      "os": false,
      "path": false,
      "http": false,
      "https": false,
      "zlib": false,
      "stream": false
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
            sourceMaps: true, // Enable source maps
          }
        }
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.psd$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Bulk Operations Tool",
      template: __dirname + "/src/index.html",
      inject: "body",
      filename: "index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new Dotenv(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    historyApiFallback: true,
    port: 8443,
    hot: true,
    proxy: [
      {
        context: ['/api', '/auth-url'], // Include /auth-url in the proxy
        target: 'https://localhost:3000',
        changeOrigin: true,
        secure: false
      },
    ],
    server: {
      type: 'https',
      options: {
        key: fs.readFileSync(path.resolve(__dirname, 'dev/certs/server.key')), 
        cert: fs.readFileSync(path.resolve(__dirname, 'dev/certs/server.crt')) 
      }
    },
  },
  devtool: 'inline-source-map',
  performance: {
    hints: false,
  },
  stats: {
    modules: false,
    warnings: false,
  },
};
