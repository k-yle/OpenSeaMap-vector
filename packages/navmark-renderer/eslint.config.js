import config from 'eslint-config-kyle';

export { default } from 'eslint-config-kyle';

config.push({
  rules: {
    '@eslint-react/no-missing-key': 'off', // safe bc we're not using react
  },
});
