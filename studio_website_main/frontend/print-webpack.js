const loadConfig = require('next/dist/server/config').default;
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
const path = require('path');

async function main() {
  const dir = path.resolve(__dirname);
  const nextConfig = await loadConfig(PHASE_DEVELOPMENT_SERVER, dir);
  const webpackConfig = {
    module: {
      rules: [
        {
          oneOf: [
            {
              test: /\.module\.css$/,
              use: [{ loader: 'css-loader', options: { modules: {} } }]
            },
            {
              test: /\.css$/,
              use: [{ loader: 'css-loader', options: {} }]
            }
          ]
        }
      ]
    }
  };

  // We want to hook into Next.js's real webpack config generation!
  // To do that, let's look at the next-dev-server or next webpack config creation.
  // Next.js has an internal getWebpackConfig helper:
  const getWebpackConfig = require('next/dist/build/webpack-config').default;
  const config = await getWebpackConfig(dir, {
    config: nextConfig,
    dev: true,
    isServer: false,
    pagesDir: path.join(dir, 'src', 'pages'),
    entrypoints: {},
    runWebpackSpan: { traceChild: () => ({ traceAsyncFn: (fn) => fn() }) }
  });

  const cssRule = config.module.rules.find((rule) => rule.oneOf);
  if (cssRule) {
    cssRule.oneOf.forEach((oneOf, idx) => {
      console.log(`\n--- Rule ${idx} ---`);
      console.log(`test: ${oneOf.test ? oneOf.test.toString() : 'undefined'}`);
      console.log(`issuer: ${oneOf.issuer ? JSON.stringify(oneOf.issuer) : 'undefined'}`);
      if (oneOf.use) {
        const loaders = Array.isArray(oneOf.use) ? oneOf.use : [oneOf.use];
        loaders.forEach((u) => {
          console.log(`  loader: ${u.loader || u}`);
          if (u.options) {
            console.log(`  options: ${JSON.stringify(u.options)}`);
          }
        });
      }
    });
  }
}

main().catch(console.error);
