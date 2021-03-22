const 
    glob = require('glob'),
    path = require("path"),
    CopyPlugin = require("copy-webpack-plugin"),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    { CleanWebpackPlugin } = require("clean-webpack-plugin"),
    MiniCssExtractPlugin = require("mini-css-extract-plugin");

console.log("環境變數 : ", process.env.NODE_ENV)
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
    // 要被打包的所有檔案root在哪?
    context: path.join(__dirname, "./src"),
    entry: {
        bundle: ["./index.js"]
    },
    output: {
        // path : 很單純,用來存放打包後檔案的輸出目錄,不設定亦可,default -> dist,
        // path: path.join(__dirname, "incrte"),
        filename: "[name].js",
        // publicPath : devServer運作時會把檔案存在記憶體,指定原始檔引用的目錄(只對devServer運作時影響,build後一切正常!!)
        // 這裡會和devServer的openPage有關聯!!
        // ref -> https://codertw.com/%E5%89%8D%E7%AB%AF%E9%96%8B%E7%99%BC/201833/
        publicPath: "/incrte"
    },
    module:{
        rules:[
            {
                test: /\.scss$/,
                use:[
                    // !!注意!! loader的執行順序是由下而上
                    // sass-loader -> postcss-loader -> css-loader
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        /* 
                            csc內的圖片URL是否另外處理,
                                false -> 根據目錄結構讀取
                                true -> 會由webpack額外處理path,導致
                                        無法處理開頭非斜線的url assets/images/agency_bg.jpg,如下錯誤訊息
                                        ModuleNotFoundError: Module not found: Error: Can't resolve './assets/images/agency_bg.jpg' in 'D:\Github\Webpack4\src\scss'
                                        看似會被當作module載入,但找無
                            ref -> https://webpack.js.org/loaders/css-loader/#url
                        */
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
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].css"
        }),
        new CopyPlugin({
            patterns: [
                { from: "./assets", to: "assets", force:true},
            ]
        })
    ].concat(
        generateHtmlPlugins(),
    )
}
