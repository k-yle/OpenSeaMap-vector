/**
 * There's no way to stop this warning, since we generate
 * images in an async function. And we can't easily patch
 * the library, since the .js entrypoint file is minified
 */
const SPAM =
  'You can provide missing images by listening for the "styleimagemissing" map event.';

const original = console.warn;
console.warn = (...args: unknown[]) => {
  if (typeof args[0] === 'string' && args[0].includes(SPAM)) return;
  original(...args);
};
