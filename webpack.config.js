// const path = require("path");
// const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
import path from "path";
import { dirname } from "path";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";
export default {
  // The entry point file described above
  entry: "./app.js",
  // The location of the build folder described above
  output: {
    path: path.resolve(dirname("dist")),
    filename: "bundle.js",
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /(node_modules)/,
      },
    ],
  },
  resolve: {
    fallback: {
      fs: false,
      tls: false,
      net: false,
      path: false,
      zlib: false,
      http: false,
      https: false,
      stream: false,
      crypto: false,
      //   "crypto-browserify": require.resolve("crypto-browserify"),
    },
  },
  plugins: [new NodePolyfillPlugin()],
  // Optional and for development only. This provides the ability to
  // map the built code back to the original source format when debugging.
  devtool: "eval-source-map",
};
