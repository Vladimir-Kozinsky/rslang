const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


module.exports = {
    entry: path.resolve(__dirname, './src/index.ts'),
    module: {
        rules: [
            {
                test: /\.html$/,
                use: 'html-loader'
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(png)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'src/assets/[name][ext]'
                }
            },
            {
                test: /\.(svg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/[name][ext]'
                }
            },
            {
                test: /\.(jpg|jpeg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'src/assets/[name][ext]'
                }
            },
            {
                test: /\.(gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/img/gif/[name][ext]'
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/fonts/[name][ext]'
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    MiniCssExtractPlugin.loader,
                    //"style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },

        ],

    },

    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    devServer: {
        open: true,
        static: {
            directory: './src',
            watch: true
        }
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
    },
    
    devtool: 'source-map',
    plugins: [
        new HtmlWebpackPlugin({ template: './src/index.html' }),
        new MiniCssExtractPlugin(),
        new CopyPlugin({
            patterns: [
                { from: './src/assets/', to: "assets" },
            ],
        }),
        new CleanWebpackPlugin(),
    ],
}