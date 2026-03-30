const path = require("path");
const fs = require('fs');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');
const macros = require('unplugin-parcel-macros');
const { CleanWebpackPlugin } =require('clean-webpack-plugin');
const Dotenv=require('dotenv-webpack');
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
      "@react-spectrum/s2/style/dist/style-macro.mjs": path.resolve(__dirname, "node_modules/@react-spectrum/s2/style/dist/style-macro.mjs")
    },
    extensions: [".tsx", ".ts", ".js", ".jsx", ".svg", ".css", ".json", ".psd"],
    fallback: {
      fs: false,
      os: false,
      path: false,
      http: false,
      https: false,
      zlib: false,
      stream: false,
      url: false
    }
  },
  module: {
    rules: [
      {
        test: /style-macro\.(mjs|cjs)$/,
        include: /node_modules\/@react-spectrum\/s2/,
        use: [path.resolve(__dirname, 'src/loaders/patch-style-macro-loader.js')],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-react', { runtime: 'automatic' }]],
            plugins: ['@babel/plugin-syntax-import-attributes'],
            sourceMaps: true,
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
    macros.webpack({
      include: [/\.[cm]?[jt]sx?$/, /node_modules\/@react-spectrum\/s2/],
    }),
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
