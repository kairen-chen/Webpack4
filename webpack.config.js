const
    path = require("path"),
    { merge } = require("webpack-merge"),
    common = require("./webpack.common");

    
module.exports = merge(common, {
    devtool: "inline-source-map",
    devServer: {
        openPage: 'incrte/',
        open:true,
        port: 3003,
        overlay: {
            warnings: true,
            errors: true
        }
    }
})


