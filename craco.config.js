module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Disable CSS minimization to avoid postcss-calc issues
      if (webpackConfig.optimization && webpackConfig.optimization.minimizer) {
        webpackConfig.optimization.minimizer = webpackConfig.optimization.minimizer.map(
          minimizer => {
            if (minimizer.constructor.name === 'CssMinimizerPlugin') {
              // Remove CssMinimizerPlugin to avoid postcss-calc issues
              return null;
            }
            return minimizer;
          }
        ).filter(Boolean);
      }

      return webpackConfig;
    },
  },
};
