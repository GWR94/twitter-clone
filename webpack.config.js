const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const devMode = process.env.NODE_ENV !== "production";
const outputDirectory = "dist";

module.exports = {
  entry: ["@babel/polyfill", "./src/client/src/app.js"],
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
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"]
          }
        }
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: "file-loader?name=/public/images/[name].[ext]"
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: "file-loader?name=[name].[ext]"
      }
    ]
  },
  optimization: {
    minimizer: [new UglifyJsPlugin()]
  },
  devServer: {
    port: 8080,
    historyApiFallback: true,
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
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      favicon: "./public/favicon.png"
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
};
