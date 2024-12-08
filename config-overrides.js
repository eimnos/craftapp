const { override, addWebpackResolve } = require('customize-cra');

module.exports = override(
  addWebpackResolve({
    fallback: {
      querystring: require.resolve("querystring-es3"),
      crypto: require.resolve("crypto-browserify"),
      url: require.resolve("url")  // Aggiungi url
    },
  })
);