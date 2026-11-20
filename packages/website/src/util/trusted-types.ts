import { setTrustedTypesPolicy } from 'maplibre-gl';

if (window.trustedTypes) {
  // temporary hack for mantine:
  // (https://github.com/mantinedev/mantine/issues/9451)
  window.trustedTypes.createPolicy('default', {
    createHTML: (html) => {
      if (html.includes('<')) {
        throw new Error('unsafe HTML was blocked', { cause: html });
      }
      return html;
    },
  });

  // blindly trust maplibre:
  setTrustedTypesPolicy(
    window.trustedTypes.createPolicy('maplibre', {
      createHTML: (html) => html,
      createScriptURL: (url) => url,
    }),
  );
}
