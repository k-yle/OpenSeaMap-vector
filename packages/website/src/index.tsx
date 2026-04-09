import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.js';
import { NavmarkPreview } from './pages/NavmarkPreview.js';
import './util/shut-up.js';
import 'maplibre-gl/dist/maplibre-gl.css';
import '@mantine/core/styles.css';
import './index.css';

// we don't use a router, because this app only has a single page,
// and this one special debug page.
const isPreviewPage =
  new URLSearchParams(window.location.search).get('page') === 'navmark-preview';

const root = createRoot(document.querySelector('main')!);
root.render(
  <StrictMode>{isPreviewPage ? <NavmarkPreview /> : <App />}</StrictMode>,
);
