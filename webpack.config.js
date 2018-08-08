const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const devMode = process.env.NODE_ENV !== "production";
const outputDirectory = "dist";

module.exports = {
  entry: [
    "babel-polyfill", "./src/client/src/app.js"
  ],
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }, {
        test: /\.(jpg|png|svg)$/,
        loader: "file-loader"
      }, {
        test: /\.(sa|sc|c)ss$/,
        use: [
          devMode
            ? "style-loader"
            : MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  },
  optimization: {
    minimizer: [new UglifyJsPlugin()]
  },
  devServer: {
    port: 8080,
    open: true,
    proxy: {
      "/api/*": {
        target: "http://localhost:5000",
        secure: false,
        changeOrigin: true
      },
      "/auth/*": {
        target: "http://localhost:5000",
        secure: false,
        changeOrigin: true
      }
    }
  },
  devtool: "source-map",
  plugins: [
    new CleanWebpackPlugin([outputDirectory]),
    new HtmlWebpackPlugin({template: "./public/index.html", favicon: "./public/favicon.png"}),
    new MiniCssExtractPlugin({filename: "styles.css", chunkFilename: "styleid.css"})
  ]
};
