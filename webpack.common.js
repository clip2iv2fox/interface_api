/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = (env) => {
  return {
    module: {
      rules: [
        {
          test: /\.(tsx|ts|jsx)?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                experimentalWatchApi: true,
              },
            },
          ],
        },
        {
          test: /\.(svg|ttf|eot|woff|woff2)$/,
          // only process modules with this loader
          // if they live under a 'fonts' or 'pficon' directory
          include: [
            path.resolve(__dirname, 'node_modules/patternfly/dist/fonts'),
            path.resolve(__dirname, 'node_modules/@patternfly/react-core/dist/styles/assets/fonts'),
            path.resolve(__dirname, 'node_modules/@patternfly/react-core/dist/styles/assets/pficon'),
            path.resolve(__dirname, 'node_modules/@patternfly/patternfly/assets/fonts'),
            path.resolve(__dirname, 'node_modules/@patternfly/patternfly/assets/pficon'),
          ],
          type: 'asset/inline'
        },


        {
          test: /\.(jpg|jpeg|png|gif)$/i,
          include: [
            path.resolve(__dirname, 'src')
          ],
          type: 'asset/resource'
        },

        {
          test: /\.(svg)$/i,
          include: [
            path.resolve(__dirname, 'node_modules/@patternfly/react-styles/css/assets/images')
          ],
          type: 'asset/inline'
        }
      ],
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: "/",
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src', 'index.html'),
      }),
      new CopyPlugin({
        patterns: [{ from: './src/app/images/favicon.ico', to: 'images' }],
      }),
      new CopyPlugin({
        patterns: [{ from: './src/app/images/favicon1.ico', to: 'images' }],
      }),
    ],
    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.jsx'],
      plugins: [
        new TsconfigPathsPlugin({
          configFile: path.resolve(__dirname, './tsconfig.json'),
        }),
      ],
      symlinks: false,
      cacheWithContext: false,
    },
  };
};
