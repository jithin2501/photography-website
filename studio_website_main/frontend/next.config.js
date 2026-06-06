const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  webpack: (config) => {
    const cssRule = config.module.rules.find((rule) => rule.oneOf);
    if (cssRule) {
      cssRule.oneOf.forEach((oneOf) => {
        if (oneOf.test) {
          if (Array.isArray(oneOf.test)) {
            oneOf.test = oneOf.test.map((t) => {
              if (t instanceof RegExp) {
                const src = t.source;
                if (src === '\\.module\\.css$') {
                  return /(?:\.module\.css|src[\\/]styles[\\/](?!globals\.css)[^\\/]+\.css)$/;
                } else if (src === '(?<!\\.module)\\.css$') {
                  return /(?<!\.module|src[\\/]styles[\\/](?!globals\.css)[^\\/]+)\.css$/;
                }
              }
              return t;
            });
          } else if (oneOf.test instanceof RegExp) {
            const src = oneOf.test.source;
            if (src === '\\.module\\.css$') {
              oneOf.test = /(?:\.module\.css|src[\\/]styles[\\/](?!globals\.css)[^\\/]+\.css)$/;
            } else if (src === '(?<!\\.module)\\.css$') {
              oneOf.test = /(?<!\.module|src[\\/]styles[\\/](?!globals\.css)[^\\/]+)\.css$/;
            }
          }
        }
      });
    }
    return config;
  },
};

module.exports = nextConfig;
