import config from 'eslint-config-kyle';

export { default } from 'eslint-config-kyle';

config.push({
  files: ['packages/navmark-renderer/**/*'],
  rules: {
    '@eslint-react/no-missing-key': 'off', // safe bc this folder uses jsx-to-xml, not react
  },
});
