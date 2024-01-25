// webpack.config.js
module.exports = {
    resolve: {
        fallback: {
            "path": require.resolve("path-browserify"),
            "os": require.resolve("os-browserify/browser"),
            "crypto": require.resolve("crypto-browserify")
            // Các core module khác nếu cần thiết
        }
    }
};
