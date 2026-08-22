export const QS = {
  get: () => new URLSearchParams(window.location.hash.slice(1)),

  update: (callback: (qs: URLSearchParams) => void) => {
    const qs = QS.get();
    callback(qs);

    window.location.hash = qs.toString().replaceAll('%2F', '/'); // undo URLSearchParams's annoying behaviour
  },
};
