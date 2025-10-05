module.exports = {
  plugins: [
    require('autoprefixer'),
    require('postcss-calc')({
      precision: 2,
      warnWhenCannotResolve: false,
      preserve: true,
    }),
  ],
};
