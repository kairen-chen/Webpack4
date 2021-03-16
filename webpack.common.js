const 
    path = require("path"),
    MiniCssExtractPlugin = require("mini-css-extract-plugin"),
    { CleanWebpackPlugin } = require("clean-webpack-plugin"),
    CopyPlugin = require("copy-webpack-plugin");
    HtmlWebpackPlugin = require('html-webpack-plugin');
var src = path.join(__dirname, 'src');

module.exports = {
    entry: {
        bundle: ["./src/index.js"]
    },
    output: {
        filename: "[name].js?[hash:8]",
        path: path.join(__dirname, "dist"),
        publicPath: "/dist"
    },
    module:{
        rules:[
            {
                test: /\.scss$/,
                use:[
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            url: false
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            implementation: require("dart-sass")
                        }
                    }
                ]
            },
            {
                test: /\.js/,
                exclude: /node_modules/,
                use:{
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/env"]
                    }
                }
            },
            {
                test: /\.(.jpg?g|png|gif|svg|ico|woff|woff2|eot|ttf)$/i,
                use: {
                    loader: "file-loader"
                }
            },
            {
                test: /\.pug$/,
                loader: ['raw-loader', 'pug-html-loader']
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin({
            dry: true
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css"
        }),
        new CopyPlugin({
            patterns: [
                { from: "./src/assets", to: "assets", force:true},
                { from: "./src/page", to:"page"}
            ]
        }),
        new HtmlWebpackPlugin({
            // template: './src/index.pug',
            template: path.join(src, 'index.pug'),
            filename: 'index.html',
            inject: false,
            minify: {
                sortAttributes: true,
                collapseWhitespace: true,
                collapseBooleanAttributes: true, 
                removeComments: true,
                removeAttributeQuotes: true 
              }
        })
    ]
}
    