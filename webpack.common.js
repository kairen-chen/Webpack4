const 
    glob = require('glob'),
    path = require("path"),
    CopyPlugin = require("copy-webpack-plugin"),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    { CleanWebpackPlugin } = require("clean-webpack-plugin"),
    MiniCssExtractPlugin = require("mini-css-extract-plugin");

//handle .pug
function generateHtmlPlugins() {
    return glob.sync('./src/**/*.pug').map((sourceItem) => {
        console.log('sourceItem: ', sourceItem)
        let 
            pathSeparate = sourceItem.split('/'),
            fileName = pathSeparate[pathSeparate.length-1],
            pathCombi = "";

            pathSeparate.map((item,index) => {
                if(index !== pathSeparate.length-1 && index > 1){
                    pathCombi += "/" + item
                }
            })
            console.log("result: ",pathCombi,fileName)
            
        return new HtmlWebpackPlugin({
            template: path.join("./", pathCombi, fileName),
            filename: path.join("./", pathCombi, fileName.split(".")[0] + ".html"),
            inject: false,
            minify: {
                sortAttributes: true,
                collapseWhitespace: true,
                collapseBooleanAttributes: true, 
                removeComments: true,
                removeAttributeQuotes: true 
            } 
        })
    });
}

module.exports = {
    context: path.join(__dirname, "./src"),
    entry: {
        bundle: ["./index.js"]
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js"
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
                    "postcss-loader",
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
    watch: true,
    plugins: [
        new CleanWebpackPlugin({
            dry: true
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css"
        }),
        new CopyPlugin({
            patterns: [
                { from: "./assets", to: "assets", force:true},
            ]
        })
    ].concat(generateHtmlPlugins())
}
