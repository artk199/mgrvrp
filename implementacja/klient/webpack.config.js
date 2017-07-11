var webpack = require("webpack");
var path = require("path");

module.exports = {
  entry: {
    app: ['webpack/hot/dev-server' ,"./app/app.js"]
  },
  output: {
    path: path.resolve(__dirname, "build2"),
    filename: "bundle.js"
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
