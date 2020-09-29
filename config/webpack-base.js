// Ensure environment variables are read
require('dotenv').config();
const path = require('path');
const webpack = require('webpack');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssNormalize = require('postcss-normalize');
const postcssFlexbugsFixes = require('postcss-flexbugs-fixes');
const postcssPresetEnv = require('postcss-preset-env');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function getWebpackConfig(webpackEnvironment) {
  const isEnvironmentDevelopment = webpackEnvironment === 'development';
  const isEnvironmentProduction = webpackEnvironment === 'production';
  const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

  const config = {
    mode: isEnvironmentProduction ? 'production' : isEnvironmentDevelopment && 'development',
    bail: isEnvironmentProduction,
    devtool: isEnvironmentProduction
      ? shouldUseSourceMap && 'source-map'
      : isEnvironmentDevelopment && 'cheap-module-source-map',
    entry: './src/index.ts',
    output: {
      publicPath: process.env.PUBLIC_PATH,
      path: path.resolve(__dirname, '../dist'),
      filename: isEnvironmentProduction
        ? 'js/extreme.[contenthash:8].js'
        : isEnvironmentDevelopment && 'js/bundle.js',
    },
    optimization: {
      minimize: isEnvironmentProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              // 希望 terser 解析 ecma8 代码。但不应用任何压缩步骤将有效的 ecma5 代码转换为无效的 ecma5 代码
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
          sourceMap: shouldUseSourceMap,
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            parser: safePostCssParser,
            map: shouldUseSourceMap
              ? {
                  // 强制将 sourcemap 输出到单独的文件中
                  inline: false,
                  // 将 sourceMappingURL 附加到 css 文件的末尾，帮助浏览器查找 sourcemap
                  annotation: true,
                }
              : false,
          },
          cssProcessorPluginOptions: {
            preset: ['default', { minifyFontValues: { removeQuotes: false } }],
          },
        }),
      ],
      // 自动拆分 vendor 和 commons
      splitChunks: {
        chunks: 'all',
        name: false,
      },
      // 保持运行时块的分隔，以启用长期缓存
      runtimeChunk: {
        name: (entrypoint) => `runtime-${entrypoint.name}`,
      },
    },
    resolve: {
      extensions: ['.ts', '.js', '.json'],
      alias: {
        '@': path.resolve(__dirname, '../src'),
      },
      plugins: [
        // Adds support for installing with Plug'n'Play, leading to faster installs and adding
        // guards against forgotten dependencies and such.
        PnpWebpackPlugin,
      ],
    },
    resolveLoader: {
      plugins: [
        // Also related to Plug'n'Play, but this time it tells webpack to load its loaders
        // from the current package.
        PnpWebpackPlugin.moduleLoader(module),
      ],
    },
    module: {
      strictExportPresence: true, // 将缺失的导出提示成错误而不是警告
      rules: [
        { parser: { requireEnsure: false } },
        {
          test: /\.s?css$/,
          use: [
            isEnvironmentDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  // Necessary for external CSS imports to work
                  // https://github.com/facebook/create-react-app/issues/2677
                  ident: 'postcss',
                  plugins: () => [
                    postcssFlexbugsFixes,
                    postcssPresetEnv({
                      autoprefixer: {
                        flexbox: 'no-2009',
                      },
                      stage: 3,
                    }),
                    postcssNormalize(),
                  ],
                  sourceMap: isEnvironmentProduction
                    ? shouldUseSourceMap
                    : isEnvironmentDevelopment,
                },
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.(js|mjs|ts)$/,
          use: [
            'babel-loader',
            {
              loader: 'eslint-loader',
              options: {
                cache: true,
              },
            },
          ],
          include: path.resolve(__dirname, '../src'),
        },
      ],
    },
    plugins: [
      new webpack.ProgressPlugin(),
      isEnvironmentProduction && new CleanWebpackPlugin(),
      isEnvironmentProduction &&
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          filename: 'css/extreme.[contenthash:8].min.css',
          chunkFilename: 'css/[name].[contenthash:8].chunk.css',
        }),
      new HtmlWebpackPlugin(),
    ].filter(Boolean),
  };

  return config;
}

module.exports = getWebpackConfig;
