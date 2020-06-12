const rewireAliases = require('react-app-rewire-aliases');
const { paths } = require('react-app-rewired');
const path = require('path');
const { useBabelRc, override, useEslintRc } = require('customize-cra');

/* config-overrides.js */

module.exports = function overrider(config, env) {
   // eslint-disable-next-line react-hooks/rules-of-hooks
   override(useBabelRc(), useEslintRc());
   config = rewireAliases.aliasesOptions({
      '@src': path.resolve(__dirname, `${paths.appSrc}/`),
      '@components': path.resolve(__dirname, `${paths.appSrc}/components/`),
      '@pages': path.resolve(__dirname, `${paths.appSrc}/pages/`),
      '@img': path.resolve(__dirname, `${paths.appSrc}/img/`),
      '@icons': path.resolve(__dirname, `${paths.appSrc}/icons/`),
      '@constantcss': path.resolve(__dirname, `${paths.appSrc}/styles/`),
      '@data': path.resolve(__dirname, `${paths.appSrc}/data/`),
      '@config': path.resolve(__dirname, `${paths.appSrc}/config/`),
      '@store': path.resolve(__dirname, `${paths.appSrc}/store/`),
      '@reducers': path.resolve(__dirname, `${paths.appSrc}/store/reducers/`),
      '@actions': path.resolve(__dirname, `${paths.appSrc}/store/actions/`),
      '@textures': path.resolve(__dirname, `${paths.appSrc}/textures/`)
   })(config, env);
   return config;
};
