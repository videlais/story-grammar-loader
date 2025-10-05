import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: './src/index.ts',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    extensionAlias: {
      '.js': ['.js', '.ts']
    }
  },
  output: {
    filename: 'story-grammar-loader.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'StoryGrammarLoader',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  externals: {
    'story-grammar': 'story-grammar'
  }
};