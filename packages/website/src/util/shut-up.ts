/**
 * There's no way to stop this warning, since we generate
 * images in an async function. And we can't easily patch
 * the library, since the .js entrypoint file is minified
 */
const SPAM =
  'Please make sure you have added the image before it is needed with map.addImage()';

const original = console.warn;
console.warn = (...args: unknown[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes(SPAM) &&
    // these ones are expected to be missing:
    args[0].startsWith('Image "&_burgee_=')
    // all others should still show a warning
  ) {
    return;
  }
  original(...args);
};
