module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Modify CSS loaders to handle Polaris styles
      const modifyLoaders = (loader) => {
        if (loader.options && loader.options.plugins) {
          loader.options.plugins = loader.options.plugins.map(plugin => {
            // Find postcss-calc plugin
            if (plugin && plugin[0] && plugin[0].postcssPlugin === 'postcss-calc') {
              console.log('Found postcss-calc plugin, configuring...');
              return [
                plugin[0],
                {
                  ...plugin[1],
                  warnWhenCannotResolve: false,
                  preserve: true,
                }
              ];
            }
            return plugin;
          });
        }
        return loader;
      };

      // Process all CSS loaders
      webpackConfig.module.rules.forEach(rule => {
        if (rule.oneOf) {
          rule.oneOf.forEach(loader => {
            if (loader.test && loader.test.toString().includes('css')) {
              if (loader.use) {
                // Handle array of loaders
                if (Array.isArray(loader.use)) {
                  loader.use = loader.use.map(modifyLoaders);
                } else {
                  // Handle single loader
                  loader.use = modifyLoaders(loader.use);
                }
              }
            }
          });
        }
      });

      return webpackConfig;
    },
  },
};
