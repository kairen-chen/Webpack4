module.exports = {
  plugins: [
    require('autoprefixer')([
      "defaults", 
      "not ie < 11",
      "last 2 versions",
      "> 1%"
    ])
  ]
}