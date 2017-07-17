var webpack = require("webpack");
var path = require("path");

module.exports = {
  entry: {
    app: ['webpack/hot/dev-server' ,"./app/app.js"]
  },
  output: {
    filename: "bundle.js"
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
