// @ts-check

/** @type {import("svgo").Config} */
export default {
  plugins: ['preset-default', 'convertStyleToAttrs'],
};

// svgo --pretty -qrf ./icons --final-newline --config ./icons/svgo.config.js;
