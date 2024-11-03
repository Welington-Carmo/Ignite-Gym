module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@assets': './src/assets',
            '@components': './src/components',
            '@screens': './src/screens',
            '@storage': './src/storage',
            '@theme': './src/theme',
            '@utils': './src/utils',
            '@routes': './src/routes',
            '@services': './src/services',
            '@contexts': './src/contexts',
            '@hooks': './src/hooks',
            '@dtos': './src/dtos'
          },
        },
      ],
    ],
  };
};
