const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const urls = ['index', 'signin', 'signup', 'mypage', 'detail', 'mypageEdit', 'register'];
const htmlWebpackPlugins = () =>
  urls.map(
    url =>
      new HtmlWebpackPlugin({
        title: '찾아줄개',
        filename: `${url === 'index' ? '' : 'html/'}${url}.html`,
        template: `src/${url === 'index' ? 'index' : `html/${url}`}.html`,
        chunks: [url === 'index' ? 'main' : url],
      })
  );

module.exports = {
  mode: 'development',
  plugins: [...htmlWebpackPlugins(), new MiniCssExtractPlugin({ filename: 'css/[name].css' })],
  entry: {
    main: ['./src/js/main.js', './src/scss/index.scss'],
    signin: ['./src/js/pages/signIn.js', './src/scss/index.scss'],
    signup: ['./src/js/pages/signUp.js', './src/scss/index.scss'],
    mypage: ['./src/js/pages/mypage.js', './src/scss/index.scss'],
    detail: ['./src/js/pages/detail.js', './src/scss/index.scss'],
    mypageEdit: ['./src/js/pages/mypageEdit.js', './src/scss/index.scss'],
    register: ['./src/js/pages/register.js', './src/scss/index.scss'],
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'js/[name].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name][ext]',
        },
      },
      {
        test: /\.html/,
        use: {
          loader: 'html-loader',
        },
        include: [path.resolve(__dirname, 'src')],
      },
      {
        test: /\.s?css/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: true,
                localIdentName: '[local]--[hash:base64:5]',
              },
            },
          },
          'sass-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['postcss-preset-env'],
              },
            },
          },
        ],
        include: [path.resolve(__dirname, 'src/scss')],
      },
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, 'src/js')],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
    ],
  },
  devtool: 'source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    proxy: {
      '/': 'http://localhost:9000',
    },
    open: true,
    port: 'auto',
  },
};
