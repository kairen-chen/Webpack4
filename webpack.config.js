const
    path = require("path"),
    { merge } = require("webpack-merge"),
    common = require("./webpack.common");

    
module.exports = merge(common, {
    devtool: "inline-source-map",
    devServer: {
        // contentBase: path.join(__dirname, "dist"),
        openPage: 'dist',
        open:true,
        hot: true,
        watchContentBase: true,
        port: 3003,
        overlay: {
            warnings: true,
            errors: true
        }
    }
})


