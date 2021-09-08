const webpack = require('webpack');
const { InjectManifest } = require("workbox-webpack-plugin");
const path = require("path");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const htmlToGenerate = [
  {
    filename: 'index.html',
    template: './index.html',
  },
  {
    filename: 'bookmark/index.html',
    template: './index.html',
  },
  {
    filename: 'detail/index.html',
    template: './index.html',
  },
]

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  // In dev mode we use ForkTsCheckerWebpackPlugin for type checking, which is faster when re-compiling
  const tsConfigOptions = isProduction ? {} : {
    transpileOnly: true,
    experimentalWatchApi: true,
  }

  return {
    entry: './src/index.tsx',
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'postcss-loader',
          ]
        },
        // Loader for TypeScript files in ./src
        {
          test: /\.tsx?$/,
          include: path.resolve(__dirname, './src'),
          exclude: [/node_modules/],
          use: [
            {
              loader: 'babel-loader',
              options: { babelrc: true },
            },
            {
              loader: 'ts-loader',
              options: {
                ...tsConfigOptions,
                configFile: path.resolve(__dirname, './src/tsconfig.json'),
              }
            },
          ]
        },
        // Loader for service-worker TypeScript files
        {
          test: /\.tsx?$/,
          include: path.resolve(__dirname, './service-worker'),
          exclude: [/node_modules/],
          use: [
            {
              loader: 'babel-loader',
              options: { babelrc: true },
            },
            {
              loader: 'ts-loader',
              options: {
                ...tsConfigOptions,
                configFile: path.resolve(__dirname, './service-worker/tsconfig.json'),
              },
            },
          ]
        },
      ],
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ],
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      publicPath: '/',
    },
    plugins: [
      ...htmlToGenerate.map(config => new HtmlWebpackPlugin(config)),

      new CopyWebpackPlugin({
        patterns: [
          { from: path.resolve(__dirname, './public') },
        ],
      }),

      new webpack.HotModuleReplacementPlugin(),
      ...(isProduction ? [
        new MiniCssExtractPlugin({
          filename: '[name].[contenthash].css',
        }), 
        new InjectManifest({
          swSrc: path.resolve(__dirname, './service-worker/serviceWorkerWorkbox.ts'),
          swDest: 'service-worker.js',
        })
     ] : [
        new ForkTsCheckerWebpackPlugin({
          tsconfig: path.resolve(__dirname, './src/tsconfig.json'),
        }),
      ]),
    ],
    devServer: {
      port: 3000,
      open: true,
      inline: true,
      compress: false,
      hot: true,
    },
  };
};
