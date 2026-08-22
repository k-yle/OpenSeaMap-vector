import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import { App } from './App.js';
import { NavmarkPreview } from './pages/NavmarkPreview.js';
import { AppWrapper } from './context/AppContext.js';
import { LayerWrapper } from './context/LayerContext.js';
import './util/shut-up.js';
import 'maplibre-gl/dist/maplibre-gl.css';
import '@mantine/core/styles.css';
import './index.css';

// we don't use a router, because this app only has a single page,
// and this one special debug page.
const isPreviewPage =
  new URLSearchParams(window.location.search).get('page') === 'navmark-preview';

const theme = createTheme({});

const root = createRoot(document.querySelector('main')!);
root.render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <AppWrapper>
        <LayerWrapper>
          {isPreviewPage ? <NavmarkPreview /> : <App />}
        </LayerWrapper>
      </AppWrapper>
    </MantineProvider>
  </StrictMode>,
);
