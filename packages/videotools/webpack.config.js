const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    home: './src/renderer/home.ts',
    about: './src/renderer/about.js',
    preload: './src/renderer/preload.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/renderer'),
  },
  target: 'electron-renderer',
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, loader: 'ts-loader', options: {
          configFile: 'tsconfig.renderer.json'
        }
      }
    ]
  }
};
