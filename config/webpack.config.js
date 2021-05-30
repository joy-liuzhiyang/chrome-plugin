"use strict";

const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const autoprefixer = require("autoprefixer");

const miniCssPlugin = new MiniCssExtractPlugin({
  filename: "css/[name].css",
});

const getClientEnvironment = require("./env.js");
const paths = require("./paths.js");

const publicPath = "/";

const publicUrl = "";

const env = getClientEnvironment(publicUrl);

const outputObj = {
  background: "js/background-script/[name].js",
  content: "js/content-script/[name].js",
  popup: "js/popup-script/[name].js",
  injectIhr: "js/content-script/inject.js",
  recruitJs: "js/content-script/recruit.js",
  autoFillAccountJs: "js/content-script/fillAccount.js",
};

module.exports = {
  mode: "production",
  // devtool: 'none',
  entry: {
    background: paths.appBackGroundJs,
    content: paths.appContentJs,
    popup: paths.appPopupJs,
    injectIhr: paths.injectIhrJS,
    recruitJs: paths.recruitJs,
    autoFillAccountJs: paths.autoFillAccountJs,
  },
  output: {
    // pathinfo: true,
    filename: (pathData) => {
      return outputObj[pathData.chunk.name] || "[name].js";
    },
    publicPath: publicPath,
  },
  resolve: {
    modules: ["node_modules", paths.appNodeModules].concat(
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
    extensions: [
      ".ts",
      ".tsx",
      ".json",
      ".jsx",
      ".web.tsx",
      ".web.js",
      ".js",
      ".mjs",
      ".web.ts",
      ".web.jsx",
    ],
    alias: {
      "react-native": "react-native-web",
    },
    // plugins: [new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson])],
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve("url-loader"),
            options: {
              limit: 10000,
              name: "static/assets/img/[name].[ext]",
              publicPath: "/",
            },
          },
          {
            test: /\.(js|jsx|mjs)$/,
            include: paths.appSrc,
            loader: require.resolve("babel-loader"),
            options: {
              cacheDirectory: true,
              presets: ["@babel/preset-react"],
              babelrc: true,
              babelrcRoots: [".", "./packages/*"],
              plugins: ["@babel/plugin-syntax-dynamic-import"],
            },
          },
          {
            test: /\.(css|less)$/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: require.resolve("css-loader"),
                options: {
                  importLoaders: 1,
                },
              },
              {
                loader: "postcss-loader",
                options: {
                  postcssOptions: {
                    plugins: [
                      [
                        "autoprefixer",
                        {
                          // Options
                        },
                      ],
                    ],
                  },
                },
              },
              {
                loader: require.resolve("less-loader"),
                options: {
                  javascriptEnabled: true,
                  modifyVars: {
                    "primary-color": "#19AA8D",
                  },
                },
              },
            ],
          },

          {
            test: /\.(ts|tsx)$/,
            use: [
              {
                loader: "babel-loader",
                options: {
                  cacheDirectory: true,
                  presets: [
                    "@babel/preset-react",
                    [
                      "@babel/preset-env",
                      {
                        modules: false,
                      },
                    ],
                  ],
                  babelrc: true,
                  babelrcRoots: [".", "./packages/*"],
                  plugins: ["@babel/plugin-syntax-dynamic-import"],
                  // babelOptions: {
                  //     babelrc: true,
                  // },
                },
              },
              {
                loader: "thread-loader",
                options: {
                  workers: require("os").cpus().length - 1,
                },
              },
              {
                loader: "ts-loader",
                options: {
                  happyPackMode: true,
                  transpileOnly: true,
                },
              },
            ],
          },
        ],
      },
    ],
  },
  plugins: [
    miniCssPlugin,

    new webpack.DefinePlugin(env.stringified),

    new webpack.ProvidePlugin({
      $: "jquery",
    }),
  ],
  performance: {
    hints: false,
  },
  optimization: {
    minimize: true,
    usedExports: true,
    sideEffects: true,
    // splitChunks: {
    //     chunks: (chunk) => {
    //         return chunk.name === 'recruitJs';
    //     }
    // },
    // moduleIds: 'named',
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
          compress: {
            // drop_console: true,
            // drop_debugger: true
          },
        },
        extractComments: false,
      }),
    ],
  },
};
