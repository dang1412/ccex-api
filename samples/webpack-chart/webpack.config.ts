import { join, resolve } from 'path';
import { Configuration } from 'webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';

const config: Configuration = {
  mode: 'development',
  entry: resolve(__dirname, 'src/main.ts'),
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.ts?$/, loader: 'ts-loader' },
    ],
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.js'],
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, 'src/index.html'),
    }),
  ],
  devServer: {
    contentBase: join(__dirname, 'lib'),
    compress: true,
    port: 4200,
  },
};

// tslint:disable-next-line:no-default-export
export default config;
